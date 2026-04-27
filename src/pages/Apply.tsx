import { friendlyErrorMessage } from "@/lib/errors";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { slugify } from "@/lib/storage";
import {
  createPendingMembership,
  formatINR,
  TIER_LABEL,
  TIER_PRICE_INR,
  type MembershipTier,
} from "@/lib/membership";
import { Loader2, ShieldCheck, Building2, Briefcase, Star } from "lucide-react";

const TIER_DETAILS: Record<MembershipTier, { tagline: string; perks: string[]; icon: typeof Briefcase }> = {
  broker: {
    tagline: "Direct RFQ inbox + multi-seller quote tools.",
    perks: ["Quote on behalf of multiple sellers", "Verified-buyer pool", "Founding-member rate locked 24 months"],
    icon: Briefcase,
  },
  trader: {
    tagline: "Vashi APMC traders, mid-size firms.",
    perks: ["RFQ inbox · no broker tax", "Verified storefront on mddma.in/s/<your-slug>", "Founding-member rate locked 24 months"],
    icon: Building2,
  },
  importer: {
    tagline: "Importers, processors, exporters, FSSAI-licensed brands.",
    perks: ["Priority placement in directory", "Multi-product catalog + variants", "Featured circular slot · Founding-tier badge"],
    icon: Star,
  },
};

const Apply = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [tier, setTier] = useState<MembershipTier>("trader");
  const [form, setForm] = useState({
    name: "", tagline: "", description: "", city: "Mumbai", phone: "",
    email: "", gstin: "", categories: "",
  });

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Please sign in first", description: "You need an account to submit a membership application." });
      navigate("/login", { state: { from: "/apply" } });
      return;
    }
    setSubmitting(true);

    // 1. Create company application (existing flow — pending review)
    const { error: companyErr } = await supabase.from("companies").insert({
      owner_id: user.id,
      name: form.name,
      slug: slugify(form.name),
      tagline: form.tagline || null,
      description: form.description || null,
      city: form.city,
      phone: form.phone || null,
      email: form.email || user.email || null,
      gstin: form.gstin || null,
      categories: form.categories.split(",").map((s) => s.trim()).filter(Boolean),
      is_hidden: true,
      review_status: "pending",
      membership_tier: tier,
    } as never);
    if (companyErr) {
      setSubmitting(false);
      toast({ title: "Submission failed", description: friendlyErrorMessage(companyErr), variant: "destructive" });
      return;
    }

    // 2. Create the pending membership row (Razorpay payment link arrives on admin approval)
    const { error: membershipErr } = await createPendingMembership(user.id, tier);
    if (membershipErr) {
      // Company was inserted; surface a soft warning so the user can retry from /account/verify.
      console.warn("createPendingMembership failed", membershipErr);
      toast({
        title: "Application received",
        description: "We saved your firm details but couldn't queue your membership. Please complete it from My Account → Verification.",
      });
    } else {
      toast({
        title: "✅ Application submitted",
        description: "MDDMA committee will review within 48 hours and email your payment link.",
      });
    }
    setSubmitting(false);
    navigate("/account/verify");
  };

  return (
    <Layout>
      <section className="bg-primary py-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-2">Apply for Membership</h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Founding-member pricing locked for 24 months. The MDDMA committee reviews each application.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4 max-w-3xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-accent" /> Choose your membership
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={tier}
                onValueChange={(v) => setTier(v as MembershipTier)}
                className="grid gap-3 md:grid-cols-3"
              >
                {(Object.keys(TIER_DETAILS) as MembershipTier[]).map((t) => {
                  const Icon = TIER_DETAILS[t].icon;
                  return (
                    <Label
                      key={t}
                      htmlFor={`tier-${t}`}
                      className={`relative cursor-pointer rounded-lg border p-4 transition ${
                        tier === t ? "border-accent bg-accent/5 ring-1 ring-accent" : "border-border hover:border-accent/40"
                      }`}
                    >
                      <RadioGroupItem id={`tier-${t}`} value={t} className="absolute right-3 top-3" />
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-accent" />
                        <span className="font-semibold">{TIER_LABEL[t]}</span>
                      </div>
                      <div className="mt-1 text-2xl font-bold text-primary">{formatINR(TIER_PRICE_INR[t])}<span className="text-xs text-muted-foreground font-normal">/yr</span></div>
                      <p className="text-xs text-muted-foreground mt-1">{TIER_DETAILS[t].tagline}</p>
                      <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                        {TIER_DETAILS[t].perks.map((p) => (
                          <li key={p} className="flex gap-1.5"><span className="text-accent">·</span>{p}</li>
                        ))}
                      </ul>
                    </Label>
                  );
                })}
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5 text-accent" /> Firm Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={submit} className="space-y-4">
                <div className="space-y-1.5"><Label>Firm Name *</Label>
                  <Input required maxLength={120} value={form.name} onChange={(e) => update("name", e.target.value)} /></div>
                <div className="space-y-1.5"><Label>Tagline</Label>
                  <Input maxLength={140} value={form.tagline} onChange={(e) => update("tagline", e.target.value)} placeholder="e.g., Premium California almond importer" /></div>
                <div className="space-y-1.5"><Label>Description</Label>
                  <Textarea rows={3} maxLength={800} value={form.description} onChange={(e) => update("description", e.target.value)} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label>City *</Label>
                    <Input required value={form.city} onChange={(e) => update("city", e.target.value)} /></div>
                  <div className="space-y-1.5"><Label>Phone</Label>
                    <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91…" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label>Email</Label>
                    <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} /></div>
                  <div className="space-y-1.5"><Label>GSTIN</Label>
                    <Input maxLength={15} value={form.gstin} onChange={(e) => update("gstin", e.target.value.toUpperCase())} placeholder="27AAAPL1234C1Z5" /></div>
                </div>
                <div className="space-y-1.5"><Label>Product Categories (comma-separated)</Label>
                  <Input value={form.categories} onChange={(e) => update("categories", e.target.value)} placeholder="Almonds, Cashews, Dates" /></div>

                <div className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  Your application is hidden from the public directory until an MDDMA admin approves it. After approval you will receive a Razorpay payment link by email; founding-member pricing is locked until 100 paid members.
                </div>

                <Button type="submit" disabled={submitting} className="w-full bg-accent hover:bg-accent/90 text-primary font-semibold">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : `Submit Application · ${formatINR(TIER_PRICE_INR[tier])}/yr`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default Apply;
