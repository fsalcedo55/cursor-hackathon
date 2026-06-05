import type { CSSProperties, ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  style?: CSSProperties;
  pad?: number;
  onClick?: () => void;
  className?: string;
  tone?: "tint";
};

export function Card({
  children,
  style,
  pad = 18,
  onClick,
  className = "",
  tone,
}: CardProps) {
  const bg = tone === "tint" ? "var(--primary-tint)" : "var(--card)";

  return (
    <div
      onClick={onClick}
      className={`relative border border-[var(--hairline)] shadow-[var(--shadow-md)] ${className}`}
      style={{
        background: bg,
        borderRadius: "var(--r-card)",
        padding: pad,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
