// Sample data for MDDMA Demo - Realistic Mumbai dry fruits trade data

export interface Member {
  id: string;
  firmName: string;
  ownerName: string;
  area: "Vashi" | "Masjid Bunder" | "Crawford Market" | "Dadar" | "Ghatkopar";
  commodities: string[];
  membershipStatus: "Active" | "Pending Renewal" | "Expired";
  memberSince: number;
  phone?: string;
  email?: string;
  address?: string;
  gstNumber?: string;
}

export interface Circular {
  id: string;
  title: string;
  category: "Government" | "Trade" | "Internal";
  date: string;
  summary: string;
  isPublic: boolean;
  pdfUrl?: string;
}

export interface CommitteeMember {
  id: string;
  name: string;
  designation: string;
  firmName: string;
  imageUrl?: string;
  order: number;
}

// 25 Sample Members across different areas and commodities
export const sampleMembers: Member[] = [
  {
    id: "M001",
    firmName: "Shah Brothers Dry Fruits",
    ownerName: "Rajesh Shah",
    area: "Vashi",
    commodities: ["Almonds", "Cashews", "Pistachios"],
    membershipStatus: "Active",
    memberSince: 1985,
    phone: "+91 98200 12345",
    email: "shah.brothers@email.com",
    address: "Shop 45, Sector 19, APMC Market, Vashi, Navi Mumbai - 400705",
    gstNumber: "27AABCS1234A1Z5",
  },
  {
    id: "M002",
    firmName: "Al-Madina Dates Trading",
    ownerName: "Mohammed Hussain",
    area: "Masjid Bunder",
    commodities: ["Dates", "Dry Figs", "Apricots"],
    membershipStatus: "Active",
    memberSince: 1992,
    phone: "+91 98200 23456",
    email: "almadina.dates@email.com",
    address: "152, Mirza Street, Masjid Bunder, Mumbai - 400003",
    gstNumber: "27AABCA2345B2Z6",
  },
  {
    id: "M003",
    firmName: "Patel Nuts & Spices",
    ownerName: "Kantilal Patel",
    area: "Crawford Market",
    commodities: ["Walnuts", "Raisins", "Cashews"],
    membershipStatus: "Active",
    memberSince: 1978,
    phone: "+91 98200 34567",
    email: "patel.nuts@email.com",
    address: "Block B, Shop 23, Crawford Market, Mumbai - 400001",
    gstNumber: "27AABCP3456C3Z7",
  },
  {
    id: "M004",
    firmName: "Surat Dry Fruit Mart",
    ownerName: "Vikram Mehta",
    area: "Vashi",
    commodities: ["Almonds", "Pistachios", "Saffron"],
    membershipStatus: "Pending Renewal",
    memberSince: 2001,
    phone: "+91 98200 45678",
    email: "surat.mart@email.com",
    address: "Shop 78, Sector 19, APMC Market, Vashi, Navi Mumbai - 400705",
    gstNumber: "27AABCS4567D4Z8",
  },
  {
    id: "M005",
    firmName: "Karachi Bakery & Dry Fruits",
    ownerName: "Abdul Rahim",
    area: "Masjid Bunder",
    commodities: ["Dates", "Almonds", "Mixed Dry Fruits"],
    membershipStatus: "Active",
    memberSince: 1965,
    phone: "+91 98200 56789",
    email: "karachi.bakery@email.com",
    address: "88, Mohammed Ali Road, Masjid Bunder, Mumbai - 400003",
    gstNumber: "27AABCK5678E5Z9",
  },
  {
    id: "M006",
    firmName: "Gujarat Nut House",
    ownerName: "Bhavesh Desai",
    area: "Dadar",
    commodities: ["Cashews", "Peanuts", "Chironji"],
    membershipStatus: "Active",
    memberSince: 1995,
    phone: "+91 98200 67890",
    email: "gujarat.nuts@email.com",
    address: "12, Senapati Bapat Marg, Dadar West, Mumbai - 400028",
    gstNumber: "27AABCG6789F6Z0",
  },
  {
    id: "M007",
    firmName: "Khajoor Traders",
    ownerName: "Salim Khan",
    area: "Masjid Bunder",
    commodities: ["Dates", "Dry Figs"],
    membershipStatus: "Active",
    memberSince: 1988,
    phone: "+91 98200 78901",
    email: "khajoor.traders@email.com",
    address: "205, Mirza Street, Masjid Bunder, Mumbai - 400003",
    gstNumber: "27AABCK7890G7Z1",
  },
  {
    id: "M008",
    firmName: "Royal Dry Fruits Co.",
    ownerName: "Suresh Agarwal",
    area: "Crawford Market",
    commodities: ["Premium Almonds", "Pistachios", "Macadamia"],
    membershipStatus: "Active",
    memberSince: 1972,
    phone: "+91 98200 89012",
    email: "royal.df@email.com",
    address: "Block C, Shop 5, Crawford Market, Mumbai - 400001",
    gstNumber: "27AABCR8901H8Z2",
  },
  {
    id: "M009",
    firmName: "Mumbai Meva Mart",
    ownerName: "Prakash Jain",
    area: "Ghatkopar",
    commodities: ["Cashews", "Almonds", "Raisins"],
    membershipStatus: "Expired",
    memberSince: 2010,
    phone: "+91 98200 90123",
    email: "mumbai.meva@email.com",
    address: "Shop 34, Vallabh Baug Lane, Ghatkopar East, Mumbai - 400077",
    gstNumber: "27AABCM9012I9Z3",
  },
  {
    id: "M010",
    firmName: "Ajmeri Dates Center",
    ownerName: "Farooq Ahmed",
    area: "Masjid Bunder",
    commodities: ["Ajwa Dates", "Medjool Dates", "Kimia Dates"],
    membershipStatus: "Active",
    memberSince: 1999,
    phone: "+91 98200 01234",
    email: "ajmeri.dates@email.com",
    address: "99, Mohammed Ali Road, Masjid Bunder, Mumbai - 400003",
    gstNumber: "27AABCA0123J0Z4",
  },
  {
    id: "M011",
    firmName: "Shree Ganesh Traders",
    ownerName: "Ramesh Sharma",
    area: "Vashi",
    commodities: ["Cashews", "Almonds", "Walnuts"],
    membershipStatus: "Active",
    memberSince: 2005,
    phone: "+91 98200 11234",
    email: "ganesh.traders@email.com",
    address: "Shop 112, Sector 19, APMC Market, Vashi, Navi Mumbai - 400705",
    gstNumber: "27AABCS1123K1Z5",
  },
  {
    id: "M012",
    firmName: "Marwadi Dry Fruits",
    ownerName: "Govind Birla",
    area: "Crawford Market",
    commodities: ["Premium Nuts", "Saffron", "Dry Fruits"],
    membershipStatus: "Active",
    memberSince: 1968,
    phone: "+91 98200 22345",
    email: "marwadi.df@email.com",
    address: "Block A, Shop 1, Crawford Market, Mumbai - 400001",
    gstNumber: "27AABCM2234L2Z6",
  },
  {
    id: "M013",
    firmName: "Irani Dry Fruits Store",
    ownerName: "Rustom Irani",
    area: "Dadar",
    commodities: ["Pistachios", "Almonds", "Apricots"],
    membershipStatus: "Pending Renewal",
    memberSince: 1982,
    phone: "+91 98200 33456",
    email: "irani.df@email.com",
    address: "25, Gokhale Road, Dadar West, Mumbai - 400028",
    gstNumber: "27AABCI3345M3Z7",
  },
  {
    id: "M014",
    firmName: "New Bombay Cashew Mart",
    ownerName: "Naresh Shetty",
    area: "Vashi",
    commodities: ["Cashews", "Cashew Products"],
    membershipStatus: "Active",
    memberSince: 1997,
    phone: "+91 98200 44567",
    email: "newbombay.cashew@email.com",
    address: "Shop 89, Sector 19, APMC Market, Vashi, Navi Mumbai - 400705",
    gstNumber: "27AABCN4456N4Z8",
  },
  {
    id: "M015",
    firmName: "Afghani Kishmish House",
    ownerName: "Abdul Wahab",
    area: "Masjid Bunder",
    commodities: ["Raisins", "Apricots", "Dry Figs"],
    membershipStatus: "Active",
    memberSince: 1975,
    phone: "+91 98200 55678",
    email: "afghani.kishmish@email.com",
    address: "178, Mirza Street, Masjid Bunder, Mumbai - 400003",
    gstNumber: "27AABCA5567O5Z9",
  },
  {
    id: "M016",
    firmName: "Chennai Cashew Trading",
    ownerName: "Venkatesh Iyer",
    area: "Vashi",
    commodities: ["Cashews", "Pepper", "Cardamom"],
    membershipStatus: "Active",
    memberSince: 2008,
    phone: "+91 98200 66789",
    email: "chennai.cashew@email.com",
    address: "Shop 156, Sector 19, APMC Market, Vashi, Navi Mumbai - 400705",
    gstNumber: "27AABCC6678P6Z0",
  },
  {
    id: "M017",
    firmName: "Rajasthani Dry Fruits",
    ownerName: "Mahendra Singh",
    area: "Crawford Market",
    commodities: ["Mixed Dry Fruits", "Almonds", "Cashews"],
    membershipStatus: "Active",
    memberSince: 1990,
    phone: "+91 98200 77890",
    email: "rajasthani.df@email.com",
    address: "Block D, Shop 12, Crawford Market, Mumbai - 400001",
    gstNumber: "27AABCR7789Q7Z1",
  },
  {
    id: "M018",
    firmName: "Premium Mewa Traders",
    ownerName: "Deepak Singhania",
    area: "Ghatkopar",
    commodities: ["Premium Nuts", "Imported Dry Fruits"],
    membershipStatus: "Active",
    memberSince: 2015,
    phone: "+91 98200 88901",
    email: "premium.mewa@email.com",
    address: "Shop 67, Pant Nagar, Ghatkopar East, Mumbai - 400077",
    gstNumber: "27AABCP8890R8Z2",
  },
  {
    id: "M019",
    firmName: "Lucknowi Dates & Dry Fruits",
    ownerName: "Imran Qureshi",
    area: "Masjid Bunder",
    commodities: ["Dates", "Almonds", "Pistachios"],
    membershipStatus: "Active",
    memberSince: 2003,
    phone: "+91 98200 99012",
    email: "lucknowi.df@email.com",
    address: "234, Mohammed Ali Road, Masjid Bunder, Mumbai - 400003",
    gstNumber: "27AABCL9901S9Z3",
  },
  {
    id: "M020",
    firmName: "Sindhi Dry Fruits Corp",
    ownerName: "Mohan Vaswani",
    area: "Dadar",
    commodities: ["Cashews", "Almonds", "Pine Nuts"],
    membershipStatus: "Active",
    memberSince: 1958,
    phone: "+91 98200 00123",
    email: "sindhi.corp@email.com",
    address: "45, Ranade Road, Dadar West, Mumbai - 400028",
    gstNumber: "27AABCS0012T0Z4",
  },
  {
    id: "M021",
    firmName: "Arabian Dates Imports",
    ownerName: "Khalid Hassan",
    area: "Masjid Bunder",
    commodities: ["Medjool Dates", "Ajwa Dates", "Deglet Noor"],
    membershipStatus: "Active",
    memberSince: 2012,
    phone: "+91 98200 11123",
    email: "arabian.dates@email.com",
    address: "67, Mirza Street, Masjid Bunder, Mumbai - 400003",
    gstNumber: "27AABCA1112U1Z5",
  },
  {
    id: "M022",
    firmName: "Kolhapuri Dry Fruits",
    ownerName: "Sachin Patil",
    area: "Vashi",
    commodities: ["Cashews", "Raisins", "Almonds"],
    membershipStatus: "Pending Renewal",
    memberSince: 2018,
    phone: "+91 98200 22234",
    email: "kolhapuri.df@email.com",
    address: "Shop 201, Sector 19, APMC Market, Vashi, Navi Mumbai - 400705",
    gstNumber: "27AABCK2223V2Z6",
  },
  {
    id: "M023",
    firmName: "Heritage Nuts & Spices",
    ownerName: "Ashok Agarwal",
    area: "Crawford Market",
    commodities: ["Walnuts", "Macadamia", "Hazelnuts"],
    membershipStatus: "Active",
    memberSince: 1980,
    phone: "+91 98200 33345",
    email: "heritage.nuts@email.com",
    address: "Block B, Shop 8, Crawford Market, Mumbai - 400001",
    gstNumber: "27AABCH3334W3Z7",
  },
  {
    id: "M024",
    firmName: "Golden Kismis Trading",
    ownerName: "Yusuf Merchant",
    area: "Masjid Bunder",
    commodities: ["Golden Raisins", "Black Raisins", "Sultanas"],
    membershipStatus: "Active",
    memberSince: 1994,
    phone: "+91 98200 44456",
    email: "golden.kismis@email.com",
    address: "145, Mohammed Ali Road, Masjid Bunder, Mumbai - 400003",
    gstNumber: "27AABCG4445X4Z8",
  },
  {
    id: "M025",
    firmName: "South Indian Cashew Stores",
    ownerName: "K. Subramaniam",
    area: "Ghatkopar",
    commodities: ["Cashews", "Roasted Cashews", "Flavored Cashews"],
    membershipStatus: "Active",
    memberSince: 2007,
    phone: "+91 98200 55567",
    email: "southindian.cashew@email.com",
    address: "Shop 89, LBS Marg, Ghatkopar West, Mumbai - 400086",
    gstNumber: "27AABCS5556Y5Z9",
  },
];

