import { useEffect, useState, type MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, MoreHorizontal, EyeOff, Trash2, UserX, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EngagementBar } from "./EngagementBar";
import { CommentsSheet } from "./CommentsSheet";
import { LinkPreviewCard } from "./LinkPreviewCard";
import { PostImages, PostFileChip } from "./PostMedia";
import { PollWidget } from "./PollWidget";
import { FollowButton } from "@/components/social/FollowButton";
import type { CommunityPostRow } from "@/repositories/communityPosts";
import { recordView } from "@/repositories/postViews";
import { likePost, unlikePost } from "@/repositories/postLikes";
import { setPostHidden, deletePost, muteAuthor } from "@/repositories/communityPosts";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { linkifyText, type LinkPreview } from "@/lib/linkPreview";
import { cn } from "@/lib/utils";

function LinkifiedText({ text }: { text: string }) {
  const parts = linkifyText(text);
  return (
    <>
      {parts.map((p, i) =>
        p.type === "link" ? (
          <a
            key={i}
            href={p.value}
            target="_blank"
            rel="noreferrer noopener"
            className="text-primary break-all hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {p.value}
          </a>
        ) : (
          <span key={i}>{p.value}</span>
        ),
      )}
    </>
  );
}

interface Author {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  company_name?: string | null;
  slug?: string | null;
  is_verified?: boolean | null;
}

interface Props {
  post: CommunityPostRow;
  author?: Author;
  liked: boolean;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  canEngage: boolean;
  isAdmin: boolean;
  variant?: "feed" | "detail";
  /** When provided, the reply action calls this instead of opening the sheet. */
  onReply?: () => void;
}

function topicLabel(t: string | null) {
  switch (t) {
    case "price_signals": return "Price Signal";
    case "market_alerts": return "Market Alert";
    case "sourcing": return "Sourcing";
    case "member_news": return "Member News";
    case "polls": return "Poll";
    default: return null;
  }
}

function StructuredBody({ post }: { post: CommunityPostRow }) {
  const sd = (post.structured_data ?? {}) as Record<string, string | number>;
  if (!post.structured_data) return null;

  if (post.post_type === "price_signal") {
    return (
      <div className="mt-2 rounded-xl border border-border bg-muted/40 px-3 py-2 text-xs">
        <div className="grid grid-cols-2 gap-1">
          <span className="text-muted-foreground">Commodity</span><span className="font-medium">{sd.commodity ?? "—"}</span>
          <span className="text-muted-foreground">Origin</span><span>{sd.origin ?? "—"}</span>
          <span className="text-muted-foreground">Price</span>
          <span className="font-mono tabular-nums">₹{sd.price_min}–{sd.price_max} /{sd.unit ?? "kg"}</span>
        </div>
      </div>
    );
  }
  if (post.post_type === "market_alert") {
    return (
      <div className="mt-2 rounded-xl border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs">
        <div className="font-semibold text-amber-700 dark:text-amber-400">{sd.alert_type ?? "Alert"}</div>
        <p className="mt-1 text-muted-foreground">{sd.description ?? ""}</p>
      </div>
    );
  }
  if (post.post_type === "sourcing_ask") {
    return (
      <div className="mt-2 rounded-xl border border-border bg-muted/40 px-3 py-2 text-xs">
        <div className="grid grid-cols-2 gap-1">
          <span className="text-muted-foreground">Commodity</span><span className="font-medium">{sd.commodity ?? "—"}</span>
          <span className="text-muted-foreground">Quantity</span><span>{sd.qty_min}–{sd.qty_max} {sd.qty_unit}</span>
          <span className="text-muted-foreground">Price</span>
          <span className="font-mono tabular-nums">₹{sd.price_min}–{sd.price_max} /{sd.price_unit ?? "kg"}</span>
          {sd.grade && (<><span className="text-muted-foreground">Grade</span><span>{sd.grade}</span></>)}
          {sd.valid_until && (<><span className="text-muted-foreground">Valid until</span><span>{sd.valid_until}</span></>)}
        </div>
      </div>
    );
  }
  if (post.post_type === "member_news") {
    return (
      <div className="mt-2 rounded-xl border border-border bg-muted/40 px-3 py-2 text-xs">
        {sd.headline && <div className="font-semibold text-foreground">{sd.headline}</div>}
        {sd.description && <p className="mt-1 text-muted-foreground">{sd.description}</p>}
        {sd.link && /^https?:\/\//i.test(String(sd.link)) && (
          <a href={String(sd.link)} target="_blank" rel="noreferrer noopener" onClick={(e) => e.stopPropagation()} className="mt-1 inline-block text-primary hover:underline">
            {String(sd.link)}
          </a>
        )}
      </div>
    );
  }
  return null;
}

