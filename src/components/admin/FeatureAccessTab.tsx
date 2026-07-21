import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, Unlock, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { setFeaturesOpenFlag, setVerificationOpenFlag } from "@/hooks/useAppSettings";
import { useToast } from "@/hooks/use-toast";

export function FeatureAccessTab() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [verifOpen, setVerifOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingVerif, setSavingVerif] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase
        .from("app_settings")
        .select("key, value")
        .in("key", ["features_open_to_all", "verification_open_to_all"]);
      if (!mounted) return;
      const rows = data ?? [];
      setOpen(rows.find((r) => r.key === "features_open_to_all")?.value === true);
      setVerifOpen(rows.find((r) => r.key === "verification_open_to_all")?.value === true);
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

  const toggleVerif = async (next: boolean) => {
    setSavingVerif(true);
    const prev = verifOpen;
    setVerifOpen(next);
    try {
      await setVerificationOpenFlag(next);
      toast({ title: next ? "Verification wall lifted" : "Verification required restored" });
    } catch (e) {
      setVerifOpen(prev);
      toast({ title: "Failed", description: e instanceof Error ? e.message : String(e), variant: "destructive" });
    } finally {
      setSavingVerif(false);
    }
  };

  if (loading) return <div className="py-10 flex justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div>;

  return (
    <div className="space-y-4">
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

      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-4">
                <Label htmlFor="verification-open" className="text-base font-semibold">
                  Verification not required
                </Label>
                <Switch id="verification-open" checked={verifOpen} onCheckedChange={toggleVerif} disabled={savingVerif} />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                When ON, any signed-in user is treated as a verified business — they
                can post to the Market feed, comment, vote polls, upload media,
                quote RFQs and start deal rooms without submitting business evidence.
                Guests still need to sign up before interacting. Admin and
                moderation controls stay locked.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Current status: <span className="font-medium text-foreground">{verifOpen ? "OPEN — signup is enough to act as verified" : "REQUIRED — approved business needed"}</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
