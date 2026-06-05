import type { StatusType } from "./StatusPill";

const statusColor: Record<StatusType, string> = {
  Strong: "var(--success)",
  Good: "var(--primary)",
  "Needs work": "var(--warning)",
  Missing: "var(--danger)",
  Done: "var(--success)",
  Suggested: "var(--cyan)",
};

type SlideTileProps = {
  n: number;
  t: string;
  s: StatusType;
  headline?: string;
  onClick?: () => void;
};

export function SlideTile({
  n,
  t,
  s,
  headline,
  onClick,
}: SlideTileProps) {
  const c = statusColor[s];
  const Root = onClick ? "button" : "div";

  return (
    <Root
      type={onClick ? "button" : undefined}
      onClick={onClick}
      aria-label={onClick ? `Open ${t} slide` : undefined}
      className="relative flex min-h-[112px] w-full flex-col gap-2 overflow-hidden rounded-[13px] border border-[var(--hairline)] bg-[#111827] px-3 py-2.5 text-left text-white shadow-[var(--shadow-sm)] transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
      style={{
        borderColor: "rgba(255,255,255,0.5)",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(109,92,240,0.58),transparent_34%),radial-gradient(circle_at_88%_10%,rgba(41,191,206,0.34),transparent_30%),radial-gradient(circle_at_80%_92%,rgba(248,250,252,0.18),transparent_34%),linear-gradient(135deg,#0B1120_0%,#101827_48%,#172033_100%)]" />
      <div className="absolute right-3 bottom-3 h-10 w-10 rounded-full bg-white/35 blur-xl" />
      <div className="flex items-center justify-between">
        <span className="num relative text-[11px] font-bold text-white/65">
          {String(n).padStart(2, "0")}
        </span>
        <span
          className="relative h-[7px] w-[7px] rounded-full ring-2 ring-white/30"
          style={{ background: c }}
        />
      </div>
      <div className="relative text-[13px] font-bold tracking-[-0.02em] text-white">
        {t}
      </div>
      <span className="relative line-clamp-2 text-[10.5px] font-semibold leading-[1.3] text-white/68">
        {headline || "Investor-ready slide"}
      </span>
      <span className="relative mt-auto text-[11px] font-bold text-white/85">
        Open slideshow
      </span>
    </Root>
  );
}
