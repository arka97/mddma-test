// Companies repository — the only place that calls Supabase company relations.
// Consumers receive normalized rows and never select private identifiers directly.

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { friendlyErrorMessage } from "@/lib/errors";

type CompanyPublicRow = Database["public"]["Views"]["companies_public"]["Row"];
type MyCompanyRow = Database["public"]["Functions"]["get_my_company"]["Returns"][number];

export interface CompanyRow {
  id: string;
  owner_id: string | null;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  logo_url: string | null;
  cover_url: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  address: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  gstin: string | null;
  established_year: number | null;
  categories: string[];
  certifications: string[];
  markets: string[];
  languages: string[];
  hours: string | null;
  verification_tier_label: string | null;
  is_verified: boolean;
  is_hidden: boolean;
  membership_tier: string | null;
  review_status: string;
  created_at: string;
  updated_at: string;
}

function normalizePublicCompany(row: CompanyPublicRow): CompanyRow | null {
  if (!row.id || !row.slug || !row.name) return null;

  return {
    id: row.id,
    owner_id: row.owner_id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    logo_url: row.logo_url,
    cover_url: row.cover_url,
    city: row.city,
    state: row.state,
    country: row.country,
    address: null,
    email: null,
    phone: null,
    website: row.website,
    gstin: null,
    established_year: row.established_year,
    categories: row.categories ?? [],
    certifications: row.certifications ?? [],
    markets: row.markets ?? [],
    languages: row.languages ?? [],
    hours: row.hours,
    verification_tier_label: row.verification_tier_label,
    is_verified: Boolean(row.is_verified),
    is_hidden: Boolean(row.is_hidden),
    membership_tier: row.membership_tier,
    review_status: row.review_status ?? "pending",
    created_at: row.created_at ?? "",
    updated_at: row.updated_at ?? "",
  };
}

function normalizeOwnedCompany(row: MyCompanyRow): CompanyRow {
  return {
    id: row.id,
    owner_id: row.owner_id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    logo_url: row.logo_url,
    cover_url: row.cover_url,
    city: row.city,
    state: row.state,
    country: row.country,
    address: row.address,
    email: row.email,
    phone: row.phone,
    website: row.website,
    gstin: row.gstin,
    established_year: row.established_year,
    categories: row.categories ?? [],
    certifications: row.certifications ?? [],
    markets: row.markets ?? [],
    languages: row.languages ?? [],
    hours: row.hours,
    verification_tier_label: row.verification_tier_label,
    is_verified: row.is_verified,
    is_hidden: row.is_hidden,
    membership_tier: row.membership_tier,
    review_status: row.review_status,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function listCompanies(opts: { includeHidden?: boolean } = {}) {
  // The view itself is the public-column allowlist, so selecting all view fields is safe.
  let query = supabase
    .from("companies_public")
    .select("*")
    .order("is_verified", { ascending: false })
    .order("created_at", { ascending: false });

  if (!opts.includeHidden) query = query.eq("is_hidden", false);

  const { data, error } = await query;
  if (error) throw new Error(friendlyErrorMessage(error));

  return (data ?? [])
    .map((row) => normalizePublicCompany(row))
    .filter((row): row is CompanyRow => row !== null);
}

export interface AuthorCompanyLite {
  owner_id: string;
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  is_verified: boolean;
}

/**
 * Resolve a batch of post-author user ids to their public storefront (slug,
 * name, logo, verified flag) so feed authors can link through to a profile.
 * Reads the public view only — no contact/registration columns.
 */
export async function listCompaniesByOwners(
  ownerIds: string[],
): Promise<Record<string, AuthorCompanyLite>> {
  const ids = Array.from(new Set(ownerIds.filter(Boolean)));
  if (!ids.length) return {};
  const { data, error } = await supabase
    .from("companies_public")
    .select("id, owner_id, slug, name, logo_url, is_verified")
    .in("owner_id", ids)
    .eq("is_hidden", false);
  if (error) throw new Error(friendlyErrorMessage(error));
  const map: Record<string, AuthorCompanyLite> = {};
  for (const row of (data ?? []) as Array<Record<string, unknown>>) {
    const owner = row.owner_id as string | null;
    const slug = row.slug as string | null;
    if (owner && slug) {
      map[owner] = {
        owner_id: owner,
        id: (row.id as string | null) ?? "",
        slug,
        name: (row.name as string | null) ?? "",
        logo_url: (row.logo_url as string | null) ?? null,
        is_verified: !!row.is_verified,
      };
    }
  }
  return map;
}

export async function getCompanyById(id: string) {
  const { data, error } = await supabase
    .from("companies_public")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(friendlyErrorMessage(error));
  return data ? normalizePublicCompany(data) : null;
}

export async function getCompanyBySlug(slug: string) {
  const { data, error } = await supabase
    .from("companies_public")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(friendlyErrorMessage(error));
  return data ? normalizePublicCompany(data) : null;
}

/**
 * Contact and registration details are never exposed through direct public SELECT.
 * Owner reads use the `get_my_company` SECURITY DEFINER RPC.
 */
export async function getCompanyContactBySlug(_slug: string) {
  return null as {
    slug: string;
    email: string | null;
    phone: string | null;
    gstin: string | null;
  } | null;
}

export async function getCompanyByOwner(_ownerId: string) {
  const { data, error } = await supabase.rpc("get_my_company");
  if (error) throw new Error(friendlyErrorMessage(error));

  return data?.[0] ? normalizeOwnedCompany(data[0]) : null;
}
