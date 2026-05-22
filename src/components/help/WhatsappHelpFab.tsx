import { MessageCircle } from "lucide-react";

/**
 * Persistent WhatsApp help button — always reachable, never blocks the
 * cart FAB (positioned bottom-left). Plain wa.me deeplink — no API key.
 */
const HELP_PHONE = "919833000000"; // placeholder; admin can edit
const HELP_MSG = encodeURIComponent("Hi MDDMA team, I need some help using the app.");

export function WhatsappHelpFab() {
  return (
    <a
      href={`https://wa.me/${HELP_PHONE}?text=${HELP_MSG}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Get help on WhatsApp"
      className="fixed left-4 z-40 inline-flex h-12 items-center gap-2 rounded-full bg-success px-4 text-sm font-semibold text-success-foreground shadow-lg transition-transform hover:scale-105 md:left-6"
      style={{ bottom: "calc(5rem + env(safe-area-inset-bottom))" }}
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">Need help?</span>
    </a>
  );
}
