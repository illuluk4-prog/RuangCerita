import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { cookies } from "next/headers";
import { findPresetAccount, type PresetRole } from "@/lib/studentsData";

export const localSessionCookie = "ruangcerita_preset_session";
export const localSessionMaxAge = 60 * 60 * 24 * 7;

type LocalSessionPayload = {
  username: string;
  role: PresetRole;
  expiresAt: number;
};

const secretPath = join(process.cwd(), "data", ".local-session-secret");
let pendingSecret: Promise<string | null> | null = null;

async function sessionSecret() {
  if (process.env.NODE_ENV === "production") return null;
  if (process.env.LOCAL_SESSION_SECRET) return process.env.LOCAL_SESSION_SECRET;
  pendingSecret ??= (async () => {
    await mkdir(join(process.cwd(), "data"), { recursive: true });
    try {
      return await readFile(secretPath, "utf8");
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }

    const generatedSecret = randomBytes(32).toString("base64url");
    try {
      await writeFile(secretPath, generatedSecret, { encoding: "utf8", flag: "wx", mode: 0o600 });
      return generatedSecret;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      return readFile(secretPath, "utf8");
    }
  })();
  return pendingSecret;
}

function signature(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export async function createLocalSessionToken(username: string, role: PresetRole) {
  const secret = await sessionSecret();
  if (!secret) throw new Error("Preset account sessions are disabled in production.");

  const payload = Buffer.from(JSON.stringify({
    username,
    role,
    expiresAt: Date.now() + localSessionMaxAge * 1_000,
  } satisfies LocalSessionPayload)).toString("base64url");

  return `${payload}.${signature(payload, secret)}`;
}

function isValidRole(value: unknown): value is PresetRole {
  return value === "siswa" || value === "guru";
}

export async function verifyLocalSessionToken(token: string | undefined): Promise<LocalSessionPayload | null> {
  const secret = await sessionSecret();
  if (!secret || !token) return null;

  const [payload, suppliedSignature, extra] = token.split(".");
  if (!payload || !suppliedSignature || extra) return null;

  const expectedSignature = signature(payload, secret);
  const expected = Buffer.from(expectedSignature);
  const supplied = Buffer.from(suppliedSignature);
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) return null;

  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Partial<LocalSessionPayload>;
    const account = typeof decoded.username === "string" ? findPresetAccount(decoded.username) : null;
    if (
      typeof decoded.username !== "string" ||
      !isValidRole(decoded.role) ||
      !account ||
      account.role !== decoded.role ||
      typeof decoded.expiresAt !== "number" ||
      decoded.expiresAt <= Date.now()
    ) {
      return null;
    }

    return {
      username: decoded.username,
      role: decoded.role,
      expiresAt: decoded.expiresAt,
    };
  } catch {
    return null;
  }
}

export async function getLocalSession() {
  const token = (await cookies()).get(localSessionCookie)?.value;
  return await verifyLocalSessionToken(token);
}