// Companies repository — the only place that calls supabase.from("companies").
// Returns typed rows; consumers should never reach into supabase.from directly.

import { supabase } from "@/integrations/supabase/client";
import { friendlyErrorMessage } from "@/lib/errors";

// Public columns are exposed via the `companies_public` view (no email/phone/gstin
// for anonymous viewers). Owner/admin reads of contact info go through getCompanyByOwner
// or admin-only paths against the base table.
const COMPANY_PUBLIC_COLUMNS =
  "id,owner_id,slug,name,tagline,description,logo_url,cover_url,city,state,address,website,established_year,categories,certifications,is_verified,is_hidden,membership_tier,review_status,created_at,updated_at" as const;

const COMPANY_FULL_COLUMNS =
  "id,owner_id,slug,name,tagline,description,logo_url,cover_url,city,state,address,email,phone,website,gstin,established_year,categories,certifications,is_verified,is_hidden,membership_tier,review_status,created_at,updated_at" as const;

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
  // Always read public listing through the safe view — masks email/phone/gstin
  // for anonymous viewers and works identically for signed-in members.
  let q = supabase
    .from("companies_public" as never)
    .select(COMPANY_PUBLIC_COLUMNS)
    .order("is_verified", { ascending: false })
    .order("created_at", { ascending: false });
  if (!opts.includeHidden) q = (q as any).eq("is_hidden", false);
  const { data, error } = await q;
  if (error) throw new Error(friendlyErrorMessage(error));
  return ((data ?? []) as any[]).map((row) => ({
    ...row,
    email: null,
    phone: null,
    gstin: null,
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
  return { ...(data as any), email: null, phone: null, gstin: null } as CompanyRow;
}

/**
 * Authenticated-only: fetch contact details (email/phone/gstin) for a company.
 * Returns null for anonymous viewers because RLS / column grants block access.
 */
export async function getCompanyContactBySlug(slug: string) {
  const { data, error } = await supabase
    .from("companies")
    .select("slug,email,phone,gstin")
    .eq("slug", slug)
    .maybeSingle();
  if (error) return null;
  return data as { slug: string; email: string | null; phone: string | null; gstin: string | null } | null;
}

