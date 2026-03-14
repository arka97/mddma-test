import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin } from "lucide-react";
import { productListings } from "@/data/productListings";
import { sampleMembers } from "@/data/sampleData";

export function RecentListingsSection() {
  const recentListings = productListings
    .sort((a, b) => new Date(b.listingDate).getTime() - new Date(a.listingDate).getTime())
    .slice(0, 6);

  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2">
              Recent Listings
            </h2>
            <p className="text-muted-foreground">
              Latest commodity listings from verified MDDMA members
            </p>
          </div>
          <Link to="/products" className="inline-flex items-center text-accent hover:text-accent/80 font-medium text-sm whitespace-nowrap">
            View Marketplace <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recentListings.map((listing) => {
            const seller = sampleMembers.find((m) => m.id === listing.sellerId);
            return (
              <Link key={listing.id} to={seller ? `/store/${seller.slug}` : "/products"}>
                <Card className="bg-card border-border hover:border-accent/50 card-hover h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground">{listing.commodity}</h3>
                        <p className="text-xs text-muted-foreground">{listing.variant}</p>
                      </div>
                      {listing.hidePrice || listing.price === null ? (
                        <Badge variant="secondary" className="text-xs">RFQ</Badge>
                      ) : (
                        <span className="text-sm font-bold text-accent">{listing.price.toLocaleString()} {listing.priceUnit}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Badge variant="outline" className="text-xs">{listing.origin}</Badge>
                      <span>MOQ: {listing.moq}</span>
                    </div>
                    {seller && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-2 border-t border-border">
                        <MapPin className="h-3 w-3" /> {seller.firmName} · {listing.location}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
