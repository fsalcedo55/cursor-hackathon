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
  const primaryActions = actions.slice(0, 3);
  const secondaryActions = actions.slice(3);
  const potential = Math.min(
    98,
    analysis.score + actions.reduce((a, b) => a + b.impact, 0),
  );

  return (
    <ScreenScroll>
      <AppHeader
        back
        onBack={() => go("dashboard")}
        title="Fix the signal"
        sub="Do the highest-leverage proof points first"
      />
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
          <Button
            full
            icon="flag"
            variant="secondary"
            style={{ marginTop: 14 }}
            onClick={() => go("plan")}
          >
            Recheck raise plan
          </Button>
        </Card>

        <div className="mt-3.5 lg:mt-0">
          <Card className="rise" pad={18}>
            <Eyebrow>Recommended order</Eyebrow>
            <h2 className="mt-2 mb-1 text-[24px] leading-[1.1] font-bold tracking-[-0.03em] text-[var(--ink)]">
              Fix these 3 things before sending the deck.
            </h2>
            <p className="m-0 text-sm leading-[1.45] text-[var(--ink-2)]">
              These are the shortest path from an interesting company to a fundable
              story investors can underwrite.
            </p>
          </Card>

          <div className="mt-3 grid grid-cols-1 gap-3">
            {primaryActions.map((a, i) => (
              <Card
                key={a.t}
                className="rise"
                pad={16}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex gap-3">
                  <div
                    className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[13px]"
                    style={{
                      background: i === 0 ? "var(--ink)" : "var(--primary-soft)",
                      color: i === 0 ? "#fff" : "var(--primary-700)",
                    }}
                  >
                    <Icon name={a.icon} size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between gap-2.5">
                      <span className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[var(--ink-3)]">
                        Step {i + 1}
                      </span>
                      <span className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-[var(--success-soft)] px-2 py-1 text-xs font-bold text-[var(--success)]">
                        <Icon name="trendUp" size={13} />+{a.impact}
                      </span>
                    </div>
                    <div className="text-[15px] font-[650] tracking-[-0.01em] text-[var(--ink)]">
                      {a.t}
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
                          Start with this fix
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {secondaryActions.length > 0 && (
            <Card className="rise mt-3" pad={16} style={{ animationDelay: ".18s" }}>
              <div className="mb-2 text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[var(--ink-3)]">
                Later
              </div>
              <div className="grid gap-2">
                {secondaryActions.map((a) => (
                  <div key={a.t} className="flex items-center justify-between gap-3">
                    <span className="text-[13px] font-medium text-[var(--ink)]">
                      {a.t}
                    </span>
                    <span className="num text-xs font-semibold text-[var(--success)]">
                      +{a.impact}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </ScreenScroll>
  );
}
