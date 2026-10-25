"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, LoaderCircle, Plus, Users } from "lucide-react";

export type TeacherCheckin = {
  id: string;
  student: string;
  createdAt: string;
  checkinDate: string;
  dayOfWeek: string;
  mood: number;
  energy: number;
  focus: number;
  workload: number;
  priority: string;
  safetyFlag: boolean;
  summary: string;
};

export type TeacherAttempt = {
  id: string;
  student: string;
  question: string;
  answer: string;
  isCorrect: boolean;
  score: number;
  submittedAt: string;
};

export type TeacherQuizResult = {
  id: string;
  subject: string;
  level: number;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  completedAt: string;
};

export type TeacherQuestion = {
  id: string;
  title: string;
  prompt: string;
  options: string[];
  isActive: boolean;
  createdAt: string;
};

export type TeacherStudentSummary = {
  id: string;
  username: string;
  checkins: TeacherCheckin[];
  attempts: TeacherAttempt[];
  quizResults: TeacherQuizResult[];
};

function formatDate(value: string) {
  return new Date(value).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function TeacherDashboard({
  students,
  questions,
  loadError,
}: {
  students: TeacherStudentSummary[];
  questions: TeacherQuestion[];
  loadError: string | null;
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const quizResults = students
    .flatMap((student) => student.quizResults.map((result) => ({ ...result, username: student.username })))
    .sort((first, second) => new Date(second.completedAt).getTime() - new Date(first.completedAt).getTime());

  async function createQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/practice/questions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title,
          prompt,
          options: options.map((option) => option.trim()).filter(Boolean),
          correctOption,
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Soal belum dapat disimpan.");

      setTitle("");
      setPrompt("");
      setOptions(["", "", "", ""]);
      setCorrectOption(0);
      setNotice("Soal berhasil ditambahkan untuk siswa.");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Soal belum dapat disimpan.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 pb-8">
      <header className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase text-teal-800">RuangCerita · Guru</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Rekap pembelajaran</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Pantau check-in harian, hasil latihan, dan kelola soal siswa.</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
          <Users aria-hidden="true" className="text-teal-800" size={17} />
          {students.length} siswa
        </div>
      </header>

      {loadError ? <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900" role="status">{loadError}</p> : null}

      <section aria-labelledby="quiz-results-heading" className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900" id="quiz-results-heading">Rekap Nilai Kuis Siswa</h2>
            <p className="mt-1 text-sm text-slate-500">Nilai dikelompokkan menurut siswa, mata pelajaran, dan level.</p>
          </div>
          <span className="text-xs text-slate-500">{quizResults.length} hasil</span>
        </div>
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[680px] border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Nama siswa</th>
                <th className="px-4 py-3 font-semibold">Mata pelajaran</th>
                <th className="px-4 py-3 font-semibold">Nilai</th>
                <th className="px-4 py-3 font-semibold">Benar</th>
                <th className="px-4 py-3 font-semibold">Waktu pengerjaan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quizResults.map((result) => (
                <tr key={result.id}>
                  <td className="px-4 py-3 font-semibold text-slate-900">{result.username}</td>
                  <td className="px-4 py-3 text-slate-700">{result.subject} · Level {result.level}</td>
                  <td className="px-4 py-3 font-bold tabular-nums text-teal-900">{result.score}/100</td>
                  <td className="px-4 py-3 text-slate-700">{result.correctAnswers}/{result.totalQuestions}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(result.completedAt)}</td>
                </tr>
              ))}
              {quizResults.length === 0 ? (
                <tr><td className="px-4 py-8 text-center text-sm text-slate-500" colSpan={5}>Belum ada hasil kuis siswa.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-label="Rekap berdasarkan username siswa" className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Rekap per siswa</h2>
            <p className="mt-1 text-sm text-slate-500">Buka username untuk melihat kondisi dan hasil latihan siswa tersebut.</p>
          </div>
          <span className="shrink-0 text-xs text-slate-500">{students.length} akun</span>
        </div>
        <div className="space-y-3">
          {students.map((student, studentIndex) => (
            <details className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" key={student.id} open={studentIndex === 0}>
              <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3 px-4 py-4 hover:bg-slate-50 sm:px-5">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-bold text-slate-900">{student.username}</h3>
                  <p className="mt-1 text-xs text-slate-500">Ringkasan aktivitas siswa</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-900">{student.checkins.length} check-in</span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{student.attempts.length} latihan</span>
                </div>
              </summary>
              <div className="grid gap-5 border-t border-slate-100 p-4 sm:p-5 lg:grid-cols-2">
                <section aria-label={`Daily Check-in ${student.username}`} className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900">Daily Check-in</h4>
                    <span className="text-xs text-slate-500">Emosi & beban belajar</span>
                  </div>
                  {student.checkins.map((checkin) => (
                    <article className={`rounded-lg border p-3 ${checkin.safetyFlag ? "border-amber-200 bg-amber-50/70" : "border-slate-200 bg-white"}`} key={checkin.id}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <time className="text-xs font-medium text-slate-500" dateTime={checkin.checkinDate}>
                          {checkin.dayOfWeek}, {new Date(`${checkin.checkinDate}T12:00:00`).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })} · {formatDate(checkin.createdAt)}
                        </time>
                        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${checkin.safetyFlag ? "bg-amber-100 text-amber-950" : "bg-slate-100 text-slate-700"}`}>
                          {checkin.safetyFlag ? "Perlu tindak lanjut" : checkin.priority}
                        </span>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {[ ["Mood", checkin.mood], ["Energi", checkin.energy], ["Fokus", checkin.focus], ["Beban", checkin.workload] ].map(([label, value]) => (
                          <div className="rounded-md bg-slate-50 px-2 py-2" key={label}>
                            <p className="text-[11px] text-slate-500">{label}</p>
                            <p className="mt-0.5 text-sm font-bold tabular-nums text-slate-900">{value}/5</p>
                          </div>
                        ))}
                      </div>
                      <p className="mt-3 text-xs leading-5 text-slate-600">{checkin.summary || "Belum ada ringkasan analisis."}</p>
                    </article>
                  ))}
                  {student.checkins.length === 0 ? <p className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500">Belum ada check-in.</p> : null}
                </section>

                <section aria-label={`Hasil latihan ${student.username}`} className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900">Latihan soal</h4>
                    <span className="text-xs text-slate-500">Nilai & jawaban</span>
                  </div>
                  {student.attempts.map((attempt) => (
                    <article className="rounded-lg border border-slate-200 p-3" key={attempt.id}>
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h5 className="text-sm font-semibold text-slate-900">{attempt.question}</h5>
                          <p className="mt-1 text-xs leading-5 text-slate-600">Jawaban: {attempt.answer}</p>
                        </div>
                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${attempt.isCorrect ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}>
                          Skor {attempt.score}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-slate-500">
                        {attempt.isCorrect ? "Benar" : "Belum tepat"} · {formatDate(attempt.submittedAt)}
                      </p>
                    </article>
                  ))}
                  {student.attempts.length === 0 ? <p className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500">Belum ada jawaban latihan.</p> : null}
                </section>
              </div>
            </details>
          ))}
          {students.length === 0 ? <p className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">Belum ada akun siswa yang terdaftar.</p> : null}
        </div>
      </section>

      <section aria-labelledby="question-management-heading" className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
        <div className="space-y-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900" id="question-management-heading">Soal latihan</h2>
            <p className="mt-1 text-sm text-slate-500">Soal yang tersedia untuk siswa.</p>
          </div>
          <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
            {questions.map((question) => (
              <article className="p-4" key={question.id}>
                <div className="flex items-start gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-teal-50 text-teal-800"><ClipboardList aria-hidden="true" size={17} /></span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900">{question.title}</h3>
                    <p className="mt-1 text-sm leading-5 text-slate-600">{question.prompt}</p>
                    <p className="mt-2 text-xs text-slate-500">{question.options.length} pilihan · {question.isActive ? "Aktif" : "Nonaktif"}</p>
                  </div>
                </div>
              </article>
            ))}
            {questions.length === 0 ? <p className="p-4 text-sm text-slate-500">Belum ada soal latihan.</p> : null}
          </div>
        </div>

        <form className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5" onSubmit={createQuestion}>
          <div>
            <h3 className="text-base font-bold text-slate-900">Tambah soal</h3>
            <p className="mt-1 text-sm text-slate-500">Kunci jawaban disimpan terpisah dan tidak terlihat oleh siswa.</p>
          </div>
          <label className="block text-sm font-semibold text-slate-800" htmlFor="question-title">
            Judul
            <input className="mt-2 min-h-10 w-full rounded-lg border border-slate-300 px-3 font-normal outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/10" id="question-title" maxLength={140} onChange={(event) => setTitle(event.target.value)} required value={title} />
          </label>
          <label className="block text-sm font-semibold text-slate-800" htmlFor="question-prompt">
            Pertanyaan
            <textarea className="mt-2 min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/10" id="question-prompt" maxLength={2000} onChange={(event) => setPrompt(event.target.value)} required value={prompt} />
          </label>
          <fieldset className="space-y-2">
            <legend className="text-sm font-semibold text-slate-800">Pilihan jawaban · pilih kunci yang benar</legend>
            {options.map((option, index) => (
              <div className="flex items-center gap-2" key={index}>
                <input aria-label={`Jadikan pilihan ${index + 1} sebagai jawaban benar`} checked={correctOption === index} className="size-4 accent-teal-800" name="correct-option" onChange={() => setCorrectOption(index)} type="radio" />
                <input className="min-h-10 min-w-0 flex-1 rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-teal-700 focus:ring-4 focus:ring-teal-700/10" maxLength={300} onChange={(event) => setOptions((current) => current.map((value, optionIndex) => optionIndex === index ? event.target.value : value))} placeholder={`Pilihan ${index + 1}`} required value={option} />
              </div>
            ))}
          </fieldset>
          {error ? <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-800" role="alert">{error}</p> : null}
          {notice ? <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900" role="status">{notice}</p> : null}
          <button className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-teal-800 px-4 text-sm font-semibold text-white hover:bg-teal-900 disabled:opacity-60" disabled={isSubmitting} type="submit">
            {isSubmitting ? <LoaderCircle aria-hidden="true" className="animate-spin" size={16} /> : <Plus aria-hidden="true" size={16} />}
            Simpan soal
          </button>
        </form>
      </section>
    </div>
  );
}