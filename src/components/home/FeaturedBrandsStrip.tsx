import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useBrands } from "@/hooks/queries/useBrands";

export function FeaturedBrandsStrip() {
  const { data: brands = [] } = useBrands({ featuredOnly: true });
  if (!brands.length) return null;

  return (
    <section className="border-y border-border bg-muted/30 py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="t-eyebrow text-accent flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Featured Brands
            </p>
            <h2 className="t-h2 text-foreground mt-1">House brands by MDDMA members</h2>
          </div>
          <Link to="/brands" className="text-sm text-accent hover:underline whitespace-nowrap">View all →</Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x -mx-2 px-2">
          {brands.map((b) => (
            <Link
              key={b.id}
              to={`/brands/${b.slug}`}
              className="snap-start flex-shrink-0 w-48 sm:w-56 rounded-xl border border-border bg-card hover:border-accent/60 hover:shadow-md transition overflow-hidden"
            >
              <div className="h-28 bg-gradient-to-br from-primary/5 to-accent/10 flex items-center justify-center p-4">
                {b.logo_url ? (
                  <img src={b.logo_url} alt={b.name} className="h-full max-w-full object-contain" loading="lazy" />
                ) : (
                  <span className="text-base font-semibold text-foreground">{b.name}</span>
                )}
              </div>
              <div className="p-3 border-t border-border">
                <div className="font-medium text-foreground truncate">{b.name}</div>
                {b.tagline && <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{b.tagline}</div>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
