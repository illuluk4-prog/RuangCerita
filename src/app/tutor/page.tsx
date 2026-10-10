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

function createDemoReply(question: string, mode: LearningMode): string {
  const normalizedQuestion = question.toLocaleLowerCase("id-ID");

  if (/bunuh diri|menyakiti diri|melukai diri|ingin mati|tidak ingin hidup/.test(normalizedQuestion)) {
    return "Aku bukan pengganti pendamping manusia. Jika kamu merasa tidak aman sekarang, segera temui guru, wali, atau pendamping asrama yang kamu percaya. Respons demo ini tidak mengirim notifikasi kepada siapa pun.";
  }

  if (/mudharabah|musyarakah|syirkah|riba/.test(normalizedQuestion)) {
    return "Bayangkan usaha kantin asrama.\n\nMudharabah: satu pihak menyediakan seluruh modal, pihak lain mengelola usaha.\n\nMusyarakah: para pihak sama-sama menyertakan modal dan dapat berbagi peran.\n\nCoba cek: kalau kamu dan teman sama-sama patungan modal, akad mana yang lebih sesuai?";
  }

  if (/pecahan|matematika|rumus|hitung|persamaan/.test(normalizedQuestion)) {
    return mode === "drill"
      ? "Kita mulai dari satu latihan. Jika 1/2 bagian kue dibagi sama rata kepada 2 orang, berapa bagian yang diterima tiap orang? Coba jawab dulu, lalu kita bahas langkahnya."
      : "Kita pecah menjadi langkah kecil. Tulis dulu informasi yang diketahui, tentukan apa yang ditanyakan, lalu pilih operasi yang menghubungkan keduanya. Bagian mana yang ingin kita hitung bersama?";
  }

  if (/nahwu|shorof|i.?rab|bahasa arab/.test(normalizedQuestion)) {
    return "Kita mulai dari fungsi kata dalam kalimat. Tandai fi'il (kata kerja), fa'il (pelaku), lalu lihat apakah ada maf'ul bih. Kirim satu contoh kalimat yang sedang kamu pelajari, dan kita urai bersama.";
  }

  if (mode === "drill") {
    return "Kita ubah jadi latihan singkat. Coba tulis satu contoh dari materi itu, lalu jelaskan alasanmu dalam satu kalimat. Dari sana kita periksa bagian yang sudah kuat dan yang perlu diulang.";
  }

  if (mode === "deep") {
    return "Kita bedah perlahan: mulai dari definisi, cari contoh yang dekat dengan keseharian, lalu cek batas penerapannya. Bagian mana yang paling membingungkan saat ini?";
  }

  return "Mari fokus pada satu bagian dulu. Ceritakan konsep atau tugas yang sedang kamu pelajari, dan kita susun penjelasannya menjadi langkah-langkah kecil.";
}

export default function TutorPage() {
  const [mode, setMode] = useState<LearningMode>("micro");
  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      id: 1,
      role: "assistant",
      text: "Assalamu'alaikum! Saya tutor demo untuk membantu memahami materi. Pilih pertanyaan contoh atau ketik topik yang ingin dipelajari.",
    },
  ]);
  const [isReplying, setIsReplying] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const nextMessageId = useRef(2);

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
      const tutorMessage: ConversationMessage = {
        id: nextMessageId.current++,
        role: "assistant",
        text: createDemoReply(text, mode),
      };
      setMessages((current) => [...current, tutorMessage]);
      setIsReplying(false);
    }, 550);
  }

  const activeMode = learningModes.find((item) => item.id === mode) ?? learningModes[0];

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
            Pratinjau demo · Balasan percakapan dibuat lokal
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
            assistantLabel="Tutor demo"
            helperText="Demo ini menggunakan aturan balasan sederhana, bukan AI dan tidak mengirim pesan ke server."
            inputLabel="Tulis pertanyaan"
            isReplying={isReplying}
            messages={messages}
            onSend={sendQuestion}
            placeholder="Tanyakan konsep Fiqih, Matematika, atau Bahasa Arab..."
            quickPromptLabel="Coba tanyakan"
            quickPrompts={starterQuestions}
            statusLabel="Balasan demo"
            typingLabel="Menyiapkan contoh balasan..."
          />

          <section className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5">
            <div className="flex items-center gap-2">
              <Clock3 aria-hidden="true" className="text-amber-800" size={18} />
              <h2 className="text-sm font-semibold text-slate-900">Kuis kilat 1 menit</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Jika satu pihak memberi seluruh modal dan pihak lain mengelola usaha, akad mana yang paling sesuai?
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {["Mudharabah", "Musyarakah", "Ijarah", "Murabahah"].map((answer, index) => {
                const selected = selectedAnswer === index;
                const correct = index === 0;
                return (
                  <button
                    aria-pressed={selected}
                    className={`flex min-h-11 items-center justify-between rounded-xl border px-3 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/20 ${
                      selected
                        ? correct
                          ? "border-teal-300 bg-teal-50 text-teal-900"
                          : "border-amber-300 bg-amber-100 text-amber-950"
                        : "border-white bg-white text-slate-700 hover:border-teal-200"
                    }`}
                    key={answer}
                    onClick={() => setSelectedAnswer(index)}
                    type="button"
                  >
                    <span>{String.fromCharCode(65 + index)}. {answer}</span>
                    {selected && correct ? <Check aria-hidden="true" size={16} /> : null}
                  </button>
                );
              })}
            </div>
            {selectedAnswer !== null && (
              <p className="mt-3 text-sm leading-5 text-slate-700" role="status">
                {selectedAnswer === 0
                  ? "Tepat. Dalam Mudharabah, satu pihak menyediakan modal dan pihak lain mengelola usaha."
                  : "Belum tepat. Petunjuknya: hanya satu pihak yang menyertakan modal."}
              </p>
            )}
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