import { friendlyErrorMessage } from "@/lib/errors";
import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, ShieldCheck, EyeOff, Eye, Building2, Package, UserCog, Star, Trash2, Megaphone, Send, Crown, FileCheck2, Link as LinkIcon, CircleX, CircleCheck, ExternalLink, Layers, Pencil, Plus, Upload, Newspaper, Smile } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { listCategories, createCategory, updateCategory, deleteCategory, countProductsForCategory, type ProductCategoryRow } from "@/repositories/productCategories";
import { slugify } from "@/lib/storage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link, Navigate } from "react-router-dom";

import { uploadFile, validateFile, UploadValidationError } from "@/lib/storage";
import { tierLabel } from "@/lib/membership";

const AdminModeration = () => {
  const { hasRole, loading: authLoading, user } = useAuth();
  const { toast } = useToast();
  const [companies, setCompanies] = useState<{ id: string; name: string; slug: string; is_verified: boolean; is_hidden: boolean; city: string | null; logo_url: string | null; review_status?: string }[]>([]);
  const [products, setProducts] = useState<{ id: string; name: string; slug: string; is_hidden: boolean; is_featured: boolean; company_id: string; image_url: string | null }[]>([]);
  const [users, setUsers] = useState<{ id: string; full_name: string | null; avatar_url: string | null; roles: string[] }[]>([]);
  type CircularAttachment = { url: string; name: string; type: "pdf" | "image"; mime: string; size: number };
  const [circulars, setCirculars] = useState<{ id: string; title: string; body: string; is_published: boolean; created_at: string; attachments: CircularAttachment[] }[]>([]);
  const [circularForm, setCircularForm] = useState<{ title: string; body: string; category: string; files: File[] }>({ title: "", body: "", category: "general", files: [] });
  const [savingCircular, setSavingCircular] = useState(false);
  const [ads, setAds] = useState<{ id: string; title: string; image_url: string; link_url: string | null; placement: string; is_active: boolean; start_date: string; end_date: string | null; priority: number }[]>([]);
  const [adForm, setAdForm] = useState({ title: "", link_url: "", placement: "homepage-banner", priority: 0, file: null as File | null });
  const [savingAd, setSavingAd] = useState(false);
  const [categories, setCategories] = useState<ProductCategoryRow[]>([]);
  const emptyCatForm = { id: "", name: "", slug: "", description: "", image_url: "", sort_order: 0, is_active: true, is_featured: false, aliases: "" };
  const [catForm, setCatForm] = useState<typeof emptyCatForm>(emptyCatForm);
  const [savingCat, setSavingCat] = useState(false);
  const [uploadingCatImg, setUploadingCatImg] = useState(false);

  // Market News
  const [marketNews, setMarketNews] = useState<{ id: string; title: string; summary: string | null; is_published: boolean; created_at: string; image_url: string | null; source_name: string | null }[]>([]);
  const emptyNewsForm = { title: "", summary: "", body: "", source_name: "", source_url: "", category: "", image_url: "", sort_order: 0 };
  const [newsForm, setNewsForm] = useState(emptyNewsForm);
  const [savingNews, setSavingNews] = useState(false);
  const [uploadingNewsImg, setUploadingNewsImg] = useState(false);

  // Humor
  const [humorPosts, setHumorPosts] = useState<{ id: string; title: string; body: string; is_published: boolean; created_at: string; image_url: string | null; attribution: string | null }[]>([]);
  const emptyHumorForm = { title: "", body: "", image_url: "", attribution: "", sort_order: 0 };
  const [humorForm, setHumorForm] = useState(emptyHumorForm);
  const [savingHumor, setSavingHumor] = useState(false);
  const [uploadingHumorImg, setUploadingHumorImg] = useState(false);

  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [{ data: c }, { data: p }, { data: prof }, { data: r }, { data: circ }, { data: adRows }, cats, { data: mn }, { data: hp }] = await Promise.all([
      supabase.from("companies").select("id,name,slug,is_verified,is_hidden,city,logo_url,review_status").order("created_at", { ascending: false }),
      supabase.from("products").select("id,name,slug,is_hidden,is_featured,company_id,image_url").order("created_at", { ascending: false }),
      supabase.from("profiles").select("id,full_name,avatar_url"),
      supabase.from("user_roles").select("user_id,role"),
      supabase.from("circulars").select("id,title,body,is_published,created_at,attachments").order("created_at", { ascending: false }),
      supabase.from("advertisements").select("id,title,image_url,link_url,placement,is_active,start_date,end_date,priority").order("priority", { ascending: false }).order("created_at", { ascending: false }),
      listCategories().catch(() => [] as ProductCategoryRow[]),
      (supabase as any).from("market_news").select("id,title,summary,is_published,created_at,image_url,source_name").order("sort_order", { ascending: false }).order("created_at", { ascending: false }),
      (supabase as any).from("humor_posts").select("id,title,body,is_published,created_at,image_url,attribution").order("sort_order", { ascending: false }).order("created_at", { ascending: false }),
    ]);
    setCompanies((c ?? []) as typeof companies);
    setProducts(p ?? []);
    setCirculars(((circ ?? []) as unknown) as typeof circulars);
    setAds((adRows ?? []) as typeof ads);
    setCategories(cats);
    setMarketNews((mn ?? []) as typeof marketNews);
    setHumorPosts((hp ?? []) as typeof humorPosts);
    const rolesByUser: Record<string, string[]> = {};
    (r ?? []).forEach((x: { user_id: string; role: string }) => { (rolesByUser[x.user_id] ||= []).push(x.role); });
    setUsers((prof ?? []).map((u) => ({ ...u, roles: rolesByUser[u.id] ?? [] })));
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (!authLoading && hasRole("admin")) load(); }, [authLoading]);

  if (authLoading) return <Layout><div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div></Layout>;
  if (!hasRole("admin")) return <Navigate to="/" replace />;

  const toggleVerified = async (id: string, val: boolean) => {
    const { error } = await supabase.from("companies").update({ is_verified: val }).eq("id", id);
    if (error) toast({ title: "Failed", variant: "destructive" }); else load();
  };
  const toggleCompanyHidden = async (id: string, val: boolean) => {
    const { error } = await supabase.from("companies").update({ is_hidden: val }).eq("id", id);
    if (error) toast({ title: "Failed", variant: "destructive" }); else load();
  };
  const toggleProductHidden = async (id: string, val: boolean) => {
    const { error } = await supabase.from("products").update({ is_hidden: val }).eq("id", id);
    if (error) toast({ title: "Failed", variant: "destructive" }); else load();
  };
  const toggleProductFeatured = async (id: string, val: boolean) => {
    const { error } = await supabase.from("products").update({ is_featured: val }).eq("id", id);
    if (error) toast({ title: "Failed", variant: "destructive" }); else load();
  };
  const deleteProduct = async (id: string) => {
    if (!confirm("Permanently delete this product and its variants?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast({ title: "Delete failed", description: friendlyErrorMessage(error), variant: "destructive" });
    else { toast({ title: "Product deleted" }); load(); }
  };
  const setRole = async (uid: string, role: "admin" | "broker" | "paid_member" | "free_member", add: boolean) => {
    if (add) {
      const { error } = await supabase.from("user_roles").insert({ user_id: uid, role });
      if (error) { toast({ title: "Failed", description: friendlyErrorMessage(error), variant: "destructive" }); return; }
      // Invariant: a member is either Free or Paid, never both. The DB trigger
      // already removes free_member when paid_member/broker is granted; mirror
      // the inverse here so granting Free clears any upgraded roles.
      if (role === "free_member") {
        await supabase.from("user_roles").delete().eq("user_id", uid).in("role", ["paid_member", "broker"]);
      }
    } else {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", uid).eq("role", role);
      if (error) { toast({ title: "Failed", description: friendlyErrorMessage(error), variant: "destructive" }); return; }
    }
    load();
  };

  // Circulars
  const saveCircular = async () => {
    if (!user || !circularForm.title.trim() || !circularForm.body.trim()) return;
    if (circularForm.files.length > 5) {
      toast({ title: "Max 5 attachments", variant: "destructive" });
      return;
    }
    setSavingCircular(true);
    const attachments: CircularAttachment[] = [];
    for (const f of circularForm.files) {
      try {
        validateFile(f, { allowPdf: true });
      } catch (e) {
        const msg = e instanceof UploadValidationError ? e.message : "Invalid file";
        toast({ title: `Skipped ${f.name}`, description: msg, variant: "destructive" });
        continue;
      }
      const url = await uploadFile("circular-assets", user.id, f);
      if (!url) {
        toast({ title: `Upload failed: ${f.name}`, variant: "destructive" });
        continue;
      }
      attachments.push({
        url,
        name: f.name,
        type: f.type === "application/pdf" ? "pdf" : "image",
        mime: f.type,
        size: f.size,
      });
    }
    const { error } = await supabase.from("circulars").insert({
      title: circularForm.title,
      body: circularForm.body,
      category: circularForm.category,
      created_by: user.id,
      is_published: true,
      published_at: new Date().toISOString(),
      attachments: attachments as unknown as never,
    });
    setSavingCircular(false);
    if (error) toast({ title: "Failed", description: friendlyErrorMessage(error), variant: "destructive" });
    else { toast({ title: "Circular published" }); setCircularForm({ title: "", body: "", category: "general", files: [] }); load(); }
  };
  const togglePublishCircular = async (id: string, val: boolean) => {
    const { error } = await supabase.from("circulars").update({ is_published: val, published_at: val ? new Date().toISOString() : null }).eq("id", id);
    if (error) toast({ title: "Failed", variant: "destructive" }); else load();
  };
  const deleteCircular = async (id: string) => {
    if (!confirm("Delete this circular?")) return;
    const { error } = await supabase.from("circulars").delete().eq("id", id);
    if (error) toast({ title: "Failed", variant: "destructive" }); else load();
  };

  // Ads
  const saveAd = async () => {
    if (!user || !adForm.title.trim() || !adForm.file) {
      toast({ title: "Title and image required", variant: "destructive" });
      return;
    }
    setSavingAd(true);
    const url = await uploadFile("ad-assets", user.id, adForm.file);
    if (!url) { setSavingAd(false); toast({ title: "Image upload failed", variant: "destructive" }); return; }
    const { error } = await supabase.from("advertisements").insert({
      title: adForm.title,
      image_url: url,
      link_url: adForm.link_url || null,
      placement: adForm.placement,
      priority: adForm.priority,
      is_active: true,
    });
    setSavingAd(false);
    if (error) toast({ title: "Failed", description: friendlyErrorMessage(error), variant: "destructive" });
    else { toast({ title: "Ad published" }); setAdForm({ title: "", link_url: "", placement: "homepage-banner", priority: 0, file: null }); load(); }
  };
  const toggleAdActive = async (id: string, val: boolean) => {
    const { error } = await supabase.from("advertisements").update({ is_active: val }).eq("id", id);
    if (error) toast({ title: "Failed", variant: "destructive" }); else load();
  };
  const updateAdPriority = async (id: string, val: number) => {
    const { error } = await supabase.from("advertisements").update({ priority: val }).eq("id", id);
    if (error) toast({ title: "Failed", description: friendlyErrorMessage(error), variant: "destructive" }); else load();
  };
  const deleteAd = async (id: string) => {
    if (!confirm("Delete this ad?")) return;
    const { error } = await supabase.from("advertisements").delete().eq("id", id);
    if (error) toast({ title: "Failed", variant: "destructive" }); else load();
  };

  // Categories
  const startEditCat = (c?: ProductCategoryRow) => {
    if (c) setCatForm({ id: c.id, name: c.name, slug: c.slug, description: c.description ?? "", image_url: c.image_url ?? "", sort_order: c.sort_order, is_active: c.is_active, is_featured: c.is_featured, aliases: (c.aliases ?? []).join(", ") });
    else setCatForm(emptyCatForm);
  };
  const handleCatImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploadingCatImg(true);
    const url = await uploadFile("product-images", user.id, file);
    setUploadingCatImg(false);
    if (url) setCatForm((f) => ({ ...f, image_url: url }));
    else toast({ title: "Upload failed", variant: "destructive" });
  };
  const saveCategory = async () => {
    const name = catForm.name.trim();
    if (!name) { toast({ title: "Name required", variant: "destructive" }); return; }
    const slug = (catForm.slug.trim() || slugify(name));
    setSavingCat(true);
    try {
      const payload = {
        name,
        slug,
        description: catForm.description.trim() || null,
        image_url: catForm.image_url || null,
        sort_order: Number.isFinite(catForm.sort_order) ? catForm.sort_order : 0,
        is_active: catForm.is_active,
        is_featured: catForm.is_featured,
        aliases: catForm.aliases.split(",").map((s) => s.trim()).filter(Boolean),
      };
      if (catForm.id) await updateCategory(catForm.id, payload);
      else await createCategory(payload);
      toast({ title: catForm.id ? "Category updated" : "Category created" });
      setCatForm(emptyCatForm);
      load();
    } catch (err) {
      toast({ title: "Save failed", description: err instanceof Error ? err.message : String(err), variant: "destructive" });
    } finally {
      setSavingCat(false);
    }
  };
  const removeCategory = async (c: ProductCategoryRow) => {
    const used = await countProductsForCategory(c.name);
    const msg = used > 0
      ? `Delete "${c.name}"? ${used} product${used === 1 ? "" : "s"} use this category — they will keep the text label but lose the curated entry.`
      : `Delete "${c.name}"?`;
    if (!confirm(msg)) return;
    try {
      await deleteCategory(c.id);
      toast({ title: "Category deleted" });
      if (catForm.id === c.id) setCatForm(emptyCatForm);
      load();
    } catch (err) {
      toast({ title: "Delete failed", description: err instanceof Error ? err.message : String(err), variant: "destructive" });
    }
  };

  // Market News
  const uploadNewsImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploadingNewsImg(true);
    const url = await uploadFile("ad-assets", user.id, file);
    setUploadingNewsImg(false);
    if (url) setNewsForm((f) => ({ ...f, image_url: url }));
    else toast({ title: "Upload failed", variant: "destructive" });
  };
  const saveNews = async () => {
    if (!user || !newsForm.title.trim()) { toast({ title: "Title required", variant: "destructive" }); return; }
    setSavingNews(true);
    const { error } = await (supabase as any).from("market_news").insert({
      title: newsForm.title.trim(),
      summary: newsForm.summary.trim() || null,
      body: newsForm.body.trim() || null,
      source_name: newsForm.source_name.trim() || null,
      source_url: newsForm.source_url.trim() || null,
      category: newsForm.category.trim() || null,
      image_url: newsForm.image_url || null,
      sort_order: Number(newsForm.sort_order) || 0,
      is_published: true,
      published_at: new Date().toISOString(),
      created_by: user.id,
    });
    setSavingNews(false);
    if (error) toast({ title: "Failed", description: friendlyErrorMessage(error), variant: "destructive" });
    else { toast({ title: "News published" }); setNewsForm(emptyNewsForm); load(); }
  };
  const toggleNewsPublished = async (id: string, val: boolean) => {
    const { error } = await (supabase as any).from("market_news").update({ is_published: val, published_at: val ? new Date().toISOString() : null }).eq("id", id);
    if (error) toast({ title: "Failed", variant: "destructive" }); else load();
  };
  const deleteNews = async (id: string) => {
    if (!confirm("Delete this news item?")) return;
    const { error } = await (supabase as any).from("market_news").delete().eq("id", id);
    if (error) toast({ title: "Failed", variant: "destructive" }); else load();
  };

  // Humor
  const uploadHumorImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploadingHumorImg(true);
    const url = await uploadFile("ad-assets", user.id, file);
    setUploadingHumorImg(false);
    if (url) setHumorForm((f) => ({ ...f, image_url: url }));
    else toast({ title: "Upload failed", variant: "destructive" });
  };
  const saveHumor = async () => {
    if (!user || !humorForm.title.trim() || !humorForm.body.trim()) { toast({ title: "Title and body required", variant: "destructive" }); return; }
    setSavingHumor(true);
    const { error } = await (supabase as any).from("humor_posts").insert({
      title: humorForm.title.trim(),
      body: humorForm.body.trim(),
      image_url: humorForm.image_url || null,
      attribution: humorForm.attribution.trim() || null,
      sort_order: Number(humorForm.sort_order) || 0,
      is_published: true,
      published_at: new Date().toISOString(),
      created_by: user.id,
    });
    setSavingHumor(false);
    if (error) toast({ title: "Failed", description: friendlyErrorMessage(error), variant: "destructive" });
    else { toast({ title: "Humor published" }); setHumorForm(emptyHumorForm); load(); }
  };
  const toggleHumorPublished = async (id: string, val: boolean) => {
    const { error } = await (supabase as any).from("humor_posts").update({ is_published: val, published_at: val ? new Date().toISOString() : null }).eq("id", id);
    if (error) toast({ title: "Failed", variant: "destructive" }); else load();
  };
  const deleteHumor = async (id: string) => {
    if (!confirm("Delete this humor post?")) return;
    const { error } = await (supabase as any).from("humor_posts").delete().eq("id", id);
    if (error) toast({ title: "Failed", variant: "destructive" }); else load();
  };


  return (
    <Layout>
        <Seo title="Moderation — MDDMA" description="Members-only page." path="/account/moderation" noindex />
      <section className="py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <h1 className="text-3xl font-bold mb-6 flex items-center gap-2"><ShieldCheck /> Admin Moderation</h1>

          {loading ? <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div> : (
            <Tabs defaultValue="companies">
              <TabsList className="flex-wrap h-auto">
                <TabsTrigger value="companies"><Building2 className="h-3 w-3 mr-1" /> Companies ({companies.length})</TabsTrigger>
                <TabsTrigger value="products"><Package className="h-3 w-3 mr-1" /> Products ({products.length})</TabsTrigger>
                <TabsTrigger value="users"><UserCog className="h-3 w-3 mr-1" /> Users ({users.length})</TabsTrigger>
                <TabsTrigger value="circulars"><Megaphone className="h-3 w-3 mr-1" /> Circulars ({circulars.length})</TabsTrigger>
                <TabsTrigger value="ads"><Star className="h-3 w-3 mr-1" /> Ads ({ads.length})</TabsTrigger>
                <TabsTrigger value="categories"><Layers className="h-3 w-3 mr-1" /> Categories ({categories.length})</TabsTrigger>
                <TabsTrigger value="news"><Newspaper className="h-3 w-3 mr-1" /> Market News ({marketNews.length})</TabsTrigger>
                <TabsTrigger value="humor"><Smile className="h-3 w-3 mr-1" /> Humor ({humorPosts.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="companies" className="space-y-2 mt-4">
                {companies.map((c) => (
                  <Card key={c.id}>
                    <CardContent className="p-3 flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-muted overflow-hidden flex-shrink-0">
                        {c.logo_url && <img src={c.logo_url} alt="" className="h-full w-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{c.name}</p>
                        <p className="text-xs text-muted-foreground truncate">/{c.slug} · {c.city ?? "—"}</p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {c.is_verified && <Badge className="bg-accent text-accent-foreground">Verified</Badge>}
                        {c.is_hidden && <Badge variant="outline">Hidden</Badge>}
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => toggleVerified(c.id, !c.is_verified)}>{c.is_verified ? "Unverify" : "Verify"}</Button>
                        <Button size="sm" variant="outline" onClick={() => toggleCompanyHidden(c.id, !c.is_hidden)}>{c.is_hidden ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="products" className="space-y-2 mt-4">
                {products.map((p) => {
                  const owner = companies.find((c) => c.id === p.company_id);
                  return (
                    <Card key={p.id}>
                      <CardContent className="p-3 flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex items-start gap-3 min-w-0 flex-1 w-full">
                          <div className="h-10 w-10 rounded bg-muted overflow-hidden flex-shrink-0">
                            {p.image_url && <img src={p.image_url} alt="" className="h-full w-full object-cover" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{p.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {owner ? `Seller: ${owner.name}` : "Unknown seller"} · /{p.slug}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap sm:ml-auto sm:shrink-0">
                          <div className="flex flex-wrap gap-1">
                            {p.is_featured && <Badge className="bg-accent text-accent-foreground">Featured</Badge>}
                            {p.is_hidden && <Badge variant="outline">Hidden</Badge>}
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline" asChild title="View on site">
                              <Link to={`/products/${p.slug}`}><Eye className="h-3 w-3" /></Link>
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => toggleProductFeatured(p.id, !p.is_featured)} title={p.is_featured ? "Unfeature" : "Feature"}>
                              <Star className={`h-3 w-3 ${p.is_featured ? "fill-current" : ""}`} />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => toggleProductHidden(p.id, !p.is_hidden)} title={p.is_hidden ? "Unhide" : "Hide"}>
                              {p.is_hidden ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => deleteProduct(p.id)} title="Delete">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </TabsContent>

              <TabsContent value="users" className="space-y-2 mt-4">
                {users.map((u) => (
                  <Card key={u.id}>
                    <CardContent className="p-3 flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex items-start gap-3 min-w-0 flex-1 w-full">
                        <div className="h-10 w-10 rounded-full bg-muted overflow-hidden flex-shrink-0">
                          {u.avatar_url && <img src={u.avatar_url} alt="" className="h-full w-full object-cover" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{u.full_name ?? "Unnamed"}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(u.roles.includes("paid_member") || u.roles.includes("broker")
                              ? u.roles.filter((r) => r !== "free_member")
                              : u.roles
                            ).map((r) => <Badge key={r} variant="secondary" className="text-xs">{r}</Badge>)}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 sm:flex-nowrap sm:ml-auto sm:shrink-0">
                        {(["admin", "paid_member", "broker"] as const).map((r) => (
                          <Button key={r} size="sm" variant={u.roles.includes(r) ? "default" : "outline"} onClick={() => setRole(u.id, r, !u.roles.includes(r))}>{r}</Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="circulars" className="space-y-4 mt-4">
                <Card>
                  <CardHeader><CardTitle className="text-base">Compose New Circular</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1.5"><Label>Title</Label><Input maxLength={200} value={circularForm.title} onChange={(e) => setCircularForm({ ...circularForm, title: e.target.value })} /></div>
                    <div className="space-y-1.5"><Label>Body</Label><Textarea rows={4} maxLength={4000} value={circularForm.body} onChange={(e) => setCircularForm({ ...circularForm, body: e.target.value })} /></div>
                    <div className="space-y-1.5"><Label>Category</Label><Input maxLength={50} value={circularForm.category} onChange={(e) => setCircularForm({ ...circularForm, category: e.target.value })} /></div>
                    <div className="space-y-1.5">
                      <Label>Attachments (up to 5 — PDF / JPG / PNG / WEBP)</Label>
                      <Input
                        type="file"
                        multiple
                        accept="application/pdf,image/jpeg,image/png,image/webp"
                        onChange={(e) => {
                          const picked = Array.from(e.target.files ?? []);
                          const combined = [...circularForm.files, ...picked].slice(0, 5);
                          setCircularForm({ ...circularForm, files: combined });
                          e.target.value = "";
                        }}
                      />
                      {circularForm.files.length > 0 && (
                        <ul className="space-y-1 mt-2">
                          {circularForm.files.map((f, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs bg-muted/40 rounded px-2 py-1">
                              <span className="flex-1 truncate">{f.name} <span className="text-muted-foreground">({Math.round(f.size / 1024)} KB)</span></span>
                              <button
                                type="button"
                                className="text-destructive hover:underline"
                                onClick={() => setCircularForm({ ...circularForm, files: circularForm.files.filter((_, j) => j !== i) })}
                              >
                                Remove
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                      <p className="text-[11px] text-muted-foreground">Max 25 MB per PDF, 10 MB per image. No SVG.</p>
                    </div>
                    <Button onClick={saveCircular} disabled={savingCircular} variant="accent">
                      {savingCircular ? <Loader2 className="h-3 w-3 animate-spin" /> : <><Send className="h-3 w-3 mr-1" /> Publish</>}
                    </Button>
                  </CardContent>
                </Card>
                {circulars.map((c) => (
                  <Card key={c.id}>
                    <CardContent className="p-3 flex flex-col sm:flex-row sm:items-start gap-3">
                      <div className="flex-1 min-w-0 w-full">
                        <p className="font-medium">{c.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{c.body}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(c.created_at).toLocaleDateString()}
                          {Array.isArray(c.attachments) && c.attachments.length > 0 && (
                            <> · {c.attachments.length} attachment{c.attachments.length === 1 ? "" : "s"}</>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap sm:ml-auto sm:shrink-0">
                        {c.is_published ? <Badge className="bg-accent text-accent-foreground">Live</Badge> : <Badge variant="outline">Draft</Badge>}
                        <Button size="sm" variant="outline" onClick={() => togglePublishCircular(c.id, !c.is_published)}>{c.is_published ? "Unpublish" : "Publish"}</Button>
                        <Button size="sm" variant="outline" onClick={() => deleteCircular(c.id)}><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="ads" className="space-y-4 mt-4">
                <Card>
                  <CardHeader><CardTitle className="text-base">Upload New Ad</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1.5"><Label>Title</Label><Input maxLength={120} value={adForm.title} onChange={(e) => setAdForm({ ...adForm, title: e.target.value })} /></div>
                    <div className="space-y-1.5"><Label>Click-through URL</Label><Input maxLength={500} placeholder="https://..." value={adForm.link_url} onChange={(e) => setAdForm({ ...adForm, link_url: e.target.value })} /></div>
                    <div className="space-y-1.5">
                      <Label>Placement</Label>
                      <select className="w-full border rounded h-9 px-2 text-sm bg-background" value={adForm.placement} onChange={(e) => setAdForm({ ...adForm, placement: e.target.value })}>
                        <option value="homepage-banner">Homepage Banner</option>
                        <option value="directory-banner">Directory Banner</option>
                        <option value="products-banner">Products Banner</option>
                        <option value="circulars-banner">Circulars Banner</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Priority (higher shows first)</Label>
                      <Input type="number" value={adForm.priority} onChange={(e) => setAdForm({ ...adForm, priority: Number(e.target.value) || 0 })} />
                    </div>
                    <div className="space-y-1.5"><Label>Image</Label><Input type="file" accept="image/*" onChange={(e) => setAdForm({ ...adForm, file: e.target.files?.[0] ?? null })} /></div>
                    <Button onClick={saveAd} disabled={savingAd} variant="accent">
                      {savingAd ? <Loader2 className="h-3 w-3 animate-spin" /> : "Publish Ad"}
                    </Button>
                  </CardContent>
                </Card>
                {ads.map((a) => (
                  <Card key={a.id}>
                    <CardContent className="p-3 flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex items-start gap-3 min-w-0 flex-1 w-full">
                        <img src={a.image_url} alt={a.title} className="h-12 w-20 object-cover rounded flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{a.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{a.placement} · priority {a.priority} · {a.start_date}{a.end_date ? ` → ${a.end_date}` : ""}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap sm:ml-auto sm:shrink-0">
                        <div className="flex items-center gap-1.5">
                          <Label className="sr-only sm:not-sr-only text-xs text-muted-foreground">Priority</Label>
                          <Input
                            type="number"
                            defaultValue={a.priority}
                            aria-label="Priority"
                            className="h-8 w-16 sm:w-20"
                            onBlur={(e) => {
                              const v = Number(e.target.value) || 0;
                              if (v !== a.priority) updateAdPriority(a.id, v);
                            }}
                          />
                        </div>
                        {a.is_active ? <Badge className="bg-accent text-accent-foreground">Active</Badge> : <Badge variant="outline">Paused</Badge>}
                        <Button size="sm" variant="outline" onClick={() => toggleAdActive(a.id, !a.is_active)}>{a.is_active ? "Pause" : "Activate"}</Button>
                        <Button size="sm" variant="outline" onClick={() => deleteAd(a.id)}><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="categories" className="space-y-4 mt-4">
                <Card>
                  <CardHeader><CardTitle className="text-base">{catForm.id ? "Edit Category" : "Add Category"}</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label>Name *</Label>
                        <Input maxLength={80} value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value, slug: catForm.id ? catForm.slug : slugify(e.target.value) })} placeholder="e.g. Dried Fruits" />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Slug</Label>
                        <Input maxLength={80} value={catForm.slug} onChange={(e) => setCatForm({ ...catForm, slug: slugify(e.target.value) })} placeholder="auto-generated" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Description</Label>
                      <Textarea rows={2} maxLength={300} value={catForm.description} onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Aliases (colloquial names, comma-separated)</Label>
                      <Input maxLength={200} value={catForm.aliases} onChange={(e) => setCatForm({ ...catForm, aliases: e.target.value })} placeholder="e.g. Kaju, Cashew Nuts" />
                      <p className="text-[11px] text-muted-foreground">Buyers can search by these names — they won&apos;t appear on the public label.</p>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Image</Label>
                      <div className="flex items-center gap-3">
                        <div className="h-16 w-16 rounded border bg-muted overflow-hidden flex-shrink-0">
                          {catForm.image_url && <img src={catForm.image_url} alt="" className="h-full w-full object-cover" />}
                        </div>
                        <label className="cursor-pointer">
                          <input type="file" accept="image/*" className="hidden" onChange={handleCatImage} disabled={uploadingCatImg} />
                          <span className="inline-flex items-center gap-2 px-3 py-2 rounded-md border text-sm hover:bg-muted">
                            {uploadingCatImg ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload
                          </span>
                        </label>
                        {catForm.image_url && (
                          <Button type="button" size="sm" variant="ghost" onClick={() => setCatForm({ ...catForm, image_url: "" })}>Clear</Button>
                        )}
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <Label>Sort order</Label>
                        <Input type="number" value={catForm.sort_order} onChange={(e) => setCatForm({ ...catForm, sort_order: parseInt(e.target.value, 10) || 0 })} />
                      </div>
                      <div className="flex items-end gap-2">
                        <Switch checked={catForm.is_active} onCheckedChange={(v) => setCatForm({ ...catForm, is_active: v })} id="cat-active" />
                        <Label htmlFor="cat-active" className="cursor-pointer">Active</Label>
                      </div>
                      <div className="flex items-end gap-2">
                        <Switch checked={catForm.is_featured} onCheckedChange={(v) => setCatForm({ ...catForm, is_featured: v })} id="cat-featured" />
                        <Label htmlFor="cat-featured" className="cursor-pointer">Featured on homepage</Label>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={saveCategory} disabled={savingCat} variant="accent">
                        {savingCat ? <Loader2 className="h-3 w-3 animate-spin" /> : (catForm.id ? <><Pencil className="h-3 w-3 mr-1" /> Update</> : <><Plus className="h-3 w-3 mr-1" /> Create</>)}
                      </Button>
                      {catForm.id && <Button variant="outline" onClick={() => setCatForm(emptyCatForm)}>Cancel</Button>}
                    </div>
                  </CardContent>
                </Card>

                {categories.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-6">No categories yet. Add the first one above.</p>
                ) : (
                  <div className="space-y-2">
                    {categories.map((c) => (
                      <Card key={c.id} className={!c.is_active ? "opacity-60" : ""}>
                        <CardContent className="p-3 flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className="flex items-start gap-3 min-w-0 flex-1 w-full">
                            <div className="h-12 w-12 rounded bg-muted overflow-hidden flex-shrink-0">
                              {c.image_url && <img src={c.image_url} alt="" className="h-full w-full object-cover" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{c.name}</p>
                              <p className="text-xs text-muted-foreground truncate">/{c.slug} · order {c.sort_order}{c.aliases?.length ? ` · aka ${c.aliases.join(", ")}` : ""}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap sm:ml-auto sm:shrink-0">
                            <div className="flex flex-wrap gap-1">
                              {c.is_featured && <Badge className="bg-accent text-accent-foreground">Featured</Badge>}
                              {!c.is_active && <Badge variant="outline">Inactive</Badge>}
                            </div>
                            <div className="flex gap-1">
                              <Button size="sm" variant="outline" onClick={() => startEditCat(c)}><Pencil className="h-3 w-3" /></Button>
                              <Button size="sm" variant="outline" onClick={() => removeCategory(c)}><Trash2 className="h-3 w-3" /></Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="news" className="space-y-4 mt-4">
                <Card>
                  <CardHeader><CardTitle className="text-base">Add Market News</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1.5"><Label>Title *</Label><Input maxLength={200} value={newsForm.title} onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })} /></div>
                    <div className="space-y-1.5"><Label>Summary</Label><Textarea rows={2} maxLength={500} value={newsForm.summary} onChange={(e) => setNewsForm({ ...newsForm, summary: e.target.value })} /></div>
                    <div className="space-y-1.5"><Label>Full body (optional)</Label><Textarea rows={4} maxLength={4000} value={newsForm.body} onChange={(e) => setNewsForm({ ...newsForm, body: e.target.value })} /></div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5"><Label>Source name</Label><Input maxLength={120} value={newsForm.source_name} onChange={(e) => setNewsForm({ ...newsForm, source_name: e.target.value })} placeholder="e.g. Mint" /></div>
                      <div className="space-y-1.5"><Label>Source URL</Label><Input maxLength={500} value={newsForm.source_url} onChange={(e) => setNewsForm({ ...newsForm, source_url: e.target.value })} placeholder="https://..." /></div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5"><Label>Category</Label><Input maxLength={50} value={newsForm.category} onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })} placeholder="policy / supply / price" /></div>
                      <div className="space-y-1.5"><Label>Sort order</Label><Input type="number" value={newsForm.sort_order} onChange={(e) => setNewsForm({ ...newsForm, sort_order: Number(e.target.value) || 0 })} /></div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Image</Label>
                      <div className="flex items-center gap-3">
                        <div className="h-16 w-16 rounded border bg-muted overflow-hidden flex-shrink-0">
                          {newsForm.image_url && <img src={newsForm.image_url} alt="" className="h-full w-full object-cover" />}
                        </div>
                        <label className="cursor-pointer">
                          <input type="file" accept="image/*" className="hidden" onChange={uploadNewsImage} disabled={uploadingNewsImg} />
                          <span className="inline-flex items-center gap-2 px-3 py-2 rounded-md border text-sm hover:bg-muted">
                            {uploadingNewsImg ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload
                          </span>
                        </label>
                        <Input className="flex-1" placeholder="or paste image URL" value={newsForm.image_url} onChange={(e) => setNewsForm({ ...newsForm, image_url: e.target.value })} />
                      </div>
                    </div>
                    <Button onClick={saveNews} disabled={savingNews} variant="accent">
                      {savingNews ? <Loader2 className="h-3 w-3 animate-spin" /> : <><Send className="h-3 w-3 mr-1" /> Publish</>}
                    </Button>
                  </CardContent>
                </Card>
                {marketNews.map((n) => (
                  <Card key={n.id}>
                    <CardContent className="p-3 flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex items-start gap-3 min-w-0 flex-1 w-full">
                        {n.image_url && <img src={n.image_url} alt="" className="h-12 w-16 rounded object-cover flex-shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{n.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{n.summary ?? n.source_name ?? ""}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap sm:ml-auto sm:shrink-0">
                        {n.is_published ? <Badge className="bg-accent text-accent-foreground">Live</Badge> : <Badge variant="outline">Draft</Badge>}
                        <Button size="sm" variant="outline" onClick={() => toggleNewsPublished(n.id, !n.is_published)}>{n.is_published ? "Unpublish" : "Publish"}</Button>
                        <Button size="sm" variant="outline" onClick={() => deleteNews(n.id)}><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="humor" className="space-y-4 mt-4">
                <Card>
                  <CardHeader><CardTitle className="text-base">Add Humor Post</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1.5"><Label>Title *</Label><Input maxLength={200} value={humorForm.title} onChange={(e) => setHumorForm({ ...humorForm, title: e.target.value })} /></div>
                    <div className="space-y-1.5"><Label>Body *</Label><Textarea rows={4} maxLength={2000} value={humorForm.body} onChange={(e) => setHumorForm({ ...humorForm, body: e.target.value })} /></div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5"><Label>Attribution</Label><Input maxLength={120} value={humorForm.attribution} onChange={(e) => setHumorForm({ ...humorForm, attribution: e.target.value })} placeholder="e.g. Old market saying" /></div>
                      <div className="space-y-1.5"><Label>Sort order</Label><Input type="number" value={humorForm.sort_order} onChange={(e) => setHumorForm({ ...humorForm, sort_order: Number(e.target.value) || 0 })} /></div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Image</Label>
                      <div className="flex items-center gap-3">
                        <div className="h-16 w-16 rounded border bg-muted overflow-hidden flex-shrink-0">
                          {humorForm.image_url && <img src={humorForm.image_url} alt="" className="h-full w-full object-cover" />}
                        </div>
                        <label className="cursor-pointer">
                          <input type="file" accept="image/*" className="hidden" onChange={uploadHumorImage} disabled={uploadingHumorImg} />
                          <span className="inline-flex items-center gap-2 px-3 py-2 rounded-md border text-sm hover:bg-muted">
                            {uploadingHumorImg ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload
                          </span>
                        </label>
                        <Input className="flex-1" placeholder="or paste image URL" value={humorForm.image_url} onChange={(e) => setHumorForm({ ...humorForm, image_url: e.target.value })} />
                      </div>
                    </div>
                    <Button onClick={saveHumor} disabled={savingHumor} variant="accent">
                      {savingHumor ? <Loader2 className="h-3 w-3 animate-spin" /> : <><Send className="h-3 w-3 mr-1" /> Publish</>}
                    </Button>
                  </CardContent>
                </Card>
                {humorPosts.map((h) => (
                  <Card key={h.id}>
                    <CardContent className="p-3 flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex items-start gap-3 min-w-0 flex-1 w-full">
                        {h.image_url && <img src={h.image_url} alt="" className="h-12 w-16 rounded object-cover flex-shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{h.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{h.body}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap sm:ml-auto sm:shrink-0">
                        {h.is_published ? <Badge className="bg-accent text-accent-foreground">Live</Badge> : <Badge variant="outline">Draft</Badge>}
                        <Button size="sm" variant="outline" onClick={() => toggleHumorPublished(h.id, !h.is_published)}>{h.is_published ? "Unpublish" : "Publish"}</Button>
                        <Button size="sm" variant="outline" onClick={() => deleteHumor(h.id)}><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default AdminModeration;
