import { useCallback, useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

function getUA() {
  if (typeof navigator === "undefined") return "";
  return navigator.userAgent || "";
}

function detectIOS() {
  const ua = getUA();
  if (!ua) return false;
  const isIPad =
    /iPad/.test(ua) ||
    (typeof navigator !== "undefined" &&
      navigator.platform === "MacIntel" &&
      (navigator as Navigator & { maxTouchPoints?: number }).maxTouchPoints! > 1);
  return /iPhone|iPod/.test(ua) || isIPad;
}

function detectAndroid() {
  return /Android/i.test(getUA());
}

function detectIOSSafari() {
  if (!detectIOS()) return false;
  const ua = getUA();
  // Exclude Chrome iOS (CriOS), Firefox iOS (FxiOS), Edge iOS (EdgiOS), in-app webviews
  if (/CriOS|FxiOS|EdgiOS|OPiOS|YaBrowser/i.test(ua)) return false;
  return /Safari/i.test(ua);
}

function detectInAppBrowser() {
  const ua = getUA();
  if (!ua) return false;
  return /FBAN|FBAV|Instagram|Line\/|WhatsApp|Twitter|LinkedInApp|MicroMessenger|; wv\)/i.test(ua);
}

function detectStandalone() {
  if (typeof window === "undefined") return false;
  const mq = window.matchMedia?.("(display-mode: standalone)").matches;
  const iosStandalone = (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  return Boolean(mq || iosStandalone);
}

export function useInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(detectStandalone());
  const [isIOS] = useState<boolean>(detectIOS());
  const [isIOSSafari] = useState<boolean>(detectIOSSafari());
  const [isAndroid] = useState<boolean>(detectAndroid());
  const [isInAppBrowser] = useState<boolean>(detectInAppBrowser());

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setIsInstalled(true);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferred) return false;
    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      setDeferred(null);
      return choice.outcome === "accepted";
    } catch {
      return false;
    }
  }, [deferred]);

  const canInstall = !isInstalled && Boolean(deferred);

  return {
    canInstall,
    isIOS,
    isIOSSafari,
    isAndroid,
    isInAppBrowser,
    isInstalled,
    promptInstall,
  };
}
