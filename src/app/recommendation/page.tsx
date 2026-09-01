"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useJourney } from "@/context/JourneyContext";
import { formatINR } from "@/lib/format";
import SiteBackground from "@/components/SiteBackground";

interface Explanation {
  explanation: string;
  tips: string[];
  source: "groq" | "fallback";
}

export default function RecommendationPage() {
  const router = useRouter();
  const { profile, recommendation, ready } = useJourney();
  const [ai, setAi] = useState<Explanation | null>(() => {
    if (recommendation?.aiExplanation) {
      return {
        explanation: recommendation.aiExplanation,
        tips: recommendation.aiTips ?? [],
        source: recommendation.source ?? "groq",
      };
    }
    return null;
  });
  const [aiLoading, setAiLoading] = useState(false);
  const requested = useRef(false);

  useEffect(() => {
    if (ready && !recommendation) {
      router.replace("/wizard");
    }
  }, [ready, recommendation, router]);

  useEffect(() => {
    if (!profile || !recommendation || requested.current) return;
    if (recommendation.aiExplanation) {
      setAi({
        explanation: recommendation.aiExplanation,
        tips: recommendation.aiTips ?? [],
        source: recommendation.source ?? "groq",
      });
      return;
    }
    requested.current = true;
    setAiLoading(true);
    const storedKey =
      typeof window !== "undefined"
        ? localStorage.getItem("groq-api-key") || ""
        : "";
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (storedKey) {
      headers["x-groq-key"] = storedKey;
    }
    fetch("/api/explain", {
      method: "POST",
      headers,
      body: JSON.stringify({ profile, recommendation, apiKey: storedKey }),
    })
      .then((r) => r.json())
      .then(setAi)
      .catch(() =>
        setAi({
          explanation: "Could not load the AI explanation right now.",
          tips: [],
          source: "fallback",
        })
      )
      .finally(() => setAiLoading(false));
  }, [profile, recommendation]);

  if (!ready || !recommendation || !profile) {
    return (
      <div className="relative min-h-screen flex items-center justify-center py-32 text-[var(--foreground)]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#F97316]/20 border-t-[#F97316]" />
          <p className="text-xs sm:text-sm font-semibold text-[#EA580C] dark:text-[#FED7AA]">Matching your government scheme…</p>
        </div>
      </div>
    );
  }

  const confStyles = {
    high: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 font-bold",
    medium: "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40 font-bold",
    low: "bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/40 font-bold",
  }[recommendation.confidence];

  return (
    <div className="relative min-h-screen text-[var(--foreground)] overflow-x-hidden py-8 sm:py-12">
      {/* Static Minimalist Ambient Background */}
      <SiteBackground interactive={false} />

      {/* Foreground Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-3.5 sm:px-4">
        {/* Header Tag */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full liquid-glass-active px-3.5 py-1 text-xs font-bold tracking-wide uppercase shadow-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            AI Scheme Recommendation
          </span>
        </div>

        {/* Main Scheme Hero Card */}
        <div className="mt-5 sm:mt-6 overflow-hidden rounded-3xl liquid-glass shadow-sm dark:shadow-2xl">
          <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent dark:from-[#1E3A5F]/90 dark:via-[#131B2E]/90 dark:to-[#0B0F19]/90 backdrop-blur-2xl p-5 sm:p-8 md:p-12 text-center border-b border-slate-200 dark:border-white/10">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span
                className={`inline-block rounded-full border px-3 py-0.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider ${confStyles}`}
              >
                {recommendation.confidence} match
              </span>
              <span className="inline-block rounded-full border border-slate-300 dark:border-white/15 liquid-glass-inner px-2.5 py-0.5 text-[11px] sm:text-xs font-bold text-[#EA580C] dark:text-[#FED7AA]">
                {recommendation.source === "groq"
                  ? "✨ Groq AI Evaluated"
                  : "✨ AI Evaluated"}
              </span>
            </div>
            <h1 className="mt-3 sm:mt-4 text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {recommendation.schemeName}
            </h1>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-200 font-medium max-w-lg mx-auto leading-relaxed">
              {recommendation.tagline}
            </p>
            <p className="mt-4 sm:mt-6 text-3xl sm:text-4xl md:text-5xl font-black text-[#F97316] drop-shadow-sm">
              {formatINR(recommendation.eligibleAmount)}
            </p>
            <p className="mt-1 text-[11px] sm:text-xs text-[#EA580C] dark:text-[#FED7AA] font-bold tracking-wide uppercase">
              estimated eligible loan limit
            </p>
          </div>

          {/* Key Metric Pillars */}
          <div className="grid grid-cols-2 divide-x divide-y md:divide-y-0 divide-slate-200 dark:divide-white/10 md:grid-cols-4 liquid-glass-inner">
            {[
              { label: "Interest rate", value: `${recommendation.interestRate}% p.a.` },
              { label: "Grace period", value: `${recommendation.moratoriumMonths} months` },
              {
                label: "Max tenure",
                value: `${Math.round(recommendation.maxTenureMonths / 12)} years`,
              },
              { label: "Financed", value: "up to 90%" },
            ].map((t) => (
              <div key={t.label} className="px-3 py-3.5 sm:px-4 sm:py-5 text-center">
                <p className="text-base sm:text-lg md:text-xl font-extrabold text-slate-900 dark:text-white">{t.value}</p>
                <p className="mt-0.5 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-300 uppercase font-bold">
                  {t.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Details Grid */}
        <div className="mt-5 sm:mt-6 grid gap-5 sm:gap-6 md:grid-cols-2">
          {/* Eligibility Checklist */}
          <div className="rounded-3xl liquid-glass p-5 sm:p-7 md:p-8 shadow-sm dark:shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3 mb-4">
              <h2 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">AI Eligibility Checklist</h2>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 text-[10px] sm:text-xs font-bold text-emerald-700 dark:text-emerald-300">
                Verified
              </span>
            </div>
            <ul className="space-y-3">
              {recommendation.checks.map((c) => (
                <li key={c.label} className="flex gap-2.5 items-start">
                  <span
                    className={`mt-0.5 flex h-4.5 w-4.5 sm:h-5 sm:w-5 flex-none items-center justify-center rounded-full text-[10px] sm:text-xs font-bold text-white shadow-sm ${
                      c.passed ? "bg-[#16A34A] dark:bg-[#22C55E]" : "bg-[#EF4444]"
                    }`}
                  >
                    {c.passed ? "✓" : "✗"}
                  </span>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">{c.label}</p>
                    <p className="text-[11px] sm:text-xs leading-relaxed text-slate-600 dark:text-slate-200 mt-0.5 font-medium">{c.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Explanation Card */}
          <div className="flex flex-col rounded-3xl liquid-glass p-5 sm:p-7 md:p-8 shadow-sm dark:shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3 mb-4">
              <h2 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">Why this scheme?</h2>
              <span className="rounded-full liquid-glass-active px-2.5 py-0.5 text-[10px] sm:text-xs font-bold uppercase">
                {ai?.source === "groq" ? "Groq AI" : "AI Match"}
              </span>
            </div>
            {aiLoading ? (
              <div className="space-y-2.5 my-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-3 animate-pulse rounded-full bg-slate-200 dark:bg-white/15"
                    style={{ width: `${95 - i * 14}%` }}
                  />
                ))}
              </div>
            ) : (
              <>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-100 font-medium">{ai?.explanation}</p>
                {ai && ai.tips.length > 0 && (
                  <ul className="mt-3.5 space-y-1.5 border-t border-slate-200 dark:border-white/10 pt-3">
                    {ai.tips.map((t, i) => (
                      <li key={i} className="flex gap-2 text-xs leading-relaxed text-slate-600 dark:text-slate-200 font-medium">
                        <span className="font-bold text-[#F97316] flex-none">→</span> {t}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
            {recommendation.alternatives.length > 0 && (
              <div className="mt-auto pt-4 border-t border-slate-200 dark:border-white/10">
                <p className="mb-2 text-[11px] font-bold text-[#F97316] uppercase tracking-wider">
                  Alternative Schemes
                </p>
                {recommendation.alternatives.map((a) => (
                  <p
                    key={a.schemeId}
                    className="rounded-xl liquid-glass-inner px-3 py-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-200 font-medium mb-1.5 last:mb-0"
                  >
                    💡 {a.reason}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action CTAs */}
        <div className="mt-8 sm:mt-10 flex flex-col justify-center gap-3 sm:flex-row pb-12">
          <Link
            href="/calculator"
            className="w-full sm:w-auto rounded-xl bg-[#F97316] px-6 py-3.5 text-center text-xs sm:text-sm font-bold text-white shadow-xl shadow-orange-500/25 transition hover:bg-[#EA580C] hover:scale-[1.02]"
          >
            Calculate My EMI →
          </Link>
          <Link
            href="/locator"
            className="w-full sm:w-auto rounded-xl liquid-glass-inner px-6 py-3.5 text-center text-xs sm:text-sm font-bold text-slate-800 dark:text-white transition hover:bg-black/5 dark:hover:bg-white/20 hover:scale-[1.02]"
          >
            Find Where To Apply 📍
          </Link>
          <Link
            href="/checklist"
            className="w-full sm:w-auto rounded-xl liquid-glass-inner px-6 py-3.5 text-center text-xs sm:text-sm font-bold text-slate-800 dark:text-white transition hover:bg-black/5 dark:hover:bg-white/20 hover:scale-[1.02]"
          >
            Checklist 📄
          </Link>
        </div>
      </div>
    </div>
  );
}
