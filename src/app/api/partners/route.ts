import { getAllPartners } from "@/lib/partnersData";
import type { SchemeId } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);

  const rawLat = url.searchParams.get("userLat") || url.searchParams.get("lat");
  const rawLng = url.searchParams.get("userLng") || url.searchParams.get("lng");
  const district = url.searchParams.get("district") || undefined;
  const scheme = url.searchParams.get("scheme") as SchemeId | null;
  const partnerType = url.searchParams.get("type");
  const includeHighNpa =
    url.searchParams.get("includeHighNpa") === "true" ||
    url.searchParams.get("includeHighNpa") === "1" ||
    url.searchParams.get("includeUnhealthy") === "1";

  const userLat = rawLat ? Number(rawLat) : undefined;
  const userLng = rawLng ? Number(rawLng) : undefined;

  let partners = getAllPartners(district, userLat, userLng);

  // Apply filters
  if (scheme && scheme !== ("all" as any)) {
    partners = partners.filter((p) => p.schemes.includes(scheme));
  }

  if (partnerType && partnerType !== "all") {
    partners = partners.filter((p) => p.type === partnerType);
  }

  if (!includeHighNpa) {
    partners = partners.filter((p) => p.healthStatus !== "red");
  }

  // Ensure sorting by nearest distance first
  partners.sort((a, b) => {
    if (a.distanceKm >= 0 && b.distanceKm >= 0) {
      return a.distanceKm - b.distanceKm;
    }
    if (a.distanceKm >= 0) return -1;
    if (b.distanceKm >= 0) return 1;
    return a.npaPercent - b.npaPercent;
  });

  return Response.json({
    source: "database",
    count: partners.length,
    partners: partners,
  });
}