// Sample Circulars
export const sampleCirculars: Circular[] = [
  {
    id: "C001",
    title: "GST Rate Revision for Dry Fruits - Effective April 2024",
    category: "Government",
    date: "2024-03-15",
    summary: "Important notification regarding revised GST rates for various dry fruit categories. All members are advised to update their billing systems accordingly.",
    isPublic: true,
  },
  {
    id: "C002",
    title: "Annual General Meeting Notice 2024",
    category: "Internal",
    date: "2024-02-28",
    summary: "Notice for the 94th Annual General Meeting to be held at MDDMA Hall, Vashi. Agenda includes election of new committee members.",
    isPublic: false,
  },
  {
    id: "C003",
    title: "Import Duty Changes on Almonds and Walnuts",
    category: "Trade",
    date: "2024-02-10",
    summary: "Government of India has revised import duties on almonds and walnuts. This circular explains the new duty structure and its implications.",
    isPublic: true,
  },
  {
    id: "C004",
    title: "APMC Market Holiday Schedule 2024-25",
    category: "Trade",
    date: "2024-01-05",
    summary: "Complete list of market holidays for the APMC markets in Vashi and other locations for the financial year 2024-25.",
    isPublic: true,
  },
  {
    id: "C005",
    title: "Membership Renewal Deadline Extension",
    category: "Internal",
    date: "2024-01-20",
    summary: "The deadline for membership renewal for 2024-25 has been extended to March 31, 2024. Members are requested to complete renewal at the earliest.",
    isPublic: false,
  },
  {
    id: "C006",
    title: "Quality Standards for Dates Import",
    category: "Government",
    date: "2023-12-15",
    summary: "FSSAI has issued new quality standards for imported dates. All importers must ensure compliance with these standards.",
    isPublic: true,
  },
  {
    id: "C007",
    title: "Fire Safety Audit - Mandatory Compliance",
    category: "Trade",
    date: "2023-11-30",
    summary: "All members operating in APMC premises must complete fire safety audit by December 31, 2023. Non-compliance will result in penalties.",
    isPublic: true,
  },
  {
    id: "C008",
    title: "Committee Meeting Minutes - November 2023",
    category: "Internal",
    date: "2023-11-25",
    summary: "Minutes of the monthly committee meeting held on November 20, 2023. Key discussions included membership drive and market infrastructure.",
    isPublic: false,
  },
];

