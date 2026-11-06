import { getLocalSession } from "@/lib/auth/local-session";
import { findPresetAccount } from "@/lib/studentsData";
import { createReadOnlyClient } from "@/lib/supabase/server";

export type AppRole = "siswa" | "guru";

export type AuthContext = {
  profile: {
    id: string;
    username: string;
    role: AppRole;
  };
};

export async function getAuthContext(): Promise<AuthContext | null> {
  if (process.env.NODE_ENV === "production") {
    const supabase = await createReadOnlyClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw new Error(`Supabase session verification failed: ${userError.message}`);
    if (!user) return null;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, username, role")
      .eq("id", user.id)
      .single();

    if (profileError) throw new Error(`Failed to load the signed-in profile: ${profileError.message}`);
    if (profile.role !== "siswa" && profile.role !== "guru") {
      throw new Error("The signed-in profile has an unsupported role.");
    }

    return {
      profile: {
        id: profile.id,
        username: profile.username,
        role: profile.role,
      },
    };
  }

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
}