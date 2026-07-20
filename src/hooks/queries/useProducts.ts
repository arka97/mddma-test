import { useQuery } from "@tanstack/react-query";
import { listProducts, getProductBySlug } from "@/repositories/products";
import { mergeProducts } from "@/lib/dataSource";
import { qk } from "@/lib/queryKeys";

interface ProductQueryOptions {
  companyId?: string;
  category?: string;
  enabled?: boolean;
}

export function useProducts(opts: ProductQueryOptions = {}) {
  const { companyId, category, enabled = true } = opts;
  return useQuery({
    queryKey: qk.products.list({ companyId, category }),
    queryFn: async () => mergeProducts(await listProducts({ companyId, category })),
    enabled,
  });
}

export function useProductBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: qk.products.bySlug(slug ?? ""),
    queryFn: () => getProductBySlug(slug as string),
    enabled: Boolean(slug),
  });
}
