import { BadgeCheck, Sparkles } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SellerSignalsProps {
  // memberSince year, e.g. 2018 — derived from seller record
  memberSince?: number;
  // total completed trades; placeholder for the Phase-C scoreboard
  tradesCompleted?: number;
  // optional: minutes-to-first-response SLA
  avgResponseMinutes?: number;
  verified?: boolean;
  compact?: boolean;
}

// Small inline trust strip used on listing cards + microsite hero.
// Phase A ships placeholder copy ("Establishing trade history") for new
// sellers; Phase C replaces tradesCompleted/avgResponseMinutes with
// real columns from the seller_trade_signals table.
export function SellerSignals({
  memberSince,
  tradesCompleted = 0,
  avgResponseMinutes,
  verified = true,
  compact = false,
}: SellerSignalsProps) {
  const yearsActive = memberSince ? Math.max(0, new Date().getFullYear() - memberSince) : null;
  const isNew = tradesCompleted < 1;

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
      {isNew ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center gap-0.5 text-muted-foreground">
              <Sparkles className="h-3 w-3" /> Establishing trade history
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs max-w-xs">Trade signals build from completed RFQs. New sellers show this pill until their first 5 trades are recorded.</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <span className="text-muted-foreground">· {tradesCompleted} trades</span>
      )}
      {avgResponseMinutes !== undefined && avgResponseMinutes > 0 && (
        <span className="text-muted-foreground">· responds in ~{avgResponseMinutes < 60 ? `${avgResponseMinutes}m` : `${Math.round(avgResponseMinutes / 60)}h`}</span>
      )}
    </div>
  );
}

export default SellerSignals;
