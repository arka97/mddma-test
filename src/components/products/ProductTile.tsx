import { Link } from "react-router-dom";
import { ExternalLink, MessageCircle, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CommodityImage } from "@/components/commodity/CommodityImage";
import { GuardedPrice } from "@/components/commodity/GuardedPrice";
import type { ProductEntry } from "@/lib/dataSource";

interface Props {
  listing: ProductEntry;
  /** Hide the seller subline (use on storefront where seller is implied) */
  hideSeller?: boolean;
}

/**
 * Dense, image-forward product tile. Inspired by quick-commerce grids
 * (District/Zepto) and adapted to our B2B masking model:
 *   - No exact stock / "X left" scarcity
 *   - Price masked via GuardedPrice (range or sign-in CTA)
 *   - CTA opens the detail page where WhatsApp deeplink lives
 *   - Branded SKUs route to external retail
 */
export function ProductTile({ listing, hideSeller }: Props) {
  const detailHref = `/products/${listing.slug}`;
  const galleryCount =
    (listing.imageUrl ? 1 : 0) + (listing.gallery?.filter(Boolean).length ?? 0);

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border/60 bg-card shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-px hover:border-accent/60 hover:shadow-md">
      {/* Image area */}
      <Link to={detailHref} className="relative block bg-muted">
        <div className="aspect-square w-full overflow-hidden">
          {listing.imageUrl ? (
            <img
              src={listing.imageUrl}
              alt={`${listing.commodity}${listing.variant ? ` — ${listing.variant}` : ""}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <CommodityImage commodity={listing.commodity} aspect="1/1" rounded={false} />
          )}
        </div>

        {/* Origin chip — top-left */}
        {listing.origin && (
          <Badge
            variant="outline"
            className="absolute left-1.5 top-1.5 z-10 bg-background/90 px-1.5 py-0.5 text-[10px] font-medium backdrop-blur sm:left-2 sm:top-2"
          >
            {listing.origin}
          </Badge>
        )}

        {/* Featured ★ — top-right */}
        {listing.isFeatured && (
          <span className="absolute right-1.5 top-1.5 z-10 inline-flex items-center gap-0.5 rounded bg-accent px-1 py-0.5 text-[8px] font-bold uppercase tracking-wide text-accent-foreground shadow sm:right-2 sm:top-2 sm:px-1.5 sm:text-[10px]">
            <Star className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
            <span className="hidden sm:inline">Featured</span>
          </span>
        )}

        {/* Branded ribbon (bottom-left) */}
        {listing.isBranded && (
          <Badge
            variant="warning"
            className="absolute bottom-1.5 left-1.5 z-10 px-1.5 py-0.5 text-[9px] sm:bottom-2 sm:left-2 sm:text-[10px]"
          >
            Branded
          </Badge>
        )}

        {/* Gallery dot count (bottom-right) */}
        {galleryCount > 1 && (
          <span className="absolute bottom-1.5 right-1.5 z-10 rounded-full bg-background/85 px-1.5 py-0.5 text-[9px] font-medium text-foreground backdrop-blur sm:bottom-2 sm:right-2 sm:text-[10px]">
            +{galleryCount - 1}
          </span>
        )}
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-1.5 p-2.5 sm:p-3">
        {/* Price first — anchors the eye like the reference */}
        <div className="min-h-[1.25rem] text-[13px] leading-tight sm:text-sm">
          {listing.isBranded && listing.retailPackSize ? (
            <span className="font-medium text-foreground">{listing.retailPackSize}</span>
          ) : (
            <GuardedPrice listing={listing} />
          )}
        </div>

        <Link to={detailHref} className="min-w-0">
          <h3 className="truncate text-sm font-semibold leading-tight text-foreground group-hover:text-accent sm:text-[15px]">
            {listing.commodity}
          </h3>
          <p className="truncate text-[11px] text-muted-foreground sm:text-xs">
            {[listing.variant, !hideSeller && listing.sellerName].filter(Boolean).join(" · ") || "—"}
          </p>
        </Link>

        {/* CTA */}
        <div className="mt-1.5 pt-1.5 border-t border-border/60">
          {listing.isBranded && listing.b2cUrl ? (
            <Button size="sm" className="w-full h-8 text-xs" asChild>
              <a href={listing.b2cUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" /> Buy retail
              </a>
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="w-full h-8 text-xs border-accent/40 text-accent hover:bg-accent hover:text-accent-foreground"
              asChild
            >
              <Link to={detailHref}>
                <MessageCircle className="h-3 w-3 mr-1" /> Enquire
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
