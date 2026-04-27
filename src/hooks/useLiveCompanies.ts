import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { mergeDirectory, type DirectoryEntry } from "@/lib/directoryAdapter";

export function useLiveCompanies() {
  const [entries, setEntries] = useState<DirectoryEntry[]>(() => mergeDirectory([]));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    supabase
      .from("companies")
      .select("id,slug,name,tagline,description,logo_url,city,state,address,email,phone,website,gstin,established_year,categories,certifications,is_verified,is_hidden,membership_tier")
      .eq("is_hidden", false)
      .order("is_verified", { ascending: false })
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!alive) return;
        setEntries(mergeDirectory(data ?? []));
        setLoading(false);
      });
    return () => { alive = false; };
  }, []);

  return { entries, loading };
}
