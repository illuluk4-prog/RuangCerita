"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  AudioLines,
  BookOpenText,
  Check,
  Eye,
  Footprints,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const questions = [
  {
    prompt: "Apa yang kamu sukai ketika mempelajari materi baru?",
    options: [
      "Membaca buku, melihat gambar, atau melihat catatan guru di papan tulis.",
      "Mendengarkan penjelasan guru atau berdiskusi dengan teman.",
      "Melakukan praktik langsung atau percobaan.",
    ],
  },
  {
    prompt: "Bagaimana cara kamu menghafal pelajaran?",
    options: [
      "Menuliskan atau membaca ulang catatan sambil melihat bentuk tulisannya.",
      "Mengulangi atau mengucapkan kata-kata tersebut dengan bersuara.",
      "Menghafal sambil berjalan-jalan atau menggunakan gerakan tubuh/tangan.",
    ],
  },
  {
    prompt: "Apa yang membuatmu paling mudah mengingat nama orang?",
    options: [
      "Wajah orang, warna, atau bentuk benda di sekitarnya.",
      "Nada suara, perkataan seseorang, atau obrolan.",
      "Pengalaman atau perasaan saat melakukan suatu peristiwa.",
    ],
  },
  {
    prompt: "Ketika membaca buku, apa kebiasaan yang kamu lakukan?",
    options: [
      "Membaca dengan cepat dan tenang tanpa suara.",
      "Menggerakkan bibir atau melafalkan kata-kata secara pelan saat membaca.",
      "Menggunakan jari untuk menunjuk teks yang sedang dibaca atau sering bergerak saat duduk.",
    ],
  },
  {
    prompt: "Apa yang paling mengganggu konsentrasi kamu saat belajar?",
    options: [
      "Ruangan yang berantakan atau suasana yang penuh coretan visual.",
      "Suara yang bising, gaduh, atau suara orang mengobrol.",
      "Keharusan duduk diam dalam waktu yang lama tanpa bergerak.",
    ],
  },
  {
    prompt: "Saat belajar untuk menghadapi ujian, cara yang paling efektif bagi kamu adalah...",
    options: [
      "Membaca ulang buku rangkuman, melihat catatan berwarna, atau membuat peta pikiran (mind map).",
      "Membaca catatan secara keras-keras, berdiskusi dengan teman, atau mendengarkan rekaman pelajaran.",
      "Belajar sambil berjalan-jalan di kamar, membuat tiruan/model, atau memperagakan gerakan tertentu.",
    ],
  },
  {
    prompt: "Ketika kamu kesulitan dalam memahami materi, apa yang kamu lakukan?",
    options: [
      "Menggambar atau membuat peta konsep.",
      "Meminta bantuan teman untuk menjelaskan ulang.",
      "Mencoba dan mempraktikkan langsung.",
    ],
  },
  {
    prompt: "Saat kamu bosan di kelas, apa yang biasanya kamu lakukan?",
    options: [
      "Menggambar atau mencoret-coret di buku catatanmu.",
      "Berbisik dan mengobrol pelan dengan teman sebangku.",
      "Mengetuk-ngetuk jari dan pulpen ke meja.",
    ],
  },
  {
    prompt: "Saat kamu membaca sebuah cerita, apa yang paling kamu bayangkan?",
    options: [
      "Wajah para tokoh dan pemandangan tempat kejadian.",
      "Suara para tokoh saat mereka berbicara.",
      "Merasakan apa yang dirasakan tokoh.",
    ],
  },
  {
    prompt: "Ketika kamu harus presentasi di depan kelas, bagaimana kamu mempersiapkannya?",
    options: [
      "Membuat gambar, peta konsep, dan catatan kecil.",
      "Berlatih mengucapkan presentasi berulang kali.",
      "Berlatih sambil berjalan-jalan atau menggunakan gerakan tangan.",
    ],
  },
  {
    prompt: "Apa yang kamu lakukan saat kamu menjelaskan sesuatu kepada teman?",
    options: [
      "Menggunakan gambar atau coretan untuk membantu penjelasan.",
      "Menjelaskannya secara lisan dengan detail.",
      "Menggunakan gerakan tangan dan bahasa tubuh.",
    ],
  },
  {
    prompt: "Bagaimana gaya bicara atau gestur kamu sehari-hari?",
    options: [
      "Berbicara dengan tempo cepat dan memerhatikan penampilan.",
      "Suka berbicara, berdiskusi, dan mudah hafal nada suara.",
      "Banyak menggunakan gerakan tubuh atau isyarat saat berbicara.",
    ],
  },
  {
    prompt: "Ketika berkonsentrasi, maka hal yang kamu paling sering lakukan adalah...",
    options: [
      "Fokus pada kata-kata atau gambar-gambar di depan saya.",
      "Membahas masalah dan memikirkan solusi yang mungkin dapat dilakukan.",
      "Banyak bergerak, bermain dengan pena/pensil, atau menyentuh sesuatu.",
    ],
  },
  {
    prompt: "Saat kamu membaca buku cerita atau teks pelajaran, hal yang sering kamu lakukan adalah...",
    options: [
      "Membaca dalam hati dan membayangkan adegan atau gambarnya di pikiran.",
      "Membaca sambil bersuara pelan atau menggerakkan bibir mengikuti kata-kata.",
      "Menggunakan jari untuk menunjuk baris tulisan atau merasa tidak betah jika harus duduk diam terlalu lama.",
    ],
  },
  {
    prompt: "Ketika guru menjelaskan materi pelajaran di depan kelas, kamu lebih suka...",
    options: [
      "Melihat tulisan di papan tulis, presentasi slide, atau bagan/peta konsep.",
      "Mendengarkan secara cermat penjelasan verbal dari guru.",
      "Melakukan praktikum, mempraktikkan langsung, atau membuat catatan sambil bergerak.",
    ],
  },
] as const;

