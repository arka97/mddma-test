// Product categories repository (admin-managed master list).
import { supabase } from "@/integrations/supabase/client";
import { friendlyErrorMessage } from "@/lib/errors";

const COLUMNS =
  "id,name,slug,description,image_url,sort_order,is_active,is_featured,created_at,updated_at" as const;

export interface ProductCategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductCategoryInput {
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  sort_order?: number;
  is_active?: boolean;
  is_featured?: boolean;
}

export async function listCategories(opts: { activeOnly?: boolean; featuredOnly?: boolean } = {}) {
  let q = supabase.from("product_categories").select(COLUMNS).order("sort_order", { ascending: true }).order("name", { ascending: true });
  if (opts.activeOnly) q = q.eq("is_active", true);
  if (opts.featuredOnly) q = q.eq("is_featured", true);
  const { data, error } = await q;
  if (error) throw new Error(friendlyErrorMessage(error));
  return (data ?? []) as ProductCategoryRow[];
}

export async function createCategory(input: ProductCategoryInput) {
  const { data, error } = await supabase.from("product_categories").insert(input).select(COLUMNS).single();
  if (error) throw new Error(friendlyErrorMessage(error));
  return data as ProductCategoryRow;
}

export async function updateCategory(id: string, patch: Partial<ProductCategoryInput>) {
  const { data, error } = await supabase.from("product_categories").update(patch).eq("id", id).select(COLUMNS).single();
  if (error) throw new Error(friendlyErrorMessage(error));
  return data as ProductCategoryRow;
}

export async function deleteCategory(id: string) {
  const { error } = await supabase.from("product_categories").delete().eq("id", id);
  if (error) throw new Error(friendlyErrorMessage(error));
}

export async function countProductsForCategory(name: string) {
  const { count, error } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("category", name);
  if (error) return 0;
  return count ?? 0;
}
