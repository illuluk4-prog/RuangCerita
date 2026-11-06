import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createLocalSessionToken,
  localSessionCookie,
  localSessionMaxAge,
} from "@/lib/auth/local-session";
import { findPresetAccount } from "@/lib/studentsData";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const loginSchema = z.object({
  username: z.string().trim().min(3).max(32).regex(/^[a-zA-Z0-9_-]+$/),
  password: z.string().min(1).max(128),
});

export async function POST(request: Request) {
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

  if (process.env.NODE_ENV === "production") {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return NextResponse.json({ error: "Login belum dikonfigurasi. Hubungi pengelola aplikasi." }, { status: 503 });
    }

    const admin = createAdminClient();
    const { data: email, error: lookupError } = await admin.rpc(
      "get_auth_email_by_username",
      { p_username: parsed.data.username },
    );
    if (lookupError) {
      console.error("Supabase username lookup failed:", lookupError.message);
      return NextResponse.json({ error: "Login sedang tidak tersedia. Coba lagi nanti." }, { status: 503 });
    }
    if (typeof email !== "string" || !email) {
      return NextResponse.json({ error: "Username atau password salah." }, { status: 401 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: parsed.data.password,
    });
    if (error) {
      if (error.status && error.status >= 500) {
        console.error("Supabase sign-in failed:", error.message);
        return NextResponse.json({ error: "Login sedang tidak tersedia. Coba lagi nanti." }, { status: 503 });
      }
      return NextResponse.json({ error: "Username atau password salah." }, { status: 401 });
    }
    if (!data.user) {
      return NextResponse.json({ error: "Username atau password salah." }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, username, role")
      .eq("id", data.user.id)
      .single();
    if (profileError) {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) console.error("Supabase sign-out after profile failure failed:", signOutError.message);
      console.error("Supabase profile lookup failed:", profileError.message);
      return NextResponse.json({ error: "Profil akun belum siap. Hubungi pengelola aplikasi." }, { status: 503 });
    }
    if (profile.role !== "siswa" && profile.role !== "guru") {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) console.error("Supabase sign-out after invalid role failed:", signOutError.message);
      return NextResponse.json({ error: "Role akun tidak valid. Hubungi pengelola aplikasi." }, { status: 403 });
    }

    return NextResponse.json(
      { user: { id: profile.id, username: profile.username, role: profile.role } },
      { headers: { "Cache-Control": "no-store" } },
    );
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