"use client";

import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";

import { Icon, type IconName } from "../icons/Icon";

type ButtonVariant = "primary" | "secondary" | "ghost" | "dark";
type ButtonSize = "lg" | "sm";

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconRight?: IconName;
  full?: boolean;
  style?: CSSProperties;
  disabled?: boolean;
};

const variants: Record<ButtonVariant, CSSProperties> = {
  primary: {
    color: "#fff",
    background:
      "linear-gradient(180deg, var(--primary) 0%, var(--primary-600) 100%)",
    boxShadow:
      "0 1px 2px rgba(28,40,120,0.25), 0 8px 20px -6px rgba(49,64,206,0.5), inset 0 1px 0 rgba(255,255,255,0.22)",
  },
  secondary: {
    color: "var(--primary-700)",
    background: "var(--primary-soft)",
  },
  ghost: {
    color: "var(--ink-2)",
    background: "transparent",
    border: "1px solid var(--hairline)",
  },
  dark: { color: "#fff", background: "var(--ink)" },
};

export function Button({
  children,
  onClick,
  variant = "primary",
  size = "lg",
  icon,
  iconRight,
  full,
  style,
  disabled,
}: ButtonProps) {
  const [press, setPress] = useState(false);
  const iconSize = size === "sm" ? 16 : 18;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onPointerDown={() => setPress(true)}
      onPointerUp={() => setPress(false)}
      onPointerLeave={() => setPress(false)}
      className="inline-flex items-center justify-center gap-2 rounded-[13px] font-semibold tracking-[-0.01em] transition-[transform,box-shadow,background] duration-200 ease-out"
      style={{
        width: full ? "100%" : undefined,
        fontSize: size === "sm" ? 13.5 : 15,
        padding: size === "sm" ? "9px 14px" : "14px 18px",
        opacity: disabled ? 0.5 : 1,
        transform: press ? "scale(0.978)" : "scale(1)",
        ...variants[variant],
        ...style,
      }}
    >
      {icon && <Icon name={icon} size={iconSize} />}
      {children}
      {iconRight && <Icon name={iconRight} size={iconSize} />}
    </button>
  );
}
