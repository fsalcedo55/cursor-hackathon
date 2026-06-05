import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const scoreItemSchema = z.object({
  label: z.string(),
  v: z.number().int().min(0).max(100),
  reason: z.string().optional(),
});

const revenueMetricSchema = z.object({
  label: z.string(),
  value: z.string(),
  trend: z.string().optional(),
  missing: z.boolean().optional(),
  warning: z.boolean().optional(),
});

const analysisSchema = z.object({
  score: z.number().int().min(0).max(100),
  readinessLabel: z.string(),
  scoreSummary: z.string(),
  breakdown: z.array(scoreItemSchema).min(1),
  issues: z.array(z.string()).min(1),
  company: z.object({
    name: z.string(),
    initials: z.string(),
    category: z.string(),
    stage: z.string(),
    status: z.string(),
    businessModel: z.string(),
    mainMarket: z.string(),
    teamSize: z.string(),
    tractionSignal: z.string(),
    fundingSignal: z.string(),
    sizeSignal: z.string(),
    summary: z.string(),
  }),
  revenueMetrics: z.array(revenueMetricSchema).min(1),
  criticalMetric: z.object({
    label: z.string(),
    message: z.string(),
  }),
  plan: z.object({
    round: z.string(),
    raiseAmount: z.string(),
    valuation: z.string(),
    dilution: z.string(),
    runway: z.string(),
    narrative: z.string(),
    useOfFunds: z.array(
      z.object({
        label: z.string(),
        v: z.number().int().min(0).max(100),
        c: z.string(),
      }),
    ).min(1),
    valuationLogic: z.array(
      z.object({
        t: z.string(),
        ok: z.union([z.boolean(), z.literal("neutral")]),
      }),
    ).min(1),
  }),
  investors: z.array(
    z.object({
      name: z.string(),
      fit: z.number().int().min(0).max(100),
      initials: z.string(),
      color: z.string(),
      stage: z.string(),
      activity: z.string(),
      why: z.array(z.string()).min(1),
    }),
  ).min(1),
  deck: z.object({
    readiness: z.number().int().min(0).max(100),
    slides: z.array(
      z.object({
        n: z.number().int().min(1),
        t: z.string(),
        s: z.enum(["Strong", "Good", "Needs work", "Missing"]),
      }),
    ).min(1),
    dataRoom: z.array(
      z.object({
        t: z.string(),
        s: z.enum(["Done", "Missing", "Suggested"]),
      }),
    ).min(1),
  }),
  improvements: z.array(
    z.object({
      t: z.string(),
      impact: z.number().int().min(1).max(20),
      d: z.string(),
      icon: z.enum(["coins", "refresh", "globe", "target"]),
    }),
  ).min(1),
});

const requestSchema = z.object({
  url: z.string().trim().min(1),
  connectors: z.array(z.string()).default([]),
});

type Analysis = z.infer<typeof analysisSchema>;
type ApiError = {
  error: string;
  status: number;
};
type RevenueMetric = Analysis["revenueMetrics"][number];
type ImprovementIcon = Analysis["improvements"][number]["icon"];

function normalizeUrl(input: string) {
  const withProtocol = /^https?:\/\//i.test(input) ? input : `https://${input}`;
  const url = new URL(withProtocol);

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Only HTTP and HTTPS URLs are supported.");
  }

  return url.toString();
}

function extractText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 8000);
}

function extractInternalLinks(html: string, baseUrl: string) {
  const base = new URL(baseUrl);
  const candidates = new Map<string, string>();
  const priority = [
    "about",
    "pricing",
    "customers",
    "case-studies",
    "blog",
    "careers",
    "jobs",
    "press",
    "investors",
    "product",
    "features",
  ];
  const linkRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>/gi;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(html))) {
    try {
      const href = new URL(match[1], base);
      const path = href.pathname.toLowerCase();

      if (href.origin !== base.origin || href.hash || href.protocol !== base.protocol) {
        continue;
      }

      if (priority.some((needle) => path.includes(needle))) {
        candidates.set(href.toString(), href.pathname);
      }
    } catch {
      continue;
    }
  }

  return [...candidates.keys()].slice(0, 6);
}

