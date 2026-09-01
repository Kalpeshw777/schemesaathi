"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import { CircleMarker, MapContainer, TileLayer, Popup, Tooltip, useMap } from "react-leaflet";
import { useTheme } from "@/context/ThemeContext";
import type { PartnerWithMeta } from "@/lib/types";
import L from "leaflet";

const COLORS: Record<PartnerWithMeta["healthStatus"], string> = {
  green: "#16A34A",
  yellow: "#D97706",
  red: "#DC2626",
};

/** Smooth, non-jerky map camera controller with gentle easing */
function MapController({
  center,
  zoom,
  selectedPartner,
}: {
  center: [number, number];
  zoom: number;
  selectedPartner?: PartnerWithMeta | null;
}) {
  const map = useMap();
  const prevCoordRef = useRef<string>("");

  useEffect(() => {
    if (selectedPartner) {
      const key = `partner-${selectedPartner.lat}-${selectedPartner.lng}`;
      if (prevCoordRef.current !== key) {
        prevCoordRef.current = key;
        map.flyTo([selectedPartner.lat, selectedPartner.lng], 14, {
          duration: 1.0,
          easeLinearity: 0.2,
        });
      }
    } else if (center) {
      const key = `center-${center[0]}-${center[1]}-${zoom}`;
      if (prevCoordRef.current !== key) {
        prevCoordRef.current = key;
        map.flyTo(center, zoom, {
          duration: 1.0,
          easeLinearity: 0.2,
        });
      }
    }
  }, [center, zoom, selectedPartner, map]);

  return null;
}

interface Props {
  partners: PartnerWithMeta[];
  center: [number, number];
  zoom?: number;
  selectedId?: string | null;
  userLocation?: { lat: number; lng: number } | null;
  onSelect: (id: string | null) => void;
}

export default function MapClient({
  partners,
  center,
  zoom = 12,
  selectedId,
  userLocation,
  onSelect,
}: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const selectedPartner = partners.find((p) => p.id === selectedId) || null;
  const markerRefs = useRef<Record<string, L.CircleMarker>>({});

  // High quality vector-styled raster tiles: CartoDB Voyager for Light, Dark Matter for Dark
  const tileUrl = isDark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  // Automatically open popup when selectedId changes
  useEffect(() => {
    if (selectedId && markerRefs.current[selectedId]) {
      const timer = setTimeout(() => {
        try {
          markerRefs.current[selectedId]?.openPopup();
        } catch {}
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [selectedId]);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom
      className="h-full w-full z-0"
      attributionControl={false}
    >
      <TileLayer
        key={tileUrl}
        url={tileUrl}
        maxZoom={20}
        subdomains="abcd"
      />

      <MapController
        center={center}
        zoom={zoom}
        selectedPartner={selectedPartner}
      />

      {/* User GPS Location Marker */}
      {userLocation && (
        <>
          <CircleMarker
            center={[userLocation.lat, userLocation.lng]}
            radius={22}
            pathOptions={{
              color: "#38BDF8",
              weight: 1.5,
              fillColor: "#38BDF8",
              fillOpacity: 0.18,
            }}
          />
          <CircleMarker
            center={[userLocation.lat, userLocation.lng]}
            radius={8}
            pathOptions={{
              color: "#FFFFFF",
              weight: 2.5,
              fillColor: "#0284C7",
              fillOpacity: 1,
            }}
          >
            <Popup>
              <div className="text-xs font-bold text-slate-900 dark:text-white p-1">
                📍 <strong>Your Current Location</strong>
              </div>
            </Popup>
            <Tooltip permanent direction="top" offset={[0, -10]}>
              <span className="font-bold text-xs text-slate-900 dark:text-white">📍 You Are Here</span>
            </Tooltip>
          </CircleMarker>
        </>
      )}

      {/* Channel Partner Office Markers */}
      {partners.map((p) => {
        const isSelected = selectedId === p.id;
        const color = COLORS[p.healthStatus];

        return (
          <div key={p.id}>
            {/* Glowing Halo for Active Selected Marker */}
            {isSelected && (
              <CircleMarker
                center={[p.lat, p.lng]}
                radius={24}
                pathOptions={{
                  color: "#F97316",
                  weight: 2,
                  fillColor: "#F97316",
                  fillOpacity: 0.25,
                }}
              />
            )}

            <CircleMarker
              center={[p.lat, p.lng]}
              radius={isSelected ? 11 : 7.5}
              ref={(ref) => {
                if (ref) markerRefs.current[p.id] = ref;
              }}
              eventHandlers={{
                click: () => {
                  onSelect(p.id);
                },
              }}
              pathOptions={{
                color: isSelected ? "#FFFFFF" : color,
                weight: isSelected ? 3 : 2,
                fillColor: isSelected ? "#F97316" : color,
                fillOpacity: isSelected ? 1 : 0.85,
              }}
            >
              {/* Theme-Adaptive Popup with Crisp High-Contrast Text */}
              <Popup className="custom-map-popup" closeButton={true}>
                <div className="p-1 min-w-[220px] max-w-[280px] font-sans">
                  {/* Header Title */}
                  <div className="border-b border-slate-200 dark:border-white/15 pb-2 mb-2">
                    <h4 className="font-black text-sm text-slate-900 dark:text-white leading-tight">
                      {p.name}
                    </h4>
                  </div>

                  {/* Health Badge & Distance */}
                  <div className="mb-2.5 flex items-center justify-between gap-1 text-[11px]">
                    <span
                      className={`px-2 py-0.5 rounded-lg font-extrabold ${
                        p.healthStatus === "green"
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40"
                          : p.healthStatus === "yellow"
                          ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/40"
                          : "bg-red-500/15 text-red-700 dark:text-red-300 border border-red-500/40"
                      }`}
                    >
                      {p.healthStatus === "green"
                        ? "Healthy"
                        : p.healthStatus === "yellow"
                        ? "Watchlist"
                        : "High NPA"}{" "}
                      ({p.npaPercent}% NPA)
                    </span>

                    {p.distanceKm >= 0 && (
                      <span className="font-mono font-black text-[#EA580C] dark:text-[#FED7AA]">
                        📏 {p.distanceKm.toFixed(1)} km
                      </span>
                    )}
                  </div>

                  {/* Full Physical Address */}
                  <p className="text-slate-700 dark:text-slate-200 text-xs leading-relaxed mb-3 font-medium">
                    📍 {p.address}, {p.city} ({p.state}) {p.pincode ? `— ${p.pincode}` : ""}
                  </p>

                  {/* Quick Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-white/15">
                    {p.phone && (
                      <a
                        href={`tel:${p.phone}`}
                        className="flex-1 text-center py-1.5 px-2 rounded-xl border border-slate-300 dark:border-white/15 liquid-glass-inner text-slate-800 dark:text-[#FED7AA] font-bold text-xs hover:bg-slate-100 dark:hover:bg-white/15 transition"
                      >
                        📞 Call
                      </a>
                    )}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 text-center py-1.5 px-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs shadow-md shadow-orange-500/30 transition"
                    >
                      ➤ Directions
                    </a>
                  </div>
                </div>
              </Popup>

              <Tooltip direction="top" offset={[0, -10]}>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {p.name}
                  <div className="text-[10px] text-[#EA580C] dark:text-[#FED7AA] font-semibold mt-0.5">
                    {p.distanceKm >= 0 ? `${p.distanceKm.toFixed(1)} km away · ` : ""}NPA {p.npaPercent}%
                  </div>
                </div>
              </Tooltip>
            </CircleMarker>
          </div>
        );
      })}
    </MapContainer>
  );
}
