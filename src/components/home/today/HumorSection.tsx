import { Link } from "react-router-dom";
import { ArrowRight, Smile } from "lucide-react";
import { useHumor } from "@/hooks/queries/useHumor";
import { Skeleton } from "@/components/ui/skeleton";

export function HumorSection() {
  const { data: posts, isLoading } = useHumor();
  const items = (posts ?? []).slice(0, 3);
  const [featured, ...rest] = items;

  return (
    <section className="rounded-2xl border border-[hsl(var(--gold))]/40 bg-gradient-to-br from-[hsl(var(--gold))]/10 via-card to-card p-4 shadow-sm sm:p-5">
      <header className="mb-3 flex items-end justify-between gap-2">
        <div>
          <p className="t-eyebrow inline-flex items-center gap-1.5 text-[hsl(var(--gold-dark))]">
            <Smile className="h-3.5 w-3.5" /> Humor
          </p>
          <h2 className="t-h3 mt-1 text-foreground">A lighter side of the trade</h2>
        </div>
        <Link to="/humor" className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-[hsl(var(--gold-dark))] hover:opacity-80">
          More <ArrowRight className="h-3 w-3" />
        </Link>
      </header>

      {isLoading ? (
        <div className="grid gap-3 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      ) : items.length === 0 ? (
        <p className="py-6 text-center text-xs text-muted-foreground">No humor posts yet — admins can add the first one.</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-3">
          {featured && (
            <article className="md:col-span-2 rounded-xl border border-border/70 bg-background/70 p-4">
              {featured.image_url && (
                <img src={featured.image_url} alt="" className="mb-3 h-32 w-full rounded-md object-cover" loading="lazy" />
              )}
              <h3 className="text-sm font-semibold text-foreground">{featured.title}</h3>
              <p className="mt-1 whitespace-pre-line text-xs text-muted-foreground line-clamp-4">{featured.body}</p>
              {featured.attribution && <p className="mt-2 text-[10px] uppercase tracking-wide text-muted-foreground/70">— {featured.attribution}</p>}
            </article>
          )}
          {rest.map((h) => (
            <article key={h.id} className="rounded-xl border border-border/70 bg-background/70 p-3">
              <h3 className="text-xs font-semibold text-foreground">{h.title}</h3>
              <p className="mt-1 line-clamp-3 whitespace-pre-line text-[11px] text-muted-foreground">{h.body}</p>
              {h.attribution && <p className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground/70">— {h.attribution}</p>}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
