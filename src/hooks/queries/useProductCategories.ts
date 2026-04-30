import { useEffect, useState } from "react";
import { listCategories, type ProductCategoryRow } from "@/repositories/productCategories";

export function useProductCategories(opts: { activeOnly?: boolean; featuredOnly?: boolean } = {}) {
  const { activeOnly, featuredOnly } = opts;
  const [data, setData] = useState<ProductCategoryRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    listCategories({ activeOnly, featuredOnly })
      .then((rows) => { if (active) setData(rows); })
      .catch((err) => { if (active) setError(err instanceof Error ? err : new Error("Failed to load categories")); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [activeOnly, featuredOnly, reloadKey]);

  return { data, isLoading, error, reload: () => setReloadKey((k) => k + 1) };
}
