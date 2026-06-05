type SummaryItemProps = {
  label: string;
  value: string;
};

export function SummaryItem({ label, value }: SummaryItemProps) {
  return (
    <div>
      <div className="mb-0.5 text-[11.5px] font-[550] text-[var(--ink-3)]">
        {label}
      </div>
      <div className="text-sm font-semibold text-[var(--ink)]">{value}</div>
    </div>
  );
}