const learningStyles = [
  {
    name: "Visual",
    label: "Belajar dengan melihat",
    icon: Eye,
    tone: "blue",
    characteristics: [
      "Mudah memahami informasi lewat gambar, warna, diagram, dan tata letak.",
      "Cenderung mengingat apa yang dibaca atau dilihat.",
    ],
    tips: [
      "Buat peta pikiran, bagan, atau garis waktu untuk merangkum materi.",
      "Gunakan warna secukupnya untuk menandai ide utama dan contoh.",
      "Letakkan catatan atau ilustrasi penting di tempat yang mudah terlihat.",
    ],
  },
  {
    name: "Auditori",
    label: "Belajar dengan mendengar",
    icon: AudioLines,
    tone: "teal",
    characteristics: [
      "Mudah memahami materi lewat penjelasan lisan, percakapan, dan bunyi.",
      "Cenderung mengingat hal yang didengar atau diucapkan kembali.",
    ],
    tips: [
      "Ceritakan kembali materi dengan kata-katamu sendiri setelah belajar.",
      "Diskusikan topik atau dengarkan rekaman penjelasan singkat.",
      "Bacakan poin penting dengan suara pelan saat mengulang pelajaran.",
    ],
  },
  {
    name: "Kinestetik",
    label: "Belajar dengan bergerak dan mencoba",
    icon: Footprints,
    tone: "amber",
    characteristics: [
      "Mudah memahami materi lewat praktik, pengalaman, dan gerakan.",
      "Cenderung belajar lebih nyaman saat dapat mencoba atau memanipulasi sesuatu.",
    ],
    tips: [
      "Ubah konsep menjadi percobaan, model sederhana, atau simulasi.",
      "Selipkan jeda bergerak singkat di antara sesi belajar.",
      "Gunakan kartu belajar sambil berdiri atau berjalan perlahan.",
    ],
  },
] as const;

const optionLetters = ["A", "B", "C"] as const;
const optionLabels = ["Visual", "Auditori", "Kinestetik"] as const;
const toneClasses = {
  blue: {
    icon: "bg-blue-100 text-blue-800",
    bar: "bg-blue-600",
  },
  teal: {
    icon: "bg-teal-100 text-teal-800",
    bar: "bg-teal-600",
  },
  amber: {
    icon: "bg-amber-100 text-amber-900",
    bar: "bg-amber-500",
  },
} as const;

