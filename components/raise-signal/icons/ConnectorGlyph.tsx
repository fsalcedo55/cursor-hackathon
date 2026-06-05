import type { ReactNode } from "react";

const CONNECTORS: Record<string, { bg: string; fg: string; mark: ReactNode }> = {
  Stripe: {
    bg: "#635BFF",
    fg: "#fff",
    mark: (
      <svg viewBox="0 0 64 64" aria-hidden>
        <text
          x="32"
          y="38"
          textAnchor="middle"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="19"
          fontWeight="800"
          fill="currentColor"
          letterSpacing="-1"
        >
          stripe
        </text>
      </svg>
    ),
  },
  RevenueCat: {
    bg: "#F2545B",
    fg: "#fff",
    mark: (
      <svg viewBox="0 0 64 64" aria-hidden>
        <path
          d="M19 25 24 15l6 8h4l6-8 5 10c5 3 8 8 8 15 0 10-8 17-21 17S11 50 11 40c0-7 3-12 8-15Z"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="5"
        />
        <path
          d="M24 40h.1M40 40h.1M28 47c2 2 6 2 8 0"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="4"
        />
      </svg>
    ),
  },
  "App Store": {
    bg: "#0A84FF",
    fg: "#fff",
    mark: (
      <svg viewBox="0 0 64 64" aria-hidden>
        <path
          d="M18 46h28M28 16l16 30M36 16 20 46M25 36h14"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="6"
        />
      </svg>
    ),
  },
  "Google Play": {
    bg: "#fff",
    fg: "#1F2937",
    mark: (
      <svg viewBox="0 0 64 64" aria-hidden>
        <path d="M15 10v44l24-22L15 10Z" fill="#34A853" />
        <path d="m39 32 8-7c3-2.5 3-5.5 0-8L15 10l24 22Z" fill="#4285F4" />
        <path d="m39 32 8 7c3 2.5 3 5.5 0 8L15 54l24-22Z" fill="#FBBC04" />
        <path d="m47 25-8 7 8 7 3-2.5c4-3 4-6 0-9L47 25Z" fill="#EA4335" />
      </svg>
    ),
  },
  GA4: {
    bg: "#F9AB00",
    fg: "#fff",
    mark: (
      <svg viewBox="0 0 64 64" aria-hidden>
        <rect x="13" y="34" width="10" height="18" rx="5" fill="#E37400" />
        <rect x="27" y="22" width="10" height="30" rx="5" fill="#F57C00" />
        <rect x="41" y="12" width="10" height="40" rx="5" fill="#F9AB00" />
        <circle cx="18" cy="18" r="6" fill="#E37400" />
      </svg>
    ),
  },
  Firebase: {
    bg: "#FFCA28",
    fg: "#111827",
    mark: (
      <svg viewBox="0 0 64 64" aria-hidden>
        <path d="M14 49 23 9l11 21 6-11 10 30-18 10-18-10Z" fill="#FFA000" />
        <path d="M23 9 14 49l20-19-11-21Z" fill="#F57C00" />
        <path d="m34 30 6-11 10 30-16-19Z" fill="#FFCA28" />
      </svg>
    ),
  },
  Shopify: {
    bg: "#95BF47",
    fg: "#fff",
    mark: (
      <svg viewBox="0 0 64 64" aria-hidden>
        <path
          d="M19 20h32l-4 34-28 5-6-39h6Z"
          fill="#5E8E3E"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="3"
        />
        <path
          d="M25 20c0-7 4-12 10-12 5 0 8 4 8 12M28 20c0-4 2-8 6-8 3 0 5 3 5 8"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="3"
        />
        <text
          x="33"
          y="43"
          textAnchor="middle"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="19"
          fontWeight="800"
          fill="currentColor"
        >
          S
        </text>
      </svg>
    ),
  },
  "Meta Ads": {
    bg: "#0866FF",
    fg: "#fff",
    mark: (
      <svg viewBox="0 0 64 64" aria-hidden>
        <path
          d="M10 38c6-18 13-24 20-10l4 8c7 14 14 8 20-10M10 38c6 12 13 9 20-10l4-8c7-14 14-7 20 18"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="6"
        />
      </svg>
    ),
  },
};

type ConnectorGlyphProps = {
  name: string;
  size?: number;
  radius?: number;
};

export function ConnectorGlyph({
  name,
  size = 30,
  radius = 9,
}: ConnectorGlyphProps) {
  const c = CONNECTORS[name] || {
    bg: "#E9EEF8",
    fg: "#545E76",
    mark: (
      <span style={{ fontSize: size * 0.5, fontWeight: 700 }}>{name[0]}</span>
    ),
  };

  return (
    <div
      className="flex shrink-0 items-center justify-center overflow-hidden font-bold"
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: c.bg,
        color: c.fg,
        fontFamily: "var(--sans)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)",
      }}
    >
      <div
        className="[&>svg]:h-full [&>svg]:w-full"
        style={{ width: size * 0.82, height: size * 0.82 }}
      >
        {c.mark}
      </div>
    </div>
  );
}
