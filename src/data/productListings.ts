// Product listings — Controlled Marketplace model
// Public surfaces show price ranges only; auth gates exact figures.

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
  priceMin: number | null;
  priceMax: number | null;
  priceUnit: string;
  location: string;
  listingDate: string;
  // Seller-uploaded media (optional; live listings only)
  imageUrl?: string | null;
  gallery?: string[] | null;
  videoUrl?: string | null;
}

// Live product data is fetched via src/repositories/products.ts. No static fixtures.

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
