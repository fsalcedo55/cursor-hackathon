import type { ReactNode } from "react";

import { Icon } from "../icons/Icon";
import { Logomark } from "../icons/Logomark";
import { headerTop, pageX } from "./layout-tokens";

type AppHeaderProps = {
  title: string;
  back?: boolean;
  onBack?: () => void;
  right?: ReactNode;
  brand?: boolean;
  sub?: string;
};

export function AppHeader({
  title,
  back,
  onBack,
  right,
  brand,
  sub,
}: AppHeaderProps) {
  return (
    <div
      className={`sticky top-0 z-30 ${pageX} ${headerTop} pb-3 backdrop-blur-[6px]`}
      style={{
        background:
          "linear-gradient(180deg, rgba(248,241,229,0.96) 72%, rgba(248,241,229,0))",
      }}
    >
      <div className="flex min-h-10 items-center gap-2.5">
        {back && (
          <button
            type="button"
            onClick={onBack}
            className="-ml-0.5 flex h-[38px] w-[38px] items-center justify-center rounded-xl border border-[var(--hairline)] bg-white/85 text-[var(--ink)] shadow-[var(--shadow-sm)]"
          >
            <Icon name="back" size={20} />
          </button>
        )}
        {brand && <Logomark size={32} />}
        <div className="min-w-0 flex-1">
          <div
            className="truncate font-bold tracking-[-0.02em] text-[var(--ink)]"
            style={{
              fontSize: brand ? 18 : 19,
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>
          {sub && (
            <div className="mt-0.5 text-[12.5px] text-[var(--ink-3)]">{sub}</div>
          )}
        </div>
        {right}
      </div>
    </div>
  );
}
