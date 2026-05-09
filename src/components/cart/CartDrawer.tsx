import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart, type CartItem } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { friendlyErrorMessage } from "@/lib/errors";
import { useNavigate } from "react-router-dom";
import { Trash2, Send, Loader2, ShoppingCart } from "lucide-react";
import { useState } from "react";

export function CartDrawer() {
  const { items, isOpen, setOpen, removeItem, updateQuantity, clearCompany } = useCart();
  const { user, profile, company } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState<string | null>(null);

  // Group by seller
  const grouped = items.reduce<Record<string, { companyName: string; items: CartItem[] }>>((acc, it) => {
    if (!acc[it.companyId]) acc[it.companyId] = { companyName: it.companyName, items: [] };
    acc[it.companyId].items.push(it);
    return acc;
  }, {});

  const sendForCompany = async (companyId: string, group: CartItem[]) => {
    if (!user) {
      toast({ title: "Please sign in", description: "Sign in to send RFQs." });
      navigate("/login");
      setOpen(false);
      return;
    }
    setSubmitting(companyId);
    const summary = group.map((i) => `• ${i.productName}${i.variantName ? ` (${i.variantName})` : ""} — ${i.quantity || "qty TBD"}`).join("\n");
    const { data: rfq, error } = await supabase.from("rfqs").insert({
      buyer_id: user.id,
      company_id: companyId,
      product_id: group[0].productId,
      product_name: group.length === 1 ? group[0].productName : `Multi-item RFQ (${group.length} products)`,
      quantity: group[0].quantity || "See message",
      message: `Multi-item request:\n${summary}`,
      buyer_name: profile?.full_name ?? null,
      buyer_email: user.email ?? null,
      buyer_company: company?.name ?? null,
      buyer_phone: profile?.phone ?? null,
      status: "new",
    }).select("id").single();

    if (error || !rfq) {
      setSubmitting(null);
      toast({ title: "Failed to send RFQ", description: friendlyErrorMessage(error), variant: "destructive" });
      return;
    }

    // Insert line items
    const lines = group.map((i) => ({
      rfq_id: rfq.id,
      product_id: i.productId,
      variant_id: i.variantId ?? null,
      product_name: i.productName + (i.variantName ? ` (${i.variantName})` : ""),
      quantity: i.quantity || "TBD",
    }));
    await supabase.from("inquiry_products").insert(lines);

    setSubmitting(null);
    clearCompany(companyId);
    toast({ title: "RFQ sent", description: `Sent ${group.length} item(s) to seller. Track in RFQ Center.` });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2"><ShoppingCart className="h-5 w-5" /> RFQ Cart</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            Your cart is empty. Add products to send a combined RFQ.
          </div>
        ) : (
          <div className="space-y-6 mt-6">
            {Object.entries(grouped).map(([companyId, group]) => (
              <div key={companyId} className="border rounded-lg p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm">{group.companyName}</p>
                  <span className="text-xs text-muted-foreground">{group.items.length} item(s)</span>
                </div>
                <div className="space-y-2">
                  {group.items.map((it) => (
                    <div key={`${it.productId}-${it.variantId ?? "none"}`} className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{it.productName}</p>
                        {it.variantName && <p className="text-xs text-muted-foreground">{it.variantName}</p>}
                        <Input
                          className="mt-1 h-7 text-xs"
                          placeholder="e.g. 500 kg"
                          value={it.quantity}
                          onChange={(e) => updateQuantity(it.productId, it.variantId, e.target.value)}
                        />
                      </div>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => removeItem(it.productId, it.variantId)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  className="w-full text-accent-foreground"
                  size="sm"
                  disabled={submitting === companyId}
                  onClick={() => sendForCompany(companyId, group.items)}
                >
                  {submitting === companyId ? <Loader2 className="h-3 w-3 animate-spin" /> : <><Send className="h-3 w-3 mr-1" /> Send RFQ</>}
                </Button>
              </div>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
