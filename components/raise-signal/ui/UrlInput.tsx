"use client";

import { Icon } from "../icons/Icon";

type UrlInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
};

export function UrlInput({ value, onChange, onSubmit, placeholder }: UrlInputProps) {
  return (
    <div className="mb-3.5 flex items-center gap-2 rounded-[13px] border border-[var(--hairline)] bg-[var(--bg)] px-3.5 py-3">
      <Icon name="globe" size={19} color="var(--ink-4)" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onSubmit?.();
          }
        }}
        placeholder={placeholder}
        className="min-w-0 flex-1 border-none bg-transparent text-[15px] tracking-[-0.01em] text-[var(--ink)] outline-none"
        style={{ fontFamily: "var(--mono)" }}
      />
    </div>
  );
}
