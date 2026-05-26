import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import { useMemo } from "react";
import { useProductCategories } from "@/hooks/queries/useProductCategories";
import { useProducts } from "@/hooks/queries/useProducts";
import { Skeleton } from "@/components/ui/skeleton";

const EMOJI: Record<string, string> = {
  almonds: "🌰",
  cashews: "🥜",
  pistachios: "🌿",
  pistachio: "🌿",
  dates: "🌴",
  walnuts: "🌰",
  raisins: "🍇",
  anjeer: "🟤",
  figs: "🟤",
};

function emojiFor(name: string) {
  const k = name.trim().toLowerCase();
  if (EMOJI[k]) return EMOJI[k];
  for (const [key, e] of Object.entries(EMOJI)) if (k.includes(key)) return e;
  return "🌰";
}

export function CategoryGrid() {
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
    () => [...cats].sort((a, b) => Number(b.is_featured) - Number(a.is_featured)).slice(0, 6),
    [cats],
  );

  return (
    <section>
      <div className="mb-3 flex items-end justify-between gap-2">
        <div>
          <h2 className="t-h3 text-foreground">Browse categories</h2>
          <p className="text-xs text-muted-foreground">Pick a category to explore listings</p>
        </div>
        <Link to="/products" className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-accent hover:text-accent/80">
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-xs text-muted-foreground">
          Categories will appear here once curated.
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {items.map((cat) => {
            const count = counts.get(cat.name) ?? 0;
            return (
              <Link
                key={cat.id}
                to={`/products?cat=${encodeURIComponent(cat.name)}`}
                className="group relative flex flex-col items-center gap-1 rounded-2xl border border-border bg-card p-3 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                {cat.is_featured && (
                  <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-0.5 rounded bg-accent px-1 py-0.5 text-[8px] font-bold uppercase tracking-wide text-accent-foreground">
                    <Star className="h-2 w-2" /> Hot
                  </span>
                )}
                <span className="text-2xl leading-none" aria-hidden>{emojiFor(cat.name)}</span>
                <span className="truncate text-[12px] font-semibold text-foreground">{cat.name}</span>
                <span className="text-[10px] text-muted-foreground">
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
