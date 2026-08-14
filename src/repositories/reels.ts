import { supabase } from "@/integrations/supabase/client";
import type { CommunityPostRow } from "@/repositories/communityPosts";

export interface ReelItem {
  id: string;
  kind: "post" | "product";
  /** Storage path (post media) — needs a signed URL. */
  mediaPath?: string;
  /** Public URL (product video / image). */
  mediaUrl?: string;
  mediaType: "video" | "image";
  caption: string;
  createdAt: string;
  /** Post-only */
  post?: CommunityPostRow;
  /** Product-only */
  productName?: string;
  productSlug?: string;
  companyName?: string;
}

interface StructuredMedia {
  video?: { path?: string };
  images?: string[];
}

/** Community posts that carry a video, or image-only posts, newest first. */
export async function listPostReels(limit = 40): Promise<ReelItem[]> {
  const { data, error } = await supabase
    .from("community_posts")
    .select("*")
    .eq("is_hidden", false)
    .not("structured_data", "is", null)
    .order("created_at", { ascending: false })
    .limit(120);
  if (error) return [];

  const rows = (data ?? []) as unknown as CommunityPostRow[];
  const items: ReelItem[] = [];
  for (const p of rows) {
    const sd = (p.structured_data ?? {}) as StructuredMedia;
    const videoPath = sd.video?.path;
    const image = Array.isArray(sd.images) ? sd.images[0] : undefined;
    if (videoPath) {
      items.push({
        id: `post-${p.id}`,
        kind: "post",
        mediaPath: videoPath,
        mediaType: "video",
        caption: p.content,
        createdAt: p.created_at,
        post: p,
      });
    } else if (image) {
      items.push({
        id: `post-${p.id}`,
        kind: "post",
        mediaPath: image,
        mediaType: "image",
        caption: p.content,
        createdAt: p.created_at,
        post: p,
      });
    }
    if (items.length >= limit) break;
  }
  return items;
}

/** Seller product videos, newest first. */
export async function listProductReels(limit = 20): Promise<ReelItem[]> {
  const { data, error } = await supabase
    .from("products")
    .select("id, name, slug, video_url, created_at, companies(name)")
    .eq("is_hidden", false)
    .not("video_url", "is", null)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return [];
  return ((data ?? []) as unknown as Array<{
    id: string;
    name: string;
    slug: string;
    video_url: string;
    created_at: string;
    companies?: { name: string } | null;
  }>).map((p) => ({
    id: `product-${p.id}`,
    kind: "product" as const,
    mediaUrl: p.video_url,
    mediaType: "video" as const,
    caption: p.name,
    createdAt: p.created_at,
    productName: p.name,
    productSlug: p.slug,
    companyName: p.companies?.name ?? undefined,
  }));
}

export async function listReels(): Promise<ReelItem[]> {
  const [posts, products] = await Promise.all([listPostReels(), listProductReels()]);
  return [...posts, ...products].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
