"use client";

import { useRef, useState } from "react";
import {
  Heart,
  HeartHandshake,
  MessageCircleHeart,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  ConversationPanel,
  type ConversationMessage,
} from "@/components/conversation-panel";
import { requestChatReply } from "@/lib/ai/chat-client";

const openingTopics = [
  "Lagi capek hafalan/tugas",
  "Bingung bagi waktu",
  "Lagi rindu rumah",
  "Ingin cerita hariku",
];

const urgentConcernPattern =
  /bunuh diri|mengakhiri hidup|ingin mati|menyakiti diri|melukai diri|tidak ingin hidup|tidak aman|diancam|dilecehkan|disakiti/i;

export default function TemanCeritaPage() {
  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      id: 1,
      role: "assistant",
      text: "Hai, aku di sini untuk mendengarkan. Kamu tidak perlu merapikan ceritamu atau mencari jawaban sekarang. Apa yang sedang terasa di pikiranmu?",
    },
  ]);
  const [isReplying, setIsReplying] = useState(false);
  const nextMessageId = useRef(2);

  async function sendStory(message: string) {
    const userMessage: ConversationMessage = {
      id: nextMessageId.current++,
      role: "user",
      text: message,
    };

    setMessages((current) => [...current, userMessage]);

    if (urgentConcernPattern.test(message)) {
      setMessages((current) => [
        ...current,
        {
          id: nextMessageId.current++,
          role: "assistant",
          text: "Terima kasih sudah berani menyampaikan ini. Kamu tidak harus menghadapinya sendirian. Tolong temui guru, wali, pendamping asrama, atau orang dewasa yang kamu percaya sekarang. Jika ada bahaya langsung, cari tempat aman dan hubungi layanan darurat setempat.",
        },
      ]);
      return;
    }

    setIsReplying(true);

    try {
      const reply = await requestChatReply({
        persona: "story",
        message,
        history: messages.slice(1).slice(-10).map(({ role, text }) => ({ role, text })),
      });
      const assistantMessage: ConversationMessage = {
        id: nextMessageId.current++,
        role: "assistant",
        text: reply,
      };

      setMessages((current) => [...current, assistantMessage]);
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

  return (
    <div className="space-y-6 pb-4">
      <section className="flex flex-col justify-between gap-5 rounded-2xl border border-amber-100 bg-white p-5 shadow-[0_4px_24px_-2px_rgba(13,148,136,0.04),0_2px_8px_-1px_rgba(15,23,42,0.03)] sm:flex-row sm:items-end sm:p-6">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-amber-900">
            <span className="grid size-8 place-items-center rounded-xl bg-amber-100 text-amber-900">
              <Heart aria-hidden="true" size={17} />
            </span>
            Ruang obrolan yang hangat
          </p>
          <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            Teman Cerita
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
            Ruang untuk bercerita santai dan didengarkan tanpa dihakimi. Kamu boleh mulai dari hal kecil.
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">
          <span className="size-2 rounded-full bg-amber-600" />
          Didukung Gemini · Tanpa login
        </span>
      </section>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(270px,0.8fr)]">
        <ConversationPanel
          assistantIcon={MessageCircleHeart}
          assistantLabel="Sahabat Pendengar"
          helperText="Pesan dikirim ke Google Gemini untuk dibuat balasan dan tidak disimpan oleh aplikasi. Hindari membagikan data pribadi. Teman Cerita bukan layanan konseling."
          inputLabel="Tulis ceritamu"
          isReplying={isReplying}
          messages={messages}
          onSend={sendStory}
          placeholder="Tulis apa yang sedang kamu rasakan..."
          quickPromptLabel="Kalau belum tahu mulai dari mana"
          quickPrompts={openingTopics}
          statusLabel="Gemini AI"
          tone="story"
          typingLabel="Sedang merangkai balasan..."
        />

        <aside className="space-y-4">
          <section className="rounded-2xl bg-amber-50 p-5">
            <div className="flex items-center gap-2 text-amber-950">
              <Sparkles aria-hidden="true" size={18} />
              <h2 className="text-sm font-semibold">Tidak perlu terburu-buru</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Ceritamu tidak harus runtut. Kamu boleh berhenti, mengganti topik, atau mengambil jeda kapan saja.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-teal-900">
              <ShieldCheck aria-hidden="true" size={18} />
              <h2 className="text-sm font-semibold">Batas ruang ini</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Sahabat Pendengar adalah persona demo, bukan konselor atau psikolog. Pesan di halaman ini tidak tersimpan dan tidak otomatis diteruskan ke siapa pun.
            </p>
          </section>

          <section className="rounded-2xl border border-teal-100 bg-teal-50/70 p-5">
            <div className="flex items-center gap-2 text-teal-900">
              <HeartHandshake aria-hidden="true" size={18} />
              <h2 className="text-sm font-semibold">Perlu ditemani seseorang?</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Jika kamu membutuhkan dukungan langsung atau merasa tidak aman, temui guru, wali, Guru BK, pendamping asrama, atau orang dewasa yang kamu percaya.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}