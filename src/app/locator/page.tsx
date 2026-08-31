"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState, useRef } from "react";
import { useJourney } from "@/context/JourneyContext";
import { useTranslation } from "@/context/LanguageContext";
import { DISTRICT_COORDS, LOCATIONS } from "@/lib/locations";
import type { PartnerType, PartnerWithMeta, SchemeId } from "@/lib/types";
import SiteBackground from "@/components/SiteBackground";
import AnimatedList from "@/components/AnimatedList";

const MapClient = dynamic(() => import("@/components/MapClient"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-[#0B0F19]/80 text-xs text-[#FED7AA]" style={{ color: "#FED7AA" }}>
      Loading interactive map…
    </div>
  ),
});

const SCHEME_LABELS: Record<SchemeId, string> = {
  "micro-finance": "Micro Finance",
  "term-loan": "Term Loan",
  "education-loan": "Education Loan",
};

const TYPE_LABELS: Record<PartnerType, string> = {
  "public-sector-bank": "PSU Bank",
  "private-bank": "Private Bank",
  nbfc: "NBFC",
  "regional-agency": "Govt. Agency",
  cooperative: "Co-op Bank",
};

const HEALTH_PILL: Record<PartnerWithMeta["healthStatus"], string> = {
  green: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold",
  yellow: "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold",
  red: "bg-red-500/20 text-red-300 border border-red-500/40 font-bold",
};

