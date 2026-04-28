import { supabase } from "@/integrations/supabase/client";
import { extractError } from "@/lib/errors";

export interface CircularRow {
  id: string;
  title: string;
  body: string;
  category: string | null;
  is_published: boolean;
  published_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export async function listCirculars(opts: { publishedOnly?: boolean } = { publishedOnly: true }) {
  let q = supabase
    .from("circulars")
    .select("*")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (opts.publishedOnly) q = q.eq("is_published", true);
  const { data, error } = await q;
  if (error) throw new Error(extractError(error));
  return (data ?? []) as CircularRow[];
}
