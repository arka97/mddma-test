// ============================================================================
// dataSource.ts — adapters from Supabase rows to UI entry shapes.
// ============================================================================
// All directory and product data comes from Lovable Cloud. No dummy fallback.
import type { Member } from "@/data/sampleData";
import type { ProductListing } from "@/data/productListings";
import type { CompanyRow } from "@/repositories/companies";
import type { ProductRow } from "@/repositories/products";

// ---------------------------------------------------------------------------
// Directory entries (companies)
// ---------------------------------------------------------------------------
export type DirectoryEntry = Member & { source: "live" | "demo" };

function initials(name: string): string {
  return (
    name
      .split(/\s+/)
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "·"
  );
}

export function liveCompanyToEntry(c: CompanyRow): DirectoryEntry {
  const cats = (c.categories ?? []).filter(Boolean);
  return {
    id: c.id,
    firmName: c.name,
    ownerName: c.tagline ?? "",
    slug: c.slug,
    area: c.city ?? c.state ?? "Mumbai",
    fullAddress:
      c.address ??
      `${c.city ?? ""}${c.city && c.state ? ", " : ""}${c.state ?? ""}`,
    commodities: cats.length ? cats : ["General"],
    originSpecialization: [],
    memberType: (c.categories ?? []).some((x) => x?.toLowerCase() === "broker") ? "Broker" : "Wholesaler",
    verificationStatus: c.is_verified ? "Verified" : "Not Verified",
    verificationLevel: c.is_verified ? "Business" : "Basic",
    membershipStatus: "Active",
    memberSince: c.established_year ?? new Date().getFullYear(),
    phone: c.phone ?? "",
    whatsapp: c.phone ?? "",
    email: c.email ?? "",
    gstNumber: c.gstin ?? "",
    description: c.description ?? c.tagline ?? "",
    isFeatured: c.membership_tier === "paid" || c.is_verified,
    isSponsored: c.membership_tier === "paid",
    logoPlaceholder: initials(c.name),
    source: "live",
  };
}

export function mergeDirectory(live: CompanyRow[]): DirectoryEntry[] {
  return live.map(liveCompanyToEntry);
}

// ---------------------------------------------------------------------------
// Product entries
// ---------------------------------------------------------------------------
export type ProductEntry = ProductListing & { source: "live" | "demo" };

export function liveProductToEntry(p: ProductRow): ProductEntry {
  return {
    id: p.id,
    sellerId: p.company_id,
    commodityId: p.id,
    commodity: p.name,
    variant: p.category ?? "",
    origin: p.origin ?? "",
    packaging: p.packaging_options?.[0] ?? "",
    moq: "",
    priceMin: p.price_min,
    priceMax: p.price_max,
    marketAvgPrice: p.market_avg_price,
    priceUnit: `₹/${p.unit ?? "kg"}`,
    stockBand: (p.stock_band as ProductListing["stockBand"]) ?? "medium",
    trendDirection: (p.trend_direction as ProductListing["trendDirection"]) ?? "stable",
    demandScore:
      p.demand_score && p.demand_score >= 70
        ? "high"
        : p.demand_score && p.demand_score >= 40
        ? "medium"
        : "low",
    inquiryCount: p.inquiry_count ?? 0,
    location: "",
    listingDate: p.created_at,
    hidePrice: p.price_min == null && p.price_max == null,
    isFastMoving: p.is_featured,
    imageUrl: p.image_url,
    gallery: p.gallery,
    videoUrl: (p as ProductRow & { video_url?: string | null }).video_url ?? null,
    source: "live",
  };
}

export function mergeProducts(live: ProductRow[]): ProductEntry[] {
  return live.map(liveProductToEntry);
}
