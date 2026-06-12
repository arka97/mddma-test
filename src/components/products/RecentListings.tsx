import { ProductTile } from "@/components/products/ProductTile";
import type { ProductEntry } from "@/lib/dataSource";

interface Props {
  listings: ProductEntry[];
  limit?: number;
}

export function RecentListings({ listings, limit = 8 }: Props) {
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

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {items.map((listing) => (
            <ProductTile key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </section>
  );
}
