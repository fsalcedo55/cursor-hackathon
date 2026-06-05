import type { DataRoomItem, DeckSlide } from "../types";

export const DEFAULT_DECK_SLIDES: DeckSlide[] = [
  { n: 1, t: "Cover", s: "Strong" },
  { n: 2, t: "Problem", s: "Good" },
  { n: 3, t: "Solution", s: "Good" },
  { n: 4, t: "Market", s: "Needs work" },
  { n: 5, t: "Product", s: "Good" },
  { n: 6, t: "Traction", s: "Needs work" },
  { n: 7, t: "Business Model", s: "Good" },
  { n: 8, t: "Competition", s: "Needs work" },
  { n: 9, t: "Go-to-market", s: "Needs work" },
  { n: 10, t: "Financials", s: "Needs work" },
  { n: 11, t: "The Ask", s: "Good" },
  { n: 12, t: "Team", s: "Good" },
];

export const DEFAULT_DATA_ROOM_ITEMS: DataRoomItem[] = [
  { t: "Company overview", s: "Done" },
  { t: "Metrics summary", s: "Done" },
  { t: "Cap table", s: "Missing" },
  { t: "Financial model", s: "Missing" },
  { t: "Legal docs", s: "Missing" },
  { t: "Product screenshots", s: "Suggested" },
  { t: "Investor FAQ", s: "Suggested" },
];

export function mergeDeckSlides(slides: DeckSlide[]) {
  const byTitle = new Map(slides.map((slide) => [slide.t.toLowerCase(), slide]));
  const byNumber = new Map(slides.map((slide) => [slide.n, slide]));

  return DEFAULT_DECK_SLIDES.map((fallback) => {
    const existing = byTitle.get(fallback.t.toLowerCase()) || byNumber.get(fallback.n);

    return {
      ...fallback,
      s: existing?.s || fallback.s,
    };
  });
}

export function mergeDataRoomItems(items: DataRoomItem[]) {
  const byTitle = new Map(items.map((item) => [item.t.toLowerCase(), item]));

  return DEFAULT_DATA_ROOM_ITEMS.map((fallback) => ({
    ...fallback,
    s: byTitle.get(fallback.t.toLowerCase())?.s || fallback.s,
  }));
}
