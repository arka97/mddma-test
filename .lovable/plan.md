
# G-BAU-G v2.1 — Parchment & Gold, ship visible slices first

Approved plan with your three residual notes folded in and the palette locked to **Parchment & Gold** (ink primary, gold accent). Name stays **G-BAU-G**.

## Palette — decided, once, deliberately

Third and final swap. Structure (feed column, flat cards, action bar, shell) is palette-agnostic — this is ~40 token values in `src/index.css`, not a rebuild. Tailwind config stays as-is (semantic tokens).

**Light — "Parchment & Gold"**
| Role | Token | Value | Use |
|---|---|---|---|
| Page base | `--background` | `#F5F1E8` | warm parchment |
| Surface | `--card` `--popover` | `#FFFFFF` | cards on parchment, LinkedIn-style depth via **border**, no shadow |
| Hover / secondary | `--muted` `--secondary` | `#EFE9DC` | fills, hovers |
| Ink | `--foreground` | `#1B1712` | text + **primary action pills** (X/LinkedIn-black style) |
| Secondary text | `--muted-foreground` | `#6E6455` | metadata |
| Border | `--border` | `#E6DECF` | hairlines |
| Brand gold | `--gold` / `--brand-gold` | `#D8A86A` | logo, large brand fills, 10–20% tints, active-nav highlight |
| Gold-strong (CTA/text on gold) | `--accent` / new `--gold-strong` | `~#935E1B` | links, verified check, small gold CTAs, **any time gold bears or backs text** (WCAG) |
| `--primary` | ink | `#1B1712` | primary pills are ink, not gold |
| Success | `--success` | `#1E9E6A` | generic success — **reserve exact `#25D366` for WhatsApp buttons only** |
| Like / Repost | `--like` / `--repost` | `#F91880` / `#00BA7C` | keep universal social signals |
| Destructive | `--destructive` | `#E5484D` | unchanged in intent |

**Dark — "candlelight" (optional this phase):** `--background #14110C`, `--card #1E1A13`, `--foreground #EDE6D8`, gold brightens to `#E7B979`.

**Integration-color rule (the reason we chose gold):** third-party brand color is used *only* on that integration's action.
- WhatsApp `#25D366` → "Message on WhatsApp", WhatsApp-style Communities.
- LinkedIn `#0A66C2` → "Share / Connect on LinkedIn".
- X → ink → "Share on X".
No blue or green claimed as ours anywhere else. Legacy `--gold*` aliases in `index.css` that were remapped to X-blue get restored to real gold. Grep for stray `text-primary` / `bg-primary` uses that assume blue — those now read ink and must be audited in the guest walkthrough.

**Rule that keeps gold from looking cheap:** light `#D8A86A` never carries text and never sits under white text. Text on gold → gold-strong `~#935E1B`. Primary buttons stay ink pills. This one rule is the difference between "warm and expensive" and "muddy."

---

## Phase 1 — Reskin delta + real follows + palette swap

- **Re-token `src/index.css` to Parchment & Gold** per the table above. Restore real `--gold*` values (currently remapped to X-blue). Add `--gold-strong`.
- **Guest + authed Playwright walkthrough** of Home, Market, Directory, Storefront, ProductPage, RFQ, Membership, About, Login. Fix any surface still reading blue where it should read ink or gold.
- **Desktop 3-column shell** in `src/components/layout/Layout.tsx`: left icon rail (Home / Search / Notifications / Deal Messages / RFQ / Directory / Profile), centered 600px feed column, right rail (Who to follow · Upcoming trade events · Trending in trade). Mobile bottom tabs unchanged.
- **Hover cards** on handles/avatars in feed, directory, post detail, deal messages: logo, verified check, Follow, Message, Start RFQ. Reuse `companies_public`.
- **Unified search bar** in header — visual only this phase (autocomplete stub returns empty), backend wired in Phase 5.
- **Wire `FollowButton` to the real `follows` table.** Delete `src/lib/follow.ts` localStorage shim; rewrite `src/hooks/useFollow.ts` to read/write `follows` via Supabase. Optimistic UI, invalidate on error, dedupe by `(follower_id, following_id)`. The `follows` table already exists.

No new tables. No RLS changes.

---

## Phase 2 — Seed + staging data (prerequisite)

- `scripts/seed-demo.ts` — idempotent, `seed_marker` metadata field, `--reset` flag.
- 20 verified companies, 40 offerings (mixed product + service), 10 RFQs across statuses, 30 community posts (text/image/poll/link), 5 brands, follow edges, likes, comments.
- **Non-prod env guard on "Load demo data":** button in `/account/moderation` only mounts when `import.meta.env.MODE !== 'production'` **and** `VITE_ALLOW_SEED === 'true'` **and** user is admin. Seed rows can never land in prod.

---

## Phase 3 — Following/For-you feed + system event cards (read-time first)

- **Feed tabs on `/market`**: `For you` (default) / `Following` / `Market Events` / `All`. Following filters to the `follows` graph.
- **`feed_stream(cursor, filter)` RPC** — read-time union of `community_posts` + synthetic event rows derived from source tables (`products` newly listed, `rfq_listings` newly opened). No trigger, no `feed_events` table yet. Dedupe by `(source_table, source_id)` in the query. Cheaper to evolve, no write-path fan-out.
- **Graduate to a `feed_events` table only when needed** — specifically for `member.joined` (no natural source-row change to hook) and durable dedupe once the union query slows. Ships as a small follow-up migration if/when it does.
- **`SystemEventCard`** in the feed with dashed border, distinct from manual posts.

