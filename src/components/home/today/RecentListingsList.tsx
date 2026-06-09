import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ListingRow } from "@/components/products/ListingRow";

interface Row {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  origin: string | null;
  price_min: number | null;
  price_max: number | null;
  unit: string | null;
  image_url: string | null;
  companies: { id: string; name: string; slug: string } | null;
}

export function RecentListingsList() {
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    let alive = true;
    supabase
      .from("products")
      .select("id,name,slug,category,origin,price_min,price_max,unit,image_url,companies(id,name,slug)")
      .eq("is_hidden", false)
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => { if (alive) setRows((data ?? []) as unknown as Row[]); });
    return () => { alive = false; };
  }, []);

  return (
    <section>
      <div className="mb-3 flex items-end justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-foreground">Recent listings</h2>
          <p className="text-xs text-muted-foreground">Latest commodities from verified sellers</p>
        </div>
        <Link to="/products" className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-accent hover:text-accent/80">
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {rows === null ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-xs text-muted-foreground">
          No live listings yet. Check back soon.
        </div>
      ) : (
        <ul className="space-y-2">
          {rows.map((r) => (
            <li key={r.id}>
              <ListingRow
                href={`/products/${r.slug}`}
                name={r.name}
                meta={[r.category, r.companies?.name].filter(Boolean).join(" · ")}
                origin={r.origin}
                imageUrl={r.image_url}
                priceMin={r.price_min}
                priceMax={r.price_max}
                unit={r.unit}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
