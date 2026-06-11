import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Megaphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCirculars } from "@/hooks/queries/useContent";

export function CircularsSection() {
  const { data: circulars, isLoading } = useCirculars();
  const items = (circulars ?? []).slice(0, 4);

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <header className="mb-3 flex items-end justify-between gap-2">
        <div>
          <p className="t-eyebrow inline-flex items-center gap-1.5 text-accent">
            <Megaphone className="h-3.5 w-3.5" /> Circulars &amp; Notices
          </p>
          <h2 className="t-h3 mt-1 text-foreground">Trade notices &amp; association updates</h2>
        </div>
        <Link to="/circulars" className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-accent hover:text-accent/80">
          All <ArrowRight className="h-3 w-3" />
        </Link>
      </header>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-md" />)}
        </div>
      ) : items.length === 0 ? (
        <p className="py-6 text-center text-xs text-muted-foreground">No circulars published yet.</p>
      ) : (
        <ul className="divide-y divide-border/60">
          {items.map((c) => {
            const date = c.published_at ?? c.created_at;
            return (
              <li key={c.id}>
                <Link to="/circulars" className="group flex flex-col gap-1 py-3 transition-colors hover:bg-muted/40">
                  <div className="flex items-center gap-2 text-[11px]">
                    {c.category && <Badge variant="neutral" className="capitalize">{c.category}</Badge>}
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-accent">{c.title}</h3>
                  {c.body && <p className="line-clamp-1 text-xs text-muted-foreground">{c.body}</p>}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
