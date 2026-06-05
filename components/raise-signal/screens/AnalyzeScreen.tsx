"use client";

import { ConnectorGlyph } from "../icons/ConnectorGlyph";
import { Icon } from "../icons/Icon";
import { Logomark } from "../icons/Logomark";
import { bodyPad, brandBar, ScreenScroll } from "../layout/ScreenScroll";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Eyebrow } from "../ui/Eyebrow";
import { UrlInput } from "../ui/UrlInput";

const CONNECTORS = [
  "Stripe",
  "RevenueCat",
  "App Store",
  "Google Play",
  "GA4",
  "Firebase",
  "Shopify",
  "Meta Ads",
] as const;

const FEATURES = [
  { icon: "target" as const, t: "Fundraising readiness score" },
  { icon: "doc" as const, t: "Investor-ready narrative" },
  { icon: "coins" as const, t: "Valuation estimate" },
  { icon: "investors" as const, t: "VC matching" },
  { icon: "vault" as const, t: "Data room checklist" },
];

type AnalyzeScreenProps = {
  url: string;
  setUrl: (url: string) => void;
  connected: Record<string, boolean>;
  toggleConnector: (name: string) => void;
  onAnalyze: () => void;
  analyzing: boolean;
  error: string | null;
};

export function AnalyzeScreen({
  url,
  setUrl,
  connected,
  toggleConnector,
  onAnalyze,
  analyzing,
  error,
}: AnalyzeScreenProps) {
  const nConn = Object.values(connected).filter(Boolean).length;

  return (
    <ScreenScroll>
      <div className={brandBar}>
        <Logomark size={30} />
        <span className="text-lg font-bold tracking-[-0.02em] text-[var(--ink)]">
          RaiseSignal
        </span>
      </div>

      <div className={`${bodyPad} lg:grid lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start lg:gap-6`}>
        <div className="rise mb-5.5 mt-4 sm:mt-5 lg:mb-0 lg:max-w-none">
          <Eyebrow style={{ color: "var(--primary)" }}>Fundraising OS</Eyebrow>
          <h1 className="mt-2.5 mb-2.5 text-[34px] leading-[1.05] font-bold tracking-[-0.03em] text-balance text-[var(--ink)] sm:text-4xl lg:max-w-[720px] lg:text-[64px]">
            Get investor-ready
          </h1>
          <p className="m-0 max-w-2xl text-[15px] leading-normal text-[var(--ink-2)] sm:text-base lg:text-lg">
            Paste your startup URL. We&apos;ll analyze your business, metrics,
            market, valuation, deck, and investor fit.
          </p>
        </div>

        <Card className="rise lg:mt-5" pad={16} style={{ animationDelay: ".05s" }}>
          <label className="text-xs font-semibold tracking-[0.01em] text-[var(--ink-3)]">
            Startup URL
          </label>
          <div className="mt-2">
            <UrlInput
              value={url}
              onChange={setUrl}
              onSubmit={() => {
                if (!analyzing) onAnalyze();
              }}
              placeholder="https://yourstartup.com"
            />
          </div>
          <Button full icon="spark" onClick={onAnalyze} disabled={analyzing}>
            {analyzing ? "Analyzing..." : "Analyze startup"}
          </Button>
          {error && (
            <div className="mt-3 flex gap-2 rounded-[13px] bg-[var(--danger-soft)] px-3 py-3 text-[12.5px] leading-[1.45] text-[var(--danger)]">
              <Icon name="alert" size={17} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}
        </Card>

        <div className="mt-6 mb-2.5 flex items-center justify-between lg:col-span-2">
          <Eyebrow>Connect metrics · optional</Eyebrow>
          {nConn > 0 && (
            <span className="text-[11.5px] font-semibold text-[var(--success)]">
              {nConn} connected
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:col-span-2">
          {CONNECTORS.map((name) => {
            const on = connected[name];
            return (
              <button
                key={name}
                type="button"
                onClick={() => toggleConnector(name)}
                className="flex items-center gap-2.5 rounded-[14px] border bg-[var(--card)] p-[11px_12px] text-left transition-all duration-150"
                style={{
                  borderColor: on ? "var(--primary)" : "var(--hairline)",
                  boxShadow: on
                    ? "0 4px 14px -6px rgba(49,64,206,0.45)"
                    : "var(--shadow-sm)",
                }}
              >
                <ConnectorGlyph name={name} size={30} />
                <span className="flex-1 truncate text-[13px] font-semibold text-[var(--ink)]">
                  {name}
                </span>
                <div
                  className="flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full text-white"
                  style={{
                    border: on ? "none" : "1.6px solid var(--hairline)",
                    background: on ? "var(--primary)" : "transparent",
                  }}
                >
                  {on && <Icon name="check" size={12} />}
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-3.5 flex items-center gap-1.5 text-[var(--ink-3)] lg:col-span-2">
          <Icon name="info" size={15} />
          <span className="text-[12.5px]">
            You can start without connecting anything.
          </span>
        </div>

        <Card
          className="rise mt-5.5 lg:col-span-2"
          tone="tint"
          style={{
            background:
              "linear-gradient(165deg, #FBFCFF 0%, var(--primary-tint) 100%)",
          }}
        >
          <div className="mb-3.5 flex items-center gap-2">
            <Icon name="rocket" size={19} color="var(--primary)" />
            <span className="text-[15px] font-[650] tracking-[-0.01em] text-[var(--ink)]">
              Everything you need to raise with confidence
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
            {FEATURES.map((f) => (
              <div key={f.t} className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-white/90 text-[var(--primary)] shadow-[var(--shadow-sm)]">
                  <Icon name={f.icon} size={16} />
                </div>
                <span className="text-sm font-[550] text-[var(--ink)]">
                  {f.t}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </ScreenScroll>
  );
}
