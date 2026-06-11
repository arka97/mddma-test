# Custom Inline Address Autocomplete (Zepto/Blinkit style)

## Problem

The current `GooglePlacesAutocomplete` uses Google's `PlaceAutocompleteElement` custom element. On mobile it:
- Renders as a dark/unstyled element (doesn't inherit our Tailwind input styles)
- Opens a full-screen native picker when tapped, breaking the form flow

User wants an inline experience: a normal-looking text input that drops a list of address suggestions directly below it, like Zepto / Blinkit / Swiggy "Select your Location".

## Fix

Rewrite `src/components/maps/GooglePlacesAutocomplete.tsx` to drive the **Places API (New)** programmatically and render our own UI — no Google-provided element.

### Approach

1. Use a regular shadcn `<Input>` (with `MapPin` left icon) so it matches every other field on the form.
2. Load Maps JS with the async + callback pattern (already in place) and `importLibrary('places')` to get `AutocompleteSuggestion`, `AutocompleteSessionToken`, and `Place`.
3. Create one `AutocompleteSessionToken` per typing session (reset after a selection — Google billing best practice).
4. As the user types, debounce 200ms, then call `AutocompleteSuggestion.fetchAutocompleteSuggestions({ input, sessionToken, includedRegionCodes: ['in'] })`.
5. Render results in a custom dropdown anchored below the input:
   - Absolutely positioned `div` with `bg-popover`, border, shadow, rounded, max-height + scroll
   - Each row: `MapPin` icon + primary text (place main text) + secondary muted text (formatted address)
   - Keyboard support: ArrowUp / ArrowDown / Enter / Escape
   - Click/tap selects
   - Closes on outside click and on blur (with small delay so click registers)
6. On select: call `suggestion.placePrediction.toPlace()` → `place.fetchFields({ fields: ['addressComponents','location','formattedAddress','id'] })` → parse via existing `parseComponents` helper → fire `onChange(address)` + `onPlaceSelected(details)` → reset session token.
7. Keep the same component props/signature so `CompanyPage.tsx` doesn't change.
8. Inline only — no full-screen modal, no portal. Dropdown sits inside the field's relative wrapper so it flows with the form on mobile and desktop.

### Visual spec (mobile-first, matches reference image)

- Input: same height/border/radius as other form fields (`h-10`, `rounded-md`, `border-input`, `bg-background`).
- Left icon: `MapPin` (muted-foreground, 16px), input left padding `pl-9`.
- Right: small spinner while a request is in-flight.
- Dropdown:
  - `absolute left-0 right-0 top-full mt-1 z-50`
  - `rounded-md border bg-popover shadow-lg overflow-hidden`
  - Max-height ~ `max-h-72 overflow-auto`
  - Row: `flex items-start gap-3 px-3 py-2.5 cursor-pointer hover:bg-accent`
  - Active (keyboard) row gets `bg-accent`
  - Divider via `border-b border-border/60` between rows
  - Primary text: `text-sm font-medium text-foreground`
  - Secondary text: `text-xs text-muted-foreground line-clamp-2`
- Empty state (after a query with no results): subtle muted "No matches" row.

### Technical details

- File touched: `src/components/maps/GooglePlacesAutocomplete.tsx` (rewrite only).
- No DB / `CompanyPage.tsx` / env changes.
- Suggestion data shape used (per Places API New):
  - `suggestion.placePrediction.text.text` → full label
  - `suggestion.placePrediction.structuredFormat.mainText.text` → primary
  - `suggestion.placePrediction.structuredFormat.secondaryText.text` → secondary
- Region biased to India (`includedRegionCodes: ['in']`) to match audience; can be removed later if needed.
- Debounce implemented with a ref-stored timeout; latest-request guard prevents stale results overwriting newer ones.
- Cleanup: clear debounce + outside-click listener on unmount.

## Out of scope

- City/State/Country/Pincode inputs (still auto-filled by the same `onPlaceSelected` callback — unchanged).
- "Use current location" button shown in the Blinkit reference (can be added later if requested).
