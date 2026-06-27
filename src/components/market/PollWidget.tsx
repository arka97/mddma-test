import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { getPollByPostId, castPollVote, type PollData } from "@/repositories/postPolls";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Props {
  postId: string;
  canVote: boolean;
}

export function PollWidget({ postId, canVote }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [poll, setPoll] = useState<PollData | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const p = await getPollByPostId(postId, user?.id ?? null);
    setPoll(p);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [postId, user?.id]);

  if (loading) return <div className="mt-2 h-24 rounded-md border border-border/60 bg-muted/20 animate-pulse" />;
  if (!poll) return null;

  const closed = new Date(poll.closes_at).getTime() < Date.now();
  const showResults = !!poll.myOptionId || closed;

  const vote = async (optionId: string) => {
    if (!canVote || !user) { toast({ title: "Paid members only" }); return; }
    if (closed) return;
    setVoting(optionId);
    try {
      await castPollVote(poll.id, optionId, user.id);
      await load();
    } catch (e) {
      toast({ title: "Vote failed", description: e instanceof Error ? e.message : "", variant: "destructive" });
    } finally {
      setVoting(null);
    }
  };

  return (
    <div className="mt-2 rounded-md border border-border/60 bg-card p-3">
      <div className="text-sm font-semibold text-foreground">{poll.question}</div>
      <div className="mt-2 space-y-1.5">
        {poll.options.map((o) => {
          const pct = poll.totalVotes > 0 ? Math.round((o.votes / poll.totalVotes) * 100) : 0;
          const mine = poll.myOptionId === o.id;
          if (showResults) {
            return (
              <div key={o.id} className="relative overflow-hidden rounded-md border border-border/60 px-3 py-2 text-xs">
                <div
                  className={cn("absolute inset-y-0 left-0", mine ? "bg-primary/20" : "bg-muted/60")}
                  style={{ width: `${pct}%` }}
                  aria-hidden
                />
                <div className="relative flex items-center justify-between">
                  <span className={cn("font-medium", mine && "text-foreground")}>{o.label}{mine && " ✓"}</span>
                  <span className="tabular-nums text-muted-foreground">{pct}% · {o.votes}</span>
                </div>
              </div>
            );
          }
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => vote(o.id)}
              disabled={voting !== null || !canVote}
              className="w-full rounded-md border border-border/60 px-3 py-2 text-left text-xs font-medium hover:border-primary hover:bg-primary/5 disabled:opacity-60"
            >
              {o.label}
            </button>
          );
        })}
      </div>
      <div className="mt-2 text-[11px] text-muted-foreground">
        {poll.totalVotes} vote{poll.totalVotes === 1 ? "" : "s"} ·{" "}
        {closed ? "Closed" : `Closes ${formatDistanceToNow(new Date(poll.closes_at), { addSuffix: true })}`}
      </div>
    </div>
  );
}
