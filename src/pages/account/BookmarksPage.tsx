import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/contexts/RoleContext";
import { PostCard } from "@/components/market/PostCard";
import { listLikes } from "@/repositories/postLikes";
import { viewCounts } from "@/repositories/postViews";
import { commentCounts } from "@/repositories/postComments";
import { listCompaniesByOwners } from "@/repositories/companies";
import type { CommunityPostRow } from "@/repositories/communityPosts";

interface Author {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  company_name?: string | null;
  slug?: string | null;
  is_verified?: boolean | null;
}

export default function BookmarksPage() {
  const { user } = useAuth();
  const { role, isEffectivePaid } = useRole();
  const [posts, setPosts] = useState<CommunityPostRow[]>([]);
  const [authors, setAuthors] = useState<Record<string, Author>>({});
  const [likes, setLikes] = useState<{ counts: Record<string, number>; mine: Set<string> }>({
    counts: {},
    mine: new Set(),
  });
  const [comments, setComments] = useState<Record<string, number>>({});
  const [views, setViews] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const canEngage = !!user && isEffectivePaid;
  const isAdmin = role === "admin";

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data: rows } = await supabase
        .from("post_bookmarks")
        .select("post_id, created_at, community_posts:post_id (*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(100);
      if (cancelled) return;

      const list = (rows ?? [])
        .map((r) => r.community_posts as unknown as CommunityPostRow | null)
        .filter((p): p is CommunityPostRow => !!p && !p.is_hidden);
      setPosts(list);

      if (list.length === 0) {
        setLoading(false);
        return;
      }

      const ids = list.map((p) => p.id);
      const ownerIds = Array.from(new Set(list.map((p) => p.author_id)));

      const [likeRes, viewRes, commentRes, profilesRes, companiesRes] = await Promise.all([
        listLikes(ids).catch(() => ({ counts: {}, mine: new Set<string>() })),
        viewCounts(ids).catch(() => ({} as Record<string, number>)),
        commentCounts(ids).catch(() => ({} as Record<string, number>)),
        supabase.from("profiles").select("id, full_name, avatar_url").in("id", ownerIds),
        listCompaniesByOwners(ownerIds).catch(() => ({} as Record<string, { name: string; slug: string; is_verified: boolean }>)),
      ]);

      if (cancelled) return;

      setLikes(likeRes);
      setViews(viewRes);
      setComments(commentRes);

      const authorMap: Record<string, Author> = {};
      (profilesRes.data ?? []).forEach((p) => {
        authorMap[p.id] = {
          id: p.id,
          full_name: p.full_name,
          avatar_url: p.avatar_url,
        };
      });
      Object.entries(companiesRes ?? {}).forEach(([ownerId, c]) => {
        const existing = authorMap[ownerId] ?? {
          id: ownerId,
          full_name: null,
          avatar_url: null,
        };
        authorMap[ownerId] = {
          ...existing,
          company_name: c.name,
          slug: c.slug,
          is_verified: c.is_verified,
        };
      });
      setAuthors(authorMap);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <Layout>
      <Seo title="Bookmarks · G-BAU-G" description="Your saved market posts." path="/account/bookmarks" noindex />
      <div className="mx-auto max-w-2xl px-5 py-6 sm:px-6">
        <div className="mb-4 flex items-center gap-2">
          <Bookmark className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold">Bookmarks</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !user ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">Sign in to view your bookmarks.</p>
            <Link to="/login" className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline">
              Sign in →
            </Link>
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">
              You haven't bookmarked anything yet. Tap the{" "}
              <Bookmark className="inline h-4 w-4 align-text-bottom" /> icon on any post to save it here.
            </p>
            <Link to="/market" className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline">
              Browse the market feed →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border rounded-2xl border border-border bg-card">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                author={authors[post.author_id]}
                liked={likes.mine.has(post.id)}
                likeCount={likes.counts[post.id] ?? 0}
                commentCount={comments[post.id] ?? 0}
                viewCount={views[post.id] ?? 0}
                canEngage={canEngage}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
