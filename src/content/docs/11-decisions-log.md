# Decisions Log

Every locked product, technical, UX, governance, data, and role decision — with a permanent ID, the reason, and where it is enforced. **Do not re-litigate these without writing a new entry that supersedes the previous one.**

## Index

| ID | Decision | Status |
|---|---|---|
| BIZ-001 | Lead Packs killed | Locked |
| BIZ-002 | Single Paid tier (Silver/Gold/Platinum collapsed) | Locked |
| BIZ-003 | Broker is a flag, not a separate price | Locked |
| TECH-001 | Behavioral Intelligence Layer is an external API, not edge functions | Locked |
| TECH-002 | `BrowserRouter` only — no `_redirects`, no `vercel.json` | Locked |
| TECH-003 | No WhatsApp Business API; `wa.me` deeplinks only | Locked |
| UX-001 | Controlled transparency: ranges + bands only | Locked |
| UX-002 | RFQ requires authentication | Locked |
| UX-003 | Multi-item RFQ cart with FAB + drawer | Locked |
| GOV-001 | Buyer reputation, not seller reputation | Locked |
| DATA-001 | Live + sample merge, live wins on slug conflict | Locked |
| ROLE-001 | `paid_member` and `free_member` mutually exclusive at the DB | Locked |

---

### BIZ-001 — Lead Packs killed
**Decision** No pay-per-lead module. The `/leads` route never ships.
**Why** Selling buyer attention by the unit conflicts with the Association's role as a trust authority. It also caps revenue and creates buyer-hostile incentives.
**Locked** April 2026.
**Replaces** A previous v3.0 plan to monetise via Lead Packs.
**Enforced in** Routes (no `/leads`); admin UI has no lead-pack inventory; this is also called out in `mem://core` so future agents do not re-add it.

### BIZ-002 — Single Paid tier
**Decision** One paid tier at ₹10,000/yr. No Silver / Gold / Platinum.
**Why** Tiered ladders created decision fatigue with no observed lift in revenue. A binary "are you a member or not" framing matches the Association's trust narrative.
**Locked** April 2026.
**Replaces** Three-tier matrix in v3.0.
**Enforced in** `lib/membership.ts` (`MembershipTier = "paid"` only); `tierPriceInr()` returns 10,000 for any legacy value; `/apply` exposes only one plan; edge fn `razorpay-create-payment-link` collapses legacy tiers to ₹10,000.

### BIZ-003 — Broker is a flag, not a price
**Decision** "Broker" is `profiles.is_broker = true`. Same ₹10,000/yr fee as Paid. No separate "broker addon".
**Why** Earlier v3.1 docs floated a ₹5,000 addon — operationally messy (two SKUs, two webhooks) and the broker board doesn't need different infrastructure from a paid storefront. A flag is cheaper to explain and to bill.
**Locked** May 2026 — note this **supersedes** the older "₹5K broker addon" wording in some docs.
**Enforced in** `/apply` shows a single "I operate as a broker" checkbox; `companies.categories` carries `'broker'` for filtering; `/broker` page filters by the flag; no separate Razorpay product.

### TECH-001 — Behavioral Intelligence Layer is an external API
**Decision** BIL lives behind an HTTP API (configurable via `BIL_API_URL`), not as Supabase edge functions.
**Why** BIL is compute-heavy, stateful (model artifacts, time-series stores), and benefits from horizontal scaling and GPU access. Edge functions are stateless and cold-starty.
**Locked** April 2026.
**Enforced in** Frontend reads `BIL_API_URL`; no edge function in `supabase/functions/` performs BIL inference; signals fall back gracefully when the URL is unset.

### TECH-002 — BrowserRouter, no rewrites file
**Decision** Use `BrowserRouter` with Lovable hosting's automatic SPA fallback. Do not add `_redirects` or `vercel.json`.
**Why** Lovable hosting handles SPA fallback. Adding extra rewrite files causes double-redirects and breaks deep links during preview vs. production.
**Locked** February 2026.
**Enforced in** `src/App.tsx` uses `BrowserRouter`; no `_redirects` file in `public/`.

### TECH-003 — No WhatsApp Business API
**Decision** Use `wa.me` deeplinks only. No Twilio / official WA Business integration.
**Why** Cost (per-message fees), compliance (template approvals), and operational overhead. The trade does not need automated outbound — it needs a one-tap link.
**Locked** February 2026.
**Enforced in** Phone reveal renders an `<a href="https://wa.me/91...">`; no WA SDK in dependencies.

### UX-001 — Controlled transparency
**Decision** No exact prices, no exact stock counts, no exact search numbers ever rendered.
- Prices: ranges only (`₹X–₹Y/unit`).
- Stock: bands only (`High` / `Medium` / `Low`).
- Demand: trend chips only (`Rising` / `Stable` / `Cooling`).
- No search-by-price-ascending UI.
- Contact details gated to Paid.

**Why** Public price discovery undermines member margins and the Association's pricing power.
**Locked** February 2026.
**Enforced in** `<GuardedPrice>` is the single render path for prices and refuses raw values; `tradeSignals.test.ts` asserts no exact rupee leak in catalogue HTML; product list and product page UIs use `stock_band` and `trend_direction` columns, not `price` or `stock_count`.

### UX-002 — RFQ requires authentication
**Decision** Anonymous RFQs are rejected. The cart's "Submit" button routes unauthenticated users through `/login`.
**Why** Reputation without identity is meaningless; sellers waste time on tire-kickers; spam volume drops by an order of magnitude.
**Locked** March 2026.
**Enforced in** `rfqs` RLS INSERT policy `auth.uid() = buyer_id`; `CartContext.submit()` guards with `useAuth`; `MemberProfile` "Send RFQ" CTA preserves return URL when redirecting to login.

### UX-003 — Multi-item RFQ cart
**Decision** RFQs are a cart, not a single-form modal. Buyers add variants from any product page; drafts auto-save; one submit creates one `rfqs` row plus N `inquiry_products` rows.
**Why** Real trade is multi-line. Single-item RFQs forced buyers to send 5 separate emails for 5 grades.
**Locked** March 2026.
**Enforced in** `CartContext`, `CartFab`, `CartDrawer`; `inquiry_products` table; RLS allows the buyer to insert lines only into their own RFQ.

### GOV-001 — Buyer reputation, not seller reputation
**Decision** Public marketplaces rate sellers and let buyers hide. We invert: sellers are verified by the Association; buyers carry a reputation score visible to sellers.
**Why** The Association already vets sellers (membership = trust). The asymmetry that wastes seller time is **unqualified buyers**, not unqualified sellers.
**Locked** February 2026.
**Enforced in** `profiles.buyer_reputation_score`, `get_buyer_reputation_tier(score)`, `BuyerTrustBadge`, `priority_score` field on `rfqs`. Sellers are not publicly rated.

### DATA-001 — Live + sample merge
**Decision** Discovery surfaces (Directory, Storefronts, Products) merge live DB rows with curated sample data. **Live wins on slug conflict.**
**Why** A new association launches with an empty DB. Sample rows make the demo "look full" without lying — admins replace any sample by inserting a live company with the same slug.
**Locked** April 2026.
**Enforced in** `lib/dataSource.ts` — `mergeDirectory(live, sample)` and `mergeProducts(live, sample)` are the only functions that produce render lists. Pages never read `sampleData.ts` directly.

### ROLE-001 — Paid and Free are mutually exclusive
**Decision** A user with `paid_member` (or `broker`) cannot simultaneously hold `free_member`. Cancelling a paid membership restores `free_member`.
**Why** Permission inheritance was correct conceptually (paid ⊃ free) but the dual-row state caused bugs in role checks, badges, and admin UI counts. The DB now enforces a single canonical row.
**Locked** May 2026.
**Enforced in**
- Trigger `remove_free_when_upgraded()` AFTER INSERT on `user_roles` (deletes free row when paid/broker arrives)
- RPC `downgrade_to_free(_user_id)` (called by `cancelMembership` and "Free" admin moderation button)
- Backfill migration `20260501_paid_replaces_free.sql` cleaned existing data
- Dev-mode invariant in `RoleContext` asserts `paid_member` permissions ⊇ `free_member` permissions
