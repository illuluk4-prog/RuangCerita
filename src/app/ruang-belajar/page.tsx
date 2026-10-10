"use client";

import { useRef, useState } from "react";
import {
  BookOpenText,
  Check,
  Clock3,
  GraduationCap,
  Lightbulb,
  ListVideo,
  NotebookText,
  Play,
  Sparkles,
} from "lucide-react";
import {
  ConversationPanel,
  type ConversationMessage,
} from "@/components/conversation-panel";

const lessons = [
  {
    id: "aircAruvnKk",
    title: "But what is a neural network?",
    creator: "3Blue1Brown",
    duration: "18 menit belajar",
    topic: "Matematika & AI",
    summary: [
      "Jaringan saraf tiruan tersusun dari lapisan yang mengolah masukan menjadi keluaran.",
      "Setiap hubungan memiliki bobot yang disesuaikan saat model belajar dari contoh.",
      "Visualisasi membantu melihat bagaimana banyak operasi sederhana membentuk prediksi.",
    ],
  },
  {
    id: "8mAITcNt710",
    title: "Harvard CS50 - Full Computer Science Course",
    creator: "freeCodeCamp.org",
    duration: "25 menit belajar",
    topic: "Logika komputasi",
    summary: [
      "Program adalah rangkaian instruksi yang disusun untuk menyelesaikan suatu masalah.",
      "Blok Scratch membantu menyusun urutan, percabangan, dan pengulangan secara visual.",
      "Mulailah dari tujuan kecil, pecah menjadi langkah, lalu uji hasilnya.",
    ],
  },
  {
    id: "kqtD5dpn9C8",
    title: "Python for Beginners - Learn Coding with Python in 1 Hour",
    creator: "Programming with Mosh",
    duration: "20 menit belajar",
    topic: "Pemrograman dasar",
    summary: [
      "Python menjalankan instruksi yang ditulis dengan sintaks yang mudah dibaca.",
      "Variabel menyimpan nilai yang dapat dipakai dan diolah di bagian program lain.",
      "Latihan singkat dan mencoba contoh sendiri membantu menguatkan konsep dasar.",
    ],
  },
] as const;

const quickPrompts = [
  "Bagian ini belum paham",
  "Beri contoh nyata",
  "Catat rangkuman ini",
];

type Lesson = (typeof lessons)[number];

function createStudyReply(message: string, lesson: Lesson): string {
  const normalized = message.toLocaleLowerCase("id-ID");

  if (normalized.includes("catat rangkuman")) {
    return `Rangkuman ${lesson.title}:\n\n${lesson.summary.map((point) => `• ${point}`).join("\n")}`;
  }

  if (normalized.includes("contoh nyata")) {
    return `Contoh untuk ${lesson.title}: bayangkan kamu sedang menyusun langkah sederhana untuk mencapai satu tujuan. Mulai dari masukan yang tersedia, tentukan prosesnya, lalu periksa hasilnya. Bagian ini menghubungkan materi video dengan situasi sehari-hari.`;
  }

  if (normalized.includes("belum paham")) {
    return `Tidak apa-apa, kita uraikan pelan-pelan. Di materi “${lesson.title}”, bagian mana yang terasa membingungkan? Sebutkan istilah, gambar, atau langkah yang ingin kita bahas.`;
  }

  return `Mari bahas materi “${lesson.title}” langkah demi langkah. Bagian yang bisa jadi titik awal adalah: ${lesson.summary[0]} Apa yang ingin kamu tanyakan?`;
}

