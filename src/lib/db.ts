import type { Partner } from "./types";
import partnersData from "@/data/partners.json";

/**
 * Partners come from MongoDB when configured,
 * otherwise fall back to the bundled dataset so demos never break.
 */
export async function getPartners(): Promise<{ source: "mongo" | "fallback"; partners: Partner[] }> {
  return { source: "fallback", partners: partnersData as Partner[] };
}
