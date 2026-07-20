import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { friendlyErrorMessage } from "@/lib/errors";
import { callCommunityRpc } from "@/repositories/communityRpc";
import type { CommunityBusinessSummary } from "@/repositories/communityPosts";

type PostCommentDbRow = Database["public"]["Tables"]["post_comments"]["Row"];

export interface PostCommentRow {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  is_hidden: boolean;
  created_at: string;
}

function mapComment(row: PostCommentDbRow): PostCommentRow {
  return {
    id: row.id,
    post_id: row.post_id,
    author_id: row.author_id,
    content: row.content,
    is_hidden: row.is_hidden,
    created_at: row.created_at,
  };
}

export async function listComments(postId: string) {
  const { data, error } = await supabase
    .from("post_comments")
    .select("*")
    .eq("post_id", postId)
    .eq("is_hidden", false)
    .order("created_at", { ascending: true });
  if (error) throw new Error(friendlyErrorMessage(error));
  return (data ?? []).map(mapComment);
}

export async function listCommentBusinesses(authorIds: string[]) {
  const ids = Array.from(new Set(authorIds.filter(Boolean)));
  if (!ids.length) return {} as Record<string, CommunityBusinessSummary>;

  const { data, error } = await supabase
    .from("companies_public")
    .select("id,owner_id,name,slug,logo_url,country,is_verified,is_hidden,review_status")
    .in("owner_id", ids)
    .eq("is_hidden", false)
    .eq("review_status", "approved");

  if (error) throw new Error(friendlyErrorMessage(error));

  return (data ?? []).reduce<Record<string, CommunityBusinessSummary>>((map, row) => {
    if (!row.id || !row.owner_id || !row.name || !row.slug) return map;
    map[row.owner_id] = {
      id: row.id,
      owner_id: row.owner_id,
      name: row.name,
      slug: row.slug,
      logo_url: row.logo_url,
      country: row.country,
      is_verified: Boolean(row.is_verified),
    };
    return map;
  }, {});
}

export async function addComment(postId: string, _authorId: string | undefined, content: string) {
  const { data, error } = await callCommunityRpc<string>("add_business_comment", {
    _post_id: postId,
    _content: content,
  });
  if (error) throw new Error(friendlyErrorMessage(error));
  if (!data) throw new Error("The comment could not be created.");

  const { data: row, error: readError } = await supabase
    .from("post_comments")
    .select("*")
    .eq("id", data)
    .single();
  if (readError) throw new Error(friendlyErrorMessage(readError));
  return mapComment(row);
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
  (data ?? []).forEach((row) => {
    counts[row.post_id] = (counts[row.post_id] ?? 0) + 1;
  });
  return counts;
}
