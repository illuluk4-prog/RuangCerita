"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Check,
  CircleHelp,
  ClipboardList,
  HeartHandshake,
  Lightbulb,
  LoaderCircle,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AIAnalysis } from "@/lib/ai/schemas";

const moods = [
  { score: 1, emoji: "😣", label: "Berat" },
  { score: 2, emoji: "😕", label: "Kurang baik" },
  { score: 3, emoji: "😐", label: "Biasa saja" },
  { score: 4, emoji: "🙂", label: "Cukup baik" },
  { score: 5, emoji: "😊", label: "Baik" },
] as const;

const factors = [
  { value: "hafalan", label: "Hafalan" },
  { value: "tugas_padat", label: "Tugas padat" },
  { value: "kelelahan", label: "Kelelahan" },
  { value: "relasi_sosial", label: "Relasi sosial" },
  { value: "adaptasi_asrama", label: "Adaptasi asrama" },
] as const;

const supportOptions = [
  { value: "study_planner", label: "Atur jadwal belajar", icon: ClipboardList },
  { value: "flashcards", label: "Ulangi dengan flashcard", icon: BookOpenCheck },
  { value: "ai_tutor", label: "Bahas materi", icon: Lightbulb },
  { value: "human_support", label: "Bicara dengan pendamping", icon: HeartHandshake },
  { value: "not_sure", label: "Belum yakin", icon: CircleHelp },
] as const;

type CheckinForm = {
  mood_score: number;
  energy_level: number;
  focus_level: number;
  workload_level: number;
  factors: string[];
  desired_support: (typeof supportOptions)[number]["value"];
  reflection_text: string;
};

type SubmitResult = {
  checkin_id: string | null;
  checkin_date: string;
  day_of_week: string;
  calendar: CheckinCalendar;
  analysis: AIAnalysis;
  analysis_source: "ai" | "demo_rules" | "safety_rule";
  routing: "sent" | "not_configured" | "failed" | "skipped_not_persisted";
  persistence_status: "saved" | "partial";
};

type CheckinCalendar = {
  today: string;
  hasCheckedInToday: boolean;
  streak: number;
  week: { date: string; day: string; checked: boolean; isToday: boolean }[];
};

const initialForm: CheckinForm = {
  mood_score: 3,
  energy_level: 3,
  focus_level: 3,
  workload_level: 3,
  factors: [],
  desired_support: "not_sure",
  reflection_text: "",
};

const actionContent: Record<
  AIAnalysis["recommended_action"],
  { title: string; description: string; icon: typeof ClipboardList }
> = {
  study_planner: {
    title: "Rencanakan langkah belajarmu",
    description: "Pecah target belajar menjadi sesi kecil yang lebih teratur.",
    icon: ClipboardList,
  },
  flashcards: {
    title: "Coba ulang materi dengan flashcard",
    description: "Latihan mengingat singkat bisa membantu mengulang hafalan.",
    icon: BookOpenCheck,
  },
  ai_tutor: {
    title: "Bahas satu materi yang terasa sulit",
    description: "Pilih satu pertanyaan, lalu pelajari langkah demi langkah.",
    icon: Lightbulb,
  },
  human_support: {
    title: "Hubungi pendamping yang kamu percaya",
    description:
      "Guru BK, wali kelas, atau pendamping asrama dapat membantu menentukan langkah berikutnya.",
    icon: HeartHandshake,
  },
};

const priorityLabels: Record<AIAnalysis["priority"], string> = {
  low: "Langkah ringan",
  medium: "Perlu perhatian",
  high: "Perlu dukungan",
  urgent: "Perlu tindak lanjut segera",
};

function MetricSlider({
  label,
  value,
  onChange,
  lowLabel,
  highLabel,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  lowLabel: string;
  highLabel: string;
}) {
  return (
    <label className="block rounded-xl border border-slate-100 bg-white px-4 py-4">
      <span className="flex items-center justify-between gap-4 text-sm font-semibold text-slate-800">
        {label}
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-teal-50 text-sm font-bold tabular-nums text-teal-800">
          {value}
        </span>
      </span>
      <input
        aria-label={label}
        className="mt-4 h-2 w-full cursor-pointer accent-teal-700"
        max={5}
        min={1}
        onChange={(event) => onChange(Number(event.target.value))}
        type="range"
        value={value}
      />
      <span className="mt-2 flex justify-between text-xs text-slate-500">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </span>
    </label>
  );
}

