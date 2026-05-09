import { useQuery } from "@tanstack/react-query";
import { listProducts, getProductBySlug } from "@/repositories/products";
import { mergeProducts } from "@/lib/dataSource";
import { qk } from "@/lib/queryKeys";

export function useProducts(opts: { companyId?: string; category?: string } = {}) {
  const { companyId, category } = opts;
  return useQuery({
    queryKey: qk.products.list({ companyId, category }),
    queryFn: async () => mergeProducts(await listProducts({ companyId, category })),
  });
}

export function useProductBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: qk.products.bySlug(slug ?? ""),
    queryFn: () => getProductBySlug(slug as string),
    enabled: Boolean(slug),
  });
}
