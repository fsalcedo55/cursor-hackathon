import type { ReactNode } from "react";

type MetricStatProps = {
  label: string;
  value: string;
  mono?: boolean;
  accent?: string;
  trend?: ReactNode;
  sub?: string;
  missing?: boolean;
};

export function MetricStat({
  label,
  value,
  mono = true,
  accent,
  trend,
  sub,
  missing,
}: MetricStatProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-[11.5px] font-[550] tracking-[0.01em] text-[var(--ink-3)]">
        {label}
      </div>
      <div className="flex flex-wrap items-baseline gap-1.5">
        <span
          className={mono ? "num" : ""}
          style={{
            fontSize: 19,
            fontWeight: 600,
            color: missing ? "var(--danger)" : accent || "var(--ink)",
            lineHeight: 1.1,
          }}
        >
          {value}
        </span>
        {trend}
      </div>
      {sub && <div className="text-[11px] text-[var(--ink-4)]">{sub}</div>}
    </div>
  );
}
