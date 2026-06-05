import type { GeneratedDeckSlide, RaiseSignalAnalysis } from "../types";
import { mergeDeckSlides } from "./deck-outline";

function metricValue(analysis: RaiseSignalAnalysis, label: string) {
  return analysis.revenueMetrics.find(
    (metric) => metric.label.toLowerCase() === label.toLowerCase(),
  )?.value;
}

function compactFacts(facts: Array<string | undefined>) {
  return facts.filter((fact): fact is string => Boolean(fact && fact.trim()));
}

export function buildDeckSlides(analysis: RaiseSignalAnalysis): GeneratedDeckSlide[] {
  const { company, plan } = analysis;
  const mrr = metricValue(analysis, "MRR");
  const arr = metricValue(analysis, "ARR");
  const momGrowth = metricValue(analysis, "MoM Growth");
  const arpu = metricValue(analysis, "ARPU");
  const churn = metricValue(analysis, "Churn");
  const ltv = metricValue(analysis, "Est. LTV");
  const cac = metricValue(analysis, "CAC");
  const strongestIssue = analysis.issues[0];
  const useOfFunds = plan.useOfFunds
    .map((segment) => `${segment.label} ${segment.v}%`)
    .join(", ");

  return mergeDeckSlides(analysis.deck.slides).map((slide) => {
    const title = slide.t.toLowerCase();
    const defaultFacts = compactFacts([
      company.category,
      company.stage,
      company.businessModel,
      company.mainMarket,
    ]);

    if (title.includes("cover")) {
      return {
        n: slide.n,
        t: slide.t,
        headline: `${company.name}: ${company.category} built for ${company.mainMarket}`,
        speakerNotes: `${company.summary} Position the company as ${company.status.toLowerCase()} and ${company.stage.toLowerCase()}.`,
        sourceFacts: compactFacts([company.summary, company.stage, company.status]),
      };
    }

    if (title.includes("problem")) {
      return {
        n: slide.n,
        t: slide.t,
        headline: strongestIssue
          ? `The fundraising story still needs to solve: ${strongestIssue}`
          : `The market needs a sharper ${company.category} workflow`,
        speakerNotes: `Frame the pain through the readiness review and connect it to why ${company.name} exists.`,
        sourceFacts: compactFacts([strongestIssue, company.mainMarket, company.category]),
      };
    }

    if (title.includes("solution")) {
      return {
        n: slide.n,
        t: slide.t,
        headline: company.summary,
        speakerNotes: `Use the company overview and product clarity signals to explain why the solution is differentiated.`,
        sourceFacts: compactFacts([company.summary, company.businessModel]),
      };
    }

    if (title.includes("go-to-market")) {
      return {
        n: slide.n,
        t: slide.t,
        headline: `${company.mainMarket} GTM anchored by ${company.tractionSignal}`,
        speakerNotes: `Connect the GTM plan to the acquisition metric investors will expect next.`,
        sourceFacts: compactFacts([company.mainMarket, company.tractionSignal, cac && `CAC: ${cac}`]),
      };
    }

    if (title.includes("market")) {
      return {
        n: slide.n,
        t: slide.t,
        headline: `${company.mainMarket} is the wedge for a ${company.category} opportunity`,
        speakerNotes: `Tie the market slide to the recommended round and investor fit, then explain the expansion path.`,
        sourceFacts: compactFacts([company.mainMarket, company.category, plan.round]),
      };
    }

    if (title.includes("product")) {
      return {
        n: slide.n,
        t: slide.t,
        headline: `${company.name} packages ${company.businessModel} around a clear user workflow`,
        speakerNotes: `Show product screenshots and explain the primary loop behind the traction signal.`,
        sourceFacts: compactFacts([company.businessModel, company.tractionSignal]),
      };
    }

    if (title.includes("traction")) {
      return {
        n: slide.n,
        t: slide.t,
        headline: compactFacts([mrr && `${mrr} MRR`, momGrowth && `${momGrowth} MoM growth`]).join(" with ") || company.tractionSignal,
        speakerNotes: `Lead with the strongest revenue signal and explain what changed since launch.`,
        sourceFacts: compactFacts([mrr && `MRR: ${mrr}`, arr && `ARR: ${arr}`, momGrowth && `MoM growth: ${momGrowth}`, company.tractionSignal]),
      };
    }

    if (title.includes("business")) {
      return {
        n: slide.n,
        t: slide.t,
        headline: `${company.businessModel} with ${arpu || "known"} ARPU and ${ltv || "emerging"} LTV`,
        speakerNotes: `Explain pricing, monetization, and unit economics. Flag churn or CAC only if investors will ask about it.`,
        sourceFacts: compactFacts([company.businessModel, arpu && `ARPU: ${arpu}`, ltv && `LTV: ${ltv}`, churn && `Churn: ${churn}`, cac && `CAC: ${cac}`]),
      };
    }

    if (title.includes("competition")) {
      return {
        n: slide.n,
        t: slide.t,
        headline: `Position against alternatives with a sharper ${company.category} wedge`,
        speakerNotes: `Use the readiness issue list to address weak positioning before investor conversations.`,
        sourceFacts: compactFacts([analysis.issues.find((issue) => issue.toLowerCase().includes("compet")) || strongestIssue]),
      };
    }

    if (title.includes("financial")) {
      return {
        n: slide.n,
        t: slide.t,
        headline: `${arr || "Current revenue"} supports a ${plan.valuation} valuation path`,
        speakerNotes: `Use MRR, ARR, growth, and valuation logic together. Updated revenue metrics should be reflected here.`,
        sourceFacts: compactFacts([mrr && `MRR: ${mrr}`, arr && `ARR: ${arr}`, momGrowth && `MoM growth: ${momGrowth}`, `Valuation: ${plan.valuation}`]),
      };
    }

    if (title.includes("ask")) {
      return {
        n: slide.n,
        t: slide.t,
        headline: `Raising ${plan.raiseAmount} for ${plan.runway} of focused execution`,
        speakerNotes: `Break down use of funds and connect the ask to the next fundraising milestone.`,
        sourceFacts: compactFacts([`Raise: ${plan.raiseAmount}`, `Runway: ${plan.runway}`, useOfFunds]),
      };
    }

    if (title.includes("team")) {
      return {
        n: slide.n,
        t: slide.t,
        headline: `${company.teamSize} team building in ${company.mainMarket}`,
        speakerNotes: `Explain founder-market fit, current team capacity, and key hiring needs after the round.`,
        sourceFacts: compactFacts([company.teamSize, company.mainMarket, company.sizeSignal]),
      };
    }

    return {
      n: slide.n,
      t: slide.t,
      headline: `${company.name} ${slide.t}`,
      speakerNotes: `Draft this slide from the current analysis context and investor narrative.`,
      sourceFacts: defaultFacts,
    };
  });
}
