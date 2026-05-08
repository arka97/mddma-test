# Owner Reference Docs — `/documents` expansion

Goal: extend the existing 6-doc public spec with **8 new owner-only deep-reference docs** that capture every detail of the project. These are for you, the project owner, not members or admins. Exhaustive depth (level 5). Hybrid approach: narrative is hand-written; raw schema/route/component tables are generated from the codebase by a small script and pasted in, so they stay accurate.

## What gets added

Eight new markdown files in `src/content/docs/`, registered in `_meta.ts` and rendered through the existing `DocPage`. They sit in a separate "Owner reference" section on the `/documents` hub so they're visually distinct from the 6 public docs.

```text
src/content/docs/
  01-vision-and-pitch.md          (existing)
  02-business-and-scope.md        (existing)
  03-product-and-ux.md            (existing)
  04-functional-spec.md           (existing)
  05-architecture-and-tech.md     (existing)
  06-build-and-operations.md      (existing)
  07-database-reference.md        NEW — every table, column, RLS, function, enum
  08-edge-functions-reference.md  NEW — every edge function in detail
  09-frontend-architecture.md     NEW — routes, contexts, hooks, repos, dataSource
  10-component-and-design.md      NEW — key components + full design token reference
  11-decisions-log.md             NEW — every locked decision with ID, why, when
  12-money-and-membership.md      NEW — pricing, Razorpay flow, membership state machine
  13-operations-runbook.md        NEW — seeding, secrets, debugging, common queries
  14-roadmap-and-glossary.md      NEW — roadmap, BIL contract, rejected ideas, glossary
```

## Each doc — outline

**07 · Database Reference** — Every table (advertisements, circulars, comments, companies, inquiry_products, posts, product_categories, product_variants, products, profiles, rfq_responses, rfqs, user_roles): purpose, every column with type/default/nullability, every RLS policy in plain English + SQL, indexes, enums (`app_role`, `review_status`, `stock_band`, `trend_direction`, `rfq_status`, `verification_tier`). All 7 DB functions (`has_role`, `handle_new_user`, `downgrade_to_free`, `remove_free_when_upgraded`, `prevent_profile_privilege_escalation`, `enforce_product_gallery_limit`, `update_updated_at_column`, `get_buyer_reputation_tier`). Storage buckets (`avatars`, `company-assets`, `product-images`, `ad-assets`) with their access rules. Mermaid ERD.

**08 · Edge Functions Reference** — One section per function: `verify-doc-password`, `razorpay-create-payment-link`, `razorpay-webhook`, `promote-verification`. For each: purpose, request shape, response shape, secrets used, JWT setting, error paths, how to invoke from frontend, how to test. Plus a sequence diagram for the Razorpay payment flow.

**09 · Frontend Architecture** — Full route table (every path in `App.tsx` → page component → role gate). Context layer (Auth, Role, Cart) with what each provides. The hooks→repos→Supabase chain explained with one worked example (`useCompanies` → `repositories/companies.ts` → SQL). `lib/dataSource.ts` merge rule. `lib/membership.ts` accessors. Role simulator. Data flow diagram.

**10 · Components & Design System** — Inventory of non-trivial components: `GuardedPrice`, `MarketTicker`, `CartDrawer`/`CartFab`, `ProductMediaCarousel`, `VariantManager`, `RFQModal`, `KYCDocsSection`, `MembershipStatusCard`, `BehavioralCues`, `SellerScoreboard`, `BuyerTrustBadge`, role simulator, password gate. For each: purpose, props, where used, any guard rules. Then the **full design system reference**: every HSL token from `index.css`, every Tailwind extension from `tailwind.config.ts`, gradients, shadows, custom utilities (`gold-gradient-text`, `card-hover`), typography scale, breakpoints.

**11 · Decisions Log** — Every locked decision in a single table, with permanent IDs:

