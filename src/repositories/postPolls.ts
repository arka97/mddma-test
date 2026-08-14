import { supabase } from "@/integrations/supabase/client";
import { friendlyErrorMessage } from "@/lib/errors";

export interface PollOption {
  id: string;
  idx: number;
  label: string;
  votes: number;
}

export interface PollData {
  id: string;
  post_id: string;
  question: string;
  closes_at: string;
  options: PollOption[];
  totalVotes: number;
  myOptionId: string | null;
}

export async function createPollForPost(params: {
  postId: string;
  question: string;
  options: string[];
  durationDays: number;
}): Promise<void> {
  const closesAt = new Date(Date.now() + params.durationDays * 86400000).toISOString();
  const { data: poll, error: e1 } = await supabase
    .from("post_polls")
    .insert({ post_id: params.postId, question: params.question, closes_at: closesAt })
    .select("id")
    .single();
  if (e1) throw new Error(friendlyErrorMessage(e1));
  const rows = params.options.map((label, idx) => ({ poll_id: poll!.id, idx, label }));
  const { error: e2 } = await supabase.from("post_poll_options").insert(rows);
  if (e2) throw new Error(friendlyErrorMessage(e2));
}

type RpcFn = (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>;

interface PollRpcRow {
  poll_id: string;
  post_id: string;
  question: string;
  closes_at: string;
  option_id: string;
  option_index: number;
  option_label: string;
  vote_count: number;
  voted: boolean;
}

export async function getPollByPostId(postId: string, _viewerId: string | null): Promise<PollData | null> {
  const { data, error } = await (supabase.rpc as unknown as RpcFn)("get_business_poll", { _post_id: postId });
  if (error) return null;
  const rows = (data ?? []) as PollRpcRow[];
  if (rows.length === 0) return null;
  let myOptionId: string | null = null;
  let totalVotes = 0;
  const options: PollOption[] = rows.map((r) => {
    const votes = Number(r.vote_count) || 0;
    totalVotes += votes;
    if (r.voted) myOptionId = r.option_id;
    return { id: r.option_id, idx: r.option_index, label: r.option_label, votes };
  });
  return {
    id: rows[0].poll_id,
    post_id: rows[0].post_id,
    question: rows[0].question,
    closes_at: rows[0].closes_at,
    options,
    totalVotes,
    myOptionId,
  };
}

export async function castPollVote(pollId: string, optionId: string, _voterId?: string): Promise<void> {
  const { error } = await (supabase.rpc as unknown as RpcFn)("cast_business_poll_vote", {
    _poll_id: pollId,
    _option_id: optionId,
  });
  if (error) throw new Error(friendlyErrorMessage(error as never));
}
