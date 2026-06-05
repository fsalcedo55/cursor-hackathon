import type { InvestorMatch, RaiseSignalAnalysis } from "../types";
import { localInvestorProfiles, type LocalInvestorProfile } from "./local-investors";

type InvestorMatchingInput = Pick<
  RaiseSignalAnalysis,
  "breakdown" | "company" | "issues" | "plan" | "score" | "url"
>;

const sectorSignals: Record<string, string[]> = {
  SaaS: ["saas", "software", "platform", "subscription", "b2b", "workflow"],
  Enterprise: ["enterprise", "teams", "admin", "security", "api", "b2b"],
  AI: ["ai", "agent", "automation", "llm", "machine learning", "intelligence"],
  Fintech: ["fintech", "payments", "banking", "finance", "capital", "billing"],
  Marketplace: ["marketplace", "network", "buyers", "sellers", "supply", "demand"],
  Consumer: ["consumer", "community", "creator", "mobile", "social"],
  Healthcare: ["health", "care", "clinical", "patient", "medical"],
  Proptech: ["property", "real estate", "housing", "construction"],
  Cybersecurity: ["security", "compliance", "risk", "threat"],
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function includesLoose(haystack: string, needle: string) {
  return haystack.toLowerCase().includes(needle.toLowerCase());
}

function stageFits(round: string, stages: string[]) {
  const normalizedRound = round.toLowerCase();

  return stages.some((stage) => {
    const normalizedStage = stage.toLowerCase();
    return (
      normalizedRound.includes(normalizedStage) ||
      normalizedStage.includes(normalizedRound) ||
      (normalizedRound.includes("pre-seed") && normalizedStage.includes("pre-seed")) ||
      (normalizedRound.includes("seed") && normalizedStage.includes("seed")) ||
      (normalizedRound.includes("series a") && normalizedStage.includes("series a")) ||
      (normalizedRound.includes("angel") && normalizedStage.includes("angel"))
    );
  });
}

function inferCompanySectors(analysis: InvestorMatchingInput) {
  const text = [
    analysis.company.category,
    analysis.company.businessModel,
    analysis.company.mainMarket,
    analysis.company.summary,
    analysis.plan.narrative,
  ]
    .join(" ")
    .toLowerCase();

  const sectors = Object.entries(sectorSignals)
    .filter(([, signals]) => signals.some((signal) => text.includes(signal)))
    .map(([sector]) => sector);

  return sectors.length ? sectors : ["SaaS"];
}

function sharedSectors(profile: LocalInvestorProfile, companySectors: string[]) {
  return profile.sectors.filter((sector) =>
    companySectors.some(
      (companySector) =>
        companySector.toLowerCase() === sector.toLowerCase() ||
        includesLoose(companySector, sector) ||
        includesLoose(sector, companySector),
    ),
  );
}

function tierFor(profile: LocalInvestorProfile, fit: number): InvestorMatch["tier"] {
  if (profile.geography === "Local" && fit >= 84 && !profile.checkSize.includes("Intro")) {
    return "Best local targets";
  }

  if (
    profile.contactPath.toLowerCase().includes("intro") ||
    profile.checkSize.toLowerCase().includes("network")
  ) {
    return "Warm intro candidates";
  }

  return "Regional thesis fit";
}

function statusFor(tier: InvestorMatch["tier"], fit: number): InvestorMatch["pipelineStatus"] {
  if (fit >= 88) return "Draft ready";
  if (tier === "Warm intro candidates") return "Needs intro";
  if (fit >= 82) return "Shortlisted";
  return "Researching";
}

function riskNotesFor(analysis: InvestorMatchingInput) {
  const metricIssue = analysis.breakdown.find((item) =>
    ["Traction", "Business Model"].includes(item.label),
  );
  const notes = [
    metricIssue?.reason || analysis.issues[0],
    analysis.issues[1],
    "Confirm any estimated metrics before sending external outreach.",
  ].filter(Boolean);

  return [...new Set(notes)].slice(0, 2);
}

function draftFor({
  analysis,
  profile,
  fitReason,
  tier,
}: {
  analysis: InvestorMatchingInput;
  profile: LocalInvestorProfile;
  fitReason: string;
  tier: InvestorMatch["tier"];
}): NonNullable<InvestorMatch["outreachDraft"]> {
  const company = analysis.company.name || "our company";
  const category = analysis.company.category || "startup";
  const round = analysis.plan.round || "early round";
  const raiseAmount = analysis.plan.raiseAmount || "the next round";
  const type = tier === "Warm intro candidates" ? "Warm intro request" : "Cold email";
  const opener =
    type === "Warm intro request"
      ? `I am looking for the right warm path into ${profile.firm}.`
      : `I thought ${profile.firm} could be a strong fit for ${company}.`;

  return {
    type,
    approvalStatus: "Ready for founder approval",
    angle: `${profile.location} ${profile.role.toLowerCase()} fit: ${fitReason}`,
    subject: `${company} x ${profile.firm}`,
    body: `Hi ${profile.name} team,\n\n${opener} ${company} is a ${category} company preparing a ${round} raise (${raiseAmount}), and the strongest fit signal is ${fitReason.toLowerCase()}.\n\nThe quick version: ${analysis.company.summary} We are tightening the raise story around ${analysis.plan.narrative.toLowerCase()}.\n\nWould it be useful to send over the deck and a short metrics snapshot for feedback?\n\nBest,\nFounder`,
  };
}

function matchInvestor(profile: LocalInvestorProfile, analysis: InvestorMatchingInput) {
  const companySectors = inferCompanySectors(analysis);
  const sectorMatches = sharedSectors(profile, companySectors);
  const roundFits = stageFits(analysis.plan.round, profile.stages);
  const localBoost = profile.geography === "Local" ? 14 : profile.geography === "Regional" ? 8 : 3;
  const stageBoost = roundFits ? 18 : 6;
  const sectorBoost = sectorMatches.length ? 18 : 6;
  const readinessBoost = analysis.score >= 75 ? 8 : analysis.score >= 60 ? 5 : 2;
  const activityBoost = profile.activity.toLowerCase().includes("active") ? 7 : 4;
  const networkBoost =
    profile.contactPath.toLowerCase().includes("intro") ||
    profile.contactPath.toLowerCase().includes("network")
      ? 4
      : 0;
  const fit = clamp(
    Math.round(48 + localBoost + stageBoost + sectorBoost + readinessBoost + activityBoost + networkBoost),
    72,
    96,
  );
  const sectorReason = sectorMatches.length
    ? `${sectorMatches.slice(0, 2).join(" + ")} thesis fit`
    : `${profile.sectors.slice(0, 2).join(" + ")} adjacency`;
  const stageReason = roundFits
    ? `${analysis.plan.round} stage alignment`
    : `Adjacent to ${analysis.plan.round} round`;
  const localReason =
    profile.geography === "Local"
      ? `${profile.location} local access`
      : `${profile.location} regional reach`;
  const why = [localReason, stageReason, sectorReason];
  const tier = tierFor(profile, fit);

  return {
    name: profile.name,
    fit,
    initials: profile.initials,
    color: profile.color,
    stage: profile.stages.slice(0, 2).join(" / "),
    activity: profile.activity,
    why,
    firm: profile.firm,
    role: profile.role,
    location: profile.location,
    geography: profile.geography,
    sectors: profile.sectors,
    checkSize: profile.checkSize,
    tier,
    sources: profile.sourceLabels.map((label) => ({ label })),
    contactPath: profile.contactPath,
    riskNotes: riskNotesFor(analysis),
    recommendedAction:
      tier === "Warm intro candidates"
        ? "Ask for a warm path before sending the deck."
        : "Review the email drop and approve founder outreach.",
    pipelineStatus: statusFor(tier, fit),
    outreachDraft: draftFor({
      analysis,
      profile,
      fitReason: why[0],
      tier,
    }),
  } satisfies InvestorMatch;
}

export function buildInvestorMatches(analysis: InvestorMatchingInput): InvestorMatch[] {
  return localInvestorProfiles
    .map((profile) => matchInvestor(profile, analysis))
    .sort((a, b) => {
      const tierOrder = {
        "Best local targets": 0,
        "Warm intro candidates": 1,
        "Regional thesis fit": 2,
      } as const;

      return (tierOrder[a.tier || "Regional thesis fit"] - tierOrder[b.tier || "Regional thesis fit"]) || b.fit - a.fit;
    })
    .slice(0, 12);
}
