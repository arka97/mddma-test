import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type TouchEvent as ReactTouchEvent } from "react";
import { Feather } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { FeedShell } from "@/components/layout/FeedShell";
import { SuggestedFollows } from "@/components/feed/SuggestedFollows";
import { TrendingTopics } from "@/components/feed/TrendingTopics";
import { MyBusinessesCard } from "@/components/feed/MyBusinessesCard";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/contexts/RoleContext";
import { TopicChips, type FeedTopic } from "@/components/market/TopicChips";
import { useFollowedAuthorIds } from "@/hooks/useFollow";

import { Link, useNavigate } from "react-router-dom";
import { FEED_TOPIC_ORDER } from "@/components/market/TopicChips";
import { ReelsView } from "@/components/reels/ReelsView";
import { listReposts } from "@/repositories/postReposts";
import { PostCard } from "@/components/market/PostCard";
import { PinnedRatesCard } from "@/components/market/PinnedRatesCard";
import { ComposeSheet } from "@/components/market/ComposeSheet";
import { BulletinCard } from "@/components/market/BulletinCard";
import { useCirculars } from "@/hooks/queries/useContent";
import type { CircularRow } from "@/repositories/circulars";
import { AdSlot } from "@/components/home/today/AdSlot";
import { EnablePushCard } from "@/components/notifications/EnablePushCard";
import { cn } from "@/lib/utils";
import { useChromeVisibility } from "@/contexts/ChromeVisibilityContext";

import { listFeedPosts, type CommunityPostRow, type TopicTag } from "@/repositories/communityPosts";
import { listLikes } from "@/repositories/postLikes";
import { commentCounts } from "@/repositories/postComments";
import { viewCounts } from "@/repositories/postViews";
import { listCompaniesByOwners } from "@/repositories/companies";
import { listFeedEvents, type FeedEvent } from "@/repositories/feedEvents";
import { SystemEventCard } from "@/components/market/SystemEventCard";
import { supabase } from "@/integrations/supabase/client";
import { fabBottom } from "@/lib/chrome-layout";

type FeedAuthor = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  company_name?: string | null;
  slug?: string | null;
  is_verified?: boolean | null;
};

