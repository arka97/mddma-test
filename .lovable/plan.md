## Goal
On the public storefront (`/store/:slug`):
1. Remove the "KYC verified" tile entirely.
2. Move the "Trade signals" tile from its current full-width position (under the navy hero) to the **bottom-right of the main content area** — rendered inline as a sidebar card alongside other right-column content.

## Changes

### 1. `src/pages/Storefront.tsx`
- Delete the section block (lines ~181–186) that currently renders `<SellerScoreboard signals kyc loading />` between the navy hero and the main content grid.
- Remove the `useSellerKyc` hook call and unused `kyc` variable.
- In the existing `lg:grid-cols-3` layout, add the trade-signals card to the **right sidebar column at the bottom** (after the existing contact / sponsor cards in the right column). It will naturally sit at the bottom-right of the main content area on desktop.
- On mobile (single column), it stacks at the end of the page content.

### 2. `src/components/commodity/SellerScoreboard.tsx`
- Extract the existing "Trade signals" Card into a new exported component `TradeSignalsCard` (preserves loading skeleton, establishing-history placeholder, and 2x2 stat grid).
- Keep `SellerScoreboard` as a thin wrapper composing `TradeSignalsCard` + KYC card so any other callers continue to work.
- `Storefront.tsx` imports and renders `TradeSignalsCard` directly.

## Out of scope
- Other pages using `SellerScoreboard` (none currently besides Storefront).
- Any change to KYC backend logic, hooks, or admin moderation views.
- No floating/fixed positioning — card is part of the normal document flow.
