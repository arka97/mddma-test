// Stock image lookup for commodities.
// Sources: Unsplash photo IDs (free, attribution-free for editorial use).
// Used by <CommodityImage/>. Each entry includes a graceful fallback
// emoji + gradient so the UI never shows a broken image.

export interface CommodityImageEntry {
  unsplashId: string;
  emoji: string;
  // tailwind gradient classes used as fallback / loading background
  bg: string;
}

// Keys are normalized commodity slugs (lowercase, hyphenated). Lookups
// also tolerate raw commodity names like "Almonds" via the helper below.
const IMAGE_MAP: Record<string, CommodityImageEntry> = {
  almonds:        { unsplashId: "1508061253366-f7da158b6d46", emoji: "🌰", bg: "from-amber-100 to-orange-200" },
  cashews:        { unsplashId: "1583668436533-87bd0f4ec169", emoji: "🥜", bg: "from-yellow-50 to-amber-200" },
  pistachios:     { unsplashId: "1505740106531-4243f3831f30", emoji: "🌿", bg: "from-emerald-50 to-green-200" },
  walnuts:        { unsplashId: "1568098874471-1aaf1de8ffa0", emoji: "🌰", bg: "from-stone-100 to-amber-200" },
  dates:          { unsplashId: "1473625247510-8ceb1760943f", emoji: "🌴", bg: "from-amber-100 to-yellow-200" },
  "medjool-dates":{ unsplashId: "1601493700631-2b16ec4b4716", emoji: "🌴", bg: "from-amber-100 to-yellow-200" },
  "ajwa-dates":   { unsplashId: "1601493700631-2b16ec4b4716", emoji: "🌴", bg: "from-stone-200 to-amber-200" },
  raisins:        { unsplashId: "1599859388056-1e5cca8deb60", emoji: "🍇", bg: "from-purple-50 to-amber-100" },
  "dried-figs":   { unsplashId: "1606170033648-5d55a3edf314", emoji: "🍯", bg: "from-purple-100 to-pink-100" },
  figs:           { unsplashId: "1606170033648-5d55a3edf314", emoji: "🍯", bg: "from-purple-100 to-pink-100" },
  saffron:        { unsplashId: "1599583863916-e06c29087f51", emoji: "🌺", bg: "from-orange-100 to-red-200" },
  "pumpkin-seeds":{ unsplashId: "1556909114-f6e7ad7d3136", emoji: "🌱", bg: "from-green-50 to-lime-100" },
  seeds:          { unsplashId: "1556909114-f6e7ad7d3136", emoji: "🌱", bg: "from-green-50 to-lime-100" },
  spices:         { unsplashId: "1596040033229-a9821ebd058d", emoji: "🌶️", bg: "from-red-50 to-orange-200" },
  "mixed-dry-fruits": { unsplashId: "1599599810694-57a2ca8276a8", emoji: "🥜", bg: "from-amber-50 to-yellow-200" },
  "fox-nuts":     { unsplashId: "1622484211148-3d5a7c7a6e6a", emoji: "🍿", bg: "from-yellow-50 to-stone-100" },
  "pine-nuts":    { unsplashId: "1615484477778-ca3b77940c25", emoji: "🌲", bg: "from-emerald-50 to-stone-100" },
  "macadamia-nuts":{ unsplashId: "1609139005802-50069ce4d97b", emoji: "🥥", bg: "from-stone-100 to-amber-100" },
};

const FALLBACK: CommodityImageEntry = {
  unsplashId: "1599599810694-57a2ca8276a8",
  emoji: "🥜",
  bg: "from-amber-50 to-stone-200",
};

export function commoditySlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getCommodityImage(commodity: string): CommodityImageEntry {
  const slug = commoditySlug(commodity);
  return IMAGE_MAP[slug] ?? FALLBACK;
}

export function unsplashUrl(id: string, w = 600, h = 400, q = 75): string {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=${q}`;
}
