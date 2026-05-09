import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Send, Loader2, Pin, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { friendlyErrorMessage } from "@/lib/errors";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { TableRowSkeleton } from "@/components/ui/skeletons";

const categories = ["Market Updates", "Trade Discussions", "Association Circulars"] as const;

interface Post {
  id: string; title: string; body: string; category: string;
  is_pinned: boolean; created_at: string; author_id: string; view_count: number;
}
interface Comment { id: string; body: string; author_id: string; created_at: string; }

const Community = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [authors, setAuthors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [openPost, setOpenPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [form, setForm] = useState({ title: "", body: "", category: categories[1] as string });
  const [submitting, setSubmitting] = useState(false);

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

  const submitPost = async () => {
    if (!user) { toast({ title: "Sign in to post", variant: "destructive" }); return; }
    if (!form.title.trim() || !form.body.trim()) return;
    setSubmitting(true);
    const { error } = await supabase.from("posts").insert({
      title: form.title, body: form.body, category: form.category, author_id: user.id,
    });
    setSubmitting(false);
    if (error) toast({ title: "Failed", description: friendlyErrorMessage(error), variant: "destructive" });
    else { toast({ title: "Posted" }); setForm({ title: "", body: "", category: categories[1] }); load(); }
  };

  const submitComment = async () => {
    if (!user || !openPost || !newComment.trim()) return;
    const { error } = await supabase.from("comments").insert({
      post_id: openPost.id, author_id: user.id, body: newComment,
    });
    if (error) toast({ title: "Failed", variant: "destructive" });
    else { setNewComment(""); openDetail(openPost); }
  };

  if (openPost) {
    return (
      <Layout>
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <Button variant="ghost" size="sm" onClick={() => setOpenPost(null)} className="mb-4"><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
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
              {comments.length === 0 && <p className="text-sm text-muted-foreground">No comments yet.</p>}
            </div>

            {user ? (
              <div className="mt-4 space-y-2">
                <Textarea rows={3} maxLength={1500} placeholder="Add a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                <Button onClick={submitComment} variant="accent"><Send className="h-3 w-3 mr-1" /> Comment</Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mt-4"><Link to="/login" className="text-accent hover:underline">Sign in</Link> to comment.</p>
            )}
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader
        title="Trade Community"
        subtitle="Market intelligence, discussions and association updates"
      />

      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div>
              <Tabs defaultValue="all">
                <TabsList className="mb-4 flex-wrap h-auto">
                  <TabsTrigger value="all">All</TabsTrigger>
                  {categories.map((cat) => <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>)}
                </TabsList>

                {(["all", ...categories] as const).map((tab) => (
                  <TabsContent key={tab} value={tab}>
                    <Card>
                      <CardContent className="p-0">
                        {loading ? (
                          <div className="px-4 py-2"><TableRowSkeleton rows={6} /></div>
                        ) : (
                          (tab === "all" ? posts : posts.filter((p) => p.category === tab)).map((post) => (
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
                        {!loading && posts.length === 0 && <p className="p-6 text-sm text-muted-foreground text-center">No posts yet. Be the first.</p>}
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            <div className="space-y-4">
              <Card className="bg-card border-border">
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Start a discussion</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {!user ? (
                    <p className="text-sm text-muted-foreground"><Link to="/login" className="text-accent hover:underline">Sign in</Link> to post.</p>
                  ) : (
                    <>
                      <div className="space-y-1.5"><Label>Title</Label><Input maxLength={150} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
                      <div className="space-y-1.5">
                        <Label>Category</Label>
                        <select className="w-full border rounded h-9 px-2 text-sm bg-background" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5"><Label>Message</Label><Textarea rows={4} maxLength={2000} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></div>
                      <Button onClick={submitPost} disabled={submitting} variant="accent" className="w-full">
                        {submitting ? <Loader2 className="h-3 w-3 animate-spin" /> : <><Send className="h-3 w-3 mr-1" /> Post</>}
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Community;
