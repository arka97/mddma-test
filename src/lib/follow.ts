/**
 * Client-side follow graph (X-style asymmetric follow).
 *
 * This is a UI-layer store persisted in localStorage so the follow interaction
 * is real and immediate without touching the backend. The public interface is
 * deliberately small and swappable: when a `follows` table + RLS land, replace
 * the bodies here (and make them async) without changing any caller.
 *
 * Keys are stable entity ids — a company id, profile id, or slug — so a handle
 * followed in the feed reads as followed on its profile too.
 */

const STORAGE_KEY = "gbaug:following:v1";

let current = new Set<string>(load());
const listeners = new Set<() => void>();

function load(): string[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...current]));
  } catch {
    /* storage full / unavailable — in-memory state still works this session */
  }
}

function emit() {
  // Replace the Set reference so identity-based snapshots invalidate.
  current = new Set(current);
  listeners.forEach((l) => l());
}

export function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function isFollowing(id: string): boolean {
  return current.has(id);
}

export function getFollowingCount(): number {
  return current.size;
}

export function getFollowing(): string[] {
  return [...current];
}

export function follow(id: string) {
  if (!id || current.has(id)) return;
  current.add(id);
  persist();
  emit();
}

export function unfollow(id: string) {
  if (!id || !current.has(id)) return;
  current.delete(id);
  persist();
  emit();
}

export function toggleFollow(id: string): boolean {
  const next = !current.has(id);
  if (next) current.add(id);
  else current.delete(id);
  persist();
  emit();
  return next;
}

// Keep multiple tabs in sync.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) {
      current = new Set(load());
      listeners.forEach((l) => l());
    }
  });
}
