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

export async function getPollByPostId(postId: string, viewerId: string | null): Promise<PollData | null> {
  const { data: poll, error } = await supabase
    .from("post_polls")
    .select("id, post_id, question, closes_at")
    .eq("post_id", postId)
    .maybeSingle();
  if (error || !poll) return null;
  const { data: opts } = await supabase
    .from("post_poll_options")
    .select("id, idx, label")
    .eq("poll_id", poll.id)
    .order("idx", { ascending: true });
  const { data: votes } = await supabase
    .from("post_poll_votes")
    .select("option_id, voter_id")
    .eq("poll_id", poll.id);
  const tally: Record<string, number> = {};
  let myOptionId: string | null = null;
  (votes ?? []).forEach((v) => {
    tally[v.option_id] = (tally[v.option_id] ?? 0) + 1;
    if (viewerId && v.voter_id === viewerId) myOptionId = v.option_id;
  });
  const options: PollOption[] = (opts ?? []).map((o) => ({
    id: o.id,
    idx: o.idx,
    label: o.label,
    votes: tally[o.id] ?? 0,
  }));
  return {
    id: poll.id,
    post_id: poll.post_id,
    question: poll.question,
    closes_at: poll.closes_at,
    options,
    totalVotes: (votes ?? []).length,
    myOptionId,
  };
}

export async function castPollVote(pollId: string, optionId: string, voterId: string): Promise<void> {
  const { error } = await supabase
    .from("post_poll_votes")
    .insert({ poll_id: pollId, option_id: optionId, voter_id: voterId });
  if (error) throw new Error(friendlyErrorMessage(error));
}
