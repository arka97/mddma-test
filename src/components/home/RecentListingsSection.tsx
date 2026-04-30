import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, MapPin, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CommodityImage } from "@/components/commodity/CommodityImage";
import { useAuth } from "@/contexts/AuthContext";

interface LiveListing {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  origin: string | null;
  price_min: number | null;
  price_max: number | null;
  unit: string | null;
  stock_band: string | null;
  trend_direction: string | null;
  inquiry_count: number;
  created_at: string;
  companies: { name: string; slug: string } | null;
}

export function RecentListingsSection() {
  const [live, setLive] = useState<LiveListing[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    let alive = true;
    supabase
      .from("products")
      .select("id,name,slug,category,origin,price_min,price_max,unit,stock_band,trend_direction,inquiry_count,created_at,companies(name,slug)")
      .eq("is_hidden", false)
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => { if (alive) setLive((data ?? []) as unknown as LiveListing[]); });
    return () => { alive = false; };
  }, []);

  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2">
              Recent Listings
            </h2>
            <p className="text-muted-foreground">
              Latest commodities from verified MDDMA sellers
            </p>
          </div>
          <Link to="/products?view=marketplace" className="inline-flex items-center text-accent hover:text-accent/80 font-medium text-sm whitespace-nowrap">
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {live.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground">No live listings yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {live.map((p) => {
              const sellerSlug = p.companies?.slug;
              return (
                <Link key={p.id} to={sellerSlug ? `/store/${sellerSlug}` : "/products"} className="group">
                  <Card className="bg-card border-border hover:border-accent/50 card-hover h-full overflow-hidden">
                    <CommodityImage commodity={p.name} aspect="16/10" rounded={false} />
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-foreground truncate">{p.name}</h3>
                          <p className="text-[11px] text-muted-foreground truncate">{p.category ?? "—"}</p>
                        </div>
                        {user ? (
                          <span className="text-xs text-foreground whitespace-nowrap">
                            {p.price_min && p.price_max
                              ? `₹${p.price_min}–${p.price_max}/${p.unit ?? "kg"}`
                              : "Price on request"}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-accent">
                            <Lock className="h-3 w-3" /> Sign in
                          </span>
                        )}
                      </div>
                      {p.companies && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-2 border-t border-border mt-2">
                          <MapPin className="h-3 w-3" /> {p.companies.name}
                        </div>
                      )}
                    </CardContent>
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
