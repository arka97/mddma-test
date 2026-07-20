import { useQuery } from "@tanstack/react-query";
import {
  getCompanyById,
  getCompanyByOwner,
  getCompanyBySlug,
  listCompanies,
} from "@/repositories/companies";
import { mergeDirectory } from "@/lib/dataSource";
import { qk } from "@/lib/queryKeys";

export function useDirectory() {
  return useQuery({
    queryKey: qk.companies.list(),
    queryFn: async () => mergeDirectory(await listCompanies()),
  });
}

export function useCompanyById(id: string | undefined) {
  return useQuery({
    queryKey: qk.companies.byId(id ?? ""),
    queryFn: () => getCompanyById(id as string),
    enabled: Boolean(id),
  });
}

export function useCompanyBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: qk.companies.bySlug(slug ?? ""),
    queryFn: () => getCompanyBySlug(slug as string),
    enabled: Boolean(slug),
  });
}

export function useCompanyByOwner(ownerId: string | undefined) {
  return useQuery({
    queryKey: qk.companies.byOwner(ownerId ?? ""),
    queryFn: () => getCompanyByOwner(ownerId as string),
    enabled: Boolean(ownerId),
  });
}
