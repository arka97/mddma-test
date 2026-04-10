import { Badge } from "@/components/ui/badge";
import { type ProductListing, stockBandLabels, stockBandColors, trendLabels, trendColors } from "@/data/productListings";
import { TrendingUp, TrendingDown, Minus, Flame, AlertTriangle, Users } from "lucide-react";

interface MarketSignalsProps {
  listing: ProductListing;
  compact?: boolean;
}

export function StockBadge({ band }: { band: ProductListing["stockBand"] }) {
  return (
    <Badge variant="outline" className={`text-xs ${stockBandColors[band]}`}>
      {band === "low" && <AlertTriangle className="h-3 w-3 mr-0.5" />}
      {stockBandLabels[band]}
    </Badge>
  );
}

export function TrendBadge({ direction }: { direction: ProductListing["trendDirection"] }) {
  const Icon = direction === "rising" ? TrendingUp : direction === "falling" ? TrendingDown : Minus;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${trendColors[direction]}`}>
      <Icon className="h-3 w-3" /> {trendLabels[direction].label}
    </span>
  );
}

export function PriceRange({ listing }: { listing: ProductListing }) {
  if (listing.hidePrice || listing.priceMin === null) {
    return <Badge className="bg-accent/20 text-accent border-accent/30 text-xs font-semibold">Request Price</Badge>;
  }
  return (
    <div className="space-y-0.5">
      <span className="font-semibold text-foreground text-sm">
        ₹{listing.priceMin.toLocaleString()} – ₹{listing.priceMax?.toLocaleString()} <span className="text-xs text-muted-foreground font-normal">{listing.priceUnit}</span>
      </span>
      {listing.marketAvgPrice && (
        <div className="text-[10px] text-muted-foreground">
          Market Avg: ₹{listing.marketAvgPrice.toLocaleString()}
        </div>
      )}
    </div>
  );
}

export function MarketSignals({ listing, compact = false }: MarketSignalsProps) {
  return (
    <div className={`flex items-center gap-1.5 flex-wrap ${compact ? "" : "mt-1"}`}>
      <StockBadge band={listing.stockBand} />
      <TrendBadge direction={listing.trendDirection} />
      {listing.isFastMoving && (
        <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
          <Flame className="h-3 w-3 mr-0.5" /> Fast Moving
        </Badge>
      )}
      {!compact && listing.inquiryCount > 5 && (
        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
          <Users className="h-3 w-3" /> {listing.inquiryCount} inquiries
        </span>
      )}
    </div>
  );
}

export function DemandIndicator({ level }: { level: ProductListing["demandScore"] }) {
  const colors = { high: "text-red-600", medium: "text-yellow-600", low: "text-gray-500" };
  const labels = { high: "High Demand", medium: "Moderate", low: "Low Demand" };
  return (
    <span className={`text-xs font-medium ${colors[level]}`}>
      {level === "high" && <Flame className="h-3 w-3 inline mr-0.5" />}
      {labels[level]}
    </span>
  );
}
