import { friendlyErrorMessage } from "@/lib/errors";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Building2, ExternalLink, Loader2, ShieldCheck, Upload } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { slugify, uploadFile } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { GooglePlacesAutocomplete } from "@/components/maps/GooglePlacesAutocomplete";

interface CompanyForm {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logo_url: string;
  cover_url: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  place_id: string;
  email: string;
  phone: string;
  website: string;
  gstin: string;
  fssai: string;
  categories: string;
  certifications: string;
}

const empty: CompanyForm = {
  name: "",
  slug: "",
  tagline: "",
  description: "",
  logo_url: "",
  cover_url: "",
  city: "",
  state: "",
  country: "India",
  pincode: "",
  address: "",
  latitude: null,
  longitude: null,
  place_id: "",
  email: "",
  phone: "",
  website: "",
  gstin: "",
  fssai: "",
  categories: "",
  certifications: "",
};

const CompanyPage = () => {
  const { user, company, refresh } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState<CompanyForm>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<"pending" | "approved" | "rejected" | null>(null);
  const loadedForUserRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user || loadedForUserRef.current === user.id) return;
    loadedForUserRef.current = user.id;

    (async () => {
      const { data: rpcData } = await (
        supabase.rpc as unknown as (fn: string) => Promise<{ data: unknown }>
      )("get_my_company");
      const rows = Array.isArray(rpcData) ? rpcData : rpcData ? [rpcData] : [];
      const data = (rows[0] ?? null) as Record<string, any> | null;

      if (data) {
        setCompanyId(data.id);
        setIsVerified(Boolean(data.is_verified));
        setReviewStatus(data.review_status ?? null);
        setForm({
          name: data.name ?? "",
          slug: data.slug ?? "",
          tagline: data.tagline ?? "",
          description: data.description ?? "",
          logo_url: data.logo_url ?? "",
          cover_url: data.cover_url ?? "",
          city: data.city ?? "",
          state: data.state ?? "",
          country: data.country ?? "India",
          pincode: data.pincode ?? "",
          address: data.address ?? "",
          latitude: data.latitude ?? null,
          longitude: data.longitude ?? null,
          place_id: data.place_id ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          website: data.website ?? "",
          gstin: data.gstin ?? "",
          fssai: data.fssai ?? "",
          categories: (data.categories ?? []).join(", "),
          certifications: (data.certifications ?? []).join(", "),
        });
      }
      setLoading(false);
    })();
  }, [user]);

  if (!user) return null;

  const update = <K extends keyof CompanyForm>(key: K, value: CompanyForm[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleImage = async (kind: "logo" | "cover", event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (kind === "logo") setUploadingLogo(true);
    else setUploadingCover(true);

    const url = await uploadFile("company-assets", user.id, file);

    if (kind === "logo") setUploadingLogo(false);
    else setUploadingCover(false);

    if (url) {
      update(kind === "logo" ? "logo_url" : "cover_url", url);
      toast({ title: `${kind === "logo" ? "Logo" : "Cover"} uploaded` });
    } else {
      toast({ title: "Upload failed", variant: "destructive" });
    }
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    const slug = form.slug.trim() || slugify(form.name);
    const payload = {
      owner_id: user.id,
      name: form.name.trim(),
      slug,
      tagline: form.tagline.trim() || null,
      description: form.description.trim() || null,
      logo_url: form.logo_url || null,
      cover_url: form.cover_url || null,
      city: form.city.trim() || null,
      state: form.state.trim() || null,
      country: form.country.trim() || "India",
      address: form.address.trim() || null,
      pincode: form.pincode.trim() || null,
      latitude: form.latitude,
      longitude: form.longitude,
      place_id: form.place_id || null,
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      website: form.website.trim() || null,
      // Legacy column names retained until a jurisdiction-neutral schema migration is introduced.
      gstin: form.gstin.trim() || null,
      fssai: form.fssai.trim() || null,
      categories: form.categories
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
      certifications: form.certifications
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
    };

    const { error } = companyId
      ? await supabase.from("companies").update(payload).eq("id", companyId)
      : await supabase.from("companies").insert({
          ...payload,
          is_hidden: true,
          review_status: "pending",
        } as never);

    setSaving(false);

    if (error) {
      toast({
        title: "Save failed",
        description: friendlyErrorMessage(error),
        variant: "destructive",
      });
      return;
    }

    toast({
      title: companyId ? "Business profile updated" : "Business submitted for review",
      description: companyId
        ? undefined
        : "The profile stays hidden until G-BAU-G staff complete the initial review.",
    });
    await refresh();
    if (!companyId) navigate(0);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex py-20 justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Seo
        title="My Business Profile — G-BAU-G"
        description="Manage your private business onboarding and public G-BAU-G profile."
        path="/account/company"
        noindex
      />
      <section className="py-10">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
                <Building2 className="flex-shrink-0" /> Business profile
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Maintain the verified business identity that powers your directory profile and storefront.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {isVerified && (
                <Badge className="bg-success text-success-foreground">
                  <ShieldCheck className="mr-1 h-3 w-3" /> Business verified
                </Badge>
              )}
              {!isVerified && reviewStatus === "pending" && (
                <Badge variant="outline" className="border-warning/40 bg-warning/10 text-warning-foreground">
                  Review pending
                </Badge>
              )}
              {reviewStatus === "rejected" && (
                <Badge variant="destructive">Changes required</Badge>
              )}
              {company?.slug && (
                <Button asChild variant="outline" size="sm">
                  <Link to={`/directory/${company.slug}`}>
                    <ExternalLink className="mr-1 h-4 w-4" /> View profile
                  </Link>
                </Button>
              )}
            </div>
          </div>

          <div className="mb-6 rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Verification confirms reviewed business evidence. It does not guarantee inventory, creditworthiness,
            product quality or fulfilment. MDDMA affiliation is shown separately for eligible Association members.
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Branding</CardTitle>
                <CardDescription>Logo and cover image for the public business profile.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <Label>Logo</Label>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                        {form.logo_url ? (
                          <img src={form.logo_url} alt="Business logo" className="h-full w-full object-cover" />
                        ) : (
                          <Building2 className="text-muted-foreground" />
                        )}
                      </div>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => handleImage("logo", event)}
                          disabled={uploadingLogo}
                        />
                        <span className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted">
                          {uploadingLogo ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4" />
                          )}
                          Upload
                        </span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <Label>Cover image</Label>
                    <div className="mt-2 space-y-2">
                      <div className="h-24 w-full overflow-hidden rounded-lg border bg-muted">
                        {form.cover_url && (
                          <img src={form.cover_url} alt="Business cover" className="h-full w-full object-cover" />
                        )}
                      </div>
                      <label className="inline-block cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) => handleImage("cover", event)}
                          disabled={uploadingCover}
                        />
                        <span className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted">
                          {uploadingCover ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4" />
                          )}
                          Upload
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business details</CardTitle>
                <CardDescription>
                  Use the legal or trading identity and evidence applicable in the business jurisdiction.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Legal or trading name *</Label>
                    <Input
                      id="name"
                      value={form.name}
                      maxLength={120}
                      required
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          name: event.target.value,
                          slug: current.slug || slugify(event.target.value),
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">Profile URL</Label>
                    <Input
                      id="slug"
                      value={form.slug}
                      maxLength={60}
                      onChange={(event) => update("slug", slugify(event.target.value))}
                      placeholder="auto-generated"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="tagline">Short description *</Label>
                    <Input
                      id="tagline"
                      value={form.tagline}
                      maxLength={140}
                      required
                      onChange={(event) => update("tagline", event.target.value)}
                      placeholder="Importer, processor and distributor of nuts and seeds"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="description">About the business *</Label>
                    <Textarea
                      id="description"
                      value={form.description}
                      maxLength={2000}
                      rows={5}
                      required
                      onChange={(event) => update("description", event.target.value)}
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address">
                      Address *{" "}
                      <span className="text-xs font-normal text-muted-foreground">(powered by Google Maps)</span>
                    </Label>
                    <GooglePlacesAutocomplete
                      id="address"
                      value={form.address}
                      required
                      maxLength={200}
                      onChange={(value) => update("address", value)}
                      onPlaceSelected={(place) =>
                        setForm((current) => ({
                          ...current,
                          address: place.address || current.address,
                          city: place.city || current.city,
                          state: place.state || current.state,
                          country: place.country || current.country,
                          pincode: place.pincode || current.pincode,
                          latitude: place.latitude,
                          longitude: place.longitude,
                          place_id: place.place_id,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" value={form.city} maxLength={60} required onChange={(event) => update("city", event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State, province or region</Label>
                    <Input id="state" value={form.state} maxLength={60} onChange={(event) => update("state", event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input id="country" value={form.country} maxLength={60} required onChange={(event) => update("country", event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postal-code">Postal code</Label>
                    <Input id="postal-code" value={form.pincode} maxLength={20} onChange={(event) => update("pincode", event.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Business email *</Label>
                    <Input id="email" type="email" value={form.email} maxLength={120} required onChange={(event) => update("email", event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Business phone *{" "}
                      <span className="text-xs font-normal text-muted-foreground">(include country code)</span>
                    </Label>
                    <Input id="phone" value={form.phone} maxLength={30} required placeholder="+91 98765 43210" onChange={(event) => update("phone", event.target.value)} />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" type="url" value={form.website} maxLength={160} placeholder="https://" onChange={(event) => update("website", event.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business-id">Tax or business registration ID</Label>
                    <Input
                      id="business-id"
                      value={form.gstin}
                      maxLength={40}
                      placeholder="GSTIN, VAT, EIN or local equivalent"
                      onChange={(event) => update("gstin", event.target.value.toUpperCase())}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="food-licence">Food-business licence</Label>
                    <Input
                      id="food-licence"
                      value={form.fssai}
                      maxLength={40}
                      placeholder="FSSAI or local equivalent"
                      onChange={(event) => update("fssai", event.target.value.toUpperCase())}
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="categories">
                      Products, services and business capabilities{" "}
                      <span className="text-xs font-normal text-muted-foreground">(comma separated)</span>
                    </Label>
                    <Input
                      id="categories"
                      value={form.categories}
                      onChange={(event) => update("categories", event.target.value)}
                      placeholder="Almonds, Seeds, Importer, Processor, Warehousing"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="certifications">
                      Certifications{" "}
                      <span className="text-xs font-normal text-muted-foreground">(comma separated)</span>
                    </Label>
                    <Input
                      id="certifications"
                      value={form.certifications}
                      onChange={(event) => update("certifications", event.target.value)}
                      placeholder="ISO 22000, HACCP, Organic certification"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <Button type="button" variant="outline" asChild>
                <Link to="/account/products">Manage products →</Link>
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save business profile"}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default CompanyPage;
