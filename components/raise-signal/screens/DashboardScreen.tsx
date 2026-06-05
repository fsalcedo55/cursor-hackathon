"use client";

import { useMemo, useState } from "react";

import { ProgressBar } from "../charts/ProgressBar";
import { ScoreRing } from "../charts/ScoreRing";
import { Icon } from "../icons/Icon";
import { AppHeader } from "../layout/AppHeader";
import { IconButton } from "../layout/IconButton";
import { bodyPad, ScreenScroll } from "../layout/ScreenScroll";
import { buildDeckSlides } from "../lib/deck-generation";
import { exportDeckPdf } from "../lib/deck-pdf";
import { mergeDataRoomItems, mergeDeckSlides } from "../lib/deck-outline";
import { scoreColor } from "../lib/score";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { CardTitle } from "../ui/CardTitle";
import { DeckSlideshow } from "../ui/DeckSlideshow";
import { Divider } from "../ui/Divider";
import { Eyebrow } from "../ui/Eyebrow";
import { NavCard } from "../ui/NavCard";
import { SlideTile } from "../ui/SlideTile";
import { StatusPill, type StatusType } from "../ui/StatusPill";
import type {
  DeckGeneration,
  GoFn,
  RaiseSignalAnalysis,
} from "../types";

type DashboardScreenProps = {
  go: GoFn;
  analysis: RaiseSignalAnalysis;
  onAnalysisChange: (analysis: RaiseSignalAnalysis) => void;
  deckGeneration: DeckGeneration;
};

const legendColors: Record<string, { color: string; bg: string }> = {
  Strong: { color: "var(--success)", bg: "var(--success-soft)" },
  Good: { color: "var(--primary-700)", bg: "var(--primary-soft)" },
  "Needs work": { color: "var(--warning)", bg: "var(--warning-soft)" },
  Missing: { color: "var(--danger)", bg: "var(--danger-soft)" },
};

function isUnknown(value: string) {
  return !value.trim() || value.trim().toLowerCase() === "unknown";
}

function EditableValue({
  label,
  value,
  placeholder,
  onCommit,
}: {
  label: string;
  value: string;
  placeholder: string;
  onCommit: (value: string) => void;
}) {
  return (
    <div>
      <div className="mb-0.5 text-[11.5px] font-[550] text-[var(--ink-3)]">
        {label}
      </div>
      <input
        aria-label={label}
        defaultValue={isUnknown(value) ? "" : value}
        placeholder={placeholder}
        onBlur={(event) => {
          const next = event.currentTarget.value.trim();
          if (next && next !== value) onCommit(next);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.currentTarget.blur();
          }
        }}
        className="w-full rounded-[10px] border border-[var(--hairline)] bg-[var(--bg)] px-2.5 py-2 text-sm font-semibold text-[var(--ink)] outline-none placeholder:text-[var(--ink-4)] focus:border-[var(--primary)] focus:bg-white"
      />
    </div>
  );
}

