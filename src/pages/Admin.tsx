import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Users, FileText, Image, Tag, ShieldCheck, Megaphone, Star,
  Plus, Edit, Trash2, Upload, Eye,
} from "lucide-react";
import { sampleMembers, sampleProducts, sampleAdvertisers } from "@/data/sampleData";

const Admin = () => {
  const { toast } = useToast();

  const showToast = (action: string) => {
    toast({ title: action, description: "Changes saved successfully (demo mode)." });
  };

  return (
    <Layout>
      <section className="bg-primary py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-2">
            Admin Panel
          </h1>
          <p className="text-primary-foreground/70 text-sm">
            Manage members, products, and advertising (Demo Mode)
          </p>
        </div>
      </section>

      <section className="py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { label: "Members", value: sampleMembers.length, icon: Users },
              { label: "Products", value: sampleProducts.length, icon: Tag },
              { label: "Advertisers", value: sampleAdvertisers.length, icon: Megaphone },
            ].map(({ label, value, icon: Icon }) => (
              <Card key={label} className="bg-card border-border">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{value}</div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="members">
            <TabsList className="mb-4 flex flex-wrap gap-1">
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="leads">Lead Packs</TabsTrigger>
              <TabsTrigger value="ads">Banner Ads</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
            </TabsList>

            {/* Members Tab */}
            <TabsContent value="members">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Member Management</CardTitle>
                    <Button size="sm" className="bg-accent hover:bg-accent/90 text-primary" onClick={() => showToast("Add Member")}>
                      <Plus className="h-4 w-4 mr-1" /> Add Member
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-left">
                          <th className="py-2 px-3 text-muted-foreground font-medium">Firm Name</th>
                          <th className="py-2 px-3 text-muted-foreground font-medium">Owner</th>
                          <th className="py-2 px-3 text-muted-foreground font-medium">Area</th>
                          <th className="py-2 px-3 text-muted-foreground font-medium">Type</th>
                          <th className="py-2 px-3 text-muted-foreground font-medium">Verification</th>
                          <th className="py-2 px-3 text-muted-foreground font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sampleMembers.slice(0, 10).map((m) => (
                          <tr key={m.id} className="border-b border-border/50">
                            <td className="py-2 px-3 font-medium text-foreground">{m.firmName}</td>
                            <td className="py-2 px-3 text-muted-foreground">{m.ownerName}</td>
                            <td className="py-2 px-3 text-muted-foreground">{m.area}</td>
                            <td className="py-2 px-3"><Badge variant="outline" className="text-xs">{m.memberType}</Badge></td>
                            <td className="py-2 px-3">
                              <Badge variant={m.verificationStatus === "Verified" ? "secondary" : "outline"} className="text-xs">
                                {m.verificationStatus}
                              </Badge>
                            </td>
                            <td className="py-2 px-3">
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" onClick={() => showToast(`Edit ${m.firmName}`)}><Edit className="h-3 w-3" /></Button>
                                <Button variant="ghost" size="sm" onClick={() => showToast(`Upload logo for ${m.firmName}`)}><Upload className="h-3 w-3" /></Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Product Management</CardTitle>
                    <Button size="sm" className="bg-accent hover:bg-accent/90 text-primary" onClick={() => showToast("Add Product")}>
                      <Plus className="h-4 w-4 mr-1" /> Add Product
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-left">
                          <th className="py-2 px-3 text-muted-foreground font-medium">Product</th>
                          <th className="py-2 px-3 text-muted-foreground font-medium">Category</th>
                          <th className="py-2 px-3 text-muted-foreground font-medium">Variants</th>
                          <th className="py-2 px-3 text-muted-foreground font-medium">Sellers</th>
                          <th className="py-2 px-3 text-muted-foreground font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sampleProducts.slice(0, 10).map((p) => (
                          <tr key={p.id} className="border-b border-border/50">
                            <td className="py-2 px-3 font-medium text-foreground">{p.image} {p.name}</td>
                            <td className="py-2 px-3"><Badge variant="secondary" className="text-xs">{p.category}</Badge></td>
                            <td className="py-2 px-3 text-muted-foreground">{p.variants.length}</td>
                            <td className="py-2 px-3 text-muted-foreground">{p.sellerMemberIds.length}</td>
                            <td className="py-2 px-3">
                              <Button variant="ghost" size="sm" onClick={() => showToast(`Edit ${p.name}`)}><Edit className="h-3 w-3" /></Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Lead Packs Tab */}
            <TabsContent value="leads">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Lead Pack Management</CardTitle>
                    <Button size="sm" className="bg-accent hover:bg-accent/90 text-primary" onClick={() => showToast("Upload Lead Pack")}>
                      <Upload className="h-4 w-4 mr-1" /> Upload Pack
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sampleLeadPacks.map((lp) => (
                      <div key={lp.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <div>
                          <p className="font-medium text-foreground text-sm">{lp.title}</p>
                          <p className="text-xs text-muted-foreground">{lp.format} · {lp.recordCount} records · ₹{lp.price.toLocaleString()}</p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => showToast(`Edit ${lp.title}`)}><Edit className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => showToast(`Delete ${lp.title}`)}><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Ads Tab */}
            <TabsContent value="ads">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Banner Ad Management</CardTitle>
                    <Button size="sm" className="bg-accent hover:bg-accent/90 text-primary" onClick={() => showToast("Add Banner")}>
                      <Plus className="h-4 w-4 mr-1" /> Add Banner
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {sampleAdvertisers.map((ad) => (
                      <div key={ad.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <div>
                          <p className="font-medium text-foreground text-sm">{ad.companyName}</p>
                          <p className="text-xs text-muted-foreground">
                            {ad.placement} · {ad.startDate} to {ad.endDate}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">{ad.bannerText}</p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Badge variant={ad.isActive ? "secondary" : "outline"} className="text-xs">
                            {ad.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Button variant="ghost" size="sm" onClick={() => showToast(`Edit ${ad.companyName}`)}><Edit className="h-3 w-3" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Featured Tab */}
            <TabsContent value="featured">
              <Card>
                <CardHeader>
                  <CardTitle>Featured & Sponsored Placements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <Star className="h-4 w-4 text-accent" /> Sponsored Members
                      </h3>
                      <div className="space-y-2">
                        {sampleMembers.filter(m => m.isSponsored).map((m) => (
                          <div key={m.id} className="flex items-center justify-between p-2 rounded border border-border">
                            <span className="text-sm text-foreground">{m.firmName}</span>
                            <Button variant="ghost" size="sm" onClick={() => showToast(`Remove sponsorship for ${m.firmName}`)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <Eye className="h-4 w-4 text-accent" /> Featured Members
                      </h3>
                      <div className="space-y-2">
                        {sampleMembers.filter(m => m.isFeatured).map((m) => (
                          <div key={m.id} className="flex items-center justify-between p-2 rounded border border-border">
                            <span className="text-sm text-foreground">{m.firmName}</span>
                            <Button variant="ghost" size="sm" onClick={() => showToast(`Remove feature for ${m.firmName}`)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Admin;
