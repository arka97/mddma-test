## Scope

Build three product surfaces and the supporting tables, without touching existing styles, tokens, or components:

1. New **Market** feed at `/market` (replaces current `Market.tsx` page).
2. New **RFQ board** at `/rfq` (reintroducing the engine removed in v3.1.3).
3. Bottom-tab + admin-moderation updates.

Home (`/`) is unchanged. Existing public site (Directory, Circulars, Knowledge, etc.) stays open. Only `/market` and `/rfq` are gated.

---

## Step 1 — Bottom tab bar (`MobileBottomTabBar.tsx`)

New order, 5 tabs:

```text
Home (/)  ·  Market (/market)  ·  RFQ (/rfq)  ·  Members (/directory)  ·  Account (/dashboard)
```

- Remove the Circulars and Brands tabs from the bar (pages stay reachable from header / Market section).
- RFQ tab uses `FileText` (or similar lucide icon already used elsewhere); Market uses `MessageSquare`.
- Auth-required behavior unchanged for Account; Market and RFQ route freely — gating happens inside the page.

## Step 2 — Database (one migration)

All tables in `public`, RLS on, GRANTs included. Mutating policies scoped via `has_role(auth.uid(), …)`.

- `community_posts` — columns per spec; FKs to `auth.users`; CHECK on `post_type` and `topic_tag` enums via `text` + check constraint.
- `anonymous_identity_log` — admin-only SELECT; insert performed by a `SECURITY DEFINER` trigger on `community_posts` when `is_anonymous = true`.
- `post_comments`, `post_likes` (unique `(post_id,user_id)`), `post_views` (unique `(post_id,user_id)`).
- `rfq_listings` per spec + trigger enforcing `valid_until BETWEEN created_at::date+1 AND created_at::date+90` and `price_min < price_max`, `quantity_min < quantity_max` (trigger, not CHECK, since it references `now()`).
- `rfq_contact_reveals` (`rfq_id`, `user_id`, `revealed_at`).
- Trigger `enforce_post_defaults`: non-admins cannot set `is_pinned`, `is_hidden`, or `post_type='admin_rate_update'`.
- Trigger `enforce_rfq_defaults`: forces `is_hidden=false` on insert for non-admins; only admin can update `is_hidden` or shorten `valid_until` on existing rows.
- Add `is_muted boolean default false` to `profiles`; block insert/update on `community_posts` and `post_comments` when muted (via trigger).

RLS summary:


| Table                   | SELECT                                                                                                                                                                      | INSERT                  | UPDATE/DELETE                        |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ------------------------------------ |
| community_posts         | paid/admin full; free reads non-hidden if `now()-profiles.created_at < 7d`; guests no access via Data API (teaser served by edge function with synthetic data — see Step 3) | paid + admin, not muted | author own (non-pinned) or admin     |
| anonymous_identity_log  | admin only                                                                                                                                                                  | trigger only (definer)  | none                                 |
| post_comments           | same as community_posts SELECT                                                                                                                                              | paid + admin, not muted | author own or admin                  |
| post_likes / post_views | authenticated                                                                                                                                                               | authenticated self      | self delete                          |
| rfq_listings            | paid + admin                                                                                                                                                                | paid + admin            | author own (limited fields) or admin |
| rfq_contact_reveals     | admin + self                                                                                                                                                                | paid + admin            | none                                 |


## Step 3 — `/market` Community Feed

New page `src/pages/Market.tsx` (replace existing). Layout:

```text
[ Header (existing) ]
[ Topic chips: All · Price Signals · Market Alerts · Sourcing · Member News · Polls ]   ← sticky
[ Circulars section (compact list, reuses existing CircularsSection) ]
[ Pinned admin rate post card ]
[ Feed cards … ]
[ Floating Compose FAB ]
[ Bottom tab bar ]
```

Components (all reuse existing `Card`, `Badge`, `Button`, `Avatar`, `Sheet`, `Dialog`):

- `src/components/market/TopicChips.tsx`
- `src/components/market/PostCard.tsx` — handles all `post_type` variants incl. anonymous rendering ("MDDMA Member" + "Identity protected by MDDMA").
- `src/components/market/PinnedRatesCard.tsx` — renders `structured_data.rows[]` as a table using existing price/mono class (`font-mono tabular-nums`).
- `src/components/market/ComposeFab.tsx` + `ComposeSheet.tsx` (Sheet from bottom on mobile, Dialog on desktop). Toolbar buttons open structured input panels inline. Anonymous toggle visible only when `useRole().role === 'paid_member'` (broker flag included).
- `src/components/market/CommentsSheet.tsx`.
- `src/components/market/EngagementBar.tsx` — like (optimistic via React Query mutation), comment open, view count.

