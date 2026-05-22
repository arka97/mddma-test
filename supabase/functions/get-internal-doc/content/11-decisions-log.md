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
| TECH-004 | `memberships` table + `activate_membership` RPC are deferred | Open |
| UX-001 | Controlled transparency: ranges + bands only | Locked |
| UX-002 | RFQ requires authentication | Locked |
| UX-003 | Multi-item RFQ cart with FAB + drawer | Locked |
| GOV-001 | Buyer reputation, not seller reputation | Locked |
| DATA-001 | Live-only reads; sample data is a test fixture, not a fallback | Locked |
| ROLE-001 | `paid_member` and `free_member` mutually exclusive at the DB | Locked |
| PILOT-001 | Pilot = 8–10 two-sided (sellers + buyers); supersedes earlier "20" / "25" figures | Locked |

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

### TECH-004 — `memberships` table is deferred
**Decision** The Razorpay-backed payment flow is fully implemented in code (`/apply` UI, `razorpay-create-payment-link`, `razorpay-webhook`, `activate_membership` calls) but the `memberships` table and the `activate_membership`/`create_pending_membership` RPCs are intentionally **not yet migrated** to production.
**Why** Payments aren't switched on for the pilot. Roles are granted manually via `user_roles` insert and `downgrade_to_free`. Shipping the schema before payments go live would create dead rows and a maintenance burden.
**Status** Open — to be locked once Razorpay is approved and the migration is applied.
**Enforced in** No migration in `supabase/migrations/` for `memberships`. Edge functions remain deployed but dormant. Docs 07/08/12 carry an explicit "Implementation status" callout.

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

### DATA-001 — Live-only reads
**Decision** Discovery surfaces (Directory, Storefronts, Products) read **only live database rows**. Sample arrays in `src/data/*` remain in the repo as type fixtures and offline-test material; they are not merged into production reads.
**Why** Earlier the demo merged sample rows with live DB rows so the platform "looked full". Once the DB had real members, the merge became a source of confusion (which row is which?) and a leak risk (test data on production). Cleaner to ship empty and seed real data.
**Locked** May 2026 (revised from earlier merge model — the older claim still appears in some narratives and should be read with this entry as the authoritative one).
**Enforced in** `lib/dataSource.ts` — `mergeDirectory(live)` and `mergeProducts(live)` only project DB rows. Pages never read `sampleData.ts` directly in production paths.

### ROLE-001 — Paid and Free are mutually exclusive
**Decision** A user with `paid_member` (or `broker`) cannot simultaneously hold `free_member`. Cancelling a paid membership restores `free_member`.
**Why** Permission inheritance was correct conceptually (paid ⊃ free) but the dual-row state caused bugs in role checks, badges, and admin UI counts. The DB now enforces a single canonical row.
**Locked** May 2026.
**Enforced in**
- Trigger `remove_free_when_upgraded()` AFTER INSERT on `user_roles` (deletes free row when paid/broker arrives)
- RPC `downgrade_to_free(_user_id)` (called by `cancelMembership` and "Free" admin moderation button)
- Backfill migration `20260501_paid_replaces_free.sql` cleaned existing data
- Dev-mode invariant in `RoleContext` asserts `paid_member` permissions ⊇ `free_member` permissions

### LEGAL-001 — Legal stack is a pre-requisite for Razorpay live mode
**Decision** Privacy Policy (doc 19), Terms of Service (doc 20), Refund & Cancellation (doc 21) and Grievance & Redressal (doc 22) must be published as public routes **before** Razorpay live keys are flipped on.
**Why** Razorpay onboarding requires the three policy URLs; DPDP and IT Rules 2021 require the grievance officer notice. Skipping this gates the entire monetisation flow and exposes the Association to regulator action.
**Locked** May 2026.
**Enforced in** Doc 06 roadmap "Promote Privacy/Terms/Refund pages" precedes "Razorpay live mode". The four markdown bodies are drafted; promotion to `/privacy`, `/terms`, `/refund`, `/grievance` is a routes-and-footer change.

### LEGAL-002 — Aditya Parmar is the named Grievance & Data Protection Officer
**Decision** A single named individual is the sole point of contact for all DPDP Act §11–14 rights requests, IT Rules 2021 §3(11) grievances, content-takedown requests, and data-breach notices. That individual is **Aditya Parmar** (grievance@mddma.org, +91 22 2784 1234).
**Why** DPDP §8(9) and IT Rules §3(11) require a named, reachable officer. A shared inbox without a named human does not meet the legal test. Succession is documented in doc 22 §1.
**Locked** May 2026.
**Enforced in** Docs 19 §2, 21 §6, 22 §1, 23 throughout, 25 §10, 26 §5. Footer block on `/privacy`, `/terms`, `/refund`, `/grievance` (once those routes ship).

### OPS-001 — Committee never runs SQL
**Decision** Office staff and committee members operate the platform exclusively through `/account/moderation`. SQL recipes (doc 13, doc 17) are for the developer only.
**Why** Operator error in SQL is irreversible and PII-laden. The non-technical guide (doc 25) covers every committee task without exposing a query console.
**Locked** May 2026.
**Enforced in** Doc 25 is the canonical committee surface; docs 13 and 17 carry a banner pointing at doc 25 first.

### DATA-001b — RFQ rows anonymised at 7 years, hard-deleted at 10
**Decision** `rfqs` rows are kept for 7 years from creation for trade-audit purposes. At year 7 the snapshotted buyer fields (`buyer_name`, `buyer_email`, `buyer_phone`, `buyer_company`, `message`, `delivery_location`, `buyer_id`) are overwritten or nulled. At year 10 the row is hard-deleted.
**Why** Reconciles the deliberate snapshotting in `rfqs` (so deletes don't break audit) with DPDP §12 erasure rights. Members are told this upfront in the Privacy Policy and the response to any erasure request.
**Locked** May 2026.
**Enforced in** Doc 19 §7, doc 26 §2/§3. Implementation is the `retention-cron` edge function (planned, see doc 26 §7); until it ships the Grievance Officer runs the operations manually each quarter.

### PILOT-001 — Pilot is 8–10 two-sided, not 20 or 25 one-sided
**Decision** The 90-day pilot cohort is **8–10 seller anchors plus 8–10 buyer anchors**, recruited by Bhuta-led warm intros (Pattern D). Sellers and buyers should overlap in commodity so real RFQ flow is guaranteed.
**Why** A one-sided directory (sellers only) cannot validate the RFQ engine — the only signal that matters. Earlier "20 members" / "25 anchor members" wording in docs 02, 06, 14, 27, 28 assumed seller-only recruitment and was never reconciled with the two-sided thesis. Smaller, two-sided cohort gives a real signal in 90 days; larger cohort doesn't help if buyers are missing.
**Locked** May 2026.
**Replaces** "20 members" (doc 02), "25 anchor members" (docs 06, 14, 27, 28). All success metrics in doc 27 §4 were rescaled accordingly.
**Enforced in** Doc 27 §2 (cohort table), doc 27 §4 (metrics), doc 28 §2 (outreach sequence), docs 02 / 06 / 14 gantts, `mem://architecture/implementation-status`.
