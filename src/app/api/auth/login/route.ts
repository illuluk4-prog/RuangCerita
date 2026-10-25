import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createLocalSessionToken,
  localSessionCookie,
  localSessionMaxAge,
} from "@/lib/auth/local-session";
import { findPresetAccount } from "@/lib/studentsData";

export const runtime = "nodejs";

const loginSchema = z.object({
  username: z.string().trim().min(3).max(32).regex(/^[a-zA-Z0-9_-]+$/),
  password: z.string().min(1).max(128),
});

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Akun preset hanya tersedia untuk development lokal." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Format login tidak valid." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Masukkan username dan password yang valid." }, { status: 400 });
  }

  const account = findPresetAccount(parsed.data.username);
  const submittedPasswordHash = createHash("sha256").update(parsed.data.password).digest();
  const expectedPasswordHash = createHash("sha256").update(account?.password ?? "invalid").digest();
  const passwordMatches = timingSafeEqual(submittedPasswordHash, expectedPasswordHash);

  if (!account || !passwordMatches) {
    return NextResponse.json({ error: "Username atau password salah." }, { status: 401 });
  }

  const response = NextResponse.json(
    { user: { id: account.username, username: account.username, role: account.role } },
    { headers: { "Cache-Control": "no-store" } },
  );
  response.cookies.set(localSessionCookie, await createLocalSessionToken(account.username, account.role), {
    httpOnly: true,
    maxAge: localSessionMaxAge,
    path: "/",
    sameSite: "lax",
    secure: false,
  });
  return response;
}