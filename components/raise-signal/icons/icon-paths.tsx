import type { SVGProps } from "react";

const P: SVGProps<SVGPathElement> = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const iconPaths = {
  home: <path d="M3 10.5 12 4l9 6.5M5.5 9.5V20h13V9.5M9.5 20v-5h5v5" {...P} />,
  dashboard: (
    <g {...P}>
      <rect x="3.5" y="3.5" width="7" height="9" rx="1.6" />
      <rect x="13.5" y="3.5" width="7" height="5" rx="1.6" />
      <rect x="13.5" y="11.5" width="7" height="9" rx="1.6" />
      <rect x="3.5" y="15.5" width="7" height="5" rx="1.6" />
    </g>
  ),
  investors: (
    <g {...P}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19c.4-3 2.7-4.8 5.5-4.8S14.1 16 14.5 19" />
      <path d="M16 5.4a3 3 0 0 1 0 5.4M17.8 14.4c1.8.6 3 1.9 3.2 4.1" />
    </g>
  ),
  bell: (
    <g {...P}>
      <path d="M6.5 9.5a5.5 5.5 0 0 1 11 0c0 4 1.2 5.6 2 6.5H4.5c.8-.9 2-2.5 2-6.5Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </g>
  ),
  back: <path d="M14.5 5 8 12l6.5 7" {...P} />,
  chevR: <path d="M9.5 5 15 12l-5.5 7" {...P} />,
  chevDown: <path d="M5 9.5 12 16l7-6.5" {...P} />,
  link: (
    <g {...P}>
      <path d="M10 13.5a4 4 0 0 0 5.7.3l2.8-2.8a4 4 0 0 0-5.7-5.7l-1.6 1.6" />
      <path d="M14 10.5a4 4 0 0 0-5.7-.3L5.5 13a4 4 0 0 0 5.7 5.7l1.6-1.6" />
    </g>
  ),
  globe: (
    <g {...P}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.3 2.3 3.5 5.3 3.5 8.5S14.3 18.2 12 20.5C9.7 18.2 8.5 15.2 8.5 12S9.7 5.8 12 3.5Z" />
    </g>
  ),
  check: <path d="M5 12.5 10 17.5 19 6.5" {...P} />,
  checkCircle: (
    <g {...P}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.2 12.2 11 15l5-6" />
    </g>
  ),
  alert: (
    <g {...P}>
      <path d="M12 4.5 21 19.5H3L12 4.5Z" />
      <path d="M12 10v4.5" />
      <circle cx="12" cy="17.6" r=".4" fill="currentColor" stroke="none" />
    </g>
  ),
  minusCircle: (
    <g {...P}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 12h7" />
    </g>
  ),
  plus: <path d="M12 5v14M5 12h14" {...P} />,
  plusCircle: (
    <g {...P}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8.5v7M8.5 12h7" />
    </g>
  ),
  trendUp: (
    <g {...P}>
      <path d="M3.5 16.5 9.5 10.5 13 14l7-7.5" />
      <path d="M15 6.5h5v5" />
    </g>
  ),
  trendDown: (
    <g {...P}>
      <path d="M3.5 7.5 9.5 13.5 13 10l7 7.5" />
      <path d="M15 17.5h5v-5" />
    </g>
  ),
  target: (
    <g {...P}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.6" />
      <circle cx="12" cy="12" r=".7" fill="currentColor" stroke="none" />
    </g>
  ),
  layers: (
    <g {...P}>
      <path d="M12 3.5 21 8l-9 4.5L3 8l9-4.5Z" />
      <path d="M3.5 12.5 12 16.8l8.5-4.3M3.5 16.5 12 20.8l8.5-4.3" />
    </g>
  ),
  vault: (
    <g {...P}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.4" />
      <circle cx="12" cy="12" r="3.4" />
      <path d="M12 8.6V7M12 17v-1.6M15.4 12H17M7 12h1.6" />
    </g>
  ),
  bolt: <path d="M13.5 3 5 13.5h6L10.5 21 19 10.5h-6L13.5 3Z" {...P} />,
  filter: <path d="M4 6h16l-6 7v5l-4 2v-7L4 6Z" {...P} />,
  mail: (
    <g {...P}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.4" />
      <path d="m4.5 7 7.5 5.5L19.5 7" />
    </g>
  ),
  bookmark: <path d="M6.5 4.5h11v15l-5.5-3.8-5.5 3.8v-15Z" {...P} />,
  info: (
    <g {...P}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.2" />
      <circle cx="12" cy="8" r=".5" fill="currentColor" stroke="none" />
    </g>
  ),
  spark: (
    <g {...P}>
      <path d="M12 3v3.5M12 17.5V21M3 12h3.5M17.5 12H21M5.6 5.6 8 8M16 16l2.4 2.4M18.4 5.6 16 8M8 16l-2.4 2.4" />
    </g>
  ),
  doc: (
    <g {...P}>
      <path d="M6.5 3.5h7L18 8v12.5H6.5V3.5Z" />
      <path d="M13 3.7V8h4.3M9 12.5h6M9 16h6" />
    </g>
  ),
  coins: (
    <g {...P}>
      <ellipse cx="12" cy="6.5" rx="6.5" ry="2.6" />
      <path d="M5.5 6.5v5c0 1.4 2.9 2.6 6.5 2.6s6.5-1.2 6.5-2.6v-5M5.5 11.5v5c0 1.4 2.9 2.6 6.5 2.6s6.5-1.2 6.5-2.6v-5" />
    </g>
  ),
  pieChart: (
    <g {...P}>
      <path d="M12 3.5V12l6 6" />
      <circle cx="12" cy="12" r="8.5" />
    </g>
  ),
  sliders: (
    <g {...P}>
      <path d="M5 4v6M5 14v6M12 4v3M12 11v9M19 4v9M19 17v3" />
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="9" r="2" />
      <circle cx="19" cy="15" r="2" />
    </g>
  ),
  arrowUpRight: <path d="M7 17 17 7M9 7h8v8" {...P} />,
  refresh: (
    <g {...P}>
      <path d="M4.5 9a8 8 0 0 1 13.7-2.5L20 8" />
      <path d="M19.5 15a8 8 0 0 1-13.7 2.5L4 16" />
      <path d="M20 4v4h-4M4 20v-4h4" />
    </g>
  ),
  flag: (
    <g {...P}>
      <path d="M6 21V4M6 4.5h11l-2.5 4 2.5 4H6" />
    </g>
  ),
  rocket: (
    <g {...P}>
      <path d="M12 3c3 1.5 5 4.8 5 8.5 0 2-.6 3.7-1.4 5.2H8.4C7.6 15.2 7 13.5 7 11.5 7 7.8 9 4.5 12 3Z" />
      <circle cx="12" cy="10" r="1.8" />
      <path d="M8.4 16.7c-1.6.7-2.4 2-2.6 4.1 2.1-.2 3.4-1 4.1-2.6M15.6 16.7c1.6.7 2.4 2 2.6 4.1-2.1-.2-3.4-1-4.1-2.6" />
    </g>
  ),
} as const;

export type IconName = keyof typeof iconPaths;
