
# GoKwik Aesthetic Reskin

Goal: shift the whole app from the current slate/emerald/navy theme to the GoKwik "Warm Commerce" look — cream surfaces, warm gold primary (#d8a86a), midnight navy ink, pill buttons, hairline navy borders, 16px radius. No business-logic changes — purely tokens, shell chrome, and shared components.

## Design tokens (single source of truth)

Update `src/index.css` `:root` to:

- `--background` → `#FFF7EC` (warm cream)
- `--foreground` → `#000428` (midnight navy)
- `--card` → `#FFFFFF`
- `--primary` → `#d8a86a` (warm gold) · `--primary-foreground` → `#000428`
- `--secondary` → `#FEF1DE` (primary-soft) on navy text
- `--muted` → `#F2F1EA` · `--muted-foreground` → `#000428` @ 60%
- `--accent` → `#F79D1D` (vivid warm orange, used sparingly)
- `--border` → `rgba(0,4,40,0.10)` (hairline navy)
- `--input` → same hairline
- `--ring` → `#d8a86a`
- `--success` → `#22C55E` (kept for rates hero / KYC tick)
- `--warning` → `#F79D1D` · `--destructive` → `#E5484D`
- `--radius` → `1rem` (16px)
- Brand aliases (`--gold*`, `--navy*`, `--burgundy*`, `--cream`) remapped to the new palette so legacy callers don't break.
- Dark mode block updated to the inverse (navy surface, cream ink, same gold).

Tailwind config already consumes these via `hsl(var(--*))`, so no `tailwind.config.ts` structural change — only HSL values flip. Confirm Inter stays (BDO Grotesk isn't shipped; Inter is the closest available and already loaded).

## Shared component polish

- `src/components/ui/button.tsx` — make `default`, `secondary`, `destructive`, `accent` variants pill-shaped (`rounded-full`), add warm gold shadow on `default` (`shadow-[0_8px_20px_-8px_hsl(var(--primary)/0.55)]`), keep `outline`/`ghost`/`link` square-ish at `rounded-md`. Bump default height to 44px to match GoKwik's airy buttons.
- `src/components/ui/card.tsx` — 16px radius (already `rounded-lg` = var radius), swap shadow to navy-tinted (`shadow-[0_2px_12px_-4px_rgba(0,4,40,0.08)]`), keep hairline border.
- `src/components/ui/badge.tsx` — pill by default, add soft variants (`amber-soft`, `blue-soft`, `red-soft`, `green-soft`) backed by tokenized light backgrounds with strong-colored text so chip tags read as light pills, not solid dark fills.
- `src/components/ui/input.tsx`, `textarea.tsx`, `select.tsx` — radius bumped to match (already inherits), border = hairline navy.

## Shell chrome

- `src/components/layout/Header.tsx` — white bar, navy icons, gold `Logo` mark already; tighten to "airy not heavy" (remove backdrop-blur tint shift, replace `bg-background/90` with `bg-card`, hairline border-bottom). Login CTA → pill gold.
- `src/components/layout/MobileBottomTabBar.tsx` — white bg, gold active state with a small rounded top indicator bar, circular hover/press background on each icon.
- `src/components/market/ComposeSheet.tsx` — confirm bottom-sheet handle, pill "Post" button using new primary; no structural change needed beyond button variant.
- FAB (post composer trigger on `/market`) — convert from circular `+` to pill with "Post" label + plus icon.

## Targeted screen sweeps (token-only, no layout changes)

These pages have hard-coded color utilities or gradients that won't auto-pick up the token flip and need a quick pass:

- `src/pages/Index.tsx`, `Market.tsx`, `Rfq.tsx`, `Directory.tsx`, `DirectoryList.tsx`, `About.tsx`, `MembershipPlans.tsx`, `Apply.tsx`, `Dashboard.tsx`, `Login.tsx`
- `src/components/home/today/*` (TodayHeader, CategoryGrid, QuickActionsGrid, NewMembersList, RecentListingsList, AdSlot, MembershipCTA, FeaturedMembers, CircularsSection)
- `src/components/market/*` (PostCard, EngagementBar, TopicChips, PinnedRatesCard, SignalCard, PaywallOverlay)
- `src/components/rfq/RfqCard.tsx`, `CreateRfqSheet.tsx`
- `src/components/directory/MemberCard.tsx`, `products/ProductTile.tsx`, `products/CategoryGrid.tsx`

Sweep rules:
- Replace `bg-navy*`, `text-navy*`, `border-navy*`, `bg-burgundy*`, `bg-gold*` literals with `bg-primary/foreground/secondary/muted/accent` tokens. Most already use tokens; this is cleanup for the few stragglers.
- Replace dark gradient hero panels (e.g. KYC success) with cream layout + emerald check.
- Topic chips & filter chips → `rounded-full`, gold active with warm shadow, muted inactive.
- Pinned rates card on `/market` stays emerald (signature element) — only refresh the inner decorative circles and pill badge per the brief.
- RFQ buy/sell toggle → muted container with pill active.

## Out of scope

- No copy/content changes.
- No route, schema, RLS, or repository changes.
- No new fonts (Inter stays — BDO Grotesk not licensed in repo).
- Logo asset untouched.

## Verification

After edits: run typecheck/build, then capture mobile (390×844) screenshots of `/`, `/market`, `/rfq`, `/directorylist`, `/membership`, `/login` via Playwright to confirm the cream surface + gold primary + pill buttons render correctly and no contrast regressions on text.
