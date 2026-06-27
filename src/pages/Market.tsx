import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/contexts/RoleContext";
import { TopicChips } from "@/components/market/TopicChips";
import { PostCard } from "@/components/market/PostCard";
import { PinnedRatesCard } from "@/components/market/PinnedRatesCard";
import { ComposeSheet } from "@/components/market/ComposeSheet";
import { PaywallOverlay, GuestTeaser } from "@/components/market/PaywallOverlay";
import { CircularsSection } from "@/components/home/today/CircularsSection";
import { listFeedPosts, type CommunityPostRow, type TopicTag } from "@/repositories/communityPosts";
import { listLikes } from "@/repositories/postLikes";
import { commentCounts } from "@/repositories/postComments";
import { viewCounts } from "@/repositories/postViews";
import { supabase } from "@/integrations/supabase/client";

const Market = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const { role } = useRole();
  const [topic, setTopic] = useState<TopicTag | "all">("all");
  const [posts, setPosts] = useState<CommunityPostRow[]>([]);
  const [authors, setAuthors] = useState<Record<string, { id: string; full_name: string | null; avatar_url: string | null; company_name?: string | null }>>({});
  const [likes, setLikes] = useState<{ counts: Record<string, number>; mine: Set<string> }>({ counts: {}, mine: new Set() });
  const [comments, setComments] = useState<Record<string, number>>({});
  const [views, setViews] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [composeOpen, setComposeOpen] = useState(false);

  const isPaid = role === "paid_member" || role === "broker" || role === "admin";
  const isAdmin = role === "admin";
  const isGuest = !user && !authLoading;

  const freeInGrace = useMemo(() => {
    if (!profile || role !== "free_member") return false;
    const created = (profile as unknown as { created_at?: string }).created_at;
    if (!created) return true; // optimistic; RLS will gate
    return Date.now() - new Date(created).getTime() < 7 * 86400000;
  }, [profile, role]);

  const canRead = isPaid || freeInGrace;
  const canEngage = isPaid;

  const load = async () => {
    setLoading(true);
    try {
      const data = await listFeedPosts(topic === "all" ? undefined : topic);
      setPosts(data);
      const ids = data.map((p) => p.id);
      const aIds = Array.from(new Set(data.filter((p) => !p.is_anonymous).map((p) => p.author_id)));
      const [l, c, v, profs] = await Promise.all([
        listLikes(ids),
        commentCounts(ids),
        viewCounts(ids),
        aIds.length ? supabase.from("profiles").select("id,full_name,avatar_url,company_name").in("id", aIds) : Promise.resolve({ data: [] }),
      ]);
      setLikes(l);
      setComments(c);
      setViews(v);
      const map: typeof authors = {};
      ((profs.data ?? []) as Array<{ id: string; full_name: string | null; avatar_url: string | null; company_name?: string | null }>).forEach((p) => { map[p.id] = p; });
      setAuthors(map);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (canRead) load(); else setLoading(false); /* eslint-disable-next-line */ }, [topic, canRead]);

  const pinned = posts.filter((p) => p.is_pinned || p.post_type === "admin_rate_update");
  const rest = posts.filter((p) => !pinned.includes(p));

  return (
    <Layout>
      <Seo title="Market — MDDMA Community" description="MDDMA member community: market signals, alerts, sourcing asks, and rates." path="/market" noindex />

      <div className="container mx-auto max-w-3xl px-4 pb-24 pt-3 sm:px-6 sm:pt-4 lg:px-8">
        <div className="sticky top-0 z-10 -mx-4 bg-background/95 backdrop-blur px-4 py-2 sm:-mx-6 sm:px-6">
          <TopicChips active={topic} onChange={setTopic} />
        </div>

        <div className="mt-4 space-y-4">
          <CircularsSection />

          {!canRead && !isGuest && (
            <div className="rounded-md border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
              Free trial expired. Upgrade to access the market feed.
            </div>
          )}

          {canRead && (
            <>
              {pinned.map((p) => (
                <PinnedRatesCard
                  key={p.id}
                  post={p}
                  likeCount={likes.counts[p.id] ?? 0}
                  commentCount={comments[p.id] ?? 0}
                  viewCount={views[p.id] ?? 0}
                />
              ))}
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-md" />)
              ) : rest.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted-foreground">No posts yet — be the first to share.</p>
              ) : (
                rest.map((p) => (
                  <PostCard
                    key={p.id}
                    post={p}
                    author={authors[p.author_id]}
                    liked={likes.mine.has(p.id)}
                    likeCount={likes.counts[p.id] ?? 0}
                    commentCount={comments[p.id] ?? 0}
                    viewCount={views[p.id] ?? 0}
                    canEngage={canEngage}
                    isAdmin={isAdmin}
                  />
                ))
              )}
            </>
          )}
        </div>

        {canEngage && (
          <>
            <Button
              onClick={() => setComposeOpen(true)}
              className="fixed bottom-20 right-4 z-30 h-12 px-5 shadow-[0_10px_28px_-8px_hsl(var(--primary)/0.65)] lg:bottom-6"
            >
              <Plus className="h-5 w-5" />
              <span>Post</span>
            </Button>
            <ComposeSheet
              open={composeOpen}
              onOpenChange={(v) => { setComposeOpen(v); if (!v) load(); }}
              canPostAnonymous={role === "paid_member" || role === "broker"}
            />
          </>
        )}
      </div>

      {isGuest && <GuestTeaser />}
      {!isGuest && !canRead && <PaywallOverlay />}
    </Layout>
  );
};

export default Market;
