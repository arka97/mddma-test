import { useQuery } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { listProducts, getProductBySlug } from "@/repositories/products";
import { mergeProducts, type ProductEntry } from "@/lib/dataSource";

const STALE = 60_000;

export function useProducts(opts: { companyId?: string; category?: string } = {}) {
  return useQuery({
    queryKey: qk.products.list(opts),
    queryFn: async (): Promise<ProductEntry[]> => {
      const live = await listProducts(opts);
      return mergeProducts(live, opts);
    },
    staleTime: STALE,
  });
}

export function useProductBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: qk.products.bySlug(slug ?? ""),
    queryFn: () => getProductBySlug(slug!),
    enabled: !!slug,
    staleTime: STALE,
  });
}
