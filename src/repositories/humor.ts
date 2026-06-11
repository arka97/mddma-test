import { supabase } from "@/integrations/supabase/client";
import { friendlyErrorMessage } from "@/lib/errors";

export interface HumorPostRow {
  id: string;
  title: string;
  body: string;
  image_url: string | null;
  attribution: string | null;
  is_published: boolean;
  published_at: string | null;
  sort_order: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export async function listHumorPosts(opts: { publishedOnly?: boolean } = { publishedOnly: true }) {
  let q = (supabase as any)
    .from("humor_posts")
    .select("*")
    .order("sort_order", { ascending: false })
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (opts.publishedOnly) q = q.eq("is_published", true);
  const { data, error } = await q;
  if (error) throw new Error(friendlyErrorMessage(error));
  return (data ?? []) as HumorPostRow[];
}
