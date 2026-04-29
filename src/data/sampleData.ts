// Comprehensive MDDMA B2B Platform Data

// ===== TYPES =====

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
  logoPlaceholder: string; // initials for avatar
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: "Dry Fruits" | "Dates" | "Seeds" | "Spices";
  image: string; // emoji placeholder
  description: string;
  variants: string[];
  packagingFormats: string[];
  sellerMemberIds: string[];
  affiliateLinks: { name: string; url: string }[];
}

export interface LeadPack {
  id: string;
  title: string;
  expoName: string;
  year: number;
  categories: string[];
  format: "Excel" | "PDF" | "Excel + PDF";
  recordCount: number;
  price: number;
  includedInTiers: string[];
}

export interface Advertiser {
  id: string;
  companyName: string;
  bannerText: string;
  targetPage: string;
  placement: "homepage-banner" | "category-banner" | "directory-sidebar";
  startDate: string;
  endDate: string;
  link: string;
  isActive: boolean;
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

export interface CommitteeMember {
  id: string;
  name: string;
  designation: string;
  firmName: string;
  order: number;
}

// ===== ASSOCIATION STATS =====
export const associationStats = {
  memberCount: 350,
  yearsOfService: 95,
  marketsCovered: 5,
  commodityTypes: 25,
};

// ===== 15 MEMBERS =====
export const sampleMembers: Member[] = [
  {
    id: "M001", firmName: "Shah Brothers Dry Fruits", ownerName: "Rajesh Shah", slug: "shah-brothers",
    area: "APMC Vashi", fullAddress: "Shop 45, Sector 19, APMC Market, Vashi, Navi Mumbai - 400705",
    commodities: ["Almonds", "Cashews", "Pistachios"], originSpecialization: ["USA", "Vietnam", "Iran"],
    memberType: "Importer", verificationStatus: "Verified", verificationLevel: "Business",
    membershipStatus: "Active", memberSince: 1985,
    phone: "+91 98200 12345", whatsapp: "+91 98200 12345", email: "shah.brothers@email.com",
    gstNumber: "27AABCS1234A1Z5", fssaiNumber: "11521999000123",
    description: "Leading importer of premium California almonds and Vietnamese cashews. Three generations of expertise in dry fruits trade with direct sourcing from origin countries.",
    isFeatured: true, isSponsored: true, logoPlaceholder: "SB"
  },
  {
    id: "M002", firmName: "Al-Madina Dates Trading", ownerName: "Mohammed Hussain", slug: "al-madina-dates",
    area: "Masjid Bunder", fullAddress: "152, Mirza Street, Masjid Bunder, Mumbai - 400003",
    commodities: ["Dates", "Dry Figs", "Apricots"], originSpecialization: ["Saudi Arabia", "Iran", "Turkey"],
    memberType: "Importer", verificationStatus: "Verified", verificationLevel: "Business",
    membershipStatus: "Active", memberSince: 1992,
    phone: "+91 98200 23456", whatsapp: "+91 98200 23456", email: "almadina.dates@email.com",
    gstNumber: "27AABCA2345B2Z6", fssaiNumber: "11521999000124",
    description: "Specialists in premium Saudi and Iranian dates. Direct import relationships with farms in Madinah and Kerman provinces.",
    isFeatured: true, isSponsored: false, logoPlaceholder: "AM"
  },
  {
    id: "M003", firmName: "Patel Nuts & Spices", ownerName: "Kantilal Patel", slug: "patel-nuts",
    area: "Crawford Market", fullAddress: "Block B, Shop 23, Crawford Market, Mumbai - 400001",
    commodities: ["Walnuts", "Raisins", "Cashews"], originSpecialization: ["Chile", "Afghanistan", "India"],
    memberType: "Wholesaler", verificationStatus: "Verified", verificationLevel: "Business",
    membershipStatus: "Active", memberSince: 1978,
    phone: "+91 98200 34567", whatsapp: "+91 98200 34567", email: "patel.nuts@email.com",
    gstNumber: "27AABCP3456C3Z7",
    description: "Heritage wholesaler at Crawford Market. Known for premium quality Chilean walnuts and Afghan raisins.",
    isFeatured: false, isSponsored: false, logoPlaceholder: "PN"
  },
  {
    id: "M004", firmName: "Surat Dry Fruit Mart", ownerName: "Vikram Mehta", slug: "surat-dry-fruit",
    area: "APMC Vashi", fullAddress: "Shop 78, Sector 19, APMC Market, Vashi, Navi Mumbai - 400705",
    commodities: ["Almonds", "Pistachios", "Saffron"], originSpecialization: ["USA", "Iran", "Kashmir"],
    memberType: "Wholesaler", verificationStatus: "Verified", verificationLevel: "Basic",
    membershipStatus: "Active", memberSince: 2001,
    phone: "+91 98200 45678", whatsapp: "+91 98200 45678", email: "surat.mart@email.com",
    gstNumber: "27AABCS4567D4Z8",
    description: "Wholesale distributor specializing in American almonds, Iranian pistachios and authentic Kashmiri saffron.",
    isFeatured: false, isSponsored: false, logoPlaceholder: "SD"
  },
  {
    id: "M005", firmName: "Karachi Bakery & Dry Fruits", ownerName: "Abdul Rahim", slug: "karachi-bakery",
    area: "Masjid Bunder", fullAddress: "88, Mohammed Ali Road, Masjid Bunder, Mumbai - 400003",
    commodities: ["Dates", "Almonds", "Mixed Dry Fruits"], originSpecialization: ["Saudi Arabia", "USA", "India"],
    memberType: "Retailer", verificationStatus: "Verified", verificationLevel: "Business",
    membershipStatus: "Active", memberSince: 1965,
    phone: "+91 98200 56789", whatsapp: "+91 98200 56789", email: "karachi.bakery@email.com",
    gstNumber: "27AABCK5678E5Z9", fssaiNumber: "11521999000126",
    description: "Iconic 60-year-old family business on Mohammed Ali Road. Known for premium gift packing and festive season bulk supply.",
    isFeatured: true, isSponsored: true, logoPlaceholder: "KB"
  },
  {
    id: "M006", firmName: "Gujarat Nut House", ownerName: "Bhavesh Desai", slug: "gujarat-nut-house",
    area: "Mumbai", fullAddress: "12, Senapati Bapat Marg, Dadar West, Mumbai - 400028",
    commodities: ["Cashews", "Peanuts", "Seeds"], originSpecialization: ["India", "Vietnam"],
    memberType: "Processor", verificationStatus: "Verified", verificationLevel: "Basic",
    membershipStatus: "Active", memberSince: 1995,
    phone: "+91 98200 67890", whatsapp: "+91 98200 67890", email: "gujarat.nuts@email.com",
    gstNumber: "27AABCG6789F6Z0",
    description: "Processing unit specializing in roasted, salted and flavored cashews. FSSAI certified modern processing facility.",
    isFeatured: false, isSponsored: false, logoPlaceholder: "GN"
  },
  {
    id: "M007", firmName: "Royal Dry Fruits Co.", ownerName: "Suresh Agarwal", slug: "royal-dry-fruits",
    area: "Crawford Market", fullAddress: "Block C, Shop 5, Crawford Market, Mumbai - 400001",
    commodities: ["Premium Almonds", "Pistachios", "Macadamia"], originSpecialization: ["USA", "Iran", "Australia"],
    memberType: "Importer", verificationStatus: "Verified", verificationLevel: "Business",
    membershipStatus: "Active", memberSince: 1972,
    phone: "+91 98200 89012", whatsapp: "+91 98200 89012", email: "royal.df@email.com",
    gstNumber: "27AABCR8901H8Z2", fssaiNumber: "11521999000128",
    description: "Premium import house dealing in top-grade nuts from California, Iran and Australia. Known for consistent quality.",
    isFeatured: true, isSponsored: false, logoPlaceholder: "RD"
  },
  {
    id: "M008", firmName: "Ajmeri Dates Center", ownerName: "Farooq Ahmed", slug: "ajmeri-dates",
    area: "Masjid Bunder", fullAddress: "99, Mohammed Ali Road, Masjid Bunder, Mumbai - 400003",
    commodities: ["Ajwa Dates", "Medjool Dates", "Kimia Dates"], originSpecialization: ["Saudi Arabia", "Jordan", "Iran"],
    memberType: "Importer", verificationStatus: "Verified", verificationLevel: "Business",
    membershipStatus: "Active", memberSince: 1999,
    phone: "+91 98200 01234", whatsapp: "+91 98200 01234", email: "ajmeri.dates@email.com",
    gstNumber: "27AABCA0123J0Z4",
    description: "India's largest dedicated dates importer. Exclusive distribution partnerships with Saudi and Jordanian date farms.",
    isFeatured: true, isSponsored: true, logoPlaceholder: "AD"
  },
  {
    id: "M009", firmName: "Afghani Kishmish House", ownerName: "Abdul Wahab", slug: "afghani-kishmish",
    area: "Masjid Bunder", fullAddress: "178, Mirza Street, Masjid Bunder, Mumbai - 400003",
    commodities: ["Raisins", "Apricots", "Dry Figs"], originSpecialization: ["Afghanistan", "Turkey", "Iran"],
    memberType: "Importer", verificationStatus: "Verified", verificationLevel: "Basic",
    membershipStatus: "Active", memberSince: 1975,
    phone: "+91 98200 55678", whatsapp: "+91 98200 55678", email: "afghani.kishmish@email.com",
    gstNumber: "27AABCA5567O5Z9",
    description: "Specialists in Afghan green raisins and Turkish dried apricots. Direct sourcing from Kabul and Malatya.",
    isFeatured: false, isSponsored: false, logoPlaceholder: "AK"
  },
  {
    id: "M010", firmName: "New Bombay Cashew Mart", ownerName: "Naresh Shetty", slug: "new-bombay-cashew",
    area: "APMC Vashi", fullAddress: "Shop 89, Sector 19, APMC Market, Vashi, Navi Mumbai - 400705",
    commodities: ["Cashews", "Cashew Products"], originSpecialization: ["India", "Vietnam", "Tanzania"],
    memberType: "Wholesaler", verificationStatus: "Verified", verificationLevel: "Basic",
    membershipStatus: "Active", memberSince: 1997,
    phone: "+91 98200 44567", whatsapp: "+91 98200 44567", email: "newbombay.cashew@email.com",
    gstNumber: "27AABCN4456N4Z8",
    description: "Largest cashew wholesaler at APMC Vashi. Dealing in all grades from W180 to splits and pieces.",
    isFeatured: false, isSponsored: false, logoPlaceholder: "NB"
  },
  {
    id: "M011", firmName: "Heritage Nuts & Spices", ownerName: "Ashok Agarwal", slug: "heritage-nuts",
    area: "Crawford Market", fullAddress: "Block B, Shop 8, Crawford Market, Mumbai - 400001",
    commodities: ["Walnuts", "Macadamia", "Hazelnuts"], originSpecialization: ["Chile", "USA", "Turkey"],
    memberType: "Importer", verificationStatus: "Verified", verificationLevel: "Business",
    membershipStatus: "Active", memberSince: 1980,
    phone: "+91 98200 33345", whatsapp: "+91 98200 33345", email: "heritage.nuts@email.com",
    gstNumber: "27AABCH3334W3Z7", fssaiNumber: "11521999000131",
    description: "Premium nut importers specializing in exotic varieties. Known for quality testing and grading standards.",
    isFeatured: false, isSponsored: false, logoPlaceholder: "HN"
  },
  {
    id: "M012", firmName: "Mumbai Meva Mart", ownerName: "Prakash Jain", slug: "mumbai-meva",
    area: "Navi Mumbai", fullAddress: "Shop 34, Vallabh Baug Lane, Ghatkopar East, Mumbai - 400077",
    commodities: ["Cashews", "Almonds", "Raisins", "Seeds"], originSpecialization: ["India", "USA", "Afghanistan"],
    memberType: "Retailer", verificationStatus: "Not Verified", verificationLevel: "Basic",
    membershipStatus: "Pending Renewal", memberSince: 2010,
    phone: "+91 98200 90123", whatsapp: "+91 98200 90123", email: "mumbai.meva@email.com",
    gstNumber: "27AABCM9012I9Z3",
    description: "Retail chain in eastern suburbs. Focus on value-for-money dry fruits and custom gift hampers.",
    isFeatured: false, isSponsored: false, logoPlaceholder: "MM"
  },
  {
    id: "M013", firmName: "Golden Kismis Trading", ownerName: "Yusuf Merchant", slug: "golden-kismis",
    area: "Masjid Bunder", fullAddress: "145, Mohammed Ali Road, Masjid Bunder, Mumbai - 400003",
    commodities: ["Golden Raisins", "Black Raisins", "Sultanas"], originSpecialization: ["Afghanistan", "India", "Iran"],
    memberType: "Wholesaler", verificationStatus: "Verified", verificationLevel: "Business",
    membershipStatus: "Active", memberSince: 1994,
    phone: "+91 98200 44456", whatsapp: "+91 98200 44456", email: "golden.kismis@email.com",
    gstNumber: "27AABCG4445X4Z8",
    description: "Raisin specialists with the widest variety in Mumbai. Direct sourcing from Kandahar and Nashik.",
    isFeatured: false, isSponsored: false, logoPlaceholder: "GK"
  },
  {
    id: "M014", firmName: "Chennai Cashew Trading", ownerName: "Venkatesh Iyer", slug: "chennai-cashew",
    area: "APMC Vashi", fullAddress: "Shop 156, Sector 19, APMC Market, Vashi, Navi Mumbai - 400705",
    commodities: ["Cashews", "Pepper", "Cardamom"], originSpecialization: ["India", "Vietnam"],
    memberType: "Wholesaler", verificationStatus: "Not Verified", verificationLevel: "Basic",
    membershipStatus: "Active", memberSince: 2008,
    phone: "+91 98200 66789", whatsapp: "+91 98200 66789", email: "chennai.cashew@email.com",
    gstNumber: "27AABCC6678P6Z0",
    description: "South Indian cashew specialists. Direct procurement from Kerala and Goa processing units.",
    isFeatured: false, isSponsored: false, logoPlaceholder: "CC"
  },
  {
    id: "M015", firmName: "Sindhi Dry Fruits Corp", ownerName: "Mohan Vaswani", slug: "sindhi-dry-fruits",
    area: "Mumbai", fullAddress: "45, Ranade Road, Dadar West, Mumbai - 400028",
    commodities: ["Cashews", "Almonds", "Pine Nuts", "Seeds"], originSpecialization: ["USA", "India", "China"],
    memberType: "Importer", verificationStatus: "Verified", verificationLevel: "Business",
    membershipStatus: "Active", memberSince: 1958,
    phone: "+91 98200 00123", whatsapp: "+91 98200 00123", email: "sindhi.corp@email.com",
    gstNumber: "27AABCS0012T0Z4", fssaiNumber: "11521999000135",
    description: "One of Mumbai's oldest dry fruits trading houses. Five decades of trusted supply to hotels, restaurants and caterers.",
    isFeatured: true, isSponsored: false, logoPlaceholder: "SD"
  },
];

// ===== 25 PRODUCTS =====
export const sampleProducts: Product[] = [
  {
    id: "P001", name: "Almonds (Badam)", slug: "almonds", category: "Dry Fruits", image: "🥜",
    description: "Premium quality almonds sourced from California, Afghanistan and Indian origins. Almonds are one of the most traded dry fruits in Mumbai's wholesale markets.",
    variants: ["California Almonds", "Gurbandi Badam", "Mamra Badam", "Kagzi Badam", "Roasted & Salted"],
    packagingFormats: ["10kg Carton", "20kg Jute Bag", "25kg Tin", "500g Retail Pack", "1kg Retail Pack"],
    sellerMemberIds: ["M001", "M004", "M005", "M007", "M015"],
    affiliateLinks: [
      { name: "Amazon", url: "https://amazon.in" },
      { name: "Flipkart", url: "https://flipkart.com" },
      { name: "BigBasket", url: "https://bigbasket.com" },
    ]
  },
  {
    id: "P002", name: "Cashews (Kaju)", slug: "cashews", category: "Dry Fruits", image: "🥜",
    description: "High quality cashew nuts graded as per international standards. India is both a major producer and consumer of cashews.",
    variants: ["W180 (King)", "W240", "W320", "W450", "Splits", "Pieces", "Roasted & Salted", "Flavored"],
    packagingFormats: ["10kg Tin", "20kg Carton", "25kg Jute Bag", "250g Retail Pack", "500g Retail Pack"],
    sellerMemberIds: ["M003", "M006", "M010", "M014", "M015"],
    affiliateLinks: [
      { name: "Amazon", url: "https://amazon.in" },
      { name: "Flipkart", url: "https://flipkart.com" },
    ]
  },
  {
    id: "P003", name: "Dates (Khajoor)", slug: "dates", category: "Dates", image: "🌴",
    description: "Premium dates from the Middle East including Saudi Arabia, Iran and Jordan. Dates are among the highest volume imports in Mumbai's dry fruits trade.",
    variants: ["Ajwa", "Medjool", "Kimia", "Mazafati", "Deglet Noor", "Safawi", "Sukkari", "Mabroom"],
    packagingFormats: ["5kg Box", "10kg Carton", "20kg Bulk", "500g Retail", "1kg Premium Box"],
    sellerMemberIds: ["M002", "M005", "M008"],
    affiliateLinks: [
      { name: "Amazon", url: "https://amazon.in" },
      { name: "BigBasket", url: "https://bigbasket.com" },
      { name: "Flipkart", url: "https://flipkart.com" },
    ]
  },
  {
    id: "P004", name: "Pistachios (Pista)", slug: "pistachios", category: "Dry Fruits", image: "🥜",
    description: "Green gold of dry fruits. Premium pistachios from Iran and California are highly sought after in Indian markets.",
    variants: ["Iranian Round", "American Long", "Roasted & Salted", "Raw Green Kernel", "Saffron Flavored"],
    packagingFormats: ["10kg Carton", "25kg Bag", "500g Retail", "1kg Retail Pack"],
    sellerMemberIds: ["M001", "M004", "M007"],
    affiliateLinks: [
      { name: "Amazon", url: "https://amazon.in" },
      { name: "BigBasket", url: "https://bigbasket.com" },
    ]
  },
  {
    id: "P005", name: "Walnuts (Akhrot)", slug: "walnuts", category: "Dry Fruits", image: "🥜",
    description: "Brain-shaped superfood. Quality walnuts from Chile, Kashmir and California for both wholesale and retail markets.",
    variants: ["Chilean Halves", "Kashmiri (With Shell)", "California Light Halves", "Broken Pieces"],
    packagingFormats: ["10kg Carton", "20kg Jute Bag", "250g Retail", "500g Retail"],
    sellerMemberIds: ["M003", "M011"],
    affiliateLinks: [
      { name: "Amazon", url: "https://amazon.in" },
      { name: "Flipkart", url: "https://flipkart.com" },
    ]
  },
  {
    id: "P006", name: "Raisins (Kishmish)", slug: "raisins", category: "Dry Fruits", image: "🍇",
    description: "Diverse range of raisins including Afghan green, Indian golden and Turkish sultanas. A staple in Indian cooking and snacking.",
    variants: ["Afghan Green", "Indian Golden", "Black (Munakka)", "Sultanas", "Thompson Seedless"],
    packagingFormats: ["10kg Carton", "15kg Bag", "20kg Bulk", "250g Retail", "500g Retail"],
    sellerMemberIds: ["M003", "M009", "M013"],
    affiliateLinks: [
      { name: "Amazon", url: "https://amazon.in" },
      { name: "BigBasket", url: "https://bigbasket.com" },
    ]
  },
  {
    id: "P007", name: "Dried Figs (Anjeer)", slug: "dried-figs", category: "Dry Fruits", image: "🫐",
    description: "Premium dried figs from Afghanistan, Turkey and Iran. Known for nutritional value and growing demand in health-conscious markets.",
    variants: ["Afghan Anjeer", "Turkish Figs", "Iranian Figs", "Organic Figs"],
    packagingFormats: ["5kg Box", "10kg Carton", "250g Retail", "500g Retail"],
    sellerMemberIds: ["M002", "M009"],
    affiliateLinks: [
      { name: "Amazon", url: "https://amazon.in" },
    ]
  },
  {
    id: "P008", name: "Dried Apricots (Jardalu)", slug: "dried-apricots", category: "Dry Fruits", image: "🍑",
    description: "Sun-dried apricots from Turkey, Ladakh and Hunza Valley. Rich in iron and potassium, popular in health food segment.",
    variants: ["Turkish Apricots", "Ladakhi Apricots", "Hunza Apricots", "Organic"],
    packagingFormats: ["5kg Box", "10kg Carton", "250g Retail", "500g Retail"],
    sellerMemberIds: ["M002", "M009"],
    affiliateLinks: [
      { name: "Amazon", url: "https://amazon.in" },
    ]
  },
  {
    id: "P009", name: "Saffron (Kesar)", slug: "saffron", category: "Spices", image: "🌸",
    description: "The world's most expensive spice. Premium saffron from Kashmir and Iran for culinary, medicinal and cosmetic use.",
    variants: ["Kashmiri Mogra", "Iranian Negin", "Spanish Saffron", "Pushali"],
    packagingFormats: ["1g Pack", "5g Pack", "10g Pack", "25g Wholesale", "100g Bulk"],
    sellerMemberIds: ["M004"],
    affiliateLinks: [
      { name: "Amazon", url: "https://amazon.in" },
    ]
  },
  {
    id: "P010", name: "Pine Nuts (Chilgoza)", slug: "pine-nuts", category: "Dry Fruits", image: "🌲",
    description: "Rare and premium pine nuts sourced from Pakistan, Afghanistan and China. High-value product in festive and gourmet segments.",
    variants: ["Afghan Chilgoza", "Pakistani Pine Nuts", "Chinese Pine Nuts", "Shelled Kernels"],
    packagingFormats: ["1kg Pack", "5kg Tin", "10kg Carton", "250g Retail"],
    sellerMemberIds: ["M015"],
    affiliateLinks: [
      { name: "Amazon", url: "https://amazon.in" },
    ]
  },
  {
    id: "P011", name: "Macadamia Nuts", slug: "macadamia", category: "Dry Fruits", image: "🥜",
    description: "Premium Australian and Hawaiian macadamia nuts. Growing demand in India's premium snacking and confectionery segments.",
    variants: ["Raw Whole", "Roasted & Salted", "Chocolate Coated", "Halves"],
    packagingFormats: ["5kg Tin", "10kg Carton", "250g Retail", "500g Retail"],
    sellerMemberIds: ["M007", "M011"],
    affiliateLinks: [
      { name: "Amazon", url: "https://amazon.in" },
    ]
  },
  {
    id: "P012", name: "Hazelnuts", slug: "hazelnuts", category: "Dry Fruits", image: "🌰",
    description: "Turkish hazelnuts — the gold standard. Used extensively in confectionery, chocolate making and as table nuts.",
    variants: ["Turkish Natural", "Blanched", "Roasted", "Chopped", "Hazelnut Paste"],
    packagingFormats: ["10kg Bag", "25kg Bag", "500g Retail", "1kg Retail"],
    sellerMemberIds: ["M011"],
    affiliateLinks: [
      { name: "Amazon", url: "https://amazon.in" },
    ]
  },
  {
    id: "P013", name: "Pumpkin Seeds", slug: "pumpkin-seeds", category: "Seeds", image: "🎃",
    description: "Nutrient-dense superfood seeds. Growing rapidly in India's health food market with major supply from China and India.",
    variants: ["Raw Green", "Roasted & Salted", "Organic", "Hull-less"],
    packagingFormats: ["10kg Bag", "25kg Bag", "250g Retail", "500g Retail"],
    sellerMemberIds: ["M006", "M012"],
    affiliateLinks: [
      { name: "Amazon", url: "https://amazon.in" },
      { name: "BigBasket", url: "https://bigbasket.com" },
    ]
  },
  {
    id: "P014", name: "Sunflower Seeds", slug: "sunflower-seeds", category: "Seeds", image: "🌻",
    description: "Popular health snack and bakery ingredient. Available in raw, roasted and flavored varieties.",
    variants: ["Raw", "Roasted & Salted", "Honey Roasted", "BBQ Flavored"],
    packagingFormats: ["10kg Bag", "25kg Bag", "200g Retail", "500g Retail"],
    sellerMemberIds: ["M006", "M012"],
    affiliateLinks: [
      { name: "Amazon", url: "https://amazon.in" },
    ]
  },
  {
    id: "P015", name: "Flax Seeds (Alsi)", slug: "flax-seeds", category: "Seeds", image: "🌾",
    description: "Rich in omega-3 fatty acids. Key ingredient in health food products and traditional remedies.",
    variants: ["Brown Flax Seeds", "Golden Flax Seeds", "Ground Flax Meal", "Organic"],
    packagingFormats: ["10kg Bag", "25kg Bag", "250g Retail", "500g Retail"],
    sellerMemberIds: ["M006"],
    affiliateLinks: [
      { name: "Amazon", url: "https://amazon.in" },
    ]
  },
  {
    id: "P016", name: "Chia Seeds", slug: "chia-seeds", category: "Seeds", image: "🌱",
    description: "Superfood seeds from Mexico and South America. Rapidly growing segment in India's health and wellness market.",
    variants: ["Black Chia Seeds", "White Chia Seeds", "Organic Chia"],
    packagingFormats: ["5kg Bag", "10kg Bag", "200g Retail", "500g Retail"],
    sellerMemberIds: ["M006", "M015"],
    affiliateLinks: [
      { name: "Amazon", url: "https://amazon.in" },
      { name: "BigBasket", url: "https://bigbasket.com" },
    ]
  },
  {
    id: "P017", name: "Black Pepper", slug: "black-pepper", category: "Spices", image: "⚫",
    description: "King of spices. Premium Malabar and Tellicherry pepper from Kerala, India's spice capital.",
    variants: ["Tellicherry Bold", "Malabar", "Crushed", "Ground"],
    packagingFormats: ["10kg Bag", "25kg Bag", "50kg Bag", "100g Retail"],
    sellerMemberIds: ["M014"],
    affiliateLinks: [
      { name: "Amazon", url: "https://amazon.in" },
    ]
  },
  {
    id: "P018", name: "Cardamom (Elaichi)", slug: "cardamom", category: "Spices", image: "💚",
    description: "Queen of spices. Premium green cardamom from Guatemala and Kerala for culinary and festive use.",
    variants: ["Green 8mm Bold", "Green 7mm", "Bleached White", "Ground"],
    packagingFormats: ["5kg Box", "10kg Box", "25kg Bag", "50g Retail", "100g Retail"],
    sellerMemberIds: ["M014"],
    affiliateLinks: [
      { name: "Amazon", url: "https://amazon.in" },
    ]
  },
  {
    id: "P019", name: "Peanuts (Moongphali)", slug: "peanuts", category: "Dry Fruits", image: "🥜",
    description: "India's most consumed nut. Versatile product used in snacking, cooking oils and confectionery.",
    variants: ["Bold (Java)", "Runner", "TJ Grade", "Blanched", "Roasted & Salted", "Flavored"],
    packagingFormats: ["25kg Jute Bag", "50kg Bag", "500g Retail", "1kg Retail"],
    sellerMemberIds: ["M006"],
    affiliateLinks: [
      { name: "Amazon", url: "https://amazon.in" },
      { name: "BigBasket", url: "https://bigbasket.com" },
    ]
  },
  {
    id: "P020", name: "Prunes", slug: "prunes", category: "Dry Fruits", image: "🟣",
    description: "Dried plums known for digestive health benefits. Premium quality from California and Chile.",
    variants: ["Pitted Prunes", "Unpitted", "Organic", "Prune Juice"],
    packagingFormats: ["5kg Box", "10kg Carton", "250g Retail", "500g Retail"],
    sellerMemberIds: ["M007", "M011"],
    affiliateLinks: [
      { name: "Amazon", url: "https://amazon.in" },
    ]
  },
  {
    id: "P021", name: "Cranberries (Dried)", slug: "cranberries", category: "Dry Fruits", image: "🔴",
    description: "Sweetened dried cranberries popular in trail mixes, baking and healthy snacking.",
    variants: ["Sweetened Dried", "Unsweetened", "Organic", "Sliced"],
    packagingFormats: ["5kg Bag", "10kg Carton", "200g Retail", "500g Retail"],
    sellerMemberIds: ["M007", "M015"],
    affiliateLinks: [
      { name: "Amazon", url: "https://amazon.in" },
    ]
  },
  {
    id: "P022", name: "Medjool Dates", slug: "medjool-dates", category: "Dates", image: "🌴",
    description: "The king of dates. Large, caramel-flavored premium dates from Jordan, Palestine and California.",
    variants: ["Jumbo", "Large", "Medium", "Organic Medjool"],
    packagingFormats: ["5kg Box", "1kg Premium Box", "500g Gift Pack", "250g Retail"],
    sellerMemberIds: ["M008"],
    affiliateLinks: [
      { name: "Amazon", url: "https://amazon.in" },
      { name: "BigBasket", url: "https://bigbasket.com" },
    ]
  },
  {
    id: "P023", name: "Ajwa Dates", slug: "ajwa-dates", category: "Dates", image: "🌴",
    description: "Sacred dates from Madinah, Saudi Arabia. Highly valued for religious significance and health benefits.",
    variants: ["Premium Grade", "Standard Grade", "Organic"],
    packagingFormats: ["1kg Premium Box", "500g Box", "250g Gift Pack"],
    sellerMemberIds: ["M008", "M002"],
    affiliateLinks: [
      { name: "Amazon", url: "https://amazon.in" },
    ]
  },
  {
    id: "P024", name: "Mixed Dry Fruits", slug: "mixed-dry-fruits", category: "Dry Fruits", image: "🥗",
    description: "Curated assortments of premium nuts and dried fruits. Popular for gifting, especially during Diwali and other festivals.",
    variants: ["Premium Mix", "Health Mix", "Trail Mix", "Festival Gift Box", "Corporate Gift Hamper"],
    packagingFormats: ["500g Gift Box", "1kg Gift Box", "2kg Hamper", "250g Retail"],
    sellerMemberIds: ["M005", "M012"],
    affiliateLinks: [
      { name: "Amazon", url: "https://amazon.in" },
      { name: "Flipkart", url: "https://flipkart.com" },
      { name: "BigBasket", url: "https://bigbasket.com" },
    ]
  },
  {
    id: "P025", name: "Fox Nuts (Makhana)", slug: "fox-nuts", category: "Seeds", image: "⚪",
    description: "Puffed lotus seeds — India's fastest growing healthy snack. Bihar is the largest producer globally.",
    variants: ["Plain Roasted", "Salt & Pepper", "Cream & Onion", "Peri Peri", "Raw"],
    packagingFormats: ["10kg Bag", "25kg Bag", "100g Retail", "250g Retail"],
    sellerMemberIds: ["M006", "M012"],
    affiliateLinks: [
      { name: "Amazon", url: "https://amazon.in" },
      { name: "BigBasket", url: "https://bigbasket.com" },
    ]
  },
];

// ===== PRODUCT CATEGORIES =====
export const productCategories = [
  { name: "Dry Fruits", slug: "dry-fruits", icon: "🥜", count: 14 },
  { name: "Dates", slug: "dates", icon: "🌴", count: 3 },
  { name: "Seeds", slug: "seeds", icon: "🌱", count: 5 },
  { name: "Spices", slug: "spices", icon: "🌶️", count: 3 },
];

// ===== 6 LEAD PACKS =====
export const sampleLeadPacks: LeadPack[] = [
  {
    id: "LP001", title: "MEWA India 2025 — Exhibitor Database",
    expoName: "MEWA India", year: 2025,
    categories: ["Buyers", "Suppliers", "Importers"],
    format: "Excel", recordCount: 450, price: 4999,
    includedInTiers: ["Platinum"]
  },
  {
    id: "LP002", title: "Gulfood Dubai 2025 — Full Exhibitor List",
    expoName: "Gulfood", year: 2025,
    categories: ["Suppliers", "Importers", "Packaging"],
    format: "Excel + PDF", recordCount: 1200, price: 9999,
    includedInTiers: ["Platinum"]
  },
  {
    id: "LP003", title: "SIAL Paris 2024 — Dry Fruits & Nuts Exhibitors",
    expoName: "SIAL", year: 2024,
    categories: ["Suppliers", "Buyers", "Machinery"],
    format: "Excel", recordCount: 320, price: 3999,
    includedInTiers: ["Gold", "Platinum"]
  },
  {
    id: "LP004", title: "Anuga Cologne 2023 — Dried Fruits Category",
    expoName: "Anuga", year: 2023,
    categories: ["Suppliers", "Buyers"],
    format: "PDF", recordCount: 280, price: 2999,
    includedInTiers: ["Gold", "Platinum"]
  },
  {
    id: "LP005", title: "India Food Forum 2024 — Buyer Database",
    expoName: "India Food Forum", year: 2024,
    categories: ["Retail Buyers", "Distributors", "HoReCa"],
    format: "Excel", recordCount: 600, price: 5999,
    includedInTiers: ["Platinum"]
  },
  {
    id: "LP006", title: "Dry Fruits Expo Mumbai 2024 — Exhibitor + Visitor Data",
    expoName: "Dry Fruits Expo Mumbai", year: 2024,
    categories: ["Suppliers", "Buyers", "Packaging", "Machinery"],
    format: "Excel + PDF", recordCount: 800, price: 7999,
    includedInTiers: ["Gold", "Platinum"]
  },
];

// ===== 5 ADVERTISERS =====
export const sampleAdvertisers: Advertiser[] = [
  {
    id: "AD001", companyName: "FreshPack India",
    bannerText: "🏭 FreshPack — India's #1 Vacuum Packaging for Dry Fruits",
    targetPage: "homepage", placement: "homepage-banner",
    startDate: "2025-01-01", endDate: "2025-12-31",
    link: "https://freshpack.in", isActive: true,
  },
  {
    id: "AD002", companyName: "ColdChain Express",
    bannerText: "🚛 ColdChain Express — Temperature Controlled Logistics for Perishables",
    targetPage: "directory", placement: "directory-sidebar",
    startDate: "2025-01-01", endDate: "2025-06-30",
    link: "https://coldchainexpress.in", isActive: true,
  },
  {
    id: "AD003", companyName: "TradeFinance Pro",
    bannerText: "💰 TradeFinance Pro — Quick Import Finance for APMC Traders",
    targetPage: "homepage", placement: "homepage-banner",
    startDate: "2025-02-01", endDate: "2025-12-31",
    link: "https://tradefinancepro.in", isActive: true,
  },
  {
    id: "AD004", companyName: "QualityLab Mumbai",
    bannerText: "🔬 QualityLab — NABL Accredited Testing for Food Safety & Compliance",
    targetPage: "products", placement: "category-banner",
    startDate: "2025-01-15", endDate: "2025-07-15",
    link: "https://qualitylabmumbai.in", isActive: true,
  },
  {
    id: "AD005", companyName: "PrintMax Labels",
    bannerText: "🏷️ PrintMax — Premium Labels & Retail Packaging for Dry Fruits Brands",
    targetPage: "products", placement: "category-banner",
    startDate: "2025-03-01", endDate: "2025-09-30",
    link: "https://printmaxlabels.in", isActive: true,
  },
];

// ===== NEWS / UPDATES =====
export const sampleNews: NewsItem[] = [
  { id: "N001", title: "MDDMA Annual General Meeting 2025 — Key Resolutions Passed", date: "2025-02-10", summary: "Members approved new digital membership system and revised fee structure at the 95th AGM held at APMC Vashi.", category: "Association" },
  { id: "N002", title: "GST Council Revises Rates for Imported Dry Fruits", date: "2025-02-05", summary: "New GST rates effective April 2025. Almonds and walnuts see rate changes. Members advised to update billing.", category: "Government" },
  { id: "N003", title: "Record Dates Import Volume in January 2025", date: "2025-01-28", summary: "Mumbai's dates import crossed 15,000 MT in January, driven by Ramadan demand. Masjid Bunder sees peak activity.", category: "Market" },
  { id: "N004", title: "FSSAI Issues New Quality Standards for Cashew Processing", date: "2025-01-20", summary: "Processors must comply with updated FSSAI norms by June 2025. MDDMA organizing awareness workshops.", category: "Government" },
  { id: "N005", title: "MDDMA Signs MOU with Iran Chamber of Commerce", date: "2025-01-15", summary: "Trade delegation visit to Tehran facilitates direct sourcing partnerships for pistachios and dates.", category: "Trade" },
];

// ===== MEMBERSHIP TIERS =====
export const membershipTiers: MembershipTier[] = [
  {
    name: "Silver", price: "₹5,000", period: "per year",
    features: [
      "Basic directory listing",
      "Company name & products displayed",
      "Access to public circulars",
      "Basic verification badge",
      "Annual trade report",
    ],
    badge: "Basic", leadPacks: 0, sponsoredEligible: false, highlighted: false,
  },
  {
    name: "Gold", price: "₹10,000", period: "per year",
    features: [
      "Enhanced directory listing",
      "Company logo & description",
      "Full circular access (including members-only)",
      "Business verification badge",
      "3 expo lead pack downloads/year",
      "Priority support",
      "Quarterly market intelligence reports",
    ],
    badge: "Business", leadPacks: 3, sponsoredEligible: false, highlighted: true,
  },
  {
    name: "Platinum", price: "₹35,000", period: "per year",
    features: [
      "Premium directory listing (featured)",
      "Company logo, description & gallery",
      "Full circular access + early notifications",
      "Business verification badge + Trust seal",
      "Unlimited expo lead pack downloads",
      "Sponsored placement eligibility",
      "Dedicated relationship manager",
      "VIP event access & speaking opportunities",
      "Custom market research on request",
    ],
    badge: "Business + Trust Seal", leadPacks: -1, sponsoredEligible: true, highlighted: false,
  },
];

// ===== CIRCULARS =====
export const sampleCirculars: Circular[] = [
  { id: "C001", title: "GST Rate Revision for Dry Fruits — Effective April 2025", category: "Government", date: "2025-02-15", summary: "Important notification regarding revised GST rates for various dry fruit categories. All members are advised to update their billing systems.", isPublic: true },
  { id: "C002", title: "Annual General Meeting Notice 2025", category: "Internal", date: "2025-02-01", summary: "Notice for the 95th Annual General Meeting at MDDMA Hall, Vashi. Agenda includes digital transformation roadmap.", isPublic: false },
  { id: "C003", title: "Import Duty Changes on Almonds and Walnuts", category: "Trade", date: "2025-01-20", summary: "Government of India has revised import duties. This circular explains the new duty structure.", isPublic: true },
  { id: "C004", title: "APMC Market Holiday Schedule 2025-26", category: "Trade", date: "2025-01-10", summary: "Complete list of market holidays for APMC markets for the financial year 2025-26.", isPublic: true },
  { id: "C005", title: "Membership Renewal Deadline Extension", category: "Internal", date: "2025-01-05", summary: "Deadline for 2025-26 renewal extended to March 31, 2025. Members requested to complete at earliest.", isPublic: false },
  { id: "C006", title: "Quality Standards for Dates Import — FSSAI Update", category: "Government", date: "2024-12-15", summary: "FSSAI has issued new quality standards for imported dates. All importers must ensure compliance.", isPublic: true },
  { id: "C007", title: "Fire Safety Audit — Mandatory Compliance", category: "Trade", date: "2024-11-30", summary: "All members in APMC premises must complete fire safety audit. Non-compliance results in penalties.", isPublic: true },
  { id: "C008", title: "Committee Meeting Minutes — November 2024", category: "Internal", date: "2024-11-25", summary: "Minutes of monthly committee meeting. Key discussions: membership drive and digital platform launch.", isPublic: false },
];

// ===== COMMITTEE MEMBERS =====
export const committeeMembers: CommitteeMember[] = [
  { id: "CM001", name: "Mr. Ramesh Kumar Shah", designation: "President", firmName: "Shah Brothers Dry Fruits", order: 1 },
  { id: "CM002", name: "Mr. Mohammed Yusuf Merchant", designation: "Vice President", firmName: "Golden Kismis Trading", order: 2 },
  { id: "CM003", name: "Mr. Kantilal M. Patel", designation: "Secretary", firmName: "Patel Nuts & Spices", order: 3 },
  { id: "CM004", name: "Mr. Bhavesh K. Desai", designation: "Joint Secretary", firmName: "Gujarat Nut House", order: 4 },
  { id: "CM005", name: "Mr. Suresh Agarwal", designation: "Treasurer", firmName: "Royal Dry Fruits Co.", order: 5 },
  { id: "CM006", name: "Mr. Abdul Rahim Shaikh", designation: "Committee Member", firmName: "Karachi Bakery & Dry Fruits", order: 6 },
  { id: "CM007", name: "Mr. Govind D. Birla", designation: "Committee Member", firmName: "Marwadi Dry Fruits", order: 7 },
  { id: "CM008", name: "Mr. Mohan K. Vaswani", designation: "Committee Member", firmName: "Sindhi Dry Fruits Corp", order: 8 },
];

// ===== PRESIDENT'S MESSAGE =====
export const presidentMessage = {
  name: "Mr. Ramesh Kumar Shah",
  designation: "President, MDDMA",
  message: `Dear Members and Friends of the Trade,

It is my privilege to lead this esteemed association that has been serving Mumbai's dry fruits and dates trading community for over nine decades. Since our founding in the 1930s, MDDMA has been the voice of our trade.

Today, as we embrace digital transformation, our commitment remains unchanged. This new platform connects verified traders, importers, and buyers — making Mumbai's dry fruits market more accessible and transparent.

I urge all members to actively participate and help us grow stronger together.

With warm regards,`,
  since: "Serving since 2020",
};

// ===== LEGACY EXPORTS (backward compat) =====
export const commodityCategories = productCategories.map(c => ({
  name: c.name, icon: c.icon, description: `Browse ${c.name.toLowerCase()} products`
}));

export const tradingAreas = [
  { name: "APMC Vashi", description: "Asia's largest wholesale market" },
  { name: "Masjid Bunder", description: "Historic dates & dry fruits hub" },
  { name: "Crawford Market", description: "Retail & wholesale center" },
  { name: "Mumbai", description: "Central Mumbai trading points" },
  { name: "Navi Mumbai", description: "Eastern suburbs market" },
];
