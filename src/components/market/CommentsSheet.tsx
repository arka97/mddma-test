import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Loader2, X } from "lucide-react";
import { listComments, addComment, buildThreads, type PostCommentRow } from "@/repositories/postComments";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { shortTimeAgo } from "@/lib/time";
import { useVisualViewportHeight } from "@/hooks/useVisualViewportHeight";


interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  postId: string;
  /** Kept for compatibility; commenting only requires a signed-in user. */
  canComment?: boolean;
  onCommentAdded?: () => void;
}

const displayName = (c: PostCommentRow) => c.author_name?.trim() || "Member";

function CommentRow({
  comment,
  onReply,
  compact,
}: {
  comment: PostCommentRow;
  onReply?: () => void;
  compact?: boolean;
}) {
  const name = displayName(comment);
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
        <p className="whitespace-pre-wrap break-words text-sm">{comment.content}</p>
        {onReply && (
          <button
            type="button"
            onClick={onReply}
            className="mt-1 text-[12px] font-medium text-muted-foreground hover:text-primary"
          >
            Reply
          </button>
        )}
      </div>
    </div>
  );
}

export function CommentsSheet({ open, onOpenChange, postId, onCommentAdded }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<PostCommentRow[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [replyTo, setReplyTo] = useState<PostCommentRow | null>(null);
  const vvHeight = useVisualViewportHeight();
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const threads = useMemo(() => buildThreads(comments), [comments]);

  // Keep the newest reply and the caret visible when the iOS keyboard opens.
  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [open, comments.length, vvHeight]);


  useEffect(() => {
    if (!open) return;
    setReplyTo(null);
    setLoading(true);
    listComments(postId)
      .then(setComments)
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [open, postId]);

  const startReply = (c: PostCommentRow) => {
    setReplyTo(c);
    inputRef.current?.focus();
  };

  const submit = async () => {
    if (!user || !text.trim() || sending) return;
    setSending(true);
    try {
      const c = await addComment(postId, user.id, text.trim(), replyTo?.id ?? null);
      setComments((arr) => [...arr, c]);
      setText("");
      setReplyTo(null);
      if (inputRef.current) inputRef.current.style.height = "auto";

      onCommentAdded?.();
    } catch (e) {
      toast({ title: "Couldn't post reply", description: e instanceof Error ? e.message : "", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="flex flex-col gap-0 overscroll-contain p-4 pb-[env(safe-area-inset-bottom,0px)]"
        style={{ height: vvHeight ? Math.min(vvHeight - 8, vvHeight * 0.92) : "80vh", maxHeight: "100dvh" }}
      >
        <SheetHeader className="shrink-0">
          <SheetTitle>
            Replies{comments.length > 0 ? ` · ${comments.length}` : ""}
          </SheetTitle>
        </SheetHeader>
        <div ref={listRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain py-3">

          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin" /></div>
          ) : threads.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No replies yet — start the conversation.</p>
          ) : (
            threads.map((t) => (
              <div key={t.comment.id} className="space-y-3">
                <CommentRow comment={t.comment} onReply={user ? () => startReply(t.comment) : undefined} />
                {t.children.length > 0 && (
                  <div className="ml-6 space-y-3 border-l border-border pl-4">
                    {t.children.map((child) => (
                      <CommentRow
                        key={child.id}
                        comment={child}
                        compact
                        onReply={user ? () => startReply(t.comment) : undefined}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        {user ? (
          <div className="shrink-0 border-t border-border pt-3">
            {replyTo && (
              <div className="mb-2 flex items-center gap-2 text-[12px] text-muted-foreground">
                <span className="truncate">Replying to <span className="font-medium text-foreground">{displayName(replyTo)}</span></span>
                <button type="button" onClick={() => setReplyTo(null)} aria-label="Cancel reply" className="rounded-full p-1 hover:bg-muted">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                rows={1}
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  const el = e.currentTarget;
                  el.style.height = "auto";
                  el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
                }}
                placeholder={replyTo ? `Reply to ${displayName(replyTo)}…` : "Post your reply…"}
                enterKeyHint="send"
                className="max-h-[120px] min-h-[42px] flex-1 resize-none rounded-2xl border border-input bg-background px-3 py-2.5 text-base leading-snug outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submit();
                  }
                }}
              />
              <Button size="icon" className="h-11 w-11 shrink-0 rounded-full" onClick={submit} disabled={sending || !text.trim()} aria-label="Send reply">
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        ) : (
          <p className="shrink-0 border-t border-border pt-3 text-center text-xs text-muted-foreground">
            <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link> to reply.
          </p>
        )}
      </SheetContent>
    </Sheet>
  );

}
