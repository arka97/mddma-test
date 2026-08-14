import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

/**
 * One source of truth for Twitter-style chrome visibility (header, ad, chips,
 * bottom tab bar, floating Post button).
 *
 * The provider listens to window scroll, and any inner scroll container
 * (e.g. the Reels snap list) can feed it through `reportScroll` so the
 * behaviour is identical across Feed, Reels, Following and Bulletin.
 */
interface ChromeVisibilityValue {
  hidden: boolean;
  /** Report the current scrollTop of an inner scroll container. */
  reportScroll: (y: number) => void;
  /** Force the chrome back into view (e.g. when switching tabs). */
  showChrome: () => void;
}

const ChromeVisibilityContext = createContext<ChromeVisibilityValue>({
  hidden: false,
  reportScroll: () => undefined,
  showChrome: () => undefined,
});

const THRESHOLD = 8;
const TOP_OFFSET = 64;

export function ChromeVisibilityProvider({ children }: { children: ReactNode }) {
  const [hidden, setHidden] = useState(false);
  const lastWindowY = useRef(0);
  const lastInnerY = useRef(0);

  const apply = useCallback((y: number, lastRef: { current: number }) => {
    const delta = y - lastRef.current;
    if (y <= TOP_OFFSET) {
      lastRef.current = y;
      setHidden(false);
      return;
    }
    if (Math.abs(delta) < THRESHOLD) return;
    lastRef.current = y;
    setHidden(delta > 0);
  }, []);

  const reportScroll = useCallback((y: number) => apply(y, lastInnerY), [apply]);
  const showChrome = useCallback(() => {
    lastInnerY.current = 0;
    lastWindowY.current = window.scrollY;
    setHidden(false);
  }, []);

  useEffect(() => {
    lastWindowY.current = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        apply(window.scrollY, lastWindowY);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [apply]);

  const value = useMemo(() => ({ hidden, reportScroll, showChrome }), [hidden, reportScroll, showChrome]);
  return <ChromeVisibilityContext.Provider value={value}>{children}</ChromeVisibilityContext.Provider>;
}

export function useChromeVisibility() {
  return useContext(ChromeVisibilityContext);
}

/** Convenience: just the hidden flag. */
export function useChromeHidden() {
  return useContext(ChromeVisibilityContext).hidden;
}
