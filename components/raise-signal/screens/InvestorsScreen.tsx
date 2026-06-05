"use client";

import { useState } from "react";

import { Icon } from "../icons/Icon";
import { AppHeader } from "../layout/AppHeader";
import { IconButton } from "../layout/IconButton";
import { bodyPad, pageX, ScreenScroll } from "../layout/ScreenScroll";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { FitBadge } from "../ui/FitBadge";
import type { GoFn, RaiseSignalAnalysis } from "../types";

type InvestorsScreenProps = {
  go: GoFn;
  analysis: RaiseSignalAnalysis;
};

const filters = [
  "Stage",
  "Geography",
  "Industry",
  "Ticket size",
  "Recent activity",
];

export function InvestorsScreen({ analysis }: InvestorsScreenProps) {
  const [active, setActive] = useState<Record<string, boolean>>({});

  return (
    <ScreenScroll>
      <AppHeader
        title="Investor Matches"
        sub={`${analysis.investors.length} strong matches for your signal`}
        right={<IconButton name="filter" />}
      />
      <div className={`rs-scroll flex gap-2 overflow-x-auto ${pageX} pt-0.5 pb-3`}>
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[var(--hairline)] bg-[var(--card)] px-3 py-2 text-[13px] font-[550] whitespace-nowrap text-[var(--ink-2)] shadow-[var(--shadow-sm)]"
          >
            {f}
            <Icon name="chevDown" size={14} color="var(--ink-4)" />
          </button>
        ))}
      </div>

      <div className={bodyPad}>
        <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2">
          {analysis.investors.map((inv, i) => {
            const added = active[inv.name];
            return (
              <Card
                key={inv.name}
                className="rise"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="mb-3.5 flex items-center gap-3">
                  <div
                    className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[13px] font-bold text-white"
                    style={{
                      background: inv.color,
                      fontSize: inv.initials.length > 2 ? 15 : 17,
                      letterSpacing: "-0.02em",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)",
                    }}
                  >
                    {inv.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-base font-bold tracking-[-0.01em] text-[var(--ink)]">
                      {inv.name}
                    </div>
                    <div className="text-[12.5px] text-[var(--ink-3)]">
                      {inv.activity} · {inv.stage}
                    </div>
                  </div>
                  <FitBadge value={inv.fit} />
                </div>
                <div className="mb-3.5 flex flex-col gap-2">
                  {inv.why.map((w) => (
                    <div key={w} className="flex items-center gap-2">
                      <Icon name="check" size={15} color="var(--success)" />
                      <span className="text-[13px] font-medium text-[var(--ink-2)]">
                        {w}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" full icon="mail">
                    Generate intro email
                  </Button>
                  <button
                    type="button"
                    onClick={() =>
                      setActive((a) => ({ ...a, [inv.name]: !a[inv.name] }))
                    }
                    className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[13px]"
                    style={{
                      border: added ? "none" : "1px solid var(--hairline)",
                      background: added
                        ? "var(--primary-soft)"
                        : "var(--card)",
                      color: added ? "var(--primary)" : "var(--ink-3)",
                    }}
                  >
                    <Icon name={added ? "check" : "bookmark"} size={18} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </ScreenScroll>
  );
}
