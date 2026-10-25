import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthContext } from "@/lib/auth/session";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenText,
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  Flame,
  HeartHandshake,
  Lightbulb,
  Sparkles,
  Target,
} from "lucide-react";

export default async function Home() {
  const auth = await getAuthContext();
  if (!auth) redirect("/login");
  if (auth.profile.role === "guru") redirect("/dashboard-guru");

  return (
    <div className="space-y-8 pb-4">
      <section className="relative isolate overflow-hidden rounded-3xl bg-teal-900 px-5 py-7 text-white shadow-[0_12px_36px_-4px_rgba(15,23,42,0.12)] sm:px-8 sm:py-9">
        <div className="absolute inset-y-0 right-0 -z-10 w-1/2 bg-[linear-gradient(120deg,transparent,rgba(20,184,166,0.2))]" />
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-teal-100">
              <Sparkles aria-hidden="true" size={14} />
              Ruang belajar yang menyesuaikan ritmemu
            </span>
            <h1 className="mt-4 text-2xl font-bold leading-tight sm:text-3xl">
              Assalamu&apos;alaikum, selamat datang.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-teal-50/85">
              Mulai dari memahami kondisi belajar hari ini, lalu pilih satu langkah kecil
              untuk bergerak maju.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-teal-900 transition-colors hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
                href="/check-in"
              >
                <CalendarCheck2 aria-hidden="true" size={17} />
                Mulai check-in
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
              <Link
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/25 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
                href="/tutor"
              >
                <BookOpenText aria-hidden="true" size={17} />
                Buka AI Tutor
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:w-[330px]">
            {[
              { value: "1 mnt", label: "Check-in singkat" },
              { value: "10 mnt", label: "Sesi mikro" },
              { value: "H+1", label: "Tinjau kembali" },
            ].map(({ value, label }) => (
              <div className="rounded-2xl border border-white/10 bg-white/10 p-3 text-center sm:p-4" key={label}>
                <p className="text-lg font-bold text-amber-200 sm:text-xl">{value}</p>
                <p className="mt-1 text-[10px] leading-4 text-teal-50 sm:text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="today-heading" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase text-teal-800">Ringkasan belajar</p>
            <h2 className="mt-1 text-xl font-bold text-slate-900" id="today-heading">
              Hari ini, satu langkah dulu
            </h2>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
            Data tampilan demo
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_24px_-2px_rgba(13,148,136,0.04),0_2px_8px_-1px_rgba(15,23,42,0.03)]">
            <div className="flex items-center justify-between gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-amber-50 text-amber-800">
                <CalendarCheck2 aria-hidden="true" size={19} />
              </span>
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
                Belum diisi
              </span>
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-900">Check-in harian</h3>
            <p className="mt-1 text-sm leading-5 text-slate-600">
              Catat suasana, energi, fokus, dan beban belajar.
            </p>
            <Link className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-800 hover:text-teal-950" href="/check-in">
              Isi check-in <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </article>

          <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_24px_-2px_rgba(13,148,136,0.04),0_2px_8px_-1px_rgba(15,23,42,0.03)]">
            <div className="flex items-center justify-between gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-teal-50 text-teal-800">
                <Target aria-hidden="true" size={19} />
              </span>
              <span className="text-xs font-semibold text-teal-800">Ritme belajar</span>
            </div>
            <p className="mt-4 text-2xl font-bold tabular-nums text-slate-900">10 menit</p>
            <h3 className="mt-1 text-sm font-semibold text-slate-900">Sesi mikro yang disarankan</h3>
            <p className="mt-1 text-sm leading-5 text-slate-600">
              Mulai dari satu topik agar target terasa lebih ringan.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_24px_-2px_rgba(13,148,136,0.04),0_2px_8px_-1px_rgba(15,23,42,0.03)]">
            <div className="flex items-center justify-between gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-800">
                <Flame aria-hidden="true" size={19} />
              </span>
              <span className="text-xs font-semibold text-slate-500">Contoh progres</span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <p className="text-2xl font-bold tabular-nums text-slate-900">4 hari</p>
              <p className="text-xs text-slate-500">konsisten belajar</p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-4/5 rounded-full bg-teal-700" />
            </div>
            <p className="mt-2 text-xs text-slate-500">Progres contoh untuk pratinjau dashboard.</p>
          </article>
        </div>
      </section>

      <section aria-labelledby="modules-heading" className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase text-teal-800">Modul belajar</p>
            <h2 className="mt-1 text-xl font-bold text-slate-900" id="modules-heading">
              Pilih ruang yang kamu perlukan
            </h2>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Link
            className="group flex min-h-44 flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_24px_-2px_rgba(13,148,136,0.04),0_2px_8px_-1px_rgba(15,23,42,0.03)] transition-colors hover:border-teal-200 hover:bg-teal-50/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/20 sm:p-6"
            href="/tutor"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="grid size-11 place-items-center rounded-xl bg-teal-50 text-teal-800">
                <Lightbulb aria-hidden="true" size={21} />
              </span>
              <ArrowUpRight aria-hidden="true" className="text-slate-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" size={18} />
            </div>
            <div className="mt-6">
              <h3 className="font-semibold text-slate-900">AI Tutor Adaptif</h3>
              <p className="mt-1 max-w-md text-sm leading-5 text-slate-600">
                Tanya materi, pelajari contoh, dan cek pemahaman lewat kuis singkat.
              </p>
            </div>
          </Link>

          <Link
            className="group flex min-h-44 flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_24px_-2px_rgba(13,148,136,0.04),0_2px_8px_-1px_rgba(15,23,42,0.03)] transition-colors hover:border-amber-200 hover:bg-amber-50/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/20 sm:p-6"
            href="/check-in"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="grid size-11 place-items-center rounded-xl bg-amber-50 text-amber-800">
                <CheckCircle2 aria-hidden="true" size={21} />
              </span>
              <ArrowUpRight aria-hidden="true" className="text-slate-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" size={18} />
            </div>
            <div className="mt-6">
              <h3 className="font-semibold text-slate-900">Daily Check-in &amp; Refleksi</h3>
              <p className="mt-1 max-w-md text-sm leading-5 text-slate-600">
                Luangkan satu menit untuk memilih dukungan belajar yang paling sesuai.
              </p>
            </div>
          </Link>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(260px,0.6fr)]">
        <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_24px_-2px_rgba(13,148,136,0.04),0_2px_8px_-1px_rgba(15,23,42,0.03)] sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-teal-800">Learning journey</p>
              <h2 className="mt-1 text-lg font-bold text-slate-900">Perjalanan belajarmu</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-medium text-slate-600">
              Data contoh
            </span>
          </div>
          <div className="mt-5 space-y-5">
            {[
              { title: "Fiqih Muamalah", detail: "3 dari 4 topik", value: 75 },
              { title: "Matematika · Kinematika", detail: "Latihan bertahap", value: 55 },
            ].map(({ title, detail, value }) => (
              <div key={title}>
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="font-medium text-slate-800">{title}</span>
                  <span className="text-xs text-slate-500">{detail} · {value}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-teal-700" style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 sm:p-6">
          <div className="flex items-center gap-2 text-amber-900">
            <Clock3 aria-hidden="true" size={18} />
            <h2 className="text-sm font-semibold">Tinjau kembali besok</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            Setelah check-in, pilih satu target ringan. Besok kamu bisa meninjau apakah
            ritme tersebut terasa membantu.
          </p>
          <Link className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-amber-900 hover:text-amber-950" href="/check-in">
            Buat target hari ini <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </article>
      </section>

      <p className="flex items-start gap-2 text-xs leading-5 text-slate-500">
        <HeartHandshake aria-hidden="true" className="mt-0.5 shrink-0 text-teal-700" size={15} />
        AI mendukung proses belajar dan bukan pengganti guru, Guru BK, wali, atau pendamping.
        Insight institusi harus ditampilkan secara agregat dan anonim.
      </p>
    </div>
  );
}
