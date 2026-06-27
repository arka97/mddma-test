## Goal
Make `/market` link previews rich for **every** kind of URL — especially YouTube/video links, which currently fall back to the generic "YouTube" OG description with no thumbnail.

## Why current previews look empty
- `youtu.be` short-links return YouTube's consent/interstitial HTML, which only carries the generic `og:title="- YouTube"` and `og:description`, and no usable `og:image`. So our scraper produces a textual card with no thumbnail.
- Some sites (theprint.in etc.) do return `og:image`, but our card renders it as a tiny 80–96px side-thumbnail. The user wants a large WhatsApp-style hero preview.
- Direct media links (`.mp4`, `.jpg`, `.png`, `.pdf`) are not specially handled.

## Changes

### 1. `supabase/functions/fetch-link-preview/index.ts` — smarter scrape
- Detect **YouTube/Vimeo** before scraping:
  - YouTube (`youtube.com/watch?v=`, `youtu.be/<id>`, `youtube.com/shorts/<id>`, `youtube.com/embed/<id>`): call YouTube **oEmbed** (`https://www.youtube.com/oembed?url=...&format=json`) to get real title, author, and high-quality thumbnail (`https://i.ytimg.com/vi/<id>/hqdefault.jpg`). Return `kind: "video"`, `provider: "youtube"`, `video_id`, `embed_url` (`https://www.youtube.com/embed/<id>`), plus `image`, `title`, `site_name: "YouTube"`.
  - Vimeo: use Vimeo oEmbed similarly.
- Detect **direct media** by extension/content-type:
  - Image (`.jpg/.png/.gif/.webp/.avif`) → `kind: "image"`, `image: <url>`.
  - Video (`.mp4/.webm/.mov`) → `kind: "video"`, `video_url: <url>`.
  - PDF → `kind: "pdf"`.
- Existing OG scrape becomes the fallback `kind: "link"` path; also pick up `og:video`, `og:video:url`, `og:type=video.*` so generic articles with embedded video still expose a play affordance.
- Return shape (additive, backwards-compatible):
  ```ts
  { url, title, description, image, site_name,
    kind: "link" | "video" | "image" | "pdf",
    provider?: "youtube" | "vimeo",
    video_id?: string, embed_url?: string, video_url?: string }
  ```

### 2. `src/lib/linkPreview.ts` — extend `LinkPreview` type with the new optional fields. No call-site changes needed (existing callers keep working).

### 3. `src/components/market/LinkPreviewCard.tsx` — WhatsApp-style layout
- New **hero layout** when `image` is present (default for video/image/og-with-image): full-width image on top (16:9, `aspect-video object-cover`), title/description/site beneath. Replaces the tiny side-thumbnail layout.
- For `kind: "video"` (YouTube/Vimeo/og:video): overlay a circular ▶ play button on the thumbnail. Clicking opens the original URL in a new tab (keeps current behavior; no inline iframe to avoid CSP/tracking complications and keep the compose sheet light).
- For `kind: "image"`: show the image directly with site chip below.
- For `kind: "pdf"`: PDF icon + filename + host.
- Compact text-only layout retained as fallback when no image and not media.
- Keep the existing `onRemove` X button and `loading` overlay.

### 4. `PostCard.tsx` / `ComposeSheet.tsx`
- No API changes — they already pass `preview` through. Inherit the new rich rendering automatically.

## Out of scope
- Inline video playback / embedded iframes (privacy + layout cost). Tap-through to source remains the behavior, matching the current pattern.
- Backfilling previews on existing posts — new posts get the richer payload; old posts still render with whatever was stored.
