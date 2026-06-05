import type { ReactNode } from "react";

const scrollClass =
  "rs-scroll min-h-0 w-full flex-1 overflow-x-hidden overflow-y-auto";

type ScreenScrollProps = {
  children: ReactNode;
};

export function ScreenScroll({ children }: ScreenScrollProps) {
  return (
    <div className={scrollClass} style={{ WebkitOverflowScrolling: "touch" }}>
      {children}
    </div>
  );
}

export { bodyPad, pageX, headerTop, brandBar } from "./layout-tokens";
