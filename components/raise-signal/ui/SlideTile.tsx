import type { StatusType } from "./StatusPill";

const statusColor: Record<StatusType, string> = {
  Strong: "var(--success)",
  Good: "var(--primary-700)",
  "Needs work": "var(--warning)",
  Missing: "var(--danger)",
  Done: "var(--success)",
  Suggested: "var(--cyan)",
};

type SlideTileProps = {
  n: number;
  t: string;
  s: StatusType;
};

export function SlideTile({ n, t, s }: SlideTileProps) {
  const c = statusColor[s];

  return (
    <div className="flex flex-col gap-2 rounded-[13px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-2.5">
      <div className="flex items-center justify-between">
        <span className="num text-[11px] font-semibold text-[var(--ink-4)]">
          {String(n).padStart(2, "0")}
        </span>
        <span className="h-[7px] w-[7px] rounded-full" style={{ background: c }} />
      </div>
      <div className="text-[13px] font-semibold tracking-[-0.01em] text-[var(--ink)]">
        {t}
      </div>
      <span className="text-[11px] font-semibold" style={{ color: c }}>
        {s}
      </span>
    </div>
  );
}
