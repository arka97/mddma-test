# Ads across Directory, Circulars, Products + admin priority

## Goal
- Render ad carousel on `/directory`, `/circulars`, `/products`.
- Let admin set a numeric **priority** so higher-priority ads appear first in the rotating carousel.

## Current state
- `AdSlot` (carousel) exists and is used on the homepage.
- `AdBanner` (static stack) is used on `/directory` (placement `directory-sidebar`) and `/products` (placement `category-banner`) — these placement names don't match what the admin form offers (`directory-banner`, `products-banner`), so existing admin uploads never show.
- `/circulars` has no ad slot.
- `advertisements` table has no priority column.

## Changes

### 1. DB migration
- Add `priority integer NOT NULL DEFAULT 0` to `advertisements`.
- Backfill existing rows with `0`.
- Normalize legacy placements: `directory-sidebar` → `directory-banner`, `category-banner` → `products-banner`, plus add a new `circulars-banner` placement value (free-text column, no enum change needed).

### 2. Repository (`src/repositories/advertisements.ts`)
- Select `priority` too.
- Order results: `priority DESC, created_at DESC` so highest priority shows first in the carousel.

### 3. Page wiring (use `AdSlot` everywhere for consistency + rotation)
- `/directory`: replace `<AdBanner placement="directory-sidebar" />` with `<AdSlot placement="directory-banner" />`.
- `/products`: replace both `<AdBanner placement="category-banner" />` instances with `<AdSlot placement="products-banner" />`.
- `/circulars`: add `<AdSlot placement="circulars-banner" />` in a container above the listing.
- Keep `AdBanner` file untouched (still imported by other callers if any) — only swap usages on these three pages.

### 4. Admin (`src/pages/account/AdminModeration.tsx`)
- Add **Priority** number input (default 0) to the upload form; persist on insert.
- Add `circulars-banner` to the placement `<select>` (alongside existing homepage/directory/products).
- In the ad list row, show the priority badge and add an inline "Priority" number input that updates `advertisements.priority` on change. Reload list after save.
- Sort the admin list by `priority DESC, created_at DESC` so the order matches what users will see.

## Out of scope
- No change to homepage ad slots or impression/click tracking.
- No change to RLS (existing admin-only write policies already cover the new column).
