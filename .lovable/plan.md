## Goal
Make Origin and Category dropdowns on `/products` searchable, and apply the same to the seller product form. Also introduce the 60-country canonical origin list from the previous message.

## Changes

### 1. `src/lib/originCountries.ts` (new)
Exports `ORIGIN_COUNTRIES: string[]` — the 60 countries you listed, alphabetically sorted. Single source of truth for buyer filters and seller forms.

### 2. `src/components/ui/SearchableSelect.tsx` (new)
Reusable wrapper around shadcn `Popover` + `Command` (already in the project). Behaviour:
- Trigger styled like the current `<Select>` (same height, border, chevron, semantic tokens).
- Popover opens with a search input on top and a scrollable, keyboard-navigable list.
- Case-insensitive substring filter as the user types.
- Optional "All …" entry at the top for filter use cases.
- Optional per-item `aliases` so typing "kaju" still surfaces "Cashews" in the Category picker.
- Empty state: *"No matches."*
- Keyboard: ↑/↓ navigate, Enter select, Esc close.
- Popover width matches trigger width; mobile-friendly.

### 3. `src/pages/Products.tsx`
- Replace **Category** `<Select>` with `<SearchableSelect>` fed by `curatedCats` (each item carries its `aliases`).
- Replace **Origin** `<Select>` with `<SearchableSelect>` fed by `liveOrigins` if non-empty, else `ORIGIN_COUNTRIES`.
- Keep **Stock Level** as a plain `<Select>` (only 4 fixed options).
- Top free-text search bar and the alias→category auto-filter logic stay unchanged.

### 4. `src/pages/account/ProductsPage.tsx`
- Swap Category and Origin inputs to the same `<SearchableSelect>`, sourcing categories from `useProductCategories()` and origins from `ORIGIN_COUNTRIES`. Same controlled vocabulary for sellers and buyers.

## Out of scope
- No DB schema change. `products.origin` and `products.category` remain free-text. Legacy values ("USA", old categories) keep rendering unchanged.
- No normalization of existing rows.
- No country aliases (unlike categories).

## Acceptance
1. `/products` → Category dropdown is searchable; typing "kaj" highlights Cashews.
2. `/products` → Origin dropdown is searchable; typing "viet" highlights Vietnam; full 60-country list shows when no live origins exist.
3. Stock Level dropdown unchanged.
4. Seller Add Product form uses the same searchable dropdowns for Category and Origin.
5. Keyboard navigation works (↑/↓/Enter/Esc).

## Files
- new `src/lib/originCountries.ts`
- new `src/components/ui/SearchableSelect.tsx`
- edit `src/pages/Products.tsx`
- edit `src/pages/account/ProductsPage.tsx`
