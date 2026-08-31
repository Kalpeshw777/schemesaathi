"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useJourney } from "@/context/JourneyContext";
import { useTranslation } from "@/context/LanguageContext";
import { formatINR } from "@/lib/format";

interface Msg {
  role: "user" | "assistant";
  content: string;
  source?: string;
}

function formatMarkdown(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];

  let inTable = false;
  let tableRows: string[][] = [];

  const flushTable = (key: number) => {
    if (tableRows.length > 0) {
      const header = tableRows[0];
      const rows = tableRows.slice(1).filter((r) => !r.every((c) => c.includes("---")));
      elements.push(
        <div key={`table-${key}`} className="my-2 overflow-x-auto rounded-xl border border-white/15 liquid-glass-inner">
          <table className="min-w-full text-xs text-left">
            {header && (
              <thead className="bg-[#0B0F19] text-[#F97316] font-bold" style={{ color: "#F97316" }}>
                <tr>
                  {header.map((col, ci) => (
                    <th key={ci} className="px-2.5 py-1.5 border-b border-white/10">{col.trim()}</th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-white/10 bg-[#131B2E]">
              {rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-2.5 py-1.5 text-white font-medium" style={{ color: "#FFFFFF" }}>{cell.trim()}</td>
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
      inTable = true;
      const cells = trimmed
        .slice(1, -1)
        .split("|")
        .map((c) => c.trim());
      tableRows.push(cells);
      return;
    } else if (inTable) {
      flushTable(index);
    }

    if (trimmed.startsWith("### ")) {
      elements.push(
        <h4 key={index} className="font-extrabold text-white mt-2.5 mb-1 text-xs sm:text-sm" style={{ color: "#FFFFFF" }}>
          {trimmed.replace("### ", "")}
        </h4>
      );
    } else if (trimmed.startsWith("#### ")) {
      elements.push(
        <h5 key={index} className="font-bold text-[#FED7AA] mt-2 mb-0.5 text-xs" style={{ color: "#FED7AA" }}>
          {trimmed.replace("#### ", "")}
        </h5>
      );
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      elements.push(
        <li key={index} className="ml-3 list-disc text-xs leading-relaxed text-slate-100 font-medium" style={{ color: "#F1F5F9" }}>
          {renderInline(trimmed.substring(2))}
        </li>
      );
    } else if (/^\d+\.\s/.test(trimmed)) {
      elements.push(
        <li key={index} className="ml-4 list-decimal text-xs leading-relaxed text-slate-100 font-medium" style={{ color: "#F1F5F9" }}>
          {renderInline(trimmed.replace(/^\d+\.\s/, ""))}
        </li>
      );
    } else if (trimmed === "") {
      elements.push(<div key={index} className="h-1.5" />);
    } else {
      elements.push(
        <p key={index} className="text-xs leading-relaxed text-slate-100 my-1 font-medium" style={{ color: "#F1F5F9" }}>
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
        <strong key={i} className="font-extrabold text-white" style={{ color: "#FFFFFF" }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={i} className="italic text-[#FED7AA]" style={{ color: "#FED7AA" }}>
          {part.slice(1, -1)}
        </em>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="rounded bg-white/15 px-1 py-0.5 font-mono text-[11px] text-[#FED7AA]" style={{ color: "#FED7AA" }}>
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
  const [apiKey, setApiKey] = useState("");
  const [savedKey, setSavedKey] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Initialize localized greeting
  useEffect(() => {
    if (messages.length === 0) {
      let greeting = "👋 Namaste! I am **Saathi AI**, your real-time government loan scheme advisor.\n\nTell me your project idea or ask which official schemes (NSFDC, Stand-Up India, MUDRA, ELS) you qualify for!";
      if (lang === "hi") {
        greeting = "👋 नमस्ते! मैं आपका **साथी AI** सरकारी ऋण सलाहकार हूँ।\n\nमुझसे योजनाओं, ब्याज दरों, ईएमआई और आवश्यक दस्तावेज़ों के बारे में हिन्दी में पूछें!";
      } else if (lang === "mr") {
        greeting = "👋 नमस्कार! मी तुमचा **साथी AI** शासकीय कर्ज सल्लागार आहे.\n\nमला योजनांची पात्रता, व्याजदर, EMI आणि आवश्यक कागदपत्रांबद्दल मराठीत विचारा!";
      }
      setMessages([{ role: "assistant", content: greeting }]);
    }
  }, [lang, messages.length]);

  // Dynamic real-time suggestion pills based on live user journey & language
  const dynamicSuggestions = useMemo(() => {
    if (lang === "hi") {
      if (recommendation && profile) {
        return [
          `${formatINR(recommendation.eligibleAmount)} के लिए मेरी मासिक ईएमआई क्या होगी?`,
          `${profile.district || "मेरे जिले"} में कम NPA वाली बैंक शाखाएं कौन सी हैं?`,
          `${profile.activityType} के लिए DPR प्रोजेक्ट रिपोर्ट कैसे बनाएं?`,
          `क्या मुझे स्टैंड-अप इंडिया या मुद्रा योजना का भी लाभ मिल सकता है?`,
        ];
      }
      return [
        "₹3 लाख की डेयरी या दुकान के लिए कौन सी योजना सही है?",
        "अनुसूचित जाति (SC) उच्च शिक्षा के लिए अधिकतम ऋण सीमा क्या है?",
        "टर्म लोन और माइक्रो फाइनेंस की ब्याज दरें क्या हैं?",
        "आवेदन करने के लिए आवश्यक सभी दस्तावेज़ों की सूची?",
      ];
    }

    if (lang === "mr") {
      if (recommendation && profile) {
        return [
          `${formatINR(recommendation.eligibleAmount)} साठी माझा मासिक EMI किती असेल?`,
          `${profile.district || "माझ्या जिल्ह्यात"} सर्वात चांगल्या अधिकृत बँका कोणत्या?`,
          `${profile.activityType} साठी DPR प्रकल्प अहवाल कसा तयार करावा?`,
          `मला स्टँड-अप इंडिया किंवा मुद्रा योजनेचाही फायदा मिळेल का?`,
        ];
      }
      return [
        "₹3 लाख दुग्धव्यवसाय किंवा दुकानासाठी कोणती योजना योग्य आहे?",
        "उच्च शिक्षणासाठी शासकीय कर्जाची कमाल मर्यादा किती आहे?",
        "टर्म लोन आणि मायक्रो फायनान्सचे व्याजदर काय आहेत?",
        "अर्ज करण्यासाठी आवश्यक कागदपत्रांची संपूर्ण यादी?",
      ];
    }

    if (recommendation && profile) {
      return [
        `What is my exact monthly EMI for ${formatINR(recommendation.eligibleAmount)}?`,
        `Which bank branches in ${profile.district || "my district"} have low NPA?`,
        `How do I prepare a Detailed Project Report for ${profile.activityType}?`,
        `Do I qualify for Stand-Up India or MUDRA scheme too?`,
      ];
    }
    return [
      "Which scheme fits a ₹3 lakh business or dairy project?",
      "What is the maximum loan limit for SC higher education?",
      "What are the interest rates for Term Loan & Micro Finance?",
      "Complete checklist of documents needed to apply?",
    ];
  }, [profile, recommendation, lang]);

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
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#22C55E]" />
          </span>
        </button>
      )}
      {open && (
        <div className="fixed bottom-3 right-3 z-50 flex h-[min(560px,86vh)] w-[calc(100vw-24px)] max-w-[430px] flex-col overflow-hidden rounded-3xl liquid-glass shadow-2xl print:hidden sm:bottom-6 sm:right-6">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-[#1E3A5F] to-[#131B2E] px-4 py-3.5 text-white border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#F97316] text-xs font-black text-white shadow-sm">
                ₹
              </span>
              <div>
                <p className="text-sm font-extrabold leading-tight text-white" style={{ color: "#FFFFFF" }}>{t("chat_title")}</p>
                <p className="text-[10px] text-[#FED7AA] font-semibold" style={{ color: "#FED7AA" }}>
                  {savedKey ? "✨ Groq Llama 3.3 Active" : `🏛️ ${t("chat_sub")}`}
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
            <div className="bg-[#1E3A5F]/80 px-3.5 py-1.5 border-b border-white/10 text-[11px] flex items-center justify-between text-[#FED7AA] font-bold">
              <span>📍 {profile.district || "District"}, {profile.state || "State"}</span>
              <span>🎯 {profile.activityType || profile.purpose} ({formatINR(profile.projectCost)})</span>
            </div>
          )}

          {/* Settings Drawer */}
          {showSettings && (
            <div className="border-b border-white/10 bg-[#0B0F19] p-3.5 text-xs">
              <p className="font-bold text-white" style={{ color: "#FFFFFF" }}>Groq API Key (Optional)</p>
              <p className="mt-0.5 text-[11px] text-slate-300">
                Paste your Groq API key for cloud Llama 3.3 70B inference:
              </p>
              <div className="mt-2 flex gap-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="gsk_..."
                  className="flex-1 rounded-xl border border-white/20 bg-[#131B2E] px-3 py-1.5 text-xs text-white outline-none focus:border-[#F97316]"
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
          <div className="flex-1 space-y-3 overflow-y-auto bg-[#0B0F19]/60 p-3.5 scrollable-touch">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-xs ${
                    m.role === "user"
                      ? "rounded-br-xs bg-[#F97316] text-white shadow-md font-medium"
                      : "rounded-bl-xs border border-white/15 liquid-glass text-white shadow-sm"
                  }`}
                  style={{ color: "#FFFFFF" }}
                >
                  {m.role === "user" ? (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  ) : (
                    <div>
                      {formatMarkdown(m.content)}
                      <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] font-semibold text-slate-300">
                        <span style={{ color: m.source === "groq" ? "#FED7AA" : "#94A3B8" }}>
                          {m.source === "groq"
                            ? "✨ Groq Llama 3.3 70B"
                            : "🏛️ SchemeSaathi Expert AI"}
                        </span>
                        {m.source === "groq" ? (
                          <span className="rounded bg-emerald-500/20 px-1.5 py-0.2 text-[9px] font-black text-emerald-400 border border-emerald-500/30">
                            LIVE CLOUD AI
                          </span>
                        ) : (
                          <span className="rounded bg-white/10 px-1.5 py-0.2 text-[9px] font-bold text-slate-400">
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
                <div className="rounded-2xl rounded-bl-xs border border-white/15 liquid-glass-inner px-3.5 py-2 text-xs text-[#FB923C] flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#F97316] animate-ping" />
                  <span className="font-bold text-[#FED7AA]" style={{ color: "#FED7AA" }}>{t("chat_thinking")}</span>
                </div>
              </div>
            )}

            {/* Dynamic Suggestion Pills */}
            {!loading && (
              <div className="pt-2 border-t border-white/10">
                <p className="text-[10px] uppercase font-bold text-[#FED7AA] mb-1.5" style={{ color: "#FED7AA" }}>
                  {t("chat_suggested")}
                </p>
                <div className="flex flex-col gap-1.5">
                  {dynamicSuggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-xl border border-white/15 liquid-glass-inner px-3 py-1.5 text-xs font-semibold text-[#FED7AA] hover:bg-[#1E3A5F] hover:border-[#F97316]/50 transition-colors text-left truncate"
                      style={{ color: "#FED7AA" }}
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
            className="flex gap-2 border-t border-white/15 bg-[#0B0F19] p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("chat_ph")}
              className="flex-1 rounded-xl border border-white/20 bg-[#131B2E] px-3 py-2 text-xs text-white outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/30"
              style={{ color: "#FFFFFF" }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-xl bg-[#F97316] px-4 py-2 text-xs font-bold text-white disabled:opacity-40 hover:bg-[#EA580C] transition-colors shadow-md shadow-orange-500/20"
              style={{ color: "#FFFFFF" }}
            >
              {t("chat_send")}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
