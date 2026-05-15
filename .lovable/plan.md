## Problem

The Add Product form rejects the uploaded MP4 (11.1 MB, 2160×3840, video/mp4). Cause: `src/lib/storage.ts` enforces a hard 10 MB limit for all uploads, including videos. Additionally, validation failures are swallowed (logged to console, return `null`) so the user sees no reason for the failure.

## Fix

1. `**src/lib/storage.ts**`
  - Split size limits: `MAX_IMAGE_BYTES = 10 MB`, `MAX_VIDEO_BYTES = 50 MB` (covers typical short product clips at 4K).
  - Apply the appropriate limit based on detected file type.
  - Surface validation errors to callers: throw `UploadValidationError` instead of swallowing, OR return a `{ url, error }` shape. Simpler: re-throw and let `uploadFile` callers catch.
2. `**src/pages/account/ProductsPage.tsx` (`handleVideo`)**
  - Wrap `uploadFile` in try/catch and toast the validation error message (e.g. "File is too large (max 50 MB)") instead of silently failing.
  - Same treatment for the image upload handler for consistency.

## Out of scope

- Storage bucket already has no server-side size or MIME restriction, so no migration needed.
- No change to allowed MIME types (mp4/webm/quicktime already permitted).