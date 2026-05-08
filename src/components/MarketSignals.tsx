import { Badge } from "@/components/ui/badge";
import { type ProductListing } from "@/data/productListings";
import { Flame } from "lucide-react";

export function PriceRange({ listing }: { listing: ProductListing }) {
  if (listing.priceMin === null) {
    return <Badge className="bg-accent/20 text-accent border-accent/30 text-xs font-semibold">Request Price</Badge>;
  }
  return (
    <span className="font-semibold text-foreground text-sm">
      ₹{listing.priceMin.toLocaleString()} – ₹{listing.priceMax?.toLocaleString()} <span className="text-xs text-muted-foreground font-normal">{listing.priceUnit}</span>
    </span>
  );
}

export function DemandIndicator({ level }: { level: "high" | "medium" | "low" }) {
  const colors = { high: "text-red-600", medium: "text-yellow-600", low: "text-gray-500" };
  const labels = { high: "High Demand", medium: "Moderate", low: "Low Demand" };
  return (
    <span className={`text-xs font-medium ${colors[level]}`}>
      {level === "high" && <Flame className="h-3 w-3 inline mr-0.5" />}
      {labels[level]}
    </span>
  );
}
