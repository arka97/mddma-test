import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Building2, EyeOff, MoreVertical, ShieldCheck, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import type {
  CommunityBusinessSummary,
  CommunityPostRow,
} from "@/repositories/communityPosts";
import { recordView } from "@/repositories/postViews";
import { setBusinessPostLike } from "@/repositories/postLikes";
import { deletePost, setPostHidden } from "@/repositories/communityPosts";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { linkifyText, type LinkPreview } from "@/lib/linkPreview";

function LinkifiedText({ text }: { text: string }) {
  return (
    <>
      {linkifyText(text).map((part, index) =>
        part.type === "link" ? (
          <a
            key={index}
            href={part.value}
            target="_blank"
            rel="noreferrer noopener"
            className="break-all text-accent hover:underline"
            onClick={(event) => event.stopPropagation()}
          >
            {part.value}
          </a>
        ) : (
          <span key={index}>{part.value}</span>
        ),
      )}
    </>
  );
}

interface Props {
  post: CommunityPostRow;
  business?: CommunityBusinessSummary;
  liked: boolean;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  canEngage: boolean;
  isAdmin: boolean;
}

function topicLabel(topic: string | null) {
  switch (topic) {
    case "price_signals": return "Price signal";
    case "market_alerts": return "Market alert";
    case "sourcing": return "Legacy sourcing signal";
    case "member_news": return "Business update";
    case "polls": return "Poll";
    default: return null;
  }
}

function StructuredBody({ post }: { post: CommunityPostRow }) {
  const data = (post.structured_data ?? {}) as Record<string, string | number>;
  if (!post.structured_data) return null;

  if (post.post_type === "price_signal") {
    const currency = String(data.currency ?? "INR");
    return (
      <div className="mt-3 rounded-xl border border-border/60 bg-muted/30 px-3 py-2 text-xs">
        <div className="grid grid-cols-2 gap-1">
          <span className="text-muted-foreground">Commodity</span><span className="font-medium">{data.commodity ?? "—"}</span>
          <span className="text-muted-foreground">Origin</span><span>{data.origin ?? "—"}</span>
          <span className="text-muted-foreground">Indicative price</span>
          <span className="font-mono tabular-nums">{currency} {String(data.price_min ?? "—")}–{String(data.price_max ?? "—")} /{data.unit ?? "kg"}</span>
        </div>
        <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">
          Business-submitted market signal, not a binding quotation.
        </p>
      </div>
    );
  }

  if (post.post_type === "market_alert") {
    return (
      <div className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs">
        <div className="font-semibold text-amber-700 dark:text-amber-400">{data.alert_type ?? "Market alert"}</div>
        {data.description && <p className="mt-1 text-muted-foreground">{data.description}</p>}
      </div>
    );
  }

  if (post.post_type === "sourcing_ask") {
    return (
      <div className="mt-3 rounded-xl border border-border/60 bg-muted/30 px-3 py-2 text-xs">
        <div className="grid grid-cols-2 gap-1">
          <span className="text-muted-foreground">Commodity</span><span className="font-medium">{data.commodity ?? "—"}</span>
          <span className="text-muted-foreground">Quantity</span><span>{data.qty_min ?? "—"}–{data.qty_max ?? "—"} {data.qty_unit ?? ""}</span>
        </div>
        <p className="mt-2 text-[10px] text-muted-foreground">
          Legacy feed signal. Use the RFQ network for current structured requirements and private quotations.
        </p>
      </div>
    );
  }

  if (post.post_type === "member_news") {
    return (
      <div className="mt-3 rounded-xl border border-border/60 bg-muted/30 px-3 py-2 text-xs">
        {data.headline && <div className="font-semibold text-foreground">{data.headline}</div>}
        {data.description && <p className="mt-1 text-muted-foreground">{data.description}</p>}
        {data.link && /^https?:\/\//i.test(String(data.link)) && (
          <a href={String(data.link)} target="_blank" rel="noreferrer noopener" className="mt-1 inline-block text-accent hover:underline">
            Open source
          </a>
        )}
      </div>
    );
  }

  return null;
}

