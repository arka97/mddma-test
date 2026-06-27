The gold "Post" floating button on `/market` is partially hidden behind the mobile bottom tab bar (see attached screenshot). The tab bar sits at `z-40`; the Post button is at `z-30` with `bottom-20`.

Fix in `src/pages/Market.tsx`:
- Raise the fixed Post `Button` from `z-30` to `z-50` so it stacks above the tab bar.
- Increase mobile bottom offset from `bottom-20` (80 px) to `bottom-24` (96 px) so it sits fully clear of the tab bar and any safe-area inset.
- Keep the desktop offset at `lg:bottom-6` unchanged.

No other files or logic change.