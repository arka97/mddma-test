import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Loader2 } from "lucide-react";
import { listComments, addComment, type PostCommentRow } from "@/repositories/postComments";
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

export function CommentsSheet({ open, onOpenChange, postId, onCommentAdded }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<PostCommentRow[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    listComments(postId)
      .then(setComments)
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [open, postId]);

  const submit = async () => {
    if (!user || !text.trim() || sending) return;
    setSending(true);
    try {
      const c = await addComment(postId, user.id, text.trim());
      setComments((arr) => [...arr, c]);
      setText("");
      onCommentAdded?.();
    } catch (e) {
      toast({ title: "Couldn't post reply", description: e instanceof Error ? e.message : "", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="flex h-[80vh] flex-col">
        <SheetHeader>
          <SheetTitle>
            Replies{comments.length > 0 ? ` · ${comments.length}` : ""}
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 space-y-4 overflow-y-auto py-3">
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin" /></div>
          ) : comments.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No replies yet — start the conversation.</p>
          ) : (
            comments.map((c) => {
              const name = c.author_name?.trim() || "Member";
              return (
                <div key={c.id} className="flex gap-3">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarImage src={c.author_avatar ?? undefined} alt={name} />
                    <AvatarFallback>{name.slice(0, 1).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-[13px]">
                      <span className="font-semibold">{name}</span>
                      <span className="text-muted-foreground">
                        · {shortTimeAgo(c.created_at)}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap break-words text-sm">{c.content}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {user ? (
          <div className="flex items-center gap-2 border-t border-border pt-3">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Post your reply…"
              onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
            />
            <Button size="icon" onClick={submit} disabled={sending || !text.trim()}>
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        ) : (
          <p className="border-t border-border pt-3 text-center text-xs text-muted-foreground">
            <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link> to reply.
          </p>
        )}
      </SheetContent>
    </Sheet>
  );
}
