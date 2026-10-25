"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  BookOpen,
  Check,
  CircleHelp,
  Clock3,
  Lightbulb,
  Leaf,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import {
  ConversationPanel,
  type ConversationMessage,
} from "@/components/conversation-panel";
import { requestChatReply } from "@/lib/ai/chat-client";
import { getQuizQuestions, quizSubjects, type QuizLevel, type QuizOptionLabel, type QuizSubject } from "@/lib/quizData";

const learningModes = [
  {
    id: "micro",
    label: "Micro-learning · 10 menit",
    description: "Penjelasan singkat, satu konsep setiap sesi.",
    icon: Clock3,
  },
  {
    id: "drill",
    label: "Latihan soal",
    description: "Perkuat pemahaman lewat latihan bertahap.",
    icon: Target,
  },
  {
    id: "deep",
    label: "Bedah konsep",
    description: "Telusuri alasan, contoh, dan penerapannya.",
    icon: BookOpen,
  },
] as const;

type LearningMode = (typeof learningModes)[number]["id"];

const starterQuestions = [
  "Apa beda Mudharabah dan Musyarakah?",
  "Beri contoh pecahan dalam kehidupan sehari-hari.",
  "Jelaskan konsep ini langkah demi langkah.",
];

export default function TutorPage() {
  const [mode, setMode] = useState<LearningMode>("micro");
  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      id: 1,
      role: "assistant",
      text: "Assalamu'alaikum! Saya Tutor Adaptif Sahabat Belajar Santri. Pilih pertanyaan contoh atau ketik topik yang ingin dipelajari.",
    },
  ]);
  const [isReplying, setIsReplying] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<QuizSubject | null>(null);
  const [quizLevel, setQuizLevel] = useState<QuizLevel>(1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, QuizOptionLabel>>({});
  const [quizComplete, setQuizComplete] = useState(false);
  const [isSavingQuiz, setIsSavingQuiz] = useState(false);
  const [quizSaveError, setQuizSaveError] = useState<string | null>(null);
  const [savedQuizResult, setSavedQuizResult] = useState<{ score: number; correct_answers: number } | null>(null);
  const nextMessageId = useRef(2);
  const quizSubmissionId = useRef<string | null>(null);

  async function sendQuestion(value: string) {
    const text = value.trim();
    if (!text || isReplying) return;

    const studentMessage: ConversationMessage = {
      id: nextMessageId.current++,
      role: "user",
      text,
    };
    setMessages((current) => [...current, studentMessage]);
    setIsReplying(true);

    try {
      const reply = await requestChatReply({
        persona: "tutor",
        message: text,
        learningMode: mode,
        history: messages.slice(1).slice(-10).map(({ role, text }) => ({ role, text })),
      });
      const tutorMessage: ConversationMessage = {
        id: nextMessageId.current++,
        role: "assistant",
        text: reply,
      };
      setMessages((current) => [...current, tutorMessage]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: nextMessageId.current++,
          role: "assistant",
          text:
            error instanceof Error
              ? error.message
              : "Balasan AI belum berhasil dibuat. Coba lagi sebentar.",
        },
      ]);
    } finally {
      setIsReplying(false);
    }
  }

  const activeMode = learningModes.find((item) => item.id === mode) ?? learningModes[0];
  const activeQuestions = selectedSubject ? getQuizQuestions(selectedSubject, quizLevel) : null;
  const correctAnswers = activeQuestions?.reduce(
    (total, question, index) => total + (userAnswers[index] === question.answer ? 1 : 0),
    0,
  ) ?? 0;

  function startQuiz(subject: QuizSubject, level: QuizLevel = 1) {
    setSelectedSubject(subject);
    setQuizLevel(level);
    setQuestionIndex(0);
    setUserAnswers({});
    setQuizComplete(false);
    setQuizSaveError(null);
    setSavedQuizResult(null);
    quizSubmissionId.current = null;
  }

  async function advanceQuiz() {
    if (!activeQuestions || !userAnswers[questionIndex]) return;
    if (questionIndex === activeQuestions.length - 1) {
      if (!selectedSubject) return;
      setIsSavingQuiz(true);
      setQuizSaveError(null);
      quizSubmissionId.current ??= crypto.randomUUID();

      try {
        const response = await fetch("/api/quiz/attempts", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            submissionId: quizSubmissionId.current,
            subject: selectedSubject,
            level: quizLevel,
            answers: activeQuestions.map((_, index) => userAnswers[index]),
          }),
        });
        const result = (await response.json()) as {
          error?: string;
          attempt?: { score: number; correct_answers: number };
        };
        if (!response.ok || !result.attempt) {
          throw new Error(result.error ?? "Hasil kuis belum dapat disimpan.");
        }
        setSavedQuizResult(result.attempt);
        setQuizComplete(true);
      } catch (error) {
        setQuizSaveError(error instanceof Error ? error.message : "Hasil kuis belum dapat disimpan.");
      } finally {
        setIsSavingQuiz(false);
      }
      return;
    }
    setQuestionIndex((current) => current + 1);
  }

  function chooseAnotherSubject() {
    setSelectedSubject(null);
    setQuestionIndex(0);
    setUserAnswers({});
    setQuizComplete(false);
    setQuizLevel(1);
    setQuizSaveError(null);
    setSavedQuizResult(null);
    quizSubmissionId.current = null;
  }

  return (
    <div className="space-y-6 pb-4">
      <section className="flex flex-col justify-between gap-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_24px_-2px_rgba(13,148,136,0.04),0_2px_8px_-1px_rgba(15,23,42,0.03)] sm:p-6 md:flex-row md:items-end">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-teal-800">
            <span className="grid size-7 place-items-center rounded-lg bg-teal-700 text-white">
              <BrainCircuit aria-hidden="true" size={17} />
            </span>
            Kurikulum terintegrasi Madrasah &amp; Kemenag
          </p>
          <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            AI Tutor Adaptif — Sahabat Belajar Santri
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Bimbingan belajar digital yang membantu memahami materi dengan ritme yang
            dapat disesuaikan dengan kebutuhan belajarmu.
          </p>
          <p className="mt-2 text-xs font-medium text-slate-500">
            Balasan percakapan menggunakan Google Gemini AI.
          </p>
        </div>
        <div className="inline-flex w-fit items-center gap-3 self-start rounded-2xl bg-amber-50 px-4 py-3 md:self-auto">
          <span className="relative grid size-3 shrink-0 place-items-center">
            <span className="absolute size-3 animate-ping rounded-full bg-amber-400/70" />
            <span className="relative size-2.5 rounded-full bg-amber-600" />
          </span>
          <span className="flex flex-col">
            <span className="text-xs font-semibold text-amber-900">Mode Adaptif Aktif</span>
            <span className="mt-0.5 text-xs text-amber-950">{activeMode.label}</span>
          </span>
          <Leaf aria-hidden="true" className="shrink-0 text-amber-800" size={19} />
        </div>
      </section>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(290px,0.8fr)]">
        <section className="min-w-0 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-teal-100 text-teal-900">
                <BookOpen aria-hidden="true" size={19} />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase text-slate-500">Topik contoh</p>
                <p className="truncate text-sm font-semibold text-slate-900">Fiqih Muamalah</p>
              </div>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
              Riba · Bagi hasil
            </span>
          </div>

          <ConversationPanel
            assistantLabel="AI Tutor Adaptif"
            helperText="Pesan dan riwayat singkat dikirim ke Google Gemini untuk dibuat balasan. Aplikasi ini tidak menyimpan riwayat chat."
            inputLabel="Tulis pertanyaan"
            isReplying={isReplying}
            messages={messages}
            onSend={sendQuestion}
            placeholder="Tanyakan konsep Fiqih, Matematika, atau Bahasa Arab..."
            quickPromptLabel="Coba tanyakan"
            quickPrompts={starterQuestions}
            statusLabel="Gemini AI"
            typingLabel="Gemini sedang menjawab..."
          />

          <section aria-labelledby="quick-quiz-heading" className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">
            <header className="flex flex-wrap items-start justify-between gap-3 border-b border-amber-100 bg-amber-50/70 p-5">
              <div>
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-amber-900">
                  <Clock3 aria-hidden="true" size={16} /> Kuis kilat
                </p>
                <h2 className="mt-2 text-lg font-bold text-slate-900" id="quick-quiz-heading">Latihan per mata pelajaran</h2>
                <p className="mt-1 text-sm text-slate-600">Jawab 5 soal, lalu lihat skor dan pembahasan.</p>
              </div>
              {selectedSubject ? <span className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-700">{selectedSubject} · Level {quizLevel}</span> : null}
            </header>

            <div className="p-5">
              <div aria-label="Pilih mata pelajaran" className="flex gap-2 overflow-x-auto pb-2" role="tablist">
                {quizSubjects.map((subject) => (
                  <button
                    aria-selected={selectedSubject === subject}
                    className={`min-h-10 shrink-0 rounded-lg border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/20 ${
                      selectedSubject === subject
                        ? "border-teal-700 bg-teal-800 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50"
                    }`}
                    key={subject}
                    onClick={() => {
                      if (selectedSubject !== subject) startQuiz(subject);
                    }}
                    role="tab"
                    type="button"
                  >
                    {subject}
                  </button>
                ))}
              </div>

              {!selectedSubject ? (
                <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600" role="status">
                  Pilih mata pelajaran untuk memulai kuis.
                </p>
              ) : null}

              {activeQuestions && !quizComplete ? (() => {
                const question = activeQuestions[questionIndex];
                const chosenAnswer = userAnswers[questionIndex];
                return (
                  <div aria-live="polite" className="mt-5">
                    <div className="flex items-center justify-between gap-3 text-xs font-semibold text-slate-500">
                      <span>Level {quizLevel} · Soal {questionIndex + 1} dari {activeQuestions.length}</span>
                      <span>{Object.keys(userAnswers).length} jawaban tersimpan</span>
                    </div>
                    <div aria-label="Kemajuan kuis" aria-valuemax={activeQuestions.length} aria-valuemin={1} aria-valuenow={questionIndex + 1} className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar">
                      <div className="h-full rounded-full bg-teal-700 transition-[width]" style={{ width: `${((questionIndex + 1) / activeQuestions.length) * 100}%` }} />
                    </div>
                    <h3 className="mt-5 text-base font-semibold leading-6 text-slate-900">{question.prompt}</h3>
                    <div aria-label="Pilihan jawaban" className="mt-4 grid gap-2">
                      {question.options.map((option) => {
                        const selected = chosenAnswer === option.label;
                        return (
                          <button
                            aria-pressed={selected}
                            className={`flex min-h-12 items-start gap-3 rounded-xl border p-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/20 ${
                              selected ? "border-teal-600 bg-teal-50 text-teal-950" : "border-slate-200 bg-white text-slate-700 hover:border-teal-300"
                            }`}
                            key={option.label}
                            onClick={() => setUserAnswers((current) => ({ ...current, [questionIndex]: option.label }))}
                            type="button"
                          >
                            <span className="grid size-6 shrink-0 place-items-center rounded-md bg-slate-100 text-xs font-bold">{option.label}</span>
                            <span className="pt-0.5">{option.text}</span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                      <p className="text-xs text-slate-500">Jawaban benar dan pembahasan ditampilkan setelah soal terakhir.</p>
                      <button
                        className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-teal-800 px-4 text-sm font-semibold text-white transition-colors hover:bg-teal-900 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={!chosenAnswer || isSavingQuiz}
                        onClick={advanceQuiz}
                        type="button"
                      >
                        {isSavingQuiz
                          ? "Menyimpan hasil..."
                          : questionIndex === activeQuestions.length - 1
                            ? "Selesaikan & Lihat Pembahasan"
                            : "Soal Selanjutnya"}
                        <ArrowRight aria-hidden="true" size={16} />
                      </button>
                    </div>
                    {quizSaveError ? <p className="mt-3 rounded-lg bg-rose-50 p-3 text-sm text-rose-800" role="alert">{quizSaveError} Kamu bisa mencoba menyimpan lagi.</p> : null}
                  </div>
                );
              })() : null}

              {activeQuestions && quizComplete ? (
                <div className="mt-5">
                  <div className="rounded-xl border border-teal-200 bg-teal-50 p-5">
                    <p className="text-xs font-semibold uppercase text-teal-900">Kuis selesai · {selectedSubject} · Level {quizLevel}</p>
                    <h3 className="mt-2 text-2xl font-bold text-slate-950">Skor Kamu: {savedQuizResult?.score ?? correctAnswers * 20}/100 ({savedQuizResult?.correct_answers ?? correctAnswers} dari {activeQuestions.length} Benar)</h3>
                  </div>

                  <div className="mt-5 space-y-3">
                    {activeQuestions.map((question, index) => {
                      const chosenAnswer = userAnswers[index];
                      const selectedOption = question.options.find((option) => option.label === chosenAnswer);
                      const correctOption = question.options.find((option) => option.label === question.answer);
                      const isCorrect = chosenAnswer === question.answer;
                      return (
                        <article className="rounded-xl border border-slate-200 p-4" key={question.id}>
                          <p className="text-sm font-semibold leading-6 text-slate-900">{index + 1}. {question.prompt}</p>
                          <p className={`mt-3 rounded-lg px-3 py-2 text-sm ${isCorrect ? "bg-emerald-50 text-emerald-900" : "bg-rose-50 text-rose-900"}`}>
                            Jawabanmu: {chosenAnswer}. {selectedOption?.text}
                          </p>
                          <p className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
                            Kunci jawaban: {question.answer}. {correctOption?.text}
                          </p>
                          <div className="mt-3 border-l-2 border-teal-600 pl-3">
                            <p className="text-xs font-semibold uppercase text-teal-900">Pembahasan</p>
                            <p className="mt-1 text-sm leading-6 text-slate-700">{question.explanation}</p>
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <button
                      className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-teal-800 px-4 text-sm font-semibold text-white hover:bg-teal-900 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={quizLevel === 3}
                      onClick={() => startQuiz(selectedSubject, (quizLevel + 1) as QuizLevel)}
                      type="button"
                    >
                      <Target aria-hidden="true" size={16} />
                      {quizLevel === 3 ? "Level Maksimal" : "Lanjut ke Level Berikutnya (Lebih Sulit)"}
                    </button>
                    <button className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={chooseAnotherSubject} type="button">
                      Ganti Mata Pelajaran
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        </section>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Zap aria-hidden="true" className="text-teal-800" size={18} />
                <h2 className="text-base font-semibold text-slate-900">Mode belajar</h2>
              </div>
              <span className="text-[11px] font-semibold text-teal-800">Pilih ritme</span>
            </div>
            <p className="mt-2 text-sm leading-5 text-slate-600">
              Sesuaikan cara belajar dengan waktumu saat ini.
            </p>
            <div className="mt-4 space-y-2">
              {learningModes.map(({ id, label, description, icon: Icon }) => {
                const active = mode === id;
                return (
                  <button
                    aria-pressed={active}
                    className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/20 ${active ? "border-teal-200 bg-teal-50" : "border-transparent bg-slate-50 hover:bg-slate-100"}`}
                    key={id}
                    onClick={() => setMode(id)}
                    type="button"
                  >
                    <Icon aria-hidden="true" className={active ? "mt-0.5 shrink-0 text-teal-800" : "mt-0.5 shrink-0 text-slate-500"} size={18} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-slate-900">{label}</span>
                      <span className="mt-1 block text-xs leading-5 text-slate-600">{description}</span>
                    </span>
                    {active ? <Check aria-hidden="true" className="mt-0.5 shrink-0 text-teal-800" size={16} /> : null}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Target aria-hidden="true" className="text-teal-800" size={18} />
                <h2 className="text-base font-semibold text-slate-900">Peta belajar Fiqih</h2>
              </div>
              <span className="text-xs text-slate-500">Data demo</span>
            </div>
            <p className="mt-2 text-sm text-slate-600">{activeMode.description}</p>
            <div className="mt-5 space-y-4">
              {[
                { topic: "Jual beli & akad", progress: 75, status: "Sedang dipelajari" },
                { topic: "Faraidh dasar", progress: 15, status: "Berikutnya" },
              ].map(({ topic, progress, status }) => (
                <div key={topic}>
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-medium text-slate-800">{topic}</p>
                    <span className="shrink-0 text-xs text-slate-500">{progress}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-teal-700" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">{status}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-teal-900 p-5 text-white">
            <div className="flex items-center gap-2 text-amber-200">
              <Lightbulb aria-hidden="true" size={18} />
              <h2 className="text-sm font-semibold">Saran sesi ini</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-teal-50">
              Mulai dengan satu pertanyaan, lanjutkan dengan contoh, lalu ambil jeda singkat sebelum berpindah topik.
            </p>
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/15 pt-3 text-xs text-teal-100">
              <span className="inline-flex items-center gap-1.5"><Clock3 aria-hidden="true" size={14} />{activeMode.label}</span>
              <span className="inline-flex items-center gap-1.5"><CircleHelp aria-hidden="true" size={14} />Demo</span>
            </div>
          </section>

          <p className="flex items-start gap-2 px-1 text-xs leading-5 text-slate-500">
            <Sparkles aria-hidden="true" className="mt-0.5 shrink-0 text-teal-700" size={14} />
            Tutor ini mendukung pemahaman pelajaran; bukan konselor atau pengganti pendamping.
          </p>

          <Link className="inline-flex min-h-10 items-center gap-2 px-1 text-sm font-semibold text-teal-800 hover:text-teal-950" href="/check-in">
            Buka Daily Check-in <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </aside>
      </div>
    </div>
  );
}