"use client";

import { useEffect, useState } from "react";

import { scoreColor } from "../lib/score";

type ProgressBarProps = {
  value: number;
  max?: number;
  color?: string;
  track?: string;
  height?: number;
  reveal?: boolean;
  delay?: number;
};

export function ProgressBar({
  value,
  max = 100,
  color,
  track = "var(--hairline)",
  height = 7,
  reveal = true,
  delay = 0,
}: ProgressBarProps) {
  const [w, setW] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => setW((value / max) * 100), 60 + delay);
    return () => clearTimeout(id);
  }, [value, max, delay]);

  const width = reveal ? w : (value / max) * 100;

  return (
    <div
      className="w-full overflow-hidden rounded-full"
      style={{ height, background: track }}
    >
      <div
        className="h-full rounded-full transition-[width] duration-1000 ease-[cubic-bezier(0.22,0.61,0.36,1)]"
        style={{
          width: `${width}%`,
          background: color || scoreColor(value),
        }}
      />
    </div>
  );
}
