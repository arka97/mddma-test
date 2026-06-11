import { useEffect, useRef, useState, useCallback } from "react";
import { Loader2, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface PlaceDetails {
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  latitude: number | null;
  longitude: number | null;
  place_id: string;
}

interface Props {
  value: string;
  onChange: (val: string) => void;
  onPlaceSelected: (place: PlaceDetails) => void;
  placeholder?: string;
  id?: string;
  required?: boolean;
  maxLength?: number;
}

const SCRIPT_ID = "google-maps-places-script";
let loaderPromise: Promise<void> | null = null;

function loadGoogleMaps(apiKey: string, channel?: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  const w = window as any;
  if (w.google?.maps?.importLibrary) return Promise.resolve();
  if (loaderPromise) return loaderPromise;
  loaderPromise = new Promise((resolve, reject) => {
    w.__lovableInitMaps = () => resolve();
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Google Maps")));
      return;
    }
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    const channelParam = channel ? `&channel=${encodeURIComponent(channel)}` : "";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly&loading=async&callback=__lovableInitMaps${channelParam}`;
    script.async = true;
    script.defer = true;
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });
  return loaderPromise;
}

function parseComponents(place: any): PlaceDetails {
  const comps: any[] = place.addressComponents ?? [];
  const get = (type: string, short = false) => {
    const c = comps.find((x) => (x.types ?? []).includes(type));
    if (!c) return "";
    return short ? (c.shortText ?? c.short_name ?? "") : (c.longText ?? c.long_name ?? "");
  };
  const streetNumber = get("street_number");
  const route = get("route");
  const sublocality =
    get("sublocality_level_1") || get("sublocality") || get("neighborhood");
  const street = [streetNumber, route].filter(Boolean).join(" ");
  const formatted = place.formattedAddress ?? place.formatted_address ?? "";
  const addressLine = [street, sublocality].filter(Boolean).join(", ") || formatted;
  const loc = place.location;
  const lat = typeof loc?.lat === "function" ? loc.lat() : (loc?.lat ?? null);
  const lng = typeof loc?.lng === "function" ? loc.lng() : (loc?.lng ?? null);
  return {
    address: addressLine,
    city:
      get("locality") ||
      get("postal_town") ||
      get("administrative_area_level_3") ||
      get("administrative_area_level_2") ||
      "",
    state: get("administrative_area_level_1"),
    country: get("country"),
    pincode: get("postal_code"),
    latitude: lat,
    longitude: lng,
    place_id: place.id ?? place.place_id ?? "",
  };
}

interface Suggestion {
  primary: string;
  secondary: string;
  prediction: any;
}

export const GooglePlacesAutocomplete = ({
  value,
  onChange,
  onPlaceSelected,
  placeholder = "Start typing address…",
  id,
  required,
  maxLength,
}: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const placesLibRef = useRef<any>(null);
  const sessionTokenRef = useRef<any>(null);
  const debounceRef = useRef<number | null>(null);
  const reqIdRef = useRef(0);

  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [noResults, setNoResults] = useState(false);

  // Load library
  useEffect(() => {
    const key = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY as string | undefined;
    const channel = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID as string | undefined;
    if (!key) {
      setError("Google Maps key missing");
      return;
    }
    let cancelled = false;
    loadGoogleMaps(key, channel)
      .then(async () => {
        if (cancelled) return;
        const google = (window as any).google;
        const placesLib = await google.maps.importLibrary("places");
        placesLibRef.current = placesLib;
        sessionTokenRef.current = new placesLib.AutocompleteSessionToken();
        setReady(true);
      })
      .catch((e) => setError(e?.message ?? "Failed to load maps"));
    return () => {
      cancelled = true;
    };
  }, []);

  // Outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchSuggestions = useCallback(async (input: string) => {
    const placesLib = placesLibRef.current;
    if (!placesLib || !input.trim()) {
      setSuggestions([]);
      setNoResults(false);
      return;
    }
    const myReq = ++reqIdRef.current;
    setBusy(true);
    try {
      const { suggestions: res } = await placesLib.AutocompleteSuggestion.fetchAutocompleteSuggestions({
        input,
        sessionToken: sessionTokenRef.current,
        includedRegionCodes: ["in"],
      });
      if (myReq !== reqIdRef.current) return;
      const mapped: Suggestion[] = (res ?? [])
        .filter((s: any) => s.placePrediction)
        .map((s: any) => {
          const p = s.placePrediction;
          return {
            primary: p.structuredFormat?.mainText?.text ?? p.text?.text ?? "",
            secondary: p.structuredFormat?.secondaryText?.text ?? "",
            prediction: p,
          };
        });
      setSuggestions(mapped);
      setNoResults(mapped.length === 0);
      setActiveIdx(-1);
      setOpen(true);
    } catch (e: any) {
      setError(e?.message ?? "Search failed");
    } finally {
      if (myReq === reqIdRef.current) setBusy(false);
    }
  }, []);

  const handleChange = (val: string) => {
    onChange(val);
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (!val.trim()) {
      setSuggestions([]);
      setNoResults(false);
      setOpen(false);
      return;
    }
    debounceRef.current = window.setTimeout(() => {
      fetchSuggestions(val);
    }, 200);
  };

  const selectSuggestion = async (s: Suggestion) => {
    setOpen(false);
    setBusy(true);
    try {
      const place = s.prediction.toPlace();
      await place.fetchFields({
        fields: ["addressComponents", "location", "formattedAddress", "id"],
      });
      const data = place.toJSON();
      const details = parseComponents(data);
      onChange(details.address || s.primary);
      onPlaceSelected(details);
      // reset session token after a selection per Google billing best practice
      const placesLib = placesLibRef.current;
      if (placesLib) sessionTokenRef.current = new placesLib.AutocompleteSessionToken();
    } catch (e: any) {
      setError(e?.message ?? "Failed to load place details");
    } finally {
      setBusy(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (activeIdx >= 0) {
        e.preventDefault();
        selectSuggestion(suggestions[activeIdx]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative">
        <MapPin className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" />
        <Input
          id={id}
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={ready ? placeholder : "Loading address search…"}
          required={required}
          maxLength={maxLength}
          autoComplete="off"
          disabled={!ready && !error}
          className="pl-9 pr-9"
        />
        {busy && (
          <Loader2 className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {open && (suggestions.length > 0 || noResults) && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 rounded-md border bg-popover shadow-lg overflow-hidden">
          <div className="max-h-72 overflow-auto">
            {suggestions.length === 0 && noResults && (
              <div className="px-3 py-3 text-sm text-muted-foreground">No matches</div>
            )}
            {suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => selectSuggestion(s)}
                onMouseEnter={() => setActiveIdx(i)}
                className={`w-full text-left flex items-start gap-3 px-3 py-2.5 border-b border-border/60 last:border-b-0 transition-colors ${
                  activeIdx === i ? "bg-accent" : "hover:bg-accent"
                }`}
              >
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-foreground truncate">{s.primary}</div>
                  {s.secondary && (
                    <div className="text-xs text-muted-foreground line-clamp-2">{s.secondary}</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
};
