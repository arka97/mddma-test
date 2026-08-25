import { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { enablePush, isPushEnabledHere, isStandalone, permissionState, pushSupport } from "@/lib/push";

const DISMISS_KEY = "gbaug:push-nudge-dismissed";

/**
 * Soft in-app prompt. The real browser permission dialog only fires when the
 * member taps "Turn on" — never on page load.
 */
export function EnablePushCard() {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (localStorage.getItem(DISMISS_KEY) === "1") return;
    if (pushSupport() !== "supported") return;
    if (permissionState() !== "default") return;
    isPushEnabledHere().then((on) => setVisible(!on));
  }, [user]);

  if (!visible || !user) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  };

  const turnOn = async () => {
    setBusy(true);
    try {
      await enablePush(user.id);
      toast.success("You'll now get notified on this device.");
      localStorage.setItem(DISMISS_KEY, "1");
      setVisible(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not turn on notifications.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative mx-3 mb-3 rounded-xl border border-border bg-card p-3 shadow-sm">
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-2 top-2 rounded-full p-1 text-muted-foreground hover:bg-muted"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-start gap-3 pr-6">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Bell className="h-4 w-4 text-primary" />
        </span>
        <div>
          <div className="text-sm font-semibold text-foreground">Get notified when someone replies</div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Replies, deal-room messages and new bulletins — even when the app is closed.
          </p>
          {!isStandalone() && (
            <p className="mt-1 text-[11px] text-muted-foreground">
              Tip: installing G-BAU-G on your home screen makes alerts far more reliable.
            </p>
          )}
          <Button size="sm" className="mt-2" onClick={turnOn} disabled={busy}>
            {busy ? "Turning on…" : "Turn on"}
          </Button>
        </div>
      </div>
    </div>
  );
}
