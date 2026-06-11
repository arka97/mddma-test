import { useEffect, useRef, useState } from "react";
import { Loader2, MapPin } from "lucide-react";

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

export const GooglePlacesAutocomplete = ({
  value,
  onChange,
  onPlaceSelected,
  placeholder = "Start typing address…",
  id,
  required,
  maxLength,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const elRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const key = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY as string | undefined;
    const channel = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID as string | undefined;
    if (!key) {
      setError("Google Maps key missing");
      setLoading(false);
      return;
    }
    let cancelled = false;
    loadGoogleMaps(key, channel)
      .then(async () => {
        if (cancelled || !containerRef.current) return;
        const google = (window as any).google;
        const placesLib = await google.maps.importLibrary("places");
        const PlaceAutocompleteElement = placesLib.PlaceAutocompleteElement;
        if (!PlaceAutocompleteElement) {
          throw new Error("PlaceAutocompleteElement unavailable");
        }
        const el: any = new PlaceAutocompleteElement();
        if (id) el.id = id;
        el.style.width = "100%";
        elRef.current = el;
        containerRef.current.innerHTML = "";
        containerRef.current.appendChild(el);

        // Sync typed text back to parent
        el.addEventListener("input", () => {
          const input = el.querySelector("input") as HTMLInputElement | null;
          if (input) onChange(input.value);
        });

        el.addEventListener("gmp-select", async (event: any) => {
          try {
            const placePrediction = event.placePrediction;
            if (!placePrediction) return;
            const place = placePrediction.toPlace();
            await place.fetchFields({
              fields: ["addressComponents", "location", "formattedAddress", "id"],
            });
            const data = place.toJSON();
            const details = parseComponents(data);
            onChange(details.address);
            onPlaceSelected(details);
          } catch (e: any) {
            setError(e?.message ?? "Failed to load place details");
          }
        });

        setLoading(false);
      })
      .catch((e) => {
        setError(e.message ?? "Failed to load maps");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the element's input value in sync when parent updates it programmatically
  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    const input = el.querySelector?.("input") as HTMLInputElement | null;
    if (input && input.value !== value) input.value = value ?? "";
  }, [value]);

  return (
    <div>
      <div className="relative rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
        <MapPin className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10" />
        <div
          ref={containerRef}
          className="[&_input]:w-full [&_input]:h-10 [&_input]:pl-9 [&_input]:pr-9 [&_input]:bg-transparent [&_input]:text-sm [&_input]:outline-none [&_input]:border-0"
          data-placeholder={placeholder}
        />
        {loading && (
          <Loader2 className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
        {/* Hidden fallback input to enforce required/maxLength on form submit */}
        <input
          type="hidden"
          value={value}
          required={required}
          maxLength={maxLength}
          onChange={() => {}}
        />
      </div>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
};
