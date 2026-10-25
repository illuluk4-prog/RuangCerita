import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthContext } from "@/lib/auth/session";
import {
  createLocalPracticeQuestion,
  getStudentPracticeQuestions,
} from "@/lib/local-learning-store";

export const runtime = "nodejs";

const createQuestionSchema = z.object({
  title: z.string().trim().min(3).max(140),
  prompt: z.string().trim().min(5).max(2_000),
  options: z.array(z.string().trim().min(1).max(300)).min(2).max(6),
  correctOption: z.number().int().min(0).max(5),
});

export async function GET() {
  const auth = await getAuthContext();
  if (!auth) return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
  if (auth.profile.role !== "siswa") {
    return NextResponse.json({ error: "Latihan ini hanya tersedia untuk siswa." }, { status: 403 });
  }

  const questions = await getStudentPracticeQuestions();
  return NextResponse.json({ questions }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const auth = await getAuthContext();
  if (!auth) return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
  if (auth.profile.role !== "guru") {
    return NextResponse.json({ error: "Hanya guru yang dapat membuat soal." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Format soal tidak valid." }, { status: 400 });
  }

  const parsed = createQuestionSchema.safeParse(body);
  if (!parsed.success || (parsed.data && parsed.data.correctOption >= parsed.data.options.length)) {
    return NextResponse.json({ error: "Periksa judul, pertanyaan, pilihan, dan kunci jawaban." }, { status: 400 });
  }

  const question = await createLocalPracticeQuestion({
    title: parsed.data.title,
    prompt: parsed.data.prompt,
    options: parsed.data.options,
    correctOption: parsed.data.correctOption,
  });

  return NextResponse.json({ question_id: question.id }, { status: 201 });
}