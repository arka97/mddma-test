# Fix Follow + For You / Following feed

## What's broken

Following anyone fails with a permission error. Confirmed cause: the `follows` table has row-level access rules for signed-in users (insert/read/delete your own follows), but the table itself was never granted to the signed-in role — so every follow request is rejected before the rules are even checked. No frontend bug.

## Changes

1. **Grant access to the follows table** (backend migration)
   - Allow signed-in users to read, create and remove their own follow rows; allow backend/admin role full access. Existing access rules already scope everything to the current user, so nothing new is exposed.

2. **Rename the "All" chip to "For You"**
   - Same behaviour (whole feed), new label.

3. **Add a "Following" chip**
   - Sits right after "For You".
   - Shows only posts authored by people connected to the businesses you follow (business owners and their team members).
   - Signed out or following nobody: friendly empty state ("Follow businesses to build your Following feed") with a link to Discover.

## Technical notes

- Migration: `GRANT SELECT, INSERT, DELETE ON public.follows TO authenticated; GRANT ALL ... TO service_role;`
- `src/components/market/TopicChips.tsx`: `all` chip label -> "For You"; add `following` pseudo-chip to the chip type (`TopicTag | "all" | "following"`).
- `src/pages/Home.tsx`: when topic is `following`, resolve followed company ids via `useFollowingSet()`, map to author user ids (company `owner_id` + `company_members.user_id`), then filter the loaded feed posts by `author_id`. Anonymous posts excluded.
- Follower resolution added as a small helper in `src/repositories/companies.ts` (or a new `listUserIdsForCompanies`) returning the author id set for a list of company ids.
