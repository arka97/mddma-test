import { supabase } from "@/integrations/supabase/client";
import { friendlyErrorMessage } from "@/lib/errors";

export interface MarketNewsRow {
  id: string;
  title: string;
  summary: string | null;
  body: string | null;
  source_name: string | null;
  source_url: string | null;
  category: string | null;
  image_url: string | null;
  is_published: boolean;
  published_at: string | null;
  sort_order: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export async function listMarketNews(opts: { publishedOnly?: boolean } = { publishedOnly: true }) {
  let q = (supabase as any)
    .from("market_news")
    .select("*")
    .order("sort_order", { ascending: false })
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (opts.publishedOnly) q = q.eq("is_published", true);
  const { data, error } = await q;
  if (error) throw new Error(friendlyErrorMessage(error));
  return (data ?? []) as MarketNewsRow[];
}
