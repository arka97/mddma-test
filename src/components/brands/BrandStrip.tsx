import { Link } from "react-router-dom";
import type { BrandRow } from "@/repositories/brands";

export function BrandStrip({ brands, title = "Our Brands" }: { brands: BrandRow[]; title?: string }) {
  if (!brands.length) return null;
  return (
    <section className="py-6">
      <div className="flex items-end justify-between mb-3">
        <h2 className="t-h3 text-foreground">{title}</h2>
        <Link to="/brands" className="text-xs text-accent hover:underline">Explore all brands →</Link>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
        {brands.map((b) => (
          <Link
            key={b.id}
            to={`/brands/${b.slug}`}
            className="snap-start flex-shrink-0 w-44 rounded-lg border border-border bg-card hover:border-accent/50 transition-colors overflow-hidden"
          >
            <div className="h-24 bg-muted flex items-center justify-center">
              {b.logo_url ? (
                <img src={b.logo_url} alt={b.name} className="h-16 max-w-[80%] object-contain" loading="lazy" />
              ) : (
                <span className="text-sm font-semibold text-muted-foreground">{b.name}</span>
              )}
            </div>
            <div className="p-2 border-t border-border">
              <div className="text-sm font-medium text-foreground truncate">{b.name}</div>
              {b.tagline && <div className="text-[11px] text-muted-foreground truncate">{b.tagline}</div>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
