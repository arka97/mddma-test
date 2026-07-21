import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Lightweight subscription to public app_settings flags.
 * Currently exposes the single `features_open_to_all` switch that lets
 * admins open every paid feature to all users (guests + free) temporarily.
 */
export function useFeaturesOpenFlag() {
  const [openToAll, setOpenToAll] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { data } = await supabase
        .from("app_settings")
        .select("value")
        .eq("key", "features_open_to_all")
        .maybeSingle();
      if (!mounted) return;
      setOpenToAll(data?.value === true);
      setLoading(false);
    };
    load();

    const channel = supabase
      .channel("app_settings_features_open")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "app_settings", filter: "key=eq.features_open_to_all" },
        (payload) => {
          const next = (payload.new as { value?: unknown } | null)?.value;
          setOpenToAll(next === true);
        },
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return { openToAll, loading };
}

export async function setFeaturesOpenFlag(open: boolean) {
  const { error } = await supabase
    .from("app_settings")
    .update({ value: open as unknown as never })
    .eq("key", "features_open_to_all");
  if (error) throw error;
}

/**
 * When ON, any signed-in user is treated as a verified business —
 * they can post, comment, vote polls, upload media, quote RFQs and
 * start deal rooms without submitting business evidence.
 */
export function useVerificationOpenFlag() {
  const [openToAll, setOpenToAll] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { data } = await supabase
        .from("app_settings")
        .select("value")
        .eq("key", "verification_open_to_all")
        .maybeSingle();
      if (!mounted) return;
      setOpenToAll(data?.value === true);
      setLoading(false);
    };
    load();

    const channel = supabase
      .channel("app_settings_verification_open")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "app_settings", filter: "key=eq.verification_open_to_all" },
        (payload) => {
          const next = (payload.new as { value?: unknown } | null)?.value;
          setOpenToAll(next === true);
        },
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return { openToAll, loading };
}

export async function setVerificationOpenFlag(open: boolean) {
  const { error } = await supabase
    .from("app_settings")
    .update({ value: open as unknown as never })
    .eq("key", "verification_open_to_all");
  if (error) throw error;
}