/** Animated Dropdown with Search & Alphabetical Sorting */
function LocatorDropdown({
  label,
  value,
  items,
  onSelect,
}: {
  label: string;
  value: string;
  items: string[];
  onSelect: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sort and filter by letter or search text
  const sortedAndFilteredItems = useMemo(() => {
    const sorted = [...items].sort((a, b) => {
      if (a === "All" || a === "All Schemes" || a === "All Types") return -1;
      if (b === "All" || b === "All Schemes" || b === "All Types") return 1;
      return a.localeCompare(b);
    });

    if (!search.trim()) return sorted;

    const q = search.trim().toLowerCase();
    const exactStart = sorted.filter((item) => item.toLowerCase().startsWith(q));
    const contains = sorted.filter(
      (item) => !item.toLowerCase().startsWith(q) && item.toLowerCase().includes(q)
    );

    return [...exactStart, ...contains];
  }, [items, search]);

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
      `[data-locator-item-index="${highlightedIndex}"]`
    ) as HTMLElement | null;
    if (el) {
      el.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex, open]);

  const selectItem = (item: string) => {
    onSelect(item);
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
    <div ref={ref} className={`relative ${open ? "z-[99999]" : "z-20"}`}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="flex items-center gap-1.5 rounded-xl liquid-glass-inner px-3.5 py-2 text-xs font-bold text-white outline-none hover:border-[#F97316]/50 focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/30 transition shadow-md"
        style={{ color: "#FFFFFF" }}
      >
        <span className="text-[#F97316] font-extrabold" style={{ color: "#F97316" }}>{label}:</span>
        <span className="text-white font-bold max-w-[110px] sm:max-w-[140px] truncate" style={{ color: "#FFFFFF" }}>{value}</span>
        <span className={`text-[10px] text-[#F97316] transition-transform duration-200 ${open ? "rotate-180" : ""}`} style={{ color: "#F97316" }}>
          ▲
        </span>
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-2 z-[99999] min-w-[220px] rounded-2xl bg-[#0B0F19]/95 backdrop-blur-2xl p-2.5 shadow-[0_25px_60px_rgba(0,0,0,0.95)] border border-[#F97316]/50 ring-1 ring-white/20 animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Bar inside dropdown */}
          <div className="mb-2 flex items-center gap-1.5 rounded-xl border border-white/20 liquid-glass-inner px-2.5 py-2">
            <span className="text-xs text-[#FED7AA]">🔍</span>
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type letter to search..."
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
            className="w-full max-h-52 overflow-y-auto space-y-1 pr-1 scrollable-touch"
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

  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const allDistricts = useMemo(() => {
    const list = Object.values(LOCATIONS).flat();
    return Array.from(new Set(list));
  }, []);

  const schemeOptions = ["All Schemes", "Micro Finance", "Term Loan", "Education Loan"];
  const typeOptions = ["All Types", "PSU Bank", "Private Bank", "NBFC", "Govt. Agency", "Co-op Bank"];

  // Geo Location trigger
  const requestLocation = () => {
    if (!navigator.geolocation) return;
    setGeoLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setGeoLocating(false);
      },
      () => setGeoLocating(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (schemeFilter !== "all") query.set("scheme", schemeFilter);
        if (typeFilter !== "all") query.set("type", typeFilter);
        if (districtFilter && districtFilter !== "All") query.set("district", districtFilter);
        if (includeHighNpa) query.set("includeHighNpa", "true");

        if (userLocation) {
          query.set("userLat", String(userLocation.lat));
          query.set("userLng", String(userLocation.lng));
        } else if (districtFilter && DISTRICT_COORDS[districtFilter]) {
          const c = DISTRICT_COORDS[districtFilter];
          query.set("userLat", String(c.lat));
          query.set("userLng", String(c.lng));
        }

        const res = await fetch(`/api/partners?${query.toString()}`);
        if (!res.ok) throw new Error("Failed to load partners");
        const json = await res.json();
        const list = (json.partners || []) as PartnerWithMeta[];

        // Strict nearest-first sorting
        list.sort((a, b) => {
          if (a.distanceKm >= 0 && b.distanceKm >= 0) return a.distanceKm - b.distanceKm;
          if (a.distanceKm >= 0) return -1;
          if (b.distanceKm >= 0) return 1;
          return a.npaPercent - b.npaPercent;
        });

        setPartners(list);
        if (list.length > 0 && !selectedId) {
          setSelectedId(list[0].id);
        }
      } catch {
        setPartners([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [schemeFilter, typeFilter, districtFilter, includeHighNpa, userLocation]);

  // Filter list to nearby offices (<= 500 km) while preserving full India map
  const displayList = useMemo(() => {
    const nearby = partners.filter((p) => p.distanceKm >= 0 && p.distanceKm <= 500);
    if (nearby.length > 0) {
      // If a user selects an office from the map outside 500km, prepend it so they see it
      if (selectedId && !nearby.some((p) => p.id === selectedId)) {
        const found = partners.find((p) => p.id === selectedId);
        if (found) return [found, ...nearby];
      }
      return nearby;
    }
    return partners.slice(0, 30);
  }, [partners, selectedId]);

  // Compute map center
  const mapCenter = useMemo(() => {
    if (selectedId) {
      const found = partners.find((p) => p.id === selectedId);
      if (found) return [found.lat, found.lng] as [number, number];
    }
    if (userLocation) return [userLocation.lat, userLocation.lng] as [number, number];
    if (districtFilter && DISTRICT_COORDS[districtFilter]) {
      const c = DISTRICT_COORDS[districtFilter];
      return [c.lat, c.lng] as [number, number];
    }
    return [20.5937, 78.9629] as [number, number]; // Center of India
  }, [selectedId, userLocation, districtFilter, partners]);

  // Auto-scroll list when partner is selected on map
  const handleSelectPartner = (id: string | null) => {
    setSelectedId(id);
    if (id && cardRefs.current[id]) {
      cardRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0B0F19] text-white py-8 sm:py-12 px-3 sm:px-4 selection:bg-[#F97316] selection:text-white" style={{ color: "#FFFFFF" }}>
      {/* Dark Ambient Background with DotGrid Texture */}
      <SiteBackground interactive={false} />

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Header Title */}
        <div className="text-center sm:text-left mb-6">
          <span className="inline-block rounded-full liquid-glass-active px-3.5 py-1 text-xs font-bold tracking-wide text-[#FED7AA] uppercase shadow-lg shadow-orange-950/30" style={{ color: "#FED7AA" }}>
            {t("loc_tag")}
          </span>
          <h1 className="mt-2.5 text-2xl sm:text-3xl font-extrabold text-white tracking-tight md:text-4xl" style={{ color: "#FFFFFF" }}>
            {t("loc_title")}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-200 font-medium" style={{ color: "#E2E8F0" }}>
            {t("loc_sub")}
          </p>
        </div>

        {/* Toolbar Filters with Liquid Glass */}
        <div className="relative z-40 rounded-3xl liquid-glass p-4 sm:p-5 shadow-2xl mb-6 flex flex-wrap items-center justify-between gap-3">
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
              style={{ color: "#FFFFFF" }}
            >
              <span>📍</span>
              <span>{geoLocating ? "Locating…" : t("loc_near_me")}</span>
            </button>

            {/* High NPA Toggle */}
            <label className="flex items-center gap-2 text-xs font-bold text-slate-200 cursor-pointer liquid-glass-inner px-3 py-2 rounded-xl" style={{ color: "#E2E8F0" }}>
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
        <div className="mb-4 flex flex-wrap items-center justify-between text-xs text-[#FED7AA] font-bold px-1">
          <span>
            📍 Showing <strong className="text-white font-extrabold">{displayList.length}</strong> nearby branches (within 500 km range)
          </span>
          <span className="text-slate-300 font-medium">
            🗺️ <strong className="text-white font-bold">{partners.length}</strong> offices across all of India on Map
          </span>
        </div>

        {/* Content Layout: Left Partner List (<=500km), Right Map (All India) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.15fr]">
          {/* Nearby Partners List */}
          <div className="space-y-3.5 max-h-[620px] overflow-y-auto pr-1 scrollable-touch">
            {loading ? (
              <div className="flex h-64 items-center justify-center rounded-3xl liquid-glass">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#F97316]/20 border-t-[#F97316]" />
                  <p className="text-xs font-bold text-[#FED7AA]" style={{ color: "#FED7AA" }}>Finding partner branches…</p>
                </div>
              </div>
            ) : displayList.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center rounded-3xl liquid-glass p-6 text-center">
                <span className="text-3xl mb-2">🔍</span>
                <p className="text-sm font-bold text-white" style={{ color: "#FFFFFF" }}>No partner branches within 500 km match this filter.</p>
                <p className="text-xs text-slate-300 mt-1" style={{ color: "#CBD5E1" }}>Try zooming out on the map or changing district.</p>
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
                      ? "liquid-glass-active border-[#F97316] shadow-xl shadow-orange-500/20 scale-[1.01]"
                      : "liquid-glass hover:bg-white/15"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        {idx === 0 && (
                          <span className="rounded-md bg-[#22C55E] px-1.5 py-0.5 text-[10px] font-black uppercase text-white">
                            {t("loc_nearest_badge")}
                          </span>
                        )}
                        <h3 className="text-sm sm:text-base font-extrabold text-white leading-tight" style={{ color: "#FFFFFF" }}>
                          {p.name}
                        </h3>
                      </div>
                      <p className="mt-1 text-xs text-slate-100 font-medium" style={{ color: "#F1F5F9" }}>
                        {p.city} · <span className="font-bold text-white" style={{ color: "#FFFFFF" }}>{p.district}, {p.state}</span>
                      </p>
                    </div>

                    <span className={`rounded-xl px-2.5 py-1 text-[11px] whitespace-nowrap ${HEALTH_PILL[p.healthStatus]}`}>
                      {p.healthStatus === "green" ? "Healthy" : p.healthStatus === "yellow" ? "Watchlist" : "High NPA"} ({p.npaPercent}% NPA)
                    </span>
                  </div>

                  {/* Address & Actions */}
                  <p className="mt-2.5 text-xs leading-relaxed text-slate-100 font-medium" style={{ color: "#F1F5F9" }}>
                    📍 {p.address} {p.pincode && `— ${p.pincode}`}
                  </p>

                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg liquid-glass-inner px-2.5 py-1 text-[11px] font-bold text-[#FED7AA]" style={{ color: "#FED7AA" }}>
                        {TYPE_LABELS[p.type]}
                      </span>
                      {typeof p.distanceKm === "number" && p.distanceKm >= 0 && (
                        <span className="font-mono font-bold text-[#F97316] text-xs" style={{ color: "#F97316" }}>
                          📏 {p.distanceKm.toFixed(1)} km away
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {p.phone && (
                        <a
                          href={`tel:${p.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded-lg liquid-glass-inner px-2.5 py-1 font-bold text-[#F97316] hover:bg-[#F97316] hover:text-white transition"
                          style={{ color: "#F97316" }}
                        >
                          {t("loc_call")}
                        </a>
                      )}
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="rounded-lg bg-[#F97316] px-2.5 py-1 font-bold text-white hover:bg-[#EA580C] transition"
                        style={{ color: "#FFFFFF" }}
                      >
                        {t("loc_directions")}
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Interactive Map with All-India Network */}
          <div className="h-[480px] lg:h-[620px] rounded-3xl overflow-hidden liquid-glass border border-white/15 shadow-2xl relative">
            <MapClient
              partners={partners}
              center={mapCenter}
              zoom={selectedId ? 14 : 7}
              selectedId={selectedId}
              userLocation={userLocation}
              onSelect={handleSelectPartner}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
