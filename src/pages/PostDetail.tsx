import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PostCard } from "@/components/market/PostCard";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/contexts/RoleContext";
import { getPost, type CommunityPostRow } from "@/repositories/communityPosts";
import { listLikes } from "@/repositories/postLikes";
import { viewCounts } from "@/repositories/postViews";
import { listComments, addComment, type PostCommentRow } from "@/repositories/postComments";
import { listCompaniesByOwners } from "@/repositories/companies";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface Author {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  company_name?: string | null;
  slug?: string | null;
  is_verified?: boolean | null;
}

const PostDetail = () => {
  const { postId } = useParams();
  const { user } = useAuth();
  const { role, isEffectivePaid } = useRole();
  const { toast } = useToast();

  const [post, setPost] = useState<CommunityPostRow | null>(null);
  const [author, setAuthor] = useState<Author | undefined>();
  const [likes, setLikes] = useState({ count: 0, liked: false });
  const [views, setViews] = useState(0);
  const [comments, setComments] = useState<PostCommentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const composerRef = useRef<HTMLInputElement>(null);

  const canEngage = !!user && isEffectivePaid;
  const isAdmin = role === "admin";

  useEffect(() => {
    if (!postId) return;
    let alive = true;
    setLoading(true);
    setNotFound(false);
    (async () => {
      try {
        const p = await getPost(postId);
        if (!alive) return;
        if (!p) { setNotFound(true); return; }
        setPost(p);

        const [l, v, cts] = await Promise.all([
          listLikes([p.id]),
          viewCounts([p.id]),
          listComments(p.id).catch(() => [] as PostCommentRow[]),
        ]);
        if (!alive) return;
        setLikes({ count: l.counts[p.id] ?? 0, liked: l.mine.has(p.id) });
        setViews(v[p.id] ?? 0);
        setComments(cts);

        if (!p.is_anonymous) {
          const [{ data: profs }, companies] = await Promise.all([
            supabase.from("profiles").select("id,full_name,avatar_url,company_name").eq("id", p.author_id),
            listCompaniesByOwners([p.author_id]),
          ]);
          if (!alive) return;
          const prof = (profs ?? [])[0] as
            | { full_name: string | null; avatar_url: string | null; company_name: string | null }
            | undefined;
          const co = companies[p.author_id];
          setAuthor({
            id: p.author_id,
            full_name: prof?.full_name ?? null,
            avatar_url: prof?.avatar_url ?? null,
            company_name: prof?.company_name ?? co?.name ?? null,
            slug: co?.slug ?? null,
            is_verified: co?.is_verified ?? false,
          });
        }
      } catch {
        if (alive) setNotFound(true);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [postId]);

  const submit = async () => {
    if (!user || !post || !text.trim()) return;
    setSending(true);
    try {
      const c = await addComment(post.id, user.id, text.trim());
      setComments((arr) => [...arr, c]);
      setText("");
    } catch (e) {
      toast({ title: "Failed to reply", description: e instanceof Error ? e.message : "", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <Layout>
      <Seo title="Post — G-BAU-G" description="A post on the G-BAU-G market feed." path={`/market/${postId ?? ""}`} noindex />

      <div className="mx-auto min-h-screen max-w-[600px] pb-24 sm:border-x sm:border-border">
        <div className="flex items-center gap-6 border-b border-border bg-background px-4 py-2.5">
          <Link to="/market" aria-label="Back to Market" className="flex h-9 w-9 items-center justify-center rounded-full text-foreground hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-extrabold tracking-tight">Post</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : notFound || !post ? (
          <div className="px-4 py-16 text-center">
            <p className="text-sm text-muted-foreground">This post isn't available.</p>
            <Button asChild variant="outline" className="mt-4"><Link to="/market">Back to Market</Link></Button>
          </div>
        ) : (
          <>
            <div className="border-b border-border">
              <PostCard
                post={post}
                author={author}
                liked={likes.liked}
                likeCount={likes.count}
                commentCount={comments.length}
                viewCount={views}
                canEngage={canEngage}
                isAdmin={isAdmin}
                variant="detail"
                onReply={() => composerRef.current?.focus()}
              />
            </div>

            {canEngage ? (
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <Input
                  ref={composerRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Post your reply"
                  onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
                  className="rounded-full"
                />
                <Button size="icon" onClick={submit} disabled={sending || !text.trim()} aria-label="Reply">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <p className="border-b border-border px-4 py-4 text-center text-xs text-muted-foreground">
                {user ? "Paid members can reply." : (
                  <>Sign in to reply. <Link to="/login" className="text-primary hover:underline">Log in</Link></>
                )}
              </p>
            )}

            <div className="divide-y divide-border">
              {comments.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted-foreground">No replies yet.</p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="px-4 py-3">
                    <div className="mb-1 text-[13px] text-muted-foreground">
                      Member · {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}
                    </div>
                    <p className="whitespace-pre-wrap text-[15px]">{c.content}</p>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default PostDetail;
