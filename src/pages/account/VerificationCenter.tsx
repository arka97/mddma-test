import { useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Loader2, MailCheck, Building2, FileBadge2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BuyerTrustBadge, reputationLabel, VerificationTier } from "@/components/trust/BuyerTrustBadge";
import { KYCDocsSection } from "@/components/account/KYCDocsSection";
import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";
import { isFounderAdmin } from "@/lib/membership";

const TIER_ORDER: VerificationTier[] = ["unverified", "email", "company", "gst"];
const TIER_INDEX = (t: VerificationTier) => TIER_ORDER.indexOf(t);

const VerificationCenter = () => {
  const { user, profile, refresh, roles } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [gstin, setGstin] = useState("");

  useEffect(() => {
    setCompanyName((profile as any)?.company_name ?? "");
    setGstin((profile as any)?.gstin ?? "");
  }, [profile]);

  const tier = ((profile as any)?.verification_tier ?? "unverified") as VerificationTier;
  const score = (profile as any)?.buyer_reputation_score ?? 0;
  const emailVerifiedAt = (profile as any)?.email_verified_at ?? (user?.email_confirmed_at ?? null);

  // Auto-promote to email tier when Supabase confirms the email
  useEffect(() => {
    if (!user || !profile) return;
    if (tier === "unverified" && (user.email_confirmed_at || emailVerifiedAt)) {
      promoteTo("email", { email_verified_at: user.email_confirmed_at ?? new Date().toISOString() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, profile]);

  const progress = useMemo(() => (TIER_INDEX(tier) / 3) * 100, [tier]);

  const promoteTo = async (
    next: VerificationTier,
    payload: Record<string, unknown> = {},
  ) => {
    if (!user) return;
    if (TIER_INDEX(next) <= TIER_INDEX(tier)) return; // never demote
    setSaving(next);
    const { data, error } = await supabase.functions.invoke("promote-verification", {
      body: { target: next, ...payload },
    });
    setSaving(null);
    const fnError = (data as { error?: string } | null)?.error;
    if (error || fnError) {
      toast({
        title: "Verification failed",
        description: fnError ?? "Could not update your verification. Please try again.",
        variant: "destructive",
      });
      return;
    }
    toast({ title: `Verified · ${next.toUpperCase()}` });
    refresh();
  };

  const verifyCompany = async () => {
    if (companyName.trim().length < 2) {
      toast({ title: "Enter your company name", variant: "destructive" });
      return;
    }
    await promoteTo("company", { company_name: companyName.trim() });
  };

  const verifyGst = async () => {
    const cleaned = gstin.trim().toUpperCase();
    if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(cleaned)) {
      toast({ title: "Invalid GSTIN format", description: "Expected 15-char GSTIN like 27AAAPL1234C1Z5", variant: "destructive" });
      return;
    }
    await promoteTo("gst", { gstin: cleaned });
  };

  if (!user) return null;

  const Step = ({ done, current, icon: Icon, title, desc, children }: any) => (
    <div className={`rounded-lg border p-5 transition ${current ? "border-primary/40 bg-primary/5" : done ? "border-border bg-muted/30" : "border-border"}`}>
      <div className="flex items-start gap-3">
        {done ? <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" /> : <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold">{title}</h3>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{desc}</p>
          {children && <div className="mt-3">{children}</div>}
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <section className="py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Verification Center</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Higher trust = higher RFQ acceptance, faster seller responses.
              </p>
            </div>
            <BuyerTrustBadge tier={tier} score={score} />
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Trust progress</span>
                <span className="text-sm font-normal text-muted-foreground">{reputationLabel(score)} · {score}/100</span>
              </CardTitle>
              <CardDescription>Complete each step to unlock more sellers and higher RFQ priority.</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="h-2" />
              <div className="grid grid-cols-4 text-xs mt-2 text-muted-foreground">
                <span>Unverified</span>
                <span className="text-center">Email</span>
                <span className="text-center">Company</span>
                <span className="text-right">GST</span>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Step
              done={TIER_INDEX(tier) >= 1}
              current={TIER_INDEX(tier) === 0}
              icon={MailCheck}
              title="Email verification"
              desc={user.email_confirmed_at ? `Confirmed · ${user.email}` : `Confirm your email (${user.email}) via the link we sent at signup.`}
            >
              {!user.email_confirmed_at && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    if (!user.email) return;
                    const { error } = await supabase.auth.resend({ type: "signup", email: user.email });
                    if (error) toast({ title: "Could not resend", description: "Please try again in a moment.", variant: "destructive" });
                    else toast({ title: "Confirmation email sent" });
                  }}
                >
                  Resend confirmation
                </Button>
              )}
            </Step>

            <Step
              done={TIER_INDEX(tier) >= 2}
              current={TIER_INDEX(tier) === 1}
              icon={Building2}
              title="Company verification"
              desc="Tell sellers which company you buy on behalf of. Reviewed by admin within 24h."
            >
              <div className="grid sm:grid-cols-[1fr_auto] gap-2">
                <div className="space-y-1">
                  <Label htmlFor="cn" className="sr-only">Company</Label>
                  <Input id="cn" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Registered company name" maxLength={120} disabled={TIER_INDEX(tier) >= 2} />
                </div>
                <Button onClick={verifyCompany} disabled={saving === "company" || TIER_INDEX(tier) >= 2}>
                  {saving === "company" ? <Loader2 className="h-4 w-4 animate-spin" /> : TIER_INDEX(tier) >= 2 ? "Verified" : "Submit"}
                </Button>
              </div>
            </Step>

            <Step
              done={TIER_INDEX(tier) >= 3}
              current={TIER_INDEX(tier) === 2}
              icon={FileBadge2}
              title="GST verification"
              desc="Highest tier — unlocks bulk RFQs and direct seller contact."
            >
              <div className="grid sm:grid-cols-[1fr_auto] gap-2">
                <div className="space-y-1">
                  <Label htmlFor="gst" className="sr-only">GSTIN</Label>
                  <Input id="gst" value={gstin} onChange={(e) => setGstin(e.target.value.toUpperCase())} placeholder="15-char GSTIN, e.g. 27AAAPL1234C1Z5" maxLength={15} disabled={TIER_INDEX(tier) >= 3} />
                </div>
                <Button onClick={verifyGst} disabled={saving === "gst" || TIER_INDEX(tier) >= 3 || TIER_INDEX(tier) < 2}>
                  {saving === "gst" ? <Loader2 className="h-4 w-4 animate-spin" /> : TIER_INDEX(tier) >= 3 ? "Verified" : "Submit"}
                </Button>
              </div>
              {TIER_INDEX(tier) < 2 && (
                <p className="text-xs text-muted-foreground mt-2">Complete company verification first.</p>
              )}
            </Step>
          </div>

          <div className="mt-6">
            <KYCDocsSection />
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">Why verify?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1.5">
              <p>• Sellers see your tier before responding — verified buyers get faster, better quotes.</p>
              <p>• RFQ daily limits scale with your tier (Unverified: 1 / Email: 3 / Company: 10 / GST: unlimited).</p>
              <p>• Higher reputation = priority placement in seller inboxes.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default VerificationCenter;
