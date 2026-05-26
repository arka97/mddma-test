import { Link } from "react-router-dom";
import { ArrowRight, Flame } from "lucide-react";
import { useMemo } from "react";
import { useProductCategories } from "@/hooks/queries/useProductCategories";
import { useProducts } from "@/hooks/queries/useProducts";
import { Skeleton } from "@/components/ui/skeleton";

const EMOJI_FALLBACK: Record<string, string> = {
  almond: "🌰", cashew: "🥜", date: "🌴", pistachio: "🌿",
  walnut: "🌰", raisin: "🍇", anjeer: "🟤", fig: "🟤", saffron: "🌺",
};
function emojiFor(name: string) {
  const k = name.toLowerCase();
  for (const [key, e] of Object.entries(EMOJI_FALLBACK)) if (k.includes(key)) return e;
  return "🌰";
}

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

  const items = useMemo(
    () => [...cats].sort((a, b) => Number(b.is_hot || b.is_featured) - Number(a.is_hot || a.is_featured)).slice(0, 6),
    [cats],
  );

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
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-xs text-muted-foreground">
          Categories will appear here once curated.
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {items.map((cat) => {
            const count = counts.get(cat.name) ?? 0;
            const hot = cat.is_hot || cat.is_featured;
            return (
              <Link
                key={cat.id}
                to={`/products?cat=${encodeURIComponent(cat.name)}`}
                className="group relative flex flex-col items-center gap-1 rounded-2xl border border-border bg-card p-3 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                {hot && (
                  <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-0.5 rounded bg-accent px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-accent-foreground">
                    <Flame className="h-2 w-2" /> {cat.is_hot ? "Hot" : "Featured"}
                  </span>
                )}
                <span className="text-3xl leading-none" aria-hidden>{cat.emoji || emojiFor(cat.name)}</span>
                <span className="mt-1 truncate text-[12px] font-semibold text-foreground">{cat.name}</span>
                <span className="text-[10px] tabular-nums text-muted-foreground">
                  {count} {count === 1 ? "listing" : "listings"}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
