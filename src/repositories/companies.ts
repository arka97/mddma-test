// Companies repository — the only place that calls Supabase company relations.
// Consumers receive normalized rows and never select private identifiers directly.

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { friendlyErrorMessage } from "@/lib/errors";

type CompanyPublicRow = Database["public"]["Views"]["companies_public"]["Row"];

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
  categories: string[] | null;
  certifications: string[] | null;
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
    categories: row.categories,
    certifications: row.certifications,
    is_verified: Boolean(row.is_verified),
    is_hidden: Boolean(row.is_hidden),
    membership_tier: row.membership_tier,
    review_status: row.review_status ?? "pending",
    created_at: row.created_at ?? "",
    updated_at: row.updated_at ?? "",
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
  const { data, error } = await (
    supabase.rpc as unknown as (fn: string) => Promise<{ data: unknown; error: unknown }>
  )("get_my_company");
  if (error) throw new Error(friendlyErrorMessage(error as never));

  const row = Array.isArray(data) ? data[0] : data;
  return (row ?? null) as CompanyRow | null;
}
