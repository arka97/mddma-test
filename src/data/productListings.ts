// Product listings with V2 Controlled Marketplace model
// NO exact prices shown publicly — price ranges, stock bands, RFQ-first

export type StockBand = "high" | "medium" | "low" | "on_order";
export type TrendDirection = "rising" | "stable" | "falling";
export type DemandLevel = "high" | "medium" | "low";
export type LeadPriority = "hot" | "warm" | "cold";

export interface ProductListing {
  id: string;
  sellerId: string;
  commodityId: string;
  commodity: string;
  variant: string;
  origin: string;
  packaging: string;
  moq: string;
  // V2: Price range instead of exact price
  priceMin: number | null;
  priceMax: number | null;
  marketAvgPrice: number | null;
  priceUnit: string;
  // V2: Stock band instead of boolean
  stockBand: StockBand;
  // V2: Market signals
  trendDirection: TrendDirection;
  demandScore: DemandLevel;
  inquiryCount: number; // social proof
  location: string;
  listingDate: string;
  hidePrice: boolean; // paid members can hide completely
  isFastMoving: boolean;
  // Seller-uploaded media (optional; live listings only)
  imageUrl?: string | null;
  gallery?: string[] | null;
  videoUrl?: string | null;
}

export const stockBandLabels: Record<StockBand, string> = {
  high: "High Availability",
  medium: "Medium Stock",
  low: "Limited Stock",
  on_order: "On Order",
};

export const stockBandColors: Record<StockBand, string> = {
  high: "bg-green-100 text-green-800 border-green-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-red-100 text-red-800 border-red-200",
  on_order: "bg-blue-100 text-blue-800 border-blue-200",
};

export const trendLabels: Record<TrendDirection, { label: string; icon: string }> = {
  rising: { label: "Rising", icon: "↑" },
  stable: { label: "Stable", icon: "→" },
  falling: { label: "Falling", icon: "↓" },
};

export const trendColors: Record<TrendDirection, string> = {
  rising: "text-red-600",
  stable: "text-yellow-600",
  falling: "text-green-600",
};

export const demandColors: Record<DemandLevel, string> = {
  high: "bg-orange-100 text-orange-800 border-orange-200",
  medium: "bg-blue-100 text-blue-800 border-blue-200",
  low: "bg-gray-100 text-gray-800 border-gray-200",
};

// Live product data is fetched via src/repositories/products.ts. No static fixtures.


// V2 Inquiry with RFQ fields
export interface Inquiry {
  id: string;
  productListingId: string;
  commodity: string;
  buyerName: string;
  buyerCompany: string;
  buyerEmail: string;
  quantity: string;
  packaging: string;
  deliveryTimeline: string;
  deliveryLocation: string;
  message: string;
  status: "new" | "contacted" | "negotiation" | "converted";
  priority: LeadPriority;
  multiSellerFlag: boolean;
  createdAt: string;
}

