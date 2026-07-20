// Companies repository — the only place that calls supabase.from("companies").
// Returns typed rows; consumers should never reach into supabase.from directly.

import { supabase } from "@/integrations/supabase/client";
import { friendlyErrorMessage } from "@/lib/errors";

// Public columns are exposed via the `companies_public` view. Contact, tax and
// licence identifiers remain private and are never selected for discovery.
const COMPANY_PUBLIC_COLUMNS =
  "id,owner_id,slug,name,tagline,description,logo_url,cover_url,city,state,country,website,established_year,categories,certifications,is_verified,is_hidden,membership_tier,review_status,created_at,updated_at" as const;

const COMPANY_FULL_COLUMNS =
  "id,owner_id,slug,name,tagline,description,logo_url,cover_url,city,state,country,address,email,phone,website,gstin,established_year,categories,certifications,is_verified,is_hidden,membership_tier,review_status,created_at,updated_at" as const;

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

export async function listCompanies(opts: { includeHidden?: boolean } = {}) {
  // Always read discovery data through the safe public view.
  let query = supabase
    .from("companies_public" as never)
    .select(COMPANY_PUBLIC_COLUMNS)
    .order("is_verified", { ascending: false })
    .order("created_at", { ascending: false });

  if (!opts.includeHidden) query = (query as any).eq("is_hidden", false);

  const { data, error } = await query;
  if (error) throw new Error(friendlyErrorMessage(error));

  return ((data ?? []) as any[]).map((row) => ({
    ...row,
    email: null,
    phone: null,
    gstin: null,
    address: null,
  })) as CompanyRow[];
}

export async function getCompanyBySlug(slug: string) {
  const { data, error } = await supabase
    .from("companies_public" as never)
    .select(COMPANY_PUBLIC_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(friendlyErrorMessage(error));
  if (!data) return null;

  return {
    ...(data as any),
    email: null,
    phone: null,
    gstin: null,
    address: null,
  } as CompanyRow;
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

// Retained for admin-only repository extensions that need an explicit safe column set.
export { COMPANY_FULL_COLUMNS };
