import { cn } from "@/lib/utils";

interface LogoProps {
  /** Render with a transparent background (for dark surfaces like the navy header). */
  inverted?: boolean;
  /** Show the full wordmark + tagline, not just the M-mark. */
  showWordmark?: boolean;
  className?: string;
}

/**
 * MDDMA wordmark — locked Week-1.
 * Palette: navy (--primary) + gold (--accent) + cream (--primary-foreground).
 * Single source of truth for the brand mark across the app.
 */
export function Logo({ inverted = false, showWordmark = true, className }: LogoProps) {
  const markBg = inverted ? "bg-accent text-primary" : "bg-primary text-accent";
  const wordTone = inverted ? "text-primary-foreground" : "text-primary";
  const taglineTone = inverted ? "text-primary-foreground/60" : "text-muted-foreground";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-full font-bold text-sm shadow-sm ring-1 ring-accent/40",
          markBg,
        )}
        aria-hidden
      >
        M
      </div>
      {showWordmark && (
        <div className="hidden sm:block leading-tight">
          <div className={cn("font-bold text-sm tracking-wide", wordTone)}>MDDMA</div>
          <div className={cn("text-[10px]", taglineTone)}>Est. 1930 · Digital Trade Hub</div>
        </div>
      )}
    </div>
  );
}

export default Logo;
