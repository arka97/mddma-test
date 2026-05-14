import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pin, ArrowLeft, MessagesSquare, Archive } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/layout/PageHeader";
import { TableRowSkeleton } from "@/components/ui/skeletons";
import { DiscourseEmbed } from "@/components/community/DiscourseEmbed";

const categories = ["All", "Market Updates", "Trade Discussions", "Association Circulars"] as const;

interface Post {
  id: string; title: string; body: string; category: string;
  is_pinned: boolean; created_at: string; author_id: string; view_count: number;
}
interface Comment { id: string; body: string; author_id: string; created_at: string; }

const Community = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [authors, setAuthors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [openPost, setOpenPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [filter, setFilter] = useState<typeof categories[number]>("All");

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from("posts").select("*").order("is_pinned", { ascending: false }).order("created_at", { ascending: false });
    setPosts((data ?? []) as any);
    const ids = Array.from(new Set((data ?? []).map((p: any) => p.author_id)));
    if (ids.length) {
      const { data: profs } = await supabase.from("profiles").select("id,full_name").in("id", ids);
      const map: Record<string, string> = {};
      (profs ?? []).forEach((p: any) => { map[p.id] = p.full_name ?? "Member"; });
      setAuthors(map);
    }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openDetail = async (p: Post) => {
    setOpenPost(p);
    const { data } = await supabase.from("comments").select("*").eq("post_id", p.id).order("created_at", { ascending: true });
    setComments((data ?? []) as any);
  };

  if (openPost) {
    return (
      <Layout>
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <Button variant="ghost" size="sm" onClick={() => setOpenPost(null)} className="mb-4"><ArrowLeft className="h-4 w-4 mr-1" /> Back to archive</Button>
            <Card>
              <CardHeader>
                <Badge variant="outline" className="w-fit text-xs">{openPost.category}</Badge>
                <CardTitle className="text-xl">{openPost.title}</CardTitle>
                <p className="text-xs text-muted-foreground">By {authors[openPost.author_id] ?? "Member"} · {new Date(openPost.created_at).toLocaleDateString()}</p>
              </CardHeader>
              <CardContent><p className="text-sm whitespace-pre-wrap">{openPost.body}</p></CardContent>
            </Card>

            <h2 className="text-base font-semibold mt-6 mb-3">Comments ({comments.length})</h2>
            <div className="space-y-3">
              {comments.map((c) => (
                <Card key={c.id}><CardContent className="p-3">
                  <p className="text-xs text-muted-foreground mb-1">{authors[c.author_id] ?? "Member"} · {new Date(c.created_at).toLocaleDateString()}</p>
                  <p className="text-sm whitespace-pre-wrap">{c.body}</p>
                </CardContent></Card>
              ))}
              {comments.length === 0 && <p className="text-sm text-muted-foreground">No comments.</p>}
            </div>
            <p className="text-xs text-muted-foreground mt-6 italic">Read-only archive. Continue the conversation in the Discussions tab.</p>
          </div>
        </section>
      </Layout>
    );
  }

  const filtered = filter === "All" ? posts : posts.filter((p) => p.category === filter);

  return (
    <Layout>
      <PageHeader
        title="Trade Community"
        subtitle="Live discussions on Discourse, plus a read-only archive of earlier posts"
      />

      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <Tabs defaultValue="discussions">
            <TabsList className="mb-6">
              <TabsTrigger value="discussions" className="gap-2"><MessagesSquare className="h-4 w-4" /> Discussions</TabsTrigger>
              <TabsTrigger value="archive" className="gap-2"><Archive className="h-4 w-4" /> Archive</TabsTrigger>
            </TabsList>

            <TabsContent value="discussions">
              <DiscourseEmbed />
            </TabsContent>

            <TabsContent value="archive">
              <div className="mb-4 rounded-md border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
                This archive is read-only. New discussions happen in the Discussions tab.
              </div>
              <div className="mb-4 flex flex-wrap gap-2">
                {categories.map((c) => (
                  <Button key={c} size="sm" variant={filter === c ? "accent" : "outline"} onClick={() => setFilter(c)}>{c}</Button>
                ))}
              </div>
              <Card>
                <CardContent className="p-0">
                  {loading ? (
                    <div className="px-4 py-2"><TableRowSkeleton rows={6} /></div>
                  ) : filtered.length === 0 ? (
                    <p className="p-6 text-sm text-muted-foreground text-center">No archived posts.</p>
                  ) : (
                    filtered.map((post) => (
                      <button key={post.id} onClick={() => openDetail(post)} className="w-full text-left flex items-start gap-3 p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                        {post.is_pinned && <Pin className="h-4 w-4 text-accent flex-shrink-0 mt-1" />}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground text-sm leading-tight">{post.title}</h3>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                            <span>{authors[post.author_id] ?? "Member"}</span>
                            <Badge variant="outline" className="text-xs">{post.category}</Badge>
                            <span>{new Date(post.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Community;
