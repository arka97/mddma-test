## Goal

Bring the entire `/documents` set to v3.1.2 ground-truth: every doc reflects the live database, edge functions, routes, contexts, repositories, and shipped features. Add owner-focused docs for things that are currently scattered or missing.

## Doc set after this update — 17 total

Public (bundled in client, in `src/content/docs/`):

```text
01 Vision & Pitch
02 Business & Scope
03 Product & UX
04 Functional Spec
05 Architecture & Tech
06 Build & Operations
```

Internal / password-gated (in `supabase/functions/get-internal-doc/content/`):

```text
07 Database Reference
08 Edge Functions Reference
09 Frontend Architecture
10 Components & Design System
11 Decisions Log
12 Money & Membership
13 Operations Runbook
14 Roadmap & Glossary
15 Security, RLS & Threat Model            (NEW)
16 Storage, Media & Uploads                (NEW)
17 Owner Quickstart & "Where do I…?"       (NEW)
```

## Per-doc updates (what changes vs. today)

**01 Vision & Pitch** — bump "doc 01 of 17", refresh "Last verified" date, keep thesis; tighten copy.

**02 Business & Scope** — lock pricing to single ₹10,000/yr Paid tier, broker = `is_broker` flag (no separate price), confirm Lead Packs out (BIZ-001), WhatsApp Business API out (TECH-003). Engagement timeline updated to current state.

**03 Product & UX** — RBAC matrix matches `app_role` enum (`admin`, `broker`, `paid_member`, `free_member`); add Role Simulator note; RFQ requires auth (UX-002); buyer-reputation > seller-reputation (GOV-001); controlled-transparency rules (no exact price/stock; bands High/Med/Low; demand trend).

**04 Functional Spec** — module specs aligned to shipped pages: Directory, Storefront, Products+ProductPage, Brands, Multi-item RFQ Cart (FAB+Drawer, draft auto-save), Community (Discourse primary, native posts/comments archive read-only), Circulars, Forms, Admin Moderation CMS (circulars + ads + companies). Acceptance criteria refreshed.

**05 Architecture & Tech** — stack (React 18 + Vite + Tailwind + shadcn + TanStack Query), Lovable Cloud, layering (page → hook → repository → supabase client), `dataSource.ts` live+sample merge, BIL noted as external API (TECH-001), edge functions list = the 4 deployed.

**06 Build & Operations** — env vars from `.env`, secrets list (DOCS_PASSWORD, LOVABLE_API_KEY, SUPABASE\_\*, GOOGLE_SEARCH_CONSOLE_API_KEY connector), seeding strategy, sitemap script (`scripts/generate-sitemap.ts`), PWA + InstallAppButton, deploy via Lovable, test strategy (Vitest).

**07 Database Reference** — fully regenerated from live schema: 13 tables (advertisements, brands, circulars, comments, companies, inquiry_products, posts, product_categories, product_variants, products, profiles, rfq_responses, rfqs, user_roles), every column with type/nullable/default, every RLS policy verbatim, every db function (downgrade_to_free, enforce_product_gallery_limit, handle_new_user, has_role, update_updated_at_column, get_buyer_reputation_tier, prevent_profile_privilege_escalation, remove_free_when_upgraded, trg_rfqs_set_priority_score), enums (`app_role`, `verification_tier`, `rfq_status`, `review_status`), storage buckets (avatars, company-assets, product-images, ad-assets), updated ER diagram.

**08 Edge Functions Reference** — exact 4 functions: `get-internal-doc`, `verify-doc-password`, `razorpay-create-payment-link`, `razorpay-webhook`. Per function: purpose, JWT verify flag, secrets used, request/response, failure modes, how to test from `curl`/dashboard.

**09 Frontend Architecture** — full route table from `routes.tsx` including alias redirects (/admin, /pitch, /brd, /sow, /prd, /fsd, /sdd, /tsd, /changelog), Provider tree (AppProviders → Auth, Role, Cart, QueryClient), hook→repo chain, Role Simulator location & flow, Seo component, ScrollToTop, ProtectedRoute, PasswordGate.

