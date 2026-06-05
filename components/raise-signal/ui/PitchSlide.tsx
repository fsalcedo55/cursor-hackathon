import type { GeneratedDeckSlide, RaiseSignalAnalysis } from "../types";

type PitchSlideProps = {
  slide: GeneratedDeckSlide;
  analysis: RaiseSignalAnalysis;
  totalSlides: number;
  compact?: boolean;
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function headlineParts(headline: string) {
  const [lead, ...rest] = headline.split(":");
  return {
    lead: lead.trim(),
    detail: rest.join(":").trim(),
  };
}

export function PitchSlide({ slide, analysis, totalSlides, compact }: PitchSlideProps) {
  const company = analysis.company;
  const facts = slide.sourceFacts.slice(0, compact ? 2 : 4);
  const parts = headlineParts(slide.headline);
  const progress = Math.round((slide.n / totalSlides) * 100);

  return (
    <div
      className="relative aspect-video w-full overflow-hidden rounded-[18px] border border-white/60 bg-[#0F172A] text-white shadow-[0_18px_60px_-28px_rgba(15,23,42,0.75)]"
      style={{
        background:
          "radial-gradient(circle at 18% 16%, rgba(109,92,240,0.52), transparent 28%), radial-gradient(circle at 86% 10%, rgba(41,191,206,0.34), transparent 28%), radial-gradient(circle at 78% 92%, rgba(248,250,252,0.18), transparent 32%), linear-gradient(135deg, #0B1120 0%, #111827 48%, #18213A 100%)",
      }}
    >
      <div className="absolute top-[8%] right-[8%] h-[34%] w-[34%] rounded-full border border-white/30 opacity-40" />
      <div className="absolute right-[13%] bottom-[12%] h-[28%] w-[28%] rounded-full bg-white/30 blur-3xl" />
      <div className="relative z-10 flex h-full flex-col p-[6%]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-white text-[12px] font-black tracking-[-0.03em] text-[#3140CE] shadow-sm">
              {company.initials || initials(company.name)}
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/60">
                {company.name}
              </div>
              <div className="text-[11px] font-semibold text-white/85">
                {company.stage} · {analysis.plan.round}
              </div>
            </div>
          </div>
          <div className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold text-white/85 backdrop-blur">
            {String(slide.n).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
          </div>
        </div>

        <div className="mt-auto grid flex-1 grid-cols-[minmax(0,1.08fr)_minmax(170px,0.58fr)] items-end gap-[5%]">
          <div className="pb-[2%]">
            <div className="mb-3 inline-flex rounded-full bg-white/12 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#B8C2FF]">
              {slide.t}
            </div>
            <h2
              className="m-0 max-w-[760px] font-black tracking-[-0.055em] text-white"
              style={{
                fontSize: compact ? "clamp(18px, 4.6vw, 34px)" : "clamp(32px, 5.2vw, 64px)",
                lineHeight: 0.95,
              }}
            >
              {parts.lead}
            </h2>
            {parts.detail && (
              <p
                className="mt-3 mb-0 max-w-[620px] font-semibold leading-[1.25] text-white/78"
                style={{ fontSize: compact ? 12 : 18 }}
              >
                {parts.detail}
              </p>
            )}
          </div>

          <div className="rounded-[18px] border border-white/70 bg-white/86 p-[5%] text-[#111827] shadow-[0_18px_46px_-32px_rgba(15,23,42,0.9)] backdrop-blur">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6D5CF0]">
                Key proof
              </span>
              <span className="rounded-full bg-[#EEF2FF] px-2 py-0.5 text-[10px] font-black text-[#3140CE]">
                {progress}%
              </span>
            </div>
            <div className="grid gap-2">
              {facts.map((fact) => (
                <div
                  key={fact}
                  className="rounded-[12px] border border-[#DCE2F2] bg-white px-3 py-2 text-[11px] font-bold leading-[1.25] text-[#1F2937]"
                >
                  {fact}
                </div>
              ))}
              {facts.length === 0 && (
                <div className="rounded-[12px] border border-[#DCE2F2] bg-white px-3 py-2 text-[11px] font-bold leading-[1.25] text-[#1F2937]">
                  Investor-ready narrative from the latest analysis.
                </div>
              )}
            </div>
          </div>
        </div>

        {!compact && (
          <div className="mt-5 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/12">
              <div
                className="h-full rounded-full bg-white"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="max-w-[46%] text-right text-[12px] font-semibold leading-[1.3] text-white/64">
              {slide.speakerNotes}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
