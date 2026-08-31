"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, useMemo } from "react";
import { useJourney } from "@/context/JourneyContext";
import { useTranslation } from "@/context/LanguageContext";
import {
  AGRICULTURE_ACTIVITIES,
  BUSINESS_ACTIVITIES,
  LOCATIONS,
} from "@/lib/locations";
import type { Profile } from "@/lib/types";
import { formatINR } from "@/lib/format";
import SiteBackground from "@/components/SiteBackground";
import AnimatedList from "@/components/AnimatedList";

type Data = Omit<Profile, never> & { courseLocation: "india" | "abroad" };

const INITIAL: Data = {
  state: "",
  district: "",
  category: "sc",
  age: 30,
  purpose: "business",
  activityType: BUSINESS_ACTIVITIES[0],
  projectCost: 300000,
  annualIncome: 250000,
  educationLevel: "10th-12th",
  courseLocation: "india",
};

const EDUCATION_ACTIVITIES = [
  "B.Tech / Engineering Degree",
  "MBBS / Medical / Dental",
  "MBA / Business Management",
  "Diploma / Polytechnic Course",
  "Post-Graduate / Masters",
  "Law / Legal Studies",
  "Aviation / Commercial Pilot",
  "Vocational / Skill Training",
];

const EDUCATION_LEVELS: { id: Profile["educationLevel"]; label: string }[] = [
  { id: "below-10th", label: "Below 10th" },
  { id: "10th-12th", label: "10th – 12th" },
  { id: "graduate", label: "Graduate" },
  { id: "post-graduate", label: "Post-graduate" },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs sm:text-sm font-bold text-white" style={{ color: "#FFFFFF" }}>{label}</span>
      {children}
    </label>
  );
}

/** Animated Dropdown with Search, Arrow Keys Navigation & Instant Selection */
function AnimatedSelect({
  label,
  placeholder,
  value,
  items,
  disabled = false,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  items: string[];
  disabled?: boolean;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Sort alphabetically and filter by search query / first letters
  const sortedAndFilteredItems = useMemo(() => {
    const sorted = [...items].sort((a, b) => a.localeCompare(b));
    if (!search.trim()) return sorted;

    const q = search.trim().toLowerCase();
    const exactStart = sorted.filter((item) => item.toLowerCase().startsWith(q));
    const contains = sorted.filter(
      (item) => !item.toLowerCase().startsWith(q) && item.toLowerCase().includes(q)
    );

    return [...exactStart, ...contains];
  }, [items, search]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) {
      setSearch("");
      const initialIdx = sortedAndFilteredItems.indexOf(value);
      setHighlightedIndex(initialIdx !== -1 ? initialIdx : 0);
      setTimeout(() => searchInputRef.current?.focus(), 40);
    }
  }, [open]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [search]);

  // Auto-scroll highlighted item into view
  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.querySelector(
      `[data-item-index="${highlightedIndex}"]`
    ) as HTMLElement | null;
    if (el) {
      el.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex, open]);

  const selectItem = (item: string) => {
    onChange(item);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
      <span className="mb-1.5 block text-xs sm:text-sm font-bold text-white" style={{ color: "#FFFFFF" }}>
        {label}
      </span>
      <button
        type="button"
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="w-full flex items-center justify-between rounded-xl liquid-glass-inner px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm text-left text-white outline-none hover:border-[#F97316]/50 focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/30 transition disabled:opacity-40 shadow-lg shadow-black/20"
        style={{ color: "#FFFFFF" }}
      >
        <span
          className="font-bold truncate text-white"
          style={{ color: value ? "#FFFFFF" : "#CBD5E1" }}
        >
          {value || placeholder}
        </span>
        <span
          className={`text-xs text-[#F97316] transition-transform duration-200 flex-none ml-2 ${
            open ? "rotate-180" : ""
          }`}
          style={{ color: "#F97316" }}
        >
          ▲
        </span>
      </button>

      {open && !disabled && (
        <div
          className="absolute left-0 right-0 top-full mt-2 z-[99999] rounded-2xl bg-[#0B0F19]/95 backdrop-blur-2xl p-2.5 shadow-[0_25px_60px_rgba(0,0,0,0.95)] border border-[#F97316]/50 ring-1 ring-white/20 animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Quick Letter Search Bar */}
          <div className="mb-2 flex items-center gap-1.5 rounded-xl border border-white/20 liquid-glass-inner px-2.5 py-2">
            <span className="text-xs text-[#FED7AA]">🔍</span>
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type letter or name..."
              className="flex-1 bg-transparent text-xs text-white placeholder:text-slate-400 outline-none font-medium"
              style={{ color: "#FFFFFF" }}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-[11px] text-slate-300 hover:text-white px-1"
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
              <div className="p-3 text-center text-xs text-slate-300 font-medium">
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
                        ? "liquid-glass-active border-[#F97316] text-[#FED7AA] shadow-md shadow-orange-500/20"
                        : isSelected
                        ? "liquid-glass-inner border-white/30 text-white"
                        : "text-slate-200 hover:bg-white/10"
                    }`}
                    style={{
                      color: isHighlighted
                        ? "#FED7AA"
                        : isSelected
                        ? "#FFFFFF"
                        : "#F1F5F9",
                    }}
                  >
                    <span className="truncate">{item}</span>
                    {isSelected && (
                      <span className="text-xs text-[#22C55E] font-black">✓</span>
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
      age: Number(data.age),
      purpose: data.purpose,
      activityType: data.activityType,
      projectCost: Number(data.projectCost),
      annualIncome: Number(data.annualIncome),
      educationLevel: data.educationLevel,
      courseLocation: data.purpose === "education" ? data.courseLocation : undefined,
    };

    try {
      const groqKey = typeof window !== "undefined" ? localStorage.getItem("groq-api-key") || "" : "";
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...finalProfile, apiKey: groqKey }),
      });
      if (!res.ok) throw new Error("Could not compute recommendation");
      const json = await res.json();
      setJourney({ profile: finalProfile, recommendation: json.recommendation });
      router.push("/recommendation");
    } catch {
      setError("Failed to generate recommendation. Please check your network.");
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0B0F19] text-white py-12 px-4 selection:bg-[#F97316] selection:text-white" style={{ color: "#FFFFFF" }}>
      {/* Dynamic Background with Spotlight */}
      <SiteBackground interactive={false} />

      <div className="relative z-10 mx-auto max-w-2xl">
        {/* Step Progress Indicator with Liquid Glass */}
        <div className="mb-8 flex items-center justify-between">
          {steps.map((st, i) => (
            <div key={st} className="flex flex-1 flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full text-xs sm:text-sm font-black transition-all ${
                  i < step
                    ? "bg-[#22C55E] text-white shadow-md shadow-green-500/25"
                    : i === step
                    ? "liquid-glass-active text-[#FED7AA] border border-[#F97316] shadow-lg shadow-orange-500/30 scale-105"
                    : "liquid-glass-inner text-slate-300"
                }`}
                style={{ color: i === step ? "#FED7AA" : "#FFFFFF" }}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <span
                className={`mt-2 hidden text-[11px] font-bold text-center sm:block ${
                  i === step ? "text-[#FED7AA]" : "text-slate-300"
                }`}
                style={{ color: i === step ? "#FED7AA" : "#CBD5E1" }}
              >
                {st}
              </span>
            </div>
          ))}
        </div>

        {/* Main Card with Liquid Frosted Glass */}
        <div className="rounded-3xl liquid-glass p-6 sm:p-8 shadow-2xl">
          {error && (
            <div className="mb-6 rounded-2xl border border-red-500/40 bg-red-950/60 p-4 text-xs sm:text-sm font-bold text-red-200 shadow-md">
              ⚠️ {error}
            </div>
          )}

          {/* STEP 0: About You */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white" style={{ color: "#FFFFFF" }}>
                  {t("wiz_title_0")}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-200 font-medium" style={{ color: "#E2E8F0" }}>
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
                <span className="mb-2 block text-xs sm:text-sm font-bold text-white" style={{ color: "#FFFFFF" }}>
                  {t("wiz_cat_lbl")}
                </span>
                <div className="grid grid-cols-3 gap-2.5">
                  {(["sc", "st", "obc"] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => update("category", cat)}
                      className={`rounded-2xl border px-3 py-2.5 text-xs sm:text-sm font-extrabold uppercase transition ${
                        data.category === cat
                          ? "liquid-glass-active text-[#FED7AA] border-[#F97316] shadow-md shadow-orange-500/20"
                          : "liquid-glass-inner text-slate-200 border-white/10 hover:bg-white/15"
                      }`}
                      style={{ color: data.category === cat ? "#FED7AA" : "#FFFFFF" }}
                    >
                      {cat === "sc" ? "SC" : cat === "st" ? "ST" : "OBC / Gen"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age Slider */}
              <div>
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-white mb-2" style={{ color: "#FFFFFF" }}>
                  <span>{t("wiz_age_lbl")} — {data.age} {t("wiz_years")}</span>
                </div>
                <input
                  type="range"
                  min={17}
                  max={70}
                  step={1}
                  value={data.age}
                  onChange={(e) => update("age", Number(e.target.value))}
                  className="w-full accent-[#F97316] cursor-pointer h-2 bg-white/10 rounded-lg"
                />
                <div className="mt-1 flex justify-between text-[11px] text-slate-300 font-semibold" style={{ color: "#CBD5E1" }}>
                  <span>17 {t("wiz_years")}</span>
                  <span className="font-bold text-[#F97316]" style={{ color: "#F97316" }}>{data.age} {t("wiz_years")}</span>
                  <span>70 {t("wiz_years")}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: Your Goal */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white" style={{ color: "#FFFFFF" }}>
                  {t("wiz_title_1")}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-200 font-medium" style={{ color: "#E2E8F0" }}>
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
                        ? "liquid-glass-active text-[#FED7AA] border-[#F97316] shadow-lg shadow-orange-500/20 scale-[1.02]"
                        : "liquid-glass-inner text-slate-200 border-white/10 hover:bg-white/15 hover:border-white/25"
                    }`}
                  >
                    <span className="text-2xl mb-2">{p.icon}</span>
                    <span className="text-sm font-bold text-white block" style={{ color: "#FFFFFF" }}>{p.label}</span>
                    <span className="text-[11px] text-slate-300 mt-1 leading-snug font-medium" style={{ color: "#CBD5E1" }}>{p.hint}</span>
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
                      <span className="mb-2 block text-xs sm:text-sm font-bold text-white" style={{ color: "#FFFFFF" }}>
                        {t("wiz_course_loc")}
                      </span>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => update("courseLocation", "india")}
                          className={`rounded-2xl border p-3 text-xs sm:text-sm font-bold transition ${
                            data.courseLocation === "india"
                              ? "liquid-glass-active text-[#FED7AA] border-[#F97316]"
                              : "liquid-glass-inner text-slate-200 border-white/10 hover:bg-white/15"
                          }`}
                          style={{ color: data.courseLocation === "india" ? "#FED7AA" : "#FFFFFF" }}
                        >
                          {t("wiz_course_in")}
                        </button>
                        <button
                          type="button"
                          onClick={() => update("courseLocation", "abroad")}
                          className={`rounded-2xl border p-3 text-xs sm:text-sm font-bold transition ${
                            data.courseLocation === "abroad"
                              ? "liquid-glass-active text-[#FED7AA] border-[#F97316]"
                              : "liquid-glass-inner text-slate-200 border-white/10 hover:bg-white/15"
                          }`}
                          style={{ color: data.courseLocation === "abroad" ? "#FED7AA" : "#FFFFFF" }}
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
                <h2 className="text-xl sm:text-2xl font-black text-white" style={{ color: "#FFFFFF" }}>
                  {t("wiz_title_2")}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-200 font-medium" style={{ color: "#E2E8F0" }}>
                  {t("wiz_sub_2")}
                </p>
              </div>

              {/* Project Cost Slider */}
              <div>
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-white mb-2" style={{ color: "#FFFFFF" }}>
                  <span>{data.purpose === "education" ? t("wiz_course_cost_lbl") : t("wiz_cost_lbl")}</span>
                  <span className="text-base sm:text-lg font-black text-[#F97316]" style={{ color: "#F97316" }}>
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
                  className="w-full accent-[#F97316] cursor-pointer h-2 bg-white/10 rounded-lg"
                />
                <div className="mt-1 flex justify-between text-[11px] text-slate-300 font-semibold" style={{ color: "#CBD5E1" }}>
                  <span>₹10,000</span>
                  <span className="text-[#22C55E] font-bold">
                    {t("wiz_financed_lbl")} {formatINR(Math.round(data.projectCost * 0.9))}
                  </span>
                  <span>{formatINR(data.purpose === "education" ? (data.courseLocation === "abroad" ? 4000000 : 2500000) : 5000000)}</span>
                </div>
              </div>

              {/* Annual Income Slider */}
              <div>
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-white mb-2" style={{ color: "#FFFFFF" }}>
                  <span>{t("wiz_income_lbl")}</span>
                  <span className="text-base sm:text-lg font-black text-[#F97316]" style={{ color: "#F97316" }}>
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
                  className="w-full accent-[#F97316] cursor-pointer h-2 bg-white/10 rounded-lg"
                />
                <div className="mt-1 flex justify-between text-[11px] text-slate-300 font-semibold" style={{ color: "#CBD5E1" }}>
                  <span>₹50,000/yr</span>
                  <span>₹12,00,000/yr</span>
                </div>
                <p className="mt-2 text-[11px] text-[#FED7AA] font-medium leading-relaxed" style={{ color: "#FED7AA" }}>
                  {t("wiz_income_rule")}
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: Background & Review */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white" style={{ color: "#FFFFFF" }}>
                  {t("wiz_title_3")}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-slate-200 font-medium" style={{ color: "#E2E8F0" }}>
                  {t("wiz_sub_3")}
                </p>
              </div>

              {/* Education Level */}
              <AnimatedSelect
                label={t("wiz_edu_lbl")}
                placeholder={t("wiz_edu_ph")}
                value={EDUCATION_LEVELS.find((l) => l.id === data.educationLevel)?.label || "10th – 12th"}
                items={EDUCATION_LEVELS.map((l) => l.label)}
                onChange={(val) => {
                  const found = EDUCATION_LEVELS.find((l) => l.label === val);
                  if (found) update("educationLevel", found.id);
                }}
              />

              {/* Summary Box */}
              <div className="rounded-2xl liquid-glass-inner p-4 space-y-2 text-xs sm:text-sm">
                <p className="font-bold text-[#FED7AA] mb-1" style={{ color: "#FED7AA" }}>📋 {t("wiz_profile_sum")}</p>
                <div className="flex justify-between text-slate-200 font-medium" style={{ color: "#E2E8F0" }}>
                  <span>{t("wiz_sum_loc")}</span>
                  <span className="font-bold text-white" style={{ color: "#FFFFFF" }}>{data.district}, {data.state}</span>
                </div>
                <div className="flex justify-between text-slate-200 font-medium" style={{ color: "#E2E8F0" }}>
                  <span>{t("wiz_sum_pur")}</span>
                  <span className="font-bold text-white" style={{ color: "#FFFFFF" }}>{data.activityType}</span>
                </div>
                <div className="flex justify-between text-slate-200 font-medium" style={{ color: "#E2E8F0" }}>
                  <span>{t("wiz_sum_cost")}</span>
                  <span className="font-bold text-[#F97316]" style={{ color: "#F97316" }}>{formatINR(data.projectCost)}</span>
                </div>
                <div className="flex justify-between text-slate-200 font-medium" style={{ color: "#E2E8F0" }}>
                  <span>{t("wiz_sum_inc")}</span>
                  <span className="font-bold text-white" style={{ color: "#FFFFFF" }}>{formatINR(data.annualIncome)}/yr</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Action Buttons */}
          <div className="mt-8 flex items-center justify-between gap-3 pt-4 border-t border-white/10">
            {step > 0 ? (
              <button
                type="button"
                onClick={prevStep}
                disabled={submitting}
                className="rounded-xl liquid-glass-inner px-5 py-2.5 text-xs sm:text-sm font-bold text-white transition hover:bg-white/20"
                style={{ color: "#FFFFFF" }}
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
                style={{ color: "#FFFFFF" }}
              >
                {t("wiz_btn_continue")}
              </button>
            ) : (
              <button
                type="button"
                onClick={onSubmit}
                disabled={submitting}
                className="rounded-xl bg-[#F97316] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:bg-[#EA580C] hover:scale-[1.02] disabled:opacity-50"
                style={{ color: "#FFFFFF" }}
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
