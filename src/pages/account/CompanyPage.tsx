import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Upload, Building2, ExternalLink, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { uploadFile, slugify } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

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
  address: string;
  email: string;
  phone: string;
  website: string;
  gstin: string;
  established_year: string;
  categories: string;
  certifications: string;
}

const empty: CompanyForm = {
  name: "", slug: "", tagline: "", description: "", logo_url: "", cover_url: "",
  city: "", state: "", country: "India", address: "", email: "", phone: "", website: "",
  gstin: "", established_year: "", categories: "", certifications: "",
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

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("companies").select("*").eq("owner_id", user.id).maybeSingle();
      if (data) {
        setCompanyId(data.id);
        setIsVerified(!!data.is_verified);
        setForm({
          name: data.name ?? "", slug: data.slug ?? "", tagline: data.tagline ?? "",
          description: data.description ?? "", logo_url: data.logo_url ?? "", cover_url: data.cover_url ?? "",
          city: data.city ?? "", state: data.state ?? "", country: data.country ?? "India",
          address: data.address ?? "", email: data.email ?? "", phone: data.phone ?? "",
          website: data.website ?? "", gstin: data.gstin ?? "",
          established_year: data.established_year?.toString() ?? "",
          categories: (data.categories ?? []).join(", "),
          certifications: (data.certifications ?? []).join(", "),
        });
      }
      setLoading(false);
    })();
  }, [user]);

  if (!user) return null;

  const handleImage = async (kind: "logo" | "cover", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (kind === "logo") setUploadingLogo(true); else setUploadingCover(true);
    const url = await uploadFile("company-assets", user.id, file);
    if (kind === "logo") setUploadingLogo(false); else setUploadingCover(false);
    if (url) {
      setForm((f) => kind === "logo" ? { ...f, logo_url: url } : { ...f, cover_url: url });
      toast({ title: `${kind === "logo" ? "Logo" : "Cover"} uploaded` });
    } else toast({ title: "Upload failed", variant: "destructive" });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
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
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      website: form.website.trim() || null,
      gstin: form.gstin.trim() || null,
      established_year: form.established_year ? parseInt(form.established_year, 10) : null,
      categories: form.categories.split(",").map((s) => s.trim()).filter(Boolean),
      certifications: form.certifications.split(",").map((s) => s.trim()).filter(Boolean),
    };

    let error;
    if (companyId) {
      ({ error } = await supabase.from("companies").update(payload).eq("id", companyId));
    } else {
      ({ error } = await supabase.from("companies").insert(payload));
    }
    setSaving(false);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else {
      toast({ title: companyId ? "Company updated" : "Company profile created" });
      await refresh();
      if (!companyId) navigate(0);
    }
  };

  if (loading) return <Layout><div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div></Layout>;

  return (
    <Layout>
      <section className="py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2"><Building2 /> Business Profile</h1>
              <p className="text-muted-foreground text-sm mt-1">This is your public storefront.</p>
            </div>
            <div className="flex items-center gap-2">
              {isVerified && <Badge className="bg-accent text-primary"><ShieldCheck className="h-3 w-3 mr-1" /> Verified</Badge>}
              {company?.slug && (
                <Button asChild variant="outline" size="sm">
                  <Link to={`/store/${company.slug}`}><ExternalLink className="h-4 w-4 mr-1" /> View store</Link>
                </Button>
              )}
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Branding</CardTitle><CardDescription>Logo and cover image</CardDescription></CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <Label>Logo</Label>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="h-20 w-20 rounded-lg border bg-muted flex items-center justify-center overflow-hidden">
                        {form.logo_url ? <img src={form.logo_url} alt="Logo" className="h-full w-full object-cover" /> : <Building2 className="text-muted-foreground" />}
                      </div>
                      <label className="cursor-pointer">
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImage("logo", e)} disabled={uploadingLogo} />
                        <span className="inline-flex items-center gap-2 px-3 py-2 rounded-md border text-sm hover:bg-muted">
                          {uploadingLogo ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload
                        </span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <Label>Cover image</Label>
                    <div className="mt-2 space-y-2">
                      <div className="h-24 w-full rounded-lg border bg-muted overflow-hidden">
                        {form.cover_url && <img src={form.cover_url} alt="Cover" className="h-full w-full object-cover" />}
                      </div>
                      <label className="cursor-pointer inline-block">
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImage("cover", e)} disabled={uploadingCover} />
                        <span className="inline-flex items-center gap-2 px-3 py-2 rounded-md border text-sm hover:bg-muted">
                          {uploadingCover ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Business Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Company name *</Label>
                    <Input id="name" value={form.name} maxLength={120} required onChange={(e) => setForm({ ...form, name: e.target.value, slug: form.slug || slugify(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">URL slug</Label>
                    <Input id="slug" value={form.slug} maxLength={60} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} placeholder="auto-generated" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input id="tagline" value={form.tagline} maxLength={140} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="description">About</Label>
                    <Textarea id="description" value={form.description} maxLength={2000} rows={5} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                  </div>
                  <div className="space-y-2"><Label>City</Label><Input value={form.city} maxLength={60} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
                  <div className="space-y-2"><Label>State</Label><Input value={form.state} maxLength={60} onChange={(e) => setForm({ ...form, state: e.target.value })} /></div>
                  <div className="space-y-2 sm:col-span-2"><Label>Address</Label><Input value={form.address} maxLength={200} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Public email</Label><Input type="email" value={form.email} maxLength={120} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Phone</Label><Input value={form.phone} maxLength={20} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Website</Label><Input value={form.website} maxLength={160} onChange={(e) => setForm({ ...form, website: e.target.value })} /></div>
                  <div className="space-y-2"><Label>GSTIN</Label><Input value={form.gstin} maxLength={15} onChange={(e) => setForm({ ...form, gstin: e.target.value.toUpperCase() })} /></div>
                  <div className="space-y-2"><Label>Established year</Label><Input type="number" value={form.established_year} onChange={(e) => setForm({ ...form, established_year: e.target.value })} /></div>
                  <div className="space-y-2 sm:col-span-2"><Label>Categories (comma separated)</Label><Input value={form.categories} onChange={(e) => setForm({ ...form, categories: e.target.value })} placeholder="Almonds, Cashews, Dates" /></div>
                  <div className="space-y-2 sm:col-span-2"><Label>Certifications (comma separated)</Label><Input value={form.certifications} onChange={(e) => setForm({ ...form, certifications: e.target.value })} placeholder="FSSAI, ISO 22000, Organic India" /></div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button type="button" variant="outline" asChild><Link to="/account/products">Manage Products →</Link></Button>
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save company"}
              </Button>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default CompanyPage;
