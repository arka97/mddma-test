# Fix "Member" names in the feed and missing push notifications

Two separate bugs, both confirmed by inspecting the live database.

## 1. Everyone shows as "Member"

The `profiles` table can only be read by the profile owner and admins (its only SELECT policy is `auth.uid() = id OR has_role(admin)`). Every place the feed looks up an author's name and avatar therefore comes back empty, so the card falls back to "Member" with a blank avatar. This affects all users, paid or not — it is not a membership issue.

Fix: add a security-definer function `get_public_profiles(_ids uuid[])` that returns only safe display fields (`id`, `full_name`, `avatar_url`, `company_name`, `verification_tier`) for signed-in users, leaving phone, GSTIN and other private columns locked behind the existing policy. Switch the display-only reads to it:

- `src/pages/Home.tsx` (feed authors)
- `src/pages/PostDetail.tsx`
- `src/repositories/postComments.ts` (comment authors)
- `src/pages/account/BookmarksPage.tsx`
- admin lists (`AdminModeration.tsx`, `CommunityModerationTab.tsx`, `AnonymousLogTab.tsx`) can keep direct reads since admins already have access

Anonymous posts keep showing "G-BAU-G Member" as they do today.

## 2. Push notifications never leave the database

The follow did create a notification row ("Aditya Parmar started following you"), and the recipient does have a registered Android push subscription. But the database helper that calls the push service uses `extensions.http_post`, while the `pg_net` functions actually live in the `net` schema. The call raises "function does not exist", which the helper swallows in its exception block — so `send-push` has never once been invoked (its logs are empty and the request queue is empty).

Fix:

- Rewrite `private.call_push` to call `net.http_post` (the real location), and stop swallowing errors silently — log a warning instead so a future misconfiguration is visible.
- Re-fire the pending notification once to confirm the Android device receives it end to end, then check the `send-push` logs and the pg_net response table for a 2xx.
- Add `notifications` to the realtime publication so the in-app bell badge updates instantly; today the table is not published, so the badge only refreshes on page load.
- iOS note: the iPhone subscription registered is Apple Web Push, which only delivers when the app is opened from the home screen — that already looks correct here.

## Verification

- Sign in as a second account, follow the first, and confirm: the bell badge increments live, the `/notifications` list shows the row, `send-push` logs a delivery, and the Android PWA shows a tray notification with sound.
- Confirm the feed shows real names and avatars for non-anonymous posts, and that phone/GSTIN are still not readable by other users.
