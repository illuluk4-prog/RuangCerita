import { createHmac } from "node:crypto";
import { cookies } from "next/headers";
import { PresetRole } from "@/lib/studentsData";

export const localSessionCookie = "ruangcerita_preset_session";
export const localSessionMaxAge = 60 * 60 * 24 * 7; // 7 hari

export type LocalSessionPayload = {
  username: string;
  role: PresetRole;
  expiresAt: number;
};

const SECRET_KEY = process.env.LOCAL_SESSION_SECRET || "ruangcerita-production-secret-2026";

function signature(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export async function createLocalSessionToken(
  param1: string | { username: string; role: PresetRole },
  param2?: PresetRole
) {
  let username: string;
  let role: PresetRole;

  if (typeof param1 === "object" && param1 !== null) {
    username = param1.username;
    role = param1.role;
  } else {
    username = param1;
    role = param2 || "siswa";
  }

  const expiresAt = Date.now() + localSessionMaxAge * 1000;
  const data: LocalSessionPayload = { username, role, expiresAt };
  const encodedData = Buffer.from(JSON.stringify(data)).toString("base64url");
  const sig = signature(encodedData, SECRET_KEY);
  return `${encodedData}.${sig}`;
}

export async function getLocalSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(localSessionCookie)?.value;
    if (!token) return null;

    const [encodedData, sig] = token.split(".");
    if (!encodedData || !sig) return null;

    const expectedSig = signature(encodedData, SECRET_KEY);
    if (sig !== expectedSig) return null;

    const jsonStr = Buffer.from(encodedData, "base64url").toString("utf8");
    const payload: LocalSessionPayload = JSON.parse(jsonStr);

    if (Date.now() > payload.expiresAt) return null;

    return payload;
  } catch {
    return null;
  }
}
