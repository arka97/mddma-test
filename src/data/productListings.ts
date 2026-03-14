// Product listings with pricing, MOQ, origin — for marketplace and storefronts

export interface ProductListing {
  id: string;
  sellerId: string;
  commodityId: string;
  commodity: string;
  variant: string;
  origin: string;
  packaging: string;
  moq: string;
  price: number | null; // null = RFQ only
  priceUnit: string;
  stockAvailable: boolean;
  location: string;
  listingDate: string;
  hidePrice: boolean;
}

export const productListings: ProductListing[] = [
  { id: "PL001", sellerId: "M001", commodityId: "P001", commodity: "Almonds", variant: "California Nonpareil", origin: "USA", packaging: "25kg Carton", moq: "100 kg", price: 850, priceUnit: "₹/kg", stockAvailable: true, location: "APMC Vashi", listingDate: "2025-03-01", hidePrice: false },
  { id: "PL002", sellerId: "M001", commodityId: "P004", commodity: "Pistachios", variant: "Iranian Round", origin: "Iran", packaging: "10kg Carton", moq: "50 kg", price: 1200, priceUnit: "₹/kg", stockAvailable: true, location: "APMC Vashi", listingDate: "2025-03-02", hidePrice: false },
  { id: "PL003", sellerId: "M001", commodityId: "P002", commodity: "Cashews", variant: "W240", origin: "Vietnam", packaging: "10kg Tin", moq: "50 kg", price: 780, priceUnit: "₹/kg", stockAvailable: true, location: "APMC Vashi", listingDate: "2025-02-28", hidePrice: false },
  { id: "PL004", sellerId: "M002", commodityId: "P003", commodity: "Dates", variant: "Kimia", origin: "Iran", packaging: "5kg Box", moq: "100 kg", price: 320, priceUnit: "₹/kg", stockAvailable: true, location: "Masjid Bunder", listingDate: "2025-03-05", hidePrice: false },
  { id: "PL005", sellerId: "M002", commodityId: "P003", commodity: "Dates", variant: "Safawi", origin: "Saudi Arabia", packaging: "10kg Carton", moq: "200 kg", price: 450, priceUnit: "₹/kg", stockAvailable: true, location: "Masjid Bunder", listingDate: "2025-03-03", hidePrice: false },
  { id: "PL006", sellerId: "M002", commodityId: "P007", commodity: "Dried Figs", variant: "Afghan Anjeer", origin: "Afghanistan", packaging: "10kg Carton", moq: "50 kg", price: 680, priceUnit: "₹/kg", stockAvailable: true, location: "Masjid Bunder", listingDate: "2025-03-01", hidePrice: false },
  { id: "PL007", sellerId: "M003", commodityId: "P005", commodity: "Walnuts", variant: "Chilean Halves", origin: "Chile", packaging: "10kg Carton", moq: "100 kg", price: 920, priceUnit: "₹/kg", stockAvailable: true, location: "Crawford Market", listingDate: "2025-02-25", hidePrice: false },
  { id: "PL008", sellerId: "M003", commodityId: "P006", commodity: "Raisins", variant: "Afghan Green", origin: "Afghanistan", packaging: "15kg Bag", moq: "150 kg", price: 280, priceUnit: "₹/kg", stockAvailable: true, location: "Crawford Market", listingDate: "2025-03-04", hidePrice: false },
  { id: "PL009", sellerId: "M004", commodityId: "P001", commodity: "Almonds", variant: "Mamra Badam", origin: "Afghanistan", packaging: "20kg Jute Bag", moq: "200 kg", price: null, priceUnit: "₹/kg", stockAvailable: true, location: "APMC Vashi", listingDate: "2025-03-06", hidePrice: true },
  { id: "PL010", sellerId: "M004", commodityId: "P009", commodity: "Saffron", variant: "Kashmiri Mogra", origin: "Kashmir", packaging: "25g Wholesale", moq: "100 g", price: 185000, priceUnit: "₹/kg", stockAvailable: true, location: "APMC Vashi", listingDate: "2025-03-01", hidePrice: true },
  { id: "PL011", sellerId: "M005", commodityId: "P024", commodity: "Mixed Dry Fruits", variant: "Premium Gift Box", origin: "India", packaging: "1kg Gift Box", moq: "50 boxes", price: 1200, priceUnit: "₹/box", stockAvailable: true, location: "Masjid Bunder", listingDate: "2025-03-07", hidePrice: false },
  { id: "PL012", sellerId: "M006", commodityId: "P002", commodity: "Cashews", variant: "W320 Roasted", origin: "India", packaging: "10kg Tin", moq: "100 kg", price: 720, priceUnit: "₹/kg", stockAvailable: true, location: "Mumbai", listingDate: "2025-02-20", hidePrice: false },
  { id: "PL013", sellerId: "M006", commodityId: "P025", commodity: "Fox Nuts", variant: "Plain Roasted", origin: "India", packaging: "10kg Bag", moq: "50 kg", price: 1100, priceUnit: "₹/kg", stockAvailable: true, location: "Mumbai", listingDate: "2025-03-08", hidePrice: false },
  { id: "PL014", sellerId: "M007", commodityId: "P001", commodity: "Almonds", variant: "California Nonpareil", origin: "USA", packaging: "25kg Tin", moq: "250 kg", price: null, priceUnit: "₹/kg", stockAvailable: true, location: "Crawford Market", listingDate: "2025-03-02", hidePrice: true },
  { id: "PL015", sellerId: "M007", commodityId: "P011", commodity: "Macadamia Nuts", variant: "Raw Whole", origin: "Australia", packaging: "5kg Tin", moq: "25 kg", price: 2800, priceUnit: "₹/kg", stockAvailable: false, location: "Crawford Market", listingDate: "2025-02-15", hidePrice: false },
  { id: "PL016", sellerId: "M008", commodityId: "P022", commodity: "Medjool Dates", variant: "Jumbo", origin: "Jordan", packaging: "5kg Box", moq: "50 kg", price: 1800, priceUnit: "₹/kg", stockAvailable: true, location: "Masjid Bunder", listingDate: "2025-03-10", hidePrice: false },
  { id: "PL017", sellerId: "M008", commodityId: "P023", commodity: "Ajwa Dates", variant: "Premium Grade", origin: "Saudi Arabia", packaging: "1kg Premium Box", moq: "100 boxes", price: 3200, priceUnit: "₹/kg", stockAvailable: true, location: "Masjid Bunder", listingDate: "2025-03-09", hidePrice: false },
  { id: "PL018", sellerId: "M010", commodityId: "P002", commodity: "Cashews", variant: "W180 (King)", origin: "India", packaging: "10kg Tin", moq: "50 kg", price: 1450, priceUnit: "₹/kg", stockAvailable: true, location: "APMC Vashi", listingDate: "2025-03-05", hidePrice: false },
  { id: "PL019", sellerId: "M013", commodityId: "P006", commodity: "Raisins", variant: "Golden Raisins", origin: "India", packaging: "15kg Bag", moq: "200 kg", price: 240, priceUnit: "₹/kg", stockAvailable: true, location: "Masjid Bunder", listingDate: "2025-03-04", hidePrice: false },
  { id: "PL020", sellerId: "M015", commodityId: "P010", commodity: "Pine Nuts", variant: "Afghan Chilgoza", origin: "Afghanistan", packaging: "5kg Tin", moq: "10 kg", price: 4500, priceUnit: "₹/kg", stockAvailable: true, location: "Mumbai", listingDate: "2025-03-06", hidePrice: false },
];

