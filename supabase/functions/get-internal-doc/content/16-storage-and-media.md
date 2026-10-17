# Storage, Media & Uploads

> **v3.3 · Documentation reviewed 17 October 2026.** Current source and selected hosted schema, policies, settings and buckets were checked. This is not a full security audit, legal approval or device-delivery certification.

## Hosted bucket inventory

| Bucket | Public URL | Intended assets / write boundary |
|---|---|---|
| avatars | Yes | Profile display media; owner-scoped |
| company-assets | Yes | Business logo/cover/gallery; business-authorised |
| product-images | Yes | Product cover + three-image gallery + video |
| ad-assets | Yes | Advertising creative; admin-write |
| circular-assets | **No** | Bulletin attachments; admin-write, authenticated published-reference/admin signing |
| community-media | **No** | Feed images/PDF/video; authenticated permitted insert, owner/admin delete; signed delivery |

Six buckets were read from the hosted project on 17 October 2026. Their `file_size_limit` and `allowed_mime_types` were unset; limits below are **client validation**, not proof of server-enforced caps. There is no KYC bucket in the current hosted inventory.

## Two upload helpers, different limits

| Surface / helper | Client limit | Supported types |
|---|---|---|
| Generic images, `lib/storage.ts` | **10 MB** | JPEG, PNG, WebP, GIF |
| Product video, `lib/storage.ts` | **100 MB** | MP4, WebM, MOV/QuickTime; only product-images |
| Bulletin PDF, `lib/storage.ts` | **25 MB** | application/pdf; only circular-assets |
| Feed images, `lib/uploads.ts` | **5 MB each**, **four** per post | JPEG, PNG, WebP, GIF |
| Feed file, `lib/uploads.ts` | **10 MB** | PDF only |
| Feed video, `lib/uploads.ts` | **50 MB** | MP4, MOV/QuickTime, WebM |

Generic validation rejects SVG MIME and `.svg` suffix. Unsupported feed-image MIME is rejected by its allowlist. Bulletin composer permits up to five selected attachments. Product gallery cap is also enforced by the product trigger: three extras plus cover, not four extras.

`UploadValidationError` communicates generic validation failure; `uploadFile` catches and returns null. Feed helpers throw storage/validation errors; callers must display the actual failure. Do not reuse generic product-video limits for feed uploads.

## Paths and privacy

Generic asset helper creates `<userId>/<timestamp>-<random>.<ext>`. Never put KYC documents in a public asset bucket.

Feed uploads deliberately ignore the userId argument for paths:

```text
posts/<opaque-uuid>/<opaque-uuid>.<ext>
posts/<opaque-uuid>/files/<opaque-uuid>.pdf
posts/<opaque-uuid>/videos/<opaque-uuid>.<ext>
```

Do not change the second segment to an author UUID; that would reintroduce an anonymous-author path leak. Storage ownership provides ownership semantics without exposing identity in the path. Avoid logging signed URLs or filenames that contain personal information.

## URL delivery

Public assets use `getPublicUrl`. Bulletin upload stores `private://circular-assets/<path>`; `signPrivatePath` mints a **3600-second** URL and caches it. Legacy stored signed URLs are passed through unchanged; they may expire and require migration rather than treating them as permanent references.

Feed rows store structured media paths; `getMediaSignedUrl` signs for **3600 seconds** by default and caches with a refresh margin. Private feed bucket still permits guest signing for opaque post paths by policy, so “private” does not mean feed media is confidential. Old second-level user-ID paths are excluded from anonymous signing by the checked policy.

Bulletin read/signing is authenticated and restricted to published attachment references (or admin). A guest can read public Bulletin text without necessarily being able to open its attachment. Do not make the bucket public to resolve signing errors.

## Overwrite and delete

Uploads use `upsert:false`. Hosted review returned **no UPDATE policy for community-media**; the older paid-only overwrite description is obsolete. Owner/admin delete exists. Private circular write/update/delete is admin-only.

To remove an asset: remove/replace its parent reference, verify readers no longer rely on it, then delete the object under an authorised identity. Parent-row deletion alone does not prove blob deletion. Inspect all image/gallery/video/structured attachment references before any orphan cleanup. Committee operators do not run cleanup SQL.

## Ad creative handling

Admin supports a primary creative and optional mobile creative, dimensions/ratio/focal settings, placements and dates. Recommended desktop 1456×180, mobile 720×200; preferably under 300KB. Mixed ratios are letterboxed/backdropped inside the **existing slot size**, not used to resize the page. Public ad bucket is admin-write; public logo/photo buckets must not be used as an ad-upload permission bypass.

## KYC and retention

No in-app KYC document upload/storage is currently shipped. Doc 23 describes a proposed private evidence workflow; provision reviewed private policies before implementing it. Do not imply the public buckets hold identity proofs.

No automatic orphan/retention job is confirmed. Doc 26 distinguishes draft retention commitments from absent automation; officer/developer review is required for deletions and legal holds. Do not promise backend resizing or permanent offline access to signed/private media.

## Failure checklist

Check type/size limit for the **correct helper**, storage ownership/path, session, policy, published-reference state and signed-link expiry. Test real image/PDF/video display and read-back with guest/member/admin where applicable. Check request errors before changing grants.
