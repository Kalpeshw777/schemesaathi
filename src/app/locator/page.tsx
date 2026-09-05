"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useMemo, useRef } from "react";
import SiteBackground from "@/components/SiteBackground";
import { useJourney } from "@/context/JourneyContext";
import { useTranslation } from "@/context/LanguageContext";
import { LOCATIONS } from "@/lib/locations";
import { formatINR } from "@/lib/format";
import type { PartnerWithMeta, SchemeId, PartnerType } from "@/lib/types";

// Dynamic import for Leaflet Map to avoid SSR issues
const MapClient = dynamic(() => import("@/components/MapClient"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-[#0B0F19] text-xs font-bold text-slate-500 dark:text-slate-400">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#F97316]/20 border-t-[#F97316]" />
        <span>Loading Interactive Sovereign Map…</span>
      </div>
    </div>
  ),
});

const TYPE_LABELS: Record<PartnerType, string> = {
  "public-sector-bank": "PSU Bank",
  "private-bank": "Private Bank",
  "regional-agency": "Govt. Agency",
  "nbfc": "NBFC",
  "cooperative": "Co-op Bank",
};

const SCHEME_LABELS: Record<SchemeId, string> = {
  "micro-finance": "Micro Finance",
  "term-loan": "Term Loan",
  "education-loan": "Education Loan",
};

const HEALTH_PILL: Record<"green" | "yellow" | "red", string> = {
  green: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-bold",
  yellow: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-bold",
  red: "bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/30 font-bold",
};

interface ApplicationDossier {
  refNumber: string;
  partnerName: string;
  partnerAddress: string;
  partnerCity: string;
  partnerPhone?: string;
  schemeName: string;
  loanAmount: number;
  applicantDistrict: string;
  applicantCategory: string;
  date: string;
}

interface LocatorDropdownProps {
  label: string;
  value: string;
  items: string[];
  onSelect: (item: string) => void;
}

