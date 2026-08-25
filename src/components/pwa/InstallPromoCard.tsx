import { useState } from "react";
import { Download, Share, Plus, X, Zap, Bell, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInstallVisibility } from "@/hooks/useInstallVisibility";
import { cn } from "@/lib/utils";

interface InstallPromoCardProps {
  /** `card` = full promo block, `strip` = single compact row. */
  variant?: "card" | "strip";
  className?: string;
}

/**
 * Prominent "install the app" promo. Shown in the home feed and on Discover.
 * Hidden for installed users and for anyone who dismissed an install nudge.
 */
export function InstallPromoCard({ variant = "card", className }: InstallPromoCardProps) {
  const { showNudge, dismiss, canInstall, isIOS, isIOSSafari, promptInstall } = useInstallVisibility();
  const [busy, setBusy] = useState(false);
  const [showIosSteps, setShowIosSteps] = useState(false);

  if (!showNudge) return null;

  const iosOnly = isIOS && !canInstall;

  const handleInstall = async () => {
    if (canInstall) {
      setBusy(true);
      const ok = await promptInstall();
      setBusy(false);
      if (ok) dismiss();
      return;
    }
    setShowIosSteps(true);
  };

  if (variant === "strip") {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border border-[hsl(var(--gold))]/40 bg-[hsl(var(--gold))]/8 px-3 py-2.5",
          className,
        )}
      >
        <img src="/icon-192.png" alt="" className="h-8 w-8 rounded-lg" />
        <p className="min-w-0 flex-1 text-xs font-medium text-foreground">
          Install G-BAU-G for one-tap access
        </p>
        <Button size="sm" className="h-8 shrink-0" onClick={handleInstall} disabled={busy}>
          <Download className="mr-1 h-3.5 w-3.5" /> Install
        </Button>
        <button onClick={dismiss} aria-label="Dismiss" className="shrink-0 rounded p-1 text-muted-foreground hover:bg-muted">
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[hsl(var(--gold))]/40 bg-[hsl(var(--gold))]/8 p-4",
        className,
      )}
    >
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute right-2 top-2 rounded-full p-1 text-muted-foreground hover:bg-muted"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-start gap-3 pr-6">
        <img src="/icon-192.png" alt="" className="h-11 w-11 rounded-xl shadow-sm" />
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-foreground">Install the G-BAU-G app</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Members who install it open the market 3× more often.
          </p>
        </div>
      </div>

      <ul className="mt-3 grid gap-1.5 text-xs text-muted-foreground sm:grid-cols-3">
        <li className="flex items-center gap-1.5">
          <Home className="h-3.5 w-3.5 text-gold-dark" /> Home-screen icon
        </li>
        <li className="flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 text-gold-dark" /> Opens fullscreen, faster
        </li>
        <li className="flex items-center gap-1.5">
          <Bell className="h-3.5 w-3.5 text-gold-dark" /> Reliable rate alerts
        </li>
      </ul>

      {showIosSteps || iosOnly ? (
        <ol className="mt-3 space-y-1 rounded-lg bg-card p-3 text-xs text-muted-foreground">
          {isIOS && !isIOSSafari && (
            <li className="font-medium text-foreground">Open this page in Safari first.</li>
          )}
          <li>
            1. Tap <Share className="inline h-3.5 w-3.5 align-text-bottom" /> <b className="text-foreground">Share</b>
          </li>
          <li>
            2. Tap <Plus className="inline h-3.5 w-3.5 align-text-bottom" />{" "}
            <b className="text-foreground">Add to Home Screen</b>
          </li>
          <li>
            3. Tap <b className="text-foreground">Add</b>
          </li>
        </ol>
      ) : (
        <Button className="mt-3 w-full font-semibold" onClick={handleInstall} disabled={busy}>
          <Download className="mr-1.5 h-4 w-4" />
          {busy ? "Installing…" : "Install app"}
        </Button>
      )}
    </div>
  );
}
