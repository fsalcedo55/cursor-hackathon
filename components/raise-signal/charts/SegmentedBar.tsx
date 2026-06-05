type Segment = {
  label: string;
  v: number;
  c: string;
};

type SegmentedBarProps = {
  segments: Segment[];
};

export function SegmentedBar({ segments }: SegmentedBarProps) {
  return (
    <div className="mb-4 flex h-3 overflow-hidden rounded-full">
      {segments.map((f) => (
        <div key={f.label} style={{ width: `${f.v}%`, background: f.c }} />
      ))}
    </div>
  );
}
