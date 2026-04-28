import { BadgeCheck, Sparkles } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  type TradeSignals,
  TRADE_HISTORY_THRESHOLD,
  formatResponseTime,
  isEstablishingHistory,
} from "@/lib/tradeSignals";

interface SellerSignalsProps {
  // Year the seller joined MDDMA / first onboarded.
  memberSince?: number;
  verified?: boolean;
  compact?: boolean;
  // Live trade signals row from Phase-C schema. When null/undefined or
  // trades_completed below TRADE_HISTORY_THRESHOLD, the placeholder pill
  // ("Establishing trade history") is shown instead of raw zeros.
  signals?: TradeSignals | null;
}

// Inline trust strip used on listing + directory cards. Phase A introduced
// this with placeholder copy; Phase C lights it up with real numbers when a
// company has crossed the trade-history threshold.
export function SellerSignals({
  memberSince,
  verified = true,
  compact = false,
  signals,
}: SellerSignalsProps) {
  const yearsActive = memberSince ? Math.max(0, new Date().getFullYear() - memberSince) : null;
  const establishing = isEstablishingHistory(signals);
  const trades = signals?.trades_completed ?? 0;
  const respMin = signals?.avg_response_minutes ?? 0;

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
      {establishing ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center gap-0.5 text-muted-foreground">
              <Sparkles className="h-3 w-3" /> Establishing trade history
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs max-w-xs">
              Trade signals build from completed RFQs. Sellers below {TRADE_HISTORY_THRESHOLD} trades
              show this pill until the threshold is crossed.
            </p>
          </TooltipContent>
        </Tooltip>
      ) : (
        <>
          <span className="text-muted-foreground">· {trades} trades</span>
          {respMin > 0 && (
            <span className="text-muted-foreground">· responds in ~{formatResponseTime(respMin)}</span>
          )}
        </>
      )}
    </div>
  );
}

export default SellerSignals;
