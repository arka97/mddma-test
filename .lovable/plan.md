## Goal

The seller "Add product" form already wires both Category and Origin to the new `SearchableSelect`, but in your browser the Category popover doesn't filter as you type and the Origin popover appears empty. Both symptoms point at the same root cause: how `SearchableSelect` is currently wired into `cmdk` and how it behaves inside a Radix `Dialog`. This plan fixes the component so both fields are reliably searchable inside the Add/Edit Product dialog.

## Root cause

`src/components/ui/SearchableSelect.tsx` today does two fragile things:

1. It sets `<CommandItem value={haystack}>` where `haystack` is `"label + aliases"` lower‑cased. `cmdk` requires each item's `value` to be **unique** and uses it as the item's identity. For Origin, all 60 items only contain their label, so values are unique — but for Category, when an item has no aliases the value collapses to just the label and the parent `<Command filter={...}>` callback receives that string. The custom filter then runs against the typed query, but `cmdk` *also* runs its own internal scorer on the same `value`, which can suppress matches when our haystack contains punctuation like `’` (Côte d'Ivoire) or spaces.
2. Inside a Radix `Dialog`, the `Popover` is portalled to `document.body` but the Dialog's focus trap can swallow the first keystroke into `CommandInput`, which is why typing "feels" like it does nothing.

For Origin specifically, the dropdown does open but the country list scrolls below the visible Dialog viewport on a 1086×674 preview, so it looks "empty" when it actually rendered off-screen.

## Changes

### 1. `src/components/ui/SearchableSelect.tsx` — make the searchable select robust

- Give each `CommandItem` a stable, unique `value` (the option's `value` prop, lower‑cased) and move the search haystack into the `keywords` prop that `cmdk` natively indexes. Drop the custom `filter` on `<Command>` and rely on `cmdk`'s built-in scorer, which handles diacritics and punctuation (Côte d'Ivoire, etc.) correctly.
- Cap the popover content height and make it scrollable (`max-h-72 overflow-y-auto` on `CommandList`) so all 60 origins are reachable inside the Dialog on small viewports.
- Add `modal={false}` to the `Popover` and `onOpenAutoFocus={(e) => e.preventDefault()}` on `PopoverContent`, then explicitly focus the `CommandInput` on open. This bypasses the Dialog focus-trap race so the very first keystroke filters the list.
- Match the trigger's height/padding to the surrounding `<Input>` and `<Select>` controls so it visually lines up with the other form fields.

### 2. `src/pages/account/ProductsPage.tsx` — small wiring tweaks only

- Pass option `value` as the canonical name (already correct) and let aliases flow into `keywords`.
- For Origin, keep the legacy fallback that prepends the existing DB value tagged `(legacy)` when it isn't in the canonical 60-country list.
- Add a tiny helper line under the Origin label: "60 countries — type to filter" so it's obvious the field is searchable.

No DB changes, no changes to other pages, no changes to the buyer-side filters on `/products` (those already work).

## Verification

1. Open `/account/products` → Add product. Click **Category**: type "kaju" → "Cashews" surfaces; type "spice" → both spice categories surface.
2. Click **Origin**: full 60‑country list is visible and scrollable inside the dialog; type "uni" → United Arab Emirates and United States surface; type "côte" or "cote" → Côte d'Ivoire surfaces.
3. Save a product with a searched Category + Origin; reload the list and confirm the values persisted.
