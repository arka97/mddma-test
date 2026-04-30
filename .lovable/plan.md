
## Problem

`/apply` shows 3 legacy tiers (Broker ₹9,999 / Trader ₹14,999 / Importer ₹29,999) inherited from v3.0.
`/membership` correctly shows the v3.1 model: **Free ₹0** and **Paid ₹10,000/yr**.
Per locked v3.1 decisions, broker is a **flag** (`is_broker`), not a separate tier — and the broker fee is **₹10,000/yr**, same as any paid member.

## Goal

Make `/apply` match `/membership` exactly: one Paid plan at ₹10,000/yr, with an optional "I operate as a broker" checkbox that sets `is_broker = true` on the profile but does **not** change the price.

## Changes

### 1. `src/pages/Apply.tsx` — rewrite tier picker

- Remove the 3-tier RadioGroup (Broker / Trader / Importer) and the `TIER_DETAILS` map.
- Replace with a single Paid Membership summary card:
  - Title: **Paid Membership**
  - Price: **₹10,000 / year**
  - Bullets: Verified storefront, RFQ inbox & CRM, Priority directory placement, Market intelligence, Trust seal, Founding-member rate locked 24 months.
- Add a checkbox below firm details: **"I operate as a broker (quote on behalf of multiple sellers)"** — purely informational, does not change price. Stored on the profile as `is_broker = true` after admin approval (or queued in a note for the admin).
- Submit button label: `Submit Application · ₹10,000/yr`.

### 2. `src/lib/membership.ts` — collapse tier model

- Keep the `MembershipTier` type but reduce it to a single value: `"paid"` (preserve `MembershipStatus` as-is).
- `TIER_LABEL` → `{ paid: "Paid Membership" }`.
- `TIER_PRICE_INR` → `{ paid: 10000 }`.
- `createPendingMembership` default tier becomes `"paid"`; signature stays compatible.
- The DB `memberships.tier` column currently stores `'broker' | 'trader' | 'importer'` as text — we will write `'paid'` going forward. Existing rows stay readable (display falls back to "Paid Membership" for unknown values). No migration required for this UI fix; can be cleaned up later.

### 3. `src/components/account/MembershipStatusCard.tsx`

- Use the new single label. Remove any tier-specific copy. Pricing line shows `₹10,000/yr`.

### 4. Sanity checks

- `/membership` (MembershipPlans.tsx) — already correct, no change.
- Memory note: confirm broker fee = ₹10,000/yr (not ₹5,000) and update `mem://index.md` Core line + `mem://features/membership-system` accordingly during implementation.

## Out of scope

- No DB migration of historical `memberships.tier` values.
- No change to `/membership` page layout or copy.
- Razorpay payment-link edge function already reads `TIER_PRICE_INR[tier]`; with the new map it will charge ₹10,000 automatically.

## Files to edit

- `src/pages/Apply.tsx`
- `src/lib/membership.ts`
- `src/components/account/MembershipStatusCard.tsx`
- `mem://index.md` (Core line correction)
- `mem://features/membership-system` (broker fee correction)
