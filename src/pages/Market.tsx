import { useEffect, useMemo, useState } from "react";
import { Feather } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { FeedShell } from "@/components/layout/FeedShell";
import { SuggestedFollows } from "@/components/feed/SuggestedFollows";
import { TrendingTopics } from "@/components/feed/TrendingTopics";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/contexts/RoleContext";
import { TopicChips } from "@/components/market/TopicChips";
import { FeedTabs, type FeedTab } from "@/components/market/FeedTabs";
import { PostCard } from "@/components/market/PostCard";
import { PinnedRatesCard } from "@/components/market/PinnedRatesCard";
import { ComposeSheet } from "@/components/market/ComposeSheet";
import { PaywallOverlay, GuestTeaser } from "@/components/market/PaywallOverlay";
import { CircularsSection } from "@/components/home/today/CircularsSection";
import { listFeedPosts, type CommunityPostRow, type TopicTag } from "@/repositories/communityPosts";
import { listLikes } from "@/repositories/postLikes";
import { commentCounts } from "@/repositories/postComments";
import { viewCounts } from "@/repositories/postViews";
import { listCompaniesByOwners } from "@/repositories/companies";
import { useFollowingSet } from "@/hooks/useFollow";
import { supabase } from "@/integrations/supabase/client";

type FeedAuthor = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  company_name?: string | null;
  slug?: string | null;
  is_verified?: boolean | null;
};

const Market = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const { role, featuresOpen, isEffectivePaid } = useRole();
  const [topic, setTopic] = useState<TopicTag | "all">("all");
  const [feedTab, setFeedTab] = useState<FeedTab>("for_you");
  const [posts, setPosts] = useState<CommunityPostRow[]>([]);
  const [authors, setAuthors] = useState<Record<string, FeedAuthor>>({});
  const [authorCompanyIds, setAuthorCompanyIds] = useState<Record<string, string>>({});
  const [likes, setLikes] = useState<{ counts: Record<string, number>; mine: Set<string> }>({ counts: {}, mine: new Set() });
  const [comments, setComments] = useState<Record<string, number>>({});
  const [views, setViews] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [composeOpen, setComposeOpen] = useState(false);
  const followingSet = useFollowingSet();

  const isPaid = isEffectivePaid;
  const isAdmin = role === "admin";
  const isGuest = !user && !authLoading && !featuresOpen;

  const freeInGrace = useMemo(() => {
    if (!profile || role !== "free_member") return false;
    const created = (profile as unknown as { created_at?: string }).created_at;
    if (!created) return true; // optimistic; RLS will gate
    return Date.now() - new Date(created).getTime() < 7 * 86400000;
  }, [profile, role]);

  const canRead = isPaid || freeInGrace || featuresOpen;
  const canEngage = isPaid && !!user;

  const load = async () => {
    setLoading(true);
    try {
      const data = await listFeedPosts(topic === "all" ? undefined : topic);
      setPosts(data);
      const ids = data.map((p) => p.id);
      const aIds = Array.from(new Set(data.filter((p) => !p.is_anonymous).map((p) => p.author_id)));
      const [l, c, v, profs, companies] = await Promise.all([
        listLikes(ids),
        commentCounts(ids),
        viewCounts(ids),
        aIds.length ? supabase.from("profiles").select("id,full_name,avatar_url,company_name").in("id", aIds) : Promise.resolve({ data: [] }),
        aIds.length ? listCompaniesByOwners(aIds) : Promise.resolve({}),
      ]);
      setLikes(l);
      setComments(c);
      setViews(v);
      const map: Record<string, FeedAuthor> = {};
      ((profs.data ?? []) as Array<{ id: string; full_name: string | null; avatar_url: string | null; company_name?: string | null }>).forEach((p) => { map[p.id] = p; });
      // Merge storefront slug + verified flag so authors link to their profile.
      Object.entries(companies as Record<string, { slug: string; name: string; is_verified: boolean }>).forEach(([ownerId, co]) => {
        map[ownerId] = {
          ...(map[ownerId] ?? { id: ownerId, full_name: null, avatar_url: null }),
          company_name: map[ownerId]?.company_name ?? co.name,
          slug: co.slug,
          is_verified: co.is_verified,
        };
      });
      setAuthors(map);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canRead) load();
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic, canRead]);

  const pinned = posts.filter((p) => p.is_pinned || p.post_type === "admin_rate_update");
  const rest = posts.filter((p) => !pinned.includes(p));

  return (
    <Layout>
      <Seo title="Market — G-BAU-G" description="G-BAU-G market feed: price signals, alerts, sourcing asks and verified-member rates." path="/market" noindex />

      <FeedShell
        rightRail={
          <>
            <SuggestedFollows />
            <TrendingTopics />
          </>
        }
      >
      <div className="mx-auto min-h-screen w-full pb-24 sm:border-x sm:border-border xl:border-x-0">
        {/* X-style feed header */}
        <div className="border-b border-border bg-background">
          <div className="px-4 pt-3">
            <h1 className="text-lg font-extrabold tracking-tight text-foreground">Market</h1>
          </div>
          <div className="px-2 pt-1">
            <TopicChips active={topic} onChange={setTopic} />
          </div>
        </div>

        <div className="px-4 pt-3">
          <CircularsSection />
        </div>

        {!canRead && !isGuest && (
          <div className="m-4 rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
            Free trial expired. Upgrade to access the market feed.
          </div>
        )}

        {canRead && (
          <>
            {pinned.length > 0 && (
              <div className="space-y-3 px-4 pt-3">
                {pinned.map((p) => (
                  <PinnedRatesCard
                    key={p.id}
                    post={p}
                    likeCount={likes.counts[p.id] ?? 0}
                    commentCount={comments[p.id] ?? 0}
                    viewCount={views[p.id] ?? 0}
                  />
                ))}
              </div>
            )}

            <div className="mt-3 divide-y divide-border border-t border-border">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="px-4 py-3">
                    <Skeleton className="h-28 rounded-2xl" />
                  </div>
                ))
              ) : rest.length === 0 ? (
                <p className="py-16 text-center text-sm text-muted-foreground">No posts yet — be the first to share.</p>
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
            </div>
          </>
        )}

        {canEngage && (
          <>
            <Button
              onClick={() => setComposeOpen(true)}
              aria-label="Compose post"
              className="fixed bottom-20 right-4 z-50 h-14 w-14 rounded-full p-0 shadow-lg lg:bottom-6 lg:h-12 lg:w-auto lg:px-6"
            >
              <Feather className="h-6 w-6 lg:h-5 lg:w-5" />
              <span className="hidden lg:inline">Post</span>
            </Button>
            <ComposeSheet
              open={composeOpen}
              onOpenChange={(v) => { setComposeOpen(v); if (!v) load(); }}
              canPostAnonymous={role === "paid_member" || role === "broker"}
            />
          </>
        )}
      </div>
      </FeedShell>

      {isGuest && <GuestTeaser />}
      {!isGuest && !canRead && <PaywallOverlay />}
    </Layout>
  );
};

export default Market;
