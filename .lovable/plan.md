# Link Previews in Community Posts

When a user pastes a URL into the post body (or any text field that supports it), automatically fetch the link's Open Graph metadata and render a rich preview card (image + title + site name) inside the post — matching the Twitter behavior shown in your reference.

## Scope

- Applies to the `/market` Compose sheet — all post types (General, Price Signal, Market Alert, Sourcing Ask, Member News).
- One preview per post (the first detected URL in the content). Member News already has a dedicated link field; if filled, that link is used instead.
- Preview is fetched once at compose time, stored with the post, and rendered on every view (no per-view re-fetching).

## User experience

1. User types or pastes a message containing a URL.
2. On paste (or 600 ms after typing stops), the URL is detected and a small "Loading preview…" card appears below the textarea in the compose sheet.
3. Once metadata loads, the card shows image, title, and source domain — with an × to remove it if unwanted.
4. After posting, the same card renders inside the post in the feed, clickable and opening in a new tab.

## Technical plan

**1. New edge function `fetch-link-preview`** (public, no auth required since it's read-only metadata):
- Input: `{ url: string }`
- Validates `http/https` only, blocks private IP ranges.
- Fetches HTML with a 5 s timeout and 1 MB cap, parses `<meta property="og:*">`, `<meta name="twitter:*">`, `<title>`, and `<link rel="icon">`.
- Returns `{ url, title, description, image, site_name }` or `{ error }`.
- 10 s in-memory cache per URL to avoid hammering external sites.

**2. Store preview in `structured_data.link_preview`** on `community_posts` — no schema migration needed; the column is already `jsonb`.

**3. ComposeSheet additions**:
- URL detection regex on content change (debounced) and paste event.
- Calls the edge function and shows a `LinkPreviewCard` component.
- On submit, merges `link_preview` into `structured_data`.
- Member News `link` field reuses the same flow against `sd.link`.

**4. PostCard rendering**:
- New `LinkPreviewCard` component (image left/top, title + domain right/bottom, bordered, rounded).
- Rendered after `post.content` and after `StructuredBody`, only when `structured_data.link_preview` exists.
- Also auto-linkifies any plain URLs in `content` (clickable, opens in new tab) so the raw URL above the card behaves like Twitter's.

**5. Security**:
- Edge function rejects non-http(s), localhost, and RFC1918 addresses to prevent SSRF.
- Rendered preview image uses `referrerPolicy="no-referrer"` and `loading="lazy"`.
- Title/description are rendered as plain text (no HTML injection).

## Files

- `supabase/functions/fetch-link-preview/index.ts` — new
- `src/lib/linkPreview.ts` — client helper (URL detection + fetch wrapper)
- `src/components/market/LinkPreviewCard.tsx` — new shared card
- `src/components/market/ComposeSheet.tsx` — wire detection + preview state
- `src/components/market/PostCard.tsx` — render preview card + linkify content

No database migration, no RLS changes.