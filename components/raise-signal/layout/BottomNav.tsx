import { Icon } from "../icons/Icon";
import type { TabId } from "../types";
import { NAV_ITEMS } from "./nav-items";

export type { TabId };

type BottomNavProps = {
  active: TabId;
  onNav: (id: TabId) => void;
};

export function BottomNav({ active, onNav }: BottomNavProps) {
  return (
    <div
      className="lg:hidden flex shrink-0 items-center justify-around border-t border-[var(--hairline)] px-3.5 pt-2 pb-[max(22px,env(safe-area-inset-bottom))] backdrop-blur-[20px] backdrop-saturate-[180%]"
      style={{ background: "rgba(255,255,255,0.76)" }}
    >
      {NAV_ITEMS.map((it) => {
        const on = active === it.id;
        return (
          <button
            key={it.id}
            type="button"
            onClick={() => onNav(it.id)}
            className="flex flex-1 flex-col items-center gap-1 py-1 transition-colors duration-200"
            style={{ color: on ? "var(--primary-700)" : "var(--ink-4)" }}
          >
            <Icon name={it.icon} size={24} />
            <span
              className="text-[10.5px] tracking-[0.01em]"
              style={{ fontWeight: on ? 650 : 500 }}
            >
              {it.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
