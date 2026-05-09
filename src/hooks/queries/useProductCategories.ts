import { useQuery } from "@tanstack/react-query";
import { listCategories } from "@/repositories/productCategories";
import { qk } from "@/lib/queryKeys";

export function useProductCategories(opts: { activeOnly?: boolean; featuredOnly?: boolean } = {}) {
  const { activeOnly, featuredOnly } = opts;
  return useQuery({
    queryKey: qk.productCategories.list({ activeOnly, featuredOnly }),
    queryFn: () => listCategories({ activeOnly, featuredOnly }),
  });
}
