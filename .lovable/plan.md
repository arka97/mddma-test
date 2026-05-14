## Embed Discourse into Community

Restructure `/community` so the new Discourse forum becomes the primary discussion surface, and the existing native posts/comments become a read-only archive.

### Tabs layout

Replace the current "All / Market Updates / Trade Discussions / Association Circulars" tabs with two top-level tabs:

1. **Discussions (Discourse)** — default tab. Loads Discourse embed pointing at `https://mddma.discourse.group/`.
2. **Archive (read-only)** — existing native posts list and detail view. Posting form and comment form removed; the previous category sub-tabs become a simple filter dropdown.

### Discourse embed component

New component `src/components/community/DiscourseEmbed.tsx`:

- Renders `<div id="discourse-comments" />`.
- On mount, sets `window.DiscourseEmbed = { discourseUrl, discourseEmbedUrl }` and injects `embed.js` once.
- Cleans up on unmount (removes the script tag and the global) so navigating between tabs/routes works.
- Adds the `<meta name="discourse-username" content="...">` tag dynamically via `react-helmet-async` (already mentioned in head-meta context — install if not present) OR via direct `document.head` mutation with cleanup.
- Props: `embedUrl: string` (page URL being embedded), `username: string` (Discourse author).

For the Community landing page, `embedUrl` will be `https://mddma.org/community` (canonical) so Discourse creates a single rooted topic list. A future per-thread integration on circulars/products is out of scope for this change.

### Configuration

- Discourse URL hardcoded to `https://mddma.discourse.group/`.
- Default `discourse-username`: ask user (placeholder `mddma_admin` for now — confirmed with user before shipping).
- No secrets needed; embed.js is public.

### Native archive cleanup

In `src/pages/Community.tsx`:
- Keep `load()`, post list, and detail view (read-only).
- Remove the "Start a discussion" sidebar card and `submitPost`.
- Remove `submitComment` and the comment textarea in detail view.
- Add a banner at the top of the Archive tab: "This archive is read-only. New discussions happen in the Discussions tab."
- Keep the post list, detail view, and comment display intact.

### Files

- New: `src/components/community/DiscourseEmbed.tsx`
- Edit: `src/pages/Community.tsx` — wrap content in two-tab Tabs, mount `<DiscourseEmbed />` in first tab, strip write paths from archive
- Edit: `mem://features/community-forum` — note Discourse is primary, native is archive
- Edit: `mem://index.md` — update the community-forum line

### Open question before implementation

I need the Discourse username that should be set as the default topic author for embedded pages (the `DISCOURSE_USERNAME` value). I'll ask in a follow-up after plan approval if you don't include it.

### Out of scope

- Per-thread Discourse embeds on individual circular/product pages
- SSO between Lovable Cloud auth and Discourse (Discourse handles its own auth in the iframe)
- Migrating archived posts into Discourse
