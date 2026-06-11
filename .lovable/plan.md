## Goal
Let admins attach up to 5 files (PDF / JPG / PNG / WEBP) per circular in the admin CMS. Images render inline on `/circulars`; PDFs appear as labelled "Open PDF" buttons. Members never upload — admin only.

## Scope
- Admin upload UI in `/account/moderation` → Circulars tab
- Public render on `/circulars`
- New storage bucket `circular-assets` (public read, admin-only write)
- New `attachments` column on `circulars`

## Out of scope
- Member-submitted circulars
- Per-attachment captions or reordering after save (admins can re-upload by editing later)
- Thumbnail generation for PDFs

---

## Technical details

### 1. Storage bucket
Create public bucket `circular-assets` via `storage_create_bucket`. RLS on `storage.objects`:
- `SELECT`: public (bucket is public-read like other media buckets)
- `INSERT / UPDATE / DELETE`: only `has_role(auth.uid(), 'admin')`

Path convention: `<admin_user_id>/<timestamp>-<rand>.<ext>` — matches existing `uploadFile()` helper.

### 2. Schema migration
Add to `public.circulars`:
```sql
ALTER TABLE public.circulars
  ADD COLUMN attachments jsonb NOT NULL DEFAULT '[]'::jsonb;
```
Shape per item: `{ "url": string, "name": string, "type": "pdf" | "image", "mime": string, "size": number }`.

Add a trigger to cap at 5 entries (mirrors `enforce_product_gallery_limit`):
```sql
CREATE FUNCTION public.enforce_circular_attachments_limit() ...
  IF jsonb_array_length(NEW.attachments) > 5 THEN RAISE ...
```

### 3. Storage helper (`src/lib/storage.ts`)
- Extend `uploadFile` bucket union with `"circular-assets"`.
- Add PDF support: allow `application/pdf` (max 25 MB) when bucket is `circular-assets` or via a new `allowPdf` flag. Keep SVG rejection.

### 4. Admin UI — `src/pages/account/AdminModeration.tsx` Circulars tab
- Add `files: File[]` to `circularForm` state.
- New `<input type="file" multiple accept="application/pdf,image/jpeg,image/png,image/webp">` with a chip list of selected files and a remove-per-file button. Cap at 5; validate types/sizes client-side using `validateFile`.
- On save: upload each file via `uploadFile("circular-assets", user.id, f)`, build the `attachments` array, then `insert`/`update` the circular row with it.
- Existing circular list rows: show count badge "N attachments" and a "Replace files" button that opens a small inline editor (re-upload replaces the whole array — simpler than per-item edits).
- Update `load()` and `circulars` state shape to include `attachments`.

### 5. Repository — `src/repositories/circulars.ts`
Extend `CircularRow`:
```ts
attachments: Array<{ url: string; name: string; type: "pdf" | "image"; mime: string; size: number }>;
```
Update `select("*")` (already wildcard — no change) and the typed cast.

### 6. Public render — `src/pages/Circulars.tsx`
Under each circular `CardContent`, after the body:
- Images → 2-col responsive grid of `<img loading="lazy" class="rounded-md border" />` linking to full-size in a new tab.
- PDFs → row of `<a href target="_blank" rel="noopener">` styled as outline `Button` with `FileText` icon + filename + size label, e.g. `📄 GST_Notice.pdf (412 KB)`.
- Update the local `Circular` interface to include `attachments`; the existing select needs `attachments` added explicitly.

### 7. Sanity & limits (frontend)
- Reject SVG (already enforced in `validateFile`).
- Image cap 10 MB (existing), PDF cap 25 MB (new).
- Total ≤ 5 files per circular; show inline error before submit.
- Toast on per-file upload failure but continue with the rest, then save circular with what succeeded.

### 8. Docs/memory
- Update `mem://features/advertising-system`? No — separate feature. Add note under `mem://architecture/database-design` about new `attachments` column + bucket.
- Append a short section to `supabase/functions/get-internal-doc/content/16-storage-and-media.md` for the new `circular-assets` bucket. Re-run `bunx tsx scripts/build-internal-docs-bundle.ts`.

---

## Files touched
- `supabase/migrations/<new>.sql` — column + trigger
- `src/lib/storage.ts` — PDF support + bucket union
- `src/repositories/circulars.ts` — type
- `src/pages/account/AdminModeration.tsx` — upload UI in Circulars tab
- `src/pages/Circulars.tsx` — render attachments
- `supabase/functions/get-internal-doc/content/16-storage-and-media.md` + regen bundle
- `mem://architecture/database-design` — note new column/bucket