// Committee Members
export const committeeMembers: CommitteeMember[] = [
  {
    id: "CM001",
    name: "Mr. Ramesh Kumar Shah",
    designation: "President",
    firmName: "Shah Brothers Dry Fruits",
    order: 1,
  },
  {
    id: "CM002",
    name: "Mr. Mohammed Yusuf Merchant",
    designation: "Vice President",
    firmName: "Golden Kismis Trading",
    order: 2,
  },
  {
    id: "CM003",
    name: "Mr. Kantilal M. Patel",
    designation: "Secretary",
    firmName: "Patel Nuts & Spices",
    order: 3,
  },
  {
    id: "CM004",
    name: "Mr. Bhavesh K. Desai",
    designation: "Joint Secretary",
    firmName: "Gujarat Nut House",
    order: 4,
  },
  {
    id: "CM005",
    name: "Mr. Suresh Agarwal",
    designation: "Treasurer",
    firmName: "Royal Dry Fruits Co.",
    order: 5,
  },
  {
    id: "CM006",
    name: "Mr. Abdul Rahim Shaikh",
    designation: "Committee Member",
    firmName: "Karachi Bakery & Dry Fruits",
    order: 6,
  },
  {
    id: "CM007",
    name: "Mr. Govind D. Birla",
    designation: "Committee Member",
    firmName: "Marwadi Dry Fruits",
    order: 7,
  },
  {
    id: "CM008",
    name: "Mr. Mohan K. Vaswani",
    designation: "Committee Member",
    firmName: "Sindhi Dry Fruits Corp",
    order: 8,
  },
];

