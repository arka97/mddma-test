import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Building2, Loader2, Send, ShieldCheck } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  addComment,
  listCommentBusinesses,
  listComments,
  type PostCommentRow,
} from "@/repositories/postComments";
import type { CommunityBusinessSummary } from "@/repositories/communityPosts";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { qk } from "@/lib/queryKeys";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string;
  canComment: boolean;
}

export function CommentsSheet({ open, onOpenChange, postId, canComment }: Props) {
  const { user, company } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [comments, setComments] = useState<PostCommentRow[]>([]);
  const [businesses, setBusinesses] = useState<Record<string, CommunityBusinessSummary>>({});
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!open) return;
    let active = true;
    setLoading(true);
    listComments(postId)
      .then(async (rows) => {
        if (!active) return;
        setComments(rows);
        const map = await listCommentBusinesses(rows.map((row) => row.author_id));
        if (active) setBusinesses(map);
      })
      .catch(() => {
        if (active) {
          setComments([]);
          setBusinesses({});
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [open, postId]);

  const submit = async () => {
    const content = text.trim();
    if (!user || !canComment || !content || sending) return;

    setSending(true);
    try {
      const comment = await addComment(postId, undefined, content);
      setComments((rows) => [...rows, comment]);
      if (company) {
        setBusinesses((current) => ({
          ...current,
          [user.id]: {
            id: company.id,
            owner_id: user.id,
            name: company.name,
            slug: company.slug,
            logo_url: company.logo_url,
            country: company.country,
            is_verified: company.is_verified,
          },
        }));
      }
      setText("");
      await queryClient.invalidateQueries({ queryKey: qk.community.all });
    } catch (error) {
      toast({
        title: "Comment could not be posted",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="flex h-[80vh] flex-col">
        <SheetHeader>
          <SheetTitle>Business discussion</SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-3 overflow-y-auto py-3">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : comments.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No comments yet.</p>
          ) : (
            comments.map((comment) => {
              const business = businesses[comment.author_id];
              return (
                <div key={comment.id} className="rounded-xl border border-border/60 p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary text-primary-foreground">
                      {business?.logo_url ? (
                        <img src={business.logo_url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <Building2 className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-xs">
                        {business ? (
                          <Link to={`/store/${business.slug}`} className="truncate font-semibold text-foreground hover:text-accent">
                            {business.name}
                          </Link>
                        ) : (
                          <span className="font-semibold text-foreground">Business profile unavailable</span>
                        )}
                        {business?.is_verified && <ShieldCheck className="h-3.5 w-3.5 text-success" />}
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{comment.content}</p>
                </div>
              );
            })
          )}
        </div>

        {canComment ? (
          <div className="border-t border-border pt-3">
            <div className="flex items-center gap-2">
              <Input
                value={text}
                onChange={(event) => setText(event.target.value.slice(0, 1500))}
                placeholder="Comment as your business…"
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void submit();
                  }
                }}
              />
              <Button size="icon" onClick={submit} disabled={sending || !text.trim()} aria-label="Post comment">
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
            <p className="mt-1 text-right text-[10px] text-muted-foreground">{text.length}/1500</p>
          </div>
        ) : (
          <p className="border-t border-border pt-3 text-center text-xs text-muted-foreground">
            An approved verified business is required to comment.
          </p>
        )}
      </SheetContent>
    </Sheet>
  );
}
