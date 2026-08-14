import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Repeat2, Share, Volume2, VolumeX, Package, BadgeCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { CommentsSheet } from "@/components/market/CommentsSheet";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { listReels, type ReelItem } from "@/repositories/reels";
import { getMediaSignedUrl } from "@/lib/uploads";
import { listLikes, likePost, unlikePost } from "@/repositories/postLikes";
import { listReposts, setRepost } from "@/repositories/postReposts";
import { nativeShare, postUrl } from "@/lib/share";
import { cn } from "@/lib/utils";
import { useChromeVisibility } from "@/contexts/ChromeVisibilityContext";

interface RailButtonProps {
  icon: typeof Heart;
  label: string;
  count?: number;
  active?: boolean;
  activeClass?: string;
  onClick: () => void;
}

function RailButton({ icon: Icon, label, count, active, activeClass, onClick }: RailButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex flex-col items-center gap-1 text-white/90 transition-transform active:scale-90"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/40 backdrop-blur">
        <Icon className={cn("h-6 w-6", active && activeClass, active && "fill-current")} />
      </span>
      {count !== undefined && count > 0 && <span className="text-[11px] font-semibold tabular-nums">{count}</span>}
    </button>
  );
}

function ReelMedia({ item, active, muted }: { item: ReelItem; active: boolean; muted: boolean }) {
  const [url, setUrl] = useState<string | null>(item.mediaUrl ?? null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let alive = true;
    if (item.mediaUrl) { setUrl(item.mediaUrl); return; }
    if (!item.mediaPath) return;
    getMediaSignedUrl(item.mediaPath).then((u) => { if (alive) setUrl(u); });
    return () => { alive = false; };
  }, [item.mediaPath, item.mediaUrl]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active) v.play().catch(() => undefined);
    else v.pause();
  }, [active, url]);

  if (!url) return <Skeleton className="h-full w-full rounded-none bg-neutral-800" />;
  if (item.mediaType === "video") {
    return (
      <video
        ref={videoRef}
        src={url}
        loop
        muted={muted}
        playsInline
        preload="metadata"
        className="h-full w-full object-contain"
      />
    );
  }
  return <img src={url} alt="" className="h-full w-full object-contain" />;
}

