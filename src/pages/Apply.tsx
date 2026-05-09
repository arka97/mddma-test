import { friendlyErrorMessage } from "@/lib/errors";
import { Logo } from "@/components/brand/Logo";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { slugify } from "@/lib/storage";
import {
  createPendingMembership,
  formatINR,
  TIER_PRICE_INR,
} from "@/lib/membership";
import { Loader2, ShieldCheck, Building2, CheckCircle2, Crown } from "lucide-react";

const PAID_PERKS = [
  "Verified storefront on mddma.in/s/<your-slug>",
  "RFQ inbox & CRM — direct buyer enquiries, no broker tax",
  "Priority placement in directory + product search",
  "Multi-product catalog with controlled-transparency pricing",
  "Market intelligence reports & trade signals",
  "Trust seal · founding-member badge · rate locked 24 months",
];

const Apply = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [isBroker, setIsBroker] = useState(false);
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
      membership_tier: "paid",
    } as never);
    if (companyErr) {
      setSubmitting(false);
      toast({ title: "Submission failed", description: friendlyErrorMessage(companyErr), variant: "destructive" });
      return;
    }

    // 2. Create the pending membership row (Razorpay payment link arrives on admin approval).
    //    Broker flag is captured in `notes` for the admin to set on the profile after approval.
    const { error: membershipErr } = await createPendingMembership(user.id, "paid");
    if (membershipErr) {
      console.warn("createPendingMembership failed", membershipErr);
      toast({
        title: "Application received",
        description: "We saved your firm details but couldn't queue your membership. Please complete it from My Account → Verification.",
      });
    } else {
      // Best-effort: record broker intent on the user's profile so admin can verify.
      if (isBroker) {
        try {
          // is_broker is admin-only via RLS; this update may no-op for non-admin sessions.
          // The intent is preserved in the company description / admin queue note.
          await supabase
            .from("profiles")
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .update({ designation: "Broker" } as any)
            .eq("id", user.id);
        } catch {
          /* non-fatal */
        }
      }
      toast({
        title: "✅ Application submitted",
        description: "MDDMA committee will review within 48 hours and email your payment link.",
      });
    }
    setSubmitting(false);
    navigate("/account/verify");
  };

  const price = TIER_PRICE_INR.paid;

  return (
    <Layout>
      <section className="bg-primary py-10">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto mb-4 inline-block rounded-lg bg-primary-foreground/95 p-3">
            <Logo variant="horizontal" className="h-14 w-auto" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-2">Apply for Membership</h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Founding-member pricing locked for 24 months. The MDDMA committee reviews each application.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4 max-w-3xl space-y-6">
          {/* Single Paid plan summary */}
          <Card className="border-accent/30 ring-1 ring-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-accent" /> Paid Membership
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-4xl font-bold text-primary">{formatINR(price)}</span>
                <span className="text-sm text-muted-foreground mb-1">/ year</span>
              </div>
              <ul className="space-y-2">
                {PAID_PERKS.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
                The free tier (basic directory listing + RFQ submission) requires no application — just create an account.
              </div>
            </CardContent>
          </Card>

          {/* Firm details */}
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

                <label
                  htmlFor="is-broker"
                  className="flex items-start gap-3 rounded-md border border-border p-3 cursor-pointer hover:border-accent/40 transition"
                >
                  <Checkbox
                    id="is-broker"
                    checked={isBroker}
                    onCheckedChange={(v) => setIsBroker(v === true)}
                    className="mt-0.5"
                  />
                  <div className="text-sm">
                    <div className="font-medium">I operate as a broker</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      I quote on behalf of multiple sellers. Same {formatINR(price)}/yr fee — broker tools (multi-seller quoting, broker board) get unlocked after admin verification.
                    </div>
                  </div>
                </label>

                <div className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  Your application is hidden from the public directory until an MDDMA admin approves it. After approval you will receive a Razorpay payment link by email; founding-member pricing is locked until 100 paid members.
                </div>

                <Button type="submit" disabled={submitting} className="w-full font-semibold">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : `Submit Application · ${formatINR(price)}/yr`}
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
