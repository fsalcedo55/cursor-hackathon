import type { CSSProperties } from "react";

import { iconPaths, type IconName } from "./icon-paths";

export type { IconName };

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  style?: CSSProperties;
};

export function Icon({ name, size = 22, color, style }: IconProps) {
  const child = iconPaths[name];
  if (!child) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{
        color: color || "currentColor",
        display: "block",
        flexShrink: 0,
        ...style,
      }}
    >
      {child}
    </svg>
  );
}
