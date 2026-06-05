"use client";

import { ProgressBar } from "../charts/ProgressBar";
import { Icon } from "../icons/Icon";
import { AppHeader } from "../layout/AppHeader";
import { bodyPad, ScreenScroll } from "../layout/ScreenScroll";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { CardTitle } from "../ui/CardTitle";
import { SlideTile } from "../ui/SlideTile";
import { StatusPill, type StatusType } from "../ui/StatusPill";
import type { GoFn, RaiseSignalAnalysis } from "../types";

type DeckScreenProps = {
  go: GoFn;
  analysis: RaiseSignalAnalysis;
};

const legendColors: Record<string, { color: string; bg: string }> = {
  Strong: { color: "var(--success)", bg: "var(--success-soft)" },
  Good: { color: "var(--primary)", bg: "var(--primary-soft)" },
  "Needs work": { color: "var(--warning)", bg: "var(--warning-soft)" },
  Missing: { color: "var(--danger)", bg: "var(--danger-soft)" },
};

export function DeckScreen({ go, analysis }: DeckScreenProps) {
  const counts = analysis.deck.slides.reduce(
    (a, s) => {
      a[s.s] = (a[s.s] || 0) + 1;
      return a;
    },
    {} as Record<string, number>,
  );

  return (
    <ScreenScroll>
      <AppHeader
        back
        onBack={() => go("dashboard")}
        title="Deck & Data Room"
      />
      <div className={`${bodyPad} lg:grid lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)] lg:gap-4`}>
        <Card className="rise">
          <CardTitle
            icon="layers"
            right={
              <span className="num text-xs text-[var(--ink-3)]">
                {analysis.deck.slides.length} slides
              </span>
            }
          >
            Pitch Deck
          </CardTitle>
          <div className="mb-4 flex flex-wrap gap-1.5">
            {(["Strong", "Good", "Needs work", "Missing"] as StatusType[])
              .filter((s) => counts[s])
              .map((s) => (
                <span
                  key={s}
                  className="num inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-semibold"
                  style={{
                    color: legendColors[s].color,
                    background: legendColors[s].bg,
                  }}
                >
                  {counts[s]}
                  {s}
                </span>
              ))}
          </div>
          <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {analysis.deck.slides.map((sl) => (
              <SlideTile key={sl.n} {...sl} />
            ))}
          </div>
          <Button full icon="spark" onClick={() => go("improve")}>
            Generate deck
          </Button>
        </Card>

        <Card className="rise mt-3.5 lg:mt-0" style={{ animationDelay: ".06s" }}>
          <CardTitle
            icon="vault"
            right={
              <span className="num text-[13px] font-[650] text-[var(--warning)]">
                {analysis.deck.readiness}% ready
              </span>
            }
          >
            Data Room Checklist
          </CardTitle>
          <ProgressBar value={analysis.deck.readiness} color="var(--warning)" height={8} />
          <div className="mt-1.5">
            {analysis.deck.dataRoom.map((d, i) => {
              const done = d.s === "Done";
              const icon = done
                ? "checkCircle"
                : d.s === "Suggested"
                  ? "plusCircle"
                  : "minusCircle";
              const col = done
                ? "var(--success)"
                : d.s === "Suggested"
                  ? "var(--cyan)"
                  : "var(--ink-4)";
              return (
                <div
                  key={d.t}
                  className="flex items-center gap-2.5 py-3"
                  style={{
                    borderBottom:
                      i === analysis.deck.dataRoom.length - 1
                        ? "none"
                        : "1px solid var(--hairline-2)",
                  }}
                >
                  <Icon name={icon} size={19} color={col} />
                  <span
                    className="flex-1 text-[13.5px] font-medium"
                    style={{ color: done ? "var(--ink)" : "var(--ink-2)" }}
                  >
                    {d.t}
                  </span>
                  <StatusPill status={d.s} dot={false} />
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </ScreenScroll>
  );
}
