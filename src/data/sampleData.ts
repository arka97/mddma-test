// Reference data only — no dummy members, products, advertisers, or people.
// All such data is sourced from Lovable Cloud (Supabase) at runtime.

export interface Member {
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

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  category: "Trade" | "Government" | "Association" | "Market";
}

export interface MembershipTier {
  name: string;
  price: string;
  period: string;
  features: string[];
  badge: string;
  leadPacks: number;
  sponsoredEligible: boolean;
  highlighted: boolean;
}

export interface Circular {
  id: string;
  title: string;
  category: "Government" | "Trade" | "Internal";
  date: string;
  summary: string;
  isPublic: boolean;
}

// ===== PRODUCT CATEGORIES (taxonomy) =====
export const productCategories = [
  { name: "Dry Fruits", slug: "dry-fruits", icon: "🥜", count: 14 },
  { name: "Dates", slug: "dates", icon: "🌴", count: 3 },
  { name: "Seeds", slug: "seeds", icon: "🌱", count: 5 },
  { name: "Spices", slug: "spices", icon: "🌶️", count: 3 },
];

export const commodityCategories = productCategories.map((c) => ({
  name: c.name,
  icon: c.icon,
  description: `Browse ${c.name.toLowerCase()} products`,
}));

export const tradingAreas = [
  { name: "APMC Vashi", description: "Asia's largest wholesale market" },
  { name: "Masjid Bunder", description: "Historic dates & dry fruits hub" },
  { name: "Crawford Market", description: "Retail & wholesale center" },
  { name: "Mumbai", description: "Central Mumbai trading points" },
  { name: "Navi Mumbai", description: "Eastern suburbs market" },
];

// ===== NEWS / UPDATES (content, not member data) =====
export const sampleNews: NewsItem[] = [
  { id: "N001", title: "MDDMA Annual General Meeting — Key Resolutions", date: "2025-02-10", summary: "Members approved digital membership system and revised fee structure at the AGM held at APMC Vashi.", category: "Association" },
  { id: "N002", title: "GST Council Revises Rates for Imported Dry Fruits", date: "2025-02-05", summary: "New GST rates effective April 2025. Almonds and walnuts see rate changes. Members advised to update billing.", category: "Government" },
  { id: "N003", title: "Record Dates Import Volume", date: "2025-01-28", summary: "Mumbai's dates import crossed 15,000 MT in January, driven by Ramadan demand.", category: "Market" },
];

// ===== CIRCULARS (fallback content if CMS empty) =====
export const sampleCirculars: Circular[] = [
  { id: "C001", title: "GST Rate Revision for Dry Fruits — Effective April 2025", category: "Government", date: "2025-02-15", summary: "Important notification regarding revised GST rates for dry fruit categories.", isPublic: true },
  { id: "C002", title: "Import Duty Changes on Almonds and Walnuts", category: "Trade", date: "2025-01-20", summary: "Government of India has revised import duties.", isPublic: true },
];

// ===== MEMBERSHIP TIERS (pricing config) =====
export const membershipTiers: MembershipTier[] = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    features: [
      "Basic directory listing",
      "Browse verified members",
      "View public circulars & news",
      "Submit RFQs as a buyer",
    ],
    badge: "Free", leadPacks: 0, sponsoredEligible: false, highlighted: false,
  },
  {
    name: "Paid",
    price: "₹10,000",
    period: "per year",
    features: [
      "Verified seller storefront",
      "Product listings with controlled pricing",
      "Priority placement in directory",
      "RFQ inbox & CRM",
      "Market intelligence reports",
      "Trust seal & verification badge",
    ],
    badge: "Paid Member", leadPacks: 0, sponsoredEligible: true, highlighted: true,
  },
];
