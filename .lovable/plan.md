## Fix Discourse "refused to connect" on /community

### Root cause

Discourse's embed.js renders an `<iframe>` pointing at `https://mddma.discourse.group/embed/comments?embed_url=...`. Discourse refuses to render that iframe (sends `X-Frame-Options: DENY` / restrictive `Content-Security-Policy: frame-ancestors`) unless **two server-side settings on the Discourse instance** are configured. This is **not a code bug in the app** — the embed component is correct.

Additionally, Discourse Embeddable Hosts only generates topics for URLs they whitelist, AND the embed URL must be a real, publicly fetchable page (Discourse fetches it server-side to scrape title/content for the auto-created topic).

### What you need to do in the Discourse admin (one-time)

1. Go to `https://mddma.discourse.group/admin/customize/embedding`
2. Under **Embeddable Hosts**, add entries for every origin that will host the embed:
   - `mddma.org`
   - `www.mddma.org`
   - `mddma.lovable.app`
   - `id-preview--7f1be24f-5c82-46e1-b1af-5043034c22c0.lovable.app` (Lovable preview)
   - For each, set a **Category** (e.g., "Community") and **Posted by** user (e.g., `system` or your admin username)
3. Under **Embedding settings**:
   - Set `embed username key from feed` if you want the page's `<meta name="discourse-username">` to pick the author
   - Leave `embed truncate` on
4. Save. Reload `/community` — the iframe will then load.

### Code-side improvements (small, optional)

While the root fix is Discourse-side, I'll also tighten the embed component:

1. **Friendly fallback UI**: detect when the iframe fails to load within ~6s (no `discourse-comments` child rendered) and show a card with:
   - "The discussion forum is being set up. Visit it directly →" linking to `https://mddma.discourse.group/`
   - This keeps the page usable even before Discourse whitelisting is done.
2. **Use `window.location.href` as `embedUrl` for preview/dev environments** so each origin (preview vs prod) maps to a Discourse-whitelisted host. Today it's hardcoded to `https://mddma.org/community`, which means even after whitelisting, Discourse will fetch `mddma.org/community` to scrape topic content — fine for prod but the preview will share the same topic. If you'd like preview to be isolated, switch to `window.location.origin + '/community'`.

### Files to edit (only if you want the fallback + dynamic embed URL)

- `src/components/community/DiscourseEmbed.tsx` — add 6s timeout + fallback card; optionally derive `embedUrl` from `window.location`.
- `src/pages/Community.tsx` — drop the hardcoded `embedUrl` prop and let the component default to the current origin.

### Open question

Do you want me to:
- **(A) Just document the Discourse admin fix** (no code change) and you'll configure Discourse, or
- **(B) Also add the fallback card + dynamic embedUrl** so the page degrades gracefully while Discourse is being set up?

I'll ask via a follow-up after plan approval if you don't pick here.
