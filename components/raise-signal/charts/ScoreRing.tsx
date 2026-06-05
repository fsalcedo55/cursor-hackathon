"use client";

import { useCountUp } from "../hooks/useCountUp";
import { scoreColor } from "../lib/score";

type ScoreRingProps = {
  value: number;
  size?: number;
  stroke?: number;
  max?: number;
  suffix?: string;
  label?: string;
  animate?: boolean;
  big?: boolean;
};

export function ScoreRing({
  value,
  size = 132,
  stroke = 12,
  max = 100,
  suffix,
  label,
  animate = true,
  big,
}: ScoreRingProps) {
  const v = useCountUp(value, 1100, animate);
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(1, value / max);
  const col = scoreColor(value);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        aria-hidden
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--hairline)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={col}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          className="transition-[stroke-dashoffset] duration-[1100ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div
          className="num leading-none text-[var(--ink)]"
          style={{ fontSize: big ? 46 : 34, fontWeight: 600 }}
        >
          {Math.round(v)}
          {suffix && (
            <span
              className="font-medium text-[var(--ink-3)]"
              style={{ fontSize: big ? 20 : 16 }}
            >
              {suffix}
            </span>
          )}
        </div>
        {label && (
          <div className="mt-1.5 text-xs font-medium text-[var(--ink-3)]">
            {label}
          </div>
        )}
      </div>
    </div>
  );
}
