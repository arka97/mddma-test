// Companies repository — the only place that calls supabase.from("companies").
// Returns typed rows; consumers should never reach into supabase.from directly.

import { supabase } from "@/integrations/supabase/client";
import { extractError } from "@/lib/errors";

const COMPANY_COLUMNS =
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
  let q = supabase
    .from("companies")
    .select(COMPANY_COLUMNS)
    .order("is_verified", { ascending: false })
    .order("created_at", { ascending: false });
  if (!opts.includeHidden) q = q.eq("is_hidden", false);
  const { data, error } = await q;
  if (error) throw new Error(extractError(error));
  return (data ?? []) as CompanyRow[];
}

export async function getCompanyBySlug(slug: string) {
  const { data, error } = await supabase
    .from("companies")
    .select(COMPANY_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(extractError(error));
  return (data ?? null) as CompanyRow | null;
}

export async function getCompanyByOwner(ownerId: string) {
  const { data, error } = await supabase
    .from("companies")
    .select(COMPANY_COLUMNS)
    .eq("owner_id", ownerId)
    .maybeSingle();
  if (error) throw new Error(extractError(error));
  return (data ?? null) as CompanyRow | null;
}
