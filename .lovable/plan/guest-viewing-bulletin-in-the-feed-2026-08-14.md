# Guest viewing + Bulletin in the feed

## 1. Signed-out users can see everything, but can't interact

Today the feed text loads for guests, but post images, videos and PDFs stay blank: post media lives in the private `community-media` storage bucket, and anonymous visitors have no read access there, so the signed URL request fails silently.

Changes:
- Allow read access to post media for anonymous visitors (read-only; uploads stay restricted to signed-in users).
- Keep interaction gated: reply, like, repost, bookmark and vote prompt sign-in for guests instead of erroring. Share stays open.
- Remove the guest overlay/teaser behaviour that hides feed content, so browsing is fully open.

## 2. Bulletin replaces the pinned Circulars block

- Delete the fixed "Circulars & Notices" card that currently sits above the feed on the home screen.
- Add a **Bulletin** chip to the topic chip row (after "Following").
- Selecting Bulletin shows a list of published bulletins (circulars) rendered as feed items, styled like posts, newest first.
- In "For You", bulletins interleave into the feed by date instead of sitting in a permanent card.

## Technical notes

- Storage: add a policy granting `anon` SELECT on objects in `community-media` (posts prefix). `PostMedia` continues to use signed URLs.
- `TopicChips.tsx`: add `bulletin` to `FeedTopic` union and the chip list.
- `Home.tsx`: drop `CircularsSection` import/usage; fetch circulars via existing `useCirculars` and merge into the feed stream (dedicated branch when `topic === "bulletin"`, date-merged when `topic === "all"`).
- New `BulletinCard` component in `src/components/market/` for feed-styled bulletin rendering (title, category badge, date, body excerpt, attachments link).
- Guest gating handled in `PostCard`/`EngagementBar`/`CommentsSheet` by routing unauthenticated actions to the login prompt.
