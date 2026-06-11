import { Link } from "react-router-dom";
import { ArrowRight, Newspaper, ExternalLink } from "lucide-react";
import { useMarketNews } from "@/hooks/queries/useMarketNews";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export function MarketNewsSection() {
  const { data: news, isLoading } = useMarketNews();
  const items = (news ?? []).slice(0, 4);

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <header className="mb-3 flex items-end justify-between gap-2">
        <div>
          <p className="t-eyebrow inline-flex items-center gap-1.5 text-accent">
            <Newspaper className="h-3.5 w-3.5" /> Market News
          </p>
          <h2 className="t-h3 mt-1 text-foreground">Latest from the trade</h2>
        </div>
        <Link to="/market-news" className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-accent hover:text-accent/80">
          All news <ArrowRight className="h-3 w-3" />
        </Link>
      </header>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-md" />)}
        </div>
      ) : items.length === 0 ? (
        <p className="py-6 text-center text-xs text-muted-foreground">No market news published yet.</p>
      ) : (
        <ul className="divide-y divide-border/60">
          {items.map((n) => {
            const inner = (
              <>
                {n.image_url && (
                  <img src={n.image_url} alt="" className="h-14 w-14 shrink-0 rounded-md object-cover" loading="lazy" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    {n.category && <Badge variant="neutral" className="capitalize">{n.category}</Badge>}
                    {n.source_name && <span className="truncate">{n.source_name}</span>}
                  </div>
                  <h3 className="mt-0.5 text-sm font-semibold text-foreground group-hover:text-accent">{n.title}</h3>
                  {n.summary && <p className="line-clamp-2 text-xs text-muted-foreground">{n.summary}</p>}
                </div>
                {n.source_url && <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />}
              </>
            );
            return (
              <li key={n.id}>
                {n.source_url ? (
                  <a href={n.source_url} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-3 py-3 transition-colors hover:bg-muted/40">
                    {inner}
                  </a>
                ) : (
                  <Link to="/market-news" className="group flex items-start gap-3 py-3 transition-colors hover:bg-muted/40">{inner}</Link>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
