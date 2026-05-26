import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, MapPin, Sparkles } from "lucide-react";
import { useDirectory } from "@/hooks/queries/useCompanies";
import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedMembers() {
  const { data: entries = [], isLoading } = useDirectory();
  const featured = entries.filter((m) => m.isFeatured).slice(0, 2);

  return (
    <section>
      <div className="mb-3 flex items-end justify-between gap-2">
        <div>
          <h2 className="t-h3 text-foreground">Featured members</h2>
          <p className="text-xs text-muted-foreground">Verified traders across Mumbai's markets</p>
        </div>
        <Link to="/directory" className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-accent hover:text-accent/80">
          Directory <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid gap-3 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-2xl" />)}
        </div>
      ) : featured.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-xs text-muted-foreground">
          Member profiles will appear here as the directory grows.
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {featured.map((m) => (
            <Link
              key={m.id}
              to={`/store/${m.slug}`}
              className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
                  {m.logoPlaceholder}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h3 className="truncate text-sm font-semibold text-foreground">{m.firmName}</h3>
                    {m.isSponsored && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-[hsl(var(--gold))]/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[hsl(var(--gold-dark))]">
                        <Sparkles className="h-2.5 w-2.5" /> Sponsored
                      </span>
                    )}
                  </div>
                  {m.ownerName && <p className="truncate text-[11px] text-muted-foreground">{m.ownerName}</p>}
                  <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                    <MapPin className="h-2.5 w-2.5" /> {m.memberType} · {m.area}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {m.verificationStatus === "Verified" && (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold text-success">
                    <ShieldCheck className="h-2.5 w-2.5" /> {m.verificationLevel}
                  </span>
                )}
                {m.commodities.slice(0, 3).map((c) => (
                  <span key={c} className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{c}</span>
                ))}
              </div>

              <div className="mt-auto flex items-center justify-between border-t border-border pt-2 text-[11px]">
                <span className="text-muted-foreground">
                  Member since <span className="font-semibold text-foreground">{m.memberSince}</span>
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-accent group-hover:translate-x-0.5 transition-transform">
                  View store <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
