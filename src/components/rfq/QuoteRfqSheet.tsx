import { useEffect, useState } from "react";
import { Loader2, LockKeyhole, ShieldCheck } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { qk } from "@/lib/queryKeys";
import { createQuotation, type QuotationKind } from "@/repositories/rfqQuotations";
import type {
  PriceUnit,
  QtyUnit,
  RfqCompanySummary,
  RfqListingRow,
} from "@/repositories/rfqListings";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rfq: RfqListingRow | null;
  recipient?: RfqCompanySummary;
  canQuote: boolean;
}

const CURRENCIES = ["INR", "USD", "EUR", "AED", "GBP"];

export function QuoteRfqSheet({ open, onOpenChange, rfq, recipient, canQuote }: Props) {
  const { user, company } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [kind, setKind] = useState<QuotationKind>("indicative");
  const [quantityMin, setQuantityMin] = useState("");
  const [quantityMax, setQuantityMax] = useState("");
  const [quantityUnit, setQuantityUnit] = useState<QtyUnit>("kg");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [priceUnit, setPriceUnit] = useState<PriceUnit>("per kg");
  const [currency, setCurrency] = useState("INR");
  const [validUntil, setValidUntil] = useState("");
  const [deliveryTerms, setDeliveryTerms] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !rfq) return;
    setKind("indicative");
    setQuantityMin(String(rfq.quantity_min));
    setQuantityMax(String(rfq.quantity_max));
    setQuantityUnit(rfq.quantity_unit);
    setPriceMin("");
    setPriceMax("");
    setPriceUnit(rfq.price_unit);
    setCurrency(rfq.currency || "INR");
    setValidUntil(rfq.valid_until);
    setDeliveryTerms("");
    setPaymentTerms("");
    setNotes("");
  }, [open, rfq]);

  const submit = async () => {
    if (!user || !company || !rfq?.company_id || !recipient || !canQuote) return;

    const qMin = Number(quantityMin);
    const qMax = Number(quantityMax);
    const pMin = Number(priceMin);
    const pMax = Number(priceMax);

    if (!(qMin > 0 && qMax >= qMin)) {
      toast({ title: "Check the quoted quantity", variant: "destructive" });
      return;
    }
    if (!(pMin > 0 && pMax >= pMin)) {
      toast({ title: "Check the quoted price", variant: "destructive" });
      return;
    }
    if (!validUntil) {
      toast({ title: "Select quotation validity", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      await createQuotation({
        rfq_id: rfq.id,
        sender_company_id: company.id,
        sender_user_id: user.id,
        recipient_company_id: rfq.company_id,
        quote_kind: kind,
        currency,
        quantity_min: qMin,
        quantity_max: qMax,
        quantity_unit: quantityUnit,
        price_min: pMin,
        price_max: pMax,
        price_unit: priceUnit,
        delivery_terms: deliveryTerms.trim() || null,
        payment_terms: paymentTerms.trim() || null,
        notes: notes.trim() || null,
        valid_until: validUntil,
      });
      await queryClient.invalidateQueries({ queryKey: qk.quotations.all });
      toast({
        title: kind === "formal" ? "Formal quotation sent" : "Indicative quotation sent",
        description: "Only the two participating businesses and authorised administrators can read its terms.",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Quotation not sent",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="flex h-[92vh] flex-col sm:mx-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Send private quotation</SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-5 overflow-y-auto py-4">
          <div className="rounded-xl border border-border bg-muted/30 p-4">
            <div className="flex items-start gap-3">
              <LockKeyhole className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {rfq?.commodity ?? "RFQ"} · {recipient?.name ?? "Receiving business"}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Exact price, payment and delivery terms stay inside this private quotation record. They are not used in public rate comparisons.
                </p>
              </div>
            </div>
          </div>

          {!canQuote ? (
            <div className="rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm text-warning-foreground">
              An approved, verified business profile is required before commercial quotations can be submitted.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2">
                <Button type="button" variant={kind === "indicative" ? "default" : "outline"} onClick={() => setKind("indicative")}>
                  Indicative
                </Button>
                <Button type="button" variant={kind === "formal" ? "default" : "outline"} onClick={() => setKind("formal")}>
                  Formal
                </Button>
              </div>

              <p className="text-xs leading-relaxed text-muted-foreground">
                {kind === "indicative"
                  ? "Indicative quotations support exploration and cannot be accepted in the platform."
                  : "Formal quotations create a dated commercial record, but G-BAU-G still provides no accept, PO or payment action."}
              </p>

              <div className="space-y-2">
                <Label>Quantity offered</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Input type="number" min="0" step="any" value={quantityMin} onChange={(event) => setQuantityMin(event.target.value)} placeholder="From" />
                  <Input type="number" min="0" step="any" value={quantityMax} onChange={(event) => setQuantityMax(event.target.value)} placeholder="To" />
                  <Select value={quantityUnit} onValueChange={(value) => setQuantityUnit(value as QtyUnit)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(["kg", "MT", "box", "container", "pallet"] as QtyUnit[]).map((unit) => (
                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Quoted price</Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <Input type="number" min="0" step="any" value={priceMin} onChange={(event) => setPriceMin(event.target.value)} placeholder="From" />
                  <Input type="number" min="0" step="any" value={priceMax} onChange={(event) => setPriceMax(event.target.value)} placeholder="To" />
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={priceUnit} onValueChange={(value) => setPriceUnit(value as PriceUnit)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(["per kg", "per MT", "per box", "per unit"] as PriceUnit[]).map((unit) => (
                        <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Valid until</Label>
                  <Input type="date" value={validUntil} onChange={(event) => setValidUntil(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Delivery terms</Label>
                  <Input value={deliveryTerms} onChange={(event) => setDeliveryTerms(event.target.value)} placeholder="Lead time, delivery basis, location" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Payment terms</Label>
                <Input value={paymentTerms} onChange={(event) => setPaymentTerms(event.target.value)} placeholder="Example: advance, credit period, documents" />
              </div>

              <div className="space-y-2">
                <Label>Private notes</Label>
                <Textarea rows={4} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Specifications, exclusions, taxes or other conditions" />
              </div>

              <div className="flex items-start gap-2 rounded-xl border border-border p-3 text-xs text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span>The sender is recorded as {company?.name}. Keep commercially sensitive information inside this quotation rather than the public RFQ.</span>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-2 border-t border-border pt-3">
          <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" className="flex-1" onClick={submit} disabled={!canQuote || submitting}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send quotation
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
