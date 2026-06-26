import { supabase } from "@/integrations/supabase/client";
import { friendlyErrorMessage } from "@/lib/errors";

export type PostType =
  | "general"
  | "price_signal"
  | "market_alert"
  | "sourcing_ask"
  | "member_news"
  | "poll"
  | "admin_rate_update";

export type TopicTag =
  | "price_signals"
  | "market_alerts"
  | "sourcing"
  | "member_news"
  | "polls";

export interface CommunityPostRow {
  id: string;
  author_id: string;
  post_type: PostType;
  content: string;
  structured_data: Record<string, unknown> | null;
  topic_tag: TopicTag | null;
  is_anonymous: boolean;
  is_pinned: boolean;
  is_hidden: boolean;
  anonymous_expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export async function listFeedPosts(topic?: TopicTag) {
  let q = supabase
    .from("community_posts")
    .select("*")
    .eq("is_hidden", false)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(100);
  if (topic) q = q.or(`topic_tag.eq.${topic},post_type.eq.admin_rate_update`);
  const { data, error } = await q;
  if (error) throw new Error(friendlyErrorMessage(error));
  return (data ?? []) as unknown as CommunityPostRow[];
}

export async function listAllPostsAdmin() {
  const { data, error } = await supabase
    .from("community_posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(friendlyErrorMessage(error));
  return (data ?? []) as unknown as CommunityPostRow[];
}

export interface CreatePostInput {
  author_id: string;
  post_type: PostType;
  content: string;
  topic_tag?: TopicTag | null;
  structured_data?: Record<string, unknown> | null;
  is_anonymous?: boolean;
}

export async function createPost(input: CreatePostInput) {
  const { data, error } = await supabase
    .from("community_posts")
    .insert({
      author_id: input.author_id,
      post_type: input.post_type,
      content: input.content,
      topic_tag: input.topic_tag ?? null,
      structured_data: (input.structured_data ?? null) as never,
      is_anonymous: input.is_anonymous ?? false,
    })
    .select("*")
    .single();
  if (error) throw new Error(friendlyErrorMessage(error));
  return data as unknown as CommunityPostRow;
}

export async function setPostHidden(id: string, hidden: boolean) {
  const { error } = await supabase.from("community_posts").update({ is_hidden: hidden }).eq("id", id);
  if (error) throw new Error(friendlyErrorMessage(error));
}

export async function setPostPinned(id: string, pinned: boolean) {
  const { error } = await supabase.from("community_posts").update({ is_pinned: pinned }).eq("id", id);
  if (error) throw new Error(friendlyErrorMessage(error));
}

export async function deletePost(id: string) {
  const { error } = await supabase.from("community_posts").delete().eq("id", id);
  if (error) throw new Error(friendlyErrorMessage(error));
}

export async function muteAuthor(authorId: string, muted: boolean) {
  const { error } = await supabase.from("profiles").update({ is_muted: muted }).eq("id", authorId);
  if (error) throw new Error(friendlyErrorMessage(error));
}

export async function listAnonymousIdentityLog() {
  const { data, error } = await supabase
    .from("anonymous_identity_log")
    .select("id, post_id, real_author_id, created_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error(friendlyErrorMessage(error));
  return data ?? [];
}
