"use client";

import { useEffect, useRef, useState } from "react";
import {
  BookOpenText,
  Check,
  ClipboardList,
  ExternalLink,
  FileText,
  GraduationCap,
  Lightbulb,
  Play,
  Sparkles,
  Upload,
} from "lucide-react";
import {
  ConversationPanel,
  type ConversationMessage,
} from "@/components/conversation-panel";

const materials = [
  {
    id: "video-aksi-sungai",
    title: "Video Aksi Lingkungan & Peduli Sungai",
    type: "video",
    url: "https://www.youtube.com/embed/WA_hVuaA-SE",
  },
  {
    id: "analisis-struktur-berita",
    title: "Analisis Struktur Berita",
    type: "pdf",
    url: "https://drive.google.com/file/d/1s08ZVPuX4Fw-ml5dc6U_glySVzeiNdrj/preview",
  },
  {
    id: "bahasa-indonesia-lanjut",
    title: "Bahasa Indonesia Tingkat Lanjut",
    type: "pdf",
    url: "https://drive.google.com/file/d/1RvZ7zPW8GtKL-1JquY78v1O3WdBKxp43/preview",
  },
  {
    id: "puzzle-teks-berita",
    title: "Puzzle Teks Berita",
    type: "pdf",
    url: "https://drive.google.com/file/d/1RT-LslNthgKt6v3rBAsPc1pa1KeRmz8L/preview",
  },
  {
    id: "materi-berita",
    title: "Materi Berita",
    type: "pdf",
    url: "https://drive.google.com/file/d/1mmUHw5j0BNCAisvfqebQUrEzr-spsodz/preview",
  },
  {
    id: "puzzle-unsur-berita",
    title: "Puzzle Unsur Berita",
    type: "pdf",
    url: "https://drive.google.com/file/d/1frxGOHX0yAmKHNGEwQ0Ol5Kr6Zy5ClGY/preview",
  },
] as const;

const assignments = [
  {
    id: "analisis-video-lingkungan",
    title: "Tugas 1: Analisis Video Aksi Lingkungan",
    description: "Tonton video, lalu tulis gagasan utama dan satu aksi nyata untuk menjaga kebersihan sungai.",
    format: "PDF atau dokumen",
  },
] as const;

const quickPrompts = [
  "Bagian ini belum paham",
  "Beri contoh nyata",
  "Catat rangkuman ini",
];

type Material = (typeof materials)[number];
type PracticeQuestion = {
  id: string;
  title: string;
  prompt: string;
  options: string[];
};
type PracticeResult = { is_correct: boolean; score: number };

function createStudyReply(message: string, material: Material): string {
  const normalized = message.toLocaleLowerCase("id-ID");
  const materialType = material.type === "video" ? "video" : "dokumen PDF";

  if (normalized.includes("catat rangkuman")) {
    return `Materi terpilih: ${material.title} (${materialType}). Catat poin utama yang kamu temukan di materi ini.`;
  }

  if (normalized.includes("contoh nyata")) {
    return `Kita bisa menghubungkan ${material.title} dengan situasi sehari-hari. Ceritakan bagian yang kamu lihat atau baca, lalu kita cari contohnya bersama.`;
  }

  if (normalized.includes("belum paham")) {
    return `Tidak apa-apa, kita bahas pelan-pelan. Di ${material.title}, bagian mana yang terasa membingungkan? Sebutkan bagian yang ingin kita bahas.`;
  }

  return `Mari bahas ${material.title} langkah demi langkah. Bagian mana yang ingin kamu tanyakan?`;
}

