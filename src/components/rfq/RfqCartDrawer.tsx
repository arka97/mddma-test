import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronUp, ChevronDown, X, Send, ShoppingBasket, Trash2, MapPin } from "lucide-react";
import { useRfqCart, type RfqCartItem } from "@/contexts/RfqCartContext";
import { RFQModal } from "@/components/RFQModal";

// Bottom-fixed drawer that holds the buyer's RFQ shortlist (Swiggy-cart pattern,
// retuned for B2B). Single-item RFQ send is wired here directly; multi-seller
// batch send is on the Phase D roadmap.
export function RfqCartDrawer() {
  const { items, remove, clear } = useRfqCart();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<RfqCartItem | null>(null);

  if (items.length === 0) return null;

  const sellersCount = new Set(items.map((i) => i.sellerName)).size;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
        <div className="mx-auto max-w-3xl px-3 pb-3 pointer-events-auto">
          <div className="rounded-xl border border-accent/40 bg-card shadow-2xl overflow-hidden">
            {/* Collapsed bar */}
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="w-full flex items-center justify-between gap-3 p-3 hover:bg-muted/50 transition-colors"
              aria-expanded={open}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative flex-shrink-0">
                  <ShoppingBasket className="h-5 w-5 text-accent" />
                  <Badge className="absolute -top-2 -right-2 h-4 min-w-4 px-1 text-[10px] bg-accent text-primary">
                    {items.length}
                  </Badge>
                </div>
                <div className="min-w-0 text-left">
                  <div className="text-sm font-semibold text-foreground">
                    {items.length} item{items.length === 1 ? "" : "s"} in your RFQ list
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    From {sellersCount} seller{sellersCount === 1 ? "" : "s"} · review &amp; send individually
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {open ? <ChevronDown className="h-5 w-5 text-muted-foreground" /> : <ChevronUp className="h-5 w-5 text-muted-foreground" />}
              </div>
            </button>

            {/* Expanded list */}
            {open && (
              <div className="border-t border-border max-h-[60vh] overflow-y-auto">
                <ul className="divide-y divide-border">
                  {items.map((item) => (
                    <li key={item.cartId} className="p-3 flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-foreground truncate">{item.productName}</div>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 flex-wrap mt-0.5">
                          {item.sellerSlug ? (
                            <Link to={`/store/${item.sellerSlug}`} className="inline-flex items-center gap-1 hover:text-accent">
                              <MapPin className="h-3 w-3" /> {item.sellerName}
                            </Link>
                          ) : (
                            <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {item.sellerName}</span>
                          )}
                          {item.origin && <span>· {item.origin}</span>}
                          {item.moq && <span>· MOQ {item.moq}</span>}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-accent hover:bg-accent/90 text-primary font-semibold flex-shrink-0"
                        onClick={() => setActive(item)}
                      >
                        <Send className="h-3.5 w-3.5 mr-1" /> Send RFQ
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-muted-foreground hover:text-destructive flex-shrink-0"
                        onClick={() => remove(item.cartId)}
                        aria-label="Remove from list"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between gap-2 p-3 border-t border-border bg-muted/30">
                  <span className="text-[11px] text-muted-foreground">
                    Tip: review prices first, then send a quote request to each seller in turn.
                  </span>
                  <Button size="sm" variant="ghost" onClick={clear} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Clear all
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {active && (
        <RFQModal
          productName={active.productName}
          productId={active.productId ?? undefined}
          companyId={active.companyId ?? undefined}
          onClose={() => {
            setActive(null);
            // Auto-clean: if the item was sent (RFQ insert succeeded the modal will
            // close itself), still remove it from cart for a clean shortlist UX.
            // We can't observe success directly here; the user can clear manually.
          }}
        />
      )}
    </>
  );
}

export default RfqCartDrawer;
