import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { listAnonymousIdentityLog } from "@/repositories/communityPosts";
import { supabase } from "@/integrations/supabase/client";

interface LogRow { id: string; post_id: string; real_author_id: string; created_at: string }

export function AnonymousLogTab() {
  const [rows, setRows] = useState<LogRow[]>([]);
  const [posts, setPosts] = useState<Record<string, { content: string; is_hidden: boolean }>>({});
  const [authors, setAuthors] = useState<Record<string, { name: string }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const log = await listAnonymousIdentityLog();
        setRows(log as LogRow[]);
        const pids = (log as LogRow[]).map((l) => l.post_id);
        const aids = Array.from(new Set((log as LogRow[]).map((l) => l.real_author_id)));
        const [{ data: ps }, { data: pr }] = await Promise.all([
          pids.length ? supabase.from("community_posts").select("id,content,is_hidden").in("id", pids) : Promise.resolve({ data: [] }),
          aids.length ? supabase.from("profiles").select("id,full_name").in("id", aids) : Promise.resolve({ data: [] }),
        ]);
        const pmap: typeof posts = {};
        (ps ?? []).forEach((p: { id: string; content: string; is_hidden: boolean }) => { pmap[p.id] = { content: p.content, is_hidden: p.is_hidden }; });
        setPosts(pmap);
        const amap: typeof authors = {};
        (pr ?? []).forEach((p: { id: string; full_name: string | null }) => { amap[p.id] = { name: p.full_name ?? "Member" }; });
        setAuthors(amap);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="py-10 flex justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div>;

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">Permanent log — read-only. Admin access only.</p>
      {rows.map((r) => (
        <Card key={r.id}>
          <CardContent className="p-3 text-sm">
            <p className="line-clamp-2 text-muted-foreground">{posts[r.post_id]?.content ?? "(post deleted)"}</p>
            <p className="text-xs mt-1">
              <span className="font-semibold text-foreground">{authors[r.real_author_id]?.name ?? "Unknown"}</span>
              <span className="text-muted-foreground"> · {new Date(r.created_at).toLocaleString()}</span>
              {posts[r.post_id]?.is_hidden && <span className="ml-2 text-muted-foreground">[hidden]</span>}
            </p>
          </CardContent>
        </Card>
      ))}
      {rows.length === 0 && <p className="text-sm text-muted-foreground text-center py-10">No anonymous posts yet.</p>}
    </div>
  );
}
