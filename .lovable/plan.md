# Fix overflowing origin badge in Recent listings

## Problem
In `ListingRow`, the `origin` badge under the 56px thumbnail uses `absolute left-1/2 -translate-x-1/2` with no `whitespace-nowrap` or width cap. When `origin` is a long string like `"UNITED STATES"`, it wraps character-by-character into a vertical column that overflows the card — matching the screenshot ("UNI / TED / STA / TES").

## Fix
Edit `src/components/products/ListingRow.tsx`:

1. Add `whitespace-nowrap`, `max-w-[64px]`, `truncate`, and `leading-none` to the origin badge so long names stay on one line and ellipsize.
2. Shorten common long country names to ISO-style codes via a tiny map (`UNITED STATES → USA`, `UNITED KINGDOM → UK`, `UNITED ARAB EMIRATES → UAE`, `SOUTH AFRICA → ZA`, `AFGHANISTAN → AFG`). Anything else: take first 6 chars uppercased.
3. Keep visual position (bottom-center of thumbnail).

## Out of scope
- No DB or query changes.
- No changes to other listing surfaces unless they reuse `ListingRow` (they will inherit the fix automatically).
