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
) {
  return "";
}

export async function getLocalSession() {
  return null;
}
