# Updates & Buzz — separating signal from noise

Rename the two main feed tabs and make them real content channels, with routing rules so business-critical information never gets buried under chatter.

- **Updates** (was "Feed") — the signal lane: price signals, market alerts, sourcing asks, bulletins/circulars, notices, market info, polls.
- **Buzz** (was "Reels") — the noise lane, by design: humor, gossip, member news, photos and videos. Stays the full-screen vertical swipe viewer.

## The noise problem, and how each rule fixes it

1. **Channel at the source.** Every post is created as either an Update or a Buzz. Nothing lands in Updates by accident — Buzz is a separate lane, not a filter applied afterwards.
2. **Updates is trade-only.** The Updates feed shows Update-channel posts plus bulletins. Buzz never appears there, even from accounts you follow.
3. **Structured beats freeform.** Choosing Update nudges the user into a post type (Price Signal, Market Alert, Sourcing, Poll, or plain Notice) with the relevant fields. Structured posts are scannable and filterable; a wall of text is not.
4. **A plain Update still needs substance.** Update posts with no post type, no commodity mention and under ~40 characters get an inline nudge: "This looks like chatter — post it as Buzz?" with a one-tap switch. Advice, not a hard block.
5. **Memes go to Buzz.** Choosing Update with an image or video but almost no text prompts the same switch, since image-only posts are the classic Updates-feed clutter.
6. **Freshness.** Price Signals and Market Alerts carry the day they refer to, and anything older than 7 days is de-emphasised in the Updates feed (dimmed "Older" divider) so stale rates don't read as today's rates.
7. **One rate post per commodity per day per author.** A second price post for the same commodity on the same day offers "Update your earlier post" instead of stacking duplicates — repeat rate spam is the biggest noise source in trade groups.
8. **Admin reclassification.** Moderation gets a one-tap "Move to Buzz" / "Move to Updates" so mistakes are corrected in seconds instead of being deleted.
9. **Buzz is opt-in.** Buzz has no unread badge and never interrupts Updates; users go there deliberately.

## What changes for users

- Chip row stays a single scrolling row: `Updates · Buzz · Bulletin · Price Signals · Market Alerts · Sourcing · Member News · Polls`. Swipe between chips keeps working.
- Buzz keeps the reels viewer: vertical snap-scroll of Buzz posts with an image or video, plus seller product videos as today.
- Post screen gets a two-way switch at the top: **Update** or **Buzz**.
  - Update: current composer with the structured options.
  - Buzz: media-first composer (photo/video/text), no structured trade fields.
  - Buzz with no image or video shows an inline hint that it will only be visible on the author's profile and post page.
- Member News stays available as a chip and is composed as Buzz.

## Existing posts

Rules-based backfill, run once:

- Updates: `price_signal`, `market_alert`, `sourcing_ask`, `poll`, `admin_rate_update`, and general posts with no media.
- Buzz: `member_news`, and general posts that carry an image or video.

## Technical notes

- Migration: add `channel text not null default 'updates'` to `public.community_posts` with a check constraint `('updates','buzz')` and an index on `(channel, created_at desc)`. Backfill existing rows with the rules above via a data update after the schema change.
- `create_business_post` / `create_business_poll_post` RPCs gain a `_channel` argument defaulting to `'updates'`, so posting stays on the existing security-definer path; `createPost` in `src/repositories/communityPosts.ts` passes it through.
- Duplicate-rate detection (rule 7) is a client-side check against the author's own recent Update posts in the loaded feed — advisory, not enforced in the database.
- `listFeedPosts` filters `channel = 'updates'` for all non-Buzz chips; topic chips keep filtering on `topic_tag`.
- `listPostReels` in `src/repositories/reels.ts` adds `.eq('channel','buzz')`.
- `TopicChips.tsx`: rename the `all` label to "Updates" and `reels` to "Buzz" (ids unchanged so state and swipe order code is untouched).
- `ComposeSheet.tsx`: Update/Buzz segmented control, structured controls hidden in Buzz mode, the two nudges from rules 4–5, and the channel sent on submit.
- `CommunityModerationTab.tsx`: show the channel and add the move action.
