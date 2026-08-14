# Ad banner sizing: keep current slot, handle mixed advertiser artwork

## What the slot is today (stays unchanged)

The banner is capped at **728px wide**, centred, with a fixed shape:

- Mobile: aspect ratio **32:5** (e.g. 360 x 56 px)
- Desktop (md and up): aspect ratio **728:90** (classic IAB leaderboard)

The image is rendered with `object-cover`, so any artwork that isn't ~8:1 gets
**centre-cropped** — which is exactly the clipping seen in the three examples
(product packs and headlines cut off top and bottom).

We will keep this exact slot size. The fix is to accept varying creative sizes
and present them without clipping instead of cropping them.

## Recommended fix (three parts)

### 1. Publish one clear spec to advertisers
- Primary creative: **1456 x 180 px** (728x90 @2x), JPG/PNG/WebP, under 300 KB
- Keep logos and text inside a centre-safe band; no critical detail in the outer 8%
- Optional mobile creative: **720 x 200 px** (much closer to a phone's width)

### 2. Store the creative's own shape and stop hard-cropping
Add two optional fields to the advertisements record:
- `image_aspect` (auto-measured on upload in the admin panel)
- `mobile_image_url` (optional second creative for phones)

Rendering rule:
- If the creative is within ~15% of the slot ratio, keep `object-cover` (edge-to-edge, no visible loss).
- If it is taller/squarer than the slot, **letterbox instead of crop**: `object-contain` over a soft backdrop derived from the image (blurred copy of the same image behind it), so nothing important is cut and the banner still looks intentional.
- Slot height stays fixed at the current 32:5 mobile / 728:90 desktop values.

### 3. Guide the advertiser at upload time (admin panel)
In the ad create/edit form:
- Show the required spec above the file input
- After selecting a file, read its natural dimensions and show a live preview of exactly how it will appear in both mobile and desktop slots
- Warn (not block) when the ratio is off-spec: "This image will be letterboxed — a 1456x180 version will look sharper"
- Optional: a simple crop/reposition control (drag to set focal point) stored as `focal_y`, used as `object-position` so the advertiser chooses what survives the crop

## Scope of changes

- `src/components/home/today/AdSlot.tsx` — ratio-aware rendering, letterbox fallback, mobile creative support
- Admin ads form — spec copy, dimension read on upload, dual preview, off-spec warning, optional focal point
- One migration adding `image_aspect`, `mobile_image_url`, `focal_y` (all nullable, existing ads unaffected)

## Technical notes

Aspect measurement uses the browser's `naturalWidth/naturalHeight` at upload time
so no server-side image processing is needed. The blurred backdrop is the same
`image_url` rendered behind at `scale-110 blur-xl` — no extra asset or bandwidth.
Existing ads with no stored aspect fall back to today's behaviour until re-saved.

