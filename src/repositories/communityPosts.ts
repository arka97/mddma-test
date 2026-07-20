import { supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";
import { friendlyErrorMessage } from "@/lib/errors";

export type PostType =
  | "general"
  | "price_signal"
  | "market_alert"
  | "sourcing_ask"
  | "member_news"
  | "poll"
  | "admin_rate_update";

export type NewBusinessPostType = "general" | "price_signal" | "market_alert" | "member_news";

export type TopicTag =
  | "price_signals"
  | "market_alerts"
  | "sourcing"
  | "member_news"
  | "polls";

type CommunityPostDbRow = Database["public"]["Tables"]["community_posts"]["Row"];

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

export interface CommunityBusinessSummary {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  country: string | null;
  is_verified: boolean;
}

export interface CommunityEngagement {
  likeCount: number;
  commentCount: number;
  viewCount: number;
  liked: boolean;
}

const POST_TYPES: readonly PostType[] = [
  "general",
  "price_signal",
  "market_alert",
  "sourcing_ask",
  "member_news",
  "poll",
  "admin_rate_update",
];
const TOPIC_TAGS: readonly TopicTag[] = [
  "price_signals",
  "market_alerts",
  "sourcing",
  "member_news",
  "polls",
];

function toPostType(value: string): PostType {
  return (POST_TYPES as readonly string[]).includes(value) ? (value as PostType) : "general";
}

function toTopicTag(value: string | null): TopicTag | null {
  return value && (TOPIC_TAGS as readonly string[]).includes(value) ? (value as TopicTag) : null;
}

function toStructuredData(value: Json | null): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function mapPost(row: CommunityPostDbRow): CommunityPostRow {
  return {
    id: row.id,
    author_id: row.author_id,
    post_type: toPostType(row.post_type),
    content: row.content,
    structured_data: toStructuredData(row.structured_data),
    topic_tag: toTopicTag(row.topic_tag),
    is_anonymous: row.is_anonymous,
    is_pinned: row.is_pinned,
    is_hidden: row.is_hidden,
    anonymous_expires_at: row.anonymous_expires_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function listFeedPosts(topic?: TopicTag) {
  let query = supabase
    .from("community_posts")
    .select("*")
    .eq("is_hidden", false)
    .eq("is_anonymous", false)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(100);

  if (topic) query = query.or(`topic_tag.eq.${topic},post_type.eq.admin_rate_update`);

  const { data, error } = await query;
  if (error) throw new Error(friendlyErrorMessage(error));
  return (data ?? []).map(mapPost);
}

export async function listCommunityBusinesses(ownerIds: string[]) {
  const ids = Array.from(new Set(ownerIds.filter(Boolean)));
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

export async function getBusinessPostEngagement(postIds: string[]) {
  if (!postIds.length) return {} as Record<string, CommunityEngagement>;

  const { data, error } = await supabase.rpc("get_business_post_engagement", { _ids: postIds });
  if (error) throw new Error(friendlyErrorMessage(error));

  return (data ?? []).reduce<Record<string, CommunityEngagement>>((map, row) => {
    map[row.post_id] = {
      likeCount: Number(row.like_count) || 0,
      commentCount: Number(row.comment_count) || 0,
      viewCount: Number(row.view_count) || 0,
      liked: Boolean(row.liked),
    };
    return map;
  }, {});
}

export interface CreateBusinessPostInput {
  postType: NewBusinessPostType;
  content: string;
  structuredData?: Record<string, unknown> | null;
}

export async function createBusinessPost(input: CreateBusinessPostInput) {
  const { data, error } = await supabase.rpc("create_business_post", {
    _post_type: input.postType,
    _content: input.content,
    _structured_data: (input.structuredData ?? null) as Json,
  });
  if (error) throw new Error(friendlyErrorMessage(error));
  if (!data) throw new Error("The post could not be created.");
  return data;
}

export async function createBusinessPollPost(input: {
  question: string;
  options: string[];
  durationDays: number;
  content?: string;
  structuredData?: Record<string, unknown> | null;
}) {
  const { data, error } = await supabase.rpc("create_business_poll_post", {
    _question: input.question,
    _options: input.options,
    _duration_days: input.durationDays,
    _content: input.content ?? "",
    _structured_data: (input.structuredData ?? null) as Json,
  });
  if (error) throw new Error(friendlyErrorMessage(error));
  if (!data) throw new Error("The poll could not be created.");
  return data;
}

export async function listAllPostsAdmin() {
  const { data, error } = await supabase
    .from("community_posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(friendlyErrorMessage(error));
  return (data ?? []).map(mapPost);
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
