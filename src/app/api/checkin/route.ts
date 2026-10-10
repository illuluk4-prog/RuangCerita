import { google } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import {
  aiAnalysisSchema,
  checkinRequestSchema,
  type AIAnalysis,
} from "@/lib/ai/schemas";
import { checkinSystemPrompt, createCheckinPrompt } from "@/lib/ai/prompts";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const demoStudentId = "student_demo";
const urgentSafetyPattern =
  /bunuh diri|mengakhiri hidup|ingin mati|menyakiti diri|melukai diri|tidak ingin hidup|suicide|kill myself|hurt myself|end my life/i;

function urgentSafetyAnalysis(): AIAnalysis {
  return {
    need_category: "human_support",
    priority: "urgent",
    recommended_action: "human_support",
    human_support_needed: true,
    safety_flag: true,
    ai_summary:
      "Check-in ini perlu ditindaklanjuti segera oleh pendamping manusia yang berwenang.",
  };
}

function demoRulesAnalysis(
  checkin: ReturnType<typeof checkinRequestSchema.parse>,
): AIAnalysis {
  if (urgentSafetyPattern.test(checkin.reflection_text)) {
    return urgentSafetyAnalysis();
  }

  const action =
    checkin.desired_support === "not_sure"
      ? checkin.workload_level >= 4 || checkin.energy_level <= 2
        ? "study_planner"
        : checkin.focus_level <= 2
          ? "ai_tutor"
          : "flashcards"
      : checkin.desired_support;
  const needsHumanSupport = action === "human_support";
  const needsMoreSupport =
    checkin.workload_level >= 4 ||
    checkin.energy_level <= 2 ||
    checkin.focus_level <= 2;

  return {
    need_category: needsHumanSupport
      ? "human_support"
      : action === "study_planner"
        ? "study_planning"
        : "subject_help",
    priority:
      checkin.workload_level === 5 &&
      checkin.energy_level <= 2 &&
      checkin.focus_level <= 2
        ? "high"
        : needsMoreSupport
          ? "medium"
          : "low",
    recommended_action: action,
    human_support_needed: needsHumanSupport,
    safety_flag: false,
    ai_summary: needsHumanSupport
      ? "Saran demo: pertimbangkan berbicara dengan guru, wali, atau pendamping yang kamu percaya."
      : action === "study_planner"
        ? "Saran demo: pilih satu tugas utama dan pecah menjadi sesi belajar singkat dengan jeda."
        : action === "ai_tutor"
          ? "Saran demo: pilih satu materi yang terasa sulit dan bahas satu pertanyaan pada satu waktu."
          : "Saran demo: ulangi satu topik menggunakan flashcard dalam sesi singkat.",
  };
}

function enforceSafetyRouting(analysis: AIAnalysis): AIAnalysis {
  if (!analysis.safety_flag) return analysis;

  return {
    ...analysis,
    need_category: "human_support",
    priority: "urgent",
    recommended_action: "human_support",
    human_support_needed: true,
  };
}

