## Goal
Add a new `/directorylist` route that shows the 211-member association roster from the uploaded Excel as a searchable, filterable, fully client-side list.

## Scope
- Public route — no auth, no Controlled-Transparency masking.
- Separate from `/directory` (which stays as the verified storefront cards page).
- Data bundled as static JSON; no DB changes.

## Steps

1. **Parse the Excel into JSON**
   - Read sheet 4 of `webside list (1).xlsx` (211 rows).
   - Generate `src/data/memberRoster.json` with fields:
     `{ srNo, companyName, memberName, address, mobile, fssai, gst, email }`
   - Trim whitespace, normalize empty cells to `null`.

2. **Create `src/pages/DirectoryList.tsx`**
   - `Layout` + `Seo` (noindex, since it contains member contact data).
   - `PageHeader` titled "Association Member List" with the total count subtitle.
   - **Search**: single `Input` that matches across company, member, address, mobile, GST, FSSAI, email (case-insensitive substring).
   - **Filters** (Selects):
     - Verification toggle: *All / Has GST / Has FSSAI / Has Email* (derived flags).
     - Alphabet quick-jump: A–Z chips that scroll/filter by company-name initial.
   - **Sort**: Company name A→Z (default), or Sr. No.
   - **Table view (desktop ≥ md)**: sticky-header table — Sr.No | Company | Member | Address | Mobile (tel: link) | FSSAI | GST | Email (mailto: link).
   - **Card view (mobile)**: stacked cards with the same fields, tap-to-call / tap-to-email.
   - Result counter ("Showing X of 211").
   - Empty state when filters yield 0.

3. **Register the route**
   - Add lazy import + `<Route path="/directorylist" element={<DirectoryList />} />` in `src/routes.tsx`.
   - No navbar/footer link changes unless requested later — page is reachable by URL.

## Technical notes
- Pure client-side filter/sort with `useMemo`; 211 rows is trivially fast — no virtualization needed.
- Reuse shadcn `Input`, `Select`, `Table`, `Card`, `Badge`.
- All contact fields shown to everyone (per user's answer); page marked `noindex` regardless so PII isn't crawled.
- Phone numbers rendered as `tel:+91…`, emails as `mailto:…`, with basic sanitization (skip if empty).
- No changes to `/directory`, DB, RLS, or any existing component.
