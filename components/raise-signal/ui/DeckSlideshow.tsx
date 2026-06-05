"use client";

import { useCallback, useEffect, useState } from "react";

import { Icon } from "../icons/Icon";
import type { GeneratedDeckSlide, RaiseSignalAnalysis } from "../types";
import { PitchSlide } from "./PitchSlide";

type DeckSlideshowProps = {
  slides: GeneratedDeckSlide[];
  initialIndex: number;
  analysis: RaiseSignalAnalysis;
  onClose: () => void;
};

export function DeckSlideshow({
  slides,
  initialIndex,
  analysis,
  onClose,
}: DeckSlideshowProps) {
  const [index, setIndex] = useState(initialIndex);
  const slide = slides[index];

  const go = useCallback((delta: number) => {
    setIndex((current) => {
      const next = current + delta;
      if (next < 0) return slides.length - 1;
      if (next >= slides.length) return 0;
      return next;
    });
  }, [slides.length]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") go(-1);
      if (event.key === "ArrowRight") go(1);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [go, onClose]);

  if (!slide) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050816]/88 p-4 backdrop-blur-md">
      <button
        type="button"
        aria-label="Close slideshow"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <button
        type="button"
        onClick={onClose}
        aria-label="Close slideshow"
        className="absolute top-4 right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/35 bg-white/18 text-xl font-black leading-none text-white shadow-[0_12px_36px_-18px_rgba(0,0,0,0.8)] backdrop-blur transition-colors hover:bg-white/28"
      >
        X
      </button>
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Previous slide"
        className="absolute top-1/2 left-3 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-white/18 text-white shadow-[0_12px_36px_-18px_rgba(0,0,0,0.8)] backdrop-blur transition-colors hover:bg-white/28 sm:left-6 sm:h-14 sm:w-14"
      >
        <Icon name="back" size={28} />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Next slide"
        className="absolute top-1/2 right-3 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-white/18 text-white shadow-[0_12px_36px_-18px_rgba(0,0,0,0.8)] backdrop-blur transition-colors hover:bg-white/28 sm:right-6 sm:h-14 sm:w-14"
      >
        <Icon name="chevR" size={28} />
      </button>
      <div className="relative z-10 w-full max-w-6xl">
        <div className="mb-3 flex items-center justify-between gap-3 text-white">
          <div>
            <div className="text-[12px] font-bold uppercase tracking-[0.22em] text-white/50">
              Investor Deck
            </div>
            <div className="text-lg font-bold tracking-[-0.02em]">
              {slide.t}
            </div>
          </div>
          <div className="rounded-full bg-white/10 px-3 py-1 text-sm font-bold text-white/70">
            {index + 1} of {slides.length}
          </div>
        </div>

        <PitchSlide
          slide={slide}
          analysis={analysis}
          totalSlides={slides.length}
        />
      </div>
    </div>
  );
}
