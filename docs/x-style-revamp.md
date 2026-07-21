# G-BAU-G — X.com-style UI/UX revamp

**Scope of this pass:** re-skin the app to an X.com look, make the feed feel like a
real social product (tap an image, tap a handle, follow an account, open a post),
and keep the Supabase backend untouched. App name stays **G-BAU-G**.

This is a *starting point that closes the biggest interaction gaps* — not the finished
product. The forward plan (§4) lists what's next.

---

## 1. What changed in this pass

### Design system → X palette (repaints the whole app)
`src/index.css` tokens were re-themed in place (names kept, values swapped), so all
~28 pages inherit the new look without per-page edits:

| Token | Before (warm cream/gold) | After (X) |
| --- | --- | --- |
| `--background` | cream `#FFF7EC` | white `#FFFFFF` (light) / pure black `#000` (dark "lights out") |
| `--foreground` | navy `#000428` | X ink `#0F1419` |
| `--primary` | gold `#D8A86A` | **X blue `#1D9BF0`** |
| `--border` | navy-tinted | X hairline `#E1E7EA` |
| `--muted-foreground` | navy 35% | X secondary `#536471` |

New social-action tokens added and registered in Tailwind: `--like` (`#F91880`),
`--repost` (`#00BA7C`), `--verified` (`#1D9BF0`) → usable as `text-like`, `text-repost`,
`text-verified`. Buttons were flattened to X-style pills (no colored glow).

> Dark mode uses X's "lights out" pure-black. There is no theme toggle wired yet, so
> the app renders light by default; the dark tokens are ready for a future toggle.

### Feed is now a real X feed
- **Tap an image → full-screen lightbox** (`src/components/ui/lightbox.tsx`): backdrop
  close, prev/next, keyboard arrows, swipe on mobile, `n / total` counter, scroll lock.
  Wired into `PostMedia` with an X media grid (1 wide · 2 side-by-side · 3 = tall+stack ·
  4 = 2×2, with a `+N` overflow badge).
- **Tap a handle/avatar → profile**: post authors now resolve to their storefront via
  `companies_public.owner_id → slug` (`listCompaniesByOwners`), so the name, `@handle`,
  and avatar link to `/store/:slug`. Verified businesses get a blue check.
- **Tap a post → detail page** (`/market/:postId`, `src/pages/PostDetail.tsx`): the whole
  card is clickable (interactive children are excluded via a `closest()` guard), the
  timestamp is a keyboard-focusable link, and the detail page shows the post large with an
  inline reply composer + replies.
- **Follow** (`src/lib/follow.ts`, `useFollow`, `FollowButton`): X-style Follow / Following
  (hover → Unfollow) pill on every author. **Client-side for now** (see §3).
- **X action bar** (`EngagementBar`): reply · repost · like (heart) · views · bookmark ·
  share, with X hover tints. Like is wired to the real backend; repost/bookmark are local
  toggles; share uses the Web Share API / clipboard.
- Feed re-laid out as a 600px column, edge-to-edge on mobile with hairline dividers
  (`divide-y`), side borders on desktop — the X single-column feed.

### Mobile shell
- Bottom tab bar restyled (icon-forward, bolded active state, **avatar on the Account
  tab**). Compose is a round X-blue FAB (feather icon) on mobile, pill on desktop.
- Header search is now a clean X pill (borderless, focus-blue).

### Backend
Untouched. Two **read-only** repository helpers were added against existing objects:
`getPost(id)` and `listCompaniesByOwners(ids)` (public view only — no contact columns).

---

## 2. Files

```
Design system      src/index.css · tailwind.config.ts · src/components/ui/button.tsx
Lightbox           src/components/ui/lightbox.tsx · src/components/market/PostMedia.tsx
Follow             src/lib/follow.ts · src/hooks/useFollow.ts · src/components/social/FollowButton.tsx
Feed               src/components/market/PostCard.tsx · EngagementBar.tsx · src/pages/Market.tsx
Post detail        src/pages/PostDetail.tsx · src/routes.tsx
Repos (read-only)  src/repositories/communityPosts.ts · companies.ts
Shell              src/components/layout/MobileBottomTabBar.tsx · Header.tsx
```

