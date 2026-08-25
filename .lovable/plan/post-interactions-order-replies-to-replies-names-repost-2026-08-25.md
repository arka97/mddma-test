# Post interactions: order, replies-to-replies, names, repost

## 1. Action row: order and spacing

New order everywhere (feed card, opened post, Buzz/reels overlay): **comment · share · like · repost · save**.
Views (the small chart count) stays visible only on an opened post, placed after repost as today.
Buttons get equal spacing by switching the row to an even grid instead of `justify-between` with a grouped bookmark/share pair, so all icons sit on a consistent rhythm.

## 2. Share menu

Remove the **X** and **LinkedIn** entries. The menu keeps: Share via… (native sheet), Copy link, WhatsApp.

## 3. Usernames in replies

The opened-post page renders every reply as a hard-coded "Member" instead of using the author data the replies API already returns (verified: all 31 member profiles have names, and the replies sheet already shows them correctly). Fix the opened-post reply list to show avatar, name and relative time exactly like the replies sheet does.

## 4. Reply to a reply (X-style threading)

Replies are currently flat — there is no parent link stored. Add one level of visible threading like X:

- Store a parent reference on replies.
- Each reply gets a "Reply" action; tapping it targets that reply, and the composer shows a "Replying to <name>" hint that can be cleared.
- Child replies render indented under their parent, newest last; counts still include all replies.

## 5. Repost

Reposting writes to the database but the UI state is optimistic-only and never refetched, so it can look like nothing happened (and any failure shows a generic "Failed" toast with no reason). Changes:

- After a successful toggle, refetch the repost summary for that post so the count/highlight reflect the server.
- Surface the real error message when the call is rejected, so a permissions or mute block is visible instead of "Failed".
- Show a "You reposted" line on posts you have reposted, matching X.

If the refetch shows the toggle is in fact being rejected server-side for the reporting account, the exact rejection reason will now be in the toast and I will fix that cause as a follow-up.

## Technical notes

- `src/components/market/EngagementBar.tsx`: reorder actions, even spacing, drop X/LinkedIn from the dropdown (`src/lib/share.ts` share targets trimmed to WhatsApp).
- `src/pages/PostDetail.tsx`: render `author_name` / `author_avatar` from `listComments`, reuse the reply row markup from `CommentsSheet`.
- Migration: `alter table public.post_comments add column parent_id uuid references public.post_comments(id) on delete cascade;` plus an index; extend `add_business_comment(_post_id, _content, _parent_id)` (security definer, validates the parent belongs to the post). Existing grants/policies unchanged.
- `src/repositories/postComments.ts`: pass and return `parent_id`, group children under parents.
- `src/components/market/CommentsSheet.tsx` and `PostDetail.tsx`: per-reply Reply button, "Replying to" chip, indented children.
- `src/components/market/PostCard.tsx` and `src/components/reels/ReelsView.tsx`: repost refetch via `listReposts`, real error text, reposted label.
