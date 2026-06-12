import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Loader2, Star } from "lucide-react";
import { CommodityImage } from "@/components/commodity/CommodityImage";
import { useProductCategories } from "@/hooks/queries/useProductCategories";
import type { ProductEntry } from "@/lib/dataSource";

interface Props {
  listings: ProductEntry[];
}

export function CategoryGrid({ listings }: Props) {
  const { data: cats = [], isLoading } = useProductCategories({ activeOnly: true });

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of listings) {
      const cat = (p.variant ?? "").trim();
      if (!cat) continue;
      map.set(cat, (map.get(cat) ?? 0) + 1);
    }
    return map;
  }, [listings]);

  const filtered = useMemo(
    () => [...cats].sort((a, b) => Number(b.is_featured) - Number(a.is_featured)),
    [cats],
  );

  return (
    <section className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary">Browse Categories</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Pick a category to explore its listings
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-10">
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-accent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground text-sm">No categories yet.</p>
          </div>

        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {filtered.map((cat) => {
              const count = counts.get(cat.name) ?? 0;
              return (
                <Link key={cat.id} to={`/products?cat=${encodeURIComponent(cat.name)}`}>
                  <Card className="bg-card border-border hover:border-accent/60 card-hover h-full overflow-hidden relative">
                    {cat.is_featured && (
                      <span className="absolute top-2 right-2 z-10 inline-flex items-center gap-1 text-[10px] font-medium bg-accent text-accent-foreground px-1.5 py-0.5 rounded">
                        <Star className="h-2.5 w-2.5" /> Featured
                      </span>
                    )}
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
                    <div className="p-2 text-center">
                      <h3 className="font-semibold text-foreground text-xs truncate">{cat.name}</h3>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
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
