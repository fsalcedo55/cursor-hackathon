import { Icon, type IconName } from "../icons/Icon";

type IconButtonProps = {
  name: IconName;
  onClick?: () => void;
  badge?: boolean;
  size?: number;
};

export function IconButton({
  name,
  onClick,
  badge,
  size = 38,
}: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex shrink-0 items-center justify-center rounded-xl border border-[var(--hairline)] bg-[var(--card)] text-[var(--ink-2)] shadow-[var(--shadow-sm)]"
      style={{ width: size, height: size }}
    >
      <Icon name={name} size={20} />
      {badge && (
        <span
          className="absolute top-[7px] right-[7px] h-2 w-2 rounded-full border-2 border-[var(--card)] bg-[var(--danger)]"
        />
      )}
    </button>
  );
}
