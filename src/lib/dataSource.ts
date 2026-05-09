// ============================================================================
// dataSource.ts — adapters from Supabase rows to UI entry shapes.
// All directory and product data comes from Lovable Cloud. No dummy fallback.
// ============================================================================
import type { CompanyRow } from "@/repositories/companies";
import type { ProductRow } from "@/repositories/products";

// ---------------------------------------------------------------------------
// Directory entries (companies)
// ---------------------------------------------------------------------------
export interface DirectoryEntry {
  id: string;
  firmName: string;
  ownerName: string;
  slug: string;
  area: string;
  fullAddress: string;
  commodities: string[];
  originSpecialization: string[];
  memberType: "Importer" | "Wholesaler" | "Retailer" | "Processor" | "Broker";
  verificationStatus: "Verified" | "Not Verified";
  verificationLevel: "Basic" | "Business";
  membershipStatus: "Active" | "Pending Renewal" | "Expired";
  memberSince: number;
  phone: string;
  whatsapp: string;
  email: string;
  gstNumber: string;
  fssaiNumber?: string;
  description: string;
  isFeatured: boolean;
  isSponsored: boolean;
  logoPlaceholder: string;
}

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
  };
}

export function mergeDirectory(live: CompanyRow[]): DirectoryEntry[] {
  return live.map(liveCompanyToEntry);
}

// ---------------------------------------------------------------------------
// Product entries
// ---------------------------------------------------------------------------
export interface ProductEntry {
  id: string;
  sellerId: string;
  commodityId: string;
  commodity: string;
  variant: string;
  origin: string;
  packaging: string;
  moq: string;
  priceMin: number | null;
  priceMax: number | null;
  priceUnit: string;
  location: string;
  listingDate: string;
  imageUrl?: string | null;
  gallery?: string[] | null;
  videoUrl?: string | null;
}

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
    priceUnit: `₹/${p.unit ?? "kg"}`,
    location: "",
    listingDate: p.created_at,
    imageUrl: p.image_url,
    gallery: p.gallery,
    videoUrl: (p as ProductRow & { video_url?: string | null }).video_url ?? null,
  };
}

export function mergeProducts(live: ProductRow[]): ProductEntry[] {
  return live.map(liveProductToEntry);
}
