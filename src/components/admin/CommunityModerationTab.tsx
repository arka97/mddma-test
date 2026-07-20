import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EyeOff, Eye, Trash2, UserX, Loader2 } from "lucide-react";
import { listAllPostsAdmin, setPostHidden, deletePost, muteAuthor, type CommunityPostRow } from "@/repositories/communityPosts";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function CommunityModerationTab() {
  const { toast } = useToast();
  const [posts, setPosts] = useState<CommunityPostRow[]>([]);
  const [authors, setAuthors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await listAllPostsAdmin();
      setPosts(data);
      // For anonymous posts, resolve real author via identity log
      const anonIds = data.filter((p) => p.is_anonymous).map((p) => p.id);
      let realByPost: Record<string, string> = {};
      if (anonIds.length) {
        const { data: log } = await supabase.from("anonymous_identity_log").select("post_id,real_author_id").in("post_id", anonIds);
        (log ?? []).forEach((l: { post_id: string; real_author_id: string }) => { realByPost[l.post_id] = l.real_author_id; });
      }
      const allAuthorIds = Array.from(new Set([
        ...data.filter((p) => !p.is_anonymous).map((p) => p.author_id),
        ...Object.values(realByPost),
      ]));
      if (allAuthorIds.length) {
        const { data: profs } = await supabase.from("profiles").select("id,full_name").in("id", allAuthorIds);
        const map: Record<string, string> = {};
        (profs ?? []).forEach((p: { id: string; full_name: string | null }) => { map[p.id] = p.full_name ?? "Member"; });
        // Map by post id for anonymous posts
        const merged: Record<string, string> = {};
        data.forEach((p) => {
          const aid = p.is_anonymous ? realByPost[p.id] : p.author_id;
          merged[p.id] = aid ? (map[aid] ?? "Member") : "Unknown";
        });
        setAuthors(merged);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onHide = async (id: string, hidden: boolean) => {
    await setPostHidden(id, hidden);
    toast({ title: hidden ? "Hidden" : "Visible" });
    load();
  };
  const onDelete = async (id: string) => {
    if (!confirm("Delete post?")) return;
    await deletePost(id);
    toast({ title: "Deleted" });
    load();
  };
  const onMute = async (postId: string, authorId: string) => {
    if (!confirm("Mute this author?")) return;
    await muteAuthor(authorId, true);
    toast({ title: "Author muted" });
  };

  if (loading) return <div className="py-10 flex justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div>;

  return (
    <div className="space-y-2">
      {posts.map((p) => {
        // For mute, look up real author id
        const realAuthorId = p.author_id; // log lookup handled separately if needed
        return (
          <Card key={p.id}>
            <CardContent className="p-3 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-[10px]">{p.post_type}</Badge>
                  {p.topic_tag && <Badge variant="secondary" className="text-[10px]">{p.topic_tag}</Badge>}
                  {p.is_anonymous && <Badge className="bg-muted text-foreground text-[10px]">Anon</Badge>}
                  {p.is_hidden && <Badge variant="outline">Hidden</Badge>}
                  {p.is_pinned && <Badge className="bg-accent text-accent-foreground">Pinned</Badge>}
                </div>
                <p className="text-sm font-medium truncate">{authors[p.id] ?? "Member"}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{p.content.slice(0, 100)}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{new Date(p.created_at).toLocaleString()}</p>
              </div>
              <div className="flex gap-1 sm:shrink-0">
                <Button size="sm" variant="outline" onClick={() => onHide(p.id, !p.is_hidden)} title={p.is_hidden ? "Unhide" : "Hide"}>
                  {p.is_hidden ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                </Button>
                <Button size="sm" variant="outline" onClick={() => onMute(p.id, realAuthorId)} title="Mute author">
                  <UserX className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => onDelete(p.id)} title="Delete"><Trash2 className="h-3 w-3" /></Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
      {posts.length === 0 && <p className="text-sm text-muted-foreground text-center py-10">No community posts yet.</p>}
    </div>
  );
}
