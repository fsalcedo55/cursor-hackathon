import type { CSSProperties, ReactNode } from "react";

type EyebrowProps = {
  children: ReactNode;
  style?: CSSProperties;
};

export function Eyebrow({ children, style }: EyebrowProps) {
  return (
    <div
      className="text-[11.5px] font-semibold uppercase tracking-[0.07em] text-[var(--ink-3)]"
      style={style}
    >
      {children}
    </div>
  );
}