// President's Message
export const presidentMessage = {
  name: "Mr. Ramesh Kumar Shah",
  designation: "President, MDDMA",
  message: `Dear Members and Friends of the Trade,

It is my privilege to lead this esteemed association that has been serving Mumbai's dry fruits and dates trading community for over nine decades. Since our founding in 1930, MDDMA has been the voice of our trade, advocating for fair policies, facilitating dispute resolution, and fostering brotherhood among merchants.

Today, as we embrace digital transformation, our commitment to our members remains unchanged. This new platform is a testament to our resolve to provide better services while preserving the values of trust and transparency that have defined us.

I urge all members to actively participate in association activities and help us grow stronger together.

With warm regards,`,
  since: "Serving since 2020",
};

// Statistics for the homepage
export const associationStats = {
  memberCount: 850,
  yearsOfService: 94,
  marketsCovered: 5,
  commodityTypes: 25,
};

// Commodity categories
export const commodityCategories = [
  { name: "Almonds", icon: "🥜", description: "California, Gurbandi, Mamra varieties" },
  { name: "Cashews", icon: "🥜", description: "W180, W240, W320 grades" },
  { name: "Dates", icon: "🌴", description: "Ajwa, Medjool, Kimia, Deglet Noor" },
  { name: "Pistachios", icon: "🥜", description: "Iranian, American, Roasted" },
  { name: "Walnuts", icon: "🥜", description: "Chilean, Kashmiri, California" },
  { name: "Raisins", icon: "🍇", description: "Golden, Black, Green varieties" },
  { name: "Dry Figs", icon: "🫐", description: "Afghani, Turkish, Iranian" },
  { name: "Apricots", icon: "🍑", description: "Turkish, Ladakhi, Hunza" },
];

// Areas/Markets
export const tradingAreas = [
  { name: "Vashi APMC", description: "Asia's largest wholesale market" },
  { name: "Masjid Bunder", description: "Historic dates & dry fruits hub" },
  { name: "Crawford Market", description: "Retail & wholesale center" },
  { name: "Dadar", description: "West Mumbai trading point" },
  { name: "Ghatkopar", description: "Eastern suburbs market" },
];
