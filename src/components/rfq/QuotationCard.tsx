import { Link } from "react-router-dom";
import { CalendarClock, FileLock2, MapPin, ShieldCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StartDealRoomButton } from "@/components/deals/StartDealRoomButton";
import type {
  QuotationCompanySummary,
  QuotationRfqSummary,
  RfqQuotationRow,
} from "@/repositories/rfqQuotations";

interface Props {
  quotation: RfqQuotationRow;
  rfq?: QuotationRfqSummary;
  counterparty?: QuotationCompanySummary;
  direction: "sent" | "received";
  onWithdraw?: () => void;
  withdrawing?: boolean;
}

const statusLabels: Record<RfqQuotationRow["status"], string> = {
  sent: "Sent",
  revised: "Revised",
  withdrawn: "Withdrawn",
  rejected: "Rejected",
  expired: "Expired",
};

export function QuotationCard({
  quotation,
  rfq,
  counterparty,
  direction,
  onWithdraw,
  withdrawing = false,
}: Props) {
  const canWithdraw =
    direction === "sent" &&
    (quotation.status === "sent" || quotation.status === "revised") &&
    new Date(quotation.valid_until).getTime() >= Date.now();

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={quotation.quote_kind === "formal" ? "primary" : "outline"}>
            {quotation.quote_kind === "formal" ? "Formal quotation" : "Indicative quotation"}
          </Badge>
          <Badge variant={quotation.status === "withdrawn" || quotation.status === "expired" ? "neutral" : "success"}>
            {statusLabels[quotation.status]}
          </Badge>
          <span className="ml-auto text-[11px] text-muted-foreground">
            {formatDistanceToNow(new Date(quotation.created_at), { addSuffix: true })}
          </span>
        </div>

        <div className="mt-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{rfq?.commodity ?? "RFQ quotation"}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {direction === "sent" ? "To" : "From"}: {counterparty?.name ?? "Participating business"}
              {counterparty?.country ? ` · ${counterparty.country}` : ""}
            </p>
          </div>
          {counterparty?.is_verified && <ShieldCheck className="h-5 w-5 shrink-0 text-success" aria-label="Business verified" />}
        </div>

        <div className="mt-4 grid gap-3 rounded-xl border border-border bg-muted/25 p-3 text-sm sm:grid-cols-2">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Quoted quantity</p>
            <p className="mt-0.5 font-mono tabular-nums text-foreground">
              {quotation.quantity_min.toLocaleString()}–{quotation.quantity_max.toLocaleString()} {quotation.quantity_unit}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Private price</p>
            <p className="mt-0.5 font-mono tabular-nums text-foreground">
              {quotation.currency} {quotation.price_min.toLocaleString()}–{quotation.price_max.toLocaleString()} {quotation.price_unit}
            </p>
          </div>
          {quotation.delivery_terms && (
            <div className="flex items-start gap-2 text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{quotation.delivery_terms}</span>
            </div>
          )}
          {quotation.payment_terms && (
            <div className="flex items-start gap-2 text-muted-foreground">
              <FileLock2 className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{quotation.payment_terms}</span>
            </div>
          )}
        </div>

        {quotation.notes && (
          <div className="mt-3 rounded-xl border border-border/70 p-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Private conditions</p>
            <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{quotation.notes}</p>
          </div>
        )}

        <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarClock className="h-3.5 w-3.5" /> Valid until {new Date(quotation.valid_until).toLocaleDateString()}
          {quotation.version > 1 ? ` · Version ${quotation.version}` : ""}
        </div>

        <div className="mt-4 grid gap-2 border-t border-border pt-4 sm:grid-cols-2">
          {counterparty && (
            <StartDealRoomButton
              counterpartyCompanyId={counterparty.id}
              subject={`Quotation discussion: ${rfq?.commodity ?? "RFQ"}`}
              contextType="quotation"
              quotationId={quotation.id}
              label="Open deal room"
              className="w-full"
            />
          )}
          {counterparty && (
            <Button variant="outline" asChild className="w-full">
              <Link to={`/directory/${counterparty.slug}`}>View business</Link>
            </Button>
          )}
          {canWithdraw && onWithdraw && (
            <Button variant="outline" className="w-full sm:col-span-2" onClick={onWithdraw} disabled={withdrawing}>
              Withdraw quotation
            </Button>
          )}
        </div>

        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
          G-BAU-G records this quotation and related discussion but provides no acceptance, purchase-order, payment, or fulfilment action.
        </p>
      </CardContent>
    </Card>
  );
}