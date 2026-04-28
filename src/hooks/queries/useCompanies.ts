import { useEffect, useState } from "react";
import { listCompanies, getCompanyBySlug, getCompanyByOwner } from "@/repositories/companies";
import { mergeDirectory, type DirectoryEntry } from "@/lib/dataSource";

const EMPTY_DIRECTORY: DirectoryEntry[] = [];

export function useDirectory() {
  const [data, setData] = useState<DirectoryEntry[]>(EMPTY_DIRECTORY);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;

    const run = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const live = await listCompanies();
        if (active) setData(mergeDirectory(live));
      } catch (err) {
        if (active) setError(err instanceof Error ? err : new Error("Failed to load companies"));
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void run();
    return () => {
      active = false;
    };
  }, []);

  return { data, isLoading, error };
}

export function useCompanyBySlug(slug: string | undefined) {
  const [data, setData] = useState<Awaited<ReturnType<typeof getCompanyBySlug>>>(null);
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
        const company = await getCompanyBySlug(slug);
        if (active) setData(company);
      } catch (err) {
        if (active) setError(err instanceof Error ? err : new Error("Failed to load company"));
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

export function useCompanyByOwner(ownerId: string | undefined) {
  const [data, setData] = useState<Awaited<ReturnType<typeof getCompanyByOwner>>>(null);
  const [isLoading, setIsLoading] = useState(Boolean(ownerId));
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!ownerId) {
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
        const company = await getCompanyByOwner(ownerId);
        if (active) setData(company);
      } catch (err) {
        if (active) setError(err instanceof Error ? err : new Error("Failed to load company"));
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void run();
    return () => {
      active = false;
    };
  }, [ownerId]);

  return { data, isLoading, error };
}