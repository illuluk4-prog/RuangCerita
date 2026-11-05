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
  username: z.string().trim().min(3).max(32).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(1).max(128),
});

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Format permintaan tidak valid." },
        { status: 400 }
      );
    }

    const parseResult = loginSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Masukkan username dan password yang valid." },
        { status: 400 }
      );
    }

    const { username, password } = parseResult.data;
    const preset = findPresetAccount(username);

    if (!preset || preset.password !== password) {
      return NextResponse.json(
        { error: "Username atau password salah." },
        { status: 401 }
      );
    }

    const token = await createLocalSessionToken({
      username: preset.username,
      role: preset.role,
    });

    const response = NextResponse.json({
      success: true,
      user: { username: preset.username, role: preset.role },
    });

    response.cookies.set(localSessionCookie, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: localSessionMaxAge,
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("Login API Error:", err);
    return NextResponse.json(
      { error: err?.message || "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
