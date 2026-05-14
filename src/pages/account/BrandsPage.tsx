import { friendlyErrorMessage } from "@/lib/errors";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Pencil, Trash2, Upload, Sparkles, ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { uploadFile, slugify } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import type { BrandRow } from "@/repositories/brands";

const empty: Partial<BrandRow> = {
  name: "", slug: "", tagline: "", story: "",
  logo_url: "", cover_url: "", b2c_url: "",
  is_active: true, is_featured: false,
  categories: [], gallery: [],
};

async function ensureUniqueBrandSlug(base: string, currentId?: string): Promise<string> {
  const root = base || "brand";
  let candidate = root;
  for (let n = 2; n < 50; n++) {
    const { data } = await supabase.from("brands").select("id").eq("slug", candidate).limit(1);
    const conflict = (data ?? []).find((r) => r.id !== currentId);
    if (!conflict) return candidate;
    candidate = `${root}-${n}`;
  }
  return `${root}-${Date.now()}`;
}

const BrandsPage = () => {
  const { user, company } = useAuth();
  const { toast } = useToast();
  const [brands, setBrands] = useState<BrandRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<BrandRow> | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    if (!company) return;
    setLoading(true);
    const { data } = await supabase.from("brands").select("*").eq("company_id", company.id).order("created_at", { ascending: false });
    setBrands((data ?? []) as BrandRow[]);
    setLoading(false);
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [company?.id]);

  if (!user) return null;
  if (!company) return (
    <Layout>
      <div className="py-20 text-center">
        <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Create your company first</h2>
        <p className="text-muted-foreground mb-4">Brands belong to a company profile.</p>
        <Button asChild><Link to="/account/company">Create Company →</Link></Button>
      </div>
    </Layout>
  );

  const startEdit = (b?: BrandRow) => {
    setEditing(b ? { ...b } : { ...empty });
    setOpen(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "logo_url" | "cover_url") => {
    const file = e.target.files?.[0]; e.target.value = "";
    if (!file || !editing) return;
    setUploading(true);
    const url = await uploadFile("company-assets", user.id, file);
    setUploading(false);
    if (url) setEditing({ ...editing, [field]: url });
    else toast({ title: "Upload failed", variant: "destructive" });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const name = editing.name?.trim() ?? "";
    if (!name) { toast({ title: "Brand name is required", variant: "destructive" }); return; }
    setSaving(true);
    const slug = await ensureUniqueBrandSlug(slugify(name), editing.id);
    const payload = {
      company_id: company.id,
      name,
      slug,
      tagline: editing.tagline?.trim() || null,
      story: editing.story?.trim() || null,
      logo_url: editing.logo_url || null,
      cover_url: editing.cover_url || null,
      b2c_url: editing.b2c_url?.trim() || null,
      is_active: editing.is_active ?? true,
      is_featured: false, // admins flip this
      categories: editing.categories ?? [],
      gallery: editing.gallery ?? [],
    };
    let error;
    if (editing.id) ({ error } = await supabase.from("brands").update(payload).eq("id", editing.id));
    else ({ error } = await supabase.from("brands").insert(payload));
    setSaving(false);
    if (error) toast({ title: "Save failed", description: friendlyErrorMessage(error), variant: "destructive" });
    else { toast({ title: editing.id ? "Brand updated" : "Brand added" }); setOpen(false); setEditing(null); load(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this brand? Products will be unlinked.")) return;
    const { error } = await supabase.from("brands").delete().eq("id", id);
    if (error) toast({ title: "Delete failed", variant: "destructive" });
    else { toast({ title: "Brand deleted" }); load(); }
  };

  return (
    <Layout>
      <section className="py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Your Brands</h1>
              <p className="text-muted-foreground text-sm mt-1">House brands shown on /brands and your storefront. Branded products link out to your retail store.</p>
            </div>
            <Button onClick={() => startEdit()}><Plus className="h-4 w-4 mr-1" /> Add brand</Button>
          </div>

          {loading ? <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div> :
            brands.length === 0 ? (
              <Card><CardContent className="py-12 text-center">
                <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No brands yet. Add your first house brand.</p>
              </CardContent></Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {brands.map((b) => (
                  <Card key={b.id} className={!b.is_active ? "opacity-60" : ""}>
                    <div className="aspect-video bg-muted overflow-hidden rounded-t-lg">
                      {b.cover_url ? <img src={b.cover_url} alt={b.name} className="h-full w-full object-cover" loading="lazy" /> :
                       b.logo_url ? <div className="h-full w-full flex items-center justify-center"><img src={b.logo_url} alt={b.name} className="h-16 max-w-[60%] object-contain" /></div> :
                       <div className="h-full flex items-center justify-center text-muted-foreground"><Sparkles /></div>}
                    </div>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold leading-tight">{b.name}</h3>
                        {!b.is_active && <Badge variant="outline">Hidden</Badge>}
                        {b.is_featured && <Badge variant="warning">Featured</Badge>}
                      </div>
                      {b.tagline && <p className="text-xs text-muted-foreground line-clamp-2">{b.tagline}</p>}
                      {b.b2c_url && (
                        <a href={b.b2c_url} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline inline-flex items-center gap-1">
                          Retail site <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => startEdit(b)}><Pencil className="h-3 w-3 mr-1" /> Edit</Button>
                        <Button size="sm" variant="outline" asChild><Link to={`/brands/${b.slug}`}>View</Link></Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(b.id)}><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
        </div>
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit brand" : "Add brand"}</DialogTitle></DialogHeader>
          {editing && (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Logo</Label>
                  <div className="mt-1 flex items-center gap-3">
                    <div className="h-16 w-16 rounded border bg-muted overflow-hidden flex items-center justify-center">
                      {editing.logo_url ? <img src={editing.logo_url} alt="" className="h-full w-full object-contain" /> : <Sparkles className="h-5 w-5 text-muted-foreground" />}
                    </div>
                    <label className="cursor-pointer">
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, "logo_url")} disabled={uploading} />
                      <span className="inline-flex items-center gap-2 px-3 py-2 rounded-md border text-sm hover:bg-muted">
                        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} {editing.logo_url ? "Replace" : "Upload"}
                      </span>
                    </label>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Cover image</Label>
                  <div className="mt-1 flex items-center gap-3">
                    <div className="h-16 w-28 rounded border bg-muted overflow-hidden flex items-center justify-center">
                      {editing.cover_url ? <img src={editing.cover_url} alt="" className="h-full w-full object-cover" /> : <span className="text-xs text-muted-foreground">No cover</span>}
                    </div>
                    <label className="cursor-pointer">
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, "cover_url")} disabled={uploading} />
                      <span className="inline-flex items-center gap-2 px-3 py-2 rounded-md border text-sm hover:bg-muted">
                        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} {editing.cover_url ? "Replace" : "Upload"}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5"><Label>Brand name *</Label><Input required maxLength={120} value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Tagline</Label><Input maxLength={160} value={editing.tagline ?? ""} onChange={(e) => setEditing({ ...editing, tagline: e.target.value })} placeholder="e.g. Healthy crunchy snacks" /></div>
              <div className="space-y-1.5"><Label>Brand story</Label><Textarea rows={5} maxLength={2000} value={editing.story ?? ""} onChange={(e) => setEditing({ ...editing, story: e.target.value })} placeholder="What makes this brand special?" /></div>
              <div className="space-y-1.5"><Label>Retail / B2C URL</Label><Input type="url" value={editing.b2c_url ?? ""} onChange={(e) => setEditing({ ...editing, b2c_url: e.target.value })} placeholder="https://shopbazana.in" /></div>

              <div className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <Label className="text-sm">Active</Label>
                  <p className="text-xs text-muted-foreground">Show this brand publicly.</p>
                </div>
                <Switch checked={editing.is_active ?? true} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save brand"}</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default BrandsPage;