// Broker listings
export interface BrokerListing {
  id: string;
  type: "supply" | "demand";
  commodity: string;
  variant: string;
  quantity: string;
  location: string;
  brokerName: string;
  brokerCompany: string;
  contactWhatsapp: string;
  postedDate: string;
  status: "active" | "closed";
}

export const brokerListings: BrokerListing[] = [
  { id: "BL001", type: "supply", commodity: "Almonds", variant: "California Nonpareil 23/25", quantity: "5 MT", location: "APMC Vashi", brokerName: "Rajesh Shah", brokerCompany: "Shah Brothers", contactWhatsapp: "+919820012345", postedDate: "2025-03-10", status: "active" },
  { id: "BL002", type: "supply", commodity: "Dates", variant: "Kimia Fresh Arrival", quantity: "10 MT", location: "Masjid Bunder", brokerName: "Mohammed Hussain", brokerCompany: "Al-Madina Dates", contactWhatsapp: "+919820023456", postedDate: "2025-03-09", status: "active" },
  { id: "BL003", type: "demand", commodity: "Cashews", variant: "W240 Premium", quantity: "2 MT", location: "Delhi", brokerName: "Vikram Mehta", brokerCompany: "Surat Dry Fruit Mart", contactWhatsapp: "+919820045678", postedDate: "2025-03-08", status: "active" },
  { id: "BL004", type: "supply", commodity: "Pistachios", variant: "Iranian Round 28/30", quantity: "3 MT", location: "APMC Vashi", brokerName: "Suresh Agarwal", brokerCompany: "Royal Dry Fruits", contactWhatsapp: "+919820089012", postedDate: "2025-03-07", status: "active" },
  { id: "BL005", type: "demand", commodity: "Raisins", variant: "Afghan Green Premium", quantity: "8 MT", location: "Ahmedabad", brokerName: "Abdul Wahab", brokerCompany: "Afghani Kishmish House", contactWhatsapp: "+919820055678", postedDate: "2025-03-06", status: "active" },
  { id: "BL006", type: "supply", commodity: "Walnuts", variant: "Chilean Light Halves", quantity: "4 MT", location: "Crawford Market", brokerName: "Kantilal Patel", brokerCompany: "Patel Nuts & Spices", contactWhatsapp: "+919820034567", postedDate: "2025-03-05", status: "active" },
  { id: "BL007", type: "demand", commodity: "Dates", variant: "Medjool Jumbo", quantity: "1 MT", location: "Mumbai", brokerName: "Farooq Ahmed", brokerCompany: "Ajmeri Dates Center", contactWhatsapp: "+919820001234", postedDate: "2025-03-04", status: "active" },
  { id: "BL008", type: "supply", commodity: "Cashews", variant: "W180 King Size", quantity: "2 MT", location: "APMC Vashi", brokerName: "Naresh Shetty", brokerCompany: "New Bombay Cashew Mart", contactWhatsapp: "+919820044567", postedDate: "2025-03-03", status: "active" },
];

