import { BadgeCheck } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SellerSignalsProps {
  // Existing field name retained for compatibility; the value is the business establishment year.
  memberSince?: number;
  verified?: boolean;
  compact?: boolean;
}

// Inline trust strip used on business and product cards.
export function SellerSignals({
  memberSince,
  verified = true,
  compact = false,
}: SellerSignalsProps) {
  const yearsActive = memberSince ? Math.max(0, new Date().getFullYear() - memberSince) : null;

  return (
    <div className={`inline-flex items-center gap-1.5 text-[10px] ${compact ? "" : "flex-wrap"}`}>
      {verified && (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center gap-0.5 font-semibold text-success">
              <BadgeCheck className="h-3 w-3" /> Business verified
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs text-xs">
              G-BAU-G has reviewed business-identity evidence. Verification does not guarantee stock,
              product quality, creditworthiness or fulfilment.
            </p>
          </TooltipContent>
        </Tooltip>
      )}
      {yearsActive !== null && yearsActive > 0 && (
        <span className="text-muted-foreground">· {yearsActive}y in business</span>
      )}
    </div>
  );
}

export default SellerSignals;
