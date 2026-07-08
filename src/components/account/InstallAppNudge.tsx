import { useState, useEffect } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";

const DISMISS_KEY = "mddma:install-nudge-dismissed";

export function InstallAppNudge() {
  const { canInstall, isInstalled, promptInstall } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
  }, []);

  if (isInstalled || !canInstall || dismissed) return null;

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
      <div className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--gold))]/15 text-[hsl(var(--gold-dark))]">
        <Smartphone className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">Install MDDMA on your phone</p>
        <p className="text-[11px] text-muted-foreground">One tap for circulars, RFQs and the directory. Works offline.</p>
      </div>
      <button
        onClick={promptInstall}
        className="inline-flex flex-shrink-0 items-center gap-1 rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background hover:opacity-90"
      >
        <Download className="h-3 w-3" /> Install
      </button>
      <button
        onClick={() => {
          localStorage.setItem(DISMISS_KEY, "1");
          setDismissed(true);
        }}
        aria-label="Dismiss"
        className="flex-shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
