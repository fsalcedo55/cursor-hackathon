import { Icon } from "../icons/Icon";
import { Logomark } from "../icons/Logomark";
import type { TabId } from "../types";
import { NAV_ITEMS } from "./nav-items";

type TopNavProps = {
  active: TabId;
  onNav: (id: TabId) => void;
};

export function TopNav({ active, onNav }: TopNavProps) {
  return (
    <header className="sticky top-0 z-40 hidden border-b border-[var(--hairline)] bg-[var(--bg)]/88 px-6 py-4 backdrop-blur-xl lg:block">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <Logomark size={32} />
          <span className="text-lg font-bold tracking-[-0.02em] text-[var(--ink)]">
            RaiseSignal
          </span>
        </div>

        <nav className="flex items-center gap-1 rounded-full border border-[var(--hairline)] bg-white/75 p-1 shadow-[var(--shadow-sm)]">
          {NAV_ITEMS.map((it) => {
            const on = active === it.id;

            return (
              <button
                key={it.id}
                type="button"
                onClick={() => onNav(it.id)}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors duration-200"
                style={{
                  color: on ? "var(--ink)" : "var(--ink-2)",
                  background: on ? "var(--primary-soft)" : "transparent",
                  fontWeight: on ? 650 : 500,
                }}
              >
                <Icon name={it.icon} size={18} />
                {it.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
