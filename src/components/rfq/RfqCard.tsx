import { Link } from "react-router-dom";
import { Clock, FileLock2, MapPin, Package, ShieldCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StartDealRoomButton } from "@/components/deals/StartDealRoomButton";
import { cn } from "@/lib/utils";
import type { RfqCompanySummary, RfqListingRow } from "@/repositories/rfqListings";

interface Props {
  rfq: RfqListingRow;
  company?: RfqCompanySummary;
  canQuote: boolean;
  isOwn: boolean;
  onQuote: () => void;
}

export function RfqCard({ rfq, company, canQuote, isOwn, onQuote }: Props) {
  const daysLeft = Math.ceil((new Date(rfq.valid_until).getTime() - Date.now()) / 86400_000);
  const expiringSoon = daysLeft <= 3;
  const priceLabel = `${rfq.currency || "INR"} ${rfq.price_min.toLocaleString()}–${rfq.price_max.toLocaleString()} ${rfq.price_unit}`;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge
            className={cn(
              rfq.listing_type === "buy"
                ? "bg-primary text-primary-foreground"
                : "bg-accent text-accent-foreground",
            )}
          >
            {rfq.listing_type === "buy" ? "BUY REQUIREMENT" : "SUPPLY AVAILABLE"}
          </Badge>
          {company?.is_verified && (
            <Badge variant="success" className="gap-1 text-[10px]">
              <ShieldCheck className="h-3 w-3" /> Business verified
            </Badge>
          )}
          {isOwn && <Badge variant="outline">Your RFQ</Badge>}
          <span className="ml-auto text-[11px] text-muted-foreground">
            {formatDistanceToNow(new Date(rfq.created_at), { addSuffix: true })}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-foreground">{rfq.commodity}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {company?.name ?? "Verified network business"}
          {company?.country ? ` · ${company.country}` : ""}
        </p>

        {(rfq.grade_variety || rfq.origin_country) && (
          <p className="mt-2 text-xs text-muted-foreground">
            {[rfq.grade_variety, rfq.origin_country].filter(Boolean).join(" · ")}
          </p>
        )}

        <div className="mt-4 grid gap-3 rounded-xl border border-border/70 bg-muted/25 p-3 text-sm sm:grid-cols-2">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Quantity</p>
            <p className="mt-0.5 font-mono tabular-nums text-foreground">
              {rfq.quantity_min.toLocaleString()}–{rfq.quantity_max.toLocaleString()} {rfq.quantity_unit}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Indicative range</p>
            <p className="mt-0.5 font-mono tabular-nums text-foreground">{priceLabel}</p>
          </div>
          {rfq.packaging && (
            <div className="flex items-start gap-2 text-muted-foreground">
              <Package className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{rfq.packaging}</span>
            </div>
          )}
          {rfq.delivery_location && (
            <div className="flex items-start gap-2 text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{rfq.delivery_location}</span>
            </div>
          )}
        </div>

        {rfq.notes && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{rfq.notes}</p>}

        <div
          className={cn(
            "mt-3 inline-flex items-center gap-1 text-xs",
            expiringSoon ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground",
          )}
        >
          <Clock className="h-3.5 w-3.5" />
          {daysLeft <= 0 ? "Closes today" : `Closes in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`}
        </div>

        <div className="mt-4 grid gap-2 border-t border-border/60 pt-4 sm:grid-cols-2">
          {company && !isOwn && (
            <StartDealRoomButton
              counterpartyCompanyId={company.id}
              subject={`RFQ discussion: ${rfq.commodity}`}
              contextType="rfq"
              rfqId={rfq.id}
              label="Discuss RFQ privately"
              variant="outline"
              className="w-full"
            />
          )}
          {company && (
            <Button asChild variant="outline" className="w-full">
              <Link to={`/directory/${company.slug}`}>View business</Link>
            </Button>
          )}
          {!isOwn && (
            <Button className="w-full sm:col-span-2" onClick={onQuote} disabled={!canQuote}>
              <FileLock2 className="mr-2 h-4 w-4" />
              {canQuote ? "Send private quotation" : "Verification required"}
            </Button>
          )}
        </div>

        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
          The RFQ range is indicative. Use the deal room for discussion and the quotation record for exact price, payment, and delivery terms.
        </p>
      </CardContent>
    </Card>
  );
}