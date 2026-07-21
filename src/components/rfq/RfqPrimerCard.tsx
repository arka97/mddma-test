import { ShieldCheck, Info } from "lucide-react";

/**
 * Right-rail widget for /rfq — quick primer on private quotation flow.
 * Keeps the surface consistent with the community feed's rail widgets.
 */
export function RfqPrimerCard() {
  return (
    <aside className="rounded-2xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Info className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-bold text-foreground">How RFQs work</h2>
      </div>
      <ol className="space-y-2 px-4 py-3 text-xs text-muted-foreground">
        <li>
          <span className="font-semibold text-foreground">1. Post</span> a buy requirement or supply notice — public specs only.
        </li>
        <li>
          <span className="font-semibold text-foreground">2. Receive</span> private quotations with exact price and terms.
        </li>
        <li>
          <span className="font-semibold text-foreground">3. Reveal</span> WhatsApp only when both sides accept.
        </li>
      </ol>
      <div className="flex items-start gap-2 border-t border-border bg-muted/40 px-4 py-3 text-[11px] text-muted-foreground">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
        <span>Only verified businesses may post or quote. Contact reveals are logged.</span>
      </div>
    </aside>
  );
}
