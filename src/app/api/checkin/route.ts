import { google } from "@ai-sdk/google";
import { generateText, Output } from "ai";
import { NextResponse } from "next/server";
import {
  aiAnalysisSchema,
  checkinRequestSchema,
  type AIAnalysis,
} from "@/lib/ai/schemas";
import { checkinSystemPrompt, createCheckinPrompt } from "@/lib/ai/prompts";
import { getAuthContext } from "@/lib/auth/session";
import {
  getStudentCheckinCalendar,
  saveLocalCheckin,
} from "@/lib/local-learning-store";

export const runtime = "nodejs";

export async function GET() {
  const auth = await getAuthContext();
  if (!auth) return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
  if (auth.profile.role !== "siswa") {
    return NextResponse.json({ error: "Kalender check-in hanya tersedia untuk siswa." }, { status: 403 });
  }

  const calendar = await getStudentCheckinCalendar(auth.profile.username);
  return NextResponse.json({ calendar }, { headers: { "Cache-Control": "no-store" } });
}

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

  const auth = await getAuthContext();
  if (!auth) {
    return NextResponse.json(
      { error: "Silakan masuk ke akun siswa sebelum mengirim check-in." },
      { status: 401 },
    );
  }
  if (auth.profile.role !== "siswa") {
    return NextResponse.json({ error: "Check-in hanya tersedia untuk siswa." }, { status: 403 });
  }

  const currentCalendar = await getStudentCheckinCalendar(auth.profile.username);
  if (currentCalendar.hasCheckedInToday) {
    return NextResponse.json(
      { error: "Kamu sudah check-in hari ini.", calendar: currentCalendar },
      { status: 409 },
    );
  }

  const checkin = parsed.data;
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
      analysis = demoRulesAnalysis(checkin);
      analysisSource = "demo_rules";
    }
  }

  const savedCheckin = await saveLocalCheckin({
    username: auth.profile.username,
    mood_score: checkin.mood_score,
    energy_level: checkin.energy_level,
    focus_level: checkin.focus_level,
    workload_level: checkin.workload_level,
    factors: checkin.factors,
    desired_support: checkin.desired_support,
    reflection_text: checkin.reflection_text || null,
    analysis,
    analysis_source: analysisSource,
  });

  if (!savedCheckin.created) {
    return NextResponse.json(
      {
        error: "Kamu sudah check-in hari ini.",
        calendar: await getStudentCheckinCalendar(auth.profile.username),
      },
      { status: 409 },
    );
  }

  return NextResponse.json({
    checkin_id: savedCheckin.checkin.id,
    checkin_date: savedCheckin.checkin.checkin_date,
    day_of_week: savedCheckin.checkin.day_of_week,
    calendar: await getStudentCheckinCalendar(auth.profile.username),
    analysis,
    analysis_source: analysisSource,
    routing: "not_configured",
    persistence_status: "saved",
  });
}