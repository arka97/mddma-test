import { supabase } from "@/integrations/supabase/client";
import { friendlyErrorMessage } from "@/lib/errors";

export interface PostCommentRow {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  is_hidden: boolean;
  created_at: string;
}

export async function listComments(postId: string) {
  const { data, error } = await supabase
    .from("post_comments")
    .select("*")
    .eq("post_id", postId)
    .eq("is_hidden", false)
    .order("created_at", { ascending: true });
  if (error) throw new Error(friendlyErrorMessage(error));
  return (data ?? []) as PostCommentRow[];
}

export async function addComment(postId: string, authorId: string, content: string) {
  const { data, error } = await supabase
    .from("post_comments")
    .insert({ post_id: postId, author_id: authorId, content })
    .select("*")
    .single();
  if (error) throw new Error(friendlyErrorMessage(error));
  return data as PostCommentRow;
}

export async function deleteComment(id: string) {
  const { error } = await supabase.from("post_comments").delete().eq("id", id);
  if (error) throw new Error(friendlyErrorMessage(error));
}

export async function commentCounts(postIds: string[]) {
  if (postIds.length === 0) return {} as Record<string, number>;
  const { data, error } = await supabase
    .from("post_comments")
    .select("post_id")
    .in("post_id", postIds)
    .eq("is_hidden", false);
  if (error) throw new Error(friendlyErrorMessage(error));
  const counts: Record<string, number> = {};
  (data ?? []).forEach((r: { post_id: string }) => {
    counts[r.post_id] = (counts[r.post_id] ?? 0) + 1;
  });
  return counts;
}
