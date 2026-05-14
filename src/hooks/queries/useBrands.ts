import { useQuery } from "@tanstack/react-query";
import { listBrands, getBrandBySlug, listBrandsByCompany } from "@/repositories/brands";

export function useBrands(opts: { featuredOnly?: boolean; companyId?: string } = {}) {
  return useQuery({
    queryKey: ["brands", "list", opts],
    queryFn: () => listBrands(opts),
  });
}

export function useBrandBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["brands", "slug", slug ?? ""],
    queryFn: () => getBrandBySlug(slug as string),
    enabled: Boolean(slug),
  });
}

export function useBrandsByCompany(companyId: string | undefined) {
  return useQuery({
    queryKey: ["brands", "company", companyId ?? ""],
    queryFn: () => listBrandsByCompany(companyId as string),
    enabled: Boolean(companyId),
  });
}
