import { getLocalSession } from "@/lib/auth/local-session";
import { findPresetAccount } from "@/lib/studentsData";

export type AppRole = "siswa" | "guru";

export type AuthContext = {
  profile: {
    id: string;
    username: string;
    role: AppRole;
  };
};

export async function getAuthContext(): Promise<AuthContext | null> {
  try {
    const session = await getLocalSession();
    if (!session) return null;

    const account = findPresetAccount(session.username);
    if (!account || account.role !== session.role) return null;

    return {
      profile: {
        id: account.username,
        username: account.username,
        role: account.role,
      },
    };
  } catch {
    return null;
  }
}