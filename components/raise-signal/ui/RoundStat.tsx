type RoundStatProps = {
  label: string;
  value: string;
  sub?: string;
};

export function RoundStat({ label, value, sub }: RoundStatProps) {
  return (
    <div>
      <div className="mb-1 text-[11px] font-[550] text-white/65">{label}</div>
      <div
        className="num leading-none text-white"
        style={{ fontSize: 17, fontWeight: 600 }}
      >
        {value}
      </div>
      {sub && (
        <div className="mt-0.5 text-[10.5px] text-white/55">{sub}</div>
      )}
    </div>
  );
}
