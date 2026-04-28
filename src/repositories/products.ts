// Products repository.
import { supabase } from "@/integrations/supabase/client";
import { friendlyErrorMessage } from "@/lib/errors";

const PRODUCT_COLUMNS =
  "id,company_id,name,slug,category,origin,description,image_url,gallery,price_min,price_max,market_avg_price,unit,stock_band,trend_direction,demand_score,packaging_options,certifications,is_hidden,is_featured,view_count,inquiry_count,created_at,updated_at" as const;

export interface ProductRow {
  id: string;
  company_id: string;
  name: string;
  slug: string;
  category: string | null;
  origin: string | null;
  description: string | null;
  image_url: string | null;
  gallery: string[] | null;
  price_min: number | null;
  price_max: number | null;
  market_avg_price: number | null;
  unit: string | null;
  stock_band: string | null;
  trend_direction: string | null;
  demand_score: number | null;
  packaging_options: string[] | null;
  certifications: string[] | null;
  is_hidden: boolean;
  is_featured: boolean;
  view_count: number;
  inquiry_count: number;
  created_at: string;
  updated_at: string;
}

export async function listProducts(opts: { companyId?: string; category?: string } = {}) {
  let q = supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("is_hidden", false)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });
  if (opts.companyId) q = q.eq("company_id", opts.companyId);
  if (opts.category) q = q.eq("category", opts.category);
  const { data, error } = await q;
  if (error) throw new Error(friendlyErrorMessage(error));
  return (data ?? []) as ProductRow[];
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(friendlyErrorMessage(error));
  return (data ?? null) as ProductRow | null;
}
