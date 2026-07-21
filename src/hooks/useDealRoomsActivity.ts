import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const STORAGE_KEY = "gbaug:deals:last-seen";

function readSeen(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? Number(raw) || 0 : 0;
  } catch {
    return 0;
  }
}

function writeSeen(ts: number) {
  try {
    localStorage.setItem(STORAGE_KEY, String(ts));
  } catch {
    /* ignore */
  }
}

/**
 * Lightweight "new activity" signal for the header Messages button.
 *
 * Returns true when any deal_room the current user can read has a
 * last_message_at newer than the timestamp we last stamped when they
 * visited /messages. Persists across reloads via localStorage.
 *
 * Deliberately coarse — no per-room unread counts, no realtime — the
 * point is just to nudge the user to open the inbox.
 */
export function useDealRoomsActivity() {
  const { user } = useAuth();
  const location = useLocation();
  const [latest, setLatest] = useState<number>(0);
  const [seen, setSeen] = useState<number>(() => readSeen());

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("deal_rooms")
        .select("last_message_at")
        .order("last_message_at", { ascending: false })
        .limit(1);
      if (cancelled) return;
      const ts = data?.[0]?.last_message_at ? new Date(data[0].last_message_at).getTime() : 0;
      setLatest(ts);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, location.pathname]);

  // When the user opens the inbox, mark everything up to now as seen.
  useEffect(() => {
    if (location.pathname.startsWith("/messages")) {
      const now = Date.now();
      writeSeen(now);
      setSeen(now);
    }
  }, [location.pathname]);

  return {
    hasActivity: !!user && latest > 0 && latest > seen,
  };
}
