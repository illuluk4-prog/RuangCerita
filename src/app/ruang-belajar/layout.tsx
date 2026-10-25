import type { ReactNode } from "react";
import { RequireRole } from "@/components/auth/require-role";

export default function RuangBelajarLayout({ children }: { children: ReactNode }) {
  return <RequireRole role="siswa">{children}</RequireRole>;
}