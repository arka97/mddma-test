import { supabase } from "@/integrations/supabase/client";

/** Push handlers live inside the generated app-shell worker. */
const SW_URL = "/sw.js";
const LEGACY_SW_URL = "/push-sw.js";

/** Preview / dev hosts where service workers must never register. */
function isBlockedHost(): boolean {
  if (typeof window === "undefined") return true;
  const h = window.location.hostname;
  return (
    window.self !== window.top ||
    h.startsWith("id-preview--") ||
    h.startsWith("preview--") ||
    h === "localhost" ||
    h === "127.0.0.1" ||
    h.endsWith(".lovableproject.com") ||
    h.endsWith(".lovableproject-dev.com") ||
    h.endsWith(".beta.lovable.dev")
  );
}

export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

export function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export type PushSupport =
  | "supported"
  | "unsupported"
  | "needs-install" // iOS: must be added to home screen first
  | "preview"; // Lovable editor preview / dev

export function pushSupport(): PushSupport {
  if (typeof window === "undefined") return "unsupported";
  if (isBlockedHost()) return "preview";
  const hasApi = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
  if (!hasApi) return isIos() && !isStandalone() ? "needs-install" : "unsupported";
  return "supported";
}

export function permissionState(): NotificationPermission | "unavailable" {
  if (typeof Notification === "undefined") return "unavailable";
  return Notification.permission;
}

function urlBase64ToUint8Array(base64: string): BufferSource {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) out[i] = raw.charCodeAt(i);
  return out.buffer as ArrayBuffer;
}

function keyToBase64(key: ArrayBuffer | null): string {
  if (!key) return "";
  const bytes = new Uint8Array(key);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}

async function getRegistration(): Promise<ServiceWorkerRegistration> {
  // Retire the standalone push worker if this device still has it.
  const legacy = await navigator.serviceWorker.getRegistration(LEGACY_SW_URL);
  if (legacy && (legacy.active?.scriptURL || "").endsWith(LEGACY_SW_URL)) {
    await legacy.unregister().catch(() => undefined);
  }
  const existing = await navigator.serviceWorker.getRegistration(SW_URL);
  if (existing) return existing;
  return navigator.serviceWorker.register(SW_URL, { scope: "/" });
}

async function fetchVapidKey(): Promise<string> {
  const { data, error } = await supabase.functions.invoke("push-vapid-key");
  if (error) throw new Error("Push is not configured yet.");
  const key = (data as { publicKey?: string })?.publicKey;
  if (!key) throw new Error("Push is not configured yet.");
  return key;
}

/** Requests permission, subscribes this device and stores it against the user. */
export async function enablePush(userId: string): Promise<void> {
  if (pushSupport() !== "supported") throw new Error("Push is not available on this device.");

  const permission = await Notification.requestPermission();
  if (permission !== "granted") throw new Error("Notifications were blocked in the browser.");

  const registration = await getRegistration();
  await navigator.serviceWorker.ready;

  const applicationServerKey = urlBase64ToUint8Array(await fetchVapidKey());
  const existing = await registration.pushManager.getSubscription();
  const subscription =
    existing ??
    (await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey }));

  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      user_id: userId,
      endpoint: subscription.endpoint,
      p256dh: keyToBase64(subscription.getKey("p256dh")),
      auth: keyToBase64(subscription.getKey("auth")),
      user_agent: navigator.userAgent.slice(0, 300),
      last_seen_at: new Date().toISOString(),
    },
    { onConflict: "endpoint" },
  );
  if (error) throw new Error(error.message);
}

/** Removes this device's subscription locally and on the server. */
export async function disablePush(): Promise<void> {
  if (!("serviceWorker" in navigator)) return;
  const registration = await navigator.serviceWorker.getRegistration(SW_URL);
  const subscription = await registration?.pushManager.getSubscription();
  if (subscription) {
    await supabase.from("push_subscriptions").delete().eq("endpoint", subscription.endpoint);
    await subscription.unsubscribe();
  }
}

/** True when this browser already has an active push subscription. */
export async function isPushEnabledHere(): Promise<boolean> {
  if (pushSupport() !== "supported" || permissionState() !== "granted") return false;
  const registration = await navigator.serviceWorker.getRegistration(SW_URL);
  const subscription = await registration?.pushManager.getSubscription();
  return Boolean(subscription);
}
