// Brands repository — sole place that touches supabase.from("brands").
import { supabase } from "@/integrations/supabase/client";
import { friendlyErrorMessage } from "@/lib/errors";

const BRAND_COLUMNS =
  "id,company_id,slug,name,tagline,story,logo_url,cover_url,gallery,b2c_url,social_links,categories,is_featured,is_active,sort_order,created_at,updated_at" as const;

export interface BrandRow {
  id: string;
  company_id: string;
  slug: string;
  name: string;
  tagline: string | null;
  story: string | null;
  logo_url: string | null;
  cover_url: string | null;
  gallery: string[] | null;
  b2c_url: string | null;
  social_links: Record<string, string> | null;
  categories: string[] | null;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export async function listBrands(opts: { featuredOnly?: boolean; companyId?: string } = {}) {
  let q = supabase
    .from("brands")
    .select(BRAND_COLUMNS)
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (opts.featuredOnly) q = q.eq("is_featured", true);
  if (opts.companyId) q = q.eq("company_id", opts.companyId);
  const { data, error } = await q;
  if (error) throw new Error(friendlyErrorMessage(error));
  return (data ?? []) as BrandRow[];
}

export async function getBrandBySlug(slug: string) {
  const { data, error } = await supabase
    .from("brands")
    .select(BRAND_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(friendlyErrorMessage(error));
  return (data ?? null) as BrandRow | null;
}

export async function listBrandsByCompany(companyId: string) {
  const { data, error } = await supabase
    .from("brands")
    .select(BRAND_COLUMNS)
    .eq("company_id", companyId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(friendlyErrorMessage(error));
  return (data ?? []) as BrandRow[];
}
