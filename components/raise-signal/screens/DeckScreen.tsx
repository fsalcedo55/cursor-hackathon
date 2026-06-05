"use client";

import { useMemo, useState } from "react";

import { ProgressBar } from "../charts/ProgressBar";
import { Icon } from "../icons/Icon";
import { AppHeader } from "../layout/AppHeader";
import { bodyPad, ScreenScroll } from "../layout/ScreenScroll";
import { buildDeckSlides } from "../lib/deck-generation";
import { exportDeckPdf } from "../lib/deck-pdf";
import { mergeDataRoomItems, mergeDeckSlides } from "../lib/deck-outline";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { CardTitle } from "../ui/CardTitle";
import { DeckSlideshow } from "../ui/DeckSlideshow";
import { PitchSlide } from "../ui/PitchSlide";
import { SlideTile } from "../ui/SlideTile";
import { StatusPill, type StatusType } from "../ui/StatusPill";
import type {
  DeckGeneration,
  GoFn,
  RaiseSignalAnalysis,
} from "../types";

type DeckScreenProps = {
  go: GoFn;
  analysis: RaiseSignalAnalysis;
  deckGeneration: DeckGeneration;
};

const legendColors: Record<string, { color: string; bg: string }> = {
  Strong: { color: "var(--success)", bg: "var(--success-soft)" },
  Good: { color: "var(--primary-700)", bg: "var(--primary-soft)" },
  "Needs work": { color: "var(--warning)", bg: "var(--warning-soft)" },
  Missing: { color: "var(--danger)", bg: "var(--danger-soft)" },
};

