# Simplify navigation, X-style

Make the app feel like X: one account drawer holds everything, the header stays minimal, and the compose button no longer collides with the bottom bar.

## Header changes

- Remove the global search bar from the Home feed only (it stays on Discover, Directory, Products, RFQ).
- Left slot: replace the "G-BAU-G" wordmark with the user's avatar (account button). Tapping it opens a left slide-out drawer. Signed-out users see a "Login" button in that slot instead.
- Centre slot: keep the G-BAU-G logo mark (unchanged).
- Right slot: replace the current avatar/user menu with a notifications bell (with unread dot). Keep the install button.
- Deal rooms / chat icon moves out of the header.

## Account drawer (X-style)

Slide-out sheet from the left containing, in order:

- Profile header: avatar, name, email, company chip if present.
- Primary: Dashboard, My profile, My business / Register business, My storefront, My products, My brands, Bookmarks, My quotations.
- Navigation (everything the header dropdown and "More" menu used to hold): Home, Discover, Directory, Products, RFQ, Brands, Membership/Join, Knowledge, FAQ, About, Contact, Documents.
- Admin section (admins only): Moderation.
- Footer: company switcher, Install app, Sign out.

Signed-out state shows the same navigation section plus Login / Join buttons instead of the profile block.

## Bottom tab bar

Tabs become: Home · Discover · RFQ · Firms · Chat (deal rooms, with the activity dot). The Account tab is removed since account lives in the header drawer. Chat requires sign-in and redirects to login otherwise.

## Compose button overlap

Raise the floating compose button so it clears the bottom bar (bottom offset above the tab bar height plus safe-area inset) and drop its z-index below the tab bar, so it never sits on top of the tabs.

## Technical notes

- New `src/components/layout/AccountDrawer.tsx` using the existing shadcn `Sheet`; `Header.tsx` owns its open state.
- `Header.tsx`: accepts the feed context via `useLocation` to hide the search row on `/`; user dropdown replaced by drawer trigger; new `NotificationsButton` placeholder routing to `/messages` activity until a notifications feature exists (no backend change).
- `MobileBottomTabBar.tsx`: swap the Account tab for Chat using `useDealRoomsActivity` for the dot.
- `Home.tsx`: adjust FAB classes to `bottom-[calc(72px+env(safe-area-inset-bottom))] z-30`.
- Frontend only; no database or business-logic changes.
