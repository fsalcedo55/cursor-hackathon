type DividerProps = {
  m?: number;
};

export function Divider({ m = 0 }: DividerProps) {
  return (
    <div
      className="h-px bg-[var(--hairline)]"
      style={{ margin: `${m}px 0` }}
    />
  );
}