// Inquiry data for CRM
export interface Inquiry {
  id: string;
  productListingId: string;
  commodity: string;
  buyerName: string;
  buyerCompany: string;
  buyerEmail: string;
  quantity: string;
  message: string;
  status: "new" | "contacted" | "negotiation" | "converted";
  createdAt: string;
}

export const sampleInquiries: Inquiry[] = [
  { id: "INQ001", productListingId: "PL001", commodity: "Almonds", buyerName: "Amit Sharma", buyerCompany: "Delhi Dry Fruits Co.", buyerEmail: "amit@delhidf.com", quantity: "500 kg", message: "Need California almonds for retail packaging. Please share best price for 500kg.", status: "new", createdAt: "2025-03-12" },
  { id: "INQ002", productListingId: "PL004", commodity: "Dates", buyerName: "Fatima Khan", buyerCompany: "Hyderabad Dates House", buyerEmail: "fatima@hydates.com", quantity: "1 MT", message: "Looking for Kimia dates for Ramadan season. Need 1 MT delivery by April.", status: "contacted", createdAt: "2025-03-10" },
  { id: "INQ003", productListingId: "PL007", commodity: "Walnuts", buyerName: "Sanjay Gupta", buyerCompany: "Gupta Foods Nagpur", buyerEmail: "sanjay@guptafoods.com", quantity: "200 kg", message: "Regular requirement for Chilean walnuts. Can you supply monthly?", status: "negotiation", createdAt: "2025-03-08" },
  { id: "INQ004", productListingId: "PL012", commodity: "Cashews", buyerName: "Priya Patel", buyerCompany: "Ahmedabad Snacks Ltd", buyerEmail: "priya@asnacks.com", quantity: "1 MT", message: "Need roasted W320 cashews for our snack brand. Looking for long-term supplier.", status: "converted", createdAt: "2025-03-05" },
  { id: "INQ005", productListingId: "PL016", commodity: "Medjool Dates", buyerName: "Rahul Joshi", buyerCompany: "Premium Foods Delhi", buyerEmail: "rahul@premfoods.com", quantity: "100 kg", message: "Interested in Jumbo Medjool dates for corporate gifting.", status: "new", createdAt: "2025-03-11" },
  { id: "INQ006", productListingId: "PL018", commodity: "Cashews", buyerName: "Kiran Reddy", buyerCompany: "South Star Exports", buyerEmail: "kiran@southstar.com", quantity: "5 MT", message: "Export order for W180 cashews to UAE. Need competitive pricing.", status: "contacted", createdAt: "2025-03-09" },
  { id: "INQ007", productListingId: "PL020", commodity: "Pine Nuts", buyerName: "Chef Arjun", buyerCompany: "Taj Hotels Mumbai", buyerEmail: "arjun@tajhotels.com", quantity: "25 kg", message: "Regular monthly supply needed for our restaurant kitchens.", status: "negotiation", createdAt: "2025-03-07" },
  { id: "INQ008", productListingId: "PL002", commodity: "Pistachios", buyerName: "Manish Agarwal", buyerCompany: "Bharat Dry Fruits", buyerEmail: "manish@bharatdf.com", quantity: "300 kg", message: "Looking for Iranian round pistachios. Need sample first.", status: "new", createdAt: "2025-03-13" },
];

