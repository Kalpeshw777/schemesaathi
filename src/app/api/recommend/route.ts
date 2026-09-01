import { recommendScheme, SCHEMES } from "@/lib/schemes";
import type { Profile, Recommendation } from "@/lib/types";

export const dynamic = "force-dynamic";

const inr = (n: number) =>
  `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n)}`;

export async function POST(request: Request) {
  try {
    const raw = await request.json();
    const profile = raw as Profile;
    if (
      typeof profile.projectCost !== "number" ||
      typeof profile.annualIncome !== "number" ||
      typeof profile.age !== "number"
    ) {
      return Response.json({ error: "Invalid profile parameters" }, { status: 400 });
    }

    // Instant official rule-based calculation (instant 0ms response)
    const baseline = recommendScheme(profile);
    const s = SCHEMES[baseline.schemeId];

    const rec: Recommendation = {
      ...baseline,
      aiExplanation: `Based on your profile, the ${baseline.schemeName} is your verified match. Your ${profile.activityType} project with an estimated cost of ${inr(profile.projectCost)} and family income of ${inr(profile.annualIncome)} fully meets the government guidelines. Under this program, ${s.fundingSharePct}% (${inr(baseline.eligibleAmount)}) is financed at a concessional ${baseline.interestRate}% reducing balance interest rate with a ${baseline.moratoriumMonths}-month grace period.`,
      aiTips: [
        "Keep your SC caste certificate, domicile, and income certificate ready.",
        "Prepare 2-3 equipment/supplier quotations or your Detailed Project Report (DPR).",
        "Use the Partner Locator to find a nearby authorized PSU Bank or SCA branch with low NPA.",
      ],
      source: "fallback",
    };

    return Response.json({ recommendation: rec });
  } catch {
    return Response.json({ error: "Could not process profile" }, { status: 500 });
  }
}
