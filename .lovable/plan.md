## Trim hero trust line

UI-only change to `src/components/home/HeroSection.tsx`.

### Change

Remove the `GST`, `PAN`, and `FSSAI` items from the trust line under the search bar. Keep only **Verified Sellers • Direct Quotes** with the BadgeCheck icon.

In the trust-line block, the items array shrinks from:
```ts
["Verified Sellers", "Direct Quotes", "GST", "PAN", "FSSAI"]
```
to:
```ts
["Verified Sellers", "Direct Quotes"]
```

The dot separator logic and styling stay the same — it will render as:

```
✓ VERIFIED SELLERS • DIRECT QUOTES
```

No other files affected.