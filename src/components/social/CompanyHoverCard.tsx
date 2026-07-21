import { ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FollowButton } from "./FollowButton";
import { supabase } from "@/integrations/supabase/client";

interface CompanyHoverCardProps {
  slug: string;
  children: ReactNode;
}

interface CompanySummary {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  short_description: string | null;
  is_verified: boolean;
}

const cache = new Map<string, CompanySummary | null>();

/**
 * LinkedIn/X hybrid hover-preview: on hover of a business mention, fetch a
 * lightweight summary (public columns only) and expose a FollowButton.
 * Results are memoized per session to avoid refetching on every hover.
 */
export function CompanyHoverCard({ slug, children }: CompanyHoverCardProps) {
  const [data, setData] = useState<CompanySummary | null | undefined>(() => cache.get(slug));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open || data !== undefined) return;
    let cancelled = false;
    (async () => {
      const { data: row } = await supabase
        .from("companies_public")
        .select("id,name,slug,logo_url,short_description,is_verified")
        .eq("slug", slug)
        .maybeSingle();
      if (cancelled) return;
      const summary = (row as CompanySummary | null) ?? null;
      cache.set(slug, summary);
      setData(summary);
    })();
    return () => {
      cancelled = true;
    };
  }, [open, slug, data]);

  return (
    <HoverCard openDelay={250} closeDelay={100} onOpenChange={setOpen}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-72 space-y-3 p-4">
        {!data ? (
          <div className="text-xs text-muted-foreground">Loading business…</div>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <Link to={`/store/${data.slug}`} className="flex min-w-0 items-center gap-3">
                <Avatar className="h-11 w-11">
                  <AvatarImage src={data.logo_url ?? undefined} />
                  <AvatarFallback>{data.name.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="flex items-center gap-1 truncate text-sm font-semibold text-foreground">
                    {data.name}
                    {data.is_verified && <BadgeCheck className="h-4 w-4 text-primary" aria-label="Verified" />}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">@{data.slug}</div>
                </div>
              </Link>
              <FollowButton id={data.id} name={data.name} />
            </div>
            {data.short_description && (
              <p className="line-clamp-3 text-xs text-muted-foreground">{data.short_description}</p>
            )}
          </>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
