export type ChatPersona = "tutor" | "story";
export type ChatLearningMode = "micro" | "drill" | "deep";

export type ChatTurn = {
  role: "user" | "assistant";
  text: string;
};

type ChatRequest = {
  persona: ChatPersona;
  message: string;
  history: ChatTurn[];
  learningMode?: ChatLearningMode;
};

export async function requestChatReply(input: ChatRequest): Promise<string> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
    cache: "no-store",
  });

  const payload: unknown = await response.json().catch(() => null);
  if (!payload || typeof payload !== "object") {
    throw new Error("Balasan AI belum berhasil dibuat. Coba lagi sebentar.");
  }

  if (!response.ok) {
    const error = "error" in payload ? payload.error : null;
    throw new Error(
      typeof error === "string"
        ? error
        : "Balasan AI belum berhasil dibuat. Coba lagi sebentar.",
    );
  }

  const reply = "reply" in payload ? payload.reply : null;
  if (typeof reply !== "string" || !reply.trim()) {
    throw new Error("AI mengirim balasan kosong. Coba kirim ulang pesanmu.");
  }

  return reply;
}