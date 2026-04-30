## Goal

Remove all dummy/sample **member** data from the website (and verify the database is clean) so Directory, Storefront, Products, RFQ, and Member Profile pages only show real Lovable Cloud entries.

## Database

DB is already nearly empty — 1 real company (KGVPL), 2 real products, 1 profile, 1 RFQ. **No dummy data lives in the database**, so no migration or destructive query is required.

(If you want me to also wipe the 1 real company / 2 products / 1 RFQ for a fully fresh start, I'll need explicit confirmation — by default I'll keep them.)

## Codebase changes

The dummy member data lives in `src/data/sampleData.ts` and is consumed by ~10 files. I will remove the **member**-related dummies and update each consumer to rely solely on live data.

### Remove from `src/data/sampleData.ts`
- `Member` interface and `sampleMembers` array (the bulk of dummy members)
- `Product` interface and `sampleProducts` array (member-product join data — also dummy)
- `Advertiser` interface and `sampleAdvertisers` array (dummy sponsors)
- `committeeMembers` + `presidentMessage` (dummy "people")
- `LeadPack`/`sampleLeadPacks` (already deprecated per memory; clean up while here)
- `associationStats` (dummy "12,000 members" type counters)

### Keep in `src/data/sampleData.ts`
- `productCategories`, `commodityCategories`, `tradingAreas` — taxonomy/reference data, not member data
- `sampleNews`, `sampleCirculars` — content, not members; admin CMS owns live versions but these aren't dummy *members*
- `membershipTiers` — pricing config

### Update each consumer

| File | Change |
|------|--------|
| `src/lib/dataSource.ts` | Drop the `demoEntries` merge; return only live companies |
| `src/components/home/RecentListingsSection.tsx` | Source listings from live products instead of `sampleMembers` |
| `src/components/home/HeroSection.tsx` | Replace `associationStats` strings with static copy ("Mumbai's leading dry fruits & dates association") or counts derived from live DB |
| `src/components/layout/TrustStrip.tsx` | Same: remove member count; keep "Est. 1930s" only |
| `src/components/home/AdBanner.tsx` | Remove `sampleAdvertisers` fallback — show only live ads from `advertisements` table |
| `src/components/home/SponsorsSection.tsx` | Hide section if no live ads, otherwise render live ads only (or remove the component from `Index.tsx`) |
| `src/components/home/NewsSection.tsx` | Keep — uses `sampleNews` (content, not members) |
| `src/pages/About.tsx` | Replace committee grid + president message with simple "Leadership coming soon" placeholder |
| `src/pages/MemberProfile.tsx` | Already superseded by live `Storefront.tsx`; redirect `/members/:slug` → `/store/:slug` |
| `src/pages/Storefront.tsx` | Remove `demoMember` fallback; show 404 when no live company found |
| `src/pages/Products.tsx` | Source from live products via existing `useProducts` hook; remove `sampleProducts`/`sampleMembers` fallback |
| `src/pages/ProductPage.tsx` | Same — live product lookup only; 404 if not found |

### Empty-state UX

Since live data is sparse (1 company, 2 products), every list page will look mostly empty. I will add friendly empty states:
- Directory: "No verified members yet — check back soon."
- Products: "No live listings yet."
- Storefront/ProductPage: 404 with link back.

## Out of scope

- Deleting the 1 real company / 2 real products / 1 real RFQ (ask explicitly if wanted).
- Changes to RFQ engine, auth, ads CMS, forum.
- Removing `sampleNews` / `sampleCirculars` / `membershipTiers` (these are content/config, not member data).
