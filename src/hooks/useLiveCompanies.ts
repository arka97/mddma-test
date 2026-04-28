// Compatibility shim — prefer useDirectory() from "@/hooks/queries/useCompanies"
// for new code. This hook is kept so existing imports keep working.
import { useDirectory } from "@/hooks/queries/useCompanies";
import type { DirectoryEntry } from "@/lib/dataSource";

export function useLiveCompanies(): { entries: DirectoryEntry[]; loading: boolean } {
  const { data, isLoading } = useDirectory();
  return { entries: data ?? [], loading: isLoading };
}
