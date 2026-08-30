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

  return (
    <div className="relative min-h-screen bg-[#0B0F19] text-white overflow-hidden selection:bg-[#F97316] selection:text-white" style={{ color: "#FFFFFF" }}>
      {/* Dark Ambient Background with DotGrid Texture */}
      <SiteBackground interactive={true} />

      {/* Foreground Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="mx-auto max-w-5xl px-4 pt-20 pb-16 text-center md:pt-28 md:pb-24">
          <span className="inline-block rounded-full liquid-glass-active px-4 py-1.5 text-xs font-bold tracking-wide text-[#FED7AA] uppercase shadow-lg shadow-orange-950/30" style={{ color: "#FED7AA" }}>
            {t("hero_badge")}
          </span>
          <h1 className="mx-auto mt-6 max-w-4xl text-3xl font-black tracking-tight text-white sm:text-4xl md:text-6xl drop-shadow-md leading-tight" style={{ color: "#FFFFFF" }}>
            {t("hero_title_1")}
            <br />
            <span className="bg-gradient-to-r from-[#F97316] via-[#FB923C] to-[#FDBA74] bg-clip-text text-transparent">
              {t("hero_title_2")}
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed text-slate-200 font-medium" style={{ color: "#E2E8F0" }}>
            {t("hero_desc")}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
            <Link
              href="/wizard"
              className="w-full rounded-xl bg-[#F97316] px-8 py-3.5 text-base font-bold text-white shadow-xl shadow-orange-500/25 transition hover:bg-[#EA580C] hover:scale-[1.02] sm:w-auto"
              style={{ color: "#FFFFFF" }}
            >
              {t("hero_cta_find")}
            </Link>
            <Link
              href="/locator"
              className="w-full rounded-xl liquid-glass-inner px-8 py-3.5 text-base font-bold text-white transition hover:bg-white/20 hover:scale-[1.02] sm:w-auto shadow-md"
              style={{ color: "#FFFFFF" }}
            >
              {t("hero_cta_locate")}
            </Link>
          </div>
        </section>

        {/* Stats Grid with Liquid Glass */}
        <section className="mx-auto max-w-6xl px-4 py-6">
          <div className="grid grid-cols-2 gap-4 rounded-3xl liquid-glass p-6 md:grid-cols-4 md:p-8 shadow-2xl">
            {STATS.map((s, idx) => (
              <div key={idx} className="px-4 text-center">
                <p className="text-2xl sm:text-3xl font-black text-[#F97316] md:text-4xl" style={{ color: "#F97316" }}>{s.value}</p>
                <p className="mt-1 text-xs leading-snug text-slate-200 md:text-sm font-semibold" style={{ color: "#E2E8F0" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Modules Section */}
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="text-center">
            <span className="rounded-full liquid-glass-active px-3.5 py-1 text-xs font-bold text-[#FED7AA]" style={{ color: "#FED7AA" }}>
              {t("mod_badge")}
            </span>
            <h2 className="mt-3 text-2xl font-bold text-white md:text-3xl" style={{ color: "#FFFFFF" }}>
              {t("mod_title")}
            </h2>
            <p className="mt-2 text-slate-300 font-medium text-xs sm:text-sm" style={{ color: "#CBD5E1" }}>
              {t("mod_sub")}
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {MODULES.map((m) => (
              <div
                key={m.step}
                className="group flex flex-col rounded-3xl liquid-glass p-7 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-[#F97316]/60 hover:shadow-2xl hover:shadow-orange-500/15"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl transition-transform group-hover:scale-110">{m.icon}</span>
                  <span className="rounded-full liquid-glass-active px-3 py-0.5 text-xs font-bold text-[#FED7AA]" style={{ color: "#FED7AA" }}>
                    Module {m.step}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-bold text-white group-hover:text-[#F97316] transition-colors" style={{ color: "#FFFFFF" }}>
                  {m.title}
                </h3>
                <p className="mt-2.5 flex-1 text-xs sm:text-sm leading-relaxed text-slate-200 font-medium" style={{ color: "#E2E8F0" }}>{m.desc}</p>
                <Link
                  href={m.href}
                  className="mt-6 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#F97316] group-hover:text-[#FB923C] transition-colors"
                  style={{ color: "#F97316" }}
                >
                  {m.cta} <span aria-hidden>→</span>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
