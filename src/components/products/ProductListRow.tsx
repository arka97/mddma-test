import { Link } from "react-router-dom";
import { Lock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GuardedPrice } from "@/components/commodity/GuardedPrice";
import type { ProductListing } from "@/repositories/products";

interface Props {
  listing: ProductListing;
  href: string;
  /** When true, prices are blurred behind a sign-in lock. */
  signedIn?: boolean;
}

/**
 * Misumi-style compact list row for mobile catalog views.
 * Image on the left, title + meta + price on the right.
 * The whole row is one tap target — much easier for non-tech users
 * than a card with separate "Request quote" buttons.
 */
export function ProductListRow({ listing, href, signedIn = true }: Props) {
  const hero = listing.imageUrl || listing.gallery?.[0];
  return (
    <Link
      to={href}
      className="flex min-h-[88px] items-stretch gap-3 rounded-2xl border border-border bg-card p-3 transition-shadow hover:shadow-sm"
    >
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
        {hero ? (
          <img
            src={hero}
            alt={listing.commodity}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
            {listing.commodity}
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-base font-semibold text-foreground">
              {listing.commodity}
            </h3>
            {listing.isBranded && (
              <Badge variant="warning" className="shrink-0 text-[10px]">Branded</Badge>
            )}
          </div>
          <p className="truncate text-xs text-muted-foreground">
            {listing.isBranded && listing.retailPackSize ? listing.retailPackSize : listing.variant}
          </p>
        </div>
        <div className="mt-1 flex items-center justify-between gap-2 text-xs text-muted-foreground">
          {listing.origin ? (
            <span className="inline-flex items-center gap-1 truncate">
              <MapPin className="h-3 w-3 shrink-0" /> {listing.origin}
            </span>
          ) : <span />}
          {signedIn ? (
            <GuardedPrice listing={listing} />
          ) : (
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Lock className="h-3 w-3" /> Sign in
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
