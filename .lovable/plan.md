# G-BAU-G — X-Style UI/UX Rework Plan

Backend, tables, RPCs, RLS, edge functions, and repositories stay exactly as they are. This is a chrome + composition + visual-language rework. All copy still says **G-BAU-G** (spec's "DigiKhoj" rename is ignored per your instruction).

## 1. Global shell (applies to every route)

Three-column layout on desktop, single column on mobile:

```text
+-----------+-----------------------------+-----------------+
| Left rail | Center column (route body)  | Right rail      |
| 275px     | max ~640-720px, dense       | 350px           |
+-----------+-----------------------------+-----------------+
```

- **Left rail (desktop, sticky)**
  - G-BAU-G logo
  - Nav: Home · Explore · Bulletin · RFQ · Market · Deal Messages · Members · Brands · Knowledge · More (About, FAQ, Contact, Documents, Admin)
  - Big "Post" button (opens unified composer)
  - Bottom: account chip with avatar + role simulator menu
- **Right rail (desktop only, sticky, hidden < lg)**
  - Search input (unified search across businesses, offerings, RFQs, posts)
  - "What's happening" — latest circular / bulletin item + top RFQ + trending topic chips
  - "Who to follow / New members" — 3 cards from `NewMembersList`
  - "Featured brands" — mini strip from `FeaturedBrandsStrip`
  - Ad slot (compact, from `AdSlot`)
  - Footer links row (About, Privacy, Terms, Contact)
- **Mobile**
  - Top bar: avatar (opens left-rail drawer) · centered logo · search icon
  - Existing `MobileBottomTabBar` retained but restyled: Home · Explore · Post (center FAB) · Notifications · Account
  - Right rail collapses into an "Explore" page

New component: `src/components/layout/AppShell.tsx` replacing `Layout.tsx` usage on all pages. `Header.tsx` and `Footer.tsx` are retired in-app (Footer moves to right-rail links + a compact strip on public/marketing routes only).

## 2. Home `/` — unified latest-first feed

Replaces current Hero + QuickActions + Category + New Products + New Members composition. Feed is a single virtualized stream of typed cards sorted by `created_at desc`, with sticky top tabs:

**Tabs:** `For You` · `Following` · `Market` · `RFQ` · `Bulletin`

**Card types** (all render inside the feed, visually distinct but rhythmically consistent):


| Card                            | Source             | Visual cue                                                         |
| ------------------------------- | ------------------ | ------------------------------------------------------------------ |
| Post (text/photo/pdf/poll/link) | `community_posts`  | Standard post, avatar + name + handle                              |
| Market signal                   | pinned/rate posts  | Left accent bar (gold)                                             |
| New product                     | `products` recent  | Dashed border, small "New Product" chip, image + masked price band |
| New member                      | `companies` recent | Dashed border, "New Member" chip, logo + verified badge            |
| New RFQ                         | `rfq_listings`     | Dashed border, "RFQ" chip, subject + qty range + expiry            |
| Bulletin / circular             | `circulars`        | Dashed border, "Bulletin" chip, title + PDF link                   |
| Ad                              | `advertisements`   | Faint "Promoted" label, image-only                                 |


Interleaving rule: merge all sources into one array, sort by timestamp, inject an ad every ~7 items. Top tabs filter the stream. `For You` = everything; `Following` = only posts + events from followed businesses (follow graph is future; for now falls back to all).

Right rail on `/` additionally shows the CategoryGrid as a compact vertical list.

## 3. `/market` becomes the "Market" tab view

`/market` renders the same feed component filtered to `post_type in (market_signal, admin_rate_update, general)` + pinned rate card at top. Compose sheet becomes the unified composer.

## 4. Unified composer

Single `PostComposer` sheet, opened from left-rail Post button, mobile FAB, and any "Ask the market" / "Post RFQ" CTA. Type switcher pill row at top: **Post · Photo · PDF · Link · Poll · Market Signal · RFQ**.

- Post/Photo/PDF/Link/Poll → writes to `community_posts` (+ attachments/polls tables) via existing `communityPosts.ts` repository.
- Market Signal → `community_posts` with `post_type = market_signal`.
- RFQ → opens the existing `CreateRfqSheet` flow inline (writes to `rfq_listings`); on success emits a system feed card.
- Anonymous toggle stays with its compliance-log explainer for post types that support it.

No backend change: everything routes through existing repositories.

## 5. Feed card interactions (X parity)

Each post card exposes: reply · repost (in-app share to feed as quote) · like · view count · bookmark · more (report/copy link/pin admin-only). Reply and quote-repost use existing `post_comments` and a new "quoted_post_id" convention rendered by referencing the original — no schema change; store the reference inside the post body as a lightweight `{quote:<uuid>}` prefix parsed on render (to keep backend untouched). Bookmark uses `localStorage` for now.

Deal Message CTA replaces "Contact seller" on member/product/RFQ cards and opens `StartDealRoomButton` — unchanged behavior, restyled.

## 6. Reskin every existing page under the new shell

Same routes, same data, restyled to the X visual language and density:

- **Directory / Members**: card list becomes a stacked row list (avatar · name · handle · verified · location · Follow / Deal Message). Filters move into the right rail.
- **Storefront / Brand / Product**: two-pane — left: profile header (banner + logo + verified + tabs Posts/Products/Brands/About), right: right rail with contact-reveal card (gated), similar members, and Deal Message CTA.
- **RFQ**: list = feed of RFQ cards; detail = post-style thread with quotations rendered as replies (using `rfq_quotations`, unchanged).
- **Deal Rooms / Deal Messages**: WhatsApp/X DM hybrid — left column: room list, right column: thread. Uses existing `deal_rooms` + `deal_messages`.
- **Dashboard / Account**: right rail replaced with settings nav; center column shows `OnboardingChecklist`, `InstallAppNudge`, `MembershipStatusCard`, activity.
- **Admin**: unchanged functionally; restyled tabs.
- **Bulletin / Knowledge / FAQ / About / Contact**: keep content, wrap in shell, tighten typography.
- **Login / Apply / Membership**: keep as centered marketing/auth pages, shell hidden.

Retired: `HomeHero`, `TodayHeader`, `QuickActionsGrid` (moved into left rail), `MembershipCTA` (moved to right rail), `LiveTicker` (moves to right rail "What's happening" strip).

## 7. Visual language — light, global-friendly

- Base: near-white surfaces (`hsl(0 0% 100%)` background, `hsl(210 20% 98%)` app bg), ink `#0f1419`, muted ink `#536471`, hairline borders `#eff3f4`. Matches X/Threads/LinkedIn light neutrality.
- Accent: keep gold `#d8a86a` but demote it — used only for primary CTA (Post, Deal Message, verified badge underline). No large gold surfaces.
- Verified: existing `success` token, kept.
- Radii: 16px cards, 9999px pill buttons, 12px inputs.
- Typography: Inter (already loaded). Sizes tightened to X scale: 15px body, 14px meta, 20px headings.
- Density: 12px vertical rhythm inside cards; feed cards separated by 1px hairline, not spacing.
- Dark mode kept but not the launch surface.

Implementation: rewrite `src/index.css` tokens for the light shell, keep dark block. Add new component primitives in `src/components/shell/*` (`AppShell`, `LeftRail`, `RightRail`, `FeedTabs`, `FeedCard`, `PostComposer`).

## 8. Rollout order

1. New tokens in `index.css` + shell primitives (`AppShell`, `LeftRail`, `RightRail`).
2. Feed engine (`useUnifiedFeed` hook that merges posts/products/members/RFQs/bulletin/ads) + `FeedCard` variants + `FeedTabs`.
3. Wire `/` and `/market` to the new feed; unified `PostComposer`.
4. Reskin Directory, Storefront, Product, Brand, RFQ, Deal Messages under the shell.
5. Reskin Dashboard, Account, Admin, Bulletin, Knowledge, FAQ, About, Contact.
6. Mobile pass: top bar, restyled bottom tabs, drawer, composer sheet.
7. Cleanup: delete retired components, update docs (`03-product-and-ux.md` + memory).

## 9. Non-goals (explicit)

- No schema, RLS, RPC, or edge-function changes.
- No renaming to DigiKhoj.
- No dark-mode launch surface, no theme toggle.
- No monetization/tier changes.

## 10. Technical notes

- `useUnifiedFeed({ tab })`: fires existing repository queries in parallel (`listFeedPosts`, `listRecentProducts`, `listRecentCompanies`, `listRfqs`, `listCirculars`, `listActiveAds`), tags each row with a `feedType`, sorts by `created_at`, injects ads every N.
- Quote-post encoding stays purely client-side (parsed prefix) so backend is untouched; can be migrated to a column later.
- Right-rail widgets are lazy-mounted below `lg` breakpoint via `hidden lg:block`.
- All existing routes in `src/routes.tsx` stay; only their inner layout changes.
- Docs to update after build: `src/content/docs/03-product-and-ux.md`, memory `mem://style/design-direction` and `mem://features/community-forum`.  
  
  
There is new follow graph table — Following tab.