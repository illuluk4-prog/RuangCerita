import { cookies } from "next/headers";
import type { PresetRole } from "@/lib/studentsData";

export const localSessionCookie = "ruangcerita_preset_session";
export const localSessionMaxAge = 60 * 60 * 24 * 7;

export type LocalSessionPayload = {
  username: string;
  role: PresetRole;
  expiresAt: number;
};

export async function createLocalSessionToken() {
  throw new Error("Local preset sessions are disabled. Please use Supabase authentication.");
}

export async function getLocalSession() {
  return null;
}
