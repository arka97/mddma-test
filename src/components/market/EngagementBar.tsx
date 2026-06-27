import { ThumbsUp, MessageCircle, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  liked: boolean;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  onLike: () => void;
  onCommentClick: () => void;
  disabled?: boolean;
}

export function EngagementBar({ liked, likeCount, commentCount, viewCount, onLike, onCommentClick, disabled }: Props) {
  return (
    <div className="mt-3 flex items-center gap-5 border-t border-border/60 pt-2 text-xs text-muted-foreground">
      <button
        type="button"
        onClick={onLike}
        disabled={disabled}
        className={cn(
          "inline-flex items-center gap-1 transition-colors disabled:opacity-50",
          liked ? "text-accent" : "hover:text-foreground",
        )}
      >
        <Heart className={cn("h-4 w-4", liked && "fill-current")} />
        <span className="tabular-nums">{likeCount}</span>
      </button>
      <button
        type="button"
        onClick={onCommentClick}
        disabled={disabled}
        className="inline-flex items-center gap-1 transition-colors hover:text-foreground disabled:opacity-50"
      >
        <MessageCircle className="h-4 w-4" />
        <span className="tabular-nums">{commentCount}</span>
      </button>
      <span className="ml-auto inline-flex items-center gap-1">
        <Eye className="h-3.5 w-3.5" />
        <span className="tabular-nums">{viewCount}</span>
      </span>
    </div>
  );
}
