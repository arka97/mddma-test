# X + Instagram style navigation

Rebuild the app shell so it behaves the way people already expect from X and Instagram: avatar drawer for everything personal, a slim header, a five-slot bottom bar with a centre create button, and no floating button fighting the tabs.

## Home header (mobile)

```text
[ avatar ]        [ G-BAU-G logo ]        [ bell ]
   For You  Reels  Following  Bulletin  Price Signals →
```

- Search bar removed from Home (it stays on Discover, Directory, Products, RFQ, where searching is the point).
- Left: user avatar. Tap opens the account drawer. Signed out: a person icon that opens the same drawer in its logged-out state.
- Centre: G-BAU-G logo mark only.
- Right: notifications bell with an unread dot.
- Topic chips sit directly under the header and stay sticky while scrolling, exactly like X's feed tabs. The ad slot moves below the chips so the chips are the first thing under the header.

## Account drawer (X's left slide-out)

Slides in from the left over a dimmed backdrop.

- Top: large avatar, display name, email, and a Following / Followers count row.
- Big-type primary list (X uses oversized rows, easy thumb targets): Profile, My business, My storefront, My products, My brands, Bookmarks, My quotations, Dashboard.
- Divider, then Explore: Discover, Directory, Products, RFQ, Brands, Membership, Knowledge, FAQ, About, Contact, Documents.
- Divider, then Admin (admins only): Moderation.
- Bottom strip: company switcher, Install app, Settings/Sign out.
- Signed out: the same Explore list with Login and Join buttons at top.

## Bottom bar (Instagram's five slots)

```text
  Home     Discover     ( + )      RFQ      Chat
```

- Home — the feed.
- Discover — search/browse (magnifier icon, matching Instagram's search tab).
- Centre Create button — filled burgundy circle that opens the compose sheet. This replaces the floating post button entirely, which is what fixes the overlap.
- RFQ — the trade board.
- Chat — deal rooms, with the activity dot. Requires sign-in.
- Account leaves the bottom bar; it lives in the header avatar drawer.

## Compose

The floating action button is deleted. Compose opens from the centre tab on every page, so posting is always one thumb tap away and nothing ever covers the tab bar.

## Technical notes

- New `src/components/layout/AccountDrawer.tsx` (shadcn `Sheet`, side left) holding the profile block, nav sections, and footer actions; opened from `Header.tsx` and reused on desktop from the avatar.
- New `src/components/layout/NotificationsButton.tsx` — bell with dot; routes to a notifications view backed by existing deal-room/comment activity signals. No schema change.
- `Header.tsx`: three-slot grid becomes avatar / logo / bell + install; the current dropdown user menu and its links move into the drawer; search row renders only when `location.pathname !== "/"`.
- `MobileBottomTabBar.tsx`: five slots with a raised centre create button; centre button lifts `ComposeSheet` state into the tab bar (or `Layout`) so it works on all routes.
- `Home.tsx`: remove the fixed FAB; keep the chip swipe behaviour; move the ad slot below the sticky chips.
- Desktop keeps the horizontal nav links; drawer and bell also appear there.
- Frontend and presentation only — no database or business-logic changes.
