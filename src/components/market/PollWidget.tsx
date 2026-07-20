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
    try {
      setPoll(await getPollByPostId(postId, user?.id ?? null));
    } catch {
      setPoll(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId, user?.id]);

  if (loading) return <div className="mt-3 h-24 animate-pulse rounded-xl border border-border/60 bg-muted/20" />;
  if (!poll) return null;

  const closed = new Date(poll.closes_at).getTime() < Date.now();
  const showResults = Boolean(poll.myOptionId) || closed;

  const vote = async (optionId: string) => {
    if (!canVote || !user) {
      toast({
        title: "Verified business required",
        description: "Complete business verification to vote in community polls.",
      });
      return;
    }
    if (closed) return;

    setVoting(optionId);
    try {
      await castPollVote(poll.id, optionId);
      await load();
    } catch (error) {
      toast({
        title: "Vote could not be saved",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setVoting(null);
    }
  };

  return (
    <div className="mt-3 rounded-xl border border-border/60 bg-card p-3">
      <div className="text-sm font-semibold text-foreground">{poll.question}</div>
      <div className="mt-2 space-y-1.5">
        {poll.options.map((option) => {
          const percentage = poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0;
          const selected = poll.myOptionId === option.id;

          if (showResults) {
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => vote(option.id)}
                disabled={closed || voting !== null || !canVote}
                className="relative w-full overflow-hidden rounded-lg border border-border/60 px-3 py-2 text-left text-xs disabled:cursor-default"
              >
                <span
                  className={cn("absolute inset-y-0 left-0", selected ? "bg-primary/20" : "bg-muted/60")}
                  style={{ width: `${percentage}%` }}
                  aria-hidden
                />
                <span className="relative flex items-center justify-between gap-3">
                  <span className={cn("font-medium", selected && "text-foreground")}>
                    {option.label}{selected ? " ✓" : ""}
                  </span>
                  <span className="tabular-nums text-muted-foreground">{percentage}% · {option.votes}</span>
                </span>
              </button>
            );
          }

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => vote(option.id)}
              disabled={voting !== null || !canVote}
              className="w-full rounded-lg border border-border/60 px-3 py-2 text-left text-xs font-medium hover:border-primary hover:bg-primary/5 disabled:opacity-60"
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <div className="mt-2 text-[11px] text-muted-foreground">
        {poll.totalVotes} vote{poll.totalVotes === 1 ? "" : "s"} · {closed
          ? "Closed"
          : `Closes ${formatDistanceToNow(new Date(poll.closes_at), { addSuffix: true })}`}
      </div>
      {!canVote && !closed && (
        <p className="mt-1 text-[10px] text-muted-foreground">Verified businesses can vote; voter identities are not displayed.</p>
      )}
    </div>
  );
}
