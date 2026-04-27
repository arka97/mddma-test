
## Why KGVPL doesn't show up

KGVPL exists in the `companies` table (owner: your account, `is_hidden=false`). But `/directory`, `/products`, `/store/:slug`, the homepage "Featured Members" section, and the seller cards everywhere still read from the static file `src/data/sampleData.ts`. Real Supabase rows are never queried.

This is the root cause of the disconnect — and it's the same reason newly created products, variants, and storefronts also don't appear anywhere on the public site. Fixing this is the foundation of this pass.

---

## Scope: "Wire It Live" + Master-Doc Gap Pass

Two intertwined goals:

1. **Wire live DB into every discovery surface** so anything a user CRUDs immediately appears on the public site.
2. **Close the highest-value gaps** from the uploaded `MDDMA_Master_Build_Document_v1.md` that the current build is missing.

I'm explicitly *not* re-introducing things v3.1 already killed (Lead Packs, WhatsApp Business API, Discourse, multi-tier silver/gold/platinum, generic "buyer verification kills RFQ") — those are locked decisions in memory and the master doc itself uses `wa.me` links and a Free / Paid / Broker tier model that already matches v3.1.

### Part A — Live data wiring (fixes KGVPL + everything like it)

1. **Member Directory (`/directory`)**
   - Query `companies` (joined with `profiles` for owner display name, `products` count, optional `user_roles` for broker badge).
   - Merge live companies with `sampleMembers` so the demo catalogue stays rich, but real companies always render first and are tagged with a small "Live" indicator in the owner toolbar only.
   - Filters (area/type/verification) work on both sources via a unified `DirectoryEntry` adapter.

2. **Storefront (`/store/:slug`)**
   - First look up `companies` by slug. Fall back to `sampleMembers` only if no DB row exists (so demo storefronts still work).
   - When DB-backed, render `products` for that company and their `product_variants`.
   - Owner toolbar (already built) keeps working.

3. **Products page (`/products`)**
   - New "Live Listings" tab as the default. Pulls from `products` + nested `product_variants`, joined to `companies` for the seller chip.
   - Existing demo `productListings` becomes a secondary "Sample Catalogue" tab so the page never looks empty pre-seed.

4. **Homepage**
   - `FeaturedMembersSection` queries `companies WHERE is_verified OR membership_tier='paid' LIMIT 6`, falls back to sample featured.
   - `RecentListingsSection` queries newest 8 `products` joined to `companies`.
   - `FeaturedCategoriesSection` derives counts from live `products.category` aggregations.

5. **Auth → Header → Account**
   - Header already uses live auth. Add a "View my storefront" link for users that own a `companies` row (uses `useAuth().company.slug`).

### Part B — Missing v1 master-doc features

Picked by ROI; everything else can come later.

1. **Global RFQ Cart (P10 in master doc)** — currently RFQs are single-product via `RFQModal`. Add:
   - `CartContext` with `addItem(productId, variantId?, qty)`, `removeItem`, `clear`, persisted to `localStorage`.
   - Floating cart FAB + slide-out `Sheet` drawer listing items grouped by seller company.
   - "Send RFQ" → opens existing `RFQModal` in **multi-item mode** that creates one `rfqs` row per unique seller and inserts cart items into the `message`/`product_name` fields (until we add `inquiry_products` table).

2. **`inquiry_products` junction table** — small migration so a single RFQ can carry N products. Master doc requires it; current `rfqs` table only stores one `product_name`.

3. **Circulars** (P16)
   - Migration: `circulars (id, title, body, created_by, published_at, is_published)` with RLS: public SELECT where `is_published`, admin INSERT/UPDATE/DELETE.
   - Admin tab in `AdminModeration` to compose + publish.
   - Public `/circulars` archive + "Latest Updates" strip on homepage.

4. **Member Application (`/apply`)** (P3)
   - Current `Apply.tsx` is mostly static. Refactor into a 4-step form that, on submit, creates a `companies` row with `is_hidden=true` + flag `pending_review`. Admin approves in moderation.
   - Add `companies.review_status` enum (`pending|approved|rejected`) via migration.

5. **Advertisements** (P17)
   - Migration: `advertisements (id, title, image_url, link_url, placement, start_date, end_date, is_active, impressions, clicks)` + RLS (public SELECT active+in-window, admin write).
   - `AdBanner` component (already exists statically) reads live ads first, falls back to placeholder.
   - Admin tab to upload ads (uses existing `company-assets` bucket or new `ad-assets` bucket).

6. **Community Forum** (P15)
   - Migrations: `posts`, `comments` with RLS (public SELECT, authenticated INSERT, author/admin UPDATE/DELETE).
   - Replace stub `/community` with live list + post detail route.

7. **WhatsApp handoff in Seller CRM** (P11/P13 + Section 11)
   - In `RFQInbox`, add primary "Contact buyer on WhatsApp" button on each RFQ detail that builds the master-doc message template and opens `wa.me/91<phone>?text=...` in a new tab. Phone comes from the `rfqs.buyer_phone` column already present.

### Part C — Logical connections / polish

- After signup, if the user has no `companies` row, show a one-time prompt on `/account` to "Create your storefront" linking to `/account/company`.
- After creating a company, redirect to `/store/<slug>` so the user immediately sees their public page.
- Seed `categories` from live `products` so filter dropdowns aren't hardcoded.
- Update `mem://architecture/v3-1-locked-decisions` and `/changelog` with v3.1.2 "Live Discovery Pass" notes.

---

## Technical details

**New tables (migrations):**
```sql
-- inquiry_products junction
create table public.inquiry_products (
  id uuid primary key default gen_random_uuid(),
  rfq_id uuid not null references public.rfqs(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  product_name text not null,
  quantity text not null,
  created_at timestamptz not null default now()
);

-- circulars, advertisements, posts, comments  (sketch — full DDL in implementation)
-- companies.review_status enum addition
```
All new tables get RLS with the same `has_role(auth.uid(), 'admin')` pattern already used.

**New context:** `src/contexts/CartContext.tsx` (provider mounted in `App.tsx`).

**New components:**
- `src/components/cart/CartFab.tsx`, `CartDrawer.tsx`
- `src/components/admin/CircularEditor.tsx`, `AdEditor.tsx`
- `src/pages/CircularsArchive.tsx` (replaces stub)
- `src/pages/CommunityPost.tsx`

**Adapter:** `src/lib/directoryAdapter.ts` — converts a `companies` row into the same shape the existing `MemberCard` UI expects, so we don't have to rewrite cards.

**Reuse:** existing `RFQModal`, `VariantManager`, `AdminModeration`, `friendlyErrorMessage`, `lib/storage.ts` upload helper.

**Out of scope (deferred):**
- Email Edge Functions for circular blasts and RFQ notifications (Section 13 of master doc) — stub the call sites with TODO comments; we'll wire actual SMTP once Resend/Mailgun is chosen.
- Static-page CMS (still CMS-001, Phase 2).
- Buyer verification document upload flow (already partially built in VerificationCenter; not changed in this pass).

---

## Deliverable order

1. DB migrations (junction, circulars, ads, posts, comments, companies.review_status).
2. Live wiring of Directory + Storefront + Products + Homepage sections.
3. Cart context + FAB + drawer + multi-item RFQ submit.
4. Circulars admin + public archive + homepage strip.
5. Ads admin + AdBanner live read.
6. Forum tables + minimal `/community` list & post detail.
7. WhatsApp button in RFQ inbox.
8. Apply.tsx refactor → creates pending company.
9. Memory + changelog update.

After approval I'll execute these in implementation mode.
