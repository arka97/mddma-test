import { useCallback, useEffect, useState } from "react";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";

/**
 * One shared source of truth for every "install the app" surface.
 * Dismissing one nudge silences all of them; installed users see none.
 */
const KEY = "mddma:install:dismissed";

let listeners = new Set<() => void>();

function readDismissed(): boolean {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function useInstallVisibility() {
  const install = useInstallPrompt();
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    setDismissed(readDismissed());
    const sync = () => setDismissed(readDismissed());
    listeners.add(sync);
    return () => {
      listeners.delete(sync);
    };
  }, []);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    listeners.forEach((l) => l());
  }, []);

  /** Nudges (bars, cards, sheets) — hidden once installed or dismissed. */
  const showNudge = !install.isInstalled && !dismissed;

  return { ...install, dismissed, dismiss, showNudge };
}
