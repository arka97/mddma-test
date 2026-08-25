/**
 * Guarded app-shell service worker registration.
 *
 * The generated worker (`/sw.js`) makes the app installable in Chrome/Edge and
 * also hosts the Web Push handlers (imported from /push-sw.js). It must never
 * register in dev or Lovable preview contexts.
 */
const SW_PATH = "/sw.js";
const LEGACY_SW_PATHS = ["/push-sw.js"];

function isBlockedContext(): boolean {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return true;
  if (!import.meta.env.PROD) return true;
  if (window.self !== window.top) return true;

  const url = new URL(window.location.href);
  if (url.searchParams.get("sw") === "off") return true;

  const h = window.location.hostname;
  return (
    h === "localhost" ||
    h === "127.0.0.1" ||
    h.startsWith("id-preview--") ||
    h.startsWith("preview--") ||
    h === "lovableproject.com" ||
    h.endsWith(".lovableproject.com") ||
    h === "lovableproject-dev.com" ||
    h.endsWith(".lovableproject-dev.com") ||
    h === "beta.lovable.dev" ||
    h.endsWith(".beta.lovable.dev")
  );
}

async function unregisterAppWorkers() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.allSettled(
    registrations
      .filter((r) => {
        const script = r.active?.scriptURL || r.installing?.scriptURL || r.waiting?.scriptURL || "";
        return script.endsWith(SW_PATH) || LEGACY_SW_PATHS.some((p) => script.endsWith(p));
      })
      .map((r) => r.unregister()),
  );
}

/** Registers the app service worker when it is safe to do so. */
export async function registerAppServiceWorker(): Promise<void> {
  if (isBlockedContext()) {
    await unregisterAppWorkers().catch(() => undefined);
    return;
  }

  try {
    // Retire the standalone push worker; push now lives inside /sw.js.
    for (const legacy of LEGACY_SW_PATHS) {
      const stale = await navigator.serviceWorker.getRegistration(legacy);
      const script = stale?.active?.scriptURL || "";
      if (stale && script.endsWith(legacy)) await stale.unregister();
    }
    await navigator.serviceWorker.register(SW_PATH, { scope: "/" });
  } catch {
    /* installability is best-effort */
  }
}
