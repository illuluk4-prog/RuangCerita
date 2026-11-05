import { cookies } from "next/headers";
import type { PresetRole } from "@/lib/studentsData";

export const localSessionCookie = "ruangcerita_preset_session";
export const localSessionMaxAge = 60 * 60 * 24 * 7;

export type LocalSessionPayload = {
  username: string;
  role: PresetRole;
  expiresAt: number;
};

export async function createLocalSessionToken(
  param1: string | { username: string; role: PresetRole },
  param2?: PresetRole
): Promise<string> {
  let username = "siswa";
  let role: PresetRole = "siswa";

  if (typeof param1 === "object" && param1 !== null) {
    username = param1.username;
    role = param1.role;
  } else if (typeof param1 === "string") {
    username = param1;
    if (param2) role = param2;
  }

  const expiresAt = Date.now() + localSessionMaxAge * 1000;
  const data: LocalSessionPayload = { username, role, expiresAt };
  return Buffer.from(JSON.stringify(data)).toString("base64url");
}

export async function getLocalSession(): Promise<LocalSessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(localSessionCookie)?.value;
    if (!token) return null;

    const jsonStr = Buffer.from(token, "base64url").toString("utf8");
    const payload: LocalSessionPayload = JSON.parse(jsonStr);

    if (Date.now() > payload.expiresAt) return null;
    return payload;
  } catch {
    return null;
  }
}
