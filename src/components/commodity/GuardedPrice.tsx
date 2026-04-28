import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { PriceRange } from "@/components/MarketSignals";
import type { ProductListing } from "@/data/productListings";

interface GuardedPriceProps {
  listing: ProductListing;
  // forces price-on-request copy regardless of auth (used for sensitive lots)
  hidePrice?: boolean;
}

// B2B Indian norm = "POA / call for price" until trust is established.
// Guests see a single Sign-in CTA instead of fuzzy numbers.
export function GuardedPrice({ listing }: GuardedPriceProps) {
  const { user } = useAuth();
  if (!user) {
    return (
      <Link
        to="/login"
        className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-accent/80"
      >
        <Lock className="h-3 w-3" />
        Sign in for price
      </Link>
    );
  }
  return <PriceRange listing={listing} />;
}

export function GuardedPublicPriceLine({ listing }: GuardedPriceProps) {
  const { user } = useAuth();
  if (!user) {
    return (
      <Link
        to="/login"
        className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-accent/80"
      >
        <Lock className="h-3 w-3" />
        Sign in for price
      </Link>
    );
  }
  if (listing.priceMin === null) {
    return <span className="text-xs text-muted-foreground">Price on request</span>;
  }
  return (
    <span className="text-sm font-semibold text-foreground">
      ₹{listing.priceMin.toLocaleString()}–{listing.priceMax?.toLocaleString()}
      <span className="ml-1 text-xs font-normal text-muted-foreground">{listing.priceUnit}</span>
    </span>
  );
}

export default GuardedPrice;
