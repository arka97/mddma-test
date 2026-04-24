import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Upload, User as UserIcon, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { uploadFile } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { BuyerTrustBadge, VerificationTier } from "@/components/trust/BuyerTrustBadge";

const ProfilePage = () => {
  const { user, profile, refresh } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ full_name: "", phone: "", designation: "", bio: "", avatar_url: "" });

  useEffect(() => {
    if (profile) setForm({
      full_name: profile.full_name ?? "",
      phone: profile.phone ?? "",
      designation: profile.designation ?? "",
      bio: profile.bio ?? "",
      avatar_url: profile.avatar_url ?? "",
    });
  }, [profile]);

  if (!user) return null;

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadFile("avatars", user.id, file);
    setUploading(false);
    if (url) {
      setForm((f) => ({ ...f, avatar_url: url }));
      toast({ title: "Avatar uploaded" });
    } else toast({ title: "Upload failed", variant: "destructive" });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({ id: user.id, ...form }).select().single();
    setSaving(false);
    if (error) toast({ title: "Save failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Profile updated" }); refresh(); }
  };

  return (
    <Layout>
      <section className="py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h1 className="text-3xl font-bold">Your Profile</h1>
            <div className="flex items-center gap-2">
              <BuyerTrustBadge
                tier={((profile as any)?.verification_tier ?? "unverified") as VerificationTier}
                score={(profile as any)?.buyer_reputation_score ?? 0}
              />
              <Button asChild size="sm" variant="outline">
                <Link to="/account/verify"><ShieldCheck className="h-4 w-4 mr-1" /> Verify</Link>
              </Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>This is what other members and buyers see.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={form.avatar_url} alt={form.full_name} />
                    <AvatarFallback><UserIcon /></AvatarFallback>
                  </Avatar>
                  <label className="cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatar} disabled={uploading} />
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-md border text-sm hover:bg-muted">
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      Upload avatar
                    </span>
                  </label>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input id="full_name" value={form.full_name} maxLength={100} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user.email ?? ""} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={form.phone} maxLength={20} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="designation">Designation</Label>
                    <Input id="designation" value={form.designation} maxLength={80} onChange={(e) => setForm({ ...form, designation: e.target.value })} placeholder="e.g. Director, Sales Head" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">About you</Label>
                  <Textarea id="bio" value={form.bio} maxLength={500} rows={4} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Brief intro for your profile…" />
                </div>

                <div className="flex justify-between items-center pt-4">
                  <Button asChild variant="outline"><Link to="/account/company">Manage Company →</Link></Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default ProfilePage;
