/**
 * Single source of truth for mobile chrome geometry and stacking.
 *
 * Feed, Reels and Following must all use these values so the sticky chips,
 * the header, the bottom tab bar and the floating Post button stay aligned
 * (and never overlap the iOS home indicator / notch).
 */

/** Height of the mobile bottom tab bar, excluding the safe-area inset. */
export const BOTTOM_BAR_HEIGHT = 54;

/** Breathing room between the FAB and whatever sits below it. */
export const FAB_GAP = 16;

/** Sticky header height on mobile (matches `top-12`). */
export const HEADER_HEIGHT = 48;

/** Stacking order. Chips sit above content, below the bar/FAB and modals. */
export const Z_INDEX = {
  content: 0,
  chrome: 30, // ad + chips stack
  bar: 40, // bottom tab bar
  fab: 40, // floating Post button
  overlay: 50,
} as const;

/** `env(safe-area-inset-bottom)` with a 0 fallback for non-notch devices. */
export const SAFE_BOTTOM = "env(safe-area-inset-bottom, 0px)";

/**
 * Bottom offset for the floating Post button.
 * Always clears the iOS home indicator, and clears the tab bar when visible.
 */
export function fabBottom(barHidden: boolean): string {
  const stack = barHidden ? FAB_GAP : BOTTOM_BAR_HEIGHT + FAB_GAP;
  return `calc(${SAFE_BOTTOM} + ${stack}px)`;
}

/** Bottom padding needed by a full-bleed scroller so content clears the bar. */
export function contentBottomInset(barHidden: boolean): string {
  const stack = barHidden ? 0 : BOTTOM_BAR_HEIGHT;
  return `calc(${SAFE_BOTTOM} + ${stack}px)`;
}
