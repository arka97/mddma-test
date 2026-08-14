import { type ComponentType } from "react";
import { MessageCircle, Repeat2, Heart, BarChart3, Bookmark, Share, Copy, Link2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useBookmark } from "@/hooks/useBookmark";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { nativeShare, postUrl, shareTargets } from "@/lib/share";
import { cn } from "@/lib/utils";

interface Props {
  liked: boolean;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  reposted?: boolean;
  repostCount?: number;
  onRepost?: () => void;
  onLike: () => void;
  onReplyClick: () => void;
  disabled?: boolean;
  postId: string;
  shareText?: string;
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
  asChild,
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
  asChild?: boolean;
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
  reposted = false,
  repostCount = 0,
  onRepost,
  onLike,
  onReplyClick,
  disabled,
  postId,
  shareText,
  size = "sm",
}: Props) {
  const { toast } = useToast();
  const { bookmarked, toggle: toggleBookmark } = useBookmark(postId);
  const url = typeof window !== "undefined" ? postUrl(postId) : "";

  const onNativeShare = async () => {
    const res = await nativeShare(url, shareText);
    if (res === "copied") toast({ title: "Link copied", description: "Post link copied to your clipboard." });
  };

  const onCopy = async () => {
    await navigator.clipboard.writeText(url);
    toast({ title: "Link copied" });
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
        count={repostCount}
        label={reposted ? "Undo repost" : "Repost"}
        onClick={onRepost}
        disabled={disabled || !onRepost}
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
          onClick={toggleBookmark}
          active={bookmarked}
          activeText="text-primary"
          hoverText="hover:text-primary"
          hoverBg="group-hover:bg-primary/10"
          fill
          size={size}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Share post"
              className="group -ml-2 inline-flex items-center gap-1 text-[13px] text-muted-foreground transition-colors hover:text-primary"
            >
              <span className={cn("flex items-center justify-center rounded-full transition-colors group-hover:bg-primary/10", size === "lg" ? "p-2.5" : "p-2")}>
                <Share className={size === "lg" ? "h-5 w-5" : "h-[18px] w-[18px]"} />
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem onClick={onNativeShare}>
              <Share className="mr-2 h-4 w-4" /> Share via…
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onCopy}>
              <Copy className="mr-2 h-4 w-4" /> Copy link
            </DropdownMenuItem>
            {shareTargets(url, shareText).map((t) => (
              <DropdownMenuItem key={t.id} asChild>
                <a href={t.href} target="_blank" rel="noreferrer noopener">
                  <Link2 className="mr-2 h-4 w-4" /> {t.label}
                </a>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
