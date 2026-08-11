import { useEffect, useState } from "react";

// Eases a numeric value from 0 up to `target` on mount/whenever target changes.
// Shared by any gauge/donut that wants a "counts up" entrance instead of a static value.
export function useAnimatedNumber(target, duration = 900) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let frame;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * target);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}
