"use client";

import Link from "next/link";
import SiteBackground from "@/components/SiteBackground";
import { useTranslation } from "@/context/LanguageContext";

export default function Home() {
  const { t } = useTranslation();

  const MODULES = [
    {
      step: "1",
      title: t("nav_wizard"),
      desc: t("wiz_sub_1"),
      href: "/wizard",
      cta: t("hero_cta_find"),
      icon: "🎯",
    },
    {
      step: "2",
      title: t("nav_calculator"),
      desc: t("calc_sub_rec"),
      href: "/calculator",
      cta: t("calc_title"),
      icon: "🧮",
    },
    {
      step: "3",
      title: t("nav_locator"),
      desc: t("loc_sub"),
      href: "/locator",
      cta: t("hero_cta_locate"),
      icon: "📍",
    },
  ];

  const STATS = [
    { value: t("stat_1_val"), label: t("stat_1_lbl") },
    { value: t("stat_2_val"), label: t("stat_2_lbl") },
    { value: t("stat_3_val"), label: t("stat_3_lbl") },
    { value: t("stat_4_val"), label: t("stat_4_lbl") },
  ];

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
    <div className="relative min-h-screen text-[var(--foreground)] overflow-hidden selection:bg-[#F97316] selection:text-white">
      {/* Static Minimalist Ambient Background */}
      <SiteBackground interactive={false} />

      {/* Foreground Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="mx-auto max-w-5xl px-4 pt-16 pb-14 text-center md:pt-24 md:pb-20">
          <span className="inline-block rounded-full liquid-glass-active px-4 py-1.5 text-xs font-bold tracking-wide uppercase shadow-sm">
            {t("hero_badge")}
          </span>
          <h1 className="mx-auto mt-6 max-w-4xl text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-6xl drop-shadow-sm leading-tight">
            {t("hero_title_1")}
            <br />
            <span className="bg-gradient-to-r from-[#F97316] via-[#EA580C] to-[#F59E0B] bg-clip-text text-transparent">
              {t("hero_title_2")}
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed text-slate-700 dark:text-slate-200 font-medium">
            {t("hero_desc")}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
            <Link
              href="/wizard"
              className="w-full rounded-xl bg-[#F97316] px-8 py-3.5 text-base font-bold text-white shadow-xl shadow-orange-500/25 transition hover:bg-[#EA580C] hover:scale-[1.02] sm:w-auto text-center"
            >
              {t("hero_cta_find")}
            </Link>
            <Link
              href="/locator"
              className="w-full rounded-xl liquid-glass-inner px-8 py-3.5 text-base font-bold text-slate-800 dark:text-white transition hover:bg-black/5 dark:hover:bg-white/20 hover:scale-[1.02] sm:w-auto shadow-sm text-center"
            >
              {t("hero_cta_locate")}
            </Link>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="mx-auto max-w-6xl px-4 py-6">
          <div className="grid grid-cols-2 gap-4 rounded-3xl liquid-glass p-6 md:grid-cols-4 md:p-8 shadow-sm dark:shadow-2xl">
            {STATS.map((s, idx) => (
              <div key={idx} className="px-4 text-center">
                <p className="text-2xl sm:text-3xl font-black text-[#F97316] md:text-4xl">{s.value}</p>
                <p className="mt-1 text-xs leading-snug text-slate-700 dark:text-slate-200 md:text-sm font-bold">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Modules Section */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="text-center">
            <span className="rounded-full liquid-glass-active px-3.5 py-1 text-xs font-bold">
              {t("mod_badge")}
            </span>
            <h2 className="mt-3 text-2xl font-black text-slate-900 dark:text-white md:text-3xl">
              {t("mod_title")}
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300 font-medium text-xs sm:text-sm">
              {t("mod_sub")}
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {MODULES.map((m) => (
              <div
                key={m.step}
                className="group flex flex-col rounded-3xl liquid-glass p-7 shadow-sm dark:shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-[#F97316]/60 hover:shadow-xl hover:shadow-orange-500/10"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl transition-transform group-hover:scale-110">{m.icon}</span>
                  <span className="rounded-full liquid-glass-active px-3 py-0.5 text-xs font-bold">
                    Module {m.step}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white group-hover:text-[#F97316] transition-colors">
                  {m.title}
                </h3>
                <p className="mt-2.5 flex-1 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-200 font-medium">{m.desc}</p>
                <Link
                  href={m.href}
                  className="mt-6 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#F97316] group-hover:text-[#EA580C] transition-colors"
                >
                  <span>{m.cta}</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Financial Literacy Explainer Section (SIH26092) */}
        <section id="learn" className="mx-auto max-w-6xl px-4 py-16 scroll-mt-20">
          <div className="text-center">
            <span className="rounded-full liquid-glass-active px-3.5 py-1 text-xs font-bold">
              {t("fin_sec_badge")}
            </span>
            <h2 className="mt-3 text-2xl font-black text-slate-900 dark:text-white md:text-3xl">
              {t("fin_sec_title")}
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300 font-medium text-xs sm:text-sm max-w-2xl mx-auto">
              {t("fin_sec_sub")}
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
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
        </section>
      </div>
    </div>
  );
}
