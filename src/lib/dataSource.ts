// ============================================================================
// dataSource.ts — adapters from Supabase rows to UI entry shapes.
// All directory and product data comes from Lovable Cloud. No dummy fallback.
// ============================================================================
import type { CompanyRow } from "@/repositories/companies";
import type { ProductRow } from "@/repositories/products";

// ---------------------------------------------------------------------------
// Directory entries (companies)
// ---------------------------------------------------------------------------
export type BusinessType =
  | "Importer"
  | "Exporter"
  | "Wholesaler"
  | "Distributor"
  | "Retailer"
  | "Manufacturer"
  | "Processor"
  | "Brand"
  | "Broker"
  | "Service Provider";

export interface DirectoryEntry {
  id: string;
  firmName: string;
  ownerName: string;
  slug: string;
  area: string;
  fullAddress: string;
  commodities: string[];
  originSpecialization: string[];
  memberType: BusinessType;
  verificationStatus: "Verified" | "Not Verified";
  verificationLevel: "Basic" | "Business";
  membershipStatus: "Active" | "Pending Renewal" | "Expired";
  memberSince: number;
  phone: string;
  whatsapp: string;
  email: string;
  gstNumber: string;
  description: string;
  isFeatured: boolean;
  isSponsored: boolean;
  logoPlaceholder: string;
}

const BUSINESS_TYPES: BusinessType[] = [
  "Importer",
  "Exporter",
  "Manufacturer",
  "Processor",
  "Brand",
  "Distributor",
  "Wholesaler",
  "Retailer",
  "Broker",
  "Service Provider",
];

function initials(name: string): string {
  return (
    name
      .split(/\s+/)
      .map((word) => word[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "·"
  );
}

function inferBusinessType(categories: string[]): BusinessType {
  const normalized = new Set(categories.map((category) => category.trim().toLowerCase()));
  return (
    BUSINESS_TYPES.find((type) => normalized.has(type.toLowerCase())) ??
    (normalized.has("service") || normalized.has("services") ? "Service Provider" : "Wholesaler")
  );
}

export function liveCompanyToEntry(company: CompanyRow): DirectoryEntry {
  const categories = (company.categories ?? []).filter(Boolean);
  const locationParts = [company.city, company.state, company.country].filter(Boolean) as string[];
  const compactLocation = [company.city, company.country].filter(Boolean).join(", ");

  return {
    id: company.id,
    firmName: company.name,
    ownerName: company.tagline ?? "",
    slug: company.slug,
    area: compactLocation || locationParts.join(", ") || "Location not added",
    fullAddress: company.address ?? locationParts.join(", "),
    commodities: categories.length ? categories : ["General food trade"],
    originSpecialization: [],
    memberType: inferBusinessType(categories),
    verificationStatus: company.is_verified ? "Verified" : "Not Verified",
    verificationLevel: company.is_verified ? "Business" : "Basic",
    membershipStatus: "Active",
    memberSince: company.established_year ?? new Date().getFullYear(),
    phone: company.phone ?? "",
    whatsapp: company.phone ?? "",
    email: company.email ?? "",
    gstNumber: company.gstin ?? "",
    description: company.description ?? company.tagline ?? "",
    // These fields remain for compatibility with existing home/storefront ranking.
    // The business directory itself no longer gives paid status priority.
    isFeatured: company.membership_tier === "paid" || company.is_verified,
    isSponsored: company.membership_tier === "paid",
    logoPlaceholder: initials(company.name),
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
  slug: string;
  sellerId: string;
  sellerName?: string;
  sellerSlug?: string;
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
  isFeatured?: boolean;
  isBranded?: boolean;
  brandId?: string | null;
  retailPackSize?: string | null;
  b2cUrl?: string | null;
}

export function liveProductToEntry(product: ProductRow): ProductEntry {
  const extras = product as ProductRow & {
    video_url?: string | null;
    is_branded?: boolean;
    brand_id?: string | null;
    retail_pack_size?: string | null;
    b2c_url?: string | null;
  };

  return {
    id: product.id,
    slug: product.slug,
    sellerId: product.company_id,
    commodityId: product.id,
    commodity: product.name,
    variant: product.category ?? "",
    origin: product.origin ?? "",
    packaging: product.packaging_options?.[0] ?? "",
    moq: "",
    priceMin: product.price_min,
    priceMax: product.price_max,
    priceUnit: `₹/${product.unit ?? "kg"}`,
    location: "",
    listingDate: product.created_at,
    imageUrl: product.image_url,
    gallery: product.gallery,
    videoUrl: extras.video_url ?? null,
    isFeatured: Boolean(product.is_featured),
    isBranded: Boolean(extras.is_branded),
    brandId: extras.brand_id ?? null,
    retailPackSize: extras.retail_pack_size ?? null,
    b2cUrl: extras.b2c_url ?? null,
  };
}

export function mergeProducts(live: ProductRow[]): ProductEntry[] {
  return live.map(liveProductToEntry);
}