export function DeckScreen({
  go,
  analysis,
  deckGeneration,
}: DeckScreenProps) {
  const [slideshowIndex, setSlideshowIndex] = useState<number | null>(null);
  const [downloading, setDownloading] = useState(false);
  const deckSlides = mergeDeckSlides(analysis.deck.slides);
  const slideDrafts = useMemo(() => buildDeckSlides(analysis), [analysis]);
  const visibleSlides = deckGeneration.slides.length > 0 ? deckGeneration.slides : slideDrafts;
  const dataRoomItems = mergeDataRoomItems(analysis.deck.dataRoom);
  const totalSlides = slideDrafts.length;
  const generatedSlideCount = deckGeneration.slides.length;
  const deckGenerationProgress = Math.round((generatedSlideCount / totalSlides) * 100);
  const counts = deckSlides.reduce(
    (a, s) => {
      a[s.s] = (a[s.s] || 0) + 1;
      return a;
    },
    {} as Record<string, number>,
  );

  function openSlideByNumber(slideNumber: number) {
    const nextIndex = slideDrafts.findIndex((slide) => slide.n === slideNumber);
    setSlideshowIndex(nextIndex === -1 ? 0 : nextIndex);
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
        back
        onBack={() => go("dashboard")}
        title="Deck & Data Room"
      />
      <div className={`${bodyPad} lg:grid lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)] lg:gap-4`}>
        <Card className="rise">
          <CardTitle
            icon="layers"
            right={
              <span className="num text-xs text-[var(--ink-3)]">
                {deckGeneration.status === "idle"
                  ? `${slideDrafts.length} slides`
                  : `${generatedSlideCount}/${totalSlides} ready`}
              </span>
            }
          >
            Pitch Deck
          </CardTitle>
          <div className="mb-4 rounded-[14px] border border-[var(--hairline)] bg-[var(--bg)] p-3.5">
            <div className="mb-2.5 flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-[650] text-[var(--ink)]">
                  {downloading
                    ? "Preparing PDF download"
                    : deckGeneration.status === "generating"
                      ? `Generating slide ${deckGeneration.activeSlideNumber || 1}`
                      : deckGeneration.status === "complete"
                      ? "Investor deck is ready"
                      : "Investor deck preview is ready"}
                </div>
                <p className="mt-1 mb-0 text-[12.5px] leading-[1.4] text-[var(--ink-3)]">
                  Slides are rendered instantly and can be downloaded as a PDF.
                </p>
              </div>
              <span className="num shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-[var(--ink-2)]">
                {deckGeneration.status === "idle" ? "Ready" : `${deckGenerationProgress}%`}
              </span>
            </div>
            {deckGeneration.status !== "idle" && (
              <ProgressBar
                value={deckGenerationProgress}
                color={deckGeneration.status === "complete" ? "var(--success)" : "var(--warning)"}
                height={8}
              />
            )}
            <Button
              full
              icon="doc"
              onClick={downloadDeck}
              disabled={downloading}
              style={{ marginTop: 12 }}
            >
              {downloading ? "Preparing PDF..." : "Download deck PDF"}
            </Button>
          </div>
          <div className="mb-4 flex flex-wrap gap-1.5">
            {(["Strong", "Good", "Needs work", "Missing"] as StatusType[])
              .filter((s) => counts[s])
              .map((s) => (
                <span
                  key={s}
                  className="num inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11.5px] font-semibold"
                  style={{
                    color: legendColors[s].color,
                    background: legendColors[s].bg,
                  }}
                >
                  {counts[s]}
                  {s}
                </span>
              ))}
          </div>
          <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {slideDrafts.map((slide, index) => {
              const outline = deckSlides.find((item) => item.n === slide.n);

              return (
                <div key={slide.n} className="relative">
                  <SlideTile
                    n={slide.n}
                    t={slide.t}
                    s={outline?.s || "Good"}
                    headline={slide.headline}
                    onClick={() => setSlideshowIndex(index)}
                  />
                  {deckGeneration.status !== "idle" && (
                    <div
                      className="pointer-events-none absolute inset-0 rounded-[13px] border"
                      style={{
                        borderColor: deckGeneration.slides.some(
                          (generatedSlide) => generatedSlide.n === slide.n,
                        )
                          ? "var(--success)"
                          : deckGeneration.activeSlideNumber === slide.n
                            ? "var(--warning)"
                            : "transparent",
                        boxShadow:
                          deckGeneration.activeSlideNumber === slide.n
                            ? "0 0 0 3px var(--warning-soft)"
                            : undefined,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
          {visibleSlides.length > 0 && (
            <div className="grid gap-2.5">
              {visibleSlides.map((slide) => (
                <div
                  key={slide.n}
                  className="rounded-[14px] border border-[var(--hairline)] bg-white px-3.5 py-3"
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span className="num text-[11px] font-semibold text-[var(--ink-4)]">
                      {String(slide.n).padStart(2, "0")}
                    </span>
                    <span className="text-[13px] font-[650] text-[var(--ink)]">
                      {slide.t}
                    </span>
                    <Icon name="checkCircle" size={15} color="var(--success)" />
                  </div>
                  <div className="text-sm font-semibold leading-[1.35] text-[var(--ink)]">
                    {slide.headline}
                  </div>
                  <button
                    type="button"
                    onClick={() => openSlideByNumber(slide.n)}
                    className="mt-2 block w-full text-left"
                    aria-label={`Open ${slide.t} in slideshow`}
                  >
                    <PitchSlide
                      slide={slide}
                      analysis={analysis}
                      totalSlides={totalSlides}
                      compact
                    />
                  </button>
                  <p className="mt-1.5 mb-2 text-[12.5px] leading-[1.4] text-[var(--ink-2)]">
                    {slide.speakerNotes}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {slide.sourceFacts.map((fact) => (
                      <span
                        key={fact}
                        className="rounded-full bg-[var(--primary-soft)] px-2 py-0.5 text-[11px] font-semibold text-[var(--primary-700)]"
                      >
                        {fact}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="rise mt-3.5 lg:mt-0" style={{ animationDelay: ".06s" }}>
          <CardTitle
            icon="vault"
            right={
              <span className="num text-[13px] font-[650] text-[var(--warning)]">
                {analysis.deck.readiness}% ready
              </span>
            }
          >
            Data Room Checklist
          </CardTitle>
          <ProgressBar value={analysis.deck.readiness} color="var(--warning)" height={8} />
          <div className="mt-1.5">
            {dataRoomItems.map((d, i) => {
              const done = d.s === "Done";
              const icon = done
                ? "checkCircle"
                : d.s === "Suggested"
                  ? "plusCircle"
                  : "minusCircle";
              const col = done
                ? "var(--success)"
                : d.s === "Suggested"
                  ? "var(--cyan)"
                  : "var(--ink-4)";
              return (
                <div
                  key={d.t}
                  className="flex items-center gap-2.5 py-3"
                  style={{
                    borderBottom:
                      i === dataRoomItems.length - 1
                        ? "none"
                        : "1px solid var(--hairline-2)",
                  }}
                >
                  <Icon name={icon} size={19} color={col} />
                  <span
                    className="flex-1 text-[13.5px] font-medium"
                    style={{ color: done ? "var(--ink)" : "var(--ink-2)" }}
                  >
                    {d.t}
                  </span>
                  <StatusPill status={d.s} dot={false} />
                </div>
              );
            })}
          </div>
        </Card>
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
