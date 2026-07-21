import { cn } from "@/lib/utils";
import { useFollow } from "@/hooks/useFollow";

interface FollowButtonProps {
  /** Stable entity id — company id or slug. */
  id: string;
  /** Display name, used for the accessible label. */
  name?: string;
  size?: "sm" | "default";
  className?: string;
}

/**
 * X-style follow control. Solid pill when not following; outline "Following"
 * that turns into a red "Unfollow" on hover. State lives in the client follow
 * store, so every button for the same id stays in sync.
 */
export function FollowButton({ id, name, size = "sm", className }: FollowButtonProps) {
  const { following, toggle } = useFollow(id);

  const dims = size === "sm" ? "h-8 px-4 text-sm" : "h-9 px-5 text-sm";

  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(); }}
      aria-pressed={following}
      aria-label={following ? `Unfollow ${name ?? "account"}` : `Follow ${name ?? "account"}`}
      className={cn(
        "group inline-flex shrink-0 items-center justify-center rounded-full font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
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
