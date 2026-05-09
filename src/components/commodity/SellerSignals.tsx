import { BadgeCheck } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SellerSignalsProps {
  // Year the seller joined MDDMA / first onboarded.
  memberSince?: number;
  verified?: boolean;
  compact?: boolean;
}

// Inline trust strip used on listing + directory cards.
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
            <span className="inline-flex items-center gap-0.5 font-semibold text-emerald-700">
              <BadgeCheck className="h-3 w-3" /> Verified
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs max-w-xs">KYC-verified by MDDMA admin (GST · PAN · FSSAI · Bank).</p>
          </TooltipContent>
        </Tooltip>
      )}
      {yearsActive !== null && yearsActive > 0 && (
        <span className="text-muted-foreground">· {yearsActive}y on MDDMA</span>
      )}
    </div>
  );
}

export default SellerSignals;
