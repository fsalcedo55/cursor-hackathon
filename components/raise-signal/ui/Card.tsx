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
  const bg =
    tone === "tint"
      ? "linear-gradient(160deg, rgba(255,255,255,0.88) 0%, var(--primary-tint) 100%)"
      : "rgba(255,255,255,0.86)";

  return (
    <div
      onClick={onClick}
      className={`relative border border-[var(--hairline)] shadow-[var(--shadow-md)] backdrop-blur-sm ${className}`}
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