export function ReelsView() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { hidden: chromeHidden, reportScroll } = useChromeVisibility();
  const navigate = useNavigate();
  const [items, setItems] = useState<ReelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [muted, setMuted] = useState(true);
  const [likes, setLikes] = useState<{ counts: Record<string, number>; mine: Set<string> }>({ counts: {}, mine: new Set() });
  const [reposts, setReposts] = useState<{ counts: Record<string, number>; mine: Set<string> }>({ counts: {}, mine: new Set() });
  const [commentsFor, setCommentsFor] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let alive = true;
    listReels()
      .then(async (data) => {
        if (!alive) return;
        setItems(data);
        setLoading(false);
        const postIds = data.filter((d) => d.post).map((d) => d.post!.id);
        if (postIds.length) {
          const [l, r] = await Promise.all([listLikes(postIds).catch(() => null), listReposts(postIds)]);
          if (!alive) return;
          if (l) setLikes(l);
          setReposts(r);
        }
      })
      .catch(() => setLoading(false));
    return () => { alive = false; };
  }, []);

  const onScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    setActiveIdx(Math.round(el.scrollTop / el.clientHeight));
    // Feed the shared chrome state so header/chips/bottom bar behave as in the feed.
    reportScroll(el.scrollTop);
  };

  const requireAuth = () => {
    if (user) return true;
    toast({ title: "Sign in to interact", description: "Create a free account to like, reply and repost." });
    navigate("/login");
    return false;
  };

  const toggleLike = async (postId: string) => {
    if (!requireAuth() || !user) return;
    const liked = likes.mine.has(postId);
    setLikes((s) => {
      const mine = new Set(s.mine);
      liked ? mine.delete(postId) : mine.add(postId);
      return { counts: { ...s.counts, [postId]: Math.max(0, (s.counts[postId] ?? 0) + (liked ? -1 : 1)) }, mine };
    });
    try {
      if (liked) await unlikePost(postId, user.id);
      else await likePost(postId, user.id);
    } catch {
      toast({ title: "Couldn't update like", variant: "destructive" });
    }
  };

  const toggleRepost = async (postId: string) => {
    if (!requireAuth()) return;
    const on = reposts.mine.has(postId);
    setReposts((s) => {
      const mine = new Set(s.mine);
      on ? mine.delete(postId) : mine.add(postId);
      return { counts: { ...s.counts, [postId]: Math.max(0, (s.counts[postId] ?? 0) + (on ? -1 : 1)) }, mine };
    });
    try {
      await setRepost(postId, !on);
    } catch {
      toast({ title: "Couldn't repost", variant: "destructive" });
    }
  };

  const share = async (item: ReelItem) => {
    const url = item.post ? postUrl(item.post.id) : `${window.location.origin}/products/${item.productSlug}`;
    const res = await nativeShare(url, item.caption?.slice(0, 120));
    if (res === "copied") toast({ title: "Link copied" });
  };

  const empty = useMemo(() => !loading && items.length === 0, [loading, items]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center bg-black">
        <Skeleton className="h-24 w-24 rounded-full bg-neutral-800" />
      </div>
    );
  }

  if (empty) {
    return (
      <p className="py-24 text-center text-sm text-muted-foreground">
        No reels yet — post a video or add a product video to start the feed.
      </p>
    );
  }

  return (
    <>
      <div
        ref={containerRef}
        onScroll={onScroll}
        className={cn(
          "snap-y snap-mandatory overflow-y-auto overscroll-contain rounded-none bg-black transition-[height] duration-200 ease-out lg:h-[calc(100dvh-8rem)] lg:rounded-2xl",
          chromeHidden ? "h-[100dvh]" : "h-[calc(100dvh-10rem)]",
        )}
      >
        {items.map((item, idx) => (
          <section key={item.id} className="relative h-full w-full snap-start snap-always">
            <ReelMedia item={item} active={idx === activeIdx} muted={muted} />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pb-8">
              <div className="pointer-events-auto max-w-[75%] text-white">
                {item.kind === "product" ? (
                  <>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-white/80">
                      <Package className="h-3.5 w-3.5" /> {item.companyName ?? "Verified seller"}
                    </div>
                    <Link to={`/products/${item.productSlug}`} className="mt-1 block text-base font-bold hover:underline">
                      {item.productName}
                    </Link>
                    <Link
                      to={`/products/${item.productSlug}`}
                      className="mt-2 inline-flex h-9 items-center rounded-full bg-white px-4 text-xs font-bold text-black"
                    >
                      View product
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-white/80">
                      <BadgeCheck className="h-3.5 w-3.5" /> Member post
                    </div>
                    <p className="mt-1 line-clamp-3 text-sm leading-snug">{item.caption}</p>
                    {item.post && (
                      <Link to={`/market/${item.post.id}`} className="mt-2 inline-block text-xs font-semibold underline">
                        Open post
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="absolute bottom-24 right-3 flex flex-col items-center gap-4">
              {item.mediaType === "video" && (
                <RailButton
                  icon={muted ? VolumeX : Volume2}
                  label={muted ? "Unmute" : "Mute"}
                  onClick={() => setMuted((m) => !m)}
                />
              )}
              {item.post && (
                <>
                  <RailButton
                    icon={Heart}
                    label="Like"
                    count={likes.counts[item.post.id] ?? 0}
                    active={likes.mine.has(item.post.id)}
                    activeClass="text-like"
                    onClick={() => toggleLike(item.post!.id)}
                  />
                  <RailButton
                    icon={MessageCircle}
                    label="Reply"
                    onClick={() => { if (requireAuth()) setCommentsFor(item.post!.id); }}
                  />
                  <RailButton
                    icon={Repeat2}
                    label="Repost"
                    count={reposts.counts[item.post.id] ?? 0}
                    active={reposts.mine.has(item.post.id)}
                    activeClass="text-repost"
                    onClick={() => toggleRepost(item.post!.id)}
                  />
                </>
              )}
              <RailButton icon={Share} label="Share" onClick={() => share(item)} />
            </div>
          </section>
        ))}
      </div>

      {commentsFor && (
        <CommentsSheet
          open={!!commentsFor}
          onOpenChange={(v) => !v && setCommentsFor(null)}
          postId={commentsFor}
          canComment={!!user}
        />
      )}
    </>
  );
}
