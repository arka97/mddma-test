import { cn } from "@/lib/utils";
import logoMark from "@/assets/brand/MDDMA_logomark.svg";
import logoTypemark from "@/assets/brand/MDDMA_typemark_square.svg";
import logoHorizontal from "@/assets/brand/MDDMA_Royal_Heritage_Logo.svg";
import logoStacked from "@/assets/brand/MDDMA_Royal_Heritage_1to1.svg";

export type LogoVariant = "mark" | "stacked" | "horizontal" | "typemark";

interface LogoProps {
  /** Which artwork to render. Defaults to the compact crest. */
  variant?: LogoVariant;
  /** Legacy flag — kept so existing call sites compile. Visual is the same. */
  inverted?: boolean;
  /** Legacy flag — superseded by `variant`. */
  showWordmark?: boolean;
  className?: string;
}

const SRC: Record<LogoVariant, string> = {
  mark: logoMark,
  stacked: logoStacked,
  horizontal: logoHorizontal,
  typemark: logoTypemark,
};

const DEFAULT_SIZE: Record<LogoVariant, string> = {
  mark: "h-9 w-9",
  stacked: "h-20 w-auto",
  horizontal: "h-12 w-auto",
  typemark: "h-16 w-auto",
};

const ALT = "MDDMA — Mumbai Dryfruits and Dates Merchants Association";

/**
 * MDDMA brand mark — single source of truth.
 * Pick a `variant` based on the surface; uploaded SVG artwork is used for all.
 */
export function Logo({ variant = "mark", className }: LogoProps) {
  return (
    <img
      src={SRC[variant]}
      alt={ALT}
      className={cn(DEFAULT_SIZE[variant], "object-contain select-none", className)}
      draggable={false}
    />
  );
}

export default Logo;
