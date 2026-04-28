import { supabase } from "@/integrations/supabase/client";
import { friendlyErrorMessage } from "@/lib/errors";

export interface PostRow {
  id: string;
  author_id: string;
  title: string;
  body: string;
  category: string;
  is_pinned: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export async function listPosts(category?: string) {
  let q = supabase
    .from("posts")
    .select("*")
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });
  if (category) q = q.eq("category", category);
  const { data, error } = await q;
  if (error) throw new Error(friendlyErrorMessage(error));
  return (data ?? []) as PostRow[];
}

export async function getPost(id: string) {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(friendlyErrorMessage(error));
  return (data ?? null) as PostRow | null;
}
