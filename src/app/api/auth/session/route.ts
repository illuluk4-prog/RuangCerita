import { NextResponse } from "next/server";
import { getAuthContext } from "@/lib/auth/session";

export async function GET() {
  const auth = await getAuthContext();
  if (!auth) return NextResponse.json({ user: null }, { status: 401 });

  return NextResponse.json(
    {
      user: {
        id: auth.profile.id,
        username: auth.profile.username,
        role: auth.profile.role,
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}