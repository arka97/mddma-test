# Feed as Home, Discover tab, Reels

Market becomes the app's home. The old home page becomes "Discover". Bulletins fold into the feed. The feed gets a Reels mode and real repost/share/reply interactions open to every signed-in member.

## Navigation

- `/` renders the feed (current Market page). `/market` redirects to `/`.
- Old home content (Today header, quick actions, categories, new products, new members, membership CTA) moves to `/discover`.
- Bottom tabs (mobile): Home (feed) · Discover · RFQ · Firms · Account.
- Desktop nav: Home · Discover · Directory · Products · RFQ · Join, with More holding Brands, Knowledge, FAQ, About, Contact.
- `/circulars` and `/circulars/:slug` redirect to `/`. Bulletin links removed from nav, footer and sitemap.

## Home feed

- Top switcher with two modes: **Feed** and **Reels**.
- "Following" tab is removed; a single "For You" stream stays, with posts from people you follow boosted to the top.
- Topic chips and pinned rate cards stay in Feed mode.
- Bulletins published by admins are interleaved into the feed as bulletin cards (title, summary, attachment link, "Official" marker), sorted by publish date with normal posts. Admin bulletin CRUD stays in the admin panel.

## Reels

- Full-bleed vertical, snap-scrolling media viewer, one item per screen, autoplay muted with tap to unmute.
- Sources: community posts containing a video, community posts whose only media is an image, and seller product videos (`products.video_url`) shown with product name, price band and a link to the product page.
- Right-side action rail: like, reply, repost, share; caption and author (with verified badge) bottom-left.
- Composer gains video upload (single file, size-capped) alongside the existing photo/PDF/poll attachments.

## Interactions

- Reply, like, repost, bookmark and share are available to every signed-in user (guests see a sign-in prompt on tap; reading stays open).
- Repost becomes real instead of local UI state: a repost row per user/post, deduplicated, undoable, counted on the post, and surfaced in the feed as "X reposted" above the original post. Quote-repost is out of scope for this pass.
- Share uses the native share sheet with clipboard fallback, plus direct WhatsApp / X / LinkedIn targets.
- Posting stays open to signed-in members, except admin-only types (rate updates, bulletins, pinning), which remain admin-gated.

## Technical notes

- New table `post_reposts` (post_id, user_id, unique pair) with grants and RLS: read for all, insert/delete limited to own rows via the existing open-features helper.
- `community_posts.structured_data` carries a `video` media entry; `community-media` storage policies already cover member uploads, extended to video MIME types.
- Reels query unions recent video/image posts with recent products having `video_url`, ordered by recency, paginated.
- `src/pages/Index.tsx` becomes the feed shell (renaming the current Market page component); a new `src/pages/Discover.tsx` holds the old home sections.
- Circulars repository and admin CMS remain; only the public page and its routes/links are removed.
- SEO: `/` gets feed-appropriate title/description and stays noindex-free with public read; `/discover` keeps the previous home metadata; sitemap and prerender lists updated.
