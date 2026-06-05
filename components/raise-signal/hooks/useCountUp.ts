"use client";

import { useEffect, useState } from "react";

export function useCountUp(target: number, dur = 900, start = true) {
  const [v, setV] = useState(0);

  useEffect(() => {
    if (!start) {
      const id = requestAnimationFrame(() => setV(target));
      return () => cancelAnimationFrame(id);
    }

    let raf = 0;
    let t0 = 0;

    const tick = (t: number) => {
      if (!t0) t0 = t;
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    const fallback = setTimeout(() => setV(target), dur + 220);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fallback);
    };
  }, [target, start, dur]);

  return v;
}
