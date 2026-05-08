import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { ProductMediaCarousel } from "@/components/commodity/ProductMediaCarousel";
import { GuardedPrice } from "@/components/commodity/GuardedPrice";
import type { ProductEntry } from "@/lib/dataSource";

interface Props {
  listings: ProductEntry[];
  limit?: number;
  onRequestQuote: (productName: string) => void;
}

export function RecentListings({ listings, limit = 8, onRequestQuote }: Props) {
  const items = [...listings]
    .sort((a, b) => (b.listingDate ?? "").localeCompare(a.listingDate ?? ""))
    .slice(0, limit);

  if (items.length === 0) return null;

  return (
    <section className="py-8 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary">Recent Listings</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Latest commodities posted across all categories
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((listing) => (
            <Card
              key={listing.id}
              className="bg-card border-border hover:border-accent/50 card-hover h-full overflow-hidden flex flex-col"
            >
              <div className="relative">
                <ProductMediaCarousel
                  commodity={listing.commodity}
                  alt={`${listing.commodity} ${listing.variant}`}
                  images={[listing.imageUrl, ...(listing.gallery ?? [])]}
                  videoUrl={listing.videoUrl}
                  aspect="16/10"
                  rounded={false}
                />
                {listing.origin && (
                  <div className="absolute top-2 left-2 z-10">
                    <Badge variant="outline" className="bg-background/95 text-[10px]">
                      {listing.origin}
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{listing.commodity}</h3>
                    <p className="text-xs text-muted-foreground truncate">{listing.variant}</p>
                  </div>
                  <GuardedPrice listing={listing} />
                </div>
                <div className="mt-auto pt-3 border-t border-border">
                  <Button
                    size="sm"
                    className="w-full bg-accent hover:bg-accent/90 text-primary font-semibold"
                    onClick={() => onRequestQuote(`${listing.commodity} — ${listing.variant}`)}
                  >
                    <Send className="h-3.5 w-3.5 mr-1.5" /> Request Quote
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
