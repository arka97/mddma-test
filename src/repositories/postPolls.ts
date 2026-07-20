import { friendlyErrorMessage } from "@/lib/errors";
import { callCommunityRpc } from "@/repositories/communityRpc";

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

interface BusinessPollRpcRow {
  poll_id: string;
  post_id: string;
  question: string;
  closes_at: string;
  option_id: string;
  option_index: number;
  option_label: string;
  vote_count: number | string;
  voted: boolean;
}

export async function getPollByPostId(postId: string, _viewerId: string | null): Promise<PollData | null> {
  const { data, error } = await callCommunityRpc<BusinessPollRpcRow[]>("get_business_poll", {
    _post_id: postId,
  });
  if (error) throw new Error(friendlyErrorMessage(error));
  if (!data?.length) return null;

  const first = data[0];
  const options: PollOption[] = data.map((row) => ({
    id: row.option_id,
    idx: row.option_index,
    label: row.option_label,
    votes: Number(row.vote_count) || 0,
  }));
  const selected = data.find((row) => row.voted);

  return {
    id: first.poll_id,
    post_id: first.post_id,
    question: first.question,
    closes_at: first.closes_at,
    options,
    totalVotes: options.reduce((sum, option) => sum + option.votes, 0),
    myOptionId: selected?.option_id ?? null,
  };
}

export async function castPollVote(pollId: string, optionId: string, _voterId?: string): Promise<void> {
  const { error } = await callCommunityRpc<string>("cast_business_poll_vote", {
    _poll_id: pollId,
    _option_id: optionId,
  });
  if (error) throw new Error(friendlyErrorMessage(error));
}
