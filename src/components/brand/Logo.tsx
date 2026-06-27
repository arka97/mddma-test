import { cn } from "@/lib/utils";
import gbaugLogo from "@/assets/brand/gbaug-logo.png";

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

const DEFAULT_SIZE: Record<LogoVariant, string> = {
  mark: "h-9 w-9",
  stacked: "h-20 w-auto",
  horizontal: "h-12 w-auto",
  typemark: "h-16 w-auto",
};

const ALT = "GBAUG — by MDDMA";

/**
 * GBAUG brand mark — single source of truth.
 * GBAUG is the app brand by Mumbai Dryfruits & Dates Merchants Association (MDDMA).
 */
export function Logo({ variant = "mark", className }: LogoProps) {
  return (
    <img
      src={gbaugLogo}
      alt={ALT}
      className={cn(DEFAULT_SIZE[variant], "object-contain select-none", className)}
      draggable={false}
    />
  );
}

export default Logo;