Hooks/repos:

- `src/repositories/communityPosts.ts`, `postComments.ts`, `postLikes.ts`, `postViews.ts`
- `src/hooks/queries/useCommunityFeed.ts` (filter by `topic_tag`), `usePostMutations.ts`

Access gating (component-level, on top of RLS):

- Guest (no session) → render **teaser feed**: 4 blurred skeleton cards with masked content + full-screen CTA overlay ("Sign in to join the conversation"). No network calls to `community_posts`.
- Free member, `now() - profiles.created_at < 7d` → read-only feed (no FAB, no like/comment actions; tap shows upgrade toast).
- Free member, ≥ 7d → full-screen paywall overlay (spec copy verbatim) with `Join for ₹10,000/year` → `/apply` and `Learn more` → `/membership`.
- Paid/admin → full access. Admin sees Pin / Hide / Delete / Mute affordances in card overflow menu.

View count increments via `useEffect` on card mount: upsert into `post_views` (ignore conflict).

## Step 4 — `/rfq` RFQ Board

New route + page `src/pages/Rfq.tsx`, registered in `src/routes.tsx`.

Layout:

```text
[ Header ]
[ BUYING | SELLING ]   ← sticky segmented control
[ RFQ cards list, sorted created_at desc, valid_until >= today, is_hidden=false ]
[ Create RFQ FAB ]
```

Components:

- `src/components/rfq/RfqTypeToggle.tsx`
- `src/components/rfq/RfqCard.tsx` — uses existing card, badge, mono price font; expiry chip turns amber (`text-warning`/existing amber token) when ≤ 3 days.
- `src/components/rfq/RevealContactButton.tsx` — on click, query `companies.phone` via `get_company_whatsapp` RPC (already exists) and insert into `rfq_contact_reveals`. Render copyable phone + `wa.me` deeplink.
- `src/components/rfq/CreateRfqSheet.tsx` — full-screen Sheet; zod-validated form (react-hook-form already in project). Commodity dropdown sourced from `product_categories`. Date picker via existing shadcn Calendar with min/max.

Gating: non-paid sees the spec gate screen (uses existing `EmptyState` styling) with Upgrade CTA → `/apply`. Server-side enforced by RLS — `SELECT` blocked for non-paid so the page can't even fetch.

## Step 5 — Admin moderation (`src/pages/account/AdminModeration.tsx`)

Add 3 new tabs to the existing tab strip:

- **Community Posts** — table of all posts incl. hidden. Real author resolved by joining `anonymous_identity_log` for anonymous rows. Row actions: Hide, Delete, Mute author (updates `profiles.is_muted`).
- **Anonymous Identity Log** — read-only table, admin-only via RLS.
- **RFQ Moderation** — table of `rfq_listings` incl. hidden/expired. Actions: Hide, Force-expire (set `valid_until = today`).

Use existing `Table` + `Badge` components only.

## Step 6 — Controlled Transparency enforcement

- Reuse existing `PriceBand` component for all price rendering on `PostCard`, `PinnedRatesCard`, `RfqCard`.
- No price-based sort/filter UI added.
- Contact reveal: client check on role + RLS-gated insert; phone never embedded in card markup before reveal.

## Documentation & memory

- Update `src/content/docs/04-functional-spec.md` and `02-business-and-scope.md`: add Market Feed + RFQ Board sections; mark RFQ engine as **reintroduced v3.2** superseding the v3.1.3 removal notice.
- Update `mem://architecture/v3-1-3-removal` and core memory to reflect RFQ + Market additions.

## Out of scope (call out)

- Push notifications, email digests, real-time websocket updates (feed will refresh on focus / pull).
- Image/PDF upload pipeline beyond reusing existing `company-assets` bucket for post attachments.
- Poll vote integrity beyond `(post_id, user_id)` uniqueness.

## Build order (matches spec)

1. Migration (all tables + triggers + RLS).
2. Bottom tab bar swap.
3. `/market` feed (PostCard → list → pinned rate → topic chips → Circulars section).
4. Compose sheet (text → toolbar → structured types → anonymous toggle).
5. Engagement (likes optimistic → comments sheet → views).
6. Access gates (teaser for guest, 7-day window, paywall overlay).
7. `/rfq` board (cards + toggle → create form → reveal contact).
8. Admin moderation tabs.
9. Docs + memory updates.