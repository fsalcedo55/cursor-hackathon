import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
  wide?: boolean;
};

export function AppShell({ children, wide }: AppShellProps) {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-[var(--bg)]">
      <div
        className={
          wide
            ? "mx-auto flex min-h-dvh w-full max-w-6xl flex-1 min-h-0"
            : "mx-auto flex min-h-dvh w-full max-w-[440px] flex-1 min-h-0 sm:max-w-[480px] lg:max-w-5xl"
        }
      >
        <div className="relative flex min-h-0 w-full min-w-0 flex-1 flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}
