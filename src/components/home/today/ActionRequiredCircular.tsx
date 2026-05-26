import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { listCirculars, type CircularRow } from "@/repositories/circulars";

export function ActionRequiredCircular() {
  const [circular, setCircular] = useState<CircularRow | null>(null);

  useEffect(() => {
    let alive = true;
    listCirculars({ publishedOnly: true })
      .then((rows) => {
        if (!alive) return;
        // Prefer the most recent "action required" / compliance / urgent circular,
        // else the latest circular overall.
        const flagged = rows.find((r) =>
          ["action", "urgent", "compliance", "regulatory"].some((k) =>
            (r.category ?? "").toLowerCase().includes(k) || r.title.toLowerCase().includes(k),
          ),
        );
        setCircular(flagged ?? rows[0] ?? null);
      })
      .catch(() => { if (alive) setCircular(null); });
    return () => { alive = false; };
  }, []);

  if (!circular) return null;

  return (
    <article className="overflow-hidden rounded-2xl border border-warning/40 bg-warning/5 p-4 shadow-sm">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-warning-foreground">
        <AlertTriangle className="h-3 w-3" />
        Circular · Action required
      </div>
      <h3 className="mt-2 text-sm font-semibold leading-snug text-foreground">{circular.title}</h3>
      {circular.body && (
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
          {circular.body.replace(/[#*_>`]/g, "").slice(0, 140)}
        </p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Link
          to="/circulars"
          className="inline-flex items-center gap-1 rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background hover:opacity-90"
        >
          Read &amp; act <ArrowRight className="h-3 w-3" />
        </Link>
        <Link to="/circulars" className="text-xs font-medium text-muted-foreground hover:text-foreground">
          See all circulars
        </Link>
      </div>
    </article>
  );
}
