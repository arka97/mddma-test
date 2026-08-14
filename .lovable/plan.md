# Fix feed interactions for every signed-in user

## What's wrong

Both "open to everyone" switches are already ON in the backend (`features_open_to_all` and `verification_open_to_all` are both `true`), so the rules are not the problem this time.

The problem is that the feed still writes comments, likes, views and poll votes **directly to the tables**. Those tables intentionally allow no direct writes — all writing must go through the secure backend actions that were built for exactly this (they already respect the "open to everyone" switch). So every tap returns "You don't have permission to perform this action".

Confirmed for: commenting, liking, view counting, poll voting.

## The fix

Route each interaction through the existing secure backend action instead of the raw table:

- Comment -> `add_business_comment`
- Like / unlike -> `set_business_post_like`
- Post view tracking -> `record_business_post_view`
- Poll vote -> `cast_business_poll_vote`

Repost already uses the correct path and keeps working.

Also, an X/Instagram-style polish pass on the comments sheet:

- Remove the "Paid members can comment" message; any signed-in user can reply, guests see a "Sign in to reply" prompt.
- Show real author name and avatar on each comment (currently every comment shows "Member").
- Newest-first ordering, live count update, and optimistic like/repost/comment counters so taps feel instant.

## Technical notes

- `src/repositories/postComments.ts`: `addComment` -> `supabase.rpc("add_business_comment", ...)`, then refetch the row; join `profiles` in `listComments` for name/avatar.
- `src/repositories/postLikes.ts`: `likePost`/`unlikePost` -> `set_business_post_like(_post_id, _liked)`.
- `src/repositories/postViews.ts`: `recordView` -> `record_business_post_view(_post_id)`.
- `src/repositories/postPolls.ts`: `castPollVote` -> `cast_business_poll_vote(_poll_id, _option_id)`.
- `src/components/market/CommentsSheet.tsx` + `PostCard.tsx`: gate on `!!user` only, optimistic UI, author metadata.
- No database migration needed — the required functions and switches already exist.
