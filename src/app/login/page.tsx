"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, GraduationCap, LoaderCircle, MessageCircle } from "lucide-react";

type LoginResponse = {
  error?: string;
  user?: { role?: "siswa" | "guru" };
};

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = (await response.json()) as LoginResponse;
      if (!response.ok) throw new Error(result.error ?? "Login belum berhasil.");

      router.replace(result.user?.role === "guru" ? "/dashboard-guru" : "/");
      router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Koneksi belum tersedia.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-dvh w-full items-center justify-center bg-slate-50 px-4 py-8">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="grid size-12 place-items-center rounded-xl bg-teal-800 text-white">
          <GraduationCap aria-hidden="true" size={24} />
        </div>
        <p className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase text-teal-800">
          <MessageCircle aria-hidden="true" size={15} /> RuangCerita
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Masuk ke akunmu</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Masuk menggunakan username dan password yang diberikan oleh sekolah.</p>

        <form className="mt-6 space-y-4" onSubmit={submitLogin}>
          <label className="block text-sm font-semibold text-slate-800" htmlFor="login-username">
            Username
            <input
              autoComplete="username"
              className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 px-3 font-normal outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-700/10"
              id="login-username"
              onChange={(event) => setUsername(event.target.value)}
              required
              value={username}
            />
          </label>
          <label className="block text-sm font-semibold text-slate-800" htmlFor="login-password">
            Password
            <input
              autoComplete="current-password"
              className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 px-3 font-normal outline-none transition focus:border-teal-700 focus:ring-4 focus:ring-teal-700/10"
              id="login-password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>
          {error ? <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-800" role="alert">{error}</p> : null}
          <button
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-teal-800 px-4 text-sm font-semibold text-white transition hover:bg-teal-900 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? <LoaderCircle aria-hidden="true" className="animate-spin" size={17} /> : null}
            Masuk
            {!isSubmitting ? <ArrowRight aria-hidden="true" size={17} /> : null}
          </button>
        </form>
      </section>
    </main>
  );
}