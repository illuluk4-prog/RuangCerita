import { NextResponse } from "next/server";
import { localSessionCookie } from "@/lib/auth/local-session";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(localSessionCookie, "", {
    expires: new Date(0),
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });
  return response;
}