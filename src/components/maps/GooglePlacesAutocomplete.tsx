import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
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

function loadGoogleMaps(apiKey: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if ((window as any).google?.maps?.places) return Promise.resolve();
  if (loaderPromise) return loaderPromise;
  loaderPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Google Maps")));
      return;
    }
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });
  return loaderPromise;
}

function parseComponents(place: any): PlaceDetails {
  const comps: any[] = place.address_components ?? [];
  const get = (type: string, short = false) => {
    const c = comps.find((x) => x.types.includes(type));
    return c ? (short ? c.short_name : c.long_name) : "";
  };
  const streetNumber = get("street_number");
  const route = get("route");
  const sublocality =
    get("sublocality_level_1") || get("sublocality") || get("neighborhood");
  const street = [streetNumber, route].filter(Boolean).join(" ");
  const addressLine = [street, sublocality].filter(Boolean).join(", ") || place.formatted_address || "";
  return {
    address: addressLine,
    city:
      get("locality") ||
      get("administrative_area_level_3") ||
      get("administrative_area_level_2") ||
      "",
    state: get("administrative_area_level_1"),
    country: get("country"),
    pincode: get("postal_code"),
    latitude: place.geometry?.location?.lat?.() ?? null,
    longitude: place.geometry?.location?.lng?.() ?? null,
    place_id: place.place_id ?? "",
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
  const inputRef = useRef<HTMLInputElement>(null);
  const acRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const key = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY as string | undefined;
    if (!key) {
      setError("Google Maps key missing");
      setLoading(false);
      return;
    }
    let cancelled = false;
    loadGoogleMaps(key)
      .then(() => {
        if (cancelled || !inputRef.current) return;
        const google = (window as any).google;
        const ac = new google.maps.places.Autocomplete(inputRef.current, {
          fields: ["address_components", "geometry", "formatted_address", "place_id"],
          types: ["geocode"],
        });
        ac.addListener("place_changed", () => {
          const place = ac.getPlace();
          if (!place || !place.address_components) return;
          const details = parseComponents(place);
          onChange(details.address);
          onPlaceSelected(details);
        });
        acRef.current = ac;
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

  return (
    <div className="relative">
      <MapPin className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <Input
        ref={inputRef}
        id={id}
        value={value}
        required={required}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        placeholder={loading ? "Loading Google Maps…" : placeholder}
        className="pl-9"
        autoComplete="off"
      />
      {loading && (
        <Loader2 className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-muted-foreground" />
      )}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
};
