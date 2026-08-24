import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FollowButton } from "@/components/social/FollowButton";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Row {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  company_id: string | null;
  company_name: string | null;
  company_slug: string | null;
}

/**
 * Right-rail "Who to follow" widget. Suggests recent active posters the viewer
 * doesn't already follow — business or individual member alike.
 */
export function SuggestedFollows({ limit = 5 }: { limit?: number }) {
  const { user } = useAuth();
  const { data: rows, isLoading } = useQuery({
    queryKey: ["follows", "suggested", user?.id, limit],
    enabled: !!user,
    staleTime: 60_000,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("list_suggested_follows", { _limit: limit });
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  if (!user) return null;

  return (
    <aside className="rounded-2xl border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-bold text-foreground">Who to follow</h2>
      </div>
      <ul className="divide-y divide-border">
        {isLoading || !rows
          ? Array.from({ length: limit }).map((_, i) => (
              <li key={i} className="px-4 py-3">
                <Skeleton className="h-10 w-full" />
              </li>
            ))
          : rows.length === 0
            ? <li className="px-4 py-3 text-xs text-muted-foreground">No suggestions right now.</li>
            : rows.map((r) => {
                const name = r.company_name ?? r.full_name ?? "Member";
                const href = r.company_slug ? `/store/${r.company_slug}` : null;
                return (
                  <li key={r.user_id} className="flex items-center gap-3 px-4 py-3">
                    {(() => {
                      const Inner = (
                        <>
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={r.avatar_url ?? undefined} />
                            <AvatarFallback>{name.slice(0, 1)}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold text-foreground">{name}</div>
                            <div className="truncate text-xs text-muted-foreground">
                              {r.company_slug ? `@${r.company_slug}` : "Member"}
                            </div>
                          </div>
                        </>
                      );
                      return href ? (
                        <Link to={href} className="flex min-w-0 flex-1 items-center gap-3">{Inner}</Link>
                      ) : (
                        <div className="flex min-w-0 flex-1 items-center gap-3">{Inner}</div>
                      );
                    })()}
                    <FollowButton
                      target={r.company_id ? { type: "company", id: r.company_id } : { type: "user", id: r.user_id }}
                      name={name}
                    />
                  </li>
                );
              })}
      </ul>
    </aside>
  );
}
