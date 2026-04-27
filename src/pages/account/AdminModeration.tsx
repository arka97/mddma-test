import { friendlyErrorMessage } from "@/lib/errors";
import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, ShieldCheck, EyeOff, Eye, Building2, Package, UserCog, Star, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link, Navigate } from "react-router-dom";

const AdminModeration = () => {
  const { hasRole, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [companies, setCompanies] = useState<{ id: string; name: string; slug: string; is_verified: boolean; is_hidden: boolean; city: string | null; logo_url: string | null }[]>([]);
  const [products, setProducts] = useState<{ id: string; name: string; slug: string; is_hidden: boolean; is_featured: boolean; company_id: string; image_url: string | null }[]>([]);
  const [users, setUsers] = useState<{ id: string; full_name: string | null; avatar_url: string | null; roles: string[] }[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [{ data: c }, { data: p }, { data: prof }, { data: r }] = await Promise.all([
      supabase.from("companies").select("id,name,slug,is_verified,is_hidden,city,logo_url").order("created_at", { ascending: false }),
      supabase.from("products").select("id,name,slug,is_hidden,is_featured,company_id,image_url").order("created_at", { ascending: false }),
      supabase.from("profiles").select("id,full_name,avatar_url"),
      supabase.from("user_roles").select("user_id,role"),
    ]);
    setCompanies(c ?? []);
    setProducts(p ?? []);
    const rolesByUser: Record<string, string[]> = {};
    (r ?? []).forEach((x: { user_id: string; role: string }) => { (rolesByUser[x.user_id] ||= []).push(x.role); });
    setUsers((prof ?? []).map((u) => ({ ...u, roles: rolesByUser[u.id] ?? [] })));
    setLoading(false);
  };

  useEffect(() => { if (!authLoading && hasRole("admin")) load(); /* eslint-disable-next-line */ }, [authLoading]);

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
    const { error } = add
      ? await supabase.from("user_roles").insert({ user_id: uid, role })
      : await supabase.from("user_roles").delete().eq("user_id", uid).eq("role", role);
    if (error) toast({ title: "Failed", description: friendlyErrorMessage(error), variant: "destructive" }); else load();
  };

  return (
    <Layout>
      <section className="py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <h1 className="text-3xl font-bold mb-6 flex items-center gap-2"><ShieldCheck /> Admin Moderation</h1>

          {loading ? <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div> : (
            <Tabs defaultValue="companies">
              <TabsList>
                <TabsTrigger value="companies"><Building2 className="h-3 w-3 mr-1" /> Companies ({companies.length})</TabsTrigger>
                <TabsTrigger value="products"><Package className="h-3 w-3 mr-1" /> Products ({products.length})</TabsTrigger>
                <TabsTrigger value="users"><UserCog className="h-3 w-3 mr-1" /> Users ({users.length})</TabsTrigger>
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
                        {c.is_verified && <Badge className="bg-accent text-primary">Verified</Badge>}
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
                      <CardContent className="p-3 flex items-center gap-3 flex-wrap">
                        <div className="h-10 w-10 rounded bg-muted overflow-hidden flex-shrink-0">
                          {p.image_url && <img src={p.image_url} alt="" className="h-full w-full object-cover" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{p.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {owner ? `Seller: ${owner.name}` : "Unknown seller"} · /{p.slug}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {p.is_featured && <Badge className="bg-accent text-primary">Featured</Badge>}
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
                      </CardContent>
                    </Card>
                  );
                })}
              </TabsContent>

              <TabsContent value="users" className="space-y-2 mt-4">
                {users.map((u) => (
                  <Card key={u.id}>
                    <CardContent className="p-3 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted overflow-hidden">
                        {u.avatar_url && <img src={u.avatar_url} alt="" className="h-full w-full object-cover" />}
                      </div>
                      <div className="flex-1"><p className="font-medium">{u.full_name ?? "Unnamed"}</p>
                        <div className="flex gap-1 mt-1">
                          {u.roles.map((r) => <Badge key={r} variant="secondary" className="text-xs">{r}</Badge>)}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {(["admin", "paid_member", "broker"] as const).map((r) => (
                          <Button key={r} size="sm" variant={u.roles.includes(r) ? "default" : "outline"} onClick={() => setRole(u.id, r, !u.roles.includes(r))}>{r}</Button>
                        ))}
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
