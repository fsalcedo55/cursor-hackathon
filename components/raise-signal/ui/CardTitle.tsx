import type { CSSProperties, ReactNode } from "react";

import { Icon, type IconName } from "../icons/Icon";

type CardTitleProps = {
  children: ReactNode;
  icon?: IconName;
  iconColor?: string;
  right?: ReactNode;
  style?: CSSProperties;
};

export function CardTitle({
  children,
  icon,
  iconColor,
  right,
  style,
}: CardTitleProps) {
  return (
    <div
      className="mb-3.5 flex items-center gap-2.5"
      style={style}
    >
      {icon && (
        <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[9px] bg-[var(--primary-soft)] text-[var(--primary)]">
          <Icon name={icon} size={17} color={iconColor} />
        </div>
      )}
      <div className="flex-1 text-[15.5px] font-[650] tracking-[-0.01em] text-[var(--ink)]">
        {children}
      </div>
      {right}
    </div>
  );
}