export default function RuangBelajarPage() {
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"summary" | "modules">("summary");
  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      id: 1,
      role: "assistant",
      text: "Assalamu'alaikum! Aku teman belajarmu. Tonton materi di sebelah, lalu ceritakan bagian yang ingin kamu bahas bersama.",
    },
  ]);
  const [isReplying, setIsReplying] = useState(false);
  const nextMessageId = useRef(2);

  const activeLesson = lessons[activeLessonIndex];

  function sendQuestion(value: string) {
    const text = value.trim();
    if (!text || isReplying) return;

    const studentMessage: ConversationMessage = {
      id: nextMessageId.current++,
      role: "user",
      text,
    };
    setMessages((current) => [...current, studentMessage]);
    setIsReplying(true);

    window.setTimeout(() => {
      const reply: ConversationMessage = {
        id: nextMessageId.current++,
        role: "assistant",
        text: createStudyReply(text, activeLesson),
      };
      setMessages((current) => [...current, reply]);
      setIsReplying(false);
    }, 450);
  }

  return (
    <div className="space-y-6 pb-4">
      <section className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_24px_-2px_rgba(13,148,136,0.04),0_2px_8px_-1px_rgba(15,23,42,0.03)] sm:flex-row sm:items-end sm:p-6">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-teal-800">
            <span className="grid size-8 place-items-center rounded-xl bg-teal-100 text-teal-900">
              <GraduationCap aria-hidden="true" size={18} />
            </span>
            Classroom pendampingan
          </p>
          <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Ruang Belajar Mandiri
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
            Pelajari satu materi dalam ritmemu sendiri, lalu diskusikan pemahamanmu bersama teman belajar.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-950">
          <span className="size-2 rounded-full bg-amber-600" />
          Demo · Tanpa login
        </span>
      </section>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(330px,0.85fr)]">
        <main className="min-w-0 space-y-4">
          <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_4px_24px_-2px_rgba(13,148,136,0.04),0_2px_8px_-1px_rgba(15,23,42,0.03)]">
            <div className="aspect-video w-full bg-slate-900">
              <iframe
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="size-full"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                src={`https://www.youtube-nocookie.com/embed/${activeLesson.id}?rel=0`}
                title={`Video pembelajaran: ${activeLesson.title}`}
              />
            </div>
            <div className="p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase text-teal-800">Materi pilihan</p>
                  <h2 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
                    {activeLesson.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">Video edukatif · {activeLesson.creator}</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                  <Clock3 aria-hidden="true" size={14} />
                  {activeLesson.duration}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-900">
                  {activeLesson.topic}
                </span>
                <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-950">
                  Belajar mandiri
                </span>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_4px_24px_-2px_rgba(13,148,136,0.04),0_2px_8px_-1px_rgba(15,23,42,0.03)]">
            <div aria-label="Materi belajar" className="flex gap-2 border-b border-slate-100 p-3 sm:px-5" role="tablist">
              <button
                aria-controls="lesson-panel"
                aria-selected={activeTab === "summary"}
                className={`inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/20 ${
                  activeTab === "summary"
                    ? "bg-teal-800 text-white"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
                onClick={() => setActiveTab("summary")}
                id="summary-tab"
                role="tab"
                type="button"
              >
                <NotebookText aria-hidden="true" size={17} />
                Rangkuman Materi
              </button>
              <button
                aria-controls="lesson-panel"
                aria-selected={activeTab === "modules"}
                className={`inline-flex min-h-10 items-center gap-2 rounded-xl px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/20 ${
                  activeTab === "modules"
                    ? "bg-teal-800 text-white"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
                onClick={() => setActiveTab("modules")}
                id="modules-tab"
                role="tab"
                type="button"
              >
                <ListVideo aria-hidden="true" size={17} />
                Daftar Modul Belajar
              </button>
            </div>

            <div aria-labelledby={`${activeTab}-tab`} aria-live="polite" className="p-5 sm:p-6" id="lesson-panel" role="tabpanel">
              {activeTab === "summary" ? (
                <div>
                  <div className="flex items-center gap-2">
                    <BookOpenText aria-hidden="true" className="text-teal-800" size={18} />
                    <h3 className="text-sm font-bold text-slate-900">Poin penting materi</h3>
                  </div>
                  <ul className="mt-4 space-y-3">
                    {activeLesson.summary.map((point, index) => (
                      <li className="flex gap-3 text-sm leading-6 text-slate-700" key={point}>
                        <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-teal-50 text-xs font-bold text-teal-900">
                          {index + 1}
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Playlist pembelajaran</h3>
                      <p className="mt-1 text-xs text-slate-500">Pilih modul untuk mengganti video.</p>
                    </div>
                    <span className="text-xs font-medium text-slate-500">{lessons.length} video</span>
                  </div>
                  <div className="space-y-2">
                    {lessons.map((lesson, index) => {
                      const active = index === activeLessonIndex;
                      return (
                        <button
                          aria-current={active ? "true" : undefined}
                          className={`flex min-h-[76px] w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/20 ${
                            active
                              ? "border-teal-200 bg-teal-50/70"
                              : "border-slate-100 bg-white hover:border-teal-200 hover:bg-slate-50"
                          }`}
                          key={lesson.id}
                          onClick={() => setActiveLessonIndex(index)}
                          type="button"
                        >
                          <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${active ? "bg-teal-800 text-white" : "bg-slate-100 text-slate-600"}`}>
                            {active ? <Play aria-hidden="true" fill="currentColor" size={17} /> : <span className="text-xs font-bold">{String(index + 1).padStart(2, "0")}</span>}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-semibold text-slate-900">{lesson.title}</span>
                            <span className="mt-1 block text-xs text-slate-500">{lesson.topic} · {lesson.duration}</span>
                          </span>
                          {active ? <Check aria-hidden="true" className="shrink-0 text-teal-800" size={17} /> : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>

        <aside className="min-w-0 space-y-4">
          <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-amber-800">
                <Lightbulb aria-hidden="true" size={18} />
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm font-bold text-amber-950">Tips untuk gaya belajarmu</h2>
                  <span className="rounded-full bg-white/80 px-2 py-1 text-[10px] font-semibold text-amber-900">Visual</span>
                </div>
                <p className="mt-2 text-sm leading-5 text-slate-700">
                  Tonton visual ilustrasinya dengan teliti, lalu jeda video untuk menggambar ulang alurnya.
                </p>
              </div>
            </div>
          </section>

          <ConversationPanel
            assistantIcon={GraduationCap}
            assistantLabel="Teman Belajar"
            helperText="Balasan dibuat lokal untuk demo. Percakapan tidak dikirim ke server atau disimpan."
            inputLabel="Tulis pertanyaan tentang materi"
            isReplying={isReplying}
            messages={messages}
            onSend={sendQuestion}
            placeholder="Tanyakan bagian dari materi..."
            quickPromptLabel="Pintasan belajar"
            quickPrompts={quickPrompts}
            statusLabel="Mode demo"
            typingLabel="Menyiapkan penjelasan..."
          />

          <section className="flex items-start gap-3 rounded-2xl border border-teal-100 bg-white p-4">
            <Sparkles aria-hidden="true" className="mt-0.5 shrink-0 text-teal-800" size={17} />
            <p className="text-xs leading-5 text-slate-600">
              Catatan dan diskusi di ruang ini bersifat lokal untuk pratinjau; tidak perlu masuk akun untuk mencoba.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}