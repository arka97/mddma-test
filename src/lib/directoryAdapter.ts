// Unifies live `companies` rows and demo `sampleMembers` into one shape that
// the existing directory/storefront UIs already understand. This is what
// makes user-created storefronts (e.g. KGVPL) appear next to the demo set.

import { Member, sampleMembers } from "@/data/sampleData";

export type DirectoryEntry = Member & {
  source: "live" | "demo";
};

export interface LiveCompanyRow {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  logo_url: string | null;
  city: string | null;
  state: string | null;
  address: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  gstin: string | null;
  established_year: number | null;
  categories: string[] | null;
  certifications: string[] | null;
  is_verified: boolean;
  is_hidden: boolean;
  membership_tier: string | null;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "·";
}

export function liveCompanyToEntry(c: LiveCompanyRow): DirectoryEntry {
  const cats = (c.categories ?? []).filter(Boolean);
  return {
    id: c.id,
    firmName: c.name,
    ownerName: c.tagline ?? "",
    slug: c.slug,
    area: c.city ?? c.state ?? "Mumbai",
    fullAddress: c.address ?? `${c.city ?? ""}${c.city && c.state ? ", " : ""}${c.state ?? ""}`,
    commodities: cats.length ? cats : ["General"],
    originSpecialization: [],
    memberType: "Wholesaler",
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

export function mergeDirectory(live: LiveCompanyRow[]): DirectoryEntry[] {
  const liveEntries = live.map(liveCompanyToEntry);
  const liveSlugs = new Set(liveEntries.map((e) => e.slug));
  const demoEntries: DirectoryEntry[] = sampleMembers
    .filter((m) => !liveSlugs.has(m.slug))
    .map((m) => ({ ...m, source: "demo" }));
  // Live first, then demo
  return [...liveEntries, ...demoEntries];
}
