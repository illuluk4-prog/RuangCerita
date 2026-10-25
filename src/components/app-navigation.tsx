"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookOpenText,
  Brain,
  CalendarCheck2,
  GraduationCap,
  HeartHandshake,
  House,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";

const navigationItems = [
  { href: "/", label: "Dashboard", mobileLabel: "Beranda", icon: House },
  { href: "/check-in", label: "Daily Check-in", mobileLabel: "Check-in", icon: CalendarCheck2 },
  { href: "/cerita", label: "Teman Cerita", mobileLabel: "Cerita", icon: HeartHandshake },
  { href: "/tutor", label: "AI Tutor Adaptif", mobileLabel: "Tutor", icon: BookOpenText },
  { href: "/gaya-belajar", label: "Gaya Belajar", mobileLabel: "Gaya", icon: Brain },
  { href: "/ruang-belajar", label: "Ruang Belajar", mobileLabel: "Ruang", icon: GraduationCap },
  { href: "/dashboard-guru", label: "Dashboard Guru", mobileLabel: "Guru", icon: LayoutDashboard },
] as const;

const pageTitles: Record<string, string> = {
  "/": "Dashboard belajar",
  "/check-in": "Daily Check-in",
  "/cerita": "Teman Cerita",
  "/tutor": "AI Tutor Adaptif",
  "/gaya-belajar": "Asesmen Gaya Belajar",
  "/ruang-belajar": "Ruang Belajar Mandiri",
  "/dashboard-guru": "Dashboard Guru",
};

type NavigationUser = { username: string; role: "siswa" | "guru" };

function BrandMark() {
  return (
    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-teal-700 text-white shadow-sm">
      <MessageCircle aria-hidden="true" size={20} />
    </span>
  );
}

export function AppNavigation({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<NavigationUser | null>(null);
  const [resolvedPath, setResolvedPath] = useState<string | null>(null);
  const pageTitle = pageTitles[pathname] ?? "RuangCerita";
  const isGeminiChat = pathname === "/tutor" || pathname === "/cerita";
  const visibleNavigationItems = navigationItems.filter(
    ({ href }) => href !== "/dashboard-guru" || user?.role === "guru",
  );

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/auth/session", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return null;
        const result = (await response.json()) as { user: NavigationUser | null };
        return result.user;
      })
      .then((sessionUser) => {
        if (cancelled) return;
        setUser(sessionUser);
        setResolvedPath(pathname);
        if (!sessionUser && pathname !== "/login") router.replace("/login");
      })
      .catch(() => {
        if (cancelled) return;
        setUser(null);
        setResolvedPath(pathname);
        if (pathname !== "/login") router.replace("/login");
      });

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.replace("/login");
    router.refresh();
  }

  if (pathname === "/login") return <>{children}</>;
  if (!user || resolvedPath !== pathname) {
    return <main aria-busy="true" className="min-h-dvh bg-slate-50" />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex h-[76px] items-center gap-3 border-b border-slate-100 px-5">
          <BrandMark />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-900">RuangCerita</p>
            <p className="truncate text-xs text-slate-500">Ruang tumbuh dan belajar</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col px-3 py-6">
          <p className="px-3 text-[11px] font-semibold uppercase text-slate-400">
            Ruang belajar
          </p>
          <nav aria-label="Navigasi utama" className="mt-3 space-y-1">
            {visibleNavigationItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/20 ${
                    active
                      ? "bg-teal-50 text-teal-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                  href={href}
                  key={href}
                >
                  <Icon
                    aria-hidden="true"
                    className={active ? "text-teal-700" : "text-slate-400"}
                    size={18}
                  />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-2xl border border-teal-100 bg-teal-50/70 p-4">
            <span className="grid size-9 place-items-center rounded-xl bg-white text-teal-800">
              <Sparkles aria-hidden="true" size={18} />
            </span>
            <p className="mt-3 text-sm font-semibold text-slate-900">Akses akun</p>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              Login siswa dan guru memakai akun preset lokal untuk pengembangan.
            </p>
          </div>
        </div>
      </aside>

      <header className="fixed inset-x-0 top-0 z-30 h-[76px] border-b border-slate-200/80 bg-white/95 backdrop-blur-sm lg:left-64">
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3 lg:gap-0">
            <span className="lg:hidden"><BrandMark /></span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                <span className="lg:hidden">RuangCerita · </span>{pageTitle}
              </p>
              <p className="hidden text-xs text-slate-500 sm:block">
                Madrasah · Pesantren · Sekolah menengah
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 sm:inline-flex">
              <span className="size-2 rounded-full bg-emerald-500" />
              {isGeminiChat ? "Gemini AI" : "Ruang belajar"}
            </span>
            {user ? (
              <>
                {user.role === "guru" ? (
                  <Link className="hidden min-h-10 items-center rounded-lg px-3 text-xs font-semibold text-teal-800 hover:bg-teal-50 sm:inline-flex" href="/dashboard-guru">
                    Dashboard guru
                  </Link>
                ) : null}
                <span className="hidden max-w-32 truncate text-xs font-semibold text-slate-700 md:block">{user.username}</span>
                <button
                  aria-label="Keluar dari akun"
                  className="grid size-10 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/20"
                  onClick={() => void signOut()}
                  title="Keluar"
                  type="button"
                >
                  <LogOut aria-hidden="true" size={17} />
                </button>
              </>
            ) : (
              <Link className="inline-flex min-h-10 items-center rounded-lg bg-teal-800 px-3 text-sm font-semibold text-white hover:bg-teal-900" href="/login">
                Masuk
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="min-h-screen px-4 pb-24 pt-[100px] sm:px-6 lg:ml-64 lg:px-8 lg:pb-10">
        <div className="mx-auto w-full max-w-[1440px]">{children}</div>
      </main>

      <nav
        aria-label="Navigasi bawah"
        className={`fixed inset-x-0 bottom-0 z-40 grid ${user?.role === "guru" ? "grid-cols-7" : "grid-cols-6"} border-t border-slate-200 bg-white/95 px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-sm lg:hidden`}
      >
        {visibleNavigationItems.map(({ href, label, mobileLabel, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-12 min-w-0 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/20 sm:text-[11px] ${
                active ? "text-teal-800" : "text-slate-500"
              }`}
              href={href}
              key={href}
            >
              <Icon aria-hidden="true" size={19} />
              <span aria-hidden="true">{mobileLabel}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}