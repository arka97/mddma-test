import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface Row {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  state: string | null;
  categories: string[] | null;
  is_verified: boolean | null;
}

function initials(name: string): string {
  return (
    name
      .split(/\s+/)
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "·"
  );
}

export function NewMembersList() {
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    let alive = true;
    supabase
      .from("companies")
      .select("id,name,slug,city,state,categories,is_verified")
      .eq("review_status", "approved")
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => { if (alive) setRows((data ?? []) as unknown as Row[]); });
    return () => { alive = false; };
  }, []);

  return (
    <section>
      <div className="mb-3 flex items-end justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-foreground">New Members</h2>
          <p className="text-xs text-muted-foreground">Recently joined verified traders</p>
        </div>
        <Link to="/directory" className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-accent hover:text-accent/80">
          Directory <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {rows === null ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-xs text-muted-foreground">
          No new members yet. Check back soon.
        </div>
      ) : (
        <ul className="space-y-2">
          {rows.map((m) => {
            const cat = (m.categories ?? []).filter(Boolean)[0];
            const loc = m.city ?? m.state ?? "Mumbai";
            return (
              <li key={m.id}>
                <Link
                  to={`/store/${m.slug}`}
                  className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">
                    {initials(m.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h3 className="truncate text-sm font-semibold text-foreground">{m.name}</h3>
                      {m.is_verified && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-success/10 px-1.5 py-0.5 text-[10px] font-semibold text-success">
                          <ShieldCheck className="h-2.5 w-2.5" /> Verified
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      <MapPin className="h-2.5 w-2.5" /> {loc}{cat ? ` · ${cat}` : ""}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-accent transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
