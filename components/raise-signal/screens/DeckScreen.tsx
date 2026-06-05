"use client";

import { ProgressBar } from "../charts/ProgressBar";
import { Icon } from "../icons/Icon";
import { AppHeader } from "../layout/AppHeader";
import { bodyPad, ScreenScroll } from "../layout/ScreenScroll";
import { mergeDataRoomItems, mergeDeckSlides } from "../lib/deck-outline";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { CardTitle } from "../ui/CardTitle";
import { SlideTile } from "../ui/SlideTile";
import { StatusPill, type StatusType } from "../ui/StatusPill";
import type { DeckGeneration, GoFn, RaiseSignalAnalysis } from "../types";

type DeckScreenProps = {
  go: GoFn;
  analysis: RaiseSignalAnalysis;
  deckGeneration: DeckGeneration;
  onGenerateDeck: () => void;
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
  onGenerateDeck,
}: DeckScreenProps) {
  const deckSlides = mergeDeckSlides(analysis.deck.slides);
  const dataRoomItems = mergeDataRoomItems(analysis.deck.dataRoom);
  const totalSlides = deckSlides.length;
  const generatedSlideCount = deckGeneration.slides.length;
  const deckGenerationProgress = Math.round((generatedSlideCount / totalSlides) * 100);
  const activeSlide =
    deckGeneration.slides[deckGeneration.slides.length - 1] ||
    deckSlides.find((slide) => slide.n === deckGeneration.activeSlideNumber);
  const counts = deckSlides.reduce(
    (a, s) => {
      a[s.s] = (a[s.s] || 0) + 1;
      return a;
    },
    {} as Record<string, number>,
  );

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
                  ? `${deckSlides.length} slides`
                  : `${generatedSlideCount}/${totalSlides} generated`}
              </span>
            }
          >
            Pitch Deck
          </CardTitle>
          <div className="mb-4 rounded-[14px] border border-[var(--hairline)] bg-[var(--bg)] p-3.5">
            <div className="mb-2.5 flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-[650] text-[var(--ink)]">
                  {deckGeneration.status === "generating"
                    ? `Generating ${activeSlide?.t || "deck"}`
                    : deckGeneration.status === "complete"
                      ? "Investor deck is ready"
                      : "Draft a deck from current data"}
                </div>
                <p className="mt-1 mb-0 text-[12.5px] leading-[1.4] text-[var(--ink-3)]">
                  {deckGeneration.status === "idle"
                    ? "Edits to MRR, company profile, and plan inputs are used when generation starts."
                    : "Slides are drafted one by one from the latest analysis snapshot."}
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
              icon="spark"
              onClick={onGenerateDeck}
              disabled={deckGeneration.status === "generating"}
              style={{ marginTop: 12 }}
            >
              {deckGeneration.status === "complete" ? "Refresh deck draft" : "Draft investor deck"}
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
            {deckSlides.map((sl) => (
              <div key={sl.n} className="relative">
                <SlideTile {...sl} />
                {deckGeneration.status !== "idle" && (
                  <div
                    className="pointer-events-none absolute inset-0 rounded-[13px] border"
                    style={{
                      borderColor: deckGeneration.slides.some((slide) => slide.n === sl.n)
                        ? "var(--success)"
                        : deckGeneration.activeSlideNumber === sl.n
                          ? "var(--warning)"
                          : "transparent",
                      boxShadow:
                        deckGeneration.activeSlideNumber === sl.n
                          ? "0 0 0 3px var(--warning-soft)"
                          : undefined,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          {deckGeneration.slides.length > 0 && (
            <div className="grid gap-2.5">
              {deckGeneration.slides.map((slide) => (
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
    </ScreenScroll>
  );
}
