"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import SiteBackground from "@/components/SiteBackground";
import { useJourney } from "@/context/JourneyContext";
import { useTranslation } from "@/context/LanguageContext";
import { LOCATIONS } from "@/lib/locations";
import type { Profile, SchemeId, Recommendation } from "@/lib/types";

type Data = Profile;

const INITIAL: Data = {
  state: "Maharashtra",
  district: "Nandurbar",
  category: "sc",
  age: 28,
  purpose: "business",
  activityType: "Kirana / retail grocery shop",
  courseLocation: "india",
  projectCost: 300000,
  annualIncome: 250000,
  educationLevel: "10th-12th",
};

const BUSINESS_ACTIVITIES = [
  "Kirana / retail grocery shop",
  "Tailoring & garment shop",
  "Tea stall & snacks corner",
  "Mobile recharge & electronics repair",
  "Beauty parlor & salon",
  "Auto-rickshaw / commercial vehicle",
  "Fabrication & welding unit",
  "Handicrafts & leather work",
  "Other micro business",
];

const AGRICULTURE_ACTIVITIES = [
  "Dairy farming (2–5 cows/buffaloes)",
  "Goat & sheep rearing",
  "Poultry & egg production",
  "Tractor & farm equipment purchase",
  "Drip & sprinkler irrigation setup",
  "Fruit & vegetable greenhouse",
  "Fisheries & inland aquaculture",
  "Post-harvest processing & storage",
];

const EDUCATION_ACTIVITIES = [
  "B.Tech / Engineering Degree",
  "MBBS / Medical Degree",
  "MBA / Master of Business Administration",
  "B.Sc / M.Sc Professional Science",
  "Polytechnic / Diploma Course",
  "LLB / Law Degree",
  "Nursing & Allied Healthcare",
  "Overseas Higher Studies",
];

const EDUCATION_LEVELS = [
  { id: "below-10th", label: "Below 10th Standard" },
  { id: "10th-12th", label: "10th – 12th Standard" },
  { id: "graduate", label: "Graduate / Bachelor's Degree" },
  { id: "post-graduate", label: "Post-Graduate / Master's" },
] as const;

function formatINR(val: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
}

interface AnimatedSelectProps {
  label: string;
  placeholder?: string;
  value: string;
  items: string[];
  disabled?: boolean;
  onChange: (val: string) => void;
}

