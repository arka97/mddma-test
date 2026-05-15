import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin, Lock, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useDirectory } from "@/hooks/queries/useCompanies";
import { CardSkeleton } from "@/components/ui/skeletons";

interface LiveListing {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  origin: string | null;
  price_min: number | null;
  price_max: number | null;
  unit: string | null;
  image_url: string | null;
  companies: { name: string; slug: string } | null;
}

function ListingCard({ p, signedIn }: { p: LiveListing; signedIn: boolean }) {
  const sellerSlug = p.companies?.slug;
  return (
    <Link to={sellerSlug ? `/store/${sellerSlug}` : "/products"} className="group">
      <Card interactive className="h-full overflow-hidden">
        <div className="aspect-[16/10] overflow-hidden bg-muted">
          {p.image_url ? (
            <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
              {p.name}
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-foreground">{p.name}</h3>
              <p className="truncate text-[11px] text-muted-foreground">{p.category ?? "—"}</p>
            </div>
            {signedIn ? (
              <span className="whitespace-nowrap font-mono text-xs tabular-nums text-foreground">
                {p.price_min && p.price_max
                  ? `₹${p.price_min}–${p.price_max}/${p.unit ?? "kg"}`
                  : "On request"}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <Lock className="h-3 w-3" /> Sign in
              </span>
            )}
          </div>
          {p.companies && (
            <div className="mt-2 flex items-center gap-1.5 border-t border-border/60 pt-2 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" /> {p.companies.name}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export function MarketplacePulse() {
  const [live, setLive] = useState<LiveListing[] | null>(null);
  const { user } = useAuth();
  const { data: entries = [], isLoading: dirLoading } = useDirectory();

  useEffect(() => {
    let alive = true;
    supabase
      .from("products")
      .select("id,name,slug,category,origin,price_min,price_max,unit,image_url,companies(name,slug)")
      .eq("is_hidden", false)
      .order("created_at", { ascending: false })
      .limit(4)
      .then(({ data }) => {
        if (alive) setLive((data ?? []) as unknown as LiveListing[]);
      });
    return () => {
      alive = false;
    };
  }, []);

  const featuredMembers = entries.filter((m) => m.isFeatured).slice(0, 4);

  return (
    <section className="border-y border-border bg-muted/40 py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Recent Listings */}
          <div>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
              <div className="min-w-0">
                <h2 className="t-h2 text-foreground">Recent listings</h2>
                <p className="text-sm text-muted-foreground">Latest commodities from verified sellers</p>
              </div>
              <Link
                to="/products?view=marketplace"
                className="inline-flex shrink-0 items-center whitespace-nowrap text-sm font-medium text-accent hover:text-accent/80"
              >
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            {live === null ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : live.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border/70 bg-card p-8 text-center text-sm text-muted-foreground">
                No live listings yet. Check back soon.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {live.map((p) => (
                  <ListingCard key={p.id} p={p} signedIn={Boolean(user)} />
                ))}
              </div>
            )}
          </div>

          {/* Featured Members */}
          <div>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
              <div className="min-w-0">
                <h2 className="t-h2 text-foreground">Featured members</h2>
                <p className="text-sm text-muted-foreground">Verified traders across Mumbai's markets</p>
              </div>
              <Link
                to="/directory"
                className="inline-flex shrink-0 items-center whitespace-nowrap text-sm font-medium text-accent hover:text-accent/80"
              >
                Directory <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            {dirLoading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : featuredMembers.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border/70 bg-card p-8 text-center text-sm text-muted-foreground">
                Member profiles will appear here as the directory grows.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {featuredMembers.map((member) => (
                  <Link key={member.id} to={`/store/${member.slug}`}>
                    <Card interactive className="h-full">
                      <CardContent className="p-4">
                        <div className="mb-2 flex items-start gap-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
                            {member.logoPlaceholder}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <h3 className="truncate text-sm font-semibold text-foreground">
                                {member.firmName}
                              </h3>
                              {member.isSponsored && (
                                <Badge variant="success" className="h-4 px-1.5 text-[9px] uppercase">
                                  Sponsored
                                </Badge>
                              )}
                            </div>
                            <p className="truncate text-xs text-muted-foreground">
                              {member.memberType} · {member.area}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {member.verificationStatus === "Verified" && (
                            <Badge variant="success" className="gap-0.5 text-[10px]">
                              <ShieldCheck className="h-3 w-3" /> {member.verificationLevel}
                            </Badge>
                          )}
                          {member.commodities.slice(0, 2).map((c) => (
                            <Badge key={c} variant="neutral" className="text-[10px]">
                              {c}
                            </Badge>
                          ))}
                          {member.commodities.length > 2 && (
                            <Badge variant="neutral" className="text-[10px]">
                              +{member.commodities.length - 2}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