async function routeAutomation(payload: {
  checkin_id: string;
  analysis_id: string;
  student_id: string;
  safety_flag: boolean;
  priority: AIAnalysis["priority"];
  human_support_needed: boolean;
  recommended_action: AIAnalysis["recommended_action"];
}): Promise<"sent" | "not_configured" | "failed"> {
  const webhookUrl = process.env.N8N_CHECKIN_WEBHOOK_URL;
  if (!webhookUrl) return "not_configured";

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5_000),
      cache: "no-store",
    });

    return response.ok ? "sent" : "failed";
  } catch {
    return "failed";
  }
}

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") ?? 0) > 16_000) {
    return NextResponse.json(
      { error: "Ukuran check-in terlalu besar." },
      { status: 413 },
    );
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Format JSON tidak valid." }, { status: 400 });
  }

  const parsed = checkinRequestSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Periksa kembali isian check-in.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const demoMode =
    process.env.CHECKIN_DEMO_MODE === "true" && process.env.NODE_ENV !== "production";

  let supabase: Awaited<ReturnType<typeof createClient>> | null = null;
  let studentId = demoMode ? demoStudentId : "";
  try {
    if (demoMode) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (supabaseUrl && serviceRoleKey) {
        supabase = createSupabaseClient(supabaseUrl, serviceRoleKey, {
          auth: { autoRefreshToken: false, persistSession: false },
        });
      }
    } else {
      supabase = await createClient();

      const { data: userData, error: authError } = await supabase.auth.getUser();
      if (authError || !userData.user) {
        return NextResponse.json(
          { error: "Silakan masuk ke akun siswa sebelum mengirim check-in." },
          { status: 401 },
        );
      }

      studentId = userData.user.id;
    }
  } catch (error) {
    if (!demoMode) {
      return NextResponse.json(
        { error: "Koneksi Supabase belum dikonfigurasi di server." },
        { status: 503 },
      );
    }
    console.warn(
      "Demo check-in will use a non-persistent response",
      error instanceof Error ? error.name : "unknown",
    );
  }

  const checkin = parsed.data;
  let checkinId: string | null = null;
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("daily_checkins")
        .insert({
          student_id: studentId,
          mood_score: checkin.mood_score,
          energy_level: checkin.energy_level,
          focus_level: checkin.focus_level,
          workload_level: checkin.workload_level,
          factors: checkin.factors,
          desired_support: checkin.desired_support,
          reflection_text: checkin.reflection_text || null,
        })
        .select("id")
        .single();

      if (error) {
        console.warn("daily_checkins insert failed", error.code);
      } else {
        checkinId = data.id;
      }
    } catch (error) {
      console.warn(
        "daily_checkins request failed",
        error instanceof Error ? error.name : "unknown",
      );
    }
  }

  if (!demoMode && !checkinId) {
    return NextResponse.json(
      { error: "Check-in belum dapat disimpan. Coba lagi sebentar." },
      { status: 500 },
    );
  }

  let analysis: AIAnalysis;
  let analysisSource: "ai" | "demo_rules" | "safety_rule";
  if (urgentSafetyPattern.test(checkin.reflection_text)) {
    analysis = urgentSafetyAnalysis();
    analysisSource = "safety_rule";
  } else {
    try {
      const result = await generateText({
        model: google("gemini-2.5-flash"),
        system: checkinSystemPrompt,
        prompt: createCheckinPrompt(checkin),
        output: Output.object({ schema: aiAnalysisSchema }),
        abortSignal: AbortSignal.timeout(20_000),
      });

      if (!result.output) throw new Error("Gemini returned no structured output.");
      analysis = enforceSafetyRouting(result.output);
      analysisSource = "ai";
    } catch (error) {
      console.error(
        "Check-in classification failed",
        error instanceof Error ? error.name : "unknown",
      );
      if (!demoMode) {
        return NextResponse.json(
          {
            error:
              "Check-in tersimpan, tetapi saran belajar belum berhasil dibuat. Silakan coba lagi.",
            checkin_id: checkinId,
          },
          { status: 502 },
        );
      }
      analysis = demoRulesAnalysis(checkin);
      analysisSource = "demo_rules";
    }
  }

  let analysisId: string | null = null;
  if (supabase && checkinId) {
    try {
      const { data, error } = await supabase
        .from("ai_analyses")
        .insert({
          checkin_id: checkinId,
          ...analysis,
        })
        .select("id")
        .single();

      if (error) {
        console.warn("ai_analyses insert failed", error.code);
      } else {
        analysisId = data.id;
      }
    } catch (error) {
      console.warn(
        "ai_analyses request failed",
        error instanceof Error ? error.name : "unknown",
      );
    }
  }

  if (!demoMode && checkinId && !analysisId) {
    return NextResponse.json(
      {
        error:
          "Check-in tersimpan, tetapi hasil analisis belum dapat disimpan.",
        checkin_id: checkinId,
      },
      { status: 500 },
    );
  }

  const routing =
    checkinId && analysisId
      ? await routeAutomation({
          checkin_id: checkinId,
          analysis_id: analysisId,
          student_id: studentId,
          safety_flag: analysis.safety_flag,
          priority: analysis.priority,
          human_support_needed: analysis.human_support_needed,
          recommended_action: analysis.recommended_action,
        })
      : "skipped_not_persisted";

  return NextResponse.json({
    checkin_id: checkinId,
    analysis,
    analysis_source: analysisSource,
    routing,
    persistence_status: !checkinId
      ? "demo_only"
      : analysisId
        ? "saved"
        : "partial",
  });
}