// Community mock data
export interface CommunityPost {
  id: string;
  category: "Market Updates" | "Trade Discussions" | "Association Circulars";
  title: string;
  author: string;
  authorCompany: string;
  replies: number;
  views: number;
  lastActivity: string;
  pinned: boolean;
}

export const communityPosts: CommunityPost[] = [
  { id: "CP001", category: "Market Updates", title: "Almond prices expected to rise 15% in Q2 2025 — California crop report", author: "Rajesh Shah", authorCompany: "Shah Brothers", replies: 23, views: 456, lastActivity: "2025-03-13", pinned: true },
  { id: "CP002", category: "Market Updates", title: "Iran pistachio harvest predictions for 2025 season", author: "Suresh Agarwal", authorCompany: "Royal Dry Fruits", replies: 15, views: 312, lastActivity: "2025-03-12", pinned: false },
  { id: "CP003", category: "Trade Discussions", title: "Best practices for cold storage of dates during summer", author: "Mohammed Hussain", authorCompany: "Al-Madina Dates", replies: 31, views: 587, lastActivity: "2025-03-11", pinned: false },
  { id: "CP004", category: "Association Circulars", title: "MDDMA Annual General Meeting 2025 — Agenda Released", author: "MDDMA Admin", authorCompany: "MDDMA", replies: 8, views: 890, lastActivity: "2025-03-10", pinned: true },
  { id: "CP005", category: "Market Updates", title: "Afghan raisin supply tight — prices up 20% at Masjid Bunder", author: "Abdul Wahab", authorCompany: "Afghani Kishmish House", replies: 19, views: 423, lastActivity: "2025-03-09", pinned: false },
  { id: "CP006", category: "Trade Discussions", title: "New FSSAI labeling requirements — what you need to know", author: "Kantilal Patel", authorCompany: "Patel Nuts & Spices", replies: 27, views: 651, lastActivity: "2025-03-08", pinned: false },
  { id: "CP007", category: "Trade Discussions", title: "Vietnam vs India cashew quality comparison — 2025 perspective", author: "Naresh Shetty", authorCompany: "New Bombay Cashew Mart", replies: 42, views: 892, lastActivity: "2025-03-07", pinned: false },
  { id: "CP008", category: "Association Circulars", title: "Fire safety compliance deadline extended to April 2025", author: "MDDMA Admin", authorCompany: "MDDMA", replies: 5, views: 345, lastActivity: "2025-03-06", pinned: false },
  { id: "CP009", category: "Market Updates", title: "Turkey dried fig export ban — impact on Indian market", author: "Farooq Ahmed", authorCompany: "Ajmeri Dates Center", replies: 14, views: 278, lastActivity: "2025-03-05", pinned: false },
  { id: "CP010", category: "Trade Discussions", title: "GST input credit issues for importers — solutions discussed", author: "Mohan Vaswani", authorCompany: "Sindhi Dry Fruits Corp", replies: 36, views: 712, lastActivity: "2025-03-04", pinned: false },
];
