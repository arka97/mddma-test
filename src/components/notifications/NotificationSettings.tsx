import { useEffect, useState } from "react";
import { BellRing, Loader2, Smartphone } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNotificationPreferences } from "@/hooks/useNotifications";
import {
  disablePush,
  enablePush,
  isPushEnabledHere,
  permissionState,
  pushSupport,
} from "@/lib/push";

const CATEGORIES: { key: "personal" | "deals" | "announcements" | "market"; label: string; hint: string }[] = [
  { key: "personal", label: "Replies, likes & follows", hint: "Activity on your own posts" },
  { key: "deals", label: "Deal rooms & RFQ", hint: "New messages and quotations" },
  { key: "announcements", label: "Association announcements", hint: "Bulletins and notices" },
  { key: "market", label: "Market signals", hint: "Price signals and market alerts" },
];

/** Device push switch plus per-category preferences. */
export function NotificationSettings() {
  const { user } = useAuth();
  const { prefs, setPref } = useNotificationPreferences();
  const [deviceOn, setDeviceOn] = useState(false);
  const [busy, setBusy] = useState(false);
  const support = pushSupport();

  useEffect(() => {
    isPushEnabledHere().then(setDeviceOn).catch(() => setDeviceOn(false));
  }, []);

  const toggleDevice = async (next: boolean) => {
    if (!user) return;
    setBusy(true);
    try {
      if (next) {
        await enablePush(user.id);
        setDeviceOn(true);
        toast.success("Push notifications are on for this device.");
      } else {
        await disablePush();
        setDeviceOn(false);
        toast.success("Push notifications turned off for this device.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update push notifications.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <BellRing className="h-4 w-4 text-gold-dark" />
          Notifications
        </CardTitle>
        <CardDescription>
          Choose what reaches you in the app and on your phone.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-lg border border-border bg-muted/40 p-3">
          {support === "supported" ? (
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-foreground">Push on this device</div>
                <p className="text-xs text-muted-foreground">
                  {permissionState() === "denied"
                    ? "Blocked in browser settings — allow notifications for this site first."
                    : "Get alerts even when the app is closed."}
                </p>
              </div>
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <Switch checked={deviceOn} onCheckedChange={toggleDevice} disabled={!user} />
              )}
            </div>
          ) : support === "needs-install" ? (
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <Smartphone className="mt-0.5 h-4 w-4 shrink-0 text-gold-dark" />
              <span>
                On iPhone, add G-BAU-G to your home screen first — then push notifications can be
                switched on here.
              </span>
              <Button asChild variant="outline" size="sm" className="ml-auto shrink-0">
                <a href="/install">How</a>
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {support === "preview"
                ? "Push notifications work in the installed app, not in the editor preview."
                : "This browser does not support push notifications."}
            </p>
          )}
        </div>

        <div className="space-y-4">
          {CATEGORIES.map((c) => (
            <div key={c.key} className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-medium text-foreground">{c.label}</div>
                <p className="text-xs text-muted-foreground">{c.hint}</p>
              </div>
              <Switch
                checked={prefs[c.key]}
                onCheckedChange={(v) => setPref({ [c.key]: v })}
                disabled={!user}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
