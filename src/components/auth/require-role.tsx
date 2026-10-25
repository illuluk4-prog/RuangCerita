"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import type { AppRole } from "@/lib/auth/session";

export function RequireRole({
  role,
  children,
}: {
  role: AppRole;
  children: ReactNode;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function verifySession() {
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        if (!response.ok) {
          router.replace("/login");
          return;
        }

        const result = (await response.json()) as {
          user: { role: AppRole } | null;
        };
        if (result.user?.role !== role) {
          router.replace(result.user?.role === "guru" ? "/dashboard-guru" : "/ruang-belajar");
          return;
        }

        if (!cancelled) setReady(true);
      } catch {
        router.replace("/login");
      }
    }

    void verifySession();
    return () => {
      cancelled = true;
    };
  }, [role, router]);

  if (!ready) {
    return (
      <div className="grid min-h-[50vh] place-items-center text-sm text-slate-500" role="status">
        <span className="inline-flex items-center gap-2">
          <LoaderCircle aria-hidden="true" className="animate-spin" size={18} />
          Memeriksa sesi akun...
        </span>
      </div>
    );
  }

  return children;
}