function LocatorDropdown({
  label,
  value,
  items,
  onSelect,
}: LocatorDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const ref = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Alphabetical sort + search filter
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
        `[data-locator-item-index="${highlightedIndex}"]`
      );
      if (el) {
        el.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [highlightedIndex, open]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectItem = (item: string) => {
    onSelect(item);
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
    <div ref={ref} className={`relative ${open ? "z-[99999]" : "z-20"}`}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="flex items-center gap-1.5 rounded-xl liquid-glass-inner px-3.5 py-2 text-xs font-bold text-slate-800 dark:text-white outline-none hover:border-[#F97316]/50 focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/30 transition shadow-sm"
      >
        <span className="text-[#F97316] font-extrabold">{label}:</span>
        <span className="text-slate-900 dark:text-white font-bold max-w-[110px] sm:max-w-[140px] truncate">{value}</span>
        <span className={`text-[10px] text-[#F97316] transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          ▲
        </span>
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-2 z-[99999] min-w-[220px] rounded-2xl bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-2xl p-2.5 shadow-xl dark:shadow-[0_25px_60px_rgba(0,0,0,0.95)] border border-slate-300 dark:border-[#F97316]/50 ring-1 ring-black/5 dark:ring-white/20 animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Bar inside dropdown */}
          <div className="mb-2 flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-white/20 liquid-glass-inner px-2.5 py-2">
            <span className="text-xs text-[#F97316]">🔍</span>
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type letter to search..."
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
            className="w-full max-h-52 overflow-y-auto space-y-1 pr-1 scrollable-touch"
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
                    data-locator-item-index={idx}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      selectItem(item);
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      selectItem(item);
                    }}
                    className={`flex items-center justify-between rounded-xl px-3 py-1.5 text-xs font-bold cursor-pointer transition select-none ${
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

export default function LocatorPage() {
  const { profile, recommendation } = useJourney();
  const { t } = useTranslation();

  const [partners, setPartners] = useState<PartnerWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [schemeFilter, setSchemeFilter] = useState<SchemeId | "all">(
    recommendation?.schemeId ?? "all"
  );
  const [typeFilter, setTypeFilter] = useState<PartnerType | "all">("all");
  const [districtFilter, setDistrictFilter] = useState<string>(
    profile?.district || "Nandurbar"
  );
  const [includeHighNpa, setIncludeHighNpa] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [geoLocating, setGeoLocating] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Application Dossier State
  const [activeDossier, setActiveDossier] = useState<ApplicationDossier | null>(null);

  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Collect all unique districts from all states for dropdown
  const allDistricts = useMemo(() => {
    const set = new Set<string>();
    Object.values(LOCATIONS).forEach((distList) => {
      distList.forEach((d) => set.add(d));
    });
    return Array.from(set).sort((a, b) =>
      a.localeCompare(b, "en", { sensitivity: "base" })
    );
  }, []);

  const schemeOptions = ["All Schemes", "Micro Finance", "Term Loan", "Education Loan"];
  const typeOptions = ["All Types", "PSU Bank", "Private Bank", "Govt. Agency", "NBFC", "Co-op Bank"];

  // Fetch partners from API
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (schemeFilter !== "all") params.set("scheme", schemeFilter);
        if (typeFilter !== "all") params.set("type", typeFilter);
        if (districtFilter) params.set("district", districtFilter);
        if (includeHighNpa) params.set("includeHighNpa", "true");
        if (userLocation) {
          params.set("lat", userLocation.lat.toString());
          params.set("lng", userLocation.lng.toString());
        }

        const res = await fetch(`/api/partners?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to load channel partners");
        const data = await res.json();
        if (!cancelled) {
          setPartners(data.partners || []);
          if (data.partners && data.partners.length > 0 && !selectedId) {
            setSelectedId(data.partners[0].id);
          }
        }
      } catch (err) {
        console.error("Locator load error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [schemeFilter, typeFilter, districtFilter, includeHighNpa, userLocation, selectedId]);

  // Request browser geolocation
  const requestLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setGeoLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setGeoLocating(false);
      },
      (err) => {
        console.warn("Geolocation denied or unavailable:", err.message);
        setGeoLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Nearby list filter (<= 500 km or top 30)
  const displayList = useMemo(() => {
    const nearby = partners.filter(
      (p) => typeof p.distanceKm === "number" && p.distanceKm <= 500
    );
    return nearby.length > 0 ? nearby : partners.slice(0, 30);
  }, [partners]);

  // Derive center coordinate
  const mapCenter = useMemo<[number, number]>(() => {
    if (selectedId) {
      const p = partners.find((x) => x.id === selectedId);
      if (p) return [p.lat, p.lng];
    }
    if (userLocation) {
      return [userLocation.lat, userLocation.lng];
    }
    if (partners.length > 0) {
      return [partners[0].lat, partners[0].lng];
    }
    return [21.7469, 74.1415];
  }, [selectedId, userLocation, partners]);

  // Auto-scroll list when partner is selected on map
  const handleSelectPartner = (id: string | null) => {
    setSelectedId(id);
    if (id && cardRefs.current[id]) {
      cardRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  // Handle "Send My Application to This Partner"
  const handleSendApplication = (partner: PartnerWithMeta) => {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const refNum = `SS-2026-${randomSuffix}`;

    const loanAmt =
      recommendation?.eligibleAmount ||
      (profile?.projectCost ? Math.round(profile.projectCost * 0.9) : 140000);

    const schemeName =
      recommendation?.schemeName ||
      (profile?.purpose === "education"
        ? "Educational Loan Scheme"
        : (profile?.projectCost || 140000) <= 140000
        ? "Micro Finance Scheme"
        : "Term Loan Scheme");

    const dossier: ApplicationDossier = {
      refNumber: refNum,
      partnerName: partner.name,
      partnerAddress: `${partner.address}, ${partner.district}, ${partner.state}`,
      partnerCity: partner.city,
      partnerPhone: partner.phone,
      schemeName,
      loanAmount: loanAmt,
      applicantDistrict: profile?.district || districtFilter || "Nandurbar",
      applicantCategory: profile?.category?.toUpperCase() || "SC",
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };

    setActiveDossier(dossier);

    // Save to localStorage
    try {
      const existing = JSON.parse(
        localStorage.getItem("schemesaathi_applications") || "[]"
      );
      existing.unshift(dossier);
      localStorage.setItem("schemesaathi_applications", JSON.stringify(existing.slice(0, 10)));
    } catch {}
  };

  return (
    <div className="relative min-h-screen text-[var(--foreground)] py-8 sm:py-12 px-3 sm:px-4 selection:bg-[#F97316] selection:text-white">
      {/* Static Minimalist Ambient Background */}
      <SiteBackground interactive={false} />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <span className="inline-block rounded-full liquid-glass-active px-3.5 py-1 text-xs font-bold tracking-wide uppercase shadow-sm">
              {t("loc_tag")}
            </span>
            <h1 className="mt-2.5 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight md:text-4xl">
              {t("loc_title")}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-200 font-medium">
              {t("loc_sub")}
            </p>
          </div>

          {/* Sovereign Boundary Status Badge */}
          <div className="rounded-2xl liquid-glass border border-slate-300 dark:border-white/20 px-3.5 py-2 text-xs font-bold text-slate-800 dark:text-white flex items-center gap-2 self-start sm:self-auto shadow-sm">
            <span>🇮🇳</span>
            <span>Survey of India Compliant Map</span>
          </div>
        </div>

        {/* Toolbar Filters */}
        <div className="relative z-40 rounded-3xl liquid-glass p-4 sm:p-5 shadow-sm dark:shadow-2xl mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Scheme Filter */}
            <LocatorDropdown
              label="Scheme"
              value={schemeFilter === "all" ? "All Schemes" : SCHEME_LABELS[schemeFilter]}
              items={schemeOptions}
              onSelect={(val) => {
                if (val === "Micro Finance") setSchemeFilter("micro-finance");
                else if (val === "Term Loan") setSchemeFilter("term-loan");
                else if (val === "Education Loan") setSchemeFilter("education-loan");
                else setSchemeFilter("all");
              }}
            />

            {/* Type Filter */}
            <LocatorDropdown
              label={t("loc_type_lbl")}
              value={typeFilter === "all" ? "All Types" : TYPE_LABELS[typeFilter]}
              items={typeOptions}
              onSelect={(val) => {
                if (val === "PSU Bank") setTypeFilter("public-sector-bank");
                else if (val === "Private Bank") setTypeFilter("private-bank");
                else if (val === "NBFC") setTypeFilter("nbfc");
                else if (val === "Govt. Agency") setTypeFilter("regional-agency");
                else if (val === "Co-op Bank") setTypeFilter("cooperative");
                else setTypeFilter("all");
              }}
            />

            {/* District Filter */}
            <LocatorDropdown
              label={t("loc_dist_lbl")}
              value={districtFilter || "All"}
              items={["All", ...allDistricts]}
              onSelect={(val) => setDistrictFilter(val === "All" ? "" : val)}
            />
          </div>

          <div className="flex items-center gap-2.5">
            {/* Geolocation Button */}
            <button
              type="button"
              onClick={requestLocation}
              disabled={geoLocating}
              className="flex items-center gap-1.5 rounded-xl bg-[#F97316] px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-orange-500/25 transition hover:bg-[#EA580C] hover:scale-[1.02] disabled:opacity-50"
            >
              <span>📍</span>
              <span>{geoLocating ? "Locating…" : t("loc_near_me")}</span>
            </button>

            {/* High NPA Toggle: Off by default */}
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer liquid-glass-inner px-3 py-2 rounded-xl">
              <input
                type="checkbox"
                checked={includeHighNpa}
                onChange={(e) => setIncludeHighNpa(e.target.checked)}
                className="h-3.5 w-3.5 rounded accent-[#F97316]"
              />
              <span>{t("loc_show_npa")}</span>
            </label>
          </div>
        </div>

        {/* Proximity Status Pill */}
        <div className="relative z-10 mb-4 flex flex-wrap items-center justify-between text-xs text-[#EA580C] dark:text-[#FED7AA] font-bold px-1">
          <span>
            📍 Showing <strong className="text-slate-900 dark:text-white font-black">{displayList.length}</strong> nearby branches (Healthy & Watchlist first)
          </span>
          <span className="text-slate-600 dark:text-slate-300 font-medium">
            🗺️ <strong className="text-slate-900 dark:text-white font-bold">{partners.length}</strong> branches across India on Sovereign Map
          </span>
        </div>

        {/* Content Layout: Left Partner List, Right Map */}
        <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.15fr]">
          {/* Nearby Partners List */}
          <div className="space-y-3.5 max-h-[620px] overflow-y-auto pr-1 scrollable-touch">
            {loading ? (
              <div className="flex h-64 items-center justify-center rounded-3xl liquid-glass">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#F97316]/20 border-t-[#F97316]" />
                  <p className="text-xs font-bold text-[#EA580C] dark:text-[#FED7AA]">Finding partner branches…</p>
                </div>
              </div>
            ) : displayList.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center rounded-3xl liquid-glass p-6 text-center">
                <span className="text-3xl mb-2">🔍</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">No partner branches match this filter.</p>
                <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">Try toggling &ldquo;Show high-NPA partners&rdquo; or changing district.</p>
              </div>
            ) : (
              displayList.map((p, idx) => (
                <div
                  key={p.id}
                  ref={(el) => {
                    cardRefs.current[p.id] = el;
                  }}
                  onClick={() => handleSelectPartner(p.id)}
                  className={`cursor-pointer rounded-3xl p-5 transition-all duration-200 ${
                    selectedId === p.id
                      ? "liquid-glass-active border-[#F97316] shadow-lg scale-[1.01]"
                      : "liquid-glass hover:border-slate-300 dark:hover:bg-white/15"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        {idx === 0 && (
                          <span className="rounded-md bg-[#16A34A] dark:bg-[#22C55E] px-1.5 py-0.5 text-[10px] font-black uppercase text-white">
                            {t("loc_nearest_badge")}
                          </span>
                        )}
                        <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight">
                          {p.name}
                        </h3>
                      </div>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-200 font-medium">
                        {p.city} · <span className="font-bold text-slate-900 dark:text-white">{p.district}, {p.state}</span>
                      </p>
                    </div>

                    <span className={`rounded-xl px-2.5 py-1 text-[11px] whitespace-nowrap ${HEALTH_PILL[p.healthStatus]}`}>
                      {p.healthStatus === "green" ? "Healthy (<5% NPA)" : p.healthStatus === "yellow" ? "Watchlist (5-10% NPA)" : "High NPA (≥10%)"} ({p.npaPercent}% NPA)
                    </span>
                  </div>

                  {/* Address & Actions */}
                  <p className="mt-2.5 text-xs leading-relaxed text-slate-600 dark:text-slate-200 font-medium">
                    📍 {p.address} {p.pincode && `— ${p.pincode}`}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-200 dark:border-white/10 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg liquid-glass-inner px-2.5 py-1 text-[11px] font-bold text-[#EA580C] dark:text-[#FED7AA]">
                        {TYPE_LABELS[p.type]}
                      </span>
                      {typeof p.distanceKm === "number" && p.distanceKm >= 0 && (
                        <span className="font-mono font-bold text-[#F97316] text-xs">
                          📏 {p.distanceKm.toFixed(1)} km away
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {p.phone && (
                        <a
                          href={`tel:${p.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded-lg liquid-glass-inner px-2.5 py-1 font-bold text-[#F97316] hover:bg-[#F97316] hover:text-white transition"
                        >
                          {t("loc_call")}
                        </a>
                      )}
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="rounded-lg liquid-glass-inner px-2.5 py-1 font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition"
                      >
                        {t("loc_directions")}
                      </a>
                      {/* Send Application CTA Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSendApplication(p);
                        }}
                        className="rounded-lg bg-[#F97316] px-3 py-1 font-bold text-white hover:bg-[#EA580C] shadow-md shadow-orange-500/20 transition hover:scale-[1.02]"
                      >
                        {t("loc_btn_send_app")} →
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Interactive Map (Survey of India Sovereign Boundary Compliant) */}
          <div className="h-[480px] lg:h-[620px] rounded-3xl overflow-hidden liquid-glass border border-slate-300 dark:border-white/15 shadow-sm dark:shadow-2xl relative">
            <MapClient
              partners={partners}
              center={mapCenter}
              zoom={selectedId ? 14 : 7}
              selectedId={selectedId}
              userLocation={userLocation}
              onSelect={setSelectedId}
            />
          </div>
        </div>
      </div>

      {/* Application Confirmation Modal */}
      {activeDossier && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setActiveDossier(null)}
        >
          <div
            className="w-full max-w-xl rounded-3xl liquid-glass p-6 sm:p-8 shadow-2xl border border-slate-300 dark:border-white/20 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-0.5 text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400 border border-emerald-500/40 mb-1.5">
                  <span>✓</span>
                  <span>{t("modal_submitted_badge")}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {t("modal_app_title")}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-200 font-medium mt-0.5">
                  {t("modal_app_sub")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveDossier(null)}
                className="rounded-xl liquid-glass-inner p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            {/* Dossier Summary Box */}
            <div className="my-4 rounded-2xl liquid-glass-inner p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-white/10 pb-2.5">
                <span className="text-xs text-slate-500 dark:text-slate-300 font-semibold">{t("modal_ref_lbl")}:</span>
                <span className="font-mono text-sm font-black text-[#F97316] bg-orange-500/10 px-2.5 py-0.5 rounded-lg border border-orange-500/30">
                  {activeDossier.refNumber}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-300 font-semibold block">{t("modal_partner_lbl")}</span>
                  <strong className="text-slate-900 dark:text-white font-black block mt-0.5">{activeDossier.partnerName}</strong>
                  <span className="text-[11px] text-slate-600 dark:text-slate-200 block">{activeDossier.partnerAddress}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-300 font-semibold block">{t("modal_scheme_lbl")}</span>
                  <strong className="text-slate-900 dark:text-white font-black block mt-0.5">{activeDossier.schemeName}</strong>
                  <span className="text-[11px] font-bold text-[#F97316] block mt-0.5">
                    {t("modal_amount_lbl")}: {formatINR(activeDossier.loanAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Next Steps Guidance */}
            <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 p-4 text-xs space-y-2">
              <p className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-wider text-[#EA580C] dark:text-[#FED7AA]">
                📋 {t("modal_next_title")}
              </p>
              <p className="text-slate-700 dark:text-slate-200 font-medium">
                {t("modal_step_1")}
              </p>
              <p className="text-slate-700 dark:text-slate-200 font-medium">
                {t("modal_step_2")}
              </p>
              <p className="text-slate-700 dark:text-slate-200 font-medium">
                {t("modal_step_3")}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-xl liquid-glass px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition"
              >
                🖨️ {t("modal_btn_print")}
              </button>
              <button
                type="button"
                onClick={() => setActiveDossier(null)}
                className="rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white px-5 py-2.5 text-xs font-black shadow-lg shadow-orange-500/25 transition"
              >
                {t("modal_btn_done")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
