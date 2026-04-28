import { useEffect, useState } from "react";
import { listCirculars } from "@/repositories/circulars";
import { listAdsByPlacement } from "@/repositories/advertisements";
import { listPosts } from "@/repositories/posts";

export function useCirculars(publishedOnly = true) {
  const [data, setData] = useState<Awaited<ReturnType<typeof listCirculars>>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;

    const run = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const circulars = await listCirculars({ publishedOnly });
        if (active) setData(circulars);
      } catch (err) {
        if (active) setError(err instanceof Error ? err : new Error("Failed to load circulars"));
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void run();
    return () => {
      active = false;
    };
  }, [publishedOnly]);

  return { data, isLoading, error };
}

export function useAds(placement: string) {
  const [data, setData] = useState<Awaited<ReturnType<typeof listAdsByPlacement>>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!placement) {
      setData([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    let active = true;

    const run = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const ads = await listAdsByPlacement(placement);
        if (active) setData(ads);
      } catch (err) {
        if (active) setError(err instanceof Error ? err : new Error("Failed to load ads"));
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void run();
    return () => {
      active = false;
    };
  }, [placement]);

  return { data, isLoading, error };
}

export function usePosts(category?: string) {
  const [data, setData] = useState<Awaited<ReturnType<typeof listPosts>>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;

    const run = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const posts = await listPosts(category);
        if (active) setData(posts);
      } catch (err) {
        if (active) setError(err instanceof Error ? err : new Error("Failed to load posts"));
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void run();
    return () => {
      active = false;
    };
  }, [category]);

  return { data, isLoading, error };
}