export default function RuangBelajarPage() {
  const [activeTab, setActiveTab] = useState<"materials" | "assignments">("materials");
  const [activeMaterialId, setActiveMaterialId] = useState<Material["id"]>(materials[0].id);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submittedFileName, setSubmittedFileName] = useState<string | null>(null);
  const [practiceQuestions, setPracticeQuestions] = useState<PracticeQuestion[]>([]);
  const [practiceSelections, setPracticeSelections] = useState<Record<string, number>>({});
  const [practiceResults, setPracticeResults] = useState<Record<string, PracticeResult>>({});
  const [practiceLoading, setPracticeLoading] = useState(true);
  const [practiceError, setPracticeError] = useState<string | null>(null);
  const [submittingQuestionId, setSubmittingQuestionId] = useState<string | null>(null);
  const viewerRef = useRef<HTMLElement>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      id: 1,
      role: "assistant",
      text: "Assalamu'alaikum! Aku teman belajarmu. Buka video atau dokumen, lalu ceritakan bagian yang ingin kamu bahas bersama.",
    },
  ]);
  const [isReplying, setIsReplying] = useState(false);
  const nextMessageId = useRef(2);

  const activeMaterial = materials.find(({ id }) => id === activeMaterialId) ?? materials[0];

  useEffect(() => {
    let cancelled = false;

    async function loadPracticeQuestions() {
      try {
        const response = await fetch("/api/practice/questions", { cache: "no-store" });
        const result = (await response.json()) as {
          questions?: PracticeQuestion[];
          error?: string;
        };
        if (!response.ok) throw new Error(result.error ?? "Soal latihan belum dapat dimuat.");
        if (!cancelled) setPracticeQuestions(result.questions ?? []);
      } catch (loadError) {
        if (!cancelled) {
          setPracticeError(loadError instanceof Error ? loadError.message : "Soal latihan belum dapat dimuat.");
        }
      } finally {
        if (!cancelled) setPracticeLoading(false);
      }
    }

    void loadPracticeQuestions();
    return () => {
      cancelled = true;
    };
  }, []);

  async function submitPracticeAnswer(questionId: string) {
    const selectedOption = practiceSelections[questionId];
    if (selectedOption === undefined || submittingQuestionId) return;

    setSubmittingQuestionId(questionId);
    setPracticeError(null);
    try {
      const response = await fetch("/api/practice/attempts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ questionId, selectedOption }),
      });
      const result = (await response.json()) as PracticeResult & { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Jawaban belum dapat disimpan.");
      setPracticeResults((current) => ({ ...current, [questionId]: result }));
    } catch (submitError) {
      setPracticeError(submitError instanceof Error ? submitError.message : "Jawaban belum dapat disimpan.");
    } finally {
      setSubmittingQuestionId(null);
    }
  }

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
        text: createStudyReply(text, activeMaterial),
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
          <div aria-label="Ruang kelas" className="flex border-b border-slate-200" role="tablist">
            <button
              aria-controls="materials-panel"
              aria-selected={activeTab === "materials"}
              className={`inline-flex min-h-12 items-center gap-2 border-b-2 px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/20 ${activeTab === "materials" ? "border-teal-700 text-teal-900" : "border-transparent text-slate-500 hover:text-slate-800"}`}
              id="materials-tab"
              onClick={() => setActiveTab("materials")}
              role="tab"
              type="button"
            >
              <BookOpenText aria-hidden="true" size={17} />
              Materi Belajar
            </button>
            <button
              aria-controls="assignments-panel"
              aria-selected={activeTab === "assignments"}
              className={`inline-flex min-h-12 items-center gap-2 border-b-2 px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/20 ${activeTab === "assignments" ? "border-teal-700 text-teal-900" : "border-transparent text-slate-500 hover:text-slate-800"}`}
              id="assignments-tab"
              onClick={() => setActiveTab("assignments")}
              role="tab"
              type="button"
            >
              <ClipboardList aria-hidden="true" size={17} />
              Tugas &amp; Latihan
            </button>
          </div>

          {activeTab === "materials" ? (
            <section aria-labelledby="materials-tab" className="space-y-4" id="materials-panel" role="tabpanel">
              <section
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                id="material-viewer"
                ref={viewerRef}
              >
                <div className={activeMaterial.type === "video" ? "aspect-video w-full bg-slate-900" : "h-[min(75vh,800px)] min-h-[520px] w-full bg-slate-100"}>
                  <iframe
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="size-full"
                    key={activeMaterial.id}
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    src={activeMaterial.url}
                    title={activeMaterial.title}
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 p-4 sm:p-5">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase text-teal-800">
                      {activeMaterial.type === "video" ? "Video pembelajaran" : "Dokumen PDF / Modul"}
                    </p>
                    <h2 className="mt-1 text-base font-bold text-slate-900">{activeMaterial.title}</h2>
                  </div>
                  <a
                    className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/20"
                    href={activeMaterial.url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <ExternalLink aria-hidden="true" size={16} />
                    Buka di tab baru
                  </a>
                </div>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Materi kelas</h2>
                    <p className="mt-1 text-xs text-slate-500">Pilih materi untuk membukanya di viewer.</p>
                  </div>
                  <span className="text-xs font-medium text-slate-500">{materials.length} item</span>
                </div>
                <div className="space-y-2">
                  {materials.map((material) => {
                    const active = material.id === activeMaterialId;
                    const Icon = material.type === "video" ? Play : FileText;
                    const typeLabel = material.type === "video" ? "Video YouTube" : "Dokumen PDF / Modul";

                    return (
                      <button
                        aria-controls="material-viewer"
                        aria-pressed={active}
                        className={`flex min-h-[72px] w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/20 ${active ? "border-teal-300 bg-teal-50/70" : "border-slate-200 hover:border-teal-200 hover:bg-slate-50"}`}
                        key={material.id}
                        onClick={() => {
                          setActiveMaterialId(material.id);
                          viewerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        type="button"
                      >
                        <span className={`grid size-10 shrink-0 place-items-center rounded-lg ${active ? "bg-teal-800 text-white" : "bg-slate-100 text-slate-600"}`}>
                          <Icon aria-hidden="true" fill={material.type === "video" ? "currentColor" : "none"} size={18} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-slate-900">{material.title}</span>
                          <span className="mt-1 block text-xs text-slate-500">{typeLabel}</span>
                        </span>
                        {active ? <Check aria-hidden="true" className="shrink-0 text-teal-800" size={17} /> : null}
                      </button>
                    );
                  })}
                </div>
              </section>
            </section>
          ) : (
            <section aria-labelledby="assignments-tab" className="space-y-4" id="assignments-panel" role="tabpanel">
              {assignments.map((assignment) => (
                <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5" key={assignment.id}>
                  <div className="flex items-start gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-amber-50 text-amber-900">
                      <ClipboardList aria-hidden="true" size={19} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h2 className="text-sm font-bold text-slate-900">{assignment.title}</h2>
                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-900">Belum dikumpulkan</span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{assignment.description}</p>
                      <p className="mt-2 text-xs font-medium text-slate-500">Format: {assignment.format}</p>
                    </div>
                  </div>

                  <form
                    className="mt-5 border-t border-slate-100 pt-4"
                    onSubmit={(event) => {
                      event.preventDefault();
                      if (selectedFile) setSubmittedFileName(selectedFile.name);
                    }}
                  >
                    <label className="mb-2 block text-sm font-semibold text-slate-800" htmlFor="assignment-upload">
                      Lampirkan tugas
                    </label>
                    <input
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                      className="block w-full cursor-pointer rounded-lg border border-slate-200 bg-white text-sm text-slate-700 file:mr-3 file:min-h-10 file:border-0 file:bg-slate-100 file:px-4 file:font-semibold file:text-slate-700 hover:file:bg-slate-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/20"
                      id="assignment-upload"
                      onChange={(event) => {
                        setSelectedFile(event.target.files?.[0] ?? null);
                        setSubmittedFileName(null);
                      }}
                      type="file"
                    />
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <p className="min-w-0 text-xs text-slate-500" aria-live="polite">
                        {submittedFileName
                          ? `Tugas siap dikumpulkan: ${submittedFileName}`
                          : selectedFile
                            ? `File dipilih: ${selectedFile.name}`
                            : "Pilih PDF, dokumen, presentasi, atau gambar."}
                      </p>
                      <button
                        className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-teal-800 px-4 text-sm font-semibold text-white transition-colors hover:bg-teal-900 disabled:cursor-not-allowed disabled:bg-slate-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/30"
                        disabled={!selectedFile}
                        type="submit"
                      >
                        <Upload aria-hidden="true" size={16} />
                        Kirim tugas
                      </button>
                    </div>
                    <p className="mt-3 text-xs leading-5 text-slate-500">Demo ini hanya menyimpan pilihan file di halaman; file belum diunggah ke server.</p>
                  </form>
                </article>
              ))}
              <section className="space-y-3" aria-labelledby="practice-heading">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900" id="practice-heading">Soal latihan</h2>
                    <p className="mt-1 text-sm text-slate-500">Pilih jawaban, lalu kirim untuk menyimpan skor.</p>
                  </div>
                  {!practiceLoading ? <span className="text-xs text-slate-500">{practiceQuestions.length} soal</span> : null}
                </div>
                {practiceLoading ? <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-500">Memuat soal...</p> : null}
                {practiceError ? <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-800" role="alert">{practiceError}</p> : null}
                {!practiceLoading && !practiceError && practiceQuestions.length === 0 ? (
                  <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-500">Belum ada soal latihan yang diterbitkan guru.</p>
                ) : null}
                {practiceQuestions.map((question) => {
                  const result = practiceResults[question.id];
                  return (
                    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5" key={question.id}>
                      <h3 className="text-sm font-bold text-slate-900">{question.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-700">{question.prompt}</p>
                      <fieldset className="mt-4 space-y-2">
                        <legend className="mb-2 text-xs font-semibold text-slate-500">Pilih satu jawaban</legend>
                        {question.options.map((option, index) => (
                          <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3 text-sm text-slate-700 hover:bg-slate-50 has-[:checked]:border-teal-300 has-[:checked]:bg-teal-50" key={`${question.id}-${index}`}>
                            <input
                              checked={practiceSelections[question.id] === index}
                              className="size-4 accent-teal-800"
                              name={`answer-${question.id}`}
                              onChange={() => {
                                setPracticeSelections((current) => ({ ...current, [question.id]: index }));
                                setPracticeResults((current) => {
                                  const next = { ...current };
                                  delete next[question.id];
                                  return next;
                                });
                              }}
                              type="radio"
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </fieldset>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <p aria-live="polite" className={`text-sm font-medium ${result?.is_correct ? "text-emerald-800" : "text-slate-500"}`}>
                          {result ? `${result.is_correct ? "Jawaban benar" : "Jawaban belum tepat"} · Skor ${result.score}` : ""}
                        </p>
                        <button
                          className="min-h-10 rounded-lg bg-teal-800 px-4 text-sm font-semibold text-white hover:bg-teal-900 disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={practiceSelections[question.id] === undefined || submittingQuestionId !== null}
                          onClick={() => void submitPracticeAnswer(question.id)}
                          type="button"
                        >
                          {submittingQuestionId === question.id ? "Menyimpan..." : "Kirim jawaban"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </section>
            </section>
          )}
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