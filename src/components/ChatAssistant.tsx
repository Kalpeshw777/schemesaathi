"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useJourney } from "@/context/JourneyContext";
import { useTranslation } from "@/context/LanguageContext";
import { formatINR } from "@/lib/format";

interface Msg {
  role: "user" | "assistant";
  content: string;
  source?: "groq" | "expert-ai";
}

function formatMarkdown(content: string): React.ReactNode {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inTable = false;
  let tableRows: string[][] = [];

  const flushTable = (keyPrefix: number) => {
    if (tableRows.length > 0) {
      elements.push(
        <div key={`table-${keyPrefix}`} className="my-2.5 overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10 liquid-glass-inner">
          <table className="min-w-full text-left text-[11px]">
            <thead className="bg-slate-100 dark:bg-[#0B0F19] text-[#EA580C] dark:text-[#FED7AA] font-bold">
              <tr>
                {tableRows[0].map((cell, idx) => (
                  <th key={idx} className="px-2.5 py-1.5 border-b border-slate-200 dark:border-white/10 font-bold">
                    {renderInline(cell.trim())}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5 bg-white dark:bg-[#131B2E]">
              {tableRows.slice(1).map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-white/5">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-2.5 py-1.5 text-slate-800 dark:text-slate-100">
                      {renderInline(cell.trim())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const cells = trimmed
        .slice(1, -1)
        .split("|")
        .map((c) => c.trim());
      if (cells.every((c) => /^:?-+:?$/.test(c))) {
        return; // Separator row
      }
      inTable = true;
      tableRows.push(cells);
      return;
    }

    if (inTable) flushTable(index);

    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 key={index} className="text-xs sm:text-sm font-black text-slate-900 dark:text-white mt-2 mb-1">
          {renderInline(trimmed.slice(4))}
        </h3>
      );
    } else if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={index} className="text-sm sm:text-base font-black text-[#EA580C] dark:text-[#FED7AA] mt-2.5 mb-1">
          {renderInline(trimmed.slice(3))}
        </h2>
      );
    } else if (trimmed.startsWith("# ")) {
      elements.push(
        <h1 key={index} className="text-base sm:text-lg font-black text-[#F97316] mt-3 mb-1.5">
          {renderInline(trimmed.slice(2))}
        </h1>
      );
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      elements.push(
        <li key={index} className="ml-3 list-disc text-xs leading-relaxed text-slate-700 dark:text-slate-100 font-medium">
          {renderInline(trimmed.substring(2))}
        </li>
      );
    } else if (/^\d+\.\s/.test(trimmed)) {
      elements.push(
        <li key={index} className="ml-4 list-decimal text-xs leading-relaxed text-slate-700 dark:text-slate-100 font-medium">
          {renderInline(trimmed.replace(/^\d+\.\s/, ""))}
        </li>
      );
    } else if (trimmed === "") {
      elements.push(<div key={index} className="h-1.5" />);
    } else {
      elements.push(
        <p key={index} className="text-xs leading-relaxed text-slate-800 dark:text-slate-100 my-1 font-medium">
          {renderInline(trimmed)}
        </p>
      );
    }
  });

  if (inTable) flushTable(lines.length);
  return elements;
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-extrabold text-slate-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={i} className="italic text-[#EA580C] dark:text-[#FED7AA]">
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="rounded bg-black/5 dark:bg-white/15 px-1 py-0.5 font-mono text-[11px] text-[#EA580C] dark:text-[#FED7AA]">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export default function ChatAssistant() {
  const { profile, recommendation } = useJourney();
  const { lang, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [savedKey, setSavedKey] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  // Initial welcome greeting
  useEffect(() => {
    const greetingText =
      lang === "hi"
        ? "नमस्ते! मैं योजना साथी AI हूँ। आप मुझसे सामाजिक न्याय मंत्रालय, NSFDC, Stand-Up India या MUDRA योजनाओं के बारे में कुछ भी पूछ सकते हैं।"
        : lang === "mr"
        ? "नमस्कार! मी योजना साथी AI आहे. तुम्ही मला सामाजिक न्याय मंत्रालय, NSFDC, Stand-Up India किंवा MUDRA योजनांबद्दल काहीही विचारू शकता."
        : "Hello! I am SchemeSaathi AI. Ask me anything about government concessional loan schemes, interest rates, or channel partners.";

    setMessages([
      {
        role: "assistant",
        content: greetingText,
        source: "expert-ai",
      },
    ]);
  }, [lang]);

  // Context-aware dynamic suggestions
  const dynamicSuggestions = useMemo(() => {
    if (profile && recommendation) {
      return [
        `How do I apply for ${recommendation.schemeName} in ${profile.district || "my district"}?`,
        `What is the exact margin money and subsidy for ₹${new Intl.NumberFormat("en-IN").format(profile.projectCost)}?`,
        `Which bank branches in ${profile.district || "my district"} have low NPA?`,
        `How do I prepare a Detailed Project Report for ${profile.activityType}?`,
      ];
    }
    return [
      "Which scheme fits a ₹3 lakh business or dairy project?",
      "What is the maximum loan limit for SC higher education?",
      "What are the interest rates for Term Loan & Micro Finance?",
      "Complete checklist of documents needed to apply?",
    ];
  }, [profile, recommendation]);

  useEffect(() => {
    const key = localStorage.getItem("groq-api-key") || "";
    setSavedKey(key);
    setApiKey(key);
  }, []);

  useEffect(() => {
    if (open) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const saveKey = () => {
    const trimmed = apiKey.trim();
    if (trimmed) {
      localStorage.setItem("groq-api-key", trimmed);
      setSavedKey(trimmed);
    } else {
      localStorage.removeItem("groq-api-key");
      setSavedKey("");
    }
    setShowSettings(false);
  };

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Msg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (savedKey) {
        headers["x-groq-key"] = savedKey;
      }
      const res = await fetch("/api/chat", {
        method: "POST",
        headers,
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          profile: profile || null,
          recommendation: recommendation || null,
          apiKey: savedKey,
          lang: lang || "en",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to respond");
      setMessages([...newMessages, { role: "assistant", content: data.reply, source: data.source }]);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Sorry, I ran into an error connecting to the AI assistant. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open chat assistant"
          className="fixed bottom-4 right-4 z-40 flex h-13 w-13 items-center justify-center rounded-full bg-[#F97316] text-2xl text-white shadow-2xl transition hover:scale-105 hover:bg-[#EA580C] print:hidden sm:bottom-6 sm:right-6 sm:h-14 sm:w-14 shadow-orange-500/30 group"
        >
          <span className="group-hover:scale-110 transition-transform">💬</span>
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] dark:bg-[#22C55E] opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#16A34A] dark:bg-[#22C55E]" />
          </span>
        </button>
      )}
      {open && (
        <div className="fixed bottom-3 right-3 z-50 flex h-[min(560px,86vh)] w-[calc(100vw-24px)] max-w-[430px] flex-col overflow-hidden rounded-3xl liquid-glass shadow-2xl print:hidden sm:bottom-6 sm:right-6 border border-slate-300 dark:border-white/15">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-[#1E3A5F] to-[#0F172A] dark:from-[#1E3A5F] dark:to-[#131B2E] px-4 py-3.5 text-white border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#F97316] text-xs font-black text-white shadow-sm">
                ₹
              </span>
              <div>
                <p className="text-sm font-extrabold leading-tight text-white">{t("chat_title")}</p>
                <p className="text-[10px] text-[#FED7AA] font-semibold">
                  {savedKey ? "✨ Groq AI Active" : `🏛️ ${t("chat_sub")}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                title="AI Settings"
                className="rounded-lg p-1.5 text-xs text-[#FED7AA] hover:bg-white/10 hover:text-white transition"
              >
                ⚙️
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="rounded-lg p-1 text-xl leading-none text-[#FED7AA] hover:bg-white/10 hover:text-white transition"
              >
                ×
              </button>
            </div>
          </div>

          {/* Profile Banner inside chat if active */}
          {profile && (
            <div className="bg-[#1E3A5F]/90 px-3.5 py-1.5 border-b border-white/10 text-[11px] flex items-center justify-between text-[#FED7AA] font-bold">
              <span>📍 {profile.district || "District"}, {profile.state || "State"}</span>
              <span>🎯 {profile.activityType || profile.purpose} ({formatINR(profile.projectCost)})</span>
            </div>
          )}

          {/* Settings Drawer */}
          {showSettings && (
            <div className="border-b border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-[#0B0F19] p-3.5 text-xs">
              <p className="font-bold text-slate-900 dark:text-white">Groq API Key (Optional)</p>
              <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-300">
                Paste your Groq API key for cloud AI inference:
              </p>
              <div className="mt-2 flex gap-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="gsk_..."
                  className="flex-1 rounded-xl border border-slate-300 dark:border-white/20 bg-white dark:bg-[#131B2E] px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#F97316]"
                />
                <button
                  type="button"
                  onClick={saveKey}
                  className="rounded-xl bg-[#F97316] px-3.5 py-1.5 font-bold text-white hover:bg-[#EA580C]"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Chat Messages Area */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/70 dark:bg-[#0B0F19]/60 p-3.5 scrollable-touch">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-xs ${
                    m.role === "user"
                      ? "rounded-br-xs bg-[#F97316] text-white shadow-md font-medium"
                      : "rounded-bl-xs border border-slate-200 dark:border-white/15 liquid-glass shadow-sm"
                  }`}
                >
                  {m.role === "user" ? (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  ) : (
                    <div>
                      {formatMarkdown(m.content)}
                      <div className="mt-2 pt-1.5 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[10px] font-semibold text-slate-500 dark:text-slate-300">
                        <span style={{ color: m.source === "groq" ? "#EA580C" : "#64748B" }}>
                          {m.source === "groq"
                            ? "✨ Groq AI Cloud"
                            : "🏛️ SchemeSaathi Expert AI"}
                        </span>
                        {m.source === "groq" ? (
                          <span className="rounded bg-emerald-500/15 px-1.5 py-0.2 text-[9px] font-black text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                            LIVE CLOUD AI
                          </span>
                        ) : (
                          <span className="rounded bg-black/5 dark:bg-white/10 px-1.5 py-0.2 text-[9px] font-bold text-slate-500 dark:text-slate-400">
                            OFFLINE ENGINE
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-xs border border-slate-200 dark:border-white/15 liquid-glass-inner px-3.5 py-2 text-xs text-[#EA580C] dark:text-[#FB923C] flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#F97316] animate-ping" />
                  <span className="font-bold text-[#EA580C] dark:text-[#FED7AA]">{t("chat_thinking")}</span>
                </div>
              </div>
            )}

            {/* Dynamic Suggestion Pills */}
            {!loading && (
              <div className="pt-2 border-t border-slate-200 dark:border-white/10">
                <p className="text-[10px] uppercase font-bold text-[#EA580C] dark:text-[#FED7AA] mb-1.5">
                  {t("chat_suggested")}
                </p>
                <div className="flex flex-col gap-1.5">
                  {dynamicSuggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-xl border border-slate-300 dark:border-white/15 liquid-glass-inner px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-[#FED7AA] hover:bg-[#F97316]/10 hover:border-[#F97316]/50 transition-colors text-left truncate"
                    >
                      → {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2 border-t border-slate-200 dark:border-white/15 bg-white dark:bg-[#0B0F19] p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("chat_ph")}
              className="flex-1 rounded-xl border border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-[#131B2E] px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-[#F97316] font-medium"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-xl bg-[#F97316] px-4 py-2 text-xs font-bold text-white hover:bg-[#EA580C] disabled:opacity-50 transition shadow-sm"
            >
              {t("chat_send")}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
