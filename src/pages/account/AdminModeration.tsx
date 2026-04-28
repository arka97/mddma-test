import { friendlyErrorMessage } from "@/lib/errors";
import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, ShieldCheck, EyeOff, Eye, Building2, Package, UserCog, Star, Trash2, Megaphone, Send, Crown, FileCheck2, Link as LinkIcon, CircleX, CircleCheck, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link, Navigate } from "react-router-dom";

import { uploadFile } from "@/lib/storage";
import {
  TIER_LABEL,
  STATUS_LABEL,
  formatINR,
  TIER_PRICE_INR,
  listMembershipsByStatus,
  createPaymentLinkForMembership,
  manuallyActivateMembership,
  cancelMembership,
  type MembershipWithProfile,
} from "@/lib/membership";
import {
  DOC_LABEL,
  approveKycSubmission,
  rejectKycSubmission,
  listAllKycSubmissions,
  getSignedKycUrl,
  statusTone,
  type KycSubmissionWithProfile,
} from "@/lib/kyc";

const AdminModeration = () => {
  const { hasRole, loading: authLoading, user } = useAuth();
  const { toast } = useToast();
  const [companies, setCompanies] = useState<{ id: string; name: string; slug: string; is_verified: boolean; is_hidden: boolean; city: string | null; logo_url: string | null; review_status?: string }[]>([]);
  const [products, setProducts] = useState<{ id: string; name: string; slug: string; is_hidden: boolean; is_featured: boolean; company_id: string; image_url: string | null }[]>([]);
  const [users, setUsers] = useState<{ id: string; full_name: string | null; avatar_url: string | null; roles: string[] }[]>([]);
  const [circulars, setCirculars] = useState<{ id: string; title: string; body: string; is_published: boolean; created_at: string }[]>([]);
  const [circularForm, setCircularForm] = useState({ title: "", body: "", category: "general" });
  const [savingCircular, setSavingCircular] = useState(false);
  const [ads, setAds] = useState<{ id: string; title: string; image_url: string; link_url: string | null; placement: string; is_active: boolean; start_date: string; end_date: string | null }[]>([]);
  const [adForm, setAdForm] = useState({ title: "", link_url: "", placement: "homepage-banner", file: null as File | null });
  const [savingAd, setSavingAd] = useState(false);
  const [memberships, setMemberships] = useState<MembershipWithProfile[]>([]);
  const [busyMembership, setBusyMembership] = useState<string | null>(null);
  const [kyc, setKyc] = useState<KycSubmissionWithProfile[]>([]);
  const [busyKyc, setBusyKyc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [{ data: c }, { data: p }, { data: prof }, { data: r }, { data: circ }, { data: adRows }, mem, kycRows] = await Promise.all([
      supabase.from("companies").select("id,name,slug,is_verified,is_hidden,city,logo_url,review_status").order("created_at", { ascending: false }),
      supabase.from("products").select("id,name,slug,is_hidden,is_featured,company_id,image_url").order("created_at", { ascending: false }),
      supabase.from("profiles").select("id,full_name,avatar_url"),
      supabase.from("user_roles").select("user_id,role"),
      supabase.from("circulars").select("id,title,body,is_published,created_at").order("created_at", { ascending: false }),
      supabase.from("advertisements").select("id,title,image_url,link_url,placement,is_active,start_date,end_date").order("created_at", { ascending: false }),
      listMembershipsByStatus("all"),
      listAllKycSubmissions("all"),
    ]);
    setCompanies((c ?? []) as typeof companies);
    setProducts(p ?? []);
    setCirculars((circ ?? []) as typeof circulars);
    setAds((adRows ?? []) as typeof ads);
    setMemberships(mem);
    setKyc(kycRows);
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
    const { error } = add
      ? await supabase.from("user_roles").insert({ user_id: uid, role })
      : await supabase.from("user_roles").delete().eq("user_id", uid).eq("role", role);
    if (error) toast({ title: "Failed", description: friendlyErrorMessage(error), variant: "destructive" }); else load();
  };

  // Circulars
  const saveCircular = async () => {
    if (!user || !circularForm.title.trim() || !circularForm.body.trim()) return;
    setSavingCircular(true);
    const { error } = await supabase.from("circulars").insert({
      title: circularForm.title,
      body: circularForm.body,
      category: circularForm.category,
      created_by: user.id,
      is_published: true,
      published_at: new Date().toISOString(),
    });
    setSavingCircular(false);
    if (error) toast({ title: "Failed", description: friendlyErrorMessage(error), variant: "destructive" });
    else { toast({ title: "Circular published" }); setCircularForm({ title: "", body: "", category: "general" }); load(); }
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
      is_active: true,
    });
    setSavingAd(false);
    if (error) toast({ title: "Failed", description: friendlyErrorMessage(error), variant: "destructive" });
    else { toast({ title: "Ad published" }); setAdForm({ title: "", link_url: "", placement: "homepage-banner", file: null }); load(); }
  };
  const toggleAdActive = async (id: string, val: boolean) => {
    const { error } = await supabase.from("advertisements").update({ is_active: val }).eq("id", id);
    if (error) toast({ title: "Failed", variant: "destructive" }); else load();
  };
  const deleteAd = async (id: string) => {
    if (!confirm("Delete this ad?")) return;
    const { error } = await supabase.from("advertisements").delete().eq("id", id);
    if (error) toast({ title: "Failed", variant: "destructive" }); else load();
  };

  // ---------- Memberships ----------
  const generatePaymentLink = async (membershipId: string) => {
    setBusyMembership(membershipId);
    const { payment_url, error } = await createPaymentLinkForMembership(membershipId);
    setBusyMembership(null);
    if (error) {
      toast({ title: "Could not generate link", description: error, variant: "destructive" });
      return;
    }
    if (payment_url) {
      try { await navigator.clipboard.writeText(payment_url); } catch { /* ignore */ }
      toast({ title: "Payment link generated", description: "Copied to clipboard. Send via WhatsApp / email." });
    }
    load();
  };

  const copyPaymentLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied" });
    } catch {
      toast({ title: "Copy failed — open the link manually", variant: "destructive" });
    }
  };

  const markMembershipActive = async (membershipId: string, tier: string) => {
    const amountStr = prompt(`Manual activation. Enter the amount paid in INR (founding tier price suggested: ${TIER_PRICE_INR[tier as keyof typeof TIER_PRICE_INR] ?? "0"})`);
    if (!amountStr) return;
    const amount = parseInt(amountStr, 10);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast({ title: "Invalid amount", variant: "destructive" });
      return;
    }
    if (!confirm(`Mark membership ACTIVE with payment ₹${amount.toLocaleString()}? This is irreversible from this UI.`)) return;
    setBusyMembership(membershipId);
    const { error } = await manuallyActivateMembership(membershipId, amount, "Activated manually by admin");
    setBusyMembership(null);
    if (error) {
      toast({ title: "Activation failed", description: friendlyErrorMessage(error), variant: "destructive" });
      return;
    }
    toast({ title: "Membership activated" });
    load();
  };

  const cancelMembershipRow = async (membershipId: string) => {
    if (!confirm("Cancel this membership? It will lose paid status.")) return;
    setBusyMembership(membershipId);
    const { error } = await cancelMembership(membershipId);
    setBusyMembership(null);
    if (error) {
      toast({ title: "Cancel failed", description: friendlyErrorMessage(error), variant: "destructive" });
      return;
    }
    toast({ title: "Membership cancelled" });
    load();
  };

  // ---------- KYC ----------
  const viewKycDoc = async (path: string) => {
    const url = await getSignedKycUrl(path);
    if (!url) {
      toast({ title: "Link expired, try again", variant: "destructive" });
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const approveKyc = async (id: string) => {
    if (!user) return;
    setBusyKyc(id);
    const { error } = await approveKycSubmission(id, user.id);
    setBusyKyc(null);
    if (error) {
      toast({ title: "Approve failed", description: friendlyErrorMessage(error), variant: "destructive" });
      return;
    }
    toast({ title: "KYC approved" });
    load();
  };

  const rejectKyc = async (id: string) => {
    if (!user) return;
    const reason = prompt("Reason for rejection (shown to the seller):");
    if (!reason || reason.trim().length < 5) {
      toast({ title: "Reason required (min 5 chars)", variant: "destructive" });
      return;
    }
    setBusyKyc(id);
    const { error } = await rejectKycSubmission(id, user.id, reason);
    setBusyKyc(null);
    if (error) {
      toast({ title: "Reject failed", description: friendlyErrorMessage(error), variant: "destructive" });
      return;
    }
    toast({ title: "KYC rejected" });
    load();
  };

  return (
    <Layout>
      <section className="py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <h1 className="text-3xl font-bold mb-6 flex items-center gap-2"><ShieldCheck /> Admin Moderation</h1>

          {loading ? <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div> : (
            <Tabs defaultValue="memberships">
              <TabsList className="flex-wrap h-auto">
                <TabsTrigger value="memberships"><Crown className="h-3 w-3 mr-1" /> Memberships ({memberships.length})</TabsTrigger>
                <TabsTrigger value="kyc"><FileCheck2 className="h-3 w-3 mr-1" /> KYC ({kyc.filter((k) => k.status === "pending").length}/{kyc.length})</TabsTrigger>
                <TabsTrigger value="companies"><Building2 className="h-3 w-3 mr-1" /> Companies ({companies.length})</TabsTrigger>
                <TabsTrigger value="products"><Package className="h-3 w-3 mr-1" /> Products ({products.length})</TabsTrigger>
                <TabsTrigger value="users"><UserCog className="h-3 w-3 mr-1" /> Users ({users.length})</TabsTrigger>
                <TabsTrigger value="circulars"><Megaphone className="h-3 w-3 mr-1" /> Circulars ({circulars.length})</TabsTrigger>
                <TabsTrigger value="ads"><Star className="h-3 w-3 mr-1" /> Ads ({ads.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="memberships" className="space-y-2 mt-4">
                {memberships.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-6">No applications yet.</p>
                )}
                {memberships.map((m) => {
                  const tierPrice = TIER_PRICE_INR[m.tier];
                  const hasLink = !!m.payment_link_url;
                  const isPending = m.status === "pending";
                  const isActive = m.status === "active";
                  return (
                    <Card key={m.id}>
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div className="min-w-0 flex-1">
                            <p className="font-medium truncate">{m.profile?.full_name ?? "Unnamed applicant"}</p>
                            <p className="text-xs text-muted-foreground">
                              {TIER_LABEL[m.tier]} · {formatINR(tierPrice)}/yr ·{" "}
                              <span className="font-mono">{m.id.slice(0, 8)}</span>
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              Applied {new Date(m.created_at).toLocaleDateString("en-IN")}
                              {m.expires_at ? ` · Expires ${new Date(m.expires_at).toLocaleDateString("en-IN")}` : ""}
                              {m.price_paid_inr ? ` · Paid ${formatINR(m.price_paid_inr)}` : ""}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              isActive ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                : isPending ? "bg-amber-100 text-amber-800 border-amber-200"
                                : "bg-muted text-muted-foreground"
                            }
                          >
                            {STATUS_LABEL[m.status]}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {isPending && !hasLink && (
                            <Button
                              size="sm"
                              variant="default"
                              className="bg-accent hover:bg-accent/90 text-primary"
                              disabled={busyMembership === m.id}
                              onClick={() => generatePaymentLink(m.id)}
                            >
                              {busyMembership === m.id
                                ? <Loader2 className="h-3 w-3 animate-spin" />
                                : <><LinkIcon className="h-3 w-3 mr-1" /> Generate payment link</>}
                            </Button>
                          )}
                          {hasLink && (
                            <>
                              <Button size="sm" variant="outline" onClick={() => copyPaymentLink(m.payment_link_url!)}>
                                <LinkIcon className="h-3 w-3 mr-1" /> Copy link
                              </Button>
                              <Button size="sm" variant="ghost" asChild>
                                <a href={m.payment_link_url!} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-3 w-3 mr-1" /> Open
                                </a>
                              </Button>
                            </>
                          )}
                          {isPending && (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={busyMembership === m.id}
                              onClick={() => markMembershipActive(m.id, m.tier)}
                              title="Skip Razorpay; mark active manually"
                            >
                              <CircleCheck className="h-3 w-3 mr-1" /> Mark active manually
                            </Button>
                          )}
                          {(isPending || isActive) && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive"
                              disabled={busyMembership === m.id}
                              onClick={() => cancelMembershipRow(m.id)}
                            >
                              <CircleX className="h-3 w-3 mr-1" /> Cancel
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </TabsContent>

              <TabsContent value="kyc" className="space-y-2 mt-4">
                {kyc.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-6">No KYC submissions yet.</p>
                )}
                {kyc.map((k) => {
                  const tone = statusTone(k.status);
                  return (
                    <Card key={k.id}>
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-start justify-between gap-3 flex-wrap">
                          <div className="min-w-0 flex-1">
                            <p className="font-medium truncate">{k.profile?.full_name ?? "Unnamed"}</p>
                            <p className="text-xs text-muted-foreground">
                              {DOC_LABEL[k.doc_type]}
                              {k.doc_number ? ` · ${k.doc_number}` : ""}
                              {k.bank_account_last4 ? ` · A/C •••${k.bank_account_last4}` : ""}
                              {k.bank_ifsc ? ` · ${k.bank_ifsc}` : ""}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              Submitted {new Date(k.submitted_at).toLocaleDateString("en-IN")}
                              {k.reviewed_at ? ` · Reviewed ${new Date(k.reviewed_at).toLocaleDateString("en-IN")}` : ""}
                            </p>
                            {k.rejection_reason && (
                              <p className="text-[11px] text-red-700 mt-0.5">Reason: {k.rejection_reason}</p>
                            )}
                          </div>
                          <Badge variant="outline" className={tone.className}>{tone.label}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          <Button size="sm" variant="outline" onClick={() => viewKycDoc(k.file_path)}>
                            <ExternalLink className="h-3 w-3 mr-1" /> View doc
                          </Button>
                          {k.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                disabled={busyKyc === k.id}
                                onClick={() => approveKyc(k.id)}
                              >
                                <CircleCheck className="h-3 w-3 mr-1" /> Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-destructive"
                                disabled={busyKyc === k.id}
                                onClick={() => rejectKyc(k.id)}
                              >
                                <CircleX className="h-3 w-3 mr-1" /> Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </TabsContent>

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

              <TabsContent value="circulars" className="space-y-4 mt-4">
                <Card>
                  <CardHeader><CardTitle className="text-base">Compose New Circular</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1.5"><Label>Title</Label><Input maxLength={200} value={circularForm.title} onChange={(e) => setCircularForm({ ...circularForm, title: e.target.value })} /></div>
                    <div className="space-y-1.5"><Label>Body</Label><Textarea rows={4} maxLength={4000} value={circularForm.body} onChange={(e) => setCircularForm({ ...circularForm, body: e.target.value })} /></div>
                    <div className="space-y-1.5"><Label>Category</Label><Input maxLength={50} value={circularForm.category} onChange={(e) => setCircularForm({ ...circularForm, category: e.target.value })} /></div>
                    <Button onClick={saveCircular} disabled={savingCircular} className="bg-accent hover:bg-accent/90 text-primary">
                      {savingCircular ? <Loader2 className="h-3 w-3 animate-spin" /> : <><Send className="h-3 w-3 mr-1" /> Publish</>}
                    </Button>
                  </CardContent>
                </Card>
                {circulars.map((c) => (
                  <Card key={c.id}>
                    <CardContent className="p-3 flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{c.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{c.body}</p>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(c.created_at).toLocaleDateString()}</p>
                      </div>
                      {c.is_published ? <Badge className="bg-accent text-primary">Live</Badge> : <Badge variant="outline">Draft</Badge>}
                      <Button size="sm" variant="outline" onClick={() => togglePublishCircular(c.id, !c.is_published)}>{c.is_published ? "Unpublish" : "Publish"}</Button>
                      <Button size="sm" variant="outline" onClick={() => deleteCircular(c.id)}><Trash2 className="h-3 w-3" /></Button>
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
                      </select>
                    </div>
                    <div className="space-y-1.5"><Label>Image</Label><Input type="file" accept="image/*" onChange={(e) => setAdForm({ ...adForm, file: e.target.files?.[0] ?? null })} /></div>
                    <Button onClick={saveAd} disabled={savingAd} className="bg-accent hover:bg-accent/90 text-primary">
                      {savingAd ? <Loader2 className="h-3 w-3 animate-spin" /> : "Publish Ad"}
                    </Button>
                  </CardContent>
                </Card>
                {ads.map((a) => (
                  <Card key={a.id}>
                    <CardContent className="p-3 flex items-center gap-3">
                      <img src={a.image_url} alt={a.title} className="h-12 w-20 object-cover rounded" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{a.title}</p>
                        <p className="text-xs text-muted-foreground">{a.placement} · {a.start_date}{a.end_date ? ` → ${a.end_date}` : ""}</p>
                      </div>
                      {a.is_active ? <Badge className="bg-accent text-primary">Active</Badge> : <Badge variant="outline">Paused</Badge>}
                      <Button size="sm" variant="outline" onClick={() => toggleAdActive(a.id, !a.is_active)}>{a.is_active ? "Pause" : "Activate"}</Button>
                      <Button size="sm" variant="outline" onClick={() => deleteAd(a.id)}><Trash2 className="h-3 w-3" /></Button>
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