export function PostCard({
  post,
  business,
  liked: initialLiked,
  likeCount: initialCount,
  commentCount,
  viewCount,
  canEngage,
  isAdmin,
}: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [commentsOpen, setCommentsOpen] = useState(false);

  useEffect(() => {
    setLiked(initialLiked);
    setCount(initialCount);
  }, [initialLiked, initialCount]);

  useEffect(() => {
    if (user) void recordView(post.id);
  }, [post.id, user]);

  const onLike = async () => {
    if (!canEngage) {
      toast({
        title: "Verified business required",
        description: "Complete business verification to participate in the community.",
      });
      return;
    }

    const next = !liked;
    setLiked(next);
    setCount((value) => Math.max(0, value + (next ? 1 : -1)));
    try {
      await setBusinessPostLike(post.id, next);
      await queryClient.invalidateQueries({ queryKey: qk.community.all });
    } catch (error) {
      setLiked(!next);
      setCount((value) => Math.max(0, value + (next ? -1 : 1)));
      toast({
        title: "Reaction could not be saved",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  const onHide = async () => {
    await setPostHidden(post.id, true);
    await queryClient.invalidateQueries({ queryKey: qk.community.all });
    toast({ title: "Post hidden" });
  };

  const onDelete = async () => {
    if (!confirm("Delete this community post?")) return;
    await deletePost(post.id);
    await queryClient.invalidateQueries({ queryKey: qk.community.all });
    toast({ title: "Post deleted" });
  };

  const ownPost = post.author_id === user?.id;
  const canModerate = isAdmin || ownPost;
  const time = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });
  const label = topicLabel(post.topic_tag);

  return (
    <Card>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-primary font-semibold text-primary-foreground">
            {business?.logo_url ? (
              <img src={business.logo_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <Building2 className="h-5 w-5" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 text-sm">
              {business ? (
                <Link to={`/store/${business.slug}`} className="font-semibold text-foreground hover:text-accent">
                  {business.name}
                </Link>
              ) : (
                <span className="font-semibold text-foreground">Business profile unavailable</span>
              )}
              {business?.is_verified && <ShieldCheck className="h-4 w-4 text-success" aria-label="Business verified" />}
              {business?.country && <span className="text-xs text-muted-foreground">· {business.country}</span>}
            </div>
            <span className="text-[11px] text-muted-foreground">{time}</span>
          </div>
          {canModerate && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Post actions">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isAdmin && (
                  <DropdownMenuItem onClick={onHide}>
                    <EyeOff className="mr-2 h-4 w-4" /> Hide
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={onDelete}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {label && (
          <div className="mt-3">
            <Badge variant="outline" className="text-[10px]">{label}</Badge>
          </div>
        )}

        {post.content && (
          <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground">
            <LinkifiedText text={post.content} />
          </p>
        )}

        <StructuredBody post={post} />

        {(() => {
          const data = (post.structured_data ?? {}) as Record<string, unknown>;
          const images = Array.isArray(data.images)
            ? (data.images as string[]).filter((value) => typeof value === "string")
            : [];
          const file = data.file as { path: string; name: string; size: number } | undefined;
          return (
            <>
              {images.length > 0 && <PostImages paths={images} />}
              {file && typeof file === "object" && file.path && <PostFileChip file={file} />}
            </>
          );
        })()}

        {post.post_type === "poll" && <PollWidget postId={post.id} canVote={canEngage} />}

        {(() => {
          const data = (post.structured_data ?? {}) as Record<string, unknown>;
          const preview = data.link_preview as LinkPreview | undefined;
          return preview && typeof preview === "object" && preview.url
            ? <LinkPreviewCard preview={preview} />
            : null;
        })()}

        <EngagementBar
          liked={liked}
          likeCount={count}
          commentCount={commentCount}
          viewCount={viewCount}
          onLike={onLike}
          onCommentClick={() => setCommentsOpen(true)}
          likeDisabled={!canEngage}
        />
      </CardContent>

      <CommentsSheet
        open={commentsOpen}
        onOpenChange={setCommentsOpen}
        postId={post.id}
        canComment={canEngage}
      />
    </Card>
  );
}
