## Problem
List rows across every Admin Moderation tab use a single horizontal `flex items-center gap-3` row holding image + text + badges + multiple buttons. On 390px viewports, the controls take so much fixed width that the title column collapses to a few characters and text wraps one letter per line (the vertical "S.." / "directory-banner" you saw on Ads — same pattern affects Products, Users, Circulars, Categories, News, Humor).

## Fix — `src/pages/account/AdminModeration.tsx`, presentation only

Apply the same responsive row pattern to every list-item Card:

- Outer `CardContent`: `flex flex-col sm:flex-row sm:items-center gap-3` (drop `flex-wrap`; for Circulars keep `sm:items-start`).
- Media + text block wrapped in `flex items-start gap-3 min-w-0 flex-1 w-full` so the thumbnail and title share the first row on mobile and the title gets real width.
- Controls (badges + action buttons + priority input) wrapped in a trailing `flex items-center gap-2 flex-wrap sm:flex-nowrap sm:ml-auto sm:shrink-0` block so they drop to a second row on mobile and right-align on desktop.
- Long meta lines (`placement · priority · dates`, category slugs, etc.) get `truncate` / `line-clamp-1` so they never force vertical wrapping.
- Ads tab: hide the inline "Priority" label on mobile via `sr-only sm:not-sr-only` to keep the input usable without eating row width.

Tabs touched (rows only, forms unchanged):
1. Products list row — lines ~401–431
2. Users list row — lines ~438–457
3. Circulars list row — lines ~505–521
4. Ads list row — lines ~551–574
5. Categories list row — lines ~646–664
6. News list row — lines ~705–716
7. Humor list row — lines ~751–762

## Out of scope
- Form cards above each list (already stack correctly).
- No data, repo, route, or logic changes.
- No other pages.
