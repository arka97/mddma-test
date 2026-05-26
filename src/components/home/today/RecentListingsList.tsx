import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";

interface Row {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  price_min: number | null;
  price_max: number | null;
  unit: string | null;
  image_url: string | null;
  companies: { name: string; slug: string; city: string | null } | null;
}

const EMOJI: Record<string, string> = {
  almond: "🌰", cashew: "🥜", date: "🌴", pistachio: "🌿",
  walnut: "🌰", raisin: "🍇", anjeer: "🟤", fig: "🟤",
};
function emojiFor(name: string) {
  const k = name.toLowerCase();
  for (const [key, e] of Object.entries(EMOJI)) if (k.includes(key)) return e;
  return "🌰";
}

export function RecentListingsList() {
  const { user } = useAuth();
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    let alive = true;
    supabase
      .from("products")
      .select("id,name,slug,category,price_min,price_max,unit,image_url,companies(name,slug,city)")
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
          <h2 className="t-h3 text-foreground">Recent listings</h2>
          <p className="text-xs text-muted-foreground">Latest commodities from verified sellers</p>
        </div>
        <Link to="/products?view=marketplace" className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-accent hover:text-accent/80">
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {rows === null ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-xs text-muted-foreground">
          No live listings yet. Check back soon.
        </div>
      ) : (
        <ul className="space-y-2">
          {rows.map((r) => {
            const sellerSlug = r.companies?.slug;
            const href = sellerSlug ? `/store/${sellerSlug}` : "/products";
            return (
              <li key={r.id}>
                <Link
                  to={href}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted text-2xl">
                    {r.image_url ? (
                      <img src={r.image_url} alt="" className="h-full w-full rounded-xl object-cover" loading="lazy" />
                    ) : (
                      <span aria-hidden>{emojiFor(r.name)}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-foreground">{r.name}</p>
                      {user ? (
                        <span className="shrink-0 font-mono text-xs tabular-nums text-foreground">
                          {r.price_min && r.price_max ? `₹${r.price_min}–${r.price_max}/${r.unit ?? "kg"}` : "On request"}
                        </span>
                      ) : (
                        <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-muted-foreground">
                          <Lock className="h-3 w-3" /> Sign in
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                      {r.category ?? "—"}
                      {r.companies && (
                        <>
                          <span className="mx-1">·</span>
                          <span className="inline-flex items-center gap-0.5"><MapPin className="h-2.5 w-2.5" />{r.companies.name}{r.companies.city ? `, ${r.companies.city}` : ""}</span>
                        </>
                      )}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
