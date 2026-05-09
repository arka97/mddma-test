import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ArrowRight, Loader2 } from "lucide-react";
import { CommodityImage } from "@/components/commodity/CommodityImage";
import { useProducts } from "@/hooks/queries/useProducts";
import { useProductCategories } from "@/hooks/queries/useProductCategories";
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

  const items = cats.slice(0, 7);

  return (
    <section className="py-16 sm:py-20 bg-surface">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
            Browse by Category
          </h2>
          <p className="text-muted-foreground">
            Discover products and find verified sellers across Mumbai&apos;s top traded categories
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-10">
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-accent" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground text-sm">
              Categories will appear here once an admin curates them.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            {items.map((cat) => {
              const count = counts.get(cat.name) ?? 0;
              return (
                <Link key={cat.id} to={`/products?cat=${encodeURIComponent(cat.name)}`}>
                  <Card className="bg-card border-border hover:border-accent/60 card-hover h-full overflow-hidden">
                    {cat.image_url ? (
                      <div className="aspect-square w-full overflow-hidden bg-muted">
                        <img src={cat.image_url} alt={cat.name} className="h-full w-full object-cover" loading="lazy" />
                      </div>
                    ) : (
                      <CommodityImage commodity={cat.name} aspect="1/1" rounded={false} />
                    )}
                    <div className="p-3 text-center">
                      <h3 className="font-semibold text-foreground text-sm">{cat.name}</h3>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {count} {count === 1 ? "listing" : "listings"}
                      </p>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        <div className="text-center mt-8">
          <Link to="/products" className="inline-flex items-center text-accent hover:text-accent/80 font-medium text-sm">
            View All Products <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
