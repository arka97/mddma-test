# Fix Google Maps Address Autocomplete

## Problem

The address field on `/account/company` throws:

> Cannot read properties of undefined (reading 'Autocomplete')

Root cause: `GooglePlacesAutocomplete.tsx` uses the **legacy** `google.maps.places.Autocomplete` class. The managed Google Maps browser key is only authorized for the **Maps JavaScript API + Places API (New)**, and the legacy Places classes (`Autocomplete`, `SearchBox`, `PlacesService`) are no longer available on the script we load. The library loads, but `google.maps.places.Autocomplete` is `undefined`, hence the crash.

We also load the script without the recommended `loading=async` + `callback` pattern and without the usage-tracking `channel` parameter.

## Fix

Rewrite `src/components/maps/GooglePlacesAutocomplete.tsx` to use the **Places API (New)** browser surface — `PlaceAutocompleteElement` (a custom element `<gmp-place-autocomplete>`) — which is the supported replacement.

### Approach

1. Load the Maps JS API with the documented pattern:
   - `loading=async`
   - `&libraries=places`
   - `&channel=${VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID}`
   - Init via a global `callback` so `google.maps` is guaranteed ready.
2. Use `google.maps.importLibrary('places')` to get `PlaceAutocompleteElement`.
3. Mount the `PlaceAutocompleteElement` inside our wrapper div (replacing the plain `<Input>` element for the suggestion box). Keep the leading `MapPin` icon and loading spinner styling consistent with the rest of the form.
4. Listen to the element's `gmp-select` event → call `place.fetchFields({ fields: ['addressComponents','location','formattedAddress','id'] })` → parse into our existing `PlaceDetails` shape (address, city, state, country, pincode, lat/lng, place_id) → fire `onPlaceSelected` and `onChange`.
5. Keep the same component props (`value`, `onChange`, `onPlaceSelected`, `id`, `required`, `maxLength`, `placeholder`) so `CompanyPage.tsx` does not need to change.
6. Keep manual typing working: the autocomplete element has its own input; mirror its text via the `input` event so the parent's `form.address` stays in sync (covers the case where a user types but never picks a suggestion).
7. Preserve the singleton script-loader promise so the script is only injected once across mounts.

### Technical details

- File touched: `src/components/maps/GooglePlacesAutocomplete.tsx` (rewrite only — no other files change).
- API key source unchanged: `import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY`.
- Script URL:
  ```
  https://maps.googleapis.com/maps/api/js?key=KEY&libraries=places&v=weekly&loading=async&callback=__lovableInitMaps&channel=TRACKING_ID
  ```
- Address parsing helper stays the same; it just reads `place.addressComponents` (new API field names: `longText`, `shortText`, `types`) instead of legacy `address_components`.
- No DB / form / route changes.

## Out of scope

- No changes to `CompanyPage.tsx`, env vars, or other map usages.
