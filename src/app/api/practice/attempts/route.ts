import { NextResponse } from "next/server";
import { z } from "zod";
import { getAuthContext } from "@/lib/auth/session";
import { submitLocalPracticeAttempt } from "@/lib/local-learning-store";

export const runtime = "nodejs";

const attemptSchema = z.object({
  questionId: z.string().uuid(),
  selectedOption: z.number().int().min(0).max(5),
});

export async function POST(request: Request) {
  const auth = await getAuthContext();
  if (!auth) return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
  if (auth.profile.role !== "siswa") {
    return NextResponse.json({ error: "Hanya siswa yang dapat mengerjakan latihan." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Format jawaban tidak valid." }, { status: 400 });
  }

  const parsed = attemptSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Pilih jawaban yang tersedia." }, { status: 400 });

  const result = await submitLocalPracticeAttempt({
    questionId: parsed.data.questionId,
    username: auth.profile.username,
    selectedOption: parsed.data.selectedOption,
  });

  if (!result) {
    return NextResponse.json({ error: "Soal tidak ditemukan atau pilihan jawaban tidak valid." }, { status: 404 });
  }

  return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
}