import { Link } from "react-router-dom";
import { ArrowRight, Flame } from "lucide-react";
import { useMemo } from "react";
import { useProductCategories } from "@/hooks/queries/useProductCategories";
import { useProducts } from "@/hooks/queries/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { CommodityImage } from "@/components/commodity/CommodityImage";

export function CategoryGrid({ heading = "Browse categories", subtitle = "Pick a category to explore listings" }: { heading?: string; subtitle?: string }) {
  const { data: cats = [], isLoading } = useProductCategories({ activeOnly: true });
  const { data: products = [] } = useProducts();

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of products) {
      const c = (p.variant ?? "").trim();
      if (!c) continue;
      map.set(c, (map.get(c) ?? 0) + 1);
    }
    return map;
  }, [products]);

  const { strip1, strip2 } = useMemo(() => {
    const featured: typeof cats = [];
    const rest: typeof cats = [];
    for (const c of cats) {
      if (c.is_hot || c.is_featured) featured.push(c);
      else rest.push(c);
    }
    return {
      strip1: [...featured.slice(0, 4), ...rest.slice(0, 12)],
      strip2: [...featured.slice(4, 8), ...rest.slice(12, 24)],
    };
  }, [cats]);

  const hasAny = strip1.length > 0;

  const cardWidth = "w-[calc((100%-36px)/4)] sm:w-32";

  const renderCard = (cat: typeof cats[number]) => {
    const count = counts.get(cat.name) ?? 0;
    const hot = cat.is_hot || cat.is_featured;
    return (
      <Link
        key={cat.id}
        to={`/products?cat=${encodeURIComponent(cat.name)}`}
        className={`group relative flex ${cardWidth} shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md`}
      >
        {hot && (
          <span className="absolute left-1.5 top-1.5 z-10 inline-flex items-center gap-0.5 rounded bg-accent px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-accent-foreground shadow">
            <Flame className="h-2 w-2" /> {cat.is_hot ? "Hot" : "Featured"}
          </span>
        )}
        {cat.image_url ? (
          <div className="aspect-square w-full overflow-hidden bg-muted">
            <img
              src={cat.image_url}
              alt={cat.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <CommodityImage commodity={cat.name} aspect="1/1" rounded={false} />
        )}
        <div className="px-2 py-2 text-center">
          <div className="truncate text-[12px] font-semibold text-foreground">{cat.name}</div>
          <div className="text-[10px] tabular-nums text-muted-foreground">
            {count} {count === 1 ? "listing" : "listings"}
          </div>
        </div>
      </Link>
    );
  };

  const scrollerClass =
    "-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [&::-webkit-scrollbar]:hidden";

  return (
    <section>
      <div className="mb-3 flex items-end justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-foreground">{heading}</h2>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <Link to="/products" className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-accent hover:text-accent/80">
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1].map((row) => (
            <div key={row} className={scrollerClass} style={{ scrollbarWidth: "none" }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className={`h-36 ${cardWidth} shrink-0 rounded-2xl`} />
              ))}
            </div>
          ))}
        </div>
      ) : !hasAny ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-xs text-muted-foreground">
          Categories will appear here once curated.
        </div>
      ) : (
        <div className="space-y-3">
          <div className={scrollerClass} style={{ scrollbarWidth: "none" }}>
            {strip1.map(renderCard)}
          </div>
          {strip2.length > 0 && (
            <div className={scrollerClass} style={{ scrollbarWidth: "none" }}>
              {strip2.map(renderCard)}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

