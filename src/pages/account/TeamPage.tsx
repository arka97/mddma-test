import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Trash2, UserPlus, Users } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  addCompanyMember,
  hasCompanyRole,
  listCompanyMembers,
  removeCompanyMember,
  updateCompanyMemberRole,
  type CompanyMemberRole,
  type CompanyMemberRow,
} from "@/repositories/companyMembers";

async function getMyCompanyLite(): Promise<{ id: string; name: string } | null> {
  const { data, error } = await supabase.rpc("get_my_company");
  if (error) throw error;
  const row = (data ?? [])[0] as { id: string; name: string } | undefined;
  return row ? { id: row.id, name: row.name } : null;
}

type ProfileLite = { id: string; full_name: string | null; avatar_url: string | null };
type MemberWithProfile = CompanyMemberRow & { profile?: ProfileLite };

const roleLabel: Record<CompanyMemberRole, string> = {
  owner: "Owner",
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer",
};

export default function TeamPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string>("");
  const [canManage, setCanManage] = useState(false);
  const [members, setMembers] = useState<MemberWithProfile[]>([]);
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<ProfileLite[]>([]);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [role, setRole] = useState<Exclude<CompanyMemberRole, "owner">>("editor");

  useEffect(() => {
    if (!user) return;
    void refresh();
     
  }, [user]);

  async function refresh() {
    setLoading(true);
    try {
      const company = await getMyCompany();
      if (!company) {
        setCompanyId(null);
        return;
      }
      setCompanyId(company.id);
      setCompanyName(company.name ?? "Your business");
      const rows = await listCompanyMembers(company.id);
      const ids = rows.map((r) => r.user_id);
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", ids.length > 0 ? ids : ["00000000-0000-0000-0000-000000000000"]);
      const byId = new Map<string, ProfileLite>();
      (profs ?? []).forEach((p) => byId.set(p.id, p as ProfileLite));
      setMembers(rows.map((r) => ({ ...r, profile: byId.get(r.user_id) })));
      const manage = await hasCompanyRole(company.id, ["owner", "admin"]);
      setCanManage(manage);
    } catch (err) {
      toast({
        title: "Couldn't load team",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function runSearch() {
    if (search.trim().length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .ilike("full_name", `%${search.trim()}%`)
        .limit(10);
      if (error) throw error;
      const existing = new Set(members.map((m) => m.user_id));
      setResults(((data ?? []) as ProfileLite[]).filter((p) => !existing.has(p.id)));
    } catch (err) {
      toast({
        title: "Search failed",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
    } finally {
      setSearching(false);
    }
  }

  async function invite(userId: string) {
    if (!companyId) return;
    setAddingId(userId);
    try {
      await addCompanyMember(companyId, userId, role);
      toast({ title: "Team member added" });
      setResults((r) => r.filter((p) => p.id !== userId));
      setSearch("");
      await refresh();
    } catch (err) {
      toast({
        title: "Couldn't add member",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
    } finally {
      setAddingId(null);
    }
  }

  async function changeRole(id: string, next: Exclude<CompanyMemberRole, "owner">) {
    try {
      await updateCompanyMemberRole(id, next);
      await refresh();
    } catch (err) {
      toast({
        title: "Couldn't update role",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
    }
  }

  async function remove(id: string) {
    if (!confirm("Remove this teammate? They'll lose access immediately.")) return;
    try {
      await removeCompanyMember(id);
      await refresh();
    } catch (err) {
      toast({
        title: "Couldn't remove member",
        description: err instanceof Error ? err.message : String(err),
        variant: "destructive",
      });
    }
  }

  const sortedMembers = useMemo(() => {
    const order: Record<CompanyMemberRole, number> = { owner: 0, admin: 1, editor: 2, viewer: 3 };
    return [...members].sort((a, b) => order[a.role] - order[b.role]);
  }, [members]);

  return (
    <Layout>
      <Seo title="Team | G-BAU-G" description="Add teammates to your business account." noindex />
      <div className="mx-auto max-w-3xl px-5 py-8 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Team</h1>
          <p className="text-sm text-muted-foreground">
            Give teammates access to post, quote, and message on behalf of {companyName || "your business"}.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : !companyId ? (
          <Card>
            <CardHeader>
              <CardTitle>Create your business first</CardTitle>
              <CardDescription>You need an approved business profile before inviting teammates.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to="/account/company">Go to business profile</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {canManage && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <UserPlus className="h-4 w-4" /> Add teammate
                  </CardTitle>
                  <CardDescription>
                    Search by name. The person must already have a G-BAU-G account.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-[1fr,140px,auto]">
                    <div className="space-y-1">
                      <Label htmlFor="team-search" className="sr-only">
                        Search by name
                      </Label>
                      <Input
                        id="team-search"
                        placeholder="Search by full name…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            void runSearch();
                          }
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="team-role" className="sr-only">
                        Default role
                      </Label>
                      <Select value={role} onValueChange={(v) => setRole(v as typeof role)}>
                        <SelectTrigger id="team-role">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="button" onClick={() => void runSearch()} disabled={searching}>
                      {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                    </Button>
                  </div>

                  {results.length > 0 && (
                    <ul className="divide-y rounded-md border">
                      {results.map((p) => (
                        <li key={p.id} className="flex items-center justify-between gap-3 px-3 py-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{p.full_name || "Unnamed user"}</p>
                            <p className="truncate text-xs text-muted-foreground">{p.id}</p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => void invite(p.id)}
                            disabled={addingId === p.id}
                          >
                            {addingId === p.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              `Add as ${roleLabel[role]}`
                            )}
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {search.trim().length >= 2 && !searching && results.length === 0 && (
                    <p className="text-xs text-muted-foreground">No matching users found.</p>
                  )}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-4 w-4" /> Members ({sortedMembers.length})
                </CardTitle>
                <CardDescription>
                  {canManage
                    ? "You can change roles or remove teammates. The owner can't be removed here."
                    : "Only owners and admins can change team roles."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="divide-y">
                  {sortedMembers.map((m) => (
                    <li key={m.id} className="flex items-center justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {m.profile?.full_name || m.user_id}
                          {m.user_id === user?.id && (
                            <span className="ml-2 text-xs text-muted-foreground">(you)</span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Joined {new Date(m.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {m.role === "owner" || !canManage ? (
                          <Badge variant="secondary">{roleLabel[m.role]}</Badge>
                        ) : (
                          <Select
                            value={m.role}
                            onValueChange={(v) =>
                              void changeRole(m.id, v as Exclude<CompanyMemberRole, "owner">)
                            }
                          >
                            <SelectTrigger className="h-8 w-[110px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="editor">Editor</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                        {canManage && m.role !== "owner" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => void remove(m.id)}
                            aria-label="Remove teammate"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
}
