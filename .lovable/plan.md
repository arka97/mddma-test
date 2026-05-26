## Goal
Eliminate horizontal (and any vertical) page overflow across the app, and fix the specific leak visible on `/store/<slug>` at mobile widths where the Product Catalog cards and the Contact card get clipped past the right edge of the viewport.

## What's happening
On the storefront mobile view, the page is scrolling horizontally: the third product row's title ("Sunrise Fresh Dried Sweet Cherries…") and the right edges of the Contact card (WhatsApp / Call / Email buttons) sit beyond the viewport. The root cause is a missing `min-w-0` on the flex chain inside each product `<li>`, so a long unbreakable product name forces the row wider than its container. There is also no global guard against accidental horizontal overflow from any component.

## Changes

1. **Global overflow guard** — `src/index.css`
   - Add `html, body { overflow-x: hidden; }` and `body { max-width: 100vw; }` so a stray wide child can never produce a horizontal page scrollbar.
   - Add a small utility/`@layer` rule ensuring `#root` is `min-w-0` and `max-w-full`.

2. **Layout main wrapper** — `src/components/layout/Layout.tsx`
   - Add `overflow-x-hidden min-w-0 w-full` to `<main>` as a defensive cap (does not affect any intentional `overflow-x-auto` inner scrollers like tables, the market ticker, the brand strip, or Market filter chips).

3. **Storefront mobile product list** — `src/pages/Storefront.tsx`
   - On each `<li>`, add `min-w-0 overflow-hidden`.
   - On the inner `<div className="flex gap-3">`, add `min-w-0`.
   - Keep the existing `min-w-0 flex-1` + `truncate` on the text column; also add `break-words` on the product name as a second line of defense for very long single tokens.
   - On the Contact / Location / Specializations sidebar `Card`s, no structural change needed once the page-level guard is in place; verify nothing inside forces width.

4. **Sweep for known suspects** (small, surgical)
   - `src/components/products/ListingRow.tsx` — confirm thumbnail wrapper has `flex-shrink-0` and text column has `min-w-0` (already partly done in the previous origin-badge fix); add `min-w-0` where missing.
   - `src/components/directory/MemberCard.tsx`, `src/components/market/SignalCard.tsx`, `src/components/home/today/RecentListingsList.tsx`, `src/components/home/today/CategoryGrid.tsx` — add `min-w-0` to flex text columns and `truncate`/`break-words` to any name/title that currently has neither.
   - Leave existing intentional horizontal scrollers untouched: `MarketTicker` (already `overflow-hidden` on outer, animated inner), brand strip (`overflow-x-auto`), Market filter chips row, Dashboard/Storefront tables (`overflow-x-auto`).

5. **No DB, query, or business-logic changes.** Pure CSS/markup.

## Verification
- Reload `/store/kgvpl` at 390px width: no horizontal scrollbar, Product Catalog cards and Contact card fit within the viewport, long product names ellipsize.
- Spot-check `/`, `/directory`, `/products`, `/market`, `/community`, `/dashboard`, `/circulars` at 360–414px and at desktop: no horizontal page scroll; internal scrollers (tables, ticker, brand strip, filter chips) still scroll horizontally on their own.
- Confirm no vertical content is hidden by the new `overflow-x-hidden` (it only clips the X axis; Y scrolling is unaffected).
