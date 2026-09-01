"use client";

import Link from "next/link";
import PrintButton from "@/components/PrintButton";
import { SCHEMES } from "@/lib/schemes";
import type { SchemeId } from "@/lib/types";
import SiteBackground from "@/components/SiteBackground";
import { useTranslation } from "@/context/LanguageContext";

const COMMON_DOCS = [
  "Aadhaar card (linked with mobile number)",
  "Caste certificate (SC) issued by competent revenue authority (SDM/Tehsildar)",
  "Annual family income certificate (valid within 12 months)",
  "Domicile / residence proof of the state",
  "Bank passbook / statement of applicant's active account with IFSC",
  "Recent passport-size photographs (4–6)",
];

const SCHEME_DOCS: Record<SchemeId, { title: string; docs: string[] }> = {
  "micro-finance": {
    title: "Micro Finance Scheme & Mahila Samriddhi — Additional Requirements",
    docs: [
      "Proof of Self-Help Group (SHG) / Joint Liability Group (JLG) membership",
      "Group resolution copy recommending the beneficiary",
      "Simple project activity plan (assets to purchase & revenue model)",
      "2 valid quotations for milch cattle / tools / stock purchase",
    ],
  },
  "term-loan": {
    title: "Term Loan Scheme (TLS) — Additional Requirements",
    docs: [
      "Detailed Project Report (DPR) with cashflow projections",
      "Udyam MSME Registration certificate (if applicable)",
      "Trade licence / Local authority permission / GSTIN",
      "3 competitive supplier quotations for machinery / vehicle / equipment",
      "Proof of 10% Margin Money arrangement in bank account",
      "Technical skill certificate or prior experience proof in the trade",
    ],
  },
  "education-loan": {
    title: "Educational Loan Scheme (ELS) — Additional Requirements",
    docs: [
      "Confirmed Admission Letter from recognized University / College",
      "Institutional breakdown of total tuition, hostel & exam fees",
      "Academic marksheets of 10th, 12th, and previous graduation degree",
      "Entrance exam scorecard (JEE / NEET / GATE / CAT / CET / etc.)",
      "For Studies Abroad: Valid Passport, I-20 / CAS letter, visa copy, airfare quotation",
      "Parent / Co-applicant Aadhaar, PAN card, and last 2 years income tax return / salary slips",
    ],
  },
};

export default function ChecklistPage() {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen text-[var(--foreground)] overflow-x-hidden py-8 sm:py-12">
      {/* Static Minimalist Ambient Background */}
      <SiteBackground interactive={false} />

      {/* Foreground Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-3.5 sm:px-4">
        <div className="flex flex-wrap items-center justify-between gap-3 print:block">
          <div>
            <span className="inline-block rounded-full liquid-glass-active px-3.5 py-1 text-xs font-bold tracking-wide uppercase shadow-sm">
              {t("chk_tag")}
            </span>
            <h1 className="mt-2.5 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight md:text-4xl">
              {t("chk_title")}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-200 font-medium">
              {t("chk_sub")}
            </p>
          </div>
          <div className="print:hidden">
            <PrintButton />
          </div>
        </div>

        {/* Common Documents */}
        <div className="mt-8 rounded-3xl liquid-glass p-5 sm:p-7 md:p-8 shadow-sm dark:shadow-2xl">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span>🏛️</span>
            <span>{t("chk_mandatory")}</span>
          </h2>
          <ul className="space-y-3">
            {COMMON_DOCS.map((d, i) => (
              <li key={i} className="flex items-start gap-3 text-xs sm:text-sm">
                <input
                  type="checkbox"
                  id={`common-${i}`}
                  className="mt-0.5 h-4 w-4 rounded accent-[#F97316] flex-none cursor-pointer"
                />
                <label htmlFor={`common-${i}`} className="text-slate-800 dark:text-slate-100 font-medium cursor-pointer leading-relaxed">
                  {d}
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* Scheme-Specific Documents */}
        <div className="mt-6 space-y-6">
          {(Object.keys(SCHEME_DOCS) as SchemeId[]).map((sid) => {
            const spec = SCHEME_DOCS[sid];
            const s = SCHEMES[sid];
            return (
              <div key={sid} className="rounded-3xl liquid-glass p-5 sm:p-7 md:p-8 shadow-sm dark:shadow-2xl">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {spec.title}
                  </h3>
                  <span className="rounded-full liquid-glass-inner px-3 py-1 text-xs font-bold text-[#EA580C] dark:text-[#FED7AA]">
                    {s.rate}% p.a.
                  </span>
                </div>
                <ul className="space-y-3">
                  {spec.docs.map((d, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs sm:text-sm">
                      <input
                        type="checkbox"
                        id={`${sid}-${i}`}
                        className="mt-0.5 h-4 w-4 rounded accent-[#F97316] flex-none cursor-pointer"
                      />
                      <label htmlFor={`${sid}-${i}`} className="text-slate-800 dark:text-slate-100 font-medium cursor-pointer leading-relaxed">
                        {d}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Next step footer */}
        <div className="mt-8 rounded-3xl liquid-glass p-6 text-center print:hidden shadow-sm dark:shadow-xl">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-200 font-medium">
            Have all your documents gathered?
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link
              href="/calculator"
              className="rounded-xl liquid-glass-inner px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-800 dark:text-white hover:bg-black/5 dark:hover:bg-white/20 transition"
            >
              {t("nav_calculator")} →
            </Link>
            <Link
              href="/locator"
              className="rounded-xl bg-[#F97316] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-orange-500/25 hover:bg-[#EA580C] transition"
            >
              {t("nav_locator")} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
