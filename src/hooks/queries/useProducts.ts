import { useEffect, useMemo, useState } from "react";
import { listProducts, getProductBySlug } from "@/repositories/products";
import { mergeProducts, type ProductEntry } from "@/lib/dataSource";

export function useProducts(opts: { companyId?: string; category?: string } = {}) {
  const stableOpts = useMemo(
    () => ({ companyId: opts.companyId, category: opts.category }),
    [opts.companyId, opts.category]
  );
  const [data, setData] = useState<ProductEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;

    const run = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const live = await listProducts(stableOpts);
        if (active) setData(mergeProducts(live));
      } catch (err) {
        if (active) setError(err instanceof Error ? err : new Error("Failed to load products"));
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void run();
    return () => {
      active = false;
    };
  }, [stableOpts]);

  return { data, isLoading, error };
}

export function useProductBySlug(slug: string | undefined) {
  const [data, setData] = useState<Awaited<ReturnType<typeof getProductBySlug>>>(null);
  const [isLoading, setIsLoading] = useState(Boolean(slug));
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!slug) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    let active = true;

    const run = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const product = await getProductBySlug(slug);
        if (active) setData(product);
      } catch (err) {
        if (active) setError(err instanceof Error ? err : new Error("Failed to load product"));
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void run();
    return () => {
      active = false;
    };
  }, [slug]);

  return { data, isLoading, error };
}
