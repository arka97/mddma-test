import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  url: string | null;
  group_count: number;
  read_at: string | null;
  created_at: string;
  actor_id: string | null;
  actor_name: string | null;
  actor_avatar: string | null;
}

export const notificationKeys = {
  all: ["notifications"] as const,
  list: (limit: number) => ["notifications", "list", limit] as const,
  unread: () => ["notifications", "unread"] as const,
  prefs: () => ["notifications", "prefs"] as const,
};

/** Older notification rows point at /post/:id; the live route is /market/:id. */
export function notificationHref(n: AppNotification): string {
  const url = n.url ?? "/notifications";
  return url.startsWith("/post/") ? url.replace("/post/", "/market/") : url;
}

export function useNotifications(limit = 30) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const list = useQuery({
    queryKey: notificationKeys.list(limit),
    enabled: Boolean(user),
    queryFn: async (): Promise<AppNotification[]> => {
      const { data, error } = await supabase.rpc("list_my_notifications", { _limit: limit });
      if (error) throw error;
      return (data ?? []) as AppNotification[];
    },
  });

  const unread = useQuery({
    queryKey: notificationKeys.unread(),
    enabled: Boolean(user),
    queryFn: async (): Promise<number> => {
      const { data, error } = await supabase.rpc("count_my_unread_notifications");
      if (error) throw error;
      return (data as number) ?? 0;
    },
  });

  // Live badge: refresh whenever a row lands for this user.
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`notifications:${user.id}:${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `recipient_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: notificationKeys.all });
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  const markRead = useMutation({
    mutationFn: async (ids?: string[]) => {
      const { error } = await supabase.rpc("mark_notifications_read", { _ids: ids ?? null });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
  });

  return {
    notifications: list.data ?? [],
    isLoading: list.isLoading,
    unreadCount: unread.data ?? 0,
    markRead: (ids?: string[]) => markRead.mutate(ids),
    markAllRead: () => markRead.mutate(undefined),
  };
}

export interface NotificationPrefs {
  personal: boolean;
  deals: boolean;
  announcements: boolean;
  market: boolean;
}

const defaultPrefs: NotificationPrefs = {
  personal: true,
  deals: true,
  announcements: true,
  market: true,
};

export function useNotificationPreferences() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: notificationKeys.prefs(),
    enabled: Boolean(user),
    queryFn: async (): Promise<NotificationPrefs> => {
      const { data, error } = await supabase
        .from("notification_preferences")
        .select("personal,deals,announcements,market")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data ?? defaultPrefs;
    },
  });

  const update = useMutation({
    mutationFn: async (patch: Partial<NotificationPrefs>) => {
      const next = { ...(query.data ?? defaultPrefs), ...patch };
      const { error } = await supabase
        .from("notification_preferences")
        .upsert({ user_id: user!.id, ...next }, { onConflict: "user_id" });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.prefs() }),
  });

  return {
    prefs: query.data ?? defaultPrefs,
    isLoading: query.isLoading,
    setPref: (patch: Partial<NotificationPrefs>) => update.mutate(patch),
    isSaving: update.isPending,
  };
}
