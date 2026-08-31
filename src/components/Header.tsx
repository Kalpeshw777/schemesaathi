"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useTranslation, LANGUAGES, Language } from "@/context/LanguageContext";

export default function Header() {
  const pathname = usePathname();
  const { lang, setLang, t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const links = [
    { href: "/", label: t("nav_home"), icon: "🏠" },
    { href: "/wizard", label: t("nav_wizard"), icon: "🎯" },
    { href: "/calculator", label: t("nav_calculator"), icon: "🧮" },
    { href: "/locator", label: t("nav_locator"), icon: "📍" },
    { href: "/checklist", label: t("nav_checklist"), icon: "📄" },
  ];

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setLangMenuOpen(false);
  }, [pathname]);

  // Click outside to close language menu
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLang = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0B0F19]/75 backdrop-blur-2xl print:hidden">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2.5 px-3.5 sm:px-4 sm:h-18">
        {/* Logo */}
        <Link href="/" className="flex flex-none items-center gap-2 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#F97316] to-[#EA580C] text-base font-bold text-white shadow-md shadow-orange-500/25 transition-transform group-hover:scale-105 sm:h-10 sm:w-10 sm:text-lg">
            ₹
          </span>
          <span className="text-base font-black tracking-tight text-white sm:text-lg">
            Scheme<span className="text-[#F97316]">Saathi</span>
          </span>
        </Link>

        {/* Desktop Navigation Links with Liquid Glass */}
        <nav className="hidden md:flex items-center gap-1 rounded-2xl liquid-glass-inner p-1">
          {links.slice(0, 4).map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-semibold transition-all lg:px-4 lg:py-2 lg:text-sm ${
                pathname === l.href
                  ? "liquid-glass-active text-[#FED7AA] font-bold shadow-sm"
                  : "text-slate-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right Action Toolbar: Language Switcher + CTA + Mobile Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Language Selector Dropdown */}
          <div ref={langRef} className="relative z-50">
            <button
              type="button"
              onClick={() => setLangMenuOpen((o) => !o)}
              className="flex items-center gap-1.5 rounded-xl border border-white/20 liquid-glass-inner px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-bold text-white hover:border-[#F97316]/50 transition shadow-sm"
              title="Change Language / भाषा बदलें"
            >
              <span className="text-sm">{currentLang.flag}</span>
              <span className="hidden sm:inline font-bold">{currentLang.native}</span>
              <span className="sm:hidden font-bold uppercase">{currentLang.code}</span>
              <span className={`text-[10px] text-[#F97316] transition-transform duration-200 ${langMenuOpen ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>

            {langMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 rounded-2xl liquid-glass p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] ring-1 ring-white/20 animate-in fade-in zoom-in-95 duration-150">
                <p className="px-2.5 py-1.5 text-[10px] font-bold text-[#FED7AA] uppercase tracking-wider border-b border-white/10">
                  🌐 Select Language / भाषा
                </p>
                <div className="mt-1 flex flex-col gap-0.5 max-h-60 overflow-y-auto pr-0.5">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        setLang(l.code);
                        setLangMenuOpen(false);
                      }}
                      className={`flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-bold transition text-left ${
                        lang === l.code
                          ? "liquid-glass-active text-[#FED7AA] border border-[#F97316]/60 shadow-sm"
                          : "text-white hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{l.flag}</span>
                        <span>{l.native}</span>
                      </span>
                      <span className="text-[10px] text-slate-300 font-medium">({l.label})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/wizard"
            className="rounded-xl bg-[#F97316] px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:bg-[#EA580C] hover:scale-[1.02] sm:text-sm whitespace-nowrap"
          >
            {t("nav_get_started")}
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label="Toggle navigation menu"
            className="flex md:hidden h-9 w-9 items-center justify-center rounded-xl liquid-glass-inner text-white transition hover:bg-white/20"
          >
            {mobileMenuOpen ? (
              <span className="text-lg font-bold">✕</span>
            ) : (
              <span className="text-lg font-bold">☰</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer with Liquid Glass */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 liquid-glass px-4 py-4 animate-in slide-in-from-top-3 duration-200 shadow-2xl">
          <div className="flex flex-col gap-1.5">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
                  pathname === l.href
                    ? "liquid-glass-active text-[#FED7AA] shadow-sm"
                    : "liquid-glass-inner text-white hover:bg-white/20 hover:text-white"
                }`}
              >
                <span className="text-base">{l.icon}</span>
                <span>{l.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
