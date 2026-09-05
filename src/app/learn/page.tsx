"use client";

import Link from "next/link";
import SiteBackground from "@/components/SiteBackground";
import { useTranslation } from "@/context/LanguageContext";

export default function LearnPage() {
  const { t } = useTranslation();

  const FINANCIAL_EXPLAINERS = [
    {
      tag: t("fin_card1_tag"),
      title: t("fin_card1_title"),
      desc: t("fin_card1_desc"),
      icon: "🏛️",
    },
    {
      tag: t("fin_card2_tag"),
      title: t("fin_card2_title"),
      desc: t("fin_card2_desc"),
      icon: "📋",
    },
    {
      tag: t("fin_card3_tag"),
      title: t("fin_card3_title"),
      desc: t("fin_card3_desc"),
      icon: "🤝",
    },
  ];

  return (
    <div className="relative min-h-screen text-[var(--foreground)] py-8 sm:py-12 px-3 sm:px-4 selection:bg-[#F97316] selection:text-white">
      {/* Static Minimalist Ambient Background */}
      <SiteBackground interactive={false} />

      <div className="relative z-10 mx-auto max-w-5xl">
        {/* Header Title */}
        <div className="text-center mb-10">
          <span className="inline-block rounded-full liquid-glass-active px-3.5 py-1 text-xs font-bold tracking-wide uppercase shadow-sm">
            {t("fin_sec_badge")}
          </span>
          <h1 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {t("fin_sec_title")}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-200 font-medium max-w-2xl mx-auto">
            {t("fin_sec_sub")}
          </p>
        </div>

        {/* Explainers Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {FINANCIAL_EXPLAINERS.map((card, idx) => (
            <div
              key={idx}
              className="rounded-3xl liquid-glass p-6 sm:p-7 shadow-sm dark:shadow-xl border border-slate-300 dark:border-white/15 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-3xl">{card.icon}</span>
                  <span className="rounded-full liquid-glass-inner px-2.5 py-0.5 text-[10px] font-bold text-[#EA580C] dark:text-[#FED7AA]">
                    {card.tag}
                  </span>
                </div>
                <h3 className="mt-4 text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {card.title}
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-200 font-medium whitespace-pre-line">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-12 rounded-3xl liquid-glass p-8 text-center border border-slate-300 dark:border-white/20 shadow-xl">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Ready to find which scheme you qualify for?
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-200 font-medium max-w-xl mx-auto">
            Take our 60-second questionnaire to calculate your exact subsidy, loan limit, and nearest partner bank.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/wizard"
              className="rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white px-6 py-3 text-xs sm:text-sm font-black shadow-lg shadow-orange-500/25 transition hover:scale-[1.02]"
            >
              Find My Scheme →
            </Link>
            <Link
              href="/locator"
              className="rounded-xl liquid-glass px-6 py-3 text-xs sm:text-sm font-bold text-slate-800 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition"
            >
              Locate Channel Partners 📍
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
