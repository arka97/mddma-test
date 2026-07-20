import { useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  createRfq,
  type PriceUnit,
  type QtyUnit,
  type RfqType,
} from "@/repositories/rfqListings";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { qk } from "@/lib/queryKeys";

const COMMODITIES = [
  "Almonds",
  "Cashews",
  "Dates",
  "Pistachios",
  "Walnuts",
  "Raisins",
  "Figs",
  "Apricots",
  "Seeds",
  "Spices",
  "Value-added foods",
  "Food ingredients",
];

const CURRENCIES = ["INR", "USD", "EUR", "AED", "GBP"];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canPost: boolean;
}

export function CreateRfqSheet({ open, onOpenChange, canPost }: Props) {
  const { user, company } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [type, setType] = useState<RfqType>("buy");
  const [commodity, setCommodity] = useState("");
  const [quantityMin, setQuantityMin] = useState("");
  const [quantityMax, setQuantityMax] = useState("");
  const [quantityUnit, setQuantityUnit] = useState<QtyUnit>("kg");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [priceUnit, setPriceUnit] = useState<PriceUnit>("per kg");
  const [currency, setCurrency] = useState("INR");
  const [validUntil, setValidUntil] = useState("");
  const [grade, setGrade] = useState("");
  const [origin, setOrigin] = useState("");
  const [delivery, setDelivery] = useState("");
  const [packaging, setPackaging] = useState("");
  const [notes, setNotes] = useState("");
  const [showOptional, setShowOptional] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const now = new Date();
  const minDate = new Date(now.getTime() + 86400_000).toISOString().slice(0, 10);
  const maxDate = new Date(now.getTime() + 90 * 86400_000).toISOString().slice(0, 10);

  const reset = () => {
    setType("buy");
    setCommodity("");
    setQuantityMin("");
    setQuantityMax("");
    setQuantityUnit("kg");
    setPriceMin("");
    setPriceMax("");
    setPriceUnit("per kg");
    setCurrency("INR");
    setValidUntil("");
    setGrade("");
    setOrigin("");
    setDelivery("");
    setPackaging("");
    setNotes("");
    setShowOptional(false);
  };

  const submit = async () => {
    if (!user || !company || !canPost) return;

    const qMin = Number(quantityMin);
    const qMax = Number(quantityMax);
    const pMin = Number(priceMin);
    const pMax = Number(priceMax);

    if (!commodity.trim() || !validUntil) {
      toast({ title: "Complete the required fields", variant: "destructive" });
      return;
    }
    if (!(qMin > 0 && qMax >= qMin)) {
      toast({ title: "Check the quantity range", variant: "destructive" });
      return;
    }
    if (!(pMin > 0 && pMax >= pMin)) {
      toast({ title: "Check the indicative price range", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      await createRfq({
        posted_by: user.id,
        company_id: company.id,
        listing_type: type,
        commodity: commodity.trim(),
        quantity_min: qMin,
        quantity_max: qMax,
        quantity_unit: quantityUnit,
        price_min: pMin,
        price_max: pMax,
        price_unit: priceUnit,
        currency,
        valid_until: validUntil,
        grade_variety: grade.trim() || null,
        origin_country: origin.trim() || null,
        delivery_location: delivery.trim() || null,
        packaging: packaging.trim() || null,
        notes: notes.trim() || null,
        status: "open",
      });
      await queryClient.invalidateQueries({ queryKey: qk.rfqs.all });
      toast({
        title: "RFQ published",
        description: "The displayed price is an indicative network range. Exact commercial terms belong in private quotations.",
      });
      reset();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "RFQ not published",
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
          <SheetTitle>Post trade requirement</SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto py-4">
          {!canPost ? (
            <div className="rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm text-warning-foreground">
              An approved, verified business profile is required before posting an RFQ.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2">
                <Button type="button" variant={type === "buy" ? "default" : "outline"} onClick={() => setType("buy")}>
                  I want to buy
                </Button>
                <Button type="button" variant={type === "sell" ? "default" : "outline"} onClick={() => setType("sell")}>
                  I can supply
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rfq-commodity">Commodity, product or service *</Label>
                <Input
                  id="rfq-commodity"
                  list="rfq-commodities"
                  value={commodity}
                  onChange={(event) => setCommodity(event.target.value)}
                  placeholder="Example: Medjool dates, pumpkin seeds, packaging"
                  maxLength={120}
                />
                <datalist id="rfq-commodities">
                  {COMMODITIES.map((item) => <option key={item} value={item} />)}
                </datalist>
              </div>

              <div className="space-y-2">
                <Label>Required quantity *</Label>
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
                <Label>Indicative target or budget range *</Label>
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
                <p className="text-xs text-muted-foreground">
                  This range is visible inside the authenticated network. Do not enter final negotiated terms here.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Responses accepted until *</Label>
                <Input type="date" min={minDate} max={maxDate} value={validUntil} onChange={(event) => setValidUntil(event.target.value)} />
              </div>

              <button type="button" className="text-xs font-semibold text-primary" onClick={() => setShowOptional((value) => !value)}>
                {showOptional ? "Hide additional details" : "Add specifications and logistics"}
              </button>

              {showOptional && (
                <div className="space-y-4 rounded-xl border border-border p-4">
                  <div className="space-y-2">
                    <Label>Grade or variety</Label>
                    <Input value={grade} onChange={(event) => setGrade(event.target.value)} maxLength={120} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Origin preference</Label>
                      <Input value={origin} onChange={(event) => setOrigin(event.target.value)} maxLength={80} />
                    </div>
                    <div className="space-y-2">
                      <Label>Packaging</Label>
                      <Input value={packaging} onChange={(event) => setPackaging(event.target.value)} maxLength={120} placeholder="Carton, vacuum pack, bulk bag" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Delivery location</Label>
                    <Input value={delivery} onChange={(event) => setDelivery(event.target.value)} maxLength={160} />
                  </div>
                  <div className="space-y-2">
                    <Label>Requirement notes</Label>
                    <Textarea rows={4} value={notes} onChange={(event) => setNotes(event.target.value)} maxLength={1200} placeholder="Quality parameters, documents, inspection or exclusions" />
                  </div>
                </div>
              )}

              <div className="flex items-start gap-2 rounded-xl border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span>The requirement is posted on behalf of {company?.name}. Exact prices, payment terms and private documents should be exchanged through quotations.</span>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-2 border-t border-border pt-3">
          <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" className="flex-1" onClick={submit} disabled={!canPost || submitting}>
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Publish RFQ
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
