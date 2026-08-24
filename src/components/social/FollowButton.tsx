import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useFollow, type FollowTarget } from "@/hooks/useFollow";
import { useAuth } from "@/contexts/AuthContext";

interface FollowButtonProps {
  /** What to follow: a business or an individual member. */
  target: FollowTarget;
  /** Display name, used for the accessible label. */
  name?: string;
  size?: "sm" | "default";
  className?: string;
}

/**
 * X-style follow control. Solid pill when not following; outline "Following"
 * that turns into a red "Unfollow" on hover. State lives in the shared follow
 * query cache, so every button for the same target stays in sync.
 */
export function FollowButton({ target, name, size = "sm", className }: FollowButtonProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { following, toggle, isPending } = useFollow(target);

  const dims = size === "sm" ? "h-8 px-4 text-sm" : "h-9 px-5 text-sm";

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
          navigate(`/login?next=${encodeURIComponent(window.location.pathname)}`);
          return;
        }
        toggle();
      }}
      aria-pressed={following}
      aria-label={following ? `Unfollow ${name ?? "account"}` : `Follow ${name ?? "account"}`}
      className={cn(
        "group inline-flex shrink-0 items-center justify-center rounded-full font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60",
        dims,
        following
          ? "border border-input bg-transparent text-foreground hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
          : "bg-foreground text-background hover:bg-foreground/90",
        className,
      )}
    >
      {following ? (
        <>
          <span className="group-hover:hidden">Following</span>
          <span className="hidden group-hover:inline">Unfollow</span>
        </>
      ) : (
        "Follow"
      )}
    </button>
  );
}
