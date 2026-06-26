import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EyeOff, Eye, Loader2, Clock } from "lucide-react";
import { listAllRfqsAdmin, setRfqHidden, forceExpireRfq, type RfqListingRow } from "@/repositories/rfqListings";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function RfqModerationTab() {
  const { toast } = useToast();
  const [rows, setRows] = useState<RfqListingRow[]>([]);
  const [companies, setCompanies] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await listAllRfqsAdmin();
      setRows(data);
      const ids = Array.from(new Set(data.map((r) => r.company_id).filter(Boolean))) as string[];
      if (ids.length) {
        const { data: cs } = await supabase.from("companies").select("id,name").in("id", ids);
        const map: Record<string, string> = {};
        (cs ?? []).forEach((c: { id: string; name: string }) => { map[c.id] = c.name; });
        setCompanies(map);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onHide = async (id: string, hidden: boolean) => {
    await setRfqHidden(id, hidden);
    toast({ title: hidden ? "Hidden" : "Visible" });
    load();
  };
  const onExpire = async (id: string) => {
    if (!confirm("Force expire this RFQ?")) return;
    await forceExpireRfq(id);
    toast({ title: "Expired" });
    load();
  };

  if (loading) return <div className="py-10 flex justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div>;

  return (
    <div className="space-y-2">
      {rows.map((r) => {
        const expired = new Date(r.valid_until) < new Date();
        return (
          <Card key={r.id}>
            <CardContent className="p-3 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={r.listing_type === "buy" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}>
                    {r.listing_type.toUpperCase()}
                  </Badge>
                  {r.is_hidden && <Badge variant="outline">Hidden</Badge>}
                  {expired && <Badge variant="outline">Expired</Badge>}
                </div>
                <p className="text-sm font-medium">{r.commodity} · <span className="text-muted-foreground">{r.company_id ? companies[r.company_id] ?? "—" : "—"}</span></p>
                <p className="text-xs font-mono tabular-nums">₹{r.price_min}–{r.price_max} /{r.price_unit.replace("per ", "")}</p>
                <p className="text-[10px] text-muted-foreground"><Clock className="inline h-3 w-3 mr-1" />Until {r.valid_until}</p>
              </div>
              <div className="flex gap-1 sm:shrink-0">
                <Button size="sm" variant="outline" onClick={() => onHide(r.id, !r.is_hidden)} title={r.is_hidden ? "Unhide" : "Hide"}>
                  {r.is_hidden ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                </Button>
                <Button size="sm" variant="outline" onClick={() => onExpire(r.id)} title="Force expire">
                  Expire
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
      {rows.length === 0 && <p className="text-sm text-muted-foreground text-center py-10">No RFQs yet.</p>}
    </div>
  );
}