export default function LearningStylePage() {
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    Array(questions.length).fill(null),
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentQuestion = questions[questionIndex];
  const answeredCount = answers.filter((answer) => answer !== null).length;
  const scores = [0, 0, 0];
  answers.forEach((answer) => {
    if (answer !== null) scores[answer] += 1;
  });
  const highestScore = Math.max(...scores);
  const dominantStyles = learningStyles.filter(
    (_, index) => scores[index] === highestScore,
  );

  function selectAnswer(optionIndex: number) {
    setAnswers((current) =>
      current.map((answer, index) => (index === questionIndex ? optionIndex : answer)),
    );
    setError(null);
  }

  function goToNext() {
    if (answers[questionIndex] === null) {
      setError("Pilih satu jawaban sebelum melanjutkan.");
      return;
    }

    if (questionIndex === questions.length - 1) {
      setShowResult(true);
      return;
    }

    setQuestionIndex((index) => index + 1);
    setError(null);
  }

  function goToPrevious() {
    setQuestionIndex((index) => Math.max(0, index - 1));
    setError(null);
  }

  function resetAssessment() {
    setAnswers(Array(questions.length).fill(null));
    setQuestionIndex(0);
    setShowResult(false);
    setError(null);
  }

  const progress = showResult ? 100 : (answeredCount / questions.length) * 100;

  return (
    <section aria-label="Asesmen diagnostik gaya belajar" className="mx-auto w-full max-w-5xl pb-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-teal-800">Kenali cara belajarmu</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Asesmen Diagnostik Gaya Belajar
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Pilih jawaban yang paling menggambarkan kebiasaanmu. Tidak ada jawaban benar atau salah.
          </p>
        </div>
        {!showResult && (
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600">
            <BookOpenText aria-hidden="true" size={15} className="text-teal-700" />
            15 pertanyaan · sekitar 3 menit
          </span>
        )}
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_270px]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {showResult ? (
            <div aria-live="polite" className="p-5 sm:p-8">
              <div className="flex items-start gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-teal-100 text-teal-800">
                  <Sparkles aria-hidden="true" size={22} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-teal-800">Hasil asesmenmu</p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                    {dominantStyles.length === 1
                      ? `Kecenderungan ${dominantStyles[0].name}`
                      : "Kecenderungan belajar seimbang"}
                  </h2>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                    {dominantStyles.length === 1
                      ? `${dominantStyles[0].label}. Hasil ini adalah gambaran kecenderungan, bukan batas tentang cara kamu bisa belajar.`
                      : `Skormu sama kuat pada ${dominantStyles.map((style) => style.name).join(" dan ")}. Kamu dapat menggabungkan beberapa cara belajar sesuai materi.`}
                  </p>
                </div>
              </div>

              <div className="mt-7 space-y-4" aria-label="Skor setiap gaya belajar">
                {learningStyles.map((style, index) => {
                  const Icon = style.icon;
                  const percentage = Math.round((scores[index] / questions.length) * 100);
                  const tone = toneClasses[style.tone];
                  return (
                    <div key={style.name}>
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="flex items-center gap-2 font-semibold text-slate-800">
                          <span className={`grid size-8 place-items-center rounded-lg ${tone.icon}`}>
                            <Icon aria-hidden="true" size={17} />
                          </span>
                          {style.name}
                          <span className="font-normal text-slate-500">
                            {scores[index]} dari {questions.length}
                          </span>
                        </span>
                        <span className="font-bold tabular-nums text-slate-800">{percentage}%</span>
                      </div>
                      <div
                        className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100"
                        role="progressbar"
                        aria-label={`Skor ${style.name}`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={percentage}
                      >
                        <div className={`h-full rounded-full ${tone.bar}`} style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-7 grid gap-4 md:grid-cols-2">
                {dominantStyles.map((style) => {
                  const Icon = style.icon;
                  const tone = toneClasses[style.tone];
                  return (
                    <section className="rounded-xl border border-slate-200 p-4" key={style.name}>
                      <div className="flex items-center gap-2">
                        <span className={`grid size-9 place-items-center rounded-lg ${tone.icon}`}>
                          <Icon aria-hidden="true" size={18} />
                        </span>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">Gaya {style.name}</h3>
                          <p className="text-xs text-slate-500">{style.label}</p>
                        </div>
                      </div>
                      <p className="mt-4 text-xs font-semibold uppercase text-slate-500">Ciri yang mungkin terasa akrab</p>
                      <ul className="mt-2 space-y-2 text-sm leading-5 text-slate-700">
                        {style.characteristics.map((characteristic) => (
                          <li className="flex gap-2" key={characteristic}>
                            <Check aria-hidden="true" className="mt-0.5 shrink-0 text-teal-700" size={16} />
                            <span>{characteristic}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-4 text-xs font-semibold uppercase text-slate-500">Tips belajar</p>
                      <ul className="mt-2 space-y-2 text-sm leading-5 text-slate-700">
                        {style.tips.map((tip) => (
                          <li className="flex gap-2" key={tip}>
                            <span aria-hidden="true" className={`mt-1.5 size-1.5 shrink-0 rounded-full ${tone.bar}`} />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </section>
                  );
                })}
              </div>

              <div className="mt-7 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
                <Button asChild className="h-11 rounded-xl bg-teal-800 px-4 text-white hover:bg-teal-900">
                  <Link href="/tutor">
                    <BookOpenText aria-hidden="true" />
                    Mulai Belajar di Ruang Cerita
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  className="h-11 rounded-xl px-4"
                  onClick={resetAssessment}
                  type="button"
                  variant="outline"
                >
                  <RotateCcw aria-hidden="true" />
                  Ulangi Tes
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="border-b border-slate-100 px-5 pt-5 sm:px-8 sm:pt-7">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-800">
                    Pertanyaan {questionIndex + 1} <span className="font-normal text-slate-500">dari {questions.length}</span>
                  </p>
                  <span className="text-xs font-semibold tabular-nums text-teal-800">
                    {Math.round(progress)}% terjawab
                  </span>
                </div>
                <div className="my-4 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-teal-700 transition-[width] duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="p-5 sm:p-8">
                <h2 className="text-lg font-bold leading-7 text-slate-900 sm:text-xl">
                  {currentQuestion.prompt}
                </h2>
                <fieldset className="mt-5 space-y-3">
                  <legend className="sr-only">Pilih jawaban yang paling sesuai</legend>
                  {currentQuestion.options.map((option, optionIndex) => {
                    const selected = answers[questionIndex] === optionIndex;
                    return (
                      <label
                        className={`flex min-h-16 cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors focus-within:ring-4 focus-within:ring-teal-500/15 ${
                          selected
                            ? "border-teal-600 bg-teal-50/70"
                            : "border-slate-200 hover:border-teal-300 hover:bg-slate-50"
                        }`}
                        key={optionLetters[optionIndex]}
                      >
                        <input
                          checked={selected}
                          className="sr-only"
                          name={`question-${questionIndex}`}
                          onChange={() => selectAnswer(optionIndex)}
                          type="radio"
                          value={optionLetters[optionIndex]}
                        />
                        <span
                          className={`grid size-7 shrink-0 place-items-center rounded-lg text-xs font-bold ${
                            selected ? "bg-teal-800 text-white" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {optionLetters[optionIndex]}
                        </span>
                        <span className="pt-0.5 text-sm leading-6 text-slate-700">{option}</span>
                      </label>
                    );
                  })}
                </fieldset>
                <p aria-live="polite" className="mt-3 min-h-5 text-sm text-rose-700">
                  {error}
                </p>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
                  <Button
                    className="h-10 rounded-xl px-3 sm:px-4"
                    disabled={questionIndex === 0}
                    onClick={goToPrevious}
                    type="button"
                    variant="outline"
                  >
                    <ArrowLeft aria-hidden="true" />
                    Sebelumnya
                  </Button>
                  <Button
                    className="h-10 rounded-xl bg-teal-800 px-3 text-white hover:bg-teal-900 sm:px-4"
                    onClick={goToNext}
                    type="button"
                  >
                    {questionIndex === questions.length - 1 ? "Lihat Hasil" : "Selanjutnya"}
                    <ArrowRight aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        {!showResult ? (
          <aside className="rounded-2xl border border-teal-100 bg-teal-50/70 p-5">
            <p className="text-sm font-bold text-teal-950">Progres asesmen</p>
            <div className="mt-4 grid grid-cols-5 gap-2" aria-label="Nomor pertanyaan">
              {questions.map((_, index) => {
                const current = index === questionIndex;
                const answered = answers[index] !== null;
                return (
                  <span
                    aria-current={current ? "step" : undefined}
                    aria-label={`Pertanyaan ${index + 1}${answered ? ", sudah dijawab" : ""}${current ? ", sedang dibuka" : ""}`}
                    className={`grid aspect-square place-items-center rounded-lg text-xs font-semibold tabular-nums ${
                      current
                        ? "bg-teal-800 text-white"
                        : answered
                          ? "bg-white text-teal-900 ring-1 ring-teal-200"
                          : "bg-teal-100/70 text-teal-800/70"
                    }`}
                    key={index}
                  >
                    {index + 1}
                  </span>
                );
              })}
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-700">
              {answeredCount} dari {questions.length} pertanyaan sudah dijawab. Jawabanmu tersimpan saat berpindah soal.
            </p>
            <div className="mt-5 border-t border-teal-200/70 pt-4">
              <p className="text-xs font-semibold uppercase text-teal-900">Pilihan jawaban</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {optionLabels.map((label, index) => (
                  <li className="flex items-center gap-2" key={label}>
                    <span className="grid size-6 place-items-center rounded-md bg-white text-[11px] font-bold text-teal-900">{optionLetters[index]}</span>
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        ) : (
          <aside className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5">
            <p className="text-sm font-bold text-amber-950">Catatan hasil</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Setiap orang bisa memiliki lebih dari satu cara belajar yang nyaman. Gunakan hasil ini sebagai petunjuk untuk mencoba strategi, bukan sebagai label tetap.
            </p>
          </aside>
        )}
      </div>
    </section>
  );
}