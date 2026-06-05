import type { CSSProperties } from "react";

export type StatusType =
  | "Strong"
  | "Good"
  | "Needs work"
  | "Missing"
  | "Done"
  | "Suggested";

const STATUS: Record<StatusType, { c: string; b: string }> = {
  Strong: { c: "var(--success)", b: "var(--success-soft)" },
  Good: { c: "var(--primary-700)", b: "var(--primary-soft)" },
  "Needs work": { c: "var(--warning)", b: "var(--warning-soft)" },
  Missing: { c: "var(--danger)", b: "var(--danger-soft)" },
  Done: { c: "var(--success)", b: "var(--success-soft)" },
  Suggested: { c: "var(--cyan)", b: "var(--cyan-soft)" },
};

type StatusPillProps = {
  status: StatusType;
  dot?: boolean;
  style?: CSSProperties;
};

export function StatusPill({ status, dot = true, style }: StatusPillProps) {
  const s = STATUS[status] || STATUS.Good;

  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full py-1 pr-2.5 pl-2 text-xs font-semibold"
      style={{ color: s.c, background: s.b, ...style }}
    >
      {dot && (
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: s.c }}
        />
      )}
      {status}
    </span>
  );
}
