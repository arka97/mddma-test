## Hero section trust line cleanup

UI-only changes to `src/components/home/HeroSection.tsx`.

### Changes

1. **Remove the paragraph above the search bar** (lines 53-56) — "KYC-verified sellers · direct quotes."
2. **Replace the line below the search bar** (lines 82-85) — currently "All sellers are KYC-verified by MDDMA admin · GST · PAN · FSSAI · Bank". Replace with a polished single trust line:
   - **"Verified Sellers · Direct Quotes · GST · PAN · FSSAI"**
   - Drop the "Bank" item (matches the recent KYC removal of bank proof).
   - Use middot separators with subtle styling, BadgeCheck icon kept, dot-separated items in a slightly larger, refined treatment.
3. **Tighten spacing** to compensate for the removed paragraph: reduce `mb-8` on the (now removed) paragraph's slot by giving the heading `mb-8` directly, so the search bar sits at a comfortable distance below the headline. Keep the trust line `mt-4` below the search bar (slightly more breathing room than current `mt-3`).
4. **Beautify the trust line**: items rendered as inline pills/dots — small uppercase tracking, accent-colored dots between items, BadgeCheck in accent. Stays on one row on desktop, wraps cleanly on mobile.

### Result (text only)

Before:
```
[Heritage badge]
India's Digital Trade Hub
for Dry Fruits, Dates & Commodities

KYC-verified sellers · direct quotes.

[ Search input ............................. Find Sellers ]
✓ All sellers are KYC-verified by MDDMA admin · GST · PAN · FSSAI · Bank
```

After:
```
[Heritage badge]
India's Digital Trade Hub
for Dry Fruits, Dates & Commodities

[ Search input ............................. Find Sellers ]
✓ Verified Sellers · Direct Quotes · GST · PAN · FSSAI
```

No business logic, routes, or other files affected.