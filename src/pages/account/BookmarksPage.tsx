import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { PostCard } from "@/components/market/PostCard";
import type { CommunityPostRow } from "@/repositories/communityPosts";

export default function BookmarksPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPostRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
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
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <Layout>
      <Seo title="Bookmarks · G-BAU-G" noindex />
      <div className="mx-auto max-w-2xl px-5 py-6 sm:px-6">
        <div className="mb-4 flex items-center gap-2">
          <Bookmark className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold">Bookmarks</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="text-sm text-muted-foreground">
              You haven't bookmarked anything yet. Tap the{" "}
              <Bookmark className="inline h-4 w-4 align-text-bottom" /> icon on any post to save it here.
            </p>
            <Link
              to="/market"
              className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline"
            >
              Browse the market feed →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border rounded-2xl border border-border bg-card">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
