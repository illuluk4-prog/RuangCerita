"use client";

import { useState } from "react";
import {
  Lightbulb,
  LoaderCircle,
  MessageCircle,
  Send,
  Sparkles,
  UserRound,
  type LucideIcon,
} from "lucide-react";

export type ConversationMessage = {
  id: number;
  role: "user" | "assistant";
  text: string;
};

type ConversationPanelProps = {
  assistantIcon?: LucideIcon;
  assistantLabel: string;
  helperText: string;
  inputLabel: string;
  isReplying: boolean;
  messages: ConversationMessage[];
  onSend: (message: string) => void;
  placeholder: string;
  quickPromptLabel: string;
  quickPrompts: string[];
  statusLabel: string;
  tone?: "learning" | "story";
  typingLabel: string;
};

export function ConversationPanel({
  assistantIcon: AssistantIcon = Sparkles,
  assistantLabel,
  helperText,
  inputLabel,
  isReplying,
  messages,
  onSend,
  placeholder,
  quickPromptLabel,
  quickPrompts,
  statusLabel,
  tone = "learning",
  typingLabel,
}: ConversationPanelProps) {
  const [draft, setDraft] = useState("");
  const isStoryTone = tone === "story";

  function send(value: string) {
    const text = value.trim();
    if (!text || isReplying) return;
    onSend(text);
    setDraft("");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    send(draft);
  }

  return (
    <section className="flex min-h-[490px] flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_4px_24px_-2px_rgba(13,148,136,0.04),0_2px_8px_-1px_rgba(15,23,42,0.03)] sm:min-h-[560px]">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex min-w-0 items-center gap-2">
          <MessageCircle
            aria-hidden="true"
            className={isStoryTone ? "shrink-0 text-amber-800" : "shrink-0 text-teal-800"}
            size={18}
          />
          <h2 className="truncate text-sm font-semibold text-slate-900">{assistantLabel}</h2>
        </div>
        <span className="shrink-0 text-xs text-slate-500">{statusLabel}</span>
      </div>

      <div
        aria-label={`Percakapan dengan ${assistantLabel}`}
        aria-live="polite"
        className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6"
        role="log"
      >
        {messages.map((message) => (
          <div
            className={`flex items-start gap-3 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
            key={message.id}
          >
            {message.role === "assistant" && (
              <span
                className={`grid size-9 shrink-0 place-items-center rounded-xl ${
                  isStoryTone ? "bg-amber-100 text-amber-900" : "bg-teal-800 text-white"
                }`}
              >
                <AssistantIcon aria-hidden="true" size={17} />
              </span>
            )}
            <div
              className={`max-w-[88%] sm:max-w-[82%] ${
                message.role === "user" ? "order-first" : ""
              }`}
            >
              <p
                className={`mb-1 text-[11px] font-semibold ${
                  message.role === "user"
                    ? "text-right text-slate-500"
                    : isStoryTone
                      ? "text-amber-900"
                      : "text-teal-800"
                }`}
              >
                {message.role === "user" ? "Kamu" : assistantLabel}
              </p>
              <div
                className={`whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.role === "user"
                    ? "rounded-tr-sm bg-teal-800 text-white"
                    : isStoryTone
                      ? "rounded-tl-sm bg-amber-50/80 text-slate-700"
                      : "rounded-tl-sm bg-slate-50 text-slate-700"
                }`}
              >
                {message.text}
              </div>
            </div>
            {message.role === "user" && (
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600">
                <UserRound aria-hidden="true" size={17} />
              </span>
            )}
          </div>
        ))}
        {isReplying && (
          <div className="flex items-center gap-2 pl-12 text-xs text-slate-500" role="status">
            <LoaderCircle aria-hidden="true" className="animate-spin" size={15} />
            {typingLabel}
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 p-4 sm:p-5">
        <div className="mb-3 flex items-center gap-2 text-[11px] font-medium text-slate-500">
          <Lightbulb
            aria-hidden="true"
            className={isStoryTone ? "text-amber-700" : "text-amber-700"}
            size={15}
          />
          {quickPromptLabel}
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          {quickPrompts.map((prompt) => (
            <button
              className={`min-h-9 rounded-full border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-4 disabled:opacity-50 ${
                isStoryTone
                  ? "hover:border-amber-300 hover:bg-amber-50 focus-visible:ring-amber-500/20"
                  : "hover:border-teal-300 hover:bg-teal-50 focus-visible:ring-teal-500/20"
              }`}
              disabled={isReplying}
              key={prompt}
              onClick={() => send(prompt)}
              type="button"
            >
              {prompt}
            </button>
          ))}
        </div>
        <form className="flex items-center gap-2 rounded-2xl bg-slate-50 p-2" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor={`conversation-input-${tone}`}>
            {inputLabel}
          </label>
          <input
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            id={`conversation-input-${tone}`}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={placeholder}
            value={draft}
          />
          <button
            aria-label="Kirim pesan"
            className={`grid size-10 shrink-0 place-items-center rounded-xl text-white transition-colors focus-visible:outline-none focus-visible:ring-4 disabled:opacity-50 ${
              isStoryTone
                ? "bg-amber-800 hover:bg-amber-900 focus-visible:ring-amber-500/30"
                : "bg-teal-800 hover:bg-teal-900 focus-visible:ring-teal-500/30"
            }`}
            disabled={!draft.trim() || isReplying}
            type="submit"
          >
            <Send aria-hidden="true" size={17} />
          </button>
        </form>
        <p className="mt-2 text-[11px] leading-5 text-slate-500">{helperText}</p>
      </div>
    </section>
  );
}