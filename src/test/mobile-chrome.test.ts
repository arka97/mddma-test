import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  BOTTOM_BAR_HEIGHT,
  FAB_GAP,
  SAFE_BOTTOM,
  Z_INDEX,
  contentBottomInset,
  fabBottom,
} from "@/lib/chrome-layout";

const read = (p: string) => readFileSync(resolve(process.cwd(), p), "utf8");

const HOME = read("src/pages/Home.tsx");
const REELS = read("src/components/reels/ReelsView.tsx");
const BAR = read("src/components/layout/MobileBottomTabBar.tsx");
const HEADER = read("src/components/layout/Header.tsx");

describe("iOS safe-area spacing", () => {
  it("FAB clears the home indicator when the tab bar is hidden", () => {
    expect(fabBottom(true)).toBe(`calc(${SAFE_BOTTOM} + ${FAB_GAP}px)`);
  });

  it("FAB clears both the tab bar and the home indicator when visible", () => {
    expect(fabBottom(false)).toBe(`calc(${SAFE_BOTTOM} + ${BOTTOM_BAR_HEIGHT + FAB_GAP}px)`);
  });

  it("every safe-area usage has a 0px fallback in the shared tokens", () => {
    expect(SAFE_BOTTOM).toContain(", 0px)");
  });

  it("content inset always reserves the safe area", () => {
    expect(contentBottomInset(true)).toContain(SAFE_BOTTOM);
    expect(contentBottomInset(false)).toContain(`${BOTTOM_BAR_HEIGHT}px`);
  });

  it("Home renders the FAB through the shared token, not ad-hoc offsets", () => {
    expect(HOME).toContain("fabBottom(hideChrome)");
    expect(HOME).toContain("bottom-[var(--fab-bottom)]");
    expect(HOME).not.toMatch(/env\(safe-area-inset-bottom\)\s*\+\s*66px/);
  });

  it("bottom tab bar pads for the home indicator", () => {
    expect(BAR).toContain("pb-safe");
    expect(BAR).toContain("fixed inset-x-0 bottom-0");
  });

  it("reels reserve the bar height plus safe area under each slide", () => {
    expect(REELS).toContain(`pb-[calc(${BOTTOM_BAR_HEIGHT}px+env(safe-area-inset-bottom))]`.replace("px+", "px+"));
    expect(REELS).toContain("env(safe-area-inset-bottom)");
  });
});

describe("scroll chrome regression: Feed / Reels / Following", () => {
  it("chrome visibility is driven by one shared context in all three sections", () => {
    expect(HOME).toContain("useChromeVisibility");
    expect(REELS).toContain("useChromeVisibility");
    expect(BAR).toContain("useChromeHidden");
    expect(HEADER).toMatch(/useChrome(Hidden|Visibility)/);
  });

  it("Home hides ad + chips as a single sticky stack", () => {
    expect(HOME).toContain("--home-chrome-transform");
    expect(HOME).toContain("sticky top-12");
    // ad and chips live inside the same measured element
    const stack = HOME.slice(HOME.indexOf("homeChromeRef"), HOME.indexOf("homeChromeRef") + 1200);
    expect(stack).toContain("AdSlot");
    expect(stack).toContain("TopicChips");
  });

  it("Reels feed inner scroll position back into the shared context", () => {
    expect(REELS).toContain("reportScroll");
  });

  it("the same chip set (Feed, Reels, Following) shares one scroll handler", () => {
    expect(HOME).toContain("onTouchStart={onTouchStart}");
    expect(HOME).toContain("onTouchEnd={onTouchEnd}");
  });

  it("bottom bar and Home chrome animate with transforms, not layout shifts", () => {
    expect(BAR).toContain("transition-transform");
    expect(HOME).toContain("transition-[transform,opacity]");
  });
});

describe("visual QA: chips never overlay content incorrectly", () => {
  it("stacking order is content < chrome < bar/fab < overlay", () => {
    expect(Z_INDEX.content).toBeLessThan(Z_INDEX.chrome);
    expect(Z_INDEX.chrome).toBeLessThan(Z_INDEX.bar);
    expect(Z_INDEX.bar).toBeLessThanOrEqual(Z_INDEX.fab);
    expect(Z_INDEX.fab).toBeLessThan(Z_INDEX.overlay);
  });

  it("the Home chip stack uses the chrome layer", () => {
    expect(HOME).toContain(`z-${Z_INDEX.chrome}`);
  });

  it("the FAB and the tab bar share the bar layer", () => {
    expect(HOME).toContain(`z-${Z_INDEX.fab}`);
    expect(BAR).toContain(`z-${Z_INDEX.bar}`);
  });

  it("the reels viewport stays below the chip layer", () => {
    const reelZ = REELS.match(/fixed inset-0 z-(\d+)/);
    expect(reelZ).not.toBeNull();
    expect(Number(reelZ![1])).toBeLessThan(Z_INDEX.chrome);
  });

  it("hidden chips stop intercepting taps on mobile", () => {
    expect(HOME).toContain("pointer-events-none lg:pointer-events-auto");
    expect(HOME).toContain('hideChrome ? "pointer-events-none lg:pointer-events-auto" : "pointer-events-auto"');
  });

  it("reels overlays are click-through except their own controls", () => {
    expect(REELS).toContain("pointer-events-none absolute inset-x-0");
    expect(REELS).toContain("pointer-events-auto");
  });
});
