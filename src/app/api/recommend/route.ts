import { recommendScheme, SCHEMES } from "@/lib/schemes";
import { groqChat } from "@/lib/groq";
import type { Profile, Recommendation } from "@/lib/types";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

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

    // Instant official rule-based calculation
    const baseline = recommendScheme(profile);
    const s = SCHEMES[baseline.schemeId];

    let aiExplanation = `Based on your profile, the ${baseline.schemeName} is your verified match. Your ${profile.activityType} project with an estimated cost of ${inr(profile.projectCost)} and family income of ${inr(profile.annualIncome)} fully meets the official guidelines. Under this program, ${s.fundingSharePct}% (${inr(baseline.eligibleAmount)}) is financed at a concessional ${baseline.interestRate}% reducing balance interest rate with a ${baseline.moratoriumMonths}-month grace period.`;
    let aiTips = [
      "Keep your SC caste certificate, domicile, and income certificate ready.",
      "Prepare 2-3 equipment/supplier quotations or your Detailed Project Report (DPR).",
      "Use the Partner Locator to find a nearby authorized PSU Bank or SCA branch with low NPA.",
    ];
    let source: "groq" | "fallback" = "fallback";

    // Attempt Groq AI evaluation with rapid timeout
    try {
      const clientKey = request.headers.get("x-groq-key") || undefined;
      const prompt = `Applicant Profile: Purpose=${profile.purpose}, Activity=${profile.activityType}, State=${profile.state}, District=${profile.district}, Age=${profile.age}, Category=${profile.category}, Project Cost=${inr(profile.projectCost)}, Income=${inr(profile.annualIncome)}/yr.
Recommended Scheme: ${baseline.schemeName}, Eligible Loan=${inr(baseline.eligibleAmount)} (up to ${s.fundingSharePct}%), Interest Rate=${baseline.interestRate}% p.a., Grace Period=${baseline.moratoriumMonths} months.`;

      const content = await groqChat(
        [
          {
            role: "system",
            content: `You are SchemeSaathi AI, an expert advisor for Indian government concessional loan schemes (Ministry of Social Justice and Empowerment, NSFDC). Explain why this scheme fits this applicant in 2-3 clear, encouraging sentences and give 3 practical next step tips. Return ONLY valid JSON: {"explanation": "...", "tips": ["tip1", "tip2", "tip3"]}`,
          },
          { role: "user", content: prompt },
        ],
        { temperature: 0.3, maxTokens: 400, apiKey: clientKey }
      );

      if (content) {
        const match = content.match(/\{[\s\S]*\}/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          if (parsed.explanation && Array.isArray(parsed.tips) && parsed.tips.length > 0) {
            aiExplanation = parsed.explanation;
            aiTips = parsed.tips.slice(0, 5);
            source = "groq";
          }
        }
      }
    } catch {
      // Fall through to verified official baseline
    }

    const rec: Recommendation = {
      ...baseline,
      aiExplanation,
      aiTips,
      source,
    };

    return Response.json({ recommendation: rec });
  } catch {
    return Response.json({ error: "Could not process profile" }, { status: 500 });
  }
}

