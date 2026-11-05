import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, username, password } = body;
    const loginIdentifier = email || username;

    if (!loginIdentifier || !password) {
      return NextResponse.json(
        { error: "Username/Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: "Konfigurasi Supabase belum terpasang di Vercel." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Menerima input jika pengguna memasukkan username atau email
    let targetEmail = loginIdentifier;
    if (!loginIdentifier.includes("@")) {
      targetEmail = `${loginIdentifier}@ruangcerita.com`;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: targetEmail,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({
      message: "Login berhasil",
      user: data.user,
      session: data.session,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan server.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
