import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Activity,
  BadgeCheck,
  Clock,
  Handshake,
  Info,
  Repeat,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";
import {
  type TradeSignals,
  type KycChecklist,
  TRADE_HISTORY_THRESHOLD,
  approvedKycCount,
  formatResponseTime,
  isEstablishingHistory,
} from "@/lib/tradeSignals";
import { DOC_LABEL, type KycDocType } from "@/lib/kyc";

interface SellerScoreboardProps {
  signals: TradeSignals | null;
  kyc: KycChecklist;
  loading?: boolean;
}

const DOC_ORDER: KycDocType[] = ["gst", "pan", "fssai"];

function StatCell({
  label,
  value,
  hint,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex flex-col items-start p-3 rounded-md bg-muted/40 border border-border/60">
      <div className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
        {label}
        {hint && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3 w-3 text-muted-foreground/70 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-[220px]">{hint}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <div className="text-xl font-bold text-foreground mt-0.5">{value}</div>
    </div>
  );
}

export function TradeSignalsCard({ signals, loading }: { signals: TradeSignals | null; loading?: boolean }) {
  const establishing = isEstablishingHistory(signals);
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Activity className="h-4 w-4 text-accent" /> Trade signals
          {establishing && (
            <Badge variant="outline" className="text-[10px] font-normal">Establishing</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="grid grid-cols-2 gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-md bg-muted/40 animate-pulse" />
            ))}
          </div>
        ) : establishing ? (
          <div className="rounded-md border border-dashed border-border bg-muted/20 p-4 text-center">
            <Sparkles className="h-5 w-5 mx-auto text-accent mb-1.5" />
            <p className="text-sm font-medium text-foreground">Establishing trade history</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-[280px] mx-auto">
              Trade signals — completed deals, response time, repeat buyers — appear here once this
              seller crosses {TRADE_HISTORY_THRESHOLD} confirmed trades on MDDMA.
            </p>
            {signals && signals.rfqs_received > 0 && (
              <p className="text-[11px] text-muted-foreground mt-2">
                {signals.rfqs_received} RFQ{signals.rfqs_received === 1 ? "" : "s"} received so far
                {signals.trades_in_pipeline > 0 ? ` · ${signals.trades_in_pipeline} in pipeline` : ""}
              </p>
            )}
          </div>
        ) : signals ? (
          <div className="grid grid-cols-2 gap-2">
            <StatCell
              label="Trades completed"
              value={signals.trades_completed}
              hint="RFQs that closed as a confirmed deal."
            />
            <StatCell
              label="Avg response"
              value={formatResponseTime(signals.avg_response_minutes)}
              hint="Median time from RFQ received to first quote."
            />
            <StatCell
              label="Response rate"
              value={`${Math.round(signals.response_pct)}%`}
              hint="Share of RFQs answered (responded, negotiating, or converted)."
            />
            <StatCell
              label="Repeat buyers"
              value={signals.repeat_buyer_count}
              hint="Distinct buyers who sent more than one RFQ."
            />
            {signals.rejection_pct > 0 && (
              <div className="col-span-2 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground mt-1">
                <XCircle className="h-3 w-3 text-amber-600" />
                {Math.round(signals.rejection_pct)}% of RFQs closed without a deal
              </div>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function SellerScoreboard({ signals, kyc, loading }: SellerScoreboardProps) {
  const approvedCount = approvedKycCount(kyc);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <TradeSignalsCard signals={signals} loading={loading} />

      {/* KYC checklist tile */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-accent" /> KYC verified
            <Badge variant="outline" className="text-[10px] font-normal">{approvedCount}/4</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid grid-cols-2 gap-2">
            {DOC_ORDER.map((doc) => {
              const status = kyc[doc];
              const approved = status === "approved";
              const pending = status === "pending";
              const rejected = status === "rejected";
              return (
                <li
                  key={doc}
                  className={`flex items-center gap-2 p-2 rounded-md border text-sm ${
                    approved
                      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                      : pending
                      ? "border-amber-200 bg-amber-50 text-amber-900"
                      : rejected
                      ? "border-red-200 bg-red-50 text-red-900"
                      : "border-border bg-muted/30 text-muted-foreground"
                  }`}
                >
                  {approved ? (
                    <BadgeCheck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  ) : pending ? (
                    <Clock className="h-4 w-4 text-amber-600 flex-shrink-0" />
                  ) : rejected ? (
                    <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                  ) : (
                    <Handshake className="h-4 w-4 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="text-xs font-semibold leading-tight truncate">{DOC_LABEL[doc]}</div>
                    <div className="text-[10px] capitalize opacity-75">{status === "missing" ? "Not submitted" : status}</div>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="text-[11px] text-muted-foreground mt-3">
            Each document is reviewed by MDDMA admin before approval. Approved documents are stored privately
            and only revealed to the seller and verified buyers.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default SellerScoreboard;
