import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { listComments, addComment, type PostCommentRow } from "@/repositories/postComments";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  postId: string;
  canComment: boolean;
}

export function CommentsSheet({ open, onOpenChange, postId, canComment }: Props) {
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
    if (!user || !text.trim()) return;
    setSending(true);
    try {
      const c = await addComment(postId, user.id, text.trim());
      setComments((arr) => [...arr, c]);
      setText("");
    } catch (e) {
      toast({ title: "Failed", description: e instanceof Error ? e.message : "", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh] flex flex-col">
        <SheetHeader>
          <SheetTitle>Comments</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto py-3 space-y-3">
          {loading ? (
            <div className="flex justify-center py-10"><Loader2 className="h-5 w-5 animate-spin" /></div>
          ) : comments.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-10">No comments yet.</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="rounded-md border border-border/60 p-3">
                <div className="text-[11px] text-muted-foreground mb-1">
                  Member · {formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}
                </div>
                <p className="text-sm whitespace-pre-wrap">{c.content}</p>
              </div>
            ))
          )}
        </div>
        {canComment ? (
          <div className="flex items-center gap-2 border-t border-border pt-3">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a comment…"
              onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
            />
            <Button size="icon" onClick={submit} disabled={sending || !text.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <p className="border-t border-border pt-3 text-xs text-center text-muted-foreground">
            Paid members can comment.
          </p>
        )}
      </SheetContent>
    </Sheet>
  );
}
