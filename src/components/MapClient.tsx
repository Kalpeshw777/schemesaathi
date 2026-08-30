"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import { CircleMarker, MapContainer, TileLayer, Popup, Tooltip, useMap } from "react-leaflet";
import type { PartnerWithMeta } from "@/lib/types";
import L from "leaflet";

const COLORS: Record<PartnerWithMeta["healthStatus"], string> = {
  green: "#22C55E",
  yellow: "#F59E0B",
  red: "#EF4444",
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
          duration: 1.2,
          easeLinearity: 0.15,
        });
      }
    } else if (center) {
      const key = `center-${center[0]}-${center[1]}-${zoom}`;
      if (prevCoordRef.current !== key) {
        prevCoordRef.current = key;
        map.flyTo(center, zoom, {
          duration: 1.2,
          easeLinearity: 0.15,
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
  const selectedPartner = partners.find((p) => p.id === selectedId) || null;
  const markerRefs = useRef<Record<string, L.CircleMarker>>({});

  // Automatically open popup when selectedId changes
  useEffect(() => {
    if (selectedId && markerRefs.current[selectedId]) {
      const timer = setTimeout(() => {
        try {
          markerRefs.current[selectedId]?.openPopup();
        } catch {}
      }, 250);
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
      {/* Standard OpenStreetMap Tile Layer (100% Free, No Watermark) */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />

      <MapController
        center={center}
        zoom={zoom}
        selectedPartner={selectedPartner}
      />

      {/* User GPS Location Marker (if enabled) */}
      {userLocation && (
        <>
          {/* Pulsing Outer GPS Radius */}
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
              <div className="text-xs font-bold text-white p-1">
                📍 <strong>Your Current Location</strong>
              </div>
            </Popup>
            <Tooltip permanent direction="top" offset={[0, -10]}>
              📍 You Are Here
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
            {/* Elegant Glowing Halo for Active Selected Marker */}
            {isSelected && (
              <CircleMarker
                center={[p.lat, p.lng]}
                radius={24}
                pathOptions={{
                  color: "#F97316",
                  weight: 1.5,
                  fillColor: "#F97316",
                  fillOpacity: 0.22,
                }}
              />
            )}

            <CircleMarker
              center={[p.lat, p.lng]}
              radius={isSelected ? 11 : 7}
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
                weight: isSelected ? 3 : 1.5,
                fillColor: isSelected ? "#F97316" : color,
                fillOpacity: isSelected ? 1 : 0.85,
              }}
            >
              {/* Liquid Frosted Glass Popup */}
              <Popup className="custom-map-popup" closeButton={true}>
                <div className="p-1 min-w-[220px] max-w-[280px] font-sans">
                  {/* Header */}
                  <div className="border-b border-white/15 pb-2 mb-2">
                    <h4 className="font-black text-sm text-white leading-tight" style={{ color: "#FFFFFF" }}>
                      {p.name}
                    </h4>
                  </div>

                  {/* Health Badge & Distance */}
                  <div className="mb-2.5 flex items-center justify-between gap-1 text-[11px]">
                    <span
                      className={`px-2 py-0.5 rounded-lg font-extrabold ${
                        p.healthStatus === "green"
                          ? "bg-emerald-500/25 text-emerald-300 border border-emerald-500/40"
                          : p.healthStatus === "yellow"
                          ? "bg-amber-500/25 text-amber-300 border border-amber-500/40"
                          : "bg-red-500/25 text-red-300 border border-red-500/40"
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
                      <span className="font-mono font-bold text-[#FED7AA]">
                        📏 {p.distanceKm.toFixed(1)} km
                      </span>
                    )}
                  </div>

                  {/* Full Physical Address */}
                  <p className="text-slate-200 text-xs leading-relaxed mb-3 font-medium" style={{ color: "#E2E8F0" }}>
                    📍 {p.address}, {p.city} ({p.state}) {p.pincode ? `— ${p.pincode}` : ""}
                  </p>

                  {/* Quick Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-white/15">
                    {p.phone && (
                      <a
                        href={`tel:${p.phone}`}
                        className="flex-1 text-center py-1.5 px-2 rounded-xl liquid-glass-inner text-[#FED7AA] font-bold text-xs hover:bg-white/15 transition"
                        style={{ color: "#FED7AA" }}
                      >
                        📞 Call
                      </a>
                    )}
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 text-center py-1.5 px-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs shadow-md shadow-orange-500/30 transition"
                      style={{ color: "#FFFFFF" }}
                    >
                      ➤ Directions
                    </a>
                  </div>
                </div>
              </Popup>

              <Tooltip direction="top" offset={[0, -10]}>
                <div className="text-xs font-bold text-white">
                  {p.name}
                  <div className="text-[10px] text-[#FED7AA] font-semibold mt-0.5">
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