export default function CheckInPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<CheckinForm>(initialForm);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calendar, setCalendar] = useState<CheckinCalendar | null>(null);
  const [isCalendarLoading, setIsCalendarLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/checkin", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Status kalender belum dapat dimuat.");
        return (await response.json()) as { calendar: CheckinCalendar };
      })
      .then(({ calendar: currentCalendar }) => {
        if (!cancelled) setCalendar(currentCalendar);
      })
      .catch(() => {
        if (!cancelled) setCalendar(null);
      })
      .finally(() => {
        if (!cancelled) setIsCalendarLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function updateMetric(key: "energy_level" | "focus_level" | "workload_level", value: number) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleFactor(factor: string) {
    setForm((current) => ({
      ...current,
      factors: current.factors.includes(factor)
        ? current.factors.filter((item) => item !== factor)
        : [...current.factors, factor],
    }));
  }

  async function submitCheckin() {
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/checkin", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = (await response.json()) as SubmitResult | { error?: string; calendar?: CheckinCalendar };

      if (!response.ok) {
        if ("calendar" in payload && payload.calendar) setCalendar(payload.calendar);
        throw new Error("error" in payload ? payload.error : "Check-in belum berhasil dikirim.");
      }

      const submittedResult = payload as SubmitResult;
      setCalendar(submittedResult.calendar);
      setResult(submittedResult);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Koneksi terputus. Periksa jaringan lalu coba lagi.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const selectedAction = result ? actionContent[result.analysis.recommended_action] : null;
  const ActionIcon = selectedAction?.icon;

  return (
    <section aria-label="Daily Check-in" className="w-full text-slate-900">
      <div className="mx-auto w-full max-w-5xl">
        {calendar ? (
          <section aria-label="Kalender dan streak check-in" className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase text-teal-800">Presensi mingguan</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {calendar.hasCheckedInToday ? "Sudah Check-in Hari Ini (Centang)" : "Check-in hari ini"}
                </p>
                <time className="mt-1 block text-xs text-slate-500" dateTime={calendar.today}>
                  {new Date(`${calendar.today}T12:00:00`).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </div>
              <div className="rounded-xl bg-amber-50 px-4 py-2 text-right">
                <p className="text-xs font-medium text-amber-900">Streak Check-in</p>
                <p className="text-xl font-bold tabular-nums text-amber-950">{calendar.streak} hari</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-7 gap-2">
              {calendar.week.map((day) => (
                <div
                  aria-label={`${day.day}, ${day.date}${day.checked ? ", sudah check-in" : ""}`}
                  className={`flex min-h-16 flex-col items-center justify-center rounded-lg border px-1 py-2 text-center ${
                    day.isToday
                      ? "border-teal-700 bg-teal-50 text-teal-900"
                      : day.checked
                        ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                        : "border-slate-100 bg-slate-50 text-slate-500"
                  }`}
                  key={day.date}
                >
                  <span className="text-[10px] font-medium sm:text-xs">{day.day.slice(0, 3)}</span>
                  <span className="mt-1 text-sm font-bold tabular-nums">{Number(day.date.slice(-2))}</span>
                  {day.checked ? <Check aria-hidden="true" className="mt-0.5" size={13} /> : null}
                </div>
              ))}
            </div>
          </section>
        ) : isCalendarLoading ? (
          <div aria-busy="true" className="mb-6 h-28 animate-pulse rounded-2xl bg-slate-100" />
        ) : null}
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_290px]">
          <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_4px_24px_-2px_rgba(13,148,136,0.05),0_2px_8px_-1px_rgba(15,23,42,0.03)]">
            {result ? (
              <div className="p-5 sm:p-8">
                <div className="mb-7 flex items-start gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-teal-50 text-teal-800">
                    {result.persistence_status === "saved" ? (
                      <Check aria-hidden="true" size={22} />
                    ) : (
                      <Sparkles aria-hidden="true" size={22} />
                    )}
                  </span>
                  <div>
                      <p className="text-sm font-semibold text-teal-800">
                        {result.persistence_status === "saved" ? "Sudah Check-in Hari Ini (Centang)" : "Hasil check-in siap"}
                    </p>
                    <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                      Terima kasih sudah berbagi.
                    </h1>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                      Ini satu langkah kecil untuk memahami kebutuhan belajarmu hari ini.
                    </p>
                  </div>
                </div>

                {result.analysis_source === "demo_rules" && (
                  <p className="mb-4 text-xs leading-5 text-slate-500">
                    Rekomendasi dibuat oleh aturan sederhana untuk pengujian, bukan oleh AI.
                  </p>
                )}

                <div
                  className={`rounded-2xl border p-5 sm:p-6 ${
                    result.analysis.safety_flag
                      ? "border-amber-300 bg-amber-50"
                      : "border-teal-100 bg-teal-50/70"
                  }`}
                  aria-live="polite"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-xs font-semibold text-slate-700">
                      <Sparkles aria-hidden="true" size={14} className="text-teal-700" />
                      Saran belajar
                    </span>
                    <span className="text-xs font-semibold text-slate-600">
                      {priorityLabels[result.analysis.priority]}
                    </span>
                  </div>
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-700">
                    {result.analysis.ai_summary}
                  </p>
                  {selectedAction && ActionIcon && (
                    <div className="mt-5 flex items-start gap-3 rounded-xl bg-white p-4">
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-800">
                        <ActionIcon aria-hidden="true" size={20} />
                      </span>
                      <div className="min-w-0">
                        <h2 className="font-semibold text-slate-900">{selectedAction.title}</h2>
                        <p className="mt-1 text-sm leading-5 text-slate-600">
                          {selectedAction.description}
                        </p>
                        {result.analysis.recommended_action !== "human_support" && (
                          <p className="mt-3 text-xs font-medium text-teal-800">
                            Modul belajar ini dapat dibuka dari menu RuangCerita.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {result.analysis.safety_flag && (
                    <div className="mt-4 rounded-xl border border-amber-200 bg-white/80 p-4 text-sm leading-6 text-slate-700">
                      {result.routing === "sent"
                        ? "Check-in ini telah diteruskan kepada pendamping yang berwenang. "
                        : "Hasil ini belum memberi tahu pendamping. "}
                      Jika kamu merasa tidak aman saat ini, segera temui guru, wali, atau
                      pendamping asrama yang kamu percaya.
                    </div>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-slate-500">
                    {result.persistence_status === "partial"
                      ? "Check-in tersimpan, tetapi analisis belum tersimpan."
                      : result.routing === "sent"
                      ? "Tindak lanjut otomatis telah dijadwalkan."
                      : result.analysis.human_support_needed
                        ? "Pendampingan sedang menunggu konfigurasi tindak lanjut."
                        : "Data check-in tersimpan dengan aman."}
                  </p>
                  <time className="text-xs font-medium text-slate-600" dateTime={result.checkin_date}>
                    {result.day_of_week}, {new Date(`${result.checkin_date}T12:00:00`).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                </div>
                <Link
                  className="mt-5 flex min-h-20 items-center gap-4 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 transition-colors hover:border-amber-300 hover:bg-amber-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-500/20 sm:p-5"
                  href="/cerita"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-amber-900">
                    <HeartHandshake aria-hidden="true" size={21} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-900">
                      Ingin menumpahkan isi hatimu?
                    </span>
                    <span className="mt-1 block text-sm text-slate-600">
                      Ngobrol santai di Teman Cerita
                    </span>
                  </span>
                  <ArrowRight aria-hidden="true" className="shrink-0 text-amber-900" size={18} />
                </Link>
              </div>
            ) : calendar?.hasCheckedInToday ? (
              <div className="p-6 sm:p-8" role="status">
                <span className="grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-800">
                  <Check aria-hidden="true" size={24} />
                </span>
                <h1 className="mt-5 text-2xl font-bold text-slate-900">Sudah Check-in Hari Ini</h1>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Check-in berikutnya tersedia besok. Streak-mu saat ini {calendar.streak} hari.
                </p>
                <time className="mt-3 block text-sm font-semibold text-teal-800" dateTime={calendar.today}>
                  {new Date(`${calendar.today}T12:00:00`).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </div>
            ) : (
              <>
                <div className="border-b border-slate-100 px-5 pb-5 pt-6 sm:px-8 sm:pt-8">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-teal-800">Ruang refleksi</p>
                      <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                        Bagaimana belajarmu hari ini?
                      </h1>
                      <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                        Jawab singkat saja. Tidak ada jawaban benar atau salah.
                      </p>
                    </div>
                    <span className="hidden rounded-xl bg-amber-50 p-3 text-amber-700 sm:grid">
                      <Sparkles aria-hidden="true" size={20} />
                    </span>
                  </div>

                  <div className="mt-7">
                    <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
                      <span>Langkah {step} dari 3</span>
                      <span>{step === 1 ? "Suasana belajar" : step === 2 ? "Dukungan" : "Refleksi"}</span>
                    </div>
                    <div
                      className="h-2 overflow-hidden rounded-full bg-slate-100"
                      role="progressbar"
                      aria-label="Kemajuan check-in"
                      aria-valuemin={1}
                      aria-valuemax={3}
                      aria-valuenow={step}
                    >
                      <div
                        className="h-full rounded-full bg-teal-700 transition-[width] duration-300"
                        style={{ width: `${(step / 3) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-8">
                  {step === 1 && (
                    <div className="space-y-8">
                      <fieldset>
                        <legend className="text-base font-semibold text-slate-900">
                          Pilih suasana yang paling mendekati
                        </legend>
                        <div className="mt-4 grid grid-cols-5 gap-2 sm:gap-3">
                          {moods.map((mood) => {
                            const selected = form.mood_score === mood.score;
                            return (
                              <button
                                aria-pressed={selected}
                                className={`flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border px-1 py-3 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/20 ${
                                  selected
                                    ? "border-teal-600 bg-teal-50 text-teal-900"
                                    : "border-slate-200 bg-white text-slate-600 hover:border-teal-300"
                                }`}
                                key={mood.score}
                                onClick={() => setForm((current) => ({ ...current, mood_score: mood.score }))}
                                type="button"
                              >
                                <span className="text-2xl" aria-hidden="true">{mood.emoji}</span>
                                <span className="text-center text-[11px] font-medium leading-4 sm:text-xs">
                                  {mood.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </fieldset>

                      <div>
                        <div>
                          <h2 className="text-base font-semibold text-slate-900">Kondisi belajarmu</h2>
                          <p className="mt-1 text-sm text-slate-500">
                            Geser nilai dari 1 (rendah) sampai 5 (tinggi).
                          </p>
                        </div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-3">
                          <MetricSlider
                            highLabel="Penuh energi"
                            label="Energi"
                            lowLabel="Lelah"
                            onChange={(value) => updateMetric("energy_level", value)}
                            value={form.energy_level}
                          />
                          <MetricSlider
                            highLabel="Fokus"
                            label="Konsentrasi"
                            lowLabel="Terdistraksi"
                            onChange={(value) => updateMetric("focus_level", value)}
                            value={form.focus_level}
                          />
                          <MetricSlider
                            highLabel="Sangat padat"
                            label="Beban belajar"
                            lowLabel="Ringan"
                            onChange={(value) => updateMetric("workload_level", value)}
                            value={form.workload_level}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-8">
                      <fieldset>
                        <legend className="text-base font-semibold text-slate-900">
                          Apa yang ikut memengaruhi belajarmu?
                        </legend>
                        <p className="mt-1 text-sm text-slate-500">Pilih semua yang sesuai.</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {factors.map((factor) => {
                            const selected = form.factors.includes(factor.value);
                            return (
                              <button
                                aria-pressed={selected}
                                className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/20 ${
                                  selected
                                    ? "border-teal-700 bg-teal-700 text-white"
                                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-teal-300 hover:bg-teal-50"
                                }`}
                                key={factor.value}
                                onClick={() => toggleFactor(factor.value)}
                                type="button"
                              >
                                {selected ? <Check aria-hidden="true" size={15} /> : null}
                                {factor.label}
                              </button>
                            );
                          })}
                        </div>
                      </fieldset>

                      <fieldset>
                        <legend className="text-base font-semibold text-slate-900">
                          Dukungan apa yang kamu inginkan?
                        </legend>
                        <div className="mt-4 grid gap-2 sm:grid-cols-2">
                          {supportOptions.map(({ value, label, icon: Icon }) => {
                            const selected = form.desired_support === value;
                            return (
                              <button
                                aria-pressed={selected}
                                className={`flex min-h-14 items-center gap-3 rounded-xl border px-4 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/20 ${
                                  selected
                                    ? "border-teal-600 bg-teal-50 text-teal-900"
                                    : "border-slate-200 bg-white text-slate-700 hover:border-teal-300"
                                }`}
                                key={value}
                                onClick={() => setForm((current) => ({ ...current, desired_support: value }))}
                                type="button"
                              >
                                <Icon aria-hidden="true" className="shrink-0 text-teal-700" size={19} />
                                <span className="flex-1">{label}</span>
                                <span
                                  className={`grid size-5 shrink-0 place-items-center rounded-full border ${
                                    selected ? "border-teal-700 bg-teal-700 text-white" : "border-slate-300"
                                  }`}
                                >
                                  {selected ? <Check aria-hidden="true" size={12} /> : null}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </fieldset>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-5">
                      <div>
                        <label className="text-base font-semibold text-slate-900" htmlFor="reflection">
                          Ada hal lain tentang belajarmu yang ingin dibagikan?
                        </label>
                        <p className="mt-1 text-sm text-slate-500">Bagian ini boleh dikosongkan.</p>
                        <textarea
                          className="mt-4 min-h-36 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-500/10"
                          id="reflection"
                          maxLength={500}
                          onChange={(event) =>
                            setForm((current) => ({ ...current, reflection_text: event.target.value }))
                          }
                          placeholder="Contoh: Aku ingin mencoba membagi waktu hafalan dan tugas sekolah."
                          value={form.reflection_text}
                        />
                        <p className="mt-2 text-right text-xs text-slate-500">
                          {form.reflection_text.length}/500
                        </p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                        Refleksi diproses oleh model AI untuk menyusun saran belajar. Hindari menulis
                        nama lengkap, alamat, atau informasi pribadi orang lain. Teks refleksi tidak
                        dikirim ke sistem otomatisasi institusi.
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="mt-6 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
                      <p>{error}</p>
                      <button
                        aria-label="Tutup pesan kesalahan"
                        className="shrink-0 rounded p-1 hover:bg-red-100"
                        onClick={() => setError(null)}
                        type="button"
                      >
                        <X aria-hidden="true" size={16} />
                      </button>
                    </div>
                  )}

                  <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
                    {step > 1 ? (
                      <Button
                        className="h-11 rounded-xl px-4 text-slate-700"
                        onClick={() => setStep((current) => current - 1)}
                        type="button"
                        variant="outline"
                      >
                        <ArrowLeft aria-hidden="true" />
                        Kembali
                      </Button>
                    ) : (
                      <span className="text-xs text-slate-500">Kurang dari 1 menit</span>
                    )}
                    {step < 3 ? (
                      <Button
                        className="h-11 rounded-xl bg-teal-700 px-5 text-white hover:bg-teal-800"
                        onClick={() => setStep((current) => current + 1)}
                        type="button"
                      >
                        Lanjut
                        <ArrowRight aria-hidden="true" />
                      </Button>
                    ) : (
                      <Button
                        className="h-11 rounded-xl bg-teal-700 px-5 text-white hover:bg-teal-800"
                        disabled={isSubmitting}
                        onClick={() => void submitCheckin()}
                        type="button"
                      >
                        {isSubmitting ? (
                          <>
                            <LoaderCircle aria-hidden="true" className="animate-spin" />
                            Menyiapkan saran
                          </>
                        ) : (
                          <>
                            Kirim check-in
                            <ArrowRight aria-hidden="true" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </section>

          <aside className="space-y-4">
            <section className="rounded-2xl bg-teal-900 p-5 text-white shadow-[0_12px_36px_-4px_rgba(15,23,42,0.12)]">
              <span className="grid size-10 place-items-center rounded-xl bg-white/10 text-amber-200">
                <Sparkles aria-hidden="true" size={19} />
              </span>
              <h2 className="mt-4 text-lg font-semibold">Satu langkah pada satu waktu</h2>
              <p className="mt-2 text-sm leading-6 text-teal-50/85">
                Pilih dukungan belajar yang terasa paling berguna untuk hari ini.
              </p>
              <div className="mt-5 flex items-center gap-2 text-xs font-medium text-amber-200">
                <span className="h-px w-6 bg-amber-300/70" />
                Belajar dengan lebih terarah
              </div>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-5">
              <h2 className="text-sm font-semibold text-slate-900">Ruang yang aman</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Saran otomatis berfokus pada belajar. AI bukan pengganti guru, wali, atau pendamping.
                Jika membutuhkan bantuan manusia, kamu bisa memilih pendamping saat check-in.
              </p>
            </section>
          </aside>
        </div>

        <footer className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-teal-600" />
            RuangCerita · Dukungan belajar
          </span>
          <span>Refleksi pribadi tidak ditampilkan sebagai cerita individu pada insight institusi.</span>
        </footer>
      </div>
    </section>
  );
}