- BIZ-001 Lead Packs killed
- BIZ-002 Silver/Gold/Platinum collapsed to single Paid tier
- BIZ-003 Broker = flag, not separate price
- TECH-001 BIL is external API, not edge function
- TECH-002 BrowserRouter, no `_redirects`
- TECH-003 No WhatsApp Business API; `wa.me` only
- UX-001 Controlled transparency: ranges + bands only
- UX-002 RFQ requires authentication
- UX-003 Multi-item RFQ cart with FAB + drawer
- GOV-001 Buyer reputation, not seller reputation
- DATA-001 Live + sample merge, live wins on slug conflict
- ROLE-001 `paid_member` and `free_member` mutually exclusive (trigger + RPC)

Each entry: what, why, when locked, what it replaced, where it's enforced in code.

**12 · Money & Membership** — Pricing matrix (Free / Paid ₹10K / Broker flag). End-to-end Razorpay flow with sequence diagram (apply → create-payment-link → user pays → webhook → role grant). Refund/cancel/downgrade flow using `downgrade_to_free` RPC. KYC verification states (`unverified` → `email_verified` → `gst_verified` → `company_verified`). Membership state machine (Guest → Free → Paid → Broker; Admin appointed). The `remove_free_when_upgraded` invariant explained.

**13 · Operations Runbook** — How to: seed demo data, rotate secrets, manually grant a role, manually verify a member, find a stuck RFQ, read edge function logs, debug a failed Razorpay webhook, restore a soft-hidden company, change the docs password, publish a circular, place an ad. Plus a "common psql queries" appendix (top RFQs by status, role distribution, KYC funnel, recent signups).

**14 · Roadmap & Glossary** — Phase-2 BIL contract spec (endpoints, request/response, fallback). Roadmap gantt for the next 6 months. Rejected ideas with reasons (so they're not re-litigated). Full glossary: trade terms (lot, origin, grade, MOQ) + platform terms (controlled transparency, stock band, demand trend, BIL signal, RFQ, buyer reputation tier). Acronyms list.

## Hybrid auto-generation

A small Node script — `scripts/gen-doc-snapshots.ts` — produces three snapshot files:

```text
src/content/docs/_generated/
  db-snapshot.md     # tables, columns, RLS, functions (from supabase/migrations/*.sql)
  routes-snapshot.md # routes table parsed from src/App.tsx
  tokens-snapshot.md # HSL tokens parsed from src/index.css + tailwind.config.ts
```

The hand-written docs (07, 09, 10) embed these snapshots with a `<!-- BEGIN AUTO -->` / `<!-- END AUTO -->` marker block. Re-running the script overwrites only the marked region; narrative stays intact. Script is idempotent and runs locally on demand — no CI dependency.

## UI changes

`/documents` hub gets a second section below the existing strip:

```text
[Public spec — 6 docs already there]

──── Owner reference (private) ────
[07 DB Reference] [08 Edge Functions] [09 Frontend] [10 Components & Design]
[11 Decisions Log] [12 Money & Membership] [13 Ops Runbook] [14 Roadmap & Glossary]
```

These cards carry a small "Internal" badge so it's obvious they're not for members. The existing password gate already covers them — no extra access control needed. Read-tracking, download-md, download-zip, print, and TOC all work because they go through the same `DocPage` component.

## Files touched

- New: `src/content/docs/07-database-reference.md` through `14-roadmap-and-glossary.md` (8 files)
- New: `scripts/gen-doc-snapshots.ts` + `src/content/docs/_generated/*.md`
- Edit: `src/content/docs/_meta.ts` — register the 8 new docs with an `internal: true` flag
- Edit: `src/pages/DocumentsHub.tsx` — render two sections (public + internal)
- Memory: update `mem://project/documentation` to reflect the new structure

## Out of scope

- No new database changes, no new auth, no new edge functions.
- No member-facing or admin-facing help docs (these are owner-only).
- No translation; English only, same as existing docs.

After approval I'll write all 8 docs in one pass at maximum depth.  
  
also update existing documents up to date