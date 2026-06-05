import { Icon } from "../icons/Icon";
import { Logomark } from "../icons/Logomark";
import type { TabId } from "../types";
import { NAV_ITEMS } from "./nav-items";

type SideNavProps = {
  active: TabId;
  onNav: (id: TabId) => void;
};

export function SideNav({ active, onNav }: SideNavProps) {
  return (
    <aside className="hidden lg:flex lg:w-60 xl:w-64 shrink-0 flex-col border-r border-[var(--hairline)] bg-white/80 px-4 py-6 backdrop-blur-sm">
      <div className="mb-8 flex items-center gap-2.5 px-2">
        <Logomark size={32} />
        <span className="text-lg font-bold tracking-[-0.02em] text-[var(--ink)]">
          RaiseSignal
        </span>
      </div>
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((it) => {
          const on = active === it.id;
          return (
            <button
              key={it.id}
              type="button"
              onClick={() => onNav(it.id)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-200"
              style={{
                color: on ? "var(--ink)" : "var(--ink-2)",
                background: on ? "var(--primary-soft)" : "transparent",
                fontWeight: on ? 650 : 500,
              }}
            >
              <Icon name={it.icon} size={22} />
              <span className="text-sm">{it.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
