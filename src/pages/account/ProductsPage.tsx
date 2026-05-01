import { friendlyErrorMessage } from "@/lib/errors";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Pencil, Trash2, Upload, Package, EyeOff, Eye, Layers } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { uploadFile, slugify } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { VariantManager } from "@/components/products/VariantManager";
import { useProductCategories } from "@/hooks/queries/useProductCategories";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { ORIGIN_COUNTRIES } from "@/lib/originCountries";

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  origin: string | null;
  description: string | null;
  image_url: string | null;
  gallery: string[] | null;
  video_url: string | null;
  price_min: number | null;
  price_max: number | null;
  market_avg_price: number | null;
  unit: string | null;
  stock_band: string | null;
  trend_direction: string | null;
  is_hidden: boolean;
}

const MAX_IMAGE_MB = 5;
const MAX_VIDEO_MB = 50;
const MAX_GALLERY = 3; // + 1 cover = 4 total

const emptyProduct: Partial<Product> = {
  name: "", slug: "", category: "", origin: "", description: "", image_url: "",
  gallery: [], video_url: "",
  price_min: null, price_max: null, market_avg_price: null, unit: "kg",
  stock_band: "medium", trend_direction: "stable", is_hidden: false,
};

const ProductsPage = () => {
  const { user, company } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [open, setOpen] = useState(false);
  const [variantsFor, setVariantsFor] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { data: categories } = useProductCategories({ activeOnly: true });

  const load = async () => {
    if (!company) return;
    setLoading(true);
    const { data } = await supabase.from("products").select("*").eq("company_id", company.id).order("created_at", { ascending: false });
    setProducts((data ?? []) as Product[]);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [company?.id]);

  if (!user) return null;
  if (!company) return (
    <Layout>
      <div className="py-20 text-center">
        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Create your company first</h2>
        <p className="text-muted-foreground mb-4">You need a business profile before adding products.</p>
        <Button asChild><Link to="/account/company">Create Company →</Link></Button>
      </div>
    </Layout>
  );

  const startEdit = (p?: Product) => {
    setEditing(p ? { ...p } : { ...emptyProduct });
    setOpen(true);
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !editing) return;
    if (!file.type.startsWith("image/")) { toast({ title: "Please choose an image file", variant: "destructive" }); return; }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) { toast({ title: `Image must be ≤ ${MAX_IMAGE_MB}MB`, variant: "destructive" }); return; }
    setUploading(true);
    const url = await uploadFile("product-images", user.id, file);
    setUploading(false);
    if (url) setEditing({ ...editing, image_url: url });
    else toast({ title: "Upload failed", variant: "destructive" });
  };

  const handleGalleryAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length || !editing) return;
    const current = editing.gallery ?? [];
    const remaining = MAX_GALLERY - current.length;
    if (remaining <= 0) { toast({ title: `Up to ${MAX_GALLERY} extra images`, variant: "destructive" }); return; }
    const accepted = files.slice(0, remaining).filter((f) => {
      if (!f.type.startsWith("image/")) { toast({ title: `${f.name}: not an image`, variant: "destructive" }); return false; }
      if (f.size > MAX_IMAGE_MB * 1024 * 1024) { toast({ title: `${f.name}: > ${MAX_IMAGE_MB}MB`, variant: "destructive" }); return false; }
      return true;
    });
    if (!accepted.length) return;
    setUploading(true);
    const urls: string[] = [];
    for (const f of accepted) {
      const url = await uploadFile("product-images", user.id, f);
      if (url) urls.push(url);
    }
    setUploading(false);
    if (urls.length) setEditing({ ...editing, gallery: [...current, ...urls] });
    if (urls.length < accepted.length) toast({ title: "Some uploads failed", variant: "destructive" });
  };

  const removeGalleryImage = (url: string) => {
    if (!editing) return;
    setEditing({ ...editing, gallery: (editing.gallery ?? []).filter((u) => u !== url) });
  };

  const handleVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !editing) return;
    if (!file.type.startsWith("video/")) { toast({ title: "Please choose a video file", variant: "destructive" }); return; }
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) { toast({ title: `Video must be ≤ ${MAX_VIDEO_MB}MB`, variant: "destructive" }); return; }
    setUploading(true);
    const url = await uploadFile("product-images", user.id, file);
    setUploading(false);
    if (url) setEditing({ ...editing, video_url: url });
    else toast({ title: "Upload failed", variant: "destructive" });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);

    const slug = editing.slug?.trim() || slugify(editing.name ?? "");
    const payload = {
      company_id: company.id,
      name: editing.name?.trim() ?? "",
      slug,
      category: editing.category?.trim() || null,
      origin: editing.origin?.trim() || null,
      description: editing.description?.trim() || null,
      image_url: editing.image_url || null,
      gallery: editing.gallery ?? [],
      video_url: editing.video_url || null,
      price_min: editing.price_min ?? null,
      price_max: editing.price_max ?? null,
      market_avg_price: editing.market_avg_price ?? null,
      unit: editing.unit ?? "kg",
      stock_band: (editing.stock_band ?? "medium") as "high" | "medium" | "low" | "on_order",
      trend_direction: (editing.trend_direction ?? "stable") as "rising" | "stable" | "falling",
      is_hidden: !!editing.is_hidden,
    };

    let error;
    if (editing.id) ({ error } = await supabase.from("products").update(payload).eq("id", editing.id));
    else ({ error } = await supabase.from("products").insert(payload));

    setSaving(false);
    if (error) toast({ title: "Save failed", description: friendlyErrorMessage(error), variant: "destructive" });
    else { toast({ title: editing.id ? "Product updated" : "Product added" }); setOpen(false); setEditing(null); load(); }
  };

  const toggleHidden = async (p: Product) => {
    const { error } = await supabase.from("products").update({ is_hidden: !p.is_hidden }).eq("id", p.id);
    if (error) toast({ title: "Update failed", variant: "destructive" });
    else load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast({ title: "Delete failed", variant: "destructive" });
    else { toast({ title: "Product deleted" }); load(); }
  };

  return (
    <Layout>
      <section className="py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Your Products</h1>
              <p className="text-muted-foreground text-sm mt-1">Listings shown on your storefront and in directory search.</p>
            </div>
            <Button onClick={() => startEdit()}><Plus className="h-4 w-4 mr-1" /> Add product</Button>
          </div>

          {loading ? <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div> :
            products.length === 0 ? (
              <Card><CardContent className="py-12 text-center">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No products yet. Add your first listing.</p>
              </CardContent></Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((p) => (
                  <Card key={p.id} className={p.is_hidden ? "opacity-60" : ""}>
                    <div className="aspect-video bg-muted overflow-hidden rounded-t-lg">
                      {p.image_url ? <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" loading="lazy" /> : <div className="h-full flex items-center justify-center text-muted-foreground"><Package /></div>}
                    </div>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold leading-tight">{p.name}</h3>
                        {p.is_hidden && <Badge variant="outline">Hidden</Badge>}
                      </div>
                      {p.origin && <p className="text-xs text-muted-foreground">Origin: {p.origin}</p>}
                      {(p.price_min && p.price_max) ? <p className="text-sm font-medium">₹{p.price_min} – ₹{p.price_max} / {p.unit}</p> : null}
                      <div className="flex flex-wrap gap-1 text-xs">
                        <Badge variant="secondary">{p.stock_band}</Badge>
                        <Badge variant="secondary">{p.trend_direction}</Badge>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => startEdit(p)}><Pencil className="h-3 w-3 mr-1" /> Edit</Button>
                        <Button size="sm" variant="outline" onClick={() => setVariantsFor(p)} title="Manage variants"><Layers className="h-3 w-3" /></Button>
                        <Button size="sm" variant="outline" onClick={() => toggleHidden(p)}>{p.is_hidden ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}</Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(p.id)}><Trash2 className="h-3 w-3" /></Button>
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
          <DialogHeader><DialogTitle>{editing?.id ? "Edit product" : "Add product"}</DialogTitle></DialogHeader>
          {editing && (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <Label>Image</Label>
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-20 w-20 rounded border bg-muted overflow-hidden">
                    {editing.image_url ? <img src={editing.image_url} alt="" className="h-full w-full object-cover" /> : null}
                  </div>
                  <label className="cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={handleImage} disabled={uploading} />
                    <span className="inline-flex items-center gap-2 px-3 py-2 rounded-md border text-sm hover:bg-muted">
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload
                    </span>
                  </label>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Product name *</Label><Input required maxLength={120} value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: editing.slug || slugify(e.target.value) })} /></div>
                <div className="space-y-1.5"><Label>Slug</Label><Input value={editing.slug ?? ""} onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })} /></div>
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  {(() => {
                    const current = (editing.category ?? "").trim();
                    const matchesActive = current && categories.some((c) => c.name === current);
                    const opts = categories.map((c) => ({
                      value: c.name,
                      label: c.name,
                      aliases: c.aliases ?? [],
                    }));
                    if (current && !matchesActive) {
                      opts.push({ value: current, label: `${current} (legacy)`, aliases: [] });
                    }
                    return (
                      <>
                        <SearchableSelect
                          value={current}
                          onChange={(v) => setEditing({ ...editing, category: v })}
                          options={opts}
                          placeholder="Select a category"
                          searchPlaceholder="Search category or local name…"
                        />
                        {current && !matchesActive && (
                          <p className="text-[11px] text-muted-foreground">This category is no longer active. Pick a new one.</p>
                        )}
                        {categories.length === 0 && (
                          <p className="text-[11px] text-muted-foreground">No categories yet — ask an admin to create one.</p>
                        )}
                      </>
                    );
                  })()}
                </div>
                <div className="space-y-1.5">
                  <Label>Origin</Label>
                  {(() => {
                    const current = (editing.origin ?? "").trim();
                    const inList = ORIGIN_COUNTRIES.includes(current);
                    const opts = ORIGIN_COUNTRIES.map((o) => ({ value: o, label: o }));
                    if (current && !inList) {
                      opts.unshift({ value: current, label: `${current} (legacy)` });
                    }
                    return (
                      <>
                        <SearchableSelect
                          value={current}
                          onChange={(v) => setEditing({ ...editing, origin: v })}
                          options={opts}
                          placeholder="Select origin country"
                          searchPlaceholder="Search country…"
                        />
                        <p className="text-[11px] text-muted-foreground">60 countries — type to filter</p>
                      </>
                    );
                  })()}
                </div>
                <div className="space-y-1.5"><Label>Min price (₹)</Label><Input type="number" step="0.01" value={editing.price_min ?? ""} onChange={(e) => setEditing({ ...editing, price_min: e.target.value ? parseFloat(e.target.value) : null })} /></div>
                <div className="space-y-1.5"><Label>Max price (₹)</Label><Input type="number" step="0.01" value={editing.price_max ?? ""} onChange={(e) => setEditing({ ...editing, price_max: e.target.value ? parseFloat(e.target.value) : null })} /></div>
                <div className="space-y-1.5"><Label>Market avg (₹)</Label><Input type="number" step="0.01" value={editing.market_avg_price ?? ""} onChange={(e) => setEditing({ ...editing, market_avg_price: e.target.value ? parseFloat(e.target.value) : null })} /></div>
                <div className="space-y-1.5"><Label>Unit</Label><Input value={editing.unit ?? "kg"} onChange={(e) => setEditing({ ...editing, unit: e.target.value })} /></div>
                <div className="space-y-1.5">
                  <Label>Stock band</Label>
                  <Select value={editing.stock_band ?? "medium"} onValueChange={(v) => setEditing({ ...editing, stock_band: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="on_order">On Order</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Trend</Label>
                  <Select value={editing.trend_direction ?? "stable"} onValueChange={(v) => setEditing({ ...editing, trend_direction: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rising">Rising</SelectItem>
                      <SelectItem value="stable">Stable</SelectItem>
                      <SelectItem value="falling">Falling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5"><Label>Description</Label><Textarea rows={4} maxLength={1500} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save product"}</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!variantsFor} onOpenChange={(v) => !v && setVariantsFor(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Manage variants</DialogTitle></DialogHeader>
          {variantsFor && <VariantManager productId={variantsFor.id} productName={variantsFor.name} />}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ProductsPage;
