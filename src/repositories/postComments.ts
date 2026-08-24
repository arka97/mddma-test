import { supabase } from "@/integrations/supabase/client";
import { fetchPublicProfileMap } from "@/repositories/profiles";
import { friendlyErrorMessage } from "@/lib/errors";


type RpcFn = (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>;

export interface PostCommentRow {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  is_hidden: boolean;
  created_at: string;
  author_name?: string | null;
  author_avatar?: string | null;
}

/** Attach display name + avatar for a batch of comment rows. */
async function withAuthors(rows: PostCommentRow[]) {
  const ids = Array.from(new Set(rows.map((r) => r.author_id)));
  if (ids.length === 0) return rows;
  const map = await fetchPublicProfileMap(ids);
  return rows.map((r) => ({
    ...r,
    author_name: map[r.author_id]?.full_name ?? null,
    author_avatar: map[r.author_id]?.avatar_url ?? null,
  }));
}


export async function listComments(postId: string) {
  const { data, error } = await supabase
    .from("post_comments")
    .select("*")
    .eq("post_id", postId)
    .eq("is_hidden", false)
    .order("created_at", { ascending: true });
  if (error) throw new Error(friendlyErrorMessage(error));
  return withAuthors((data ?? []) as PostCommentRow[]);
}

/**
 * Comments are written through the `add_business_comment` security-definer
 * function — direct inserts into `post_comments` are blocked by RLS.
 */
export async function addComment(postId: string, _authorId: string, content: string) {
  const { data, error } = await (supabase.rpc as unknown as RpcFn)("add_business_comment", {
    _post_id: postId,
    _content: content,
  });
  if (error) throw new Error(friendlyErrorMessage(error as never));
  const newId = data as string;
  const { data: row } = await supabase.from("post_comments").select("*").eq("id", newId).maybeSingle();
  const base = (row ?? {
    id: newId,
    post_id: postId,
    author_id: _authorId,
    content,
    is_hidden: false,
    created_at: new Date().toISOString(),
  }) as PostCommentRow;
  const [withAuthor] = await withAuthors([base]);
  return withAuthor;
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
