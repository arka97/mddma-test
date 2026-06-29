import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, Unlock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { setFeaturesOpenFlag } from "@/hooks/useAppSettings";
import { useToast } from "@/hooks/use-toast";

export function FeatureAccessTab() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase
        .from("app_settings")
        .select("value, updated_at")
        .eq("key", "features_open_to_all")
        .maybeSingle();
      if (!mounted) return;
      setOpen(data?.value === true);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  const toggle = async (next: boolean) => {
    setSaving(true);
    const prev = open;
    setOpen(next);
    try {
      await setFeaturesOpenFlag(next);
      toast({ title: next ? "All features opened" : "Subscription gating restored" });
    } catch (e) {
      setOpen(prev);
      toast({ title: "Failed", description: e instanceof Error ? e.message : String(e), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-10 flex justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div>;

  return (
    <Card>
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
            <Unlock className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="features-open" className="text-base font-semibold">
                Open all features to everyone
              </Label>
              <Switch id="features-open" checked={open} onCheckedChange={toggle} disabled={saving} />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              When ON, the Market feed, RFQ board, contact reveals and other paid
              gates are unlocked for guests and free members — useful during the
              pilot. Turn OFF to restore the standard subscription paywall.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Current status: <span className="font-medium text-foreground">{open ? "OPEN — everyone has paid access" : "GATED — paid members only"}</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
