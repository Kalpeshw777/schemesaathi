import { getAllPartners } from "@/lib/partnersData";
import type { SchemeId } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);

  const rawLat = url.searchParams.get("userLat") || url.searchParams.get("lat");
  const rawLng = url.searchParams.get("userLng") || url.searchParams.get("lng");
  const state = url.searchParams.get("state") || undefined;
  const district = url.searchParams.get("district") || undefined;
  const scheme = url.searchParams.get("scheme") as SchemeId | null;
  const partnerType = url.searchParams.get("type");
  const includeHighNpa =
    url.searchParams.get("includeHighNpa") === "true" ||
    url.searchParams.get("includeHighNpa") === "1" ||
    url.searchParams.get("includeUnhealthy") === "1";

  const userLat = rawLat ? Number(rawLat) : undefined;
  const userLng = rawLng ? Number(rawLng) : undefined;

  let partners = getAllPartners(district, userLat, userLng, state);

  // Apply scheme filter
  if (scheme && scheme !== ("all" as any)) {
    partners = partners.filter((p) => p.schemes.includes(scheme));
  }

  // Apply partner type filter
  if (partnerType && partnerType !== "all") {
    partners = partners.filter((p) => p.type === partnerType);
  }

  // High-NPA filter: default to hiding High-NPA (≥10%) partners unless toggle is enabled
  if (!includeHighNpa) {
    partners = partners.filter((p) => p.healthStatus !== "red");
  }

  // Sorting:
  // When distance is available (from GPS or district selection), sort primarily by proximity (distanceKm ascending),
  // with lower NPA as tie-breaker for branches at similar distances.
  // When distance is not available, sort by Health Tier (Healthy <5% -> Watchlist 5-10% -> High NPA >=10%) and lowest NPA.
  const TIER_WEIGHT: Record<string, number> = {
    green: 1,
    yellow: 2,
    red: 3,
  };

  partners.sort((a, b) => {
    const hasDistA = typeof a.distanceKm === "number" && a.distanceKm >= 0;
    const hasDistB = typeof b.distanceKm === "number" && b.distanceKm >= 0;

    if (hasDistA && hasDistB) {
      const distDiff = a.distanceKm - b.distanceKm;
      if (Math.abs(distDiff) >= 0.1) {
        return distDiff;
      }
      return a.npaPercent - b.npaPercent;
    }

    if (hasDistA) return -1;
    if (hasDistB) return 1;

    const tierA = TIER_WEIGHT[a.healthStatus] || 2;
    const tierB = TIER_WEIGHT[b.healthStatus] || 2;
    if (tierA !== tierB) return tierA - tierB;

    return a.npaPercent - b.npaPercent;
  });

  return Response.json({
    source: "database",
    count: partners.length,
    partners: partners,
  });
}
