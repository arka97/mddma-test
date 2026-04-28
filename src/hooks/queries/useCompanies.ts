import { useQuery } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { listCompanies, getCompanyBySlug, getCompanyByOwner } from "@/repositories/companies";
import { mergeDirectory, type DirectoryEntry } from "@/lib/dataSource";

const STALE = 60_000;

/** Live companies merged with sample directory (live wins on slug conflict). */
export function useDirectory() {
  return useQuery({
    queryKey: qk.companies.list(),
    queryFn: async (): Promise<DirectoryEntry[]> => {
      const live = await listCompanies();
      return mergeDirectory(live);
    },
    staleTime: STALE,
  });
}

export function useCompanyBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: qk.companies.bySlug(slug ?? ""),
    queryFn: () => getCompanyBySlug(slug!),
    enabled: !!slug,
    staleTime: STALE,
  });
}

export function useCompanyByOwner(ownerId: string | undefined) {
  return useQuery({
    queryKey: qk.companies.byOwner(ownerId ?? ""),
    queryFn: () => getCompanyByOwner(ownerId!),
    enabled: !!ownerId,
    staleTime: STALE,
  });
}
