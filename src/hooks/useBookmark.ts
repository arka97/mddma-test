import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

/** Hook: is this post bookmarked by the current user? */
export function useBookmark(postId: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!user || !postId) {
      setBookmarked(false);
      return;
    }
    (async () => {
      const { data } = await supabase
        .from("post_bookmarks")
        .select("post_id")
        .eq("user_id", user.id)
        .eq("post_id", postId)
        .maybeSingle();
      if (!cancelled) setBookmarked(!!data);
    })();
    return () => {
      cancelled = true;
    };
  }, [user, postId]);

  const toggle = useCallback(async () => {
    if (!user) {
      toast({ title: "Sign in to bookmark posts" });
      return;
    }
    setLoading(true);
    // Optimistic
    const next = !bookmarked;
    setBookmarked(next);
    const { error } = next
      ? await supabase.from("post_bookmarks").insert({ user_id: user.id, post_id: postId })
      : await supabase
          .from("post_bookmarks")
          .delete()
          .eq("user_id", user.id)
          .eq("post_id", postId);
    setLoading(false);
    if (error) {
      setBookmarked(!next);
      toast({ title: "Couldn't update bookmark", description: error.message, variant: "destructive" });
    } else if (next) {
      toast({ title: "Saved to your bookmarks" });
    }
  }, [bookmarked, postId, user, toast]);

  return { bookmarked, toggle, loading };
}