async function fetchHtml(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);

  try {
    const response = await fetch(url, {
      headers: {
        accept: "text/html,application/xhtml+xml",
        "user-agent": "RaiseSignal/1.0 startup analysis bot",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      return {
        html: "",
        text: `Unable to fetch the page. HTTP status: ${response.status}.`,
      };
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) {
      return {
        text: `Fetched non-HTML content type: ${contentType}.`,
        html: "",
      };
    }

    const html = await response.text();

    return {
      html,
      text: extractText(html) || "The page did not expose readable text.",
    };
  } catch (error) {
    return {
      html: "",
      text: `Unable to fetch the page: ${error instanceof Error ? error.message : "unknown error"}.`,
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchStartupContext(url: string) {
  const home = await fetchHtml(url);
  const links = extractInternalLinks(home.html, url);
  const pages = await Promise.all(
    links.map(async (link) => ({
      url: link,
      ...(await fetchHtml(link)),
    })),
  );

  return [
    `SOURCE: ${url}`,
    home.text,
    ...pages.map((page) => `SOURCE: ${page.url}\n${page.text}`),
  ]
    .join("\n\n---\n\n")
    .slice(0, 32000);
}

function apiError(error: string, status: number): ApiError {
  return { error, status };
}

function hasKnownValue(value: string) {
  return Boolean(value.trim()) && value.trim().toLowerCase() !== "unknown";
}

function normalizeImprovementIcon(action: unknown): ImprovementIcon {
  if (
    action &&
    typeof action === "object" &&
    "icon" in action &&
    ["coins", "refresh", "globe", "target"].includes(String(action.icon))
  ) {
    return action.icon as ImprovementIcon;
  }

  const text =
    action && typeof action === "object"
      ? `${"t" in action ? action.t : ""} ${"d" in action ? action.d : ""}`.toLowerCase()
      : "";

  if (textHasAny(text, ["revenue", "cac", "arr", "mrr", "pricing", "monetization", "financial"])) {
    return "coins";
  }

  if (textHasAny(text, ["retention", "usage", "engagement", "repeat", "cohort", "growth"])) {
    return "refresh";
  }

  if (textHasAny(text, ["market", "geography", "global", "expansion", "category"])) {
    return "globe";
  }

  return "target";
}

function normalizeRawAnalysis(raw: unknown) {
  if (!raw || typeof raw !== "object") {
    return raw;
  }

  const analysis = raw as Record<string, unknown>;

  if (Array.isArray(analysis.improvements)) {
    analysis.improvements = analysis.improvements.map((action) =>
      action && typeof action === "object"
        ? { ...action, icon: normalizeImprovementIcon(action) }
        : action,
    );
  }

  return analysis;
}

function textHasAny(text: string, needles: string[]) {
  const lower = text.toLowerCase();
  return needles.some((needle) => lower.includes(needle));
}

function inferCompanyScale(analysis: Analysis, pageText: string, url: string) {
  const text = `${url}\n${pageText}\n${analysis.company.summary}\n${analysis.company.sizeSignal}`.toLowerCase();
  const enterpriseSignals = [
    "enterprise",
    "soc 2",
    "sso",
    "saml",
    "security",
    "trusted by",
    "customers",
    "case studies",
    "pricing",
    "careers",
    "jobs",
    "hiring",
    "api",
    "teams",
    "admin",
  ];
  const breakoutSignals = [
    "millions",
    "fortune",
    "global",
    "series",
    "raised",
    "funding",
    "y combinator",
    "yc",
    "cursor.com",
  ];
  const hasEnterpriseSignal = textHasAny(text, enterpriseSignals);
  const hasBreakoutSignal = textHasAny(text, breakoutSignals);

  if (analysis.score >= 80 || (hasEnterpriseSignal && hasBreakoutSignal)) {
    return "breakout";
  }

  if (analysis.score >= 65 || hasEnterpriseSignal) {
    return "seed";
  }

  if (analysis.score >= 50) {
    return "early";
  }

  if (analysis.score >= 35) {
    return "preseed";
  }

  return "validation";
}

function planForScale(scale: ReturnType<typeof inferCompanyScale>, score: number) {
  if (scale === "breakout") {
    return {
      round: score >= 85 ? "Series A-ready" : "Seed / Series A",
      raiseAmount: score >= 85 ? "$10M-$25M" : "$5M-$12M",
      valuation: score >= 85 ? "$80M-$200M" : "$30M-$80M",
      dilution: "10-20%",
      runway: "18-24 months",
    };
  }

  if (scale === "seed") {
    return {
      round: "Seed",
      raiseAmount: "$2M-$5M",
      valuation: "$10M-$25M",
      dilution: "15-25%",
      runway: "18 months",
    };
  }

  if (scale === "early") {
    return {
      round: "Pre-seed / Seed",
      raiseAmount: "$750k-$2M",
      valuation: "$4M-$10M",
      dilution: "12-22%",
      runway: "15-18 months",
    };
  }

  if (scale === "preseed") {
    return {
      round: "Pre-seed",
      raiseAmount: "$250k-$750k",
      valuation: "$2M-$5M",
      dilution: "10-20%",
      runway: "12-15 months",
    };
  }

  return {
    round: "Validation / angel",
    raiseAmount: "$100k-$300k",
    valuation: "$1M-$3M",
    dilution: "8-15%",
    runway: "9-12 months",
  };
}

function teamEstimateForScale(scale: ReturnType<typeof inferCompanyScale>) {
  const estimates = {
    breakout: "Estimated 50-200+",
    seed: "Estimated 15-50",
    early: "Estimated 6-15",
    preseed: "Estimated 2-8",
    validation: "Estimated 1-4",
  };

  return estimates[scale];
}

function sizeSignalForScale(scale: ReturnType<typeof inferCompanyScale>) {
  const estimates = {
    breakout: "Scaled startup with enterprise or breakout public signals",
    seed: "Seed-stage company with meaningful product and market signals",
    early: "Early-stage company with some traction signals",
    preseed: "Small pre-seed company; traction still needs validation",
    validation: "Very small or unclear team; validation-first fundraising",
  };

  return estimates[scale];
}

function estimatedEconomicsForScale(scale: ReturnType<typeof inferCompanyScale>) {
  const estimates: Record<ReturnType<typeof inferCompanyScale>, RevenueMetric[]> = {
    breakout: [
      { label: "MRR", value: "Est. $250k-$1M", warning: true },
      { label: "ARR", value: "Est. $3M-$12M", warning: true },
      { label: "MoM Growth", value: "Est. 8-20%", warning: true },
      { label: "ARPU", value: "Est. $20-$100", warning: true },
      { label: "Churn", value: "Est. 2-6%", warning: true },
      { label: "CAC", value: "Est. $50-$500", warning: true },
    ],
    seed: [
      { label: "MRR", value: "Est. $50k-$250k", warning: true },
      { label: "ARR", value: "Est. $600k-$3M", warning: true },
      { label: "MoM Growth", value: "Est. 6-15%", warning: true },
      { label: "ARPU", value: "Est. $10-$60", warning: true },
      { label: "Churn", value: "Est. 3-8%", warning: true },
      { label: "CAC", value: "Est. $40-$300", warning: true },
    ],
    early: [
      { label: "MRR", value: "Est. $5k-$50k", warning: true },
      { label: "ARR", value: "Est. $60k-$600k", warning: true },
      { label: "MoM Growth", value: "Est. 5-12%", warning: true },
      { label: "ARPU", value: "Est. $5-$40", warning: true },
      { label: "Churn", value: "Est. 4-10%", warning: true },
      { label: "CAC", value: "Est. $20-$200", warning: true },
    ],
    preseed: [
      { label: "MRR", value: "Est. $0-$10k", warning: true },
      { label: "ARR", value: "Est. $0-$120k", warning: true },
      { label: "MoM Growth", value: "Est. 0-10%", warning: true },
      { label: "ARPU", value: "Est. $0-$25", warning: true },
      { label: "Churn", value: "Est. 5-15%", warning: true },
      { label: "CAC", value: "Est. $0-$150", warning: true },
    ],
    validation: [
      { label: "MRR", value: "Est. $0-$2k", warning: true },
      { label: "ARR", value: "Est. $0-$24k", warning: true },
      { label: "MoM Growth", value: "Est. 0-5%", warning: true },
      { label: "ARPU", value: "Est. $0-$15", warning: true },
      { label: "Churn", value: "Est. 8-20%", warning: true },
      { label: "CAC", value: "Est. $0-$100", warning: true },
    ],
  };

  return estimates[scale];
}

function mergeRevenueMetrics(metrics: RevenueMetric[], scale: ReturnType<typeof inferCompanyScale>) {
  const byLabel = new Map(metrics.map((metric) => [metric.label.toLowerCase(), metric]));

  return estimatedEconomicsForScale(scale).map((estimate) => {
    const existing = byLabel.get(estimate.label.toLowerCase());

    if (existing && hasKnownValue(existing.value)) {
      return {
        ...existing,
        missing: false,
      };
    }

    return {
      ...estimate,
      missing: false,
    };
  });
}

function completeAnalysisEstimates(analysis: Analysis, pageText: string, url: string) {
  const scale = inferCompanyScale(analysis, pageText, url);
  const plan = planForScale(scale, analysis.score);

  return {
    ...analysis,
    company: {
      ...analysis.company,
      teamSize: hasKnownValue(analysis.company.teamSize)
        ? analysis.company.teamSize
        : teamEstimateForScale(scale),
      tractionSignal: hasKnownValue(analysis.company.tractionSignal)
        ? analysis.company.tractionSignal
        : scale === "validation"
          ? "Estimated low public traction"
          : "Estimated from public product and market signals",
      fundingSignal: hasKnownValue(analysis.company.fundingSignal)
        ? analysis.company.fundingSignal
        : "No confirmed funding found",
      sizeSignal: hasKnownValue(analysis.company.sizeSignal)
        ? analysis.company.sizeSignal
        : sizeSignalForScale(scale),
    },
    revenueMetrics: mergeRevenueMetrics(analysis.revenueMetrics, scale),
    criticalMetric: {
      label: "CAC",
      message:
        "CAC is estimated here and should be replaced with channel-level acquisition data before fundraising conversations.",
    },
    plan: {
      ...analysis.plan,
      ...plan,
      valuationLogic: [
        ...analysis.plan.valuationLogic.slice(0, 4),
        { t: `Company scale classified as ${scale}`, ok: "neutral" as const },
        { t: `Raise range calibrated to ${plan.round}`, ok: true },
      ],
    },
  };
}

async function analyzeWithOpenAI({
  url,
  connectors,
  pageText,
}: {
  url: string;
  connectors: string[];
  pageText: string;
}): Promise<Analysis | ApiError> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return apiError("OPENAI_API_KEY is not configured on the server.", 500);
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o",
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a rigorous venture analyst. Return only valid JSON matching the requested structure. Score from evidence, not optimism. A small or unclear startup should usually score 20-55. A company with visible traction but missing revenue metrics should usually score 45-70. Only companies with clear scale, strong traction, repeatable GTM, and fundable market should score above 75. Never use 75 as a default. Do not invent exact private revenue, team size, customers, funding, or growth. When exact data is unavailable, provide conservative editable estimates using the prefix 'Estimated' or 'Est.' and make clear they are inferred from public signals.",
        },
        {
          role: "user",
          content: `Analyze this startup for fundraising readiness.

Startup URL: ${url}
Connected data sources: ${connectors.length ? connectors.join(", ") : "none"}
Website text:
${pageText}

Use this scoring rubric:
- Product Clarity: clear customer, problem, product, proof on the site.
- Market Opportunity: venture-scale market, timing, category expansion.
- Traction: public evidence of customers, revenue, growth, usage, launches, press, integrations, hiring, or community.
- Business Model: pricing, monetization, sales motion, gross margin signal.
- Investor Fit: stage, market size, differentiation, urgency, credible fundraising story.

Score breakdown labels must stay exactly those five labels and each value must be justified by the website evidence. If evidence is missing, reduce the score and call out the missing data.

Fundraising plan must be connected to company size and public signal:
- Validation / unclear traction: $100k-$300k raise, $1M-$3M valuation, 8-15% dilution, 9-12 months runway.
- Small pre-seed: $250k-$750k raise, $2M-$5M valuation, 10-20% dilution, 12-15 months runway.
- Early with some traction: $750k-$2M raise, $4M-$10M valuation, 12-22% dilution, 15-18 months runway.
- Seed with meaningful traction: $2M-$5M raise, $10M-$25M valuation, 15-25% dilution, 18 months runway.
- Breakout/enterprise-scale startup: $5M-$25M raise, $30M-$200M valuation, 10-20% dilution, 18-24 months runway.
- Do not recommend $500k+ for tiny/unclear companies unless there is meaningful traction signal.
- Do not recommend only $2M-$5M for a company with strong enterprise, funding, customer, hiring, or breakout-market signals.

Team size and economic indicators must be complete and editable:
- If exact team size is not public, estimate a range such as "Estimated 1-4", "Estimated 2-8", "Estimated 15-50", etc.
- revenueMetrics must include MRR, ARR, MoM Growth, ARPU, Churn, and CAC.
- If exact economics are unavailable, use conservative ranges prefixed with "Est." instead of Unknown.
- Use warning:true for estimated economics. Use missing:false when an estimate is provided.

Return this JSON shape exactly. Every array must contain at least one item; include more items when the website gives enough signal, but never pad with generic filler:
{
  "score": 0-100,
  "readinessLabel": "Pre-seed-ready | Seed-ready | Needs traction | etc",
  "scoreSummary": "one sentence",
  "breakdown": [
    {"label":"Product Clarity","v":0-100,"reason":"specific evidence or missing evidence"},
    {"label":"Market Opportunity","v":0-100,"reason":"specific evidence or missing evidence"},
    {"label":"Traction","v":0-100,"reason":"specific evidence or missing evidence"},
    {"label":"Business Model","v":0-100,"reason":"specific evidence or missing evidence"},
    {"label":"Investor Fit","v":0-100,"reason":"specific evidence or missing evidence"}
  ],
  "issues": ["concise issue"],
  "company": {
    "name": "company name",
    "initials": "1-3 chars",
    "category": "category",
    "stage": "stage",
    "status": "short status",
    "businessModel": "business model or Unknown",
    "mainMarket": "market/geography or Unknown",
    "teamSize": "exact team size or conservative Estimated range",
    "tractionSignal": "specific traction evidence or conservative estimate",
    "fundingSignal": "funding/accelerator/enterprise signal or No confirmed funding found",
    "sizeSignal": "overall company size assessment based on evidence",
    "summary": "one sentence summary"
  },
  "revenueMetrics": [
    {"label":"MRR","value":"Est. range","missing":false,"warning":true},
    {"label":"ARR","value":"Est. range","missing":false,"warning":true},
    {"label":"MoM Growth","value":"Est. range","missing":false,"warning":true},
    {"label":"ARPU","value":"Est. range","missing":false,"warning":true},
    {"label":"Churn","value":"Est. range","missing":false,"warning":true},
    {"label":"CAC","value":"Est. range","missing":false,"warning":true}
  ],
  "criticalMetric": {"label":"CAC","message":"why it matters"},
  "plan": {
    "round": "recommended round",
    "raiseAmount": "range",
    "valuation": "range",
    "dilution": "range",
    "runway": "months",
    "narrative": "best investor narrative",
    "useOfFunds": [
      {"label":"Growth","v":40,"c":"var(--primary)"},
      {"label":"Product","v":25,"c":"#6D5CF0"},
      {"label":"Hiring","v":20,"c":"var(--cyan)"},
      {"label":"Operations","v":15,"c":"#9AA4BD"}
    ],
    "valuationLogic": [{"t":"reason","ok":true}]
  },
  "investors": [{"name":"investor","fit":0-100,"initials":"VC","color":"#3B4EE8","stage":"Seed","activity":"Recently active","why":["reason","reason","reason"]}],
  "deck": {
    "readiness": 0-100,
    "slides": [{"n":1,"t":"Cover","s":"Strong"}],
    "dataRoom": [{"t":"Company overview","s":"Done"}]
  },
  "improvements": [{"t":"action","impact":8,"d":"description","icon":"coins"}]
}

For improvements.icon, use ONLY one of these exact strings: "coins", "refresh", "globe", "target". Do not return any other icon name.`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    return apiError(`OpenAI request failed: ${message.slice(0, 300)}`, 502);
  }

  const json = await response.json();
  const content = json.choices?.[0]?.message?.content;

  if (typeof content !== "string") {
    return apiError("OpenAI did not return JSON content.", 502);
  }

  try {
    return analysisSchema.parse(normalizeRawAnalysis(JSON.parse(content)));
  } catch (error) {
    return apiError(
      error instanceof Error
        ? `OpenAI returned an invalid analysis: ${error.message}`
        : "OpenAI returned an invalid analysis.",
      502,
    );
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const parsed = requestSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: "A startup URL is required." });
  }

  let url: string;
  try {
    url = normalizeUrl(parsed.data.url);
  } catch {
    return res.status(400).json({ error: "Enter a valid startup URL." });
  }

  const pageText = await fetchStartupContext(url);
  const analysis = await analyzeWithOpenAI({
    url,
    connectors: parsed.data.connectors,
    pageText,
  });

  if ("error" in analysis) {
    return res.status(analysis.status).json({ error: analysis.error });
  }

  const completedAnalysis = completeAnalysisEstimates(analysis, pageText, url);

  return res.status(200).json({ analysis: { ...completedAnalysis, url } });
}
