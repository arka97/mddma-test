import { cn } from "@/lib/utils";

interface GoldDividerProps {
  compact?: boolean;
  className?: string;
}

/**
 * Heritage divider — gold hairline with a center dot, echoing the logo motif.
 * Use between major page sections for visual demarcation.
 */
export function GoldDivider({ compact, className }: GoldDividerProps) {
  return (
    <div className={cn("container mx-auto px-4 sm:px-6 lg:px-8", className)}>
      <div className={cn("flex items-center gap-3", compact ? "py-2" : "py-4")}>
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/40 to-gold/60" />
        <span className="h-1.5 w-1.5 rounded-full bg-gold" />
        <span className="h-px flex-1 bg-gradient-to-l from-transparent via-gold/40 to-gold/60" />
      </div>
    </div>
  );
}

export default GoldDivider;
