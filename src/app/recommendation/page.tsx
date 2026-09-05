"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useJourney } from "@/context/JourneyContext";
import { useTranslation } from "@/context/LanguageContext";
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
  const { t, lang } = useTranslation();

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
          <p className="text-xs sm:text-sm font-semibold text-[#EA580C] dark:text-[#FED7AA]">
            Matching your government scheme…
          </p>
        </div>
      </div>
    );
  }

  const confStyles = {
    high: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 font-bold",
    medium: "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40 font-bold",
    low: "bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/40 font-bold",
  }[recommendation.confidence];

  // Specific scheme details
  const schemeSubtitle =
    recommendation.schemeId === "micro-finance"
      ? t("rec_micro_sub")
      : recommendation.schemeId === "education-loan"
      ? t("rec_edu_sub")
      : t("rec_term_sub");

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
            Official SIH26092 Scheme Recommendation
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
                  : "🏛️ SchemeSaathi Evaluated"}
              </span>
            </div>

            {/* Explicit Scheme Eligibility Header */}
            <p className="mt-3 text-sm sm:text-base font-bold text-slate-700 dark:text-slate-200">
              {t("rec_eligible_heading")}
            </p>
            <h1 className="mt-1 text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#F97316]">
              {recommendation.schemeName}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-200 font-semibold max-w-lg mx-auto leading-relaxed">
              {schemeSubtitle}
            </p>

            <p className="mt-4 sm:mt-6 text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white drop-shadow-sm">
              {formatINR(recommendation.eligibleAmount)}
            </p>
            <p className="mt-1 text-[11px] sm:text-xs text-[#EA580C] dark:text-[#FED7AA] font-bold tracking-wide uppercase">
              estimated eligible loan limit (90% government financing)
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
            ].map((tItem) => (
              <div key={tItem.label} className="px-3 py-3.5 sm:px-4 sm:py-5 text-center">
                <p className="text-base sm:text-lg md:text-xl font-extrabold text-slate-900 dark:text-white">{tItem.value}</p>
                <p className="mt-0.5 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-300 uppercase font-bold">
                  {tItem.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Details Grid */}
        <div className="mt-5 sm:mt-6 grid gap-5 sm:gap-6 md:grid-cols-2">
          {/* Eligibility Checklist */}
          <div className="rounded-3xl liquid-glass p-5 sm:p-7 md:p-8 shadow-sm dark:shadow-xl">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              Eligibility Verification
            </h2>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-200 font-medium">
              Checked against official Ministry & NSFDC operational guidelines:
            </p>
            <ul className="mt-4 space-y-3">
              {(recommendation.checks || []).map((c, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-2xl liquid-glass-inner p-3 text-xs"
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                      c.passed
                        ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
                        : "bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/30"
                    }`}
                  >
                    {c.passed ? "✓" : "×"}
                  </span>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{c.label}</p>
                    <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-200 font-medium leading-relaxed">
                      {c.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Explanation & Tips */}
          <div className="rounded-3xl liquid-glass p-5 sm:p-7 md:p-8 shadow-sm dark:shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Why this scheme fits you
                </h2>
                {ai && (
                  <span className="rounded-full liquid-glass-active px-2.5 py-0.5 text-[10px] font-bold text-[#EA580C] dark:text-[#FED7AA]">
                    {ai.source === "groq" ? "Groq Llama 3" : "Expert Rules Engine"}
                  </span>
                )}
              </div>

              {aiLoading ? (
                <div className="mt-6 flex flex-col items-center justify-center py-8 gap-3">
                  <div className="h-7 w-7 animate-spin rounded-full border-3 border-[#F97316]/20 border-t-[#F97316]" />
                  <p className="text-xs font-bold text-[#EA580C] dark:text-[#FED7AA]">
                    Generating personalized applicant guidance…
                  </p>
                </div>
              ) : ai ? (
                <div className="mt-3 space-y-3">
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-100 font-medium">
                    {ai.explanation}
                  </p>
                  {ai.tips.length > 0 && (
                    <div className="mt-3 rounded-2xl liquid-glass-inner p-3.5">
                      <p className="text-[11px] font-black uppercase text-[#EA580C] dark:text-[#FED7AA] tracking-wider mb-2">
                        💡 Key Tips for Bank Branch Visit:
                      </p>
                      <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-100 font-medium">
                        {ai.tips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-[#F97316] font-bold">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="mt-4 text-xs text-slate-500 dark:text-slate-300">
                  Detailed analysis ready.
                </p>
              )}
            </div>

            {/* Quick Summary Footnote */}
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-300 font-semibold">
              <span>District: <strong className="text-slate-900 dark:text-white">{profile.district}, {profile.state}</strong></span>
              <span>Income: <strong className="text-slate-900 dark:text-white">{formatINR(profile.annualIncome)}/yr</strong></span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/calculator"
            className="w-full sm:w-auto rounded-2xl bg-[#F97316] hover:bg-[#EA580C] text-white px-6 py-3.5 text-xs sm:text-sm font-black text-center shadow-lg shadow-orange-500/25 transition hover:scale-[1.02]"
          >
            Calculate EMI & Repayment Schedule →
          </Link>
          <Link
            href="/locator"
            className="w-full sm:w-auto rounded-2xl liquid-glass px-6 py-3.5 text-xs sm:text-sm font-black text-center text-slate-900 dark:text-white border border-slate-300 dark:border-white/20 transition hover:bg-black/5 dark:hover:bg-white/10"
          >
            Find Authorized Branches Near Me 📍
          </Link>
          <Link
            href="/checklist"
            className="w-full sm:w-auto rounded-2xl liquid-glass px-6 py-3.5 text-xs sm:text-sm font-black text-center text-slate-900 dark:text-white border border-slate-300 dark:border-white/20 transition hover:bg-black/5 dark:hover:bg-white/10"
          >
            View Document Checklist 📄
          </Link>
        </div>
      </div>
    </div>
  );
}
