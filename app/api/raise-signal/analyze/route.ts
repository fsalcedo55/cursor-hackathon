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

async function analyzeWithOpenAI({
  url,
  connectors,
  pageText,
}: {
  url: string;
  connectors: string[];
  pageText: string;
}) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return Response.json(
      { error: "OPENAI_API_KEY is not configured on the server." },
      { status: 500 },
    );
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
            "You are a rigorous venture analyst. Return only valid JSON matching the requested structure. Score from evidence, not optimism. A small or unclear startup should usually score 20-55. A company with visible traction but missing revenue metrics should usually score 45-70. Only companies with clear scale, strong traction, repeatable GTM, and fundable market should score above 75. Never use 75 as a default. Never invent exact private revenue, team size, customers, funding, or growth; mark Unknown when unavailable.",
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

Fundraising plan must be connected to company size:
- If team size, customers, revenue, funding, or growth are Unknown, recommend a smaller exploratory/pre-seed plan or mark ranges as "Needs metrics".
- Do not recommend seed-scale raises or multi-million valuations without concrete traction signals.

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
    "teamSize": "team size or Unknown",
    "tractionSignal": "specific traction evidence or Unknown",
    "fundingSignal": "funding/accelerator/enterprise signal or Unknown",
    "sizeSignal": "overall company size assessment based on evidence",
    "summary": "one sentence summary"
  },
  "revenueMetrics": [
    {"label":"MRR","value":"Unknown","missing":true},
    {"label":"ARR","value":"Unknown","missing":true},
    {"label":"MoM Growth","value":"Unknown","missing":true},
    {"label":"Business Model","value":"..."}
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
}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    return Response.json(
      { error: `OpenAI request failed: ${message.slice(0, 300)}` },
      { status: 502 },
    );
  }

  const json = await response.json();
  const content = json.choices?.[0]?.message?.content;

  if (typeof content !== "string") {
    return Response.json({ error: "OpenAI did not return JSON content." }, { status: 502 });
  }

  try {
    return analysisSchema.parse(JSON.parse(content));
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? `OpenAI returned an invalid analysis: ${error.message}`
            : "OpenAI returned an invalid analysis.",
      },
      { status: 502 },
    );
  }
}

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return Response.json({ error: "A startup URL is required." }, { status: 400 });
  }

  let url: string;
  try {
    url = normalizeUrl(parsed.data.url);
  } catch {
    return Response.json({ error: "Enter a valid startup URL." }, { status: 400 });
  }

  const pageText = await fetchStartupContext(url);
  const analysis = await analyzeWithOpenAI({
    url,
    connectors: parsed.data.connectors,
    pageText,
  });

  if (analysis instanceof Response) {
    return analysis;
  }

  return Response.json({ analysis: { ...analysis, url } });
}
