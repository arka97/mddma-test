import { useEffect, useState } from "react";

/**
 * Twitter-style chrome visibility: hide on scroll down, reveal on scroll up.
 * Always visible near the top of the page.
 */
export function useScrollDirection(threshold = 8, topOffset = 64) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;

    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const delta = y - last;
      if (y <= topOffset) {
        setHidden(false);
        last = y;
        return;
      }
      if (Math.abs(delta) < threshold) return;
      setHidden(delta > 0);
      last = y;
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [threshold, topOffset]);

  return hidden;
}
