// Lazy loader for the Google Maps JS API (Places library).
// Uses the referrer-restricted browser key from the Lovable Google Maps connector.

let loaderPromise: Promise<typeof google> | null = null;

export function loadGoogleMaps(): Promise<typeof google> {
  if (typeof window === "undefined") return Promise.reject(new Error("SSR"));
  if ((window as any).google?.maps?.importLibrary) return Promise.resolve((window as any).google);
  if (loaderPromise) return loaderPromise;

  const key = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY as string | undefined;
  const channel = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID as string | undefined;
  if (!key) return Promise.reject(new Error("Google Maps browser key missing"));

  loaderPromise = new Promise((resolve, reject) => {
    (window as any).__lovableGmapsInit = () => resolve((window as any).google);
    const s = document.createElement("script");
    const params = new URLSearchParams({
      key,
      v: "weekly",
      libraries: "places",
      loading: "async",
      callback: "__lovableGmapsInit",
    });
    if (channel) params.set("channel", channel);
    s.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
    s.async = true;
    s.onerror = () => {
      loaderPromise = null;
      reject(new Error("Failed to load Google Maps"));
    };
    document.head.appendChild(s);
  });
  return loaderPromise;
}

export interface ParsedAddress {
  formatted: string;
  address: string; // street-level (street_number + route + sublocality)
  city: string;
  state: string;
  country: string;
  pincode: string;
  lat?: number;
  lng?: number;
}

type AddressComponent = { longText: string; shortText: string; types: string[] };

export function parseAddressComponents(
  components: AddressComponent[],
  formatted: string,
  location?: { lat: number; lng: number },
): ParsedAddress {
  const get = (type: string, short = false) => {
    const c = components.find((x) => x.types.includes(type));
    return c ? (short ? c.shortText : c.longText) : "";
  };
  const streetNumber = get("street_number");
  const route = get("route");
  const sublocality =
    get("sublocality_level_1") || get("sublocality") || get("neighborhood") || "";
  const streetParts = [streetNumber, route].filter(Boolean).join(" ");
  const addressLine = [streetParts, sublocality].filter(Boolean).join(", ");

  return {
    formatted,
    address: addressLine || sublocality || route || "",
    city:
      get("locality") ||
      get("postal_town") ||
      get("administrative_area_level_2") ||
      "",
    state: get("administrative_area_level_1"),
    country: get("country"),
    pincode: get("postal_code"),
    lat: location?.lat,
    lng: location?.lng,
  };
}
