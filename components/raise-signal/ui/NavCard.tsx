import { Icon, type IconName } from "../icons/Icon";

type NavCardProps = {
  icon: IconName;
  title: string;
  sub: string;
  onClick?: () => void;
};

export function NavCard({ icon, title, sub, onClick }: NavCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col gap-2.5 rounded-[var(--r-card)] border border-[var(--hairline)] bg-[var(--card)] p-[15px] text-left shadow-[var(--shadow-md)]"
    >
      <div className="flex items-center justify-between">
        <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-[var(--primary-soft)] text-[var(--primary)]">
          <Icon name={icon} size={18} />
        </div>
        <Icon name="arrowUpRight" size={18} color="var(--ink-4)" />
      </div>
      <div>
        <div className="text-sm font-[650] tracking-[-0.01em] text-[var(--ink)]">
          {title}
        </div>
        <div className="mt-0.5 text-xs text-[var(--ink-3)]">{sub}</div>
      </div>
    </button>
  );
}
