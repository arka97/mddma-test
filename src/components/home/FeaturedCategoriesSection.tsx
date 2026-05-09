import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { CommodityImage } from "@/components/commodity/CommodityImage";
import { useProducts } from "@/hooks/queries/useProducts";
import { useProductCategories } from "@/hooks/queries/useProductCategories";
import { CardSkeleton } from "@/components/ui/skeletons";
import { useMemo } from "react";

export function FeaturedCategoriesSection() {
  const { data: listings = [] } = useProducts();
  const { data: cats = [], isLoading } = useProductCategories({ activeOnly: true, featuredOnly: true });

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of listings) {
      const cat = (p.variant ?? "").trim();
      if (!cat) continue;
      map.set(cat, (map.get(cat) ?? 0) + 1);
    }
    return map;
  }, [listings]);

  const items = cats.slice(0, 6);

  return (
    <section className="bg-background py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="t-h2 text-foreground">Browse by category</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Top traded commodities across Mumbai's APMC market.
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center whitespace-nowrap text-sm font-medium text-accent hover:text-accent/80"
          >
            All categories <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border/70 bg-card p-10 text-center text-sm text-muted-foreground">
            Categories will appear here once an admin curates them.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {items.map((cat) => {
              const count = counts.get(cat.name) ?? 0;
              return (
                <Link key={cat.id} to={`/products?cat=${encodeURIComponent(cat.name)}`}>
                  <Card interactive className="h-full overflow-hidden">
                    {cat.image_url ? (
                      <div className="aspect-square w-full overflow-hidden bg-muted">
                        <img
                          src={cat.image_url}
                          alt={cat.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <CommodityImage commodity={cat.name} aspect="1/1" rounded={false} />
                    )}
                    <div className="p-3">
                      <h3 className="truncate text-sm font-semibold text-foreground">{cat.name}</h3>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {count} {count === 1 ? "listing" : "listings"}
                      </p>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
