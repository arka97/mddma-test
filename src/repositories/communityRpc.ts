import { supabase } from "@/integrations/supabase/client";

export type CommunityRpcError = { message?: string; code?: string } | null;

type RpcResult<T> = Promise<{ data: T | null; error: CommunityRpcError }>;

// The migration in this branch introduces these RPCs. Lovable should regenerate
// Supabase types after applying it, then replace this adapter with typed calls.
export function callCommunityRpc<T>(name: string, args: Record<string, unknown>) {
  return (supabase.rpc as unknown as (
    fn: string,
    params: Record<string, unknown>,
  ) => RpcResult<T>)(name, args);
}