RLS: read gates carry through from source tables — nothing to loosen.

---

## Phase 4 — Identity: N:M business representatives (with pgTAP)

**Schema (one migration, one rollback prepared and reviewed *before* the forward migration ships)**
- `business_representatives(business_id, user_id, role enum: owner|admin|member, is_authorized bool, invited_by, added_at, revoked_at nullable, unique(business_id, user_id))`.
- Backfill one `role='owner', is_authorized=true` row per existing `companies.owner_id`.
- `companies.owner_id` stays — becomes the "primary rep" pointer.

**Helper** — `is_rep_of(_business_id uuid) returns boolean`, SECURITY DEFINER, matches on `auth.uid()` AND `is_authorized=true` AND `revoked_at is null`.

**RLS rewrite** on `companies`, `products`, `brands`, `product_variants`, `community_posts` (author path), `rfq_listings`, `rfq_quotations`, `deal_rooms`, `deal_messages`, `advertisements`, `circulars`. Primary-rep-only actions (delete business, change primary rep) keep `owner_id = auth.uid()`.

**pgTAP suite in `supabase/tests/rls/` — first-class deliverable, CI-gated.** Fixtures cover the leak cases explicitly, not just owner/stranger/admin:
- `owner` rep
- `admin` rep
- `member` rep (limited role — can post as business, cannot edit business profile or products)
- **`is_authorized=false` rep** (invited but not accepted)
- **`revoked_at` set rep** (previously authorized, now removed — must lose all access immediately)
- unrelated user
- platform admin

Per-table matrix: SELECT / INSERT / UPDATE / DELETE × every fixture. Run against a shadow DB from a fresh dump.

**UI** — rep switcher in header (only when user is rep of >1 business); `AuthContext` gains `myBusinesses[]` + `activeBusinessId` with a shim so existing single-`company` callers keep working; `/account/company/reps` page for invite/remove/role-change.

---

## Phase 5 — Discovery: unified search + directory polish

- `search-network` edge function using Postgres FTS across `companies`, `products` (with `offering_type` filter), `rfq_listings`, `community_posts`. Grouped typed results, narrowable to one type.
- Wire header search bar shipped visually in Phase 1.
- Filters: platform-wide (vertical, verification, region); offering-only (product vs service, MOQ, price tier).
- Directory polish: hover cards live, verified badges cleaned up, "New this week" strip, alpha jump on `/directorylist`.

---

## Phase 6 — Commerce: offerings, quotes, RFQ carts, Deal Messages rename

- **`products.offering_type enum('product','service') default 'product'`** — decided now, not during build. One storefront, one search, one RFQ pipeline. Service-only columns (`scope`, `duration`, `coverage_area`, `cert_validity`) nullable. `product_variants` stays product-only.
- **`rfq_quotations.quote_type enum('indicative','formal')`.** Indicative → shortlist / revise. Formal → shortlist / revise / reject / withdraw / expire. **No "Accept Quotation" surface anywhere** — audit and remove; copy explains commitment happens in Deal Messages.
- **`rfq_carts` + `rfq_cart_items`** — single-seller auto-splits into one RFQ per seller; multi-seller open-tender posts one combined RFQ, sellers can quote on any subset of line items.
- **Rename Deal Room → Deal Message in UI copy only.** Keep table + RPC names (`start_deal_room`, `send_deal_message`) for backwards compat. Add participant history, edited indicator, export.
- Any commercial action (submit quote, RFQ response, storefront/product inquiry) auto-opens a Deal Message thread and bypasses any future follow-gate.

---

## Phase 7 — Notifications + moderation

- Tiered notifications (default on): real-time push/email for commercial (RFQ response, quote received/expiring, deal-message reply); in-app only for social; digest for association announcements. Opt-in "everything real-time" toggle.
- `notifications` + `notification_prefs` tables. Realtime via Supabase channels.
- Moderation v1: `reports`, `blocks`. Platform admin sees all reports (association scoping lands with tenancy). Appeals infra deferred.

---

## Deferred until demand is real

- **Multi-tenancy** — `associations` table, `association_id` foreign keys, per-association seller approval, Admin Console, Public Hub, Association Desk. Built only when a real second association is onboarding; separate plan with its own RLS-rewrite pgTAP suite.
- **Communities** (WhatsApp-style group chats — will use exact WhatsApp `#25D366` per integration-color rule), **Lists**.
- **Trade Shows**, **Event Organizers** (their own entity, not a `companies` flag), **Media Partners**, **Calendar**.
- Synthesized market-intelligence posts with provenance labels — v1.1.
- DigiKhoj rename, payments, escrow, invoices, full appeals moderation, live/virtual event infra, multi-vertical launch — explicitly out.

---

## Order of operations

1. Phase 1 — palette swap + reskin delta + real follows (visible, days)
2. Phase 2 — seed data (prerequisite, non-prod-gated)
3. Phase 3 — feed tabs + read-time system event cards
4. Phase 4 — N:M reps with pgTAP (including `is_authorized=false`, `revoked_at`, `role='member'` fixtures)
5. Phase 5 — unified search + directory polish
6. Phase 6 — offerings, quotes, RFQ carts, Deal Messages rename
7. Phase 7 — notifications + basic moderation
8. **Only if a second association is real:** multi-tenancy (separate plan)

Approve to start Phase 1.