export function DashboardScreen({
  go,
  analysis,
  onAnalysisChange,
  deckGeneration,
}: DashboardScreenProps) {
  const [slideshowIndex, setSlideshowIndex] = useState<number | null>(null);
  const [downloading, setDownloading] = useState(false);
  const { company } = analysis;
  const deckSlides = mergeDeckSlides(analysis.deck.slides);
  const slideDrafts = useMemo(() => buildDeckSlides(analysis), [analysis]);
  const dataRoomItems = mergeDataRoomItems(analysis.deck.dataRoom);
  const totalSlides = slideDrafts.length;
  const generatedSlideCount = deckGeneration.slides.length;
  const deckGenerationProgress = Math.round((generatedSlideCount / totalSlides) * 100);
  const activeGeneratedSlide =
    deckGeneration.slides[deckGeneration.slides.length - 1] ||
    slideDrafts.find((slide) => slide.n === deckGeneration.activeSlideNumber);
  const deckCounts = deckSlides.reduce(
    (acc, slide) => {
      acc[slide.s] = (acc[slide.s] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  const criticalMetricCompleted = analysis.revenueMetrics.some(
    (metric) =>
      metric.label.toLowerCase() === analysis.criticalMetric.label.toLowerCase() &&
      !metric.missing &&
      !isUnknown(metric.value),
  );
  const localInvestorCount = analysis.investors.filter(
    (investor) => investor.geography === "Local",
  ).length;
  const outreachDraftCount = analysis.investors.filter(
    (investor) => investor.outreachDraft,
  ).length;

  function updateCompanyField(field: keyof typeof company, value: string) {
    onAnalysisChange({
      ...analysis,
      company: {
        ...analysis.company,
        [field]: value,
      },
    });
  }

  function updateRevenueMetric(index: number, value: string) {
    onAnalysisChange({
      ...analysis,
      revenueMetrics: analysis.revenueMetrics.map((metric, metricIndex) =>
        metricIndex === index
          ? { ...metric, value, missing: false, warning: false }
          : metric,
      ),
    });
  }

  async function downloadDeck() {
    setDownloading(true);
    try {
      await exportDeckPdf(analysis, slideDrafts);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <ScreenScroll>
      <AppHeader
        title="Dashboard"
        right={<IconButton name="bell" badge />}
      />

      <div className={`${bodyPad} lg:grid lg:grid-cols-12 lg:gap-4`}>
        <Card
          className="rise lg:col-span-7"
          pad={20}
          style={{
            background:
              "linear-gradient(160deg, rgba(255,255,255,0.94) 0%, var(--primary-tint) 100%)",
            overflow: "hidden",
          }}
        >
          <div className="mb-1.5 flex items-start justify-between">
            <div>
              <Eyebrow>Fundraising Readiness Score</Eyebrow>
              <div className="mt-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--success-soft)] px-2.5 py-1 text-xs font-[650] text-[var(--success)]">
                  <Icon name="checkCircle" size={14} />
                  {analysis.readinessLabel}
                </span>
              </div>
            </div>
            <ScoreRing value={analysis.score} size={104} stroke={11} />
          </div>
          <p className="my-3.5 text-sm leading-[1.45] text-[var(--ink-2)]">
            {analysis.scoreSummary}
          </p>
          <div className="flex gap-2">
            <Button size="sm" full icon="bolt" onClick={() => go("improve")}>
              Prioritize fixes
            </Button>
            <Button
              size="sm"
              full
              variant="secondary"
              icon="flag"
              onClick={() => go("plan")}
            >
              Review raise plan
            </Button>
          </div>
        </Card>

        <Card className="rise mt-3.5 lg:col-span-5 lg:mt-0" style={{ animationDelay: ".04s" }}>
          <CardTitle icon="sliders">Score breakdown</CardTitle>
          <div className="flex flex-col gap-3.5">
            {analysis.breakdown.map((b, i) => (
              <div key={b.label}>
                <div className="mb-1.5 flex items-baseline justify-between">
                  <span className="text-[13.5px] font-[550] text-[var(--ink)]">
                    {b.label}
                  </span>
                  <span
                    className="num text-sm font-semibold"
                    style={{ color: scoreColor(b.v) }}
                  >
                    {b.v}
                  </span>
                </div>
                <ProgressBar value={b.v} delay={i * 90} />
                {b.reason && (
                  <p className="mt-1.5 mb-0 text-[12px] leading-[1.35] text-[var(--ink-3)]">
                    {b.reason}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card className="rise mt-3.5 lg:col-span-5 lg:col-start-8 lg:row-start-2" style={{ animationDelay: ".08s" }}>
          <CardTitle
            icon="alert"
            iconColor="var(--warning)"
            right={
              <span className="rounded-full bg-[var(--warning-soft)] px-2 py-0.5 text-xs font-[650] text-[var(--warning)]">
                {analysis.issues.length}
              </span>
            }
          >
            Top issues before fundraising
          </CardTitle>
          <div>
            {analysis.issues.map((t, i) => (
              <div
                key={t}
                onClick={() => go("improve")}
                className="flex cursor-pointer items-center gap-2.5 py-2.5"
                style={{
                  borderBottom:
                    i === analysis.issues.length - 1
                      ? "none"
                      : "1px solid var(--hairline-2)",
                }}
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--warning)]" />
                <span className="flex-1 text-[13.5px] font-medium text-[var(--ink)]">
                  {t}
                </span>
                <Icon name="chevR" size={16} color="var(--ink-4)" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="rise mt-3.5 lg:col-span-7 lg:col-start-1 lg:row-start-2" style={{ animationDelay: ".12s" }}>
          <div className="mb-3.5 flex items-center gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] text-[19px] font-bold text-white"
              style={{
                background: "linear-gradient(145deg, var(--agent), var(--ink))",
                boxShadow: "0 6px 16px -8px rgba(24,24,27,0.55)",
              }}
            >
              {company.initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-base font-bold tracking-[-0.01em] text-[var(--ink)]">
                {company.name}
              </div>
              <div className="text-[12.5px] text-[var(--ink-3)]">
                {company.category} · {company.stage}
              </div>
            </div>
            <span className="rounded-full bg-[var(--success-soft)] px-2.5 py-1 text-[11.5px] font-semibold text-[var(--success)]">
              {company.status}
            </span>
          </div>
          <div className="mb-3.5 grid grid-cols-2 gap-x-[18px] gap-y-[13px]">
            <EditableValue
              label="Business model"
              value={company.businessModel}
              placeholder="Add model"
              onCommit={(value) => updateCompanyField("businessModel", value)}
            />
            <EditableValue
              label="Main market"
              value={company.mainMarket}
              placeholder="Add market"
              onCommit={(value) => updateCompanyField("mainMarket", value)}
            />
            <EditableValue
              label="Team size"
              value={company.teamSize}
              placeholder="Add team size"
              onCommit={(value) => updateCompanyField("teamSize", value)}
            />
            <EditableValue
              label="Traction"
              value={company.tractionSignal}
              placeholder="Add traction"
              onCommit={(value) => updateCompanyField("tractionSignal", value)}
            />
            <EditableValue
              label="Funding signal"
              value={company.fundingSignal}
              placeholder="Add funding"
              onCommit={(value) => updateCompanyField("fundingSignal", value)}
            />
            <EditableValue
              label="Company size"
              value={company.sizeSignal}
              placeholder="Add size signal"
              onCommit={(value) => updateCompanyField("sizeSignal", value)}
            />
          </div>
          <div
            className="rounded-[13px] border-l-[3px] border-[var(--primary-700)] bg-[var(--primary-tint)] px-3.5 py-3"
          >
            <p className="m-0 text-[13.5px] leading-normal text-[var(--ink-2)] italic">
              &ldquo;{company.summary}&rdquo;
            </p>
          </div>
        </Card>

        <Card className="rise mt-3.5 lg:col-span-12" style={{ animationDelay: ".16s" }}>
          <CardTitle
            icon="coins"
            right={<span className="text-xs text-[var(--ink-3)]">via OpenAI</span>}
          >
            Revenue metrics
          </CardTitle>
          <div className="grid grid-cols-2 gap-x-3 gap-y-[18px] sm:grid-cols-3 lg:grid-cols-6">
            {analysis.revenueMetrics.map((metric, index) => (
              <EditableValue
                key={metric.label}
                label={metric.label}
                value={metric.value}
                placeholder={`Add ${metric.label}`}
                onCommit={(value) => updateRevenueMetric(index, value)}
              />
            ))}
          </div>
          {!criticalMetricCompleted && (
            <>
              <Divider m={15} />
              <div className="flex items-center justify-between">
                <EditableValue
                  label={analysis.criticalMetric.label}
                  value="Unknown"
                  placeholder={`Add ${analysis.criticalMetric.label}`}
                  onCommit={(value) => {
                    onAnalysisChange({
                      ...analysis,
                      revenueMetrics: [
                        ...analysis.revenueMetrics,
                        {
                          label: analysis.criticalMetric.label,
                          value,
                        },
                      ],
                    });
                  }}
                />
                <span className="rounded-full bg-[var(--danger-soft)] px-2.5 py-1 text-[11.5px] font-semibold text-[var(--danger)]">
                  Missing
                </span>
              </div>
              <div className="mt-3.5 flex gap-2.5 rounded-[13px] bg-[var(--warning-soft)] px-3 py-3">
                <Icon
                  name="alert"
                  size={18}
                  color="var(--warning)"
                  style={{ marginTop: 1, flexShrink: 0 }}
                />
                <div className="text-[12.5px] leading-[1.45] text-[#7A5407]">
                  <strong className="text-[#5E4106]">Missing critical metric.</strong>{" "}
                  {analysis.criticalMetric.message}
                </div>
              </div>
            </>
          )}
        </Card>

        <Card className="rise mt-3.5 lg:col-span-12" style={{ animationDelay: ".2s" }}>
          <CardTitle
            icon="layers"
            right={
              <span className="num text-xs font-semibold text-[var(--ink-3)]">
                {analysis.deck.readiness}% ready
              </span>
            }
          >
            Deck & Data Room
          </CardTitle>
          <div className="mb-4 flex flex-wrap gap-1.5">
            {(["Strong", "Good", "Needs work", "Missing"] as StatusType[])
              .filter((status) => deckCounts[status])
              .map((status) => (
                <span
                  key={status}
                  className="num inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-semibold"
                  style={{
                    color: legendColors[status].color,
                    background: legendColors[status].bg,
                  }}
                >
                  {deckCounts[status]}
                  {status}
                </span>
              ))}
          </div>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {slideDrafts.map((slide, index) => {
                const outline = deckSlides.find((item) => item.n === slide.n);

                return (
                  <SlideTile
                    key={slide.n}
                    n={slide.n}
                    t={slide.t}
                    s={outline?.s || "Good"}
                    headline={slide.headline}
                    onClick={() => setSlideshowIndex(index)}
                  />
                );
              })}
            </div>
            <div>
              <ProgressBar
                value={
                  deckGeneration.status === "idle"
                    ? analysis.deck.readiness
                    : deckGenerationProgress
                }
                color={deckGeneration.status === "complete" ? "var(--success)" : "var(--warning)"}
                height={8}
              />
              <div className="mt-3 rounded-[13px] bg-[var(--bg)] px-3.5 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[13.5px] font-[650] text-[var(--ink)]">
                      {deckGeneration.status === "generating"
                        ? `Generating slide ${deckGeneration.activeSlideNumber || 1}`
                        : deckGeneration.status === "complete"
                          ? "Deck ready"
                          : "Investor deck PDF"}
                    </div>
                    <p className="mt-1 mb-0 text-[12.5px] leading-[1.35] text-[var(--ink-3)]">
                      {deckGeneration.status === "idle"
                        ? "Open any slide instantly or download the full deck as a PDF."
                        : `${generatedSlideCount}/${totalSlides} slides ready${
                            activeGeneratedSlide ? ` · ${activeGeneratedSlide.t}` : ""
                          }`}
                    </p>
                  </div>
                  <span className="num shrink-0 text-sm font-semibold text-[var(--ink-2)]">
                    {deckGeneration.status === "idle"
                      ? `${analysis.deck.readiness}%`
                      : `${deckGenerationProgress}%`}
                  </span>
                </div>
                <Button
                  full
                  size="sm"
                  icon="doc"
                  onClick={downloadDeck}
                  disabled={downloading}
                  style={{ marginTop: 12 }}
                >
                  {downloading ? "Preparing PDF..." : "Download deck PDF"}
                </Button>
              </div>
              <div className="mt-1.5">
                {dataRoomItems.map((item, index) => (
                  <div
                    key={item.t}
                    className="flex items-center gap-2.5 py-3"
                    style={{
                      borderBottom:
                        index === dataRoomItems.length - 1
                          ? "none"
                          : "1px solid var(--hairline-2)",
                    }}
                  >
                    <span className="flex-1 text-[13.5px] font-medium text-[var(--ink)]">
                      {item.t}
                    </span>
                    <StatusPill status={item.s} dot={false} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-3.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:col-span-12">
          <NavCard
            icon="flag"
            title="Fundraising Plan"
            sub={analysis.plan.raiseAmount}
            onClick={() => go("plan")}
          />
          <NavCard
            icon="investors"
            title="Investor Pipeline"
            sub={`${localInvestorCount} local targets · ${outreachDraftCount} drafts ready`}
            onClick={() => go("investors")}
          />
        </div>
      </div>
      {slideshowIndex !== null && (
        <DeckSlideshow
          slides={slideDrafts}
          initialIndex={slideshowIndex}
          analysis={analysis}
          onClose={() => setSlideshowIndex(null)}
        />
      )}
    </ScreenScroll>
  );
}