**10 Components & Design System** — refreshed component inventory grouped by folder (layout, home, commodity, brands, products, cart, community, docs, pwa, account, ui), HSL token reference from `index.css`, Tailwind extensions, breakpoints, animation tokens, Navy + Gold palette decision.

**11 Decisions Log** — append/refresh: BIZ-001 Lead Packs killed; BIZ-002 single Paid ₹10K tier; UX-001 controlled-transparency; UX-002 RFQ auth-required; TECH-001 BIL is external; TECH-002 docs password server-side only; TECH-003 no WA Business API; GOV-001 buyer-reputation primary; SEC-001 privilege-escalation trigger on profiles; SEC-002 has_role SECURITY DEFINER pattern; OPS-001 sitemap generator script; PWA-001 installable.

**12 Money & Membership** — single Paid plan ₹10,000/yr, broker checkbox flag (no extra fee), legacy DB tier rows handled by `lib/membership.ts` accessors (`tierLabel`, `tierPriceInr`), end-to-end Razorpay flow (create-payment-link → checkout → webhook → role grant via `remove_free_when_upgraded`), KYC ladder (`verification_tier` enum + `email/company/gst_verified_at`), downgrade flow.

**13 Operations Runbook** — recipes: bootstrap admin (admin@mddma.org auto-grant in `handle_new_user`), grant a role manually, seed sample data, rotate `DOCS_PASSWORD`, update circulars/ads via /account/moderation, debug RFQ not appearing in inbox, common psql queries.

**14 Roadmap & Glossary** — 6-month roadmap, BIL Phase 2 spec, rejected ideas register, glossary (RFQ, KYC tiers, BIL, Discourse, controlled transparency, etc.).

**15 Security, RLS & Threat Model (NEW)** — explicit security model: `has_role()` SECURITY DEFINER pattern; per-table policy matrix; `prevent_profile_privilege_escalation` trigger (blocks non-admin writes to verification_tier, buyer_reputation_score, is_broker, gstin, company_name, *_verified_at, rfq_count, rfq_response_rate); admin-only roles management; `enforce_product_gallery_limit` (max 3 gallery + cover); auth flow + session handling; password reset; what is intentionally public (active categories, published circulars, in-window ads, non-hidden products, posts/comments); attack surfaces and how mitigated.

**16 Storage, Media & Uploads (NEW)** — buckets and intended use (avatars, company-assets, product-images, ad-assets — admin-only write); size limits in `lib/storage.ts` (10 MB images / 100 MB videos), MIME allowlist, `UploadValidationError` surfacing pattern, gallery cap trigger, image vs video paths in ProductsPage, public URL strategy, recommended folder conventions.

**17 Owner Quickstart & "Where do I…?" (NEW)** — single-page operator index for the solo owner: how to add an admin, publish a circular, run an ad campaign, approve a company, refund a Razorpay payment, change docs password, regenerate sitemap, simulate roles for a demo, locate any feature by URL → file path.

## Out of scope

- No code/feature changes — docs only.
- No changes to `_meta.ts` ordering scheme beyond appending 15/16/17.
- No edits to public marketing pages.

## Technical notes

- Public docs are imported via `?raw` in `src/content/docs/_meta.ts`. Adding 15/16/17 as **internal** means no `_meta.ts` import needed for their bodies — only DocMeta entries with `internal: true`. Their markdown lives only in `supabase/functions/get-internal-doc/content/` and is fetched after `verify-doc-password`.
- All 8→11 internal markdown files must also be present in the edge function `content/` folder (already there for 07–14; 15/16/17 will be added).
- Update reading-order references from "01 of 14" to "01 of 17" in any doc that mentions the count.
- Refresh "Last verified" date stamp in each doc to today.
- Mermaid diagrams kept; ER diagram regenerated where schema changed.
- No migration, no edge function code change, no route change.
