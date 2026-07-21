import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FollowButton } from "@/components/social/FollowButton";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

interface Row {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  is_verified: boolean;
}

/**
 * Right-rail "Who to follow" widget. Reads verified businesses from the
 * public view and shows a small ranked list with follow controls.
 */
export function SuggestedFollows({ limit = 5 }: { limit?: number }) {
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("companies_public")
        .select("id,name,slug,logo_url,is_verified")
        .eq("is_hidden", false)
        .order("is_verified", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(limit);
      if (!cancelled) setRows((data as Row[] | null) ?? []);
    })();
    return () => {
      cancelled = true;
    };
  }, [limit]);

  return (
    <aside className="rounded-2xl border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-bold text-foreground">Who to follow</h2>
      </div>
      <ul className="divide-y divide-border">
        {rows === null
          ? Array.from({ length: limit }).map((_, i) => (
              <li key={i} className="px-4 py-3">
                <Skeleton className="h-10 w-full" />
              </li>
            ))
          : rows.length === 0
            ? <li className="px-4 py-3 text-xs text-muted-foreground">No businesses yet.</li>
            : rows.map((r) => (
                <li key={r.id} className="flex items-center gap-3 px-4 py-3">
                  <Link to={`/store/${r.slug}`} className="flex min-w-0 flex-1 items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={r.logo_url ?? undefined} />
                      <AvatarFallback>{r.name.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1 truncate text-sm font-semibold text-foreground">
                        {r.name}
                        {r.is_verified && <BadgeCheck className="h-3.5 w-3.5 text-primary" aria-label="Verified" />}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">@{r.slug}</div>
                    </div>
                  </Link>
                  <FollowButton id={r.id} name={r.name} />
                </li>
              ))}
      </ul>
    </aside>
  );
}
