import { useState } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInstallVisibility } from "@/hooks/useInstallVisibility";
import { useChromeVisibility } from "@/contexts/ChromeVisibilityContext";
import { contentBottomInset, FAB_GAP, Z_INDEX } from "@/lib/chrome-layout";
import { cn } from "@/lib/utils";

/**
 * Slim install bar pinned above the mobile tab bar on the home feed.
 * Follows the hide-on-scroll chrome and respects iOS safe-area insets.
 */
export function InstallBar() {
  const { showNudge, dismiss, canInstall, isIOS, promptInstall } = useInstallVisibility();
  const { hidden } = useChromeVisibility();
  const [busy, setBusy] = useState(false);

  // iOS cannot install programmatically — the in-feed card carries those steps.
  if (!showNudge || (!canInstall && isIOS)) return null;

  const handleInstall = async () => {
    setBusy(true);
    const ok = await promptInstall();
    setBusy(false);
    if (ok) dismiss();
  };

  return (
    <div
      className={cn(
        "fixed inset-x-2 flex items-center gap-2.5 rounded-2xl border border-border bg-card/95 px-3 py-2 shadow-lg backdrop-blur transition-opacity duration-200 lg:hidden",
        hidden ? "pointer-events-none opacity-0" : "opacity-100",
      )}
      style={{
        bottom: `calc(${contentBottomInset(hidden)} + ${FAB_GAP}px)`,
        zIndex: Z_INDEX.bar - 1,
        paddingRight: 72,
      }}
    >
      <img src="/icon-192.png" alt="" className="h-8 w-8 rounded-lg" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-foreground">Install G-BAU-G</p>
        <p className="truncate text-[11px] text-muted-foreground">One tap. No app store.</p>
      </div>
      <Button size="sm" className="h-8 shrink-0 px-3 text-xs font-semibold" onClick={handleInstall} disabled={busy}>
        <Download className="mr-1 h-3.5 w-3.5" /> {busy ? "…" : "Install"}
      </Button>
      <button
        onClick={dismiss}
        aria-label="Dismiss install bar"
        className="shrink-0 rounded p-1 text-muted-foreground hover:bg-muted"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
