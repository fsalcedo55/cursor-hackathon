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
  { icon: "doc" as const, t: "AI company read" },
  { icon: "target" as const, t: "Readiness evidence" },
  { icon: "coins" as const, t: "Raise recommendation" },
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

      <div className={`${bodyPad} mx-auto max-w-5xl`}>
        <div className="rise mt-5 text-center sm:mt-8">
          <Eyebrow style={{ color: "var(--primary-700)" }}>Fundraising agent</Eyebrow>
          <h1 className="mx-auto mt-3 mb-3 max-w-3xl text-[40px] leading-[1.02] font-bold tracking-[-0.04em] text-balance text-[var(--ink)] sm:text-5xl lg:text-[68px]">
            Raise your signal before you raise capital.
          </h1>
          <p className="mx-auto m-0 max-w-2xl text-[15px] leading-normal text-[var(--ink-2)] sm:text-base lg:text-lg">
            Paste your startup URL. RaiseSignal will explain what it thinks
            your company is, how fundable it looks, and what to do next.
          </p>
        </div>

        <Card
          className="rise mx-auto mt-7 max-w-2xl"
          pad={18}
          style={{ animationDelay: ".05s" }}
        >
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
            {analyzing ? "Building signal..." : "Raise my signal"}
          </Button>
          {error && (
            <div className="mt-3 flex gap-2 rounded-[13px] bg-[var(--danger-soft)] px-3 py-3 text-[12.5px] leading-[1.45] text-[var(--danger)]">
              <Icon name="alert" size={17} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}
        </Card>

        <div className="rise mx-auto mt-4 grid max-w-2xl grid-cols-1 gap-2.5 sm:grid-cols-3" style={{ animationDelay: ".08s" }}>
          {FEATURES.map((f) => (
            <div
              key={f.t}
              className="flex items-center justify-center gap-2 rounded-[14px] border border-[var(--hairline)] bg-white/60 px-3 py-3 text-[13px] font-semibold text-[var(--ink)] shadow-[var(--shadow-sm)]"
            >
              <Icon name={f.icon} size={16} color="var(--primary-700)" />
              <span>{f.t}</span>
            </div>
          ))}
        </div>

        <div className="mt-7 mb-2.5 flex items-center justify-between">
          <Eyebrow>Optional private signal</Eyebrow>
          {nConn > 0 && (
            <span className="text-[11.5px] font-semibold text-[var(--success)]">
              {nConn} connected
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 opacity-85 sm:grid-cols-4">
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
                    ? "0 6px 18px -10px rgba(120,53,15,0.55)"
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
        <div className="mt-3.5 flex items-center justify-center gap-1.5 text-[var(--ink-3)]">
          <Icon name="info" size={15} />
          <span className="text-[12.5px]">
            Start with just your public website. Metrics can be added later.
          </span>
        </div>
      </div>
    </ScreenScroll>
  );
}
