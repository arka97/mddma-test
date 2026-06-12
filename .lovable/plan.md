## Goal

Strip the bottom text bar ("Regency Snacks / Bhuta brothers" + "Learn more") from ad cards so the banner is image-only. The whole card stays clickable and the "Ad" badge stays.

## Changes

**`src/components/home/today/AdSlot.tsx`** (the ad shown on Home "Today" and `/products`)
- In `AdCard`, delete the bottom `<div className="flex items-center justify-between gap-3 p-2">…</div>` block (title + Learn more).
- Remove the now-unused `ExternalLink` import.

**`src/components/home/AdBanner.tsx`** (same pattern, used elsewhere)
- Apply the same removal: drop the title/ExternalLink footer `<div className="p-2 …">…</div>`, remove `ExternalLink` import.

## Out of scope
- No changes to ad data, placements, carousel behavior, or the "Ad" badge.
- No layout/aspect-ratio changes — image keeps `aspect-[32/5]` / `md:aspect-[728/90]`.
