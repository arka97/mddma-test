## Goal
In product cards (and detail page), if a video exists, show it first in the carousel, then the images.

## Change
Edit `src/components/commodity/ProductMediaCarousel.tsx`:
- Reorder slide construction so the video slide (when `videoUrl` is present) is prepended before images, instead of appended after them.

```ts
const slides: Slide[] = [
  ...(videoUrl ? [{ type: "video" as const, src: videoUrl }] : []),
  ...(images ?? [])
    .filter((s): s is string => Boolean(s && s.trim()))
    .map<Slide>((src) => ({ type: "image", src })),
];
```

No other files need changes — `RecentListings`, `RecentListingsSection`, and `ProductPage` all consume this carousel and will inherit the new ordering automatically. Autoplay rotation, dots, and arrow nav all keep working since they're index-based.
