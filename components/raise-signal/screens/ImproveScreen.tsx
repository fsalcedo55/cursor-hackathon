"use client";

import { Icon } from "../icons/Icon";
import { AppHeader } from "../layout/AppHeader";
import { bodyPad, ScreenScroll } from "../layout/ScreenScroll";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Eyebrow } from "../ui/Eyebrow";
import type { GoFn, RaiseSignalAnalysis } from "../types";

type ImproveScreenProps = {
  go: GoFn;
  analysis: RaiseSignalAnalysis;
};

export function ImproveScreen({ go, analysis }: ImproveScreenProps) {
  const actions = [...analysis.improvements].sort((a, b) => b.impact - a.impact);
  const potential = Math.min(
    98,
    analysis.score + actions.reduce((a, b) => a + b.impact, 0),
  );

  return (
    <ScreenScroll>
      <AppHeader back onBack={() => go("dashboard")} title="Prioritize fixes" />
      <div className={`${bodyPad} lg:grid lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-4`}>
        <Card
          className="rise lg:sticky lg:top-24 lg:self-start"
          pad={18}
          style={{
            background:
              "linear-gradient(160deg, rgba(255,255,255,0.94) 0%, var(--primary-tint) 100%)",
          }}
        >
          <Eyebrow>Score projection</Eyebrow>
          <div className="mt-3 flex items-center gap-3.5">
            <div
              className="num text-[32px] font-semibold text-[var(--ink-3)]"
            >
              {analysis.score}
            </div>
            <div className="relative h-2 flex-1">
              <div className="absolute inset-0 rounded-full bg-[var(--hairline)]" />
              <div
                className="absolute top-0 bottom-0 left-0 rounded-full"
                style={{
                  width: `${potential}%`,
                  background:
                    "linear-gradient(90deg, var(--primary-700), var(--success))",
                }}
              />
              <Icon
                name="arrowUpRight"
                size={16}
                color="var(--success)"
                style={{ position: "absolute", right: -4, top: -22 }}
              />
            </div>
            <div className="num text-[32px] font-semibold text-[var(--success)]">
              {potential}
            </div>
          </div>
          <p className="mt-3.5 mb-0 text-[13px] leading-[1.45] text-[var(--ink-2)]">
            Completing {actions.length === 1 ? "this action" : `all ${actions.length} actions`} could lift you to{" "}
            <strong className="text-[var(--ink)]">{potential}/100</strong> —
            closer to {analysis.readinessLabel}.
          </p>
        </Card>

        <div className="mt-3.5 grid grid-cols-1 gap-3 lg:mt-0 lg:grid-cols-2">
          {actions.map((a, i) => (
            <Card
              key={a.t}
              className="rise"
              pad={16}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex gap-3">
                <div
                  className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[11px]"
                  style={{
                    background:
                      i === 0 ? "var(--ink)" : "var(--primary-soft)",
                    color: i === 0 ? "#fff" : "var(--primary-700)",
                  }}
                >
                  <Icon name={a.icon} size={19} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2.5">
                    <span className="text-[14.5px] font-[650] tracking-[-0.01em] text-[var(--ink)]">
                      {a.t}
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-[var(--success-soft)] px-2 py-1 text-xs font-bold text-[var(--success)]">
                      <Icon name="trendUp" size={13} />+{a.impact}
                    </span>
                  </div>
                  <p className="mt-1 mb-0 text-[13px] leading-[1.45] text-[var(--ink-2)]">
                    {a.d}
                  </p>
                  {i === 0 && (
                    <div className="mt-3">
                      <Button
                        size="sm"
                        icon="bolt"
                        onClick={() => go("dashboard")}
                      >
                        Start highest-impact fix
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </ScreenScroll>
  );
}
