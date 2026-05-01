## Goal

Repopulate the **Product Categories** master list with the 33 categories you provided. Display only the English name in the UI, but let users find a category by typing its colloquial Hindi name (e.g. "kaju" → Cashews). Each category gets an accurate Pexels stock image so the homepage strip and `/products` filter look polished.

## Scope of changes

### 1. Database — schema (one migration)

Add an `aliases text[]` column to `public.product_categories` so we can store colloquial names without polluting the visible `name`. Index it with GIN for fast `ANY()` search.

```text
product_categories
  ├─ name           "Cashews"
  ├─ slug           "cashews"
  ├─ aliases        ["Kaju"]            ← NEW
  ├─ image_url      https://images.pexels.com/...
  ├─ is_featured    true (top 7 only)
  └─ sort_order     10, 20, 30 …
```

### 2. Database — data (one insert/replace step)

- Delete the two existing rows (`Almond`, `Nuts`).
- Insert all 33 categories with curated Pexels image URLs, sort order in steps of 10 (so admins can reorder later), and aliases populated from the bracketed colloquial names.
- `is_featured = true` for the **Top 7 dry fruits** you confirmed: Almonds, Cashews, Pistachios, Walnuts, Raisins, Wet Dates, Figs. All others `false`.

Full list with aliases:

```text
Almonds          (Badam)            Wet Dates        (Khajoor)
Cashews          (Kaju)             Dry Dates        (Kharek)
Pistachios       (Pista)            Figs             (Anjeer)
Walnuts          (Akhrot)           Dehydrated Fruits (Imported Dried Fruits)
Raisins          (Kishmish)         Seeds
Fox Nuts         (Makhana)          Superfoods
Flavoured Nuts                      Dry Fruits Mix
Groundnuts       (Moongfali, Singdana)
Dry Coconuts     (Kopra)            Whole Spices     (Khada Masala)
Blended Spices   (Masala Powder)    Herbs
Saffron          (Kesar)            Grains
Millets                             Oats
Flour                               Pulses
Natural Sweeteners (Shahad, Gur)    Mouth Freshener  (Mukhwas)
Protein Bars                        Healthy Snacks
Beverages                           Gifting & Hampers
Others
```

### 3. Repository layer — `src/repositories/productCategories.ts`

- Add `aliases: string[]` to `ProductCategoryRow` and `ProductCategoryInput`.
- Include `aliases` in the `COLUMNS` constant so reads/writes round-trip.

### 4. Search behaviour — `src/pages/Products.tsx`

Today the search input only matches `commodity` and `variant` on listings. Extend it so typing a colloquial alias selects the matching category:

- Build an alias→canonical map from `useProductCategories()`.
- When the typed query matches an alias (case-insensitive), auto-set `categoryFilter` to the canonical name (or include alias-matched listings in the filter).
- Update the search placeholder to "Search by commodity or local name (e.g. Kaju, Anjeer)…".

No change needed to the homepage `FeaturedCategoriesSection` — it already renders only `cat.name`.

### 5. Admin CMS — `src/pages/account/AdminModeration.tsx` (categories panel)

Add an **Aliases** input (comma-separated chips) to the create/edit form so admins can keep colloquial names current without a developer.

## Image sourcing

I will pick one royalty-free Pexels photo per category (using `images.pexels.com/photos/<id>/pexels-photo-<id>.jpeg?auto=compress&cs=tinysrgb&w=600`), validate each URL responds 200 before insert, and fall back to the existing `<CommodityImage>` Unsplash entry if any single URL fails. Final image URLs land directly in `product_categories.image_url`.

## Out of scope

- No change to actual product/listing rows — only the categories master list.
- No change to RLS, no change to the homepage layout or the "Top 7" cap (already enforced by `items.slice(0, 7)`).
- No translation of the rest of the UI — only category aliases for search.

## Acceptance checks

1. `/` homepage shows the 7 featured dry-fruit tiles with real photos.
2. `/products` category dropdown lists all 33 in the agreed order.
3. Typing "kaju" in the `/products` search bar surfaces Cashews listings.
4. Admin can add/edit aliases from `/account/moderation`.