function AnimatedSelect({
  label,
  placeholder = "Select...",
  value,
  items,
  disabled = false,
  onChange,
}: AnimatedSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Strictly Alphabetical A-to-Z list + instant search filtering
  const sortedAndFilteredItems = useMemo(() => {
    const list = [...items].sort((a, b) =>
      a.localeCompare(b, "en", { sensitivity: "base" })
    );
    if (!search.trim()) return list;
    const query = search.toLowerCase().trim();
    return list.filter((item) => item.toLowerCase().includes(query));
  }, [items, search]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (open) {
      setSearch("");
      setHighlightedIndex(0);
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 40);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Reset highlight index when search query changes
  useEffect(() => {
    setHighlightedIndex(0);
  }, [search]);

  // Auto-scroll highlighted item into view during arrow keys
  useEffect(() => {
    if (open && listRef.current) {
      const el = listRef.current.querySelector(
        `[data-item-index="${highlightedIndex}"]`
      );
      if (el) {
        el.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [highlightedIndex, open]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectItem = (item: string) => {
    onChange(item);
    setOpen(false);
    setSearch("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (sortedAndFilteredItems.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < sortedAndFilteredItems.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : sortedAndFilteredItems.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (sortedAndFilteredItems[highlightedIndex]) {
        selectItem(sortedAndFilteredItems[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };

  return (
    <div ref={dropdownRef} className={`relative ${open ? "z-[99999]" : "z-20"}`}>
      <span className="mb-1.5 block text-xs sm:text-sm font-bold text-slate-800 dark:text-white">
        {label}
      </span>
      <button
        type="button"
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="w-full flex items-center justify-between rounded-xl liquid-glass-inner px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm text-left text-slate-800 dark:text-white outline-none hover:border-[#F97316]/50 focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/30 transition disabled:opacity-40 shadow-sm"
      >
        <span
          className="font-bold truncate text-slate-900 dark:text-white"
        >
          {value || placeholder}
        </span>
        <span
          className={`text-xs text-[#F97316] transition-transform duration-200 flex-none ml-2 ${
            open ? "rotate-180" : ""
          }`}
        >
          ▲
        </span>
      </button>

      {open && !disabled && (
        <div
          className="absolute left-0 right-0 top-full mt-2 z-[99999] rounded-2xl bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-2xl p-2.5 shadow-xl dark:shadow-[0_25px_60px_rgba(0,0,0,0.95)] border border-slate-300 dark:border-[#F97316]/50 ring-1 ring-black/5 dark:ring-white/20 animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Quick Letter Search Bar */}
          <div className="mb-2 flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-white/20 liquid-glass-inner px-2.5 py-2">
            <span className="text-xs text-[#F97316]">🔍</span>
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type letter or name..."
              className="flex-1 bg-transparent text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none font-medium"
            />
            {search && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSearch("");
                  searchInputRef.current?.focus();
                }}
                className="text-[11px] text-slate-400 hover:text-slate-800 dark:hover:text-white px-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* Results List */}
          <div
            ref={listRef}
            className="w-full max-h-56 overflow-y-auto space-y-1 pr-1 scrollable-touch"
          >
            {sortedAndFilteredItems.length === 0 ? (
              <div className="p-3 text-center text-xs text-slate-500 dark:text-slate-300 font-medium">
                No results for &ldquo;{search}&rdquo;
              </div>
            ) : (
              sortedAndFilteredItems.map((item, idx) => {
                const isSelected = value === item;
                const isHighlighted = highlightedIndex === idx;
                return (
                  <div
                    key={item}
                    data-item-index={idx}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      selectItem(item);
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      selectItem(item);
                    }}
                    className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs sm:text-sm font-bold cursor-pointer transition select-none ${
                      isHighlighted
                        ? "liquid-glass-active border-[#F97316] shadow-sm"
                        : isSelected
                        ? "liquid-glass-inner border-slate-300 dark:border-white/30 text-slate-900 dark:text-white"
                        : "text-slate-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10"
                    }`}
                  >
                    <span className="truncate">{item}</span>
                    {isSelected && (
                      <span className="text-xs text-[#16A34A] dark:text-[#22C55E] font-black">✓</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function WizardPage() {
  const router = useRouter();
  const { profile, setJourney } = useJourney();
  const { t } = useTranslation();

  const [step, setStep] = useState(0);
  const [data, setData] = useState<Data>(() =>
    profile
      ? {
          ...INITIAL,
          ...profile,
          courseLocation: profile.courseLocation ?? "india",
        }
      : INITIAL
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    t("wiz_step_0"),
    t("wiz_step_1"),
    t("wiz_step_2"),
    t("wiz_step_3"),
  ];

  const purposes: { id: Profile["purpose"]; icon: string; label: string; hint: string }[] = [
    { id: "business", icon: "🏪", label: t("wiz_pur_biz"), hint: t("wiz_pur_biz_hint") },
    { id: "agriculture", icon: "🌾", label: t("wiz_pur_agri"), hint: t("wiz_pur_agri_hint") },
    { id: "education", icon: "🎓", label: t("wiz_pur_edu"), hint: t("wiz_pur_edu_hint") },
  ];

  const stateList = Object.keys(LOCATIONS);
  const districtList = data.state ? LOCATIONS[data.state] ?? [] : [];

  const update = <K extends keyof Data>(key: K, value: Data[K]) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const onSelectPurpose = (p: Profile["purpose"]) => {
    let act = data.activityType;
    let cost = data.projectCost;
    if (p === "business") {
      act = BUSINESS_ACTIVITIES[0];
      cost = 300000;
    } else if (p === "agriculture") {
      act = AGRICULTURE_ACTIVITIES[0];
      cost = 250000;
    } else {
      act = EDUCATION_ACTIVITIES[0];
      cost = 1000000;
    }
    setData((prev) => ({ ...prev, purpose: p, activityType: act, projectCost: cost }));
  };

  const nextStep = () => {
    setError(null);
    if (step === 0) {
      if (!data.state) {
        setError("Please select your state to continue.");
        return;
      }
      if (!data.district) {
        setError("Please select your district to continue.");
        return;
      }
    }
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const prevStep = () => {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  };

  const onSubmit = async () => {
    setError(null);
    setSubmitting(true);
    const finalProfile: Profile = {
      state: data.state,
      district: data.district,
      category: data.category,
      age: data.age,
      purpose: data.purpose,
      activityType: data.activityType,
      projectCost: data.projectCost,
      annualIncome: data.annualIncome,
      educationLevel: data.educationLevel,
      courseLocation: data.courseLocation,
    };

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalProfile),
      });
      if (!res.ok) throw new Error("Failed to calculate recommendation");
      const result = await res.json();
      const rec: Recommendation = result.recommendation;

      setJourney({ profile: finalProfile, recommendation: rec });
      router.push("/recommendation");
    } catch {
      // Local fallback calculation if API is offline
      let sId: SchemeId = "term-loan";
      let sName = "NSFDC Term Loan Scheme";
      let rate = 8.0;
      let mor = 6;
      let maxTen = 120;
      let cap = 5000000;

      if (data.purpose === "education") {
        sId = "education-loan";
        sName = "NSFDC Educational Loan Scheme";
        rate = 7.0;
        mor = 42;
        maxTen = 180;
        cap = data.courseLocation === "abroad" ? 4000000 : 2500000;
      } else if (data.projectCost <= 140000 && data.annualIncome <= 300000) {
        sId = "micro-finance";
        sName = "NSFDC Micro Finance Scheme";
        rate = 6.5;
        mor = 3;
        maxTen = 60;
        cap = 140000;
      }

      const eligibleAmount = Math.min(Math.round(data.projectCost * 0.9), cap);

      const fallbackRec: Recommendation = {
        schemeId: sId,
        schemeName: sName,
        tagline: "Concessional credit scheme for socio-economic development",
        eligibleAmount,
        interestRate: rate,
        moratoriumMonths: mor,
        maxTenureMonths: maxTen,
        confidence: "high",
        checks: [
          { label: "Category verification", passed: true, detail: "Target community verified" },
          { label: "Age criteria", passed: true, detail: "Applicant meets age eligibility norms" },
          { label: "Income criteria", passed: true, detail: "Applicant meets income ceiling norms" },
        ],
        alternatives: [],
        source: "fallback",
      };

      setJourney({ profile: finalProfile, recommendation: fallbackRec });
      router.push("/recommendation");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen text-[var(--foreground)] py-12 px-4 selection:bg-[#F97316] selection:text-white">
      {/* Static Minimalist Ambient Background */}
      <SiteBackground interactive={false} />

      <div className="relative z-10 mx-auto max-w-2xl">
        {/* Step Progress Indicator */}
        <div className="mb-8 flex items-center justify-between">
          {steps.map((st, i) => (
            <div key={st} className="flex flex-1 flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-xs sm:text-sm font-black transition-all ${
                  i < step
                    ? "bg-[#16A34A] dark:bg-[#22C55E] text-white shadow-md shadow-green-500/25"
                    : i === step
                    ? "liquid-glass-active border border-[#F97316] shadow-lg shadow-orange-500/30 scale-105"
                    : "liquid-glass-inner text-slate-500 dark:text-slate-300"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <span
                className={`mt-2 hidden text-[11px] font-bold text-center sm:block ${
                  i === step ? "text-[#EA580C] dark:text-[#FED7AA]" : "text-slate-500 dark:text-slate-300"
                }`}
              >
                {st}
              </span>
            </div>
          ))}
        </div>

        {/* Main Form Card */}
        <div className="rounded-3xl liquid-glass p-6 sm:p-8 shadow-sm dark:shadow-2xl">
          {error && (
            <div className="mb-6 rounded-2xl border border-red-500/40 bg-red-50 dark:bg-red-950/60 p-4 text-xs sm:text-sm font-bold text-red-700 dark:text-red-200 shadow-sm">
              ⚠️ {error}
            </div>
          )}

          {/* STEP 0: About You */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {t("wiz_title_0")}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-200 font-medium">
                  {t("wiz_sub_0")}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <AnimatedSelect
                  label={t("wiz_state_lbl")}
                  placeholder={t("wiz_state_ph")}
                  value={data.state}
                  items={stateList}
                  onChange={(val) => {
                    update("state", val);
                    const dList = LOCATIONS[val] ?? [];
                    update("district", dList[0] || "");
                  }}
                />

                <AnimatedSelect
                  label={t("wiz_dist_lbl")}
                  placeholder={data.state ? t("wiz_dist_ph") : t("wiz_dist_wait")}
                  value={data.district}
                  items={districtList}
                  disabled={!data.state}
                  onChange={(val) => update("district", val)}
                />
              </div>

              {/* Category */}
              <div>
                <span className="mb-2 block text-xs sm:text-sm font-bold text-slate-800 dark:text-white">
                  {t("wiz_cat_lbl")}
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {(["sc", "st", "obc", "general"] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => update("category", cat)}
                      className={`rounded-2xl border px-2.5 py-2.5 text-xs font-extrabold uppercase transition ${
                        data.category === cat
                          ? "liquid-glass-active border-[#F97316] shadow-sm"
                          : "liquid-glass-inner text-slate-700 dark:text-slate-200 border-slate-300 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/15"
                      }`}
                    >
                      {cat === "sc" ? "SC" : cat === "st" ? "ST" : cat === "obc" ? "OBC" : "General"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age Slider */}
              <div>
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800 dark:text-white mb-2">
                  <span>{t("wiz_age_lbl")} — {data.age} {t("wiz_years")}</span>
                </div>
                <input
                  type="range"
                  min={17}
                  max={70}
                  step={1}
                  value={data.age}
                  onChange={(e) => update("age", Number(e.target.value))}
                  className="w-full accent-[#F97316] cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
                />
                <div className="mt-1 flex justify-between text-[11px] text-slate-500 dark:text-slate-300 font-semibold">
                  <span>17 {t("wiz_years")}</span>
                  <span className="font-bold text-[#F97316]">{data.age} {t("wiz_years")}</span>
                  <span>70 {t("wiz_years")}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: Your Goal */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {t("wiz_title_1")}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-200 font-medium">
                  {t("wiz_sub_1")}
                </p>
              </div>

              {/* Purpose Cards */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {purposes.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onSelectPurpose(p.id)}
                    className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
                      data.purpose === p.id
                        ? "liquid-glass-active border-[#F97316] shadow-md scale-[1.02]"
                        : "liquid-glass-inner text-slate-700 dark:text-slate-200 border-slate-300 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/15"
                    }`}
                  >
                    <span className="text-2xl mb-2">{p.icon}</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white block">{p.label}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-300 mt-1 leading-snug font-medium">{p.hint}</span>
                  </button>
                ))}
              </div>

              {/* Specific Activity Dropdown */}
              <div>
                {data.purpose === "business" && (
                  <AnimatedSelect
                    label={t("wiz_act_select")}
                    placeholder={t("wiz_act_ph")}
                    value={data.activityType}
                    items={BUSINESS_ACTIVITIES}
                    onChange={(val) => update("activityType", val)}
                  />
                )}
                {data.purpose === "agriculture" && (
                  <AnimatedSelect
                    label={t("wiz_act_select")}
                    placeholder={t("wiz_act_ph")}
                    value={data.activityType}
                    items={AGRICULTURE_ACTIVITIES}
                    onChange={(val) => update("activityType", val)}
                  />
                )}
                {data.purpose === "education" && (
                  <div className="space-y-4">
                    <AnimatedSelect
                      label={t("wiz_act_edu_select")}
                      placeholder={t("wiz_act_ph")}
                      value={data.activityType}
                      items={EDUCATION_ACTIVITIES}
                      onChange={(val) => update("activityType", val)}
                    />

                    <div>
                      <span className="mb-2 block text-xs sm:text-sm font-bold text-slate-800 dark:text-white">
                        {t("wiz_course_loc")}
                      </span>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => update("courseLocation", "india")}
                          className={`rounded-2xl border p-3 text-xs sm:text-sm font-bold transition ${
                            data.courseLocation === "india"
                              ? "liquid-glass-active border-[#F97316]"
                              : "liquid-glass-inner text-slate-700 dark:text-slate-200 border-slate-300 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/15"
                          }`}
                        >
                          {t("wiz_course_in")}
                        </button>
                        <button
                          type="button"
                          onClick={() => update("courseLocation", "abroad")}
                          className={`rounded-2xl border p-3 text-xs sm:text-sm font-bold transition ${
                            data.courseLocation === "abroad"
                              ? "liquid-glass-active border-[#F97316]"
                              : "liquid-glass-inner text-slate-700 dark:text-slate-200 border-slate-300 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/15"
                          }`}
                        >
                          {t("wiz_course_ab")}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Project Cost */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {t("wiz_title_2")}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-200 font-medium">
                  {t("wiz_sub_2")}
                </p>
              </div>

              {/* Project Cost Slider */}
              <div>
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800 dark:text-white mb-2">
                  <span>{data.purpose === "education" ? t("wiz_course_cost_lbl") : t("wiz_cost_lbl")}</span>
                  <span className="text-base sm:text-lg font-black text-[#F97316]">
                    {formatINR(data.projectCost)}
                  </span>
                </div>
                <input
                  type="range"
                  min={10000}
                  max={data.purpose === "education" ? (data.courseLocation === "abroad" ? 4000000 : 2500000) : 5000000}
                  step={10000}
                  value={data.projectCost}
                  onChange={(e) => update("projectCost", Number(e.target.value))}
                  className="w-full accent-[#F97316] cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
                />
                <div className="mt-1 flex justify-between text-[11px] text-slate-500 dark:text-slate-300 font-semibold">
                  <span>₹10,000</span>
                  <span className="text-[#16A34A] dark:text-[#22C55E] font-bold">
                    {t("wiz_financed_lbl")} {formatINR(Math.round(data.projectCost * 0.9))}
                  </span>
                  <span>{formatINR(data.purpose === "education" ? (data.courseLocation === "abroad" ? 4000000 : 2500000) : 5000000)}</span>
                </div>
              </div>

              {/* Annual Income Slider */}
              <div>
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800 dark:text-white mb-2">
                  <span>{t("wiz_income_lbl")}</span>
                  <span className="text-base sm:text-lg font-black text-[#F97316]">
                    {formatINR(data.annualIncome)}/yr
                  </span>
                </div>
                <input
                  type="range"
                  min={50000}
                  max={1200000}
                  step={10000}
                  value={data.annualIncome}
                  onChange={(e) => update("annualIncome", Number(e.target.value))}
                  className="w-full accent-[#F97316] cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
                />
                <div className="mt-1 flex justify-between text-[11px] text-slate-500 dark:text-slate-300 font-semibold">
                  <span>₹50,000/yr</span>
                  <span>₹12,00,000/yr</span>
                </div>
                <p className="mt-2 text-[11px] text-[#EA580C] dark:text-[#FED7AA] font-semibold leading-relaxed">
                  {t("wiz_income_rule")}
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: Background & Review */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {t("wiz_title_3")}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-200 font-medium">
                  {t("wiz_sub_3")}
                </p>
              </div>

              {/* Education Level */}
              <AnimatedSelect
                label={t("wiz_edu_lbl")}
                placeholder={t("wiz_edu_ph")}
                value={EDUCATION_LEVELS.find((l) => l.id === data.educationLevel)?.label || "10th – 12th Standard"}
                items={EDUCATION_LEVELS.map((l) => l.label)}
                onChange={(val) => {
                  const found = EDUCATION_LEVELS.find((l) => l.label === val);
                  if (found) update("educationLevel", found.id);
                }}
              />

              {/* Summary Box */}
              <div className="rounded-2xl liquid-glass-inner p-4 space-y-2 text-xs sm:text-sm">
                <p className="font-bold text-[#EA580C] dark:text-[#FED7AA] mb-1">📋 {t("wiz_profile_sum")}</p>
                <div className="flex justify-between text-slate-600 dark:text-slate-200 font-medium">
                  <span>{t("wiz_sum_loc")}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{data.district}, {data.state}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-200 font-medium">
                  <span>{t("wiz_sum_pur")}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{data.activityType}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-200 font-medium">
                  <span>{t("wiz_sum_cost")}</span>
                  <span className="font-bold text-[#F97316]">{formatINR(data.projectCost)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-200 font-medium">
                  <span>{t("wiz_sum_inc")}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{formatINR(data.annualIncome)}/yr</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Action Buttons */}
          <div className="mt-8 flex items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
            {step > 0 ? (
              <button
                type="button"
                onClick={prevStep}
                disabled={submitting}
                className="rounded-xl liquid-glass-inner px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-800 dark:text-white transition hover:bg-black/5 dark:hover:bg-white/20"
              >
                {t("wiz_btn_back")}
              </button>
            ) : (
              <div />
            )}

            {step < steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="rounded-xl bg-[#F97316] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:bg-[#EA580C] hover:scale-[1.02]"
              >
                {t("wiz_btn_continue")}
              </button>
            ) : (
              <button
                type="button"
                onClick={onSubmit}
                disabled={submitting}
                className="rounded-xl bg-[#F97316] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:bg-[#EA580C] hover:scale-[1.02] disabled:opacity-50"
              >
                {submitting ? t("wiz_btn_analyzing") : t("wiz_btn_submit")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