export function PostCard({
  post,
  author,
  liked: initialLiked,
  likeCount: initialCount,
  commentCount,
  viewCount,
  canEngage,
  isAdmin,
  variant = "feed",
  onReply,
}: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [open, setOpen] = useState(false);

  useEffect(() => { setLiked(initialLiked); setCount(initialCount); }, [initialLiked, initialCount]);

  // Record view once per mount (RLS allows authenticated only).
  useEffect(() => {
    if (user) recordView(post.id, user.id);
  }, [post.id, user]);

  const onLike = async () => {
    if (!canEngage || !user) {
      toast({ title: "Paid members only", description: "Upgrade to like posts." });
      return;
    }
    const next = !liked;
    setLiked(next);
    setCount((c) => c + (next ? 1 : -1));
    try {
      if (next) await likePost(post.id, user.id);
      else await unlikePost(post.id, user.id);
      qc.invalidateQueries({ queryKey: ["post-likes"] });
    } catch {
      setLiked(!next);
      setCount((c) => c + (next ? -1 : 1));
    }
  };

  const onHide = async () => {
    await setPostHidden(post.id, true);
    qc.invalidateQueries({ queryKey: ["community-feed"] });
    toast({ title: "Post hidden" });
  };
  const onDelete = async () => {
    if (!confirm("Delete this post?")) return;
    await deletePost(post.id);
    qc.invalidateQueries({ queryKey: ["community-feed"] });
    toast({ title: "Post deleted" });
  };
  const onMute = async () => {
    if (!confirm("Mute this author?")) return;
    await muteAuthor(post.author_id, true);
    toast({ title: "Author muted" });
  };

  const isDetail = variant === "detail";
  const anon = post.is_anonymous;
  const displayName = anon ? "G-BAU-G Member" : author?.full_name ?? author?.company_name ?? "Member";
  const company = anon ? null : author?.company_name;
  const slug = anon ? null : author?.slug ?? null;
  const profileHref = slug ? `/store/${slug}` : undefined;
  const handle = slug ? `@${slug}` : null;
  const verified = !anon && !!author?.is_verified;
  const followId = slug ?? author?.id ?? null;
  const isSelf = !!user?.id && !!author?.id && user.id === author.id;
  const time = formatDistanceToNow(new Date(post.created_at), { addSuffix: false });
  const tlabel = topicLabel(post.topic_tag);
  const detailHref = `/market/${post.id}`;

  // Whole-card click opens the post — but never when the user clicked an
  // interactive child (link, button, media tile, menu, etc.).
  const onCardClick = (e: MouseEvent<HTMLElement>) => {
    if (isDetail) return;
    if ((e.target as HTMLElement).closest('a,button,[role="button"],input,textarea,label,[data-no-nav]')) return;
    navigate(detailHref);
  };

  const NameBlock = (
    <div className="flex min-w-0 flex-wrap items-center gap-x-1 gap-y-0 text-[15px] leading-tight">
      {profileHref ? (
        <Link to={profileHref} className="truncate font-bold text-foreground hover:underline">
          {displayName}
        </Link>
      ) : (
        <span className="truncate font-bold text-foreground">{displayName}</span>
      )}
      {verified && <BadgeCheck className="h-[18px] w-[18px] shrink-0 text-verified" aria-label="Verified business" />}
      {handle && <span className="truncate text-muted-foreground">{handle}</span>}
      <span className="text-muted-foreground">·</span>
      <Link to={detailHref} onClick={(e) => e.stopPropagation()} className="shrink-0 text-muted-foreground hover:underline">
        {time}
      </Link>
    </div>
  );

  const Media = (() => {
    const sd = (post.structured_data ?? {}) as Record<string, unknown>;
    const images = Array.isArray(sd.images) ? (sd.images as string[]).filter((s) => typeof s === "string") : [];
    const file = sd.file as { path: string; name: string; size: number } | undefined;
    return (
      <>
        {images.length > 0 && <PostImages paths={images} />}
        {file && typeof file === "object" && file.path && <PostFileChip file={file} />}
      </>
    );
  })();

  const LinkPreviewBlock = (() => {
    const sd = (post.structured_data ?? {}) as Record<string, unknown>;
    const lp = sd.link_preview as LinkPreview | undefined;
    if (!lp || typeof lp !== "object" || !lp.url) return null;
    return <LinkPreviewCard preview={lp} />;
  })();

  return (
    <article
      onClick={onCardClick}
      className={cn(
        "px-4 py-3 transition-colors",
        !isDetail && "cursor-pointer hover:bg-muted/40",
      )}
    >
      <div className="flex gap-3">
        {/* Avatar column */}
        {anon ? (
          <div className={cn("flex shrink-0 items-center justify-center rounded-full bg-muted", isDetail ? "h-11 w-11" : "h-10 w-10")}>
            <Shield className="h-5 w-5 text-muted-foreground" />
          </div>
        ) : profileHref ? (
          <Link to={profileHref} onClick={(e) => e.stopPropagation()} className="shrink-0">
            <Avatar className={cn(isDetail ? "h-11 w-11" : "h-10 w-10")}>
              <AvatarImage src={author?.avatar_url ?? undefined} />
              <AvatarFallback>{displayName.slice(0, 1)}</AvatarFallback>
            </Avatar>
          </Link>
        ) : (
          <Avatar className={cn("shrink-0", isDetail ? "h-11 w-11" : "h-10 w-10")}>
            <AvatarImage src={author?.avatar_url ?? undefined} />
            <AvatarFallback>{displayName.slice(0, 1)}</AvatarFallback>
          </Avatar>
        )}

        {/* Content column */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            {NameBlock}
            <div className="flex shrink-0 items-center gap-1">
              {followId && !isSelf && !anon && (
                <FollowButton id={followId} name={displayName} />
              )}
              {isAdmin && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8 text-muted-foreground">
                      <MoreHorizontal className="h-[18px] w-[18px]" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onHide}><EyeOff className="mr-2 h-4 w-4" /> Hide</DropdownMenuItem>
                    <DropdownMenuItem onClick={onDelete}><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                    <DropdownMenuItem onClick={onMute}><UserX className="mr-2 h-4 w-4" /> Mute author</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {tlabel && (
            <div className="mt-1">
              <Badge variant="secondary" className="rounded-full text-[10px] font-medium">{tlabel}</Badge>
            </div>
          )}

          {post.content && (
            <p className={cn(
              "mt-1 whitespace-pre-wrap break-words text-foreground",
              isDetail ? "text-[17px] leading-relaxed" : "text-[15px] leading-normal",
            )}>
              <LinkifiedText text={post.content} />
            </p>
          )}

          <StructuredBody post={post} />
          {Media}
          {post.post_type === "poll" && <PollWidget postId={post.id} canVote={canEngage} />}
          {LinkPreviewBlock}

          {anon && (
            <p className="mt-2 text-[11px] italic text-muted-foreground">Identity protected by G-BAU-G</p>
          )}

          <EngagementBar
            liked={liked}
            likeCount={count}
            commentCount={commentCount}
            viewCount={viewCount}
            onLike={onLike}
            onReplyClick={onReply ?? (() => setOpen(true))}
            disabled={!canEngage}
            postId={post.id}
            size={isDetail ? "lg" : "sm"}
          />
        </div>
      </div>

      <CommentsSheet open={open} onOpenChange={setOpen} postId={post.id} canComment={canEngage} />
    </article>
  );
}
