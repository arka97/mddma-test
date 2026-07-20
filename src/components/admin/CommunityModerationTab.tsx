import { useEffect, useState } from "react";
import { Building2, Eye, EyeOff, Loader2, ShieldCheck, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  deletePost,
  listAllPostsAdmin,
  listCommunityBusinesses,
  setPostHidden,
  type CommunityBusinessSummary,
  type CommunityPostRow,
} from "@/repositories/communityPosts";
import { useToast } from "@/hooks/use-toast";

export function CommunityModerationTab() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<CommunityPostRow[]>([]);
  const [businesses, setBusinesses] = useState<Record<string, CommunityBusinessSummary>>({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const rows = await listAllPostsAdmin();
      setPosts(rows);
      setBusinesses(await listCommunityBusinesses(rows.map((post) => post.author_id)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const onHide = async (id: string, hidden: boolean) => {
    await setPostHidden(id, hidden);
    toast({ title: hidden ? "Post hidden" : "Post restored" });
    await load();
  };

  const onDelete = async (id: string) => {
    if (!confirm("Permanently delete this community post?")) return;
    await deletePost(id);
    toast({ title: "Post deleted" });
    await load();
  };

  if (loading) {
    return <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin" /></div>;
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border bg-muted/25 p-3 text-xs leading-relaxed text-muted-foreground">
        Community posts are publicly attributed to an approved business. Anonymous publishing is retired; historical anonymous records remain hidden for audit purposes.
      </div>

      {posts.map((post) => {
        const business = businesses[post.author_id];
        return (
          <Card key={post.id}>
            <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary text-primary-foreground">
                {business?.logo_url ? (
                  <img src={business.logo_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <Building2 className="h-5 w-5" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">{post.post_type}</Badge>
                  {post.topic_tag && <Badge variant="secondary" className="text-[10px]">{post.topic_tag}</Badge>}
                  {post.is_anonymous && <Badge variant="neutral" className="text-[10px]">Legacy anonymous</Badge>}
                  {post.is_hidden && <Badge variant="outline">Hidden</Badge>}
                  {post.is_pinned && <Badge className="bg-accent text-accent-foreground">Pinned</Badge>}
                </div>
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-sm font-semibold text-foreground">{business?.name ?? "Business profile unavailable"}</p>
                  {business?.is_verified && <ShieldCheck className="h-3.5 w-3.5 text-success" />}
                </div>
                <p className="line-clamp-2 text-xs text-muted-foreground">{post.content || "Structured post"}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">{new Date(post.created_at).toLocaleString()}</p>
              </div>
              <div className="flex gap-1 sm:shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onHide(post.id, !post.is_hidden)}
                  title={post.is_hidden ? "Restore" : "Hide"}
                >
                  {post.is_hidden ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                </Button>
                <Button size="sm" variant="outline" onClick={() => onDelete(post.id)} title="Delete">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {posts.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">No community posts yet.</p>}
    </div>
  );
}
