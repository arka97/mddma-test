import { useState, type ComponentType } from "react";
import { MessageCircle, Repeat2, Heart, BarChart3, Bookmark, Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useBookmark } from "@/hooks/useBookmark";
import { cn } from "@/lib/utils";

interface Props {
  liked: boolean;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  onLike: () => void;
  onReplyClick: () => void;
  disabled?: boolean;
  postId: string;
  size?: "sm" | "lg";
}

function ActionButton({
  icon: Icon,
  count,
  label,
  onClick,
  active,
  activeText,
  hoverText,
  hoverBg,
  fill,
  disabled,
  size,
}: {
  icon: ComponentType<{ className?: string }>;
  count?: number;
  label: string;
  onClick?: () => void;
  active?: boolean;
  activeText?: string;
  hoverText?: string;
  hoverBg?: string;
  fill?: boolean;
  disabled?: boolean;
  size: "sm" | "lg";
}) {
  const iconSize = size === "lg" ? "h-5 w-5" : "h-[18px] w-[18px]";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "group -ml-2 inline-flex items-center gap-1 text-[13px] transition-colors disabled:opacity-40",
        active ? activeText : "text-muted-foreground",
        !disabled && hoverText,
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center rounded-full transition-colors",
          size === "lg" ? "p-2.5" : "p-2",
          !disabled && hoverBg,
        )}
      >
        <Icon className={cn(iconSize, fill && active && "fill-current")} />
      </span>
      {count !== undefined && count > 0 && <span className="tabular-nums">{count}</span>}
    </button>
  );
}

/** X-style action row: reply · repost · like · views · bookmark · share. */
export function EngagementBar({
  liked,
  likeCount,
  commentCount,
  viewCount,
  onLike,
  onReplyClick,
  disabled,
  postId,
  size = "sm",
}: Props) {
  const { toast } = useToast();
  const [reposted, setReposted] = useState(false);
  const { bookmarked, toggle: toggleBookmark } = useBookmark(postId);

  const onShare = async () => {
    const url = `${window.location.origin}/market/${postId}`;
    try {
      if (navigator.share) await navigator.share({ url });
      else {
        await navigator.clipboard.writeText(url);
        toast({ title: "Link copied", description: "Post link copied to your clipboard." });
      }
    } catch {
      /* user dismissed the share sheet */
    }
  };

  return (
    <div className={cn("mt-2 flex items-center justify-between", size === "lg" ? "max-w-lg" : "max-w-md")}>
      <ActionButton
        icon={MessageCircle}
        count={commentCount}
        label="Reply"
        onClick={onReplyClick}
        hoverText="hover:text-primary"
        hoverBg="group-hover:bg-primary/10"
        size={size}
      />
      <ActionButton
        icon={Repeat2}
        count={reposted ? 1 : 0}
        label={reposted ? "Undo repost" : "Repost"}
        onClick={() => setReposted((v) => !v)}
        active={reposted}
        activeText="text-repost"
        hoverText="hover:text-repost"
        hoverBg="group-hover:bg-repost/10"
        size={size}
      />
      <ActionButton
        icon={Heart}
        count={likeCount}
        label={liked ? "Unlike" : "Like"}
        onClick={onLike}
        disabled={disabled}
        active={liked}
        activeText="text-like"
        hoverText="hover:text-like"
        hoverBg="group-hover:bg-like/10"
        fill
        size={size}
      />
      <ActionButton
        icon={BarChart3}
        count={viewCount}
        label="Views"
        size={size}
        disabled
      />
      <div className="flex items-center">
        <ActionButton
          icon={Bookmark}
          label={bookmarked ? "Remove bookmark" : "Bookmark"}
          onClick={() => setBookmarked((v) => !v)}
          active={bookmarked}
          activeText="text-primary"
          hoverText="hover:text-primary"
          hoverBg="group-hover:bg-primary/10"
          fill
          size={size}
        />
        <ActionButton
          icon={Share}
          label="Share post"
          onClick={onShare}
          hoverText="hover:text-primary"
          hoverBg="group-hover:bg-primary/10"
          size={size}
        />
      </div>
    </div>
  );
}
