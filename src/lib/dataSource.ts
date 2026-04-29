// ============================================================================
// dataSource.ts — THE ONLY FILE ALLOWED TO READ FROM @/data/sampleData.
// ============================================================================
// Why this exists: prior to v3.1.2 the directory and storefront ignored live
// Supabase rows in many places, which is why user-created companies (e.g.
// KGVPL / Keshavam) sometimes did not appear. This module merges live rows
// with the demo seed using a "live wins on slug conflict" rule so the UI is
// always consistent regardless of which source a record came from.
// ----------------------------------------------------------------------------
import { Member, sampleMembers } from "@/data/sampleData";
import { productListings, type ProductListing } from "@/data/productListings";
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
    memberType: c.is_broker ? "Broker" : "Wholesaler",
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
  const liveEntries = live.map(liveCompanyToEntry);
  const liveSlugs = new Set(liveEntries.map((e) => e.slug));
  const demoEntries: DirectoryEntry[] = sampleMembers
    .filter((m) => !liveSlugs.has(m.slug))
    .map((m) => ({ ...m, source: "demo" as const }));
  return [...liveEntries, ...demoEntries];
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
    source: "live",
  };
}

export function mergeProducts(
  live: ProductRow[],
  opts: { companyId?: string; category?: string } = {}
): ProductEntry[] {
  const liveEntries = live.map(liveProductToEntry);
  const liveIds = new Set(liveEntries.map((e) => e.id));
  // Sample listings keyed by sellerId (member id), not company UUID, so they
  // never collide with live rows. Apply the same filters before merging.
  const demoFiltered = productListings.filter((d) => {
    if (opts.companyId && d.sellerId !== opts.companyId) return false;
    if (opts.category && d.commodity !== opts.category) return false;
    return true;
  });
  const demoEntries: ProductEntry[] = demoFiltered
    .filter((d) => !liveIds.has(d.id))
    .map((d) => ({ ...d, source: "demo" as const }));
  return [...liveEntries, ...demoEntries];
}