Verified: `tsc --noEmit` clean · `eslint` 0 errors · `vite build` OK · 11/11 tests pass.

---

## 3. The one honest caveat — Follow is client-side

The brief says *keep the backend as-is*, and there is no `follows` table. So follow state
lives in `localStorage` (`gbaug:following:v1`) behind a deliberately small, swappable
interface. It is real and instant per device, but **does not persist server-side or drive
the feed yet.** Repost and bookmark are the same (local visual toggles).

To make follow first-class, the backend needs (one small migration):

```sql
create table follows (
  follower_id uuid references profiles(id) on delete cascade,
  followee_company_id uuid references companies(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (follower_id, followee_company_id)
);
-- RLS: a user may read their own follows and insert/delete rows where follower_id = auth.uid()
```

Then swap the four function bodies in `src/lib/follow.ts` for Supabase calls (make them
async) — no caller changes. Same shape works for `bookmarks` and `reposts`.

---

## 4. Brainstorm — where to take it next

The app today is the MDDMA member portal. The product target (per the spec) is an
**international, verified B2B network for food trade**: X-style feed + non-transactional
marketplace for Trade Associations and their members, on the community → discovery →
commerce flywheel (the Kirana Club model). Mapping that onto an X-shaped UI:

### 4a. Highest-leverage next steps (build order)
1. **Follow that means something** (§3 migration) → then a **"Following" vs "For you"
   feed toggle** at the top of `/market`, exactly like X. This is the flywheel's first turn.
2. **Real profiles as the identity home.** Today a "profile" is the storefront
   (`/store/:slug`). Give it the X profile shape: banner + avatar + name + `@handle` +
   verified + bio + **Follow** + tabs (Posts · Offerings · RFQs · About). Authors without a
   storefront currently aren't linkable — add a lightweight `/u/:id` profile so *every*
   handle opens.
3. **@mentions + hashtags** in posts and the composer (linkify `@handle` → profile,
   `#commodity` → filtered feed). Cheap, and makes the network feel connected.
4. **Unified search** (spec §13) as an X **Explore** tab: one bar, grouped results across
   Businesses · Offerings · RFQs · Associations · Communities · Trade Shows. Replaces the
   product-only header search.
5. **System-generated market-event cards** (spec §9): "Product listed", "RFQ opened",
   "Seller approved", "Member verified" as visually distinct dashed-border auto-cards with a
   Posts / Market Events / All filter — reuses the `PostCard` shell.

### 4b. Marketplace surfaces in X clothing
- **RFQ** → render like a poll/quote card in-feed with a clear "Respond" CTA; RFQ detail
  mirrors the post-detail layout.
- **Deal Messages / General messages / Communities** (spec §10–11) → an X **Messages**
  tab with three thread types (1:1 follow-gated · Deal Message commercial threads ·
  WhatsApp-style Community group chats), visually badged.
- **Storefront/Offering** pages → keep full catalog depth but adopt the X profile chrome
  so browsing a business feels continuous with the feed.

### 4c. Polish debt to clear
- Wire a **theme toggle** (light / dim / lights-out) — tokens already exist.
- Give **empty states** the X treatment (illustration + one clear action) across Directory,
  Products, RFQ, feed.
- **Notifications** tab (spec §14, tiered) — even in-app-only first.
- Sweep the ~20 remaining semantic amber literals onto `--warning` for full tokenization.
- Reduce the two-header stack on feed pages (global header + section header) toward a
  single X-style per-screen top bar once profiles/search move into it.

### 4d. Open questions (unchanged from spec §17)
- "Deal Message" vs "DM" label in the UI.
- Monetization / tiering — parked; no gating until pricing is designed.

---

*Nothing here changes data or access control. Treat the follows/bookmarks tables as the
first coordinated backend step whenever you're ready to make the social graph real.*
