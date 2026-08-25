import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Send, X } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PostCard } from "@/components/market/PostCard";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/contexts/RoleContext";
import { getPost, type CommunityPostRow } from "@/repositories/communityPosts";
import { listLikes } from "@/repositories/postLikes";
import { viewCounts } from "@/repositories/postViews";
import { listComments, addComment, buildThreads, type PostCommentRow } from "@/repositories/postComments";
import { listCompaniesByOwners } from "@/repositories/companies";
import { supabase } from "@/integrations/supabase/client";
import { fetchPublicProfiles } from "@/repositories/profiles";
import { shortTimeAgo } from "@/lib/time";
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
  const { role } = useRole();
  const { toast } = useToast();

  const [post, setPost] = useState<CommunityPostRow | null>(null);
  const [author, setAuthor] = useState<Author | undefined>();
  const [authorCompanyId, setAuthorCompanyId] = useState<string | null>(null);
  const [likes, setLikes] = useState({ count: 0, liked: false });
  const [views, setViews] = useState(0);
  const [comments, setComments] = useState<PostCommentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [replyTo, setReplyTo] = useState<PostCommentRow | null>(null);
  const composerRef = useRef<HTMLInputElement>(null);

  const threads = useMemo(() => buildThreads(comments), [comments]);

  const canEngage = !!user;

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
          const [profs, companies] = await Promise.all([
            fetchPublicProfiles([p.author_id]),
            listCompaniesByOwners([p.author_id]),
          ]);
          if (!alive) return;
          const prof = profs[0];
          const co = companies[p.author_id];
          setAuthorCompanyId(co?.id ?? null);
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

  const startReply = (c: PostCommentRow) => {
    setReplyTo(c);
    composerRef.current?.focus();
  };

  const submit = async () => {
    if (!user || !post || !text.trim()) return;
    setSending(true);
    try {
      const c = await addComment(post.id, user.id, text.trim(), replyTo?.id ?? null);
      setComments((arr) => [...arr, c]);
      setText("");
      setReplyTo(null);
    } catch (e) {
      toast({ title: "Failed to reply", description: e instanceof Error ? e.message : "", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const CommentRow = ({ comment, compact, onReply }: { comment: PostCommentRow; compact?: boolean; onReply?: () => void }) => {
    const name = comment.author_name?.trim() || "Member";
    return (
      <div className="flex gap-3">
        <Avatar className={compact ? "h-7 w-7 shrink-0" : "h-9 w-9 shrink-0"}>
          <AvatarImage src={comment.author_avatar ?? undefined} alt={name} />
          <AvatarFallback>{name.slice(0, 1).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[13px]">
            <span className="font-semibold">{name}</span>
            <span className="text-muted-foreground">· {shortTimeAgo(comment.created_at)}</span>
          </div>
          <p className="whitespace-pre-wrap break-words text-[15px]">{comment.content}</p>
          {onReply && (
            <button type="button" onClick={onReply} className="mt-1 text-[12px] font-medium text-muted-foreground hover:text-primary">
              Reply
            </button>
          )}
        </div>
      </div>
    );
  };


  return (
    <Layout>
      <Seo title="Post — G-BAU-G" description="A post on the G-BAU-G market feed." path={`/market/${postId ?? ""}`} noindex />

      <div className="mx-auto min-h-screen max-w-[600px] pb-24 sm:border-x sm:border-border">
        <div className="flex items-center gap-6 border-b border-border bg-background px-4 py-2.5">
          <Link to="/" aria-label="Back to feed" className="flex h-9 w-9 items-center justify-center rounded-full text-foreground hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-extrabold tracking-tight">Post</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : notFound || !post ? (
          <div className="px-4 py-16 text-center">
            <p className="text-sm text-muted-foreground">This post isn't available.</p>
            <Button asChild variant="outline" className="mt-4"><Link to="/">Back to feed</Link></Button>
          </div>
        ) : (
          <>
            <div className="border-b border-border">
              <PostCard
                post={post}
                author={author}
                companyId={authorCompanyId}
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
              <div className="border-b border-border px-4 py-3">
                {replyTo && (
                  <div className="mb-2 flex items-center gap-2 text-[12px] text-muted-foreground">
                    <span className="truncate">
                      Replying to <span className="font-medium text-foreground">{replyTo.author_name?.trim() || "Member"}</span>
                    </span>
                    <button type="button" onClick={() => setReplyTo(null)} aria-label="Cancel reply" className="rounded-full p-1 hover:bg-muted">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Input
                    ref={composerRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={replyTo ? `Reply to ${replyTo.author_name?.trim() || "Member"}` : "Post your reply"}
                    onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
                    className="rounded-full text-base"
                  />
                  <Button size="icon" onClick={submit} disabled={sending || !text.trim()} aria-label="Reply">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <p className="border-b border-border px-4 py-4 text-center text-xs text-muted-foreground">
                {user ? "Paid members can reply." : (
                  <>Sign in to reply. <Link to="/login" className="text-primary hover:underline">Log in</Link></>
                )}
              </p>
            )}

            <div className="divide-y divide-border">
              {threads.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted-foreground">No replies yet.</p>
              ) : (
                threads.map((t) => (
                  <div key={t.comment.id} className="space-y-3 px-4 py-3">
                    <CommentRow comment={t.comment} onReply={canEngage ? () => startReply(t.comment) : undefined} />
                    {t.children.length > 0 && (
                      <div className="ml-6 space-y-3 border-l border-border pl-4">
                        {t.children.map((child) => (
                          <CommentRow
                            key={child.id}
                            comment={child}
                            compact
                            onReply={canEngage ? () => startReply(t.comment) : undefined}
                          />
                        ))}
                      </div>
                    )}
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
