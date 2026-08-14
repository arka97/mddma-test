import { useEffect, useState } from "react";
import logo from "@/assets/brand/gbaug-logo.png";

/** True when the app was launched from the home screen (installed PWA). */
function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const iosStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
  return iosStandalone || window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    window.matchMedia("(display-mode: minimal-ui)").matches;
}

const MIN_VISIBLE_MS = 1200;
const FADE_MS = 400;

/**
 * Branded launch overlay so installed users immediately see they opened the
 * G-BAU-G app. Only renders in standalone (installed) mode.
 */
export function SplashScreen() {
  const [mounted] = useState(() => isStandalone());
  const [leaving, setLeaving] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (!mounted) return;
    const t1 = window.setTimeout(() => setLeaving(true), MIN_VISIBLE_MS);
    const t2 = window.setTimeout(() => setGone(true), MIN_VISIBLE_MS + FADE_MS);
    return () => { window.clearTimeout(t1); window.clearTimeout(t2); };
  }, [mounted]);

  if (!mounted || gone) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-primary transition-opacity duration-[400ms] ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
    >
      <img
        src={logo}
        alt=""
        className="h-24 w-24 animate-splash-in rounded-2xl object-contain motion-reduce:animate-none"
      />
      <p className="mt-5 animate-splash-in text-2xl font-bold tracking-[0.2em] text-primary-foreground motion-reduce:animate-none">
        G-BAU-G
      </p>
      <p className="mt-2 max-w-[16rem] animate-splash-in text-center text-[11px] uppercase tracking-widest text-primary-foreground/70 motion-reduce:animate-none">
        Mumbai Dry Fruits &amp; Dates Merchants Association
      </p>
      <span className="absolute bottom-10 h-1 w-16 overflow-hidden rounded-full bg-primary-foreground/20">
        <span className="block h-full w-full origin-left animate-splash-bar bg-gold motion-reduce:animate-none" />
      </span>
    </div>
  );
}
