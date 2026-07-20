import { friendlyErrorMessage } from "@/lib/errors";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
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
  ArrowRight,
  Building2,
  CheckCircle2,
  Globe2,
  Loader2,
  ShieldCheck,
  Store,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

const NETWORK_BENEFITS = [
  "Verified business identity and discoverable profile",
  "Custom storefront for products, brands, services and capabilities",
  "Access to market intelligence, Communities and public Lists as they launch",
  "RFQs, quotations and private commercial conversations after approval",
  "Separate MDDMA affiliation badge for eligible Association members",
];

const Apply = () => {
  const { user, company } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [isBroker, setIsBroker] = useState(false);
  const [form, setForm] = useState({
    name: "",
    tagline: "",
    description: "",
    city: "",
    country: "India",
    phone: "",
    email: "",
    website: "",
    businessId: "",
    foodLicence: "",
    categories: "",
  });

  const update = (key: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) {
      toast({
        title: "Please sign in first",
        description: "Create an account before submitting a business for verification.",
      });
      navigate("/login", { state: { from: "/apply" } });
      return;
    }

    if (company) {
      toast({
        title: "Business profile already exists",
        description: "Continue from your business profile instead of creating a duplicate.",
      });
      navigate("/account/company");
      return;
    }

    setSubmitting(true);

    const categories = form.categories
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    if (isBroker && !categories.some((value) => value.toLowerCase() === "broker")) {
      categories.push("Broker");
    }

    const { error: companyError } = await supabase.from("companies").insert({
      owner_id: user.id,
      name: form.name.trim(),
      slug: slugify(form.name),
      tagline: form.tagline.trim() || null,
      description: form.description.trim() || null,
      city: form.city.trim(),
      country: form.country.trim() || "India",
      phone: form.phone.trim() || null,
      email: form.email.trim() || user.email || null,
      website: form.website.trim() || null,
      // These legacy columns temporarily hold the equivalent local evidence for overseas businesses.
      // A future schema migration should rename them to jurisdiction-neutral identifiers.
      gstin: form.businessId.trim() || null,
      fssai: form.foodLicence.trim() || null,
      categories,
      is_hidden: true,
      review_status: "pending",
    } as never);

    setSubmitting(false);

    if (companyError) {
      toast({
        title: "Submission failed",
        description: friendlyErrorMessage(companyError),
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Business submitted for review",
      description: "G-BAU-G staff will review the business evidence and contact you if more information is required.",
    });
    navigate("/account/company");
  };

  return (
    <Layout>
      <Seo
        title="Register and Verify Your Business — G-BAU-G"
        description="Register an existing food business for verification on G-BAU-G. Indian and overseas buyers, sellers, brokers, manufacturers, brands and service providers may apply."
        path="/apply"
      />
      <PageHeader
        eyebrow="Business onboarding"
        title="Register your business"
        subtitle="Open to legitimate Indian and overseas businesses across nuts, dry fruits, seeds, dates, spices and allied food trade."
      />

      <section className="py-10">
        <div className="container mx-auto max-w-3xl space-y-6 px-4">
          <Card className="border-accent/30 ring-1 ring-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe2 className="h-5 w-5 text-accent" /> Join the verified business network
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5">
                {NETWORK_BENEFITS.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
                Verification confirms that submitted business evidence was reviewed. It is not a guarantee of
                creditworthiness, inventory, product quality or fulfilment. Monetisation and membership packaging
                are being designed separately from verification.
              </div>
            </CardContent>
          </Card>

          {company ? (
            <Card>
              <CardContent className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <Store className="mt-0.5 h-5 w-5 text-accent" />
                  <div>
                    <h2 className="font-semibold text-foreground">Your business profile already exists</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Complete or update the profile, then follow its review status from your account.
                    </p>
                  </div>
                </div>
                <Button asChild>
                  <Link to="/account/company">
                    Open business profile <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-accent" /> Business details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={submit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="business-name">Legal or trading name *</Label>
                    <Input
                      id="business-name"
                      required
                      maxLength={120}
                      value={form.name}
                      onChange={(event) => update("name", event.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="tagline">Short description</Label>
                    <Input
                      id="tagline"
                      maxLength={140}
                      value={form.tagline}
                      onChange={(event) => update("tagline", event.target.value)}
                      placeholder="e.g. Importer and processor of premium nuts and seeds"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="description">About the business</Label>
                    <Textarea
                      id="description"
                      rows={4}
                      maxLength={1000}
                      value={form.description}
                      onChange={(event) => update("description", event.target.value)}
                      placeholder="Describe what you buy, sell, manufacture, process or provide."
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        required
                        value={form.city}
                        onChange={(event) => update("city", event.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        required
                        value={form.country}
                        onChange={(event) => update("country", event.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Business phone</Label>
                      <Input
                        id="phone"
                        value={form.phone}
                        onChange={(event) => update("phone", event.target.value)}
                        placeholder="Include country code"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Business email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(event) => update("email", event.target.value)}
                        placeholder={user?.email ?? "name@business.com"}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={form.website}
                      onChange={(event) => update("website", event.target.value)}
                      placeholder="https://"
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="business-id">Tax or business registration ID</Label>
                      <Input
                        id="business-id"
                        maxLength={40}
                        value={form.businessId}
                        onChange={(event) => update("businessId", event.target.value.toUpperCase())}
                        placeholder="GSTIN, VAT, EIN or local equivalent"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="food-licence">Food-business licence</Label>
                      <Input
                        id="food-licence"
                        maxLength={40}
                        value={form.foodLicence}
                        onChange={(event) => update("foodLicence", event.target.value.toUpperCase())}
                        placeholder="FSSAI or local equivalent"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="categories">Products, services and business capabilities</Label>
                    <Input
                      id="categories"
                      value={form.categories}
                      onChange={(event) => update("categories", event.target.value)}
                      placeholder="Almonds, Seeds, Importer, Processor, Warehousing"
                    />
                    <p className="text-xs text-muted-foreground">Separate entries with commas.</p>
                  </div>

                  <label
                    htmlFor="is-broker"
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition hover:border-accent/40"
                  >
                    <Checkbox
                      id="is-broker"
                      checked={isBroker}
                      onCheckedChange={(value) => setIsBroker(value === true)}
                      className="mt-0.5"
                    />
                    <div className="text-sm">
                      <div className="font-medium">This business operates as a broker or commercial agent</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">
                        Broker status is a business capability and remains subject to verification. Outside brokers may apply.
                      </div>
                    </div>
                  </label>

                  <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                    <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                    <span>
                      The profile remains hidden until staff review it. MDDMA membership, business verification and
                      platform access are separate statuses and will be displayed separately.
                    </span>
                  </div>

                  <Button type="submit" disabled={submitting} className="w-full font-semibold">
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit business for verification"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Apply;
