Wire up the four currently-stubbed compose actions in `/market` so members can attach photos, share PDFs, run polls, and post price ranges from the same New Post sheet.

## What changes

**1. Photo (paste + pick)**
- Multi-image upload (jpg/png/webp, ≤5 MB each, up to 4 per post) to a new public `community-media` storage bucket, path `posts/{user_id}/{uuid}.{ext}`.
- Support: file picker, drag-drop into textarea, and **clipboard paste** (Ctrl/Cmd-V of an image).
- Thumbnails render inside the compose sheet with a remove (×) button per image; URLs saved to `structured_data.images: string[]`.
- `PostCard` renders an image grid (1 / 2 / 2×2) under the text.

**2. File (PDF)**
- Single PDF upload (≤10 MB) to the same bucket under `posts/{user_id}/files/{uuid}.pdf`.
- Compose shows a pill chip with filename + size + remove button.
- Stored as `structured_data.file: { url, name, size }`; `PostCard` renders a download chip.

**3. Poll**
- Tapping **Poll** opens an inline poll editor inside the sheet (question, 2–4 options, duration 1/3/7 days).
- New `post_type = "poll"` + new topic chip "Polls" already exists in the UI — wire it up.
- New tables:
  - `post_polls (id, post_id unique, question, closes_at, created_at)`
  - `post_poll_options (id, poll_id, idx, label)`
  - `post_poll_votes (poll_id, option_id, voter_id, created_at, PK(poll_id, voter_id))`
- RLS: read open to whoever can read the parent post; vote insert restricted to paid/admin via `auth.uid() = voter_id`; one vote per user (PK).
- `PostCard` renders results bar chart after vote / after close; live counts via aggregated select.

**4. Price range (quick action)**
- Replace the **Signal** pill behavior so price posting is one tap: tapping **Signal** still opens the existing signal editor, but we add a dedicated **"Price"** quick-entry on the bottom row that jumps straight to the Price Signal form (commodity + min/max + unit) — the slowest existing flow becomes a single tap.
- Keep existing `price_signal` schema in `structured_data`; no DB change.

## Files

- `supabase/migrations/*` — create `community-media` bucket (public read, authenticated write own folder), poll tables + RLS + grants.
- `src/lib/uploads.ts` *(new)* — `uploadPostImage`, `uploadPostFile`, MIME/size validation.
- `src/components/market/ComposeSheet.tsx` — paste/drop handlers, image strip, file chip, inline poll editor, "Price" quick pill, send `images/file/poll` in `structured_data`.
- `src/components/market/PostCard.tsx` — render image grid, PDF chip, poll widget.
- `src/components/market/PollWidget.tsx` *(new)* — vote UI + results bar.
- `src/repositories/communityPosts.ts` — extend `PostType` with `"poll"`; helpers `castPollVote`, `getPollWithVotes`.
- `src/repositories/postPolls.ts` *(new)* — poll CRUD/vote queries.

## Behavior notes

- Only paid members + admins can attach media, files, or create polls (matches existing post permissions).
- Anonymous posts still allowed for media/poll; uploader user_id stored in storage path is server-only and not exposed via the post payload.
- All uploads happen on **Post** click (not on select) so cancelling the sheet uploads nothing; show inline progress.
- Post button stays disabled until at least one of: text, image, file, or valid poll is present.
