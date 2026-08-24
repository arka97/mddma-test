# Updates & Buzz

Rename the two main feed tabs and turn them into real content channels.

- **Updates** (was "Feed") — text-first, business-relevant: price signals, market alerts, sourcing asks, bulletins/circulars, notices, market info, polls.
- **Buzz** (was "Reels") — light content: humor, gossip, member news, photos and videos. Stays the full-screen vertical swipe viewer.

## What changes for users

1. Chip row stays a single scrolling row: `Updates · Buzz · Bulletin · Price Signals · Market Alerts · Sourcing · Member News · Polls`. Swipe between chips keeps working.
2. The Updates feed shows only Updates-channel posts plus bulletins — Buzz content no longer clutters it (this is the noise filter).
3. Buzz keeps the reels viewer: vertical snap-scroll of Buzz posts that have an image or video, plus seller product videos as today.
4. On the Post screen, a clear two-way switch at the top: **Update** or **Buzz**.
   - Update: current composer with the structured options (price signal, market alert, sourcing, poll).
   - Buzz: media-first composer (photo/video/text), no structured trade fields.
   - Choosing Buzz without any image or video shows an inline hint that Buzz posts need a photo or video to appear in the Buzz viewer; the post is still allowed and shows on the author's profile/post page.
5. Member News stays available as a chip, and new Member News posts are composed as Buzz.

## Existing posts

Rules-based backfill, run once:

- Updates: `price_signal`, `market_alert`, `sourcing_ask`, `poll`, `admin_rate_update`, and general posts with no media.
- Buzz: `member_news`, and general posts that carry an image or video.

## Technical notes

- Migration: add `channel text not null default 'updates'` to `public.community_posts` with a check constraint `('updates','buzz')`, plus an index on `(channel, created_at desc)`. Backfill existing rows with the rules above (data update via SQL after the schema change).
- `create_business_post` / `create_business_poll_post` RPCs gain a `_channel` argument (defaulting to `'updates'`) so posting stays on the existing security-definer path; `createPost` in `src/repositories/communityPosts.ts` passes it through.
- `listFeedPosts` filters `channel = 'updates'` for all non-Buzz chips; topic chips continue to filter on `topic_tag`.
- `listPostReels` in `src/repositories/reels.ts` adds `.eq('channel','buzz')` so Buzz shows only Buzz media, not every media post.
- `TopicChips.tsx`: rename `all` label to "Updates", `reels` label to "Buzz" (ids kept so existing state/order code is untouched), keep single-row layout and `FEED_TOPIC_ORDER`.
- `ComposeSheet.tsx`: add the Update/Buzz segmented control, hide structured post-type controls in Buzz mode, and send the channel on submit.
- Admin moderation list shows the channel and allows switching a post between Updates and Buzz.
