import * as React from "react";
import { Input } from "@/components/ui/input";
import { Loader2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { loadGoogleMaps, parseAddressComponents, ParsedAddress } from "@/lib/googleMaps";

interface Suggestion {
  placeId: string;
  primary: string;
  secondary: string;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (address: ParsedAddress) => void;
  placeholder?: string;
  maxLength?: number;
  id?: string;
  className?: string;
  /** ISO country codes to bias results (e.g. ["in"]). */
  countries?: string[];
}

export function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "Start typing your address…",
  maxLength = 200,
  id,
  className,
  countries,
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([]);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const sessionTokenRef = React.useRef<any>(null);
  const placesLibRef = React.useRef<any>(null);
  const debounceRef = React.useRef<number | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Pre-load Maps lazily on first focus.
  const ensureLoaded = React.useCallback(async () => {
    if (placesLibRef.current) return placesLibRef.current;
    try {
      await loadGoogleMaps();
      const lib = await (window as any).google.maps.importLibrary("places");
      placesLibRef.current = lib;
      sessionTokenRef.current = new lib.AutocompleteSessionToken();
      return lib;
    } catch (e: any) {
      setError(e?.message ?? "Maps unavailable");
      return null;
    }
  }, []);

  const fetchSuggestions = React.useCallback(
    async (input: string) => {
      if (!input || input.trim().length < 3) {
        setSuggestions([]);
        return;
      }
      const lib = await ensureLoaded();
      if (!lib) return;
      setLoading(true);
      try {
        const request: any = {
          input,
          sessionToken: sessionTokenRef.current,
        };
        if (countries && countries.length) {
          request.includedRegionCodes = countries;
        }
        const { suggestions: results } =
          await lib.AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
        const mapped: Suggestion[] = (results ?? [])
          .map((s: any) => {
            const p = s.placePrediction;
            if (!p) return null;
            return {
              placeId: p.placeId,
              primary: p.mainText?.text ?? p.text?.text ?? "",
              secondary: p.secondaryText?.text ?? "",
            };
          })
          .filter(Boolean) as Suggestion[];
        setSuggestions(mapped);
        setOpen(true);
        setError(null);
      } catch (e: any) {
        setError(e?.message ?? "Search failed");
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    },
    [ensureLoaded, countries],
  );

  React.useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      fetchSuggestions(value);
    }, 250);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [value, fetchSuggestions]);

  // Close on outside click.
  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleSelect = async (s: Suggestion) => {
    setOpen(false);
    const lib = placesLibRef.current;
    if (!lib) return;
    try {
      const place = new lib.Place({ id: s.placeId });
      await place.fetchFields({
        fields: ["addressComponents", "formattedAddress", "location"],
      });
      const components = (place.addressComponents ?? []).map((c: any) => ({
        longText: c.longText,
        shortText: c.shortText,
        types: c.types,
      }));
      const loc = place.location
        ? { lat: place.location.lat(), lng: place.location.lng() }
        : undefined;
      const parsed = parseAddressComponents(components, place.formattedAddress ?? "", loc);
      onSelect(parsed);
      // New session token after a successful selection (billing best-practice).
      sessionTokenRef.current = new lib.AutocompleteSessionToken();
    } catch (e: any) {
      setError(e?.message ?? "Could not load place details");
    }
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          id={id}
          value={value}
          maxLength={maxLength}
          placeholder={placeholder}
          autoComplete="off"
          onFocus={() => {
            ensureLoaded();
            if (suggestions.length) setOpen(true);
          }}
          onChange={(e) => onChange(e.target.value)}
          className="pl-9"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>
      {open && suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md overflow-hidden">
          <ul className="max-h-72 overflow-y-auto py-1">
            {suggestions.map((s) => (
              <li key={s.placeId}>
                <button
                  type="button"
                  onClick={() => handleSelect(s)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-muted focus:bg-muted focus:outline-none"
                >
                  <div className="font-medium truncate">{s.primary}</div>
                  {s.secondary && (
                    <div className="text-xs text-muted-foreground truncate">{s.secondary}</div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
      <p className="mt-1 text-xs text-muted-foreground">
        Search and pick your address — city, state, country, and pincode will auto-fill.
      </p>
    </div>
  );
}
