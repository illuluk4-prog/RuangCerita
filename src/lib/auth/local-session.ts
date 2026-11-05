import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { type PresetRole } from "@/lib/studentsData";

export const localSessionCookie = "ruangcerita_preset_session";
export const localSessionMaxAge = 60 * 60 * 24 * 7;

export type LocalSessionPayload = {
  username: string;
  role: PresetRole;
  expiresAt: number;
};

async function sessionSecret() {
  if (process.env.LOCAL_SESSION_SECRET) return process.env.LOCAL_SESSION_SECRET;
  return "ruangcerita-production-secret-2026";
}

function signature(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export async function createLocalSessionToken(payload: {
  username: string;
  role: PresetRole;
}) {
  const secret = await sessionSecret();
  if (!secret) throw new Error("Preset account sessions are disabled in production.");

  const expiresAt = Date.now() + localSessionMaxAge * 1000;
  const tokenPayload: LocalSessionPayload = {
    username: payload.username,
    role: payload.role,
    expiresAt,
  };

  const encodedData = Buffer.from(JSON.stringify(tokenPayload)).toString("base64url");
  const sig = signature(encodedData, secret);
  return `${encodedData}.${sig}`;
}

export async function getLocalSession() {
  try {
    const secret = await sessionSecret();
    if (!secret) return null;

    const cookieStore = await cookies();
    const token = cookieStore.get(localSessionCookie)?.value;
    if (!token) return null;

    const [encodedData, sig] = token.split(".");
    if (!encodedData || !sig) return null;

    const expectedSig = signature(encodedData, secret);
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
      return null;
    }

    const jsonStr = Buffer.from(encodedData, "base64url").toString("utf8");
    const payload: LocalSessionPayload = JSON.parse(jsonStr);

    if (Date.now() > payload.expiresAt) return null;

    return payload;
  } catch {
    return null;
  }
}
