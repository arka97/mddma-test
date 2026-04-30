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
    badge: "Free", sponsoredEligible: false, highlighted: false,
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
    badge: "Paid Member", sponsoredEligible: true, highlighted: true,
  },
];
