# Fix Feed, Reels and Following mobile chrome layout

## Goal

Make Feed, Reels and Following use the same predictable mobile behavior:

- Scroll down: header, advertisement, chips and bottom tab bar leave the viewport together.
- Scroll up: they return together without covering content.
- The floating Post button always sits just above the visible bottom bar, then moves close to the safe-area edge when the bar is hidden.
- Reels fills exactly the usable viewport in both states, with no white gap above the bottom bar.

## Confirmed current issues

- The chips are a separate sticky element and only translate by their own height; the advertisement is outside that animated chrome group. This allows the chips to remain over Feed/Following content and makes Reels behave differently.
- The Post button always uses `bottom-[86px]`, then only applies a vertical transform when chrome hides. Its position is not derived from the actual bottom-tab height or device safe area.
- Reels uses hard-coded heights (`100dvh - 10rem` / `100dvh`) while it begins below the header, ad and chips and the page still reserves mobile bottom padding. Those competing reservations create the white area and inconsistent visible height.

## Implementation

1. **Treat the home advertisement and chips as one chrome stack**
   - Wrap both elements in one mobile sticky container.
   - Animate/collapse the complete stack from the shared chrome state instead of translating only the chips.
   - Keep the stack in normal document flow when visible, and remove its reserved height when hidden so Feed and Following content cannot be covered or leave a blank strip.
   - Preserve desktop behavior.

2. **Use explicit shared mobile chrome dimensions**
   - Define reusable safe-area-aware header, bottom-bar and FAB spacing rules rather than unrelated magic offsets.
   - Measure the variable home chrome stack when needed so Reels uses its real rendered height, including an absent ad.

3. **Anchor the floating Post button to the bottom-bar state**
   - Visible bar: place the FAB a compact, consistent gap above the tab bar.
   - Hidden bar: move the FAB down to the viewport safe-area edge with the same visual padding.
   - Keep the transition synchronized with the tab bar and prevent overlap with reel action controls.

4. **Give Reels an exact viewport frame**
   - On mobile, size/position the reel scroller from the actual visible top chrome to the actual visible bottom chrome.
   - When chrome hides, expand the reel frame to the full usable viewport; when chrome returns, shrink it precisely above the bottom bar.
   - Remove the inherited page bottom reservation for the Reels mode so it cannot produce a white footer gap.
   - Keep snap scrolling and use its inner scroll position to drive the same shared visibility state.

5. **Normalize scroll state across chip changes**
   - Reset the relevant scroll baseline when switching among Feed, Reels and Following.
   - Ensure the first downward gesture hides chrome and the first upward gesture restores it without stale state from the previous mode.

## Validation

Test at the current 394×718 mobile viewport and a taller mobile viewport:

- Feed: scroll down/up and verify no chip overlay and correct FAB movement.
- Reels: swipe down/up through multiple reels and verify exact top/bottom fit with no white space.
- Following: repeat both directions and verify behavior matches Feed.
- Switch among all three while chrome is hidden and confirm each opens with visible, correctly spaced navigation.
- Confirm desktop feed/reels layout remains unchanged.