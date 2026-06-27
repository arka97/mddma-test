import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, MoreVertical, EyeOff, Trash2, UserX } from "lucide-react";
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
import type { CommunityPostRow } from "@/repositories/communityPosts";
import { recordView } from "@/repositories/postViews";
import { likePost, unlikePost } from "@/repositories/postLikes";
import { setPostHidden, deletePost, muteAuthor } from "@/repositories/communityPosts";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { linkifyText, type LinkPreview } from "@/lib/linkPreview";

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
            className="text-accent break-all hover:underline"
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
      <div className="mt-2 rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-xs">
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
      <div className="mt-2 rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs">
        <div className="font-semibold text-amber-700 dark:text-amber-400">{sd.alert_type ?? "Alert"}</div>
        <p className="mt-1 text-muted-foreground">{sd.description ?? ""}</p>
      </div>
    );
  }
  if (post.post_type === "sourcing_ask") {
    return (
      <div className="mt-2 rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-xs">
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
      <div className="mt-2 rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-xs">
        {sd.headline && <div className="font-semibold text-foreground">{sd.headline}</div>}
        {sd.description && <p className="mt-1 text-muted-foreground">{sd.description}</p>}
        {sd.link && /^https?:\/\//i.test(String(sd.link)) && (
          <a href={String(sd.link)} target="_blank" rel="noreferrer noopener" className="mt-1 inline-block text-accent hover:underline">
            {String(sd.link)}
          </a>
        )}
      </div>
    );
  }
  return null;
}

export function PostCard({ post, author, liked: initialLiked, likeCount: initialCount, commentCount, viewCount, canEngage, isAdmin }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();
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

  const displayName = post.is_anonymous ? "MDDMA Member" : author?.full_name ?? "Member";
  const company = post.is_anonymous ? null : author?.company_name;
  const time = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });
  const tlabel = topicLabel(post.topic_tag);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {post.is_anonymous ? (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
              <Shield className="h-4 w-4 text-muted-foreground" />
            </div>
          ) : (
            <Avatar className="h-9 w-9">
              <AvatarImage src={author?.avatar_url ?? undefined} />
              <AvatarFallback>{displayName.slice(0, 1)}</AvatarFallback>
            </Avatar>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-foreground">{displayName}</span>
              {company && <span className="truncate text-muted-foreground">· {company}</span>}
            </div>
            <span className="text-[11px] text-muted-foreground">{time}</span>
          </div>
          {isAdmin && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreVertical className="h-4 w-4" />
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

        {tlabel && (
          <div className="mt-2">
            <Badge variant="outline" className="text-[10px]">{tlabel}</Badge>
          </div>
        )}

        {post.content && (
          <p className="mt-2 whitespace-pre-wrap break-words text-sm text-foreground">
            <LinkifiedText text={post.content} />
          </p>
        )}

        <StructuredBody post={post} />

        {(() => {
          const sd = (post.structured_data ?? {}) as Record<string, unknown>;
          const lp = sd.link_preview as LinkPreview | undefined;
          if (!lp || typeof lp !== "object" || !lp.url) return null;
          return <LinkPreviewCard preview={lp} />;
        })()}

        {post.is_anonymous && (
          <p className="mt-2 text-[10px] italic text-muted-foreground">Identity protected by MDDMA</p>
        )}

        <EngagementBar
          liked={liked}
          likeCount={count}
          commentCount={commentCount}
          viewCount={viewCount}
          onLike={onLike}
          onCommentClick={() => setOpen(true)}
          disabled={!canEngage}
        />
      </CardContent>

      <CommentsSheet open={open} onOpenChange={setOpen} postId={post.id} canComment={canEngage} />
    </Card>
  );
}
