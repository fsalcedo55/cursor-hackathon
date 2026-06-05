"use client";

import { SegmentedBar } from "../charts/SegmentedBar";
import { Icon } from "../icons/Icon";
import { AppHeader } from "../layout/AppHeader";
import { bodyPad, ScreenScroll } from "../layout/ScreenScroll";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { CardTitle } from "../ui/CardTitle";
import { RoundStat } from "../ui/RoundStat";
import type { GoFn, RaiseSignalAnalysis } from "../types";

type PlanScreenProps = {
  go: GoFn;
  analysis: RaiseSignalAnalysis;
};

export function PlanScreen({ go, analysis }: PlanScreenProps) {
  const { plan } = analysis;
  const sizeSignals = [
    { label: "Team size", value: analysis.company.teamSize },
    { label: "Traction", value: analysis.company.tractionSignal },
    { label: "Funding signal", value: analysis.company.fundingSignal },
    { label: "Company size", value: analysis.company.sizeSignal },
  ];

  return (
    <ScreenScroll>
      <AppHeader
        back
        onBack={() => go("dashboard")}
        title="Fundraising Plan"
        sub="Recommendation based on your signal"
      />
      <div className={`${bodyPad} lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)] lg:gap-4`}>
        <Card
          className="rise lg:col-start-1"
          pad={20}
          style={{
            background:
              "linear-gradient(160deg, var(--agent) 0%, var(--ink) 100%)",
            border: "none",
            boxShadow: "0 18px 44px rgba(24,24,27,0.18)",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-semibold tracking-[0.07em] text-white/72 uppercase">
              Recommended round
            </span>
            <span className="rounded-full bg-amber-300 px-2.5 py-1 text-xs font-[650] text-zinc-950">
              {plan.round}
            </span>
          </div>
          <div
            className="num my-3.5 text-[38px] leading-none font-semibold tracking-[-0.02em] text-white"
          >
            {plan.raiseAmount}
          </div>
          <div className="mb-4 text-[13px] text-white/72">
            Suggested raise amount
          </div>
          <div className="grid grid-cols-3 gap-3 border-t border-white/16 pt-4">
            <RoundStat label="Valuation" value={plan.valuation} sub="pre-money" />
            <RoundStat label="Dilution" value={plan.dilution} />
            <RoundStat label="Runway" value={plan.runway} />
          </div>
        </Card>

        <Card className="rise mt-3.5 lg:col-start-1" style={{ animationDelay: ".05s" }}>
          <CardTitle icon="doc">Best investor narrative</CardTitle>
          <p className="m-0 text-base leading-normal font-medium tracking-[-0.01em] text-[var(--ink)]">
            &ldquo;{plan.narrative}&rdquo;
          </p>
        </Card>

        <Card className="rise mt-3.5 lg:col-start-1" style={{ animationDelay: ".07s" }}>
          <CardTitle icon="target">Company size inputs</CardTitle>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {sizeSignals.map((signal) => {
              const unknown = signal.value.trim().toLowerCase() === "unknown";

              return (
                <div
                  key={signal.label}
                  className="rounded-[13px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-3"
                >
                  <div className="mb-1 text-[11.5px] font-[550] text-[var(--ink-3)]">
                    {signal.label}
                  </div>
                  <div
                    className="flex items-start gap-2 text-[13.5px] font-semibold"
                    style={{
                      color: unknown ? "var(--warning)" : "var(--ink)",
                    }}
                  >
                    {unknown && <Icon name="alert" size={15} />}
                    <span>{signal.value}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="rise mt-3.5 lg:col-start-2 lg:row-start-1 lg:mt-0" style={{ animationDelay: ".09s" }}>
          <CardTitle icon="pieChart">Use of funds</CardTitle>
          <SegmentedBar segments={plan.useOfFunds} />
          <div className="flex flex-col gap-2.5">
            {plan.useOfFunds.map((f) => (
              <div key={f.label} className="flex items-center gap-2.5">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-[3px]"
                  style={{ background: f.c }}
                />
                <span className="flex-1 text-[13.5px] font-medium text-[var(--ink)]">
                  {f.label}
                </span>
                <span className="num text-sm font-semibold text-[var(--ink)]">
                  {f.v}%
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rise mt-3.5 lg:col-start-2" style={{ animationDelay: ".13s" }}>
          <CardTitle icon="coins">Why this valuation range?</CardTitle>
          <div className="flex flex-col gap-3">
            {plan.valuationLogic.map((b) => {
              const color =
                b.ok === true
                  ? "var(--success)"
                  : b.ok === false
                    ? "var(--danger)"
                    : "var(--ink-4)";
              const icon =
                b.ok === true
                  ? "check"
                  : b.ok === false
                    ? "alert"
                    : "minusCircle";
              return (
                <div key={b.t} className="flex items-center gap-2.5">
                  <div style={{ color }}>
                    <Icon name={icon} size={18} />
                  </div>
                  <span
                    className="text-[13.5px]"
                    style={{
                      color: b.ok === false ? "var(--danger)" : "var(--ink)",
                      fontWeight: b.ok === false ? 600 : 500,
                    }}
                  >
                    {b.t}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        <div className="lg:col-span-2">
          <Button
            full
            variant="dark"
            iconRight="arrowUpRight"
            style={{ marginTop: 18 }}
            onClick={() => go("investors")}
          >
            Match me with investors
          </Button>
        </div>
      </div>
    </ScreenScroll>
  );
}
