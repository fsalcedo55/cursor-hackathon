type FitBadgeProps = {
  value: number;
};

export function FitBadge({ value }: FitBadgeProps) {
  const c =
    value >= 90
      ? "var(--success)"
      : value >= 85
        ? "var(--primary-700)"
        : "var(--cyan)";
  const bg =
    value >= 90
      ? "var(--success-soft)"
      : value >= 85
        ? "var(--primary-soft)"
        : "var(--cyan-soft)";

  return (
    <div
      className="shrink-0 rounded-[13px] px-2.5 py-1.5 text-center"
      style={{ background: bg }}
    >
      <div
        className="num leading-none"
        style={{ fontSize: 19, fontWeight: 600, color: c }}
      >
        {value}
      </div>
      <div
        className="mt-0.5 text-[9.5px] font-semibold tracking-[0.04em]"
        style={{ color: c }}
      >
        FIT
      </div>
    </div>
  );
}
