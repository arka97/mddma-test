import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import type { RfqListingRow } from "@/repositories/rfqListings";
import { revealContact } from "@/repositories/rfqListings";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  rfq: RfqListingRow;
  companyName?: string;
  verified?: boolean;
}

export function RfqCard({ rfq, companyName, verified }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [phone, setPhone] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const daysLeft = Math.ceil((new Date(rfq.valid_until).getTime() - Date.now()) / 86400000);
  const expiringSoon = daysLeft <= 3;

  const reveal = async () => {
    if (!user || !rfq.company_id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("get_company_whatsapp", { _company_id: rfq.company_id });
      if (error) throw error;
      setPhone(data as string | null);
      await revealContact(rfq.id, user.id);
      if (!data) toast({ title: "Contact not available" });
    } catch (e) {
      toast({ title: "Failed to reveal", description: e instanceof Error ? e.message : "", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <Badge className={cn(rfq.listing_type === "buy" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground")}>
            {rfq.listing_type === "buy" ? "BUY" : "SELL"}
          </Badge>
          <span className="truncate text-sm font-medium text-foreground">{companyName ?? "Member"}</span>
          {verified && <Badge variant="outline" className="text-[10px]">Verified</Badge>}
          <span className="ml-auto text-[11px] text-muted-foreground">
            {formatDistanceToNow(new Date(rfq.created_at), { addSuffix: true })}
          </span>
        </div>

        <h3 className="text-base font-semibold text-foreground">{rfq.commodity}</h3>
        {(rfq.grade_variety || rfq.origin_country) && (
          <p className="text-xs text-muted-foreground">
            {[rfq.grade_variety, rfq.origin_country].filter(Boolean).join(" · ")}
          </p>
        )}

        <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
          <span className="text-muted-foreground">Quantity</span>
          <span className="font-mono tabular-nums">{rfq.quantity_min}–{rfq.quantity_max} {rfq.quantity_unit}</span>
          <span className="text-muted-foreground">Price</span>
          <span className="font-mono tabular-nums">₹{rfq.price_min}–{rfq.price_max} /{rfq.price_unit.replace("per ", "")}</span>
          {rfq.delivery_location && (
            <>
              <span className="text-muted-foreground">Delivery</span>
              <span>{rfq.delivery_location}</span>
            </>
          )}
        </div>

        <div className={cn("mt-2 inline-flex items-center gap-1 text-xs", expiringSoon ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground")}>
          <Clock className="h-3 w-3" />
          {daysLeft <= 0 ? "Expires today" : `Expires in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`}
        </div>

        <div className="mt-3 border-t border-border/60 pt-3">
          {phone ? (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => { navigator.clipboard.writeText(phone); toast({ title: "Copied" }); }}>
                <Phone className="h-4 w-4 mr-1" /> {phone}
              </Button>
              <Button asChild variant="accent" size="sm">
                <a href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4 mr-1" /> WhatsApp
                </a>
              </Button>
            </div>
          ) : (
            <Button variant="outline" className="w-full" onClick={reveal} disabled={loading || !rfq.company_id}>
              Reveal contact
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
