import { friendlyErrorMessage } from "@/lib/errors";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { slugify } from "@/lib/storage";
import { Loader2, ShieldCheck, Building2 } from "lucide-react";

const Apply = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
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
    const { error } = await supabase.from("companies").insert({
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
    } as any);
    setSubmitting(false);
    if (error) {
      toast({ title: "Submission failed", description: friendlyErrorMessage(error), variant: "destructive" });
      return;
    }
    toast({ title: "✅ Application submitted", description: "MDDMA committee will review within 48 hours." });
    navigate("/account/company");
  };

  return (
    <Layout>
      <section className="bg-primary py-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-2">Apply for Membership</h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">Submit your firm details for committee review.</p>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4 max-w-2xl">
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
                    <Input maxLength={15} value={form.gstin} onChange={(e) => update("gstin", e.target.value)} /></div>
                </div>
                <div className="space-y-1.5"><Label>Product Categories (comma-separated)</Label>
                  <Input value={form.categories} onChange={(e) => update("categories", e.target.value)} placeholder="Almonds, Cashews, Dates" /></div>

                <div className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  Your application will be hidden from the public directory until an MDDMA admin approves it. You can still edit your storefront from your account in the meantime.
                </div>

                <Button type="submit" disabled={submitting} className="w-full bg-accent hover:bg-accent/90 text-primary font-semibold">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Application"}
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