const Home = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const { role, featuresOpen, isEffectivePaid } = useRole();
  const [topic, setTopic] = useState<FeedTopic>("all");
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const homeChromeRef = useRef<HTMLDivElement | null>(null);
  const [reelTopInset, setReelTopInset] = useState(48);
  const { hidden: hideChrome, showChrome } = useChromeVisibility();
  const navigate = useNavigate();

  /** Horizontal swipe moves to the previous/next chip in order. */
  const onTouchStart = (e: ReactTouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: ReactTouchEvent) => {
    const s = touchStart.current;
    touchStart.current = null;
    if (!s) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    const i = FEED_TOPIC_ORDER.indexOf(topic);
    if (i < 0) return;
    const next = dx < 0 ? i + 1 : i - 1;
    if (next >= 0 && next < FEED_TOPIC_ORDER.length) setTopic(FEED_TOPIC_ORDER[next]);
  };
  const [posts, setPosts] = useState<CommunityPostRow[]>([]);
  const [authors, setAuthors] = useState<Record<string, FeedAuthor>>({});
  const [authorCompanyIds, setAuthorCompanyIds] = useState<Record<string, string>>({});
  const [likes, setLikes] = useState<{ counts: Record<string, number>; mine: Set<string> }>({ counts: {}, mine: new Set() });
  const [comments, setComments] = useState<Record<string, number>>({});
  const [views, setViews] = useState<Record<string, number>>({});
  const [reposts, setReposts] = useState<{ counts: Record<string, number>; mine: Set<string> }>({ counts: {}, mine: new Set() });
  const [loading, setLoading] = useState(true);
  const [composeOpen, setComposeOpen] = useState(false);
  const [events, setEvents] = useState<FeedEvent[]>([]);
  const { authorIds: followedAuthorIds, isLoading: followsLoading } = useFollowedAuthorIds();
  const { data: circulars } = useCirculars();


  const isPaid = isEffectivePaid;
  const isAdmin = role === "admin";
  const isGuest = !user && !authLoading && !featuresOpen;

  const freeInGrace = useMemo(() => {
    if (!profile || role !== "free_member") return false;
    const created = (profile as unknown as { created_at?: string }).created_at;
    if (!created) return true; // optimistic; RLS will gate
    return Date.now() - new Date(created).getTime() < 7 * 86400000;
  }, [profile, role]);

  const canRead = true;
  const canEngage = !!user;

  // Reels is fixed to the mobile viewport. Measure the actual bottom edge of
  // the visible ad + chip stack so its media starts below chrome without
  // relying on brittle hard-coded banner heights.
  useLayoutEffect(() => {
    const el = homeChromeRef.current;
    if (!el || hideChrome) return;
    const measure = () => setReelTopInset(Math.max(48, Math.round(el.getBoundingClientRect().bottom)));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [hideChrome, topic]);

  const load = async () => {
    setLoading(true);
    try {
      const topicArg =
        topic === "all" || topic === "following" || topic === "bulletin" || topic === "reels"
          ? undefined
          : (topic as TopicTag);
      const data = topic === "bulletin" || topic === "reels" ? [] : await listFeedPosts(topicArg);

      setPosts(data);
      const ids = data.map((p) => p.id);
      const aIds = Array.from(new Set(data.filter((p) => !p.is_anonymous).map((p) => p.author_id)));
      const [l, c, v, profs, companies] = await Promise.all([
        listLikes(ids),
        commentCounts(ids),
        viewCounts(ids),
        fetchPublicProfiles(aIds),
        aIds.length ? listCompaniesByOwners(aIds) : Promise.resolve({}),
      ]);
      setLikes(l);
      listReposts(ids).then(setReposts).catch(() => undefined);
      setComments(c);
      setViews(v);
      const map: Record<string, FeedAuthor> = {};
      const companyIds: Record<string, string> = {};
      profs.forEach((p) => { map[p.id] = p; });

      // Merge storefront slug + verified flag so authors link to their profile.
      Object.entries(companies as Record<string, { id: string; slug: string; name: string; is_verified: boolean }>).forEach(([ownerId, co]) => {
        map[ownerId] = {
          ...(map[ownerId] ?? { id: ownerId, full_name: null, avatar_url: null }),
          company_name: map[ownerId]?.company_name ?? co.name,
          slug: co.slug,
          is_verified: co.is_verified,
        };
        if (co.id) companyIds[ownerId] = co.id;
      });
      setAuthors(map);
      setAuthorCompanyIds(companyIds);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Switching chip always brings the chrome back so nav is never hidden on arrival.
  useEffect(() => {
    showChrome();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic]);

  useEffect(() => {
    if (canRead) load();
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic, canRead]);

  useEffect(() => {
    if (!canRead) { setEvents([]); return; }
    listFeedEvents(6).then(setEvents).catch(() => setEvents([]));
  }, [canRead]);

  // Composing from the bottom bar lives outside this page — refresh on its signal.
  useEffect(() => {
    const onRefresh = () => load();
    window.addEventListener("gbaug:feed-refresh", onRefresh);
    return () => window.removeEventListener("gbaug:feed-refresh", onRefresh);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic]);

  const pinned = topic === "following" || topic === "bulletin"
    ? []
    : posts.filter((p) => p.is_pinned || p.post_type === "admin_rate_update");
  const restAll = posts.filter((p) => !pinned.includes(p));
  const rest = topic === "following"
    ? restAll.filter((p) => !p.is_anonymous && followedAuthorIds.has(p.author_id))
    : restAll;

  // Bulletins (circulars) flow inline with posts instead of a fixed card.
  const bulletins = circulars ?? [];
  const bulletinDate = (c: CircularRow) => new Date(c.published_at ?? c.created_at).getTime();

  type FeedItem =
    | { kind: "post"; post: CommunityPostRow }
    | { kind: "bulletin"; circular: CircularRow };

  const items: FeedItem[] =
    topic === "bulletin"
      ? bulletins.map((c) => ({ kind: "bulletin" as const, circular: c }))
      : topic === "all"
        ? [
            ...rest.map((p) => ({ kind: "post" as const, post: p })),
            ...bulletins.map((c) => ({ kind: "bulletin" as const, circular: c })),
          ].sort((a, b) => {
            const at = a.kind === "post" ? new Date(a.post.created_at).getTime() : bulletinDate(a.circular);
            const bt = b.kind === "post" ? new Date(b.post.created_at).getTime() : bulletinDate(b.circular);
            return bt - at;
          })
        : rest.map((p) => ({ kind: "post" as const, post: p }));

  // Anything older than a week is de-emphasised so stale rates don't read as today's.
  const itemTime = (i: FeedItem) =>
    i.kind === "post" ? new Date(i.post.created_at).getTime() : bulletinDate(i.circular);
  const olderStartIdx = items.findIndex(
    (i) => Date.now() - itemTime(i) > 7 * 86400000,
  );




  return (
    <Layout>
      <Seo title="G-BAU-G — Verified food trade feed by MDDMA" description="Live feed of rates, bulletins, sourcing asks and reels from verified nuts, dry fruits, dates and spice businesses." path="/" />

      <FeedShell
        rightRail={
          <>
            <MyBusinessesCard />
            <SuggestedFollows />
            <TrendingTopics />
          </>
        }
      >
      <div className="mx-auto min-h-screen w-full pb-24 sm:border-x sm:border-border xl:border-x-0">
        <div
          ref={homeChromeRef}
          style={{
            "--home-chrome-transform": hideChrome ? "translateY(calc(-100% - 48px))" : "translateY(0)",
            "--home-chrome-opacity": hideChrome ? 0 : 1,
          } as CSSProperties}
          className={cn(
            "sticky top-12 z-30 bg-background opacity-[var(--home-chrome-opacity)] [transform:var(--home-chrome-transform)] transition-[transform,opacity] duration-200 ease-out lg:top-12 lg:translate-y-0 lg:opacity-100",
            hideChrome ? "pointer-events-none lg:pointer-events-auto" : "pointer-events-auto",
          )}
        >
          <div>
            <div className="px-4 pb-3 pt-3">
              <AdSlot placement="homepage-banner" />
            </div>
            <div className="border-b border-border px-2 py-2">
              <TopicChips active={topic} onChange={setTopic} />
            </div>
          </div>
        </div>



        <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {topic === "reels" ? (
          <ReelsView visibleTopInset={reelTopInset} />
        ) : (
        <>
        {!canRead && !isGuest && (

          <div className="m-4 rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
            Free trial expired. Upgrade to access the market feed.
          </div>
        )}

        {canRead && (
          <>
            <div className="pt-3">
              <EnablePushCard />
            </div>
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
              {loading || (topic === "following" && followsLoading) ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="px-4 py-3">
                    <Skeleton className="h-28 rounded-2xl" />
                  </div>
                ))
              ) : items.length === 0 ? (
                topic === "following" ? (
                  <div className="px-6 py-16 text-center">
                    <p className="text-sm font-semibold text-foreground">Your Following feed is empty</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Follow businesses or members and their posts show up here.
                    </p>
                    <Link
                      to="/discover"
                      className="mt-4 inline-flex h-9 items-center rounded-full bg-foreground px-5 text-sm font-semibold text-background"
                    >
                      Discover businesses
                    </Link>
                    <div className="mx-auto mt-6 max-w-sm text-left">
                      <SuggestedFollows limit={5} />
                    </div>
                  </div>
                ) : topic === "bulletin" ? (
                  <p className="py-16 text-center text-sm text-muted-foreground">
                    No bulletins published yet.
                  </p>
                ) : (
                  <p className="py-16 text-center text-sm text-muted-foreground">
                    No posts yet — be the first to share.
                  </p>
                )
              ) : (
                items.map((item, idx) => {
                  const isOlder = idx >= olderStartIdx && olderStartIdx >= 0;
                  const divider = idx === olderStartIdx && olderStartIdx > 0 ? (
                    <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Older than a week
                    </div>
                  ) : null;
                  if (item.kind === "bulletin") {
                    return (
                      <div key={`bulletin-${item.circular.id}`} className={cn(isOlder && "opacity-70")}>
                        {divider}
                        <BulletinCard circular={item.circular} />
                      </div>
                    );
                  }
                  const p = item.post;
                  const event = idx > 0 && idx % 4 === 0
                    ? events[Math.floor(idx / 4) - 1]
                    : null;
                  return (
                    <div key={p.id} className={cn(isOlder && "opacity-70")}>
                      {divider}
                      {event && <SystemEventCard event={event} />}
                      <PostCard
                        post={p}
                        author={authors[p.author_id]}
                        companyId={authorCompanyIds[p.author_id] ?? null}
                        liked={likes.mine.has(p.id)}
                        likeCount={likes.counts[p.id] ?? 0}
                        commentCount={comments[p.id] ?? 0}
                        viewCount={views[p.id] ?? 0}
                        reposted={reposts.mine.has(p.id)}
                        repostCount={reposts.counts[p.id] ?? 0}
                        canEngage={canEngage}
                        isAdmin={isAdmin}
                      />
                    </div>
                  );
                })

              )}

            </div>
          </>
        )}
        </>
        )}
        </div>

        <>
          <Button
            onClick={() => (canEngage ? setComposeOpen(true) : navigate("/login"))}
            aria-label="Compose post"
            style={{
              "--fab-bottom": fabBottom(hideChrome),
            } as CSSProperties}
            className={cn(
              "fixed bottom-[var(--fab-bottom)] right-4 z-40 h-14 w-14 rounded-full p-0 shadow-lg transition-[bottom] duration-200 ease-out lg:bottom-6 lg:right-6 lg:h-12 lg:w-auto lg:px-6",
            )}

          >
            <Feather className="h-6 w-6 lg:mr-2 lg:h-5 lg:w-5" />
            <span className="hidden lg:inline">Post</span>
          </Button>
          {canEngage && (
            <ComposeSheet
              open={composeOpen}
              onOpenChange={(v) => { setComposeOpen(v); if (!v) load(); }}
              canPostAnonymous={role === "paid_member" || role === "broker"}
            />
          )}
        </>

      </div>
      </FeedShell>

    </Layout>
  );
};

export default Home;
