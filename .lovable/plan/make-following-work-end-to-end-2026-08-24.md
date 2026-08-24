# Make Following work end to end

## What I found

Following is built only around **businesses**, and the business lookup is blocked for most accounts:

- The `follows` table can only store a followed **company**. There is no way to follow a person, so most posters (whose business is still pending review) show no Follow button at all.
- Of the 4 businesses in the database, only 1 is approved and visible. The Following feed resolves "whose posts do I see" by reading the followed company's owner from the public business view — that view only returns **approved, non-hidden** businesses, so following a pending business yields zero authors and an empty feed.
- Team members of a followed business are read from the members table, which only members themselves can read. For an outside follower this always returns nothing.
- Result today: exactly 1 follow row exists in the whole app, and its feed works only by luck.

## What I'll change

### 1. Follow people, not just businesses
- Extend follows so a row points at **either** a business or a person.
- Every post author becomes followable: if they have a business the follow attaches to the business; otherwise it attaches to the person.
- Anonymous posts stay unfollowable (no identity leak).

### 2. Fix the "whose posts do I see" lookup
- Replace the two blocked client queries with one secure backend function that returns the set of author ids behind everything I follow — owner + team of followed businesses (regardless of review status) plus directly followed people.
- Following a business you can see in the feed now works even while that business is pending review.

### 3. Follow button that actually sticks
- Show Follow on post headers, comments, profile and storefront using the new person-or-business target.
- Keep the optimistic toggle but surface a real error toast on failure instead of silently reverting, and refresh the Following feed as soon as the follow set changes.
- Signed-out taps route to sign-in and return to the feed.

### 4. Following tab behaviour
- Following lists posts from followed authors, newest first, including their bulletins-free plain feed.
- Empty state stays, but adds "People you may know" suggestions sourced from recent active posters, not only approved businesses.
- Suggested follows in the right rail switches to the same source so its buttons work.

## Technical notes

- Migration: `follows.followed_company_id` becomes nullable, add `followed_user_id uuid`, a check that exactly one is set, partial unique indexes on `(follower_user_id, followed_company_id)` and `(follower_user_id, followed_user_id)`, and a self-follow guard. RLS keeps "owner of the row only" for read/insert/delete; grants for `authenticated`.
- New security-definer function `get_followed_author_ids()` returning `setof uuid` (owners + `company_members` of followed companies + followed users), granted to `authenticated`. Also `list_suggested_follows(_limit int)` returning recent non-anonymous authors with name/avatar/company, excluding self and already-followed.
- `src/hooks/useFollow.ts`: cache keyed on a `{type, id}` target; single query loads both followed company ids and followed user ids.
- `src/repositories/companies.ts`: drop `listUserIdsForCompanies` usage from the feed in favour of the RPC.
- `src/pages/Home.tsx`: Following filter uses the RPC result; refetch on follow-set change.
- `src/components/social/FollowButton.tsx`, `PostCard.tsx`, `SuggestedFollows.tsx`, `CommentsSheet.tsx`: pass the new target shape.
- No visual redesign; existing tokens and layout stay as they are.
