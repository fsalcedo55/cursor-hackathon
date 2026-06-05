import type { CSSProperties } from "react";

import { Icon } from "../icons/Icon";

type TrendChipProps = {
  value: string | number;
  unit?: string;
  positive?: boolean;
  style?: CSSProperties;
};

export function TrendChip({
  value,
  unit = "%",
  positive = true,
  style,
}: TrendChipProps) {
  const c = positive ? "var(--success)" : "var(--danger)";
  const bg = positive ? "var(--success-soft)" : "var(--danger-soft)";

  return (
    <span
      className="num inline-flex items-center gap-0.5 rounded-full py-0.5 pr-2 pl-1.5 text-[11.5px] font-semibold"
      style={{ color: c, background: bg, ...style }}
    >
      <Icon name={positive ? "trendUp" : "trendDown"} size={13} />
      <span>
        {value}
        {unit}
      </span>
    </span>
  );
}
