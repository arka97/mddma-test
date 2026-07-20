import { useEffect, useState } from "react";
import { Building2, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  listAnonymousIdentityLog,
  listCommunityBusinesses,
  type CommunityBusinessSummary,
} from "@/repositories/communityPosts";
import { supabase } from "@/integrations/supabase/client";

interface LogRow {
  id: string;
  post_id: string;
  real_author_id: string;
  created_at: string;
}

export function AnonymousLogTab() {
  const [rows, setRows] = useState<LogRow[]>([]);
  const [posts, setPosts] = useState<Record<string, { content: string; is_hidden: boolean }>>({});
  const [businesses, setBusinesses] = useState<Record<string, CommunityBusinessSummary>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const log = (await listAnonymousIdentityLog()) as LogRow[];
        setRows(log);
        const postIds = log.map((row) => row.post_id);
        const authorIds = Array.from(new Set(log.map((row) => row.real_author_id)));
        const [{ data: postRows }, businessMap] = await Promise.all([
          postIds.length
            ? supabase.from("community_posts").select("id,content,is_hidden").in("id", postIds)
            : Promise.resolve({ data: [] }),
          listCommunityBusinesses(authorIds),
        ]);

        const postMap: typeof posts = {};
        (postRows ?? []).forEach((post) => {
          postMap[post.id] = { content: post.content, is_hidden: post.is_hidden };
        });
        setPosts(postMap);
        setBusinesses(businessMap);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin" /></div>;
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border bg-muted/25 p-3 text-xs leading-relaxed text-muted-foreground">
        Historical, read-only audit log. Anonymous publishing is retired and all corresponding posts are hidden from the public feed.
      </div>
      {rows.map((row) => {
        const business = businesses[row.real_author_id];
        return (
          <Card key={row.id}>
            <CardContent className="p-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary text-primary-foreground">
                  {business?.logo_url ? <img src={business.logo_url} alt="" className="h-full w-full object-cover" /> : <Building2 className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-muted-foreground">{posts[row.post_id]?.content ?? "(post deleted)"}</p>
                  <p className="mt-1 text-xs">
                    <span className="font-semibold text-foreground">{business?.name ?? "Business profile unavailable"}</span>
                    <span className="text-muted-foreground"> · {new Date(row.created_at).toLocaleString()}</span>
                    {posts[row.post_id]?.is_hidden && <span className="ml-2 text-muted-foreground">[hidden]</span>}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
      {rows.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">No historical anonymous records.</p>}
    </div>
  );
}
