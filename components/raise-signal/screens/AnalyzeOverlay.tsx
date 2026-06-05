"use client";

import { useEffect, useState } from "react";

import { ScoreRing } from "../charts/ScoreRing";
import { Icon } from "../icons/Icon";
import type { IconName } from "../icons/icon-paths";

const ANALYSIS_ANIMATION_MS = 10_000;

type AnalyzeOverlayProps = {
  url: string;
};

export function AnalyzeOverlay({ url }: AnalyzeOverlayProps) {
  const steps: { t: string; icon: IconName }[] = [
    {
      t: `Reading ${url.replace(/^https?:\/\//, "") || "your site"}`,
      icon: "globe",
    },
    { t: "Parsing product & market", icon: "target" },
    { t: "Pulling revenue metrics", icon: "coins" },
    { t: "Estimating valuation", icon: "pieChart" },
    { t: "Matching investors", icon: "investors" },
  ];

  const [done, setDone] = useState(0);
  const [scoreValue, setScoreValue] = useState(8);

  useEffect(() => {
    const startedAt = Date.now();
    const stepMs = ANALYSIS_ANIMATION_MS / steps.length;

    const id = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const progress = Math.min(1, elapsed / ANALYSIS_ANIMATION_MS);

      setDone(Math.min(steps.length, Math.floor(elapsed / stepMs)));
      setScoreValue(Math.min(90, Math.max(8, Math.round(progress * 90))));

      if (elapsed >= ANALYSIS_ANIMATION_MS) {
        window.clearInterval(id);
      }
    }, 120);

    return () => window.clearInterval(id);
  }, [steps.length]);

  return (
    <div
      className="anim-tab fixed inset-0 z-[90] flex min-h-dvh flex-col items-center justify-center overflow-hidden px-10"
      style={{
        background: "rgba(244,248,255,0.86)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      <div className="relative mb-[30px]">
        <ScoreRing
          value={scoreValue}
          size={120}
          stroke={11}
          animate={false}
        />
      </div>
      <div className="mb-1 text-[17px] font-bold tracking-[-0.02em] text-[var(--ink)]">
        Analyzing your startup
      </div>
      <div className="mb-6 text-[13px] text-[var(--ink-3)]">
        Building your fundraising signal…
      </div>
      <div className="flex w-full max-w-[280px] flex-col gap-2.5">
        {steps.map((s, i) => {
          const isDone = i < done;
          const active = i === done;
          return (
            <div
              key={s.t}
              className="flex items-center gap-2.5 transition-opacity duration-300"
              style={{ opacity: i <= done ? 1 : 0.38 }}
            >
              <div
                className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full text-white transition-colors duration-300"
                style={{
                  background: isDone
                    ? "var(--success)"
                    : active
                      ? "var(--primary)"
                      : "var(--hairline)",
                }}
              >
                {isDone ? (
                  <Icon name="check" size={15} />
                ) : active ? (
                  <span className="h-[9px] w-[9px] animate-[rs-fade_0.6s_ease_infinite_alternate] rounded-full bg-white" />
                ) : (
                  <Icon name={s.icon} size={14} color="var(--ink-4)" />
                )}
              </div>
              <span
                className="text-[13.5px] font-[550]"
                style={{
                  color: isDone || active ? "var(--ink)" : "var(--ink-3)",
                }}
              >
                {s.t}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
