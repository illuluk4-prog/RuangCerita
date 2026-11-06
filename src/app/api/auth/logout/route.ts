import { NextResponse } from "next/server";
import { localSessionCookie } from "@/lib/auth/local-session";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
      return NextResponse.json({ error: "Autentikasi belum dikonfigurasi di server." }, { status: 503 });
    }
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Supabase sign-out failed:", error.message);
      return NextResponse.json({ error: "Tidak dapat keluar dari akun." }, { status: 503 });
    }
    return NextResponse.json({ success: true });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(localSessionCookie, "", {
    expires: new Date(0),
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });
  return response;
}