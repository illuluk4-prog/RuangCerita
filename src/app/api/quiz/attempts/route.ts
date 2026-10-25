import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthContext } from "@/lib/auth/session";
import { saveLocalQuizAttempt } from "@/lib/local-learning-store";
import { quizSubjects, type QuizLevel, type QuizOptionLabel } from "@/lib/quizData";

export const runtime = "nodejs";

const quizAttemptSchema = z.object({
  submissionId: z.string().uuid(),
  subject: z.enum(quizSubjects),
  level: z.number().int().min(1).max(3),
  answers: z.array(z.enum(["A", "B", "C", "D"])).length(5),
});

export async function POST(request: Request) {
  const auth = await getAuthContext();
  if (!auth) return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
  if (auth.profile.role !== "siswa") {
    return NextResponse.json({ error: "Hanya siswa yang dapat mengirim hasil kuis." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Format hasil kuis tidak valid." }, { status: 400 });
  }

  const parsed = quizAttemptSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Jawab seluruh soal sebelum menyimpan hasil kuis." }, { status: 400 });
  }

  const attempt = await saveLocalQuizAttempt({
    submissionId: parsed.data.submissionId,
    username: auth.profile.username,
    subject: parsed.data.subject,
    level: parsed.data.level as QuizLevel,
    answers: parsed.data.answers as QuizOptionLabel[],
  });
  if (!attempt) {
    return NextResponse.json({ error: "Bank soal kuis tidak lengkap." }, { status: 500 });
  }

  return NextResponse.json({ attempt }, { headers: { "Cache-Control": "no-store" } });
}