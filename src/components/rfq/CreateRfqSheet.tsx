import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { createRfq, type RfqType, type QtyUnit, type PriceUnit } from "@/repositories/rfqListings";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const COMMODITIES = ["Almonds", "Cashews", "Dates", "Pistachios", "Walnuts", "Raisins", "Figs", "Apricots", "Pine Nuts", "Macadamia", "Hazelnuts", "Peanuts"];

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function CreateRfqSheet({ open, onOpenChange }: Props) {
  const { user, company } = useAuth();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [type, setType] = useState<RfqType>("buy");
  const [commodity, setCommodity] = useState("");
  const [qMin, setQMin] = useState("");
  const [qMax, setQMax] = useState("");
  const [qUnit, setQUnit] = useState<QtyUnit>("kg");
  const [pMin, setPMin] = useState("");
  const [pMax, setPMax] = useState("");
  const [pUnit, setPUnit] = useState<PriceUnit>("per kg");
  const [validUntil, setValidUntil] = useState("");
  const [grade, setGrade] = useState("");
  const [origin, setOrigin] = useState("");
  const [delivery, setDelivery] = useState("");
  const [showOpt, setShowOpt] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const today = new Date();
  const minDate = new Date(today.getTime() + 86400000).toISOString().slice(0, 10);
  const maxDate = new Date(today.getTime() + 90 * 86400000).toISOString().slice(0, 10);

  const submit = async () => {
    if (!user) return;
    const qmin = Number(qMin), qmax = Number(qMax), pmin = Number(pMin), pmax = Number(pMax);
    if (!commodity || !validUntil) {
      toast({ title: "Fill required fields", variant: "destructive" });
      return;
    }
    if (!(qmin > 0 && qmax > qmin)) {
      toast({ title: "Quantity range invalid", variant: "destructive" });
      return;
    }
    if (!(pmin > 0 && pmax > pmin)) {
      toast({ title: "Price range invalid", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      await createRfq({
        posted_by: user.id,
        company_id: company?.id ?? null,
        listing_type: type,
        commodity,
        quantity_min: qmin,
        quantity_max: qmax,
        quantity_unit: qUnit,
        price_min: pmin,
        price_max: pmax,
        price_unit: pUnit,
        valid_until: validUntil,
        grade_variety: grade || null,
        origin_country: origin || null,
        delivery_location: delivery || null,
      });
      toast({ title: "RFQ posted" });
      qc.invalidateQueries({ queryKey: ["rfq-listings"] });
      onOpenChange(false);
    } catch (e) {
      toast({ title: "Failed", description: e instanceof Error ? e.message : "", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] flex flex-col">
        <SheetHeader>
          <SheetTitle>Post RFQ</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-3">
          <div className="grid grid-cols-2 gap-2">
            <Button variant={type === "buy" ? "default" : "outline"} onClick={() => setType("buy")}>I want to BUY</Button>
            <Button variant={type === "sell" ? "default" : "outline"} onClick={() => setType("sell")}>I want to SELL</Button>
          </div>

          <div>
            <Label className="text-xs">Commodity</Label>
            <Select value={commodity} onValueChange={setCommodity}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select commodity" /></SelectTrigger>
              <SelectContent>
                {COMMODITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs">Quantity range</Label>
            <div className="mt-1 grid grid-cols-3 gap-2">
              <Input type="number" placeholder="From" value={qMin} onChange={(e) => setQMin(e.target.value)} />
              <Input type="number" placeholder="To" value={qMax} onChange={(e) => setQMax(e.target.value)} />
              <Select value={qUnit} onValueChange={(v) => setQUnit(v as QtyUnit)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem><SelectItem value="MT">MT</SelectItem><SelectItem value="box">box</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-xs">Price range (₹)</Label>
            <div className="mt-1 grid grid-cols-3 gap-2">
              <Input type="number" placeholder="From" value={pMin} onChange={(e) => setPMin(e.target.value)} />
              <Input type="number" placeholder="To" value={pMax} onChange={(e) => setPMax(e.target.value)} />
              <Select value={pUnit} onValueChange={(v) => setPUnit(v as PriceUnit)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="per kg">per kg</SelectItem><SelectItem value="per MT">per MT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-xs">Valid until</Label>
            <Input type="date" min={minDate} max={maxDate} value={validUntil} onChange={(e) => setValidUntil(e.target.value)} className="mt-1" />
          </div>

          <button type="button" className="text-xs font-medium text-accent" onClick={() => setShowOpt((v) => !v)}>
            {showOpt ? "Hide" : "Add more details"}
          </button>

          {showOpt && (
            <div className="space-y-2 rounded-md border border-border/60 p-3">
              <div><Label className="text-xs">Grade / Variety</Label><Input value={grade} onChange={(e) => setGrade(e.target.value)} /></div>
              <div><Label className="text-xs">Origin country</Label><Input value={origin} onChange={(e) => setOrigin(e.target.value)} /></div>
              <div><Label className="text-xs">Delivery location</Label><Input value={delivery} onChange={(e) => setDelivery(e.target.value)} /></div>
            </div>
          )}
        </div>

        <div className="flex gap-2 border-t border-border pt-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">Cancel</Button>
          <Button onClick={submit} disabled={submitting} className="flex-1">
            {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Post
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
