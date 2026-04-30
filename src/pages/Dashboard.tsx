import { useEffect, useMemo, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useRole } from "@/contexts/RoleContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Inbox, Phone, Handshake, CheckCircle, Lock, ArrowRight, Bell, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { MembershipStatusCard } from "@/components/account/MembershipStatusCard";

type RfqStatus = "new" | "contacted" | "negotiation" | "converted";
type RfqPriority = "hot" | "warm" | "cold";

interface RfqRow {
  id: string;
  buyer_id: string;
  buyer_name: string | null;
  buyer_company: string | null;
  buyer_email: string | null;
  buyer_phone: string | null;
  product_name: string;
  quantity: string;
  message: string | null;
  delivery_location: string | null;
  delivery_timeline: string | null;
  packaging: string | null;
  status: RfqStatus;
  priority_score: number;
  created_at: string;
  company_id: string;
}

const statusConfig: Record<RfqStatus, { label: string; color: string; icon: typeof Inbox }> = {
  new: { label: "New", color: "bg-blue-100 text-blue-800 border-blue-200", icon: Inbox },
  contacted: { label: "Contacted", color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Phone },
  negotiation: { label: "Negotiation", color: "bg-purple-100 text-purple-800 border-purple-200", icon: Handshake },
  converted: { label: "Converted", color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
};

const priorityConfig: Record<RfqPriority, { label: string; color: string; icon: string }> = {
  hot: { label: "Hot Lead", color: "bg-red-100 text-red-700 border-red-200", icon: "🔥" },
  warm: { label: "Warm", color: "bg-orange-100 text-orange-700 border-orange-200", icon: "🟡" },
  cold: { label: "Cold", color: "bg-gray-100 text-gray-600 border-gray-200", icon: "🔵" },
};

function priorityFromScore(score: number): RfqPriority {
  if (score >= 70) return "hot";
  if (score >= 40) return "warm";
  return "cold";
}

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

const Dashboard = () => {
  const { canAccess } = useRole();
  const { company } = useAuth();
  const { toast } = useToast();
  const [rfqs, setRfqs] = useState<RfqRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const access = canAccess("crm_dashboard");

  useEffect(() => {
    if (!access) {
      setLoading(false);
      return;
    }
    if (!company?.id) {
      setRfqs([]);
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    supabase
      .from("rfqs")
      .select("id,buyer_id,buyer_name,buyer_company,buyer_email,buyer_phone,product_name,quantity,message,delivery_location,delivery_timeline,packaging,status,priority_score,created_at,company_id")
      .eq("company_id", company.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!alive) return;
        if (error) {
          toast({ title: "Failed to load RFQs", description: error.message, variant: "destructive" });
          setRfqs([]);
        } else {
          setRfqs((data ?? []) as RfqRow[]);
        }
        setLoading(false);
      });
    return () => { alive = false; };
  }, [access, company?.id, toast]);

  if (!access) {
    return (
      <Layout>
        <section className="bg-primary py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">Lead CRM Dashboard</h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">Manage your trade inquiries and leads</p>
          </div>
        </section>
        <section className="py-16">
          <div className="container mx-auto px-4 text-center max-w-md">
            <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Members Only</h2>
            <p className="text-muted-foreground mb-6">Sign up as a Free Member or upgrade to access the CRM dashboard.</p>
            <Button className="bg-accent hover:bg-accent/90 text-primary" asChild>
              <Link to="/apply">Join MDDMA</Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  const updateStatus = async (id: string, newStatus: RfqStatus) => {
    const prev = rfqs;
    setRfqs((rs) => rs.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
    const { error } = await supabase.from("rfqs").update({ status: newStatus }).eq("id", id);
    if (error) {
      setRfqs(prev);
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Status Updated", description: `Inquiry moved to ${statusConfig[newStatus].label}` });
  };

  const pipelineCounts = useMemo(() => ({
    new: rfqs.filter((r) => r.status === "new").length,
    contacted: rfqs.filter((r) => r.status === "contacted").length,
    negotiation: rfqs.filter((r) => r.status === "negotiation").length,
    converted: rfqs.filter((r) => r.status === "converted").length,
  }), [rfqs]);

  const priorityCounts = useMemo(() => {
    const counts = { hot: 0, warm: 0, cold: 0 } as Record<RfqPriority, number>;
    for (const r of rfqs) counts[priorityFromScore(r.priority_score)]++;
    return counts;
  }, [rfqs]);

  const filteredRfqs = priorityFilter === "all"
    ? rfqs
    : rfqs.filter((r) => priorityFromScore(r.priority_score) === priorityFilter);

  const recentNotifications = rfqs.slice(0, 3);

  return (
    <Layout>
      <section className="bg-primary py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-2">Lead CRM Dashboard</h1>
          <p className="text-primary-foreground/70 text-sm">Manage and track your trade inquiries</p>
        </div>
      </section>

      <section className="py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6"><MembershipStatusCard /></div>

          {!company?.id ? (
            <Card className="mb-6 border-dashed border-border">
              <CardContent className="p-8 text-center">
                <Inbox className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-1">Set up your company to receive RFQs</h3>
                <p className="text-sm text-muted-foreground mb-4">Create your company profile so buyers can send you trade inquiries.</p>
                <Button asChild><Link to="/account/company">Create Company Profile</Link></Button>
              </CardContent>
            </Card>
          ) : loading ? (
            <div className="text-center py-16">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-accent" />
            </div>
          ) : (
            <>
              {/* Recent notifications from latest RFQs */}
              {recentNotifications.length > 0 && (
                <Card className="mb-6 border-accent/20 bg-accent/5">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Bell className="h-4 w-4 text-accent" />
                      <h3 className="font-semibold text-foreground text-sm">Recent Inquiries</h3>
                    </div>
                    <div className="space-y-2">
                      {recentNotifications.map((r) => (
                        <div key={r.id} className="flex items-center justify-between text-sm bg-background rounded-md p-2 border border-border">
                          <div className="flex items-center gap-2">
                            <Inbox className="h-3.5 w-3.5 text-blue-500" />
                            <span className="text-foreground">
                              {(r.buyer_name ?? r.buyer_company ?? "Buyer")} — {r.quantity} {r.product_name}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{timeAgo(r.created_at)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Pipeline */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {(Object.entries(pipelineCounts) as [RfqStatus, number][]).map(([status, count]) => {
                  const cfg = statusConfig[status];
                  const Icon = cfg.icon;
                  return (
                    <Card key={status} className="bg-card border-border">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${cfg.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-foreground">{count}</div>
                          <div className="text-xs text-muted-foreground">{cfg.label}</div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="hidden md:flex items-center justify-center gap-2 mb-6 text-xs text-muted-foreground">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800">New</span>
                <ArrowRight className="h-3 w-3" />
                <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">Contacted</span>
                <ArrowRight className="h-3 w-3" />
                <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800">Negotiation</span>
                <ArrowRight className="h-3 w-3" />
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-800">Converted</span>
              </div>

              {rfqs.length > 0 && (
                <div className="flex items-center gap-3 mb-6 flex-wrap">
                  <span className="text-sm font-medium text-foreground">Filter by priority:</span>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant={priorityFilter === "all" ? "default" : "outline"}
                      className="text-xs h-7"
                      onClick={() => setPriorityFilter("all")}
                    >
                      All ({rfqs.length})
                    </Button>
                    {(Object.entries(priorityCounts) as [RfqPriority, number][]).map(([priority, count]) => (
                      <Button
                        key={priority}
                        size="sm"
                        variant={priorityFilter === priority ? "default" : "outline"}
                        className="text-xs h-7"
                        onClick={() => setPriorityFilter(priority)}
                      >
                        {priorityConfig[priority].icon} {priorityConfig[priority].label} ({count})
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>RFQ Inquiries</CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredRfqs.length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-border rounded-lg">
                      <Inbox className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">
                        {rfqs.length === 0
                          ? "No RFQs yet — share your storefront link to start receiving inquiries."
                          : "No RFQs match this filter."}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border text-left">
                            <th className="py-2 px-3 text-muted-foreground font-medium">Buyer</th>
                            <th className="py-2 px-3 text-muted-foreground font-medium">Product</th>
                            <th className="py-2 px-3 text-muted-foreground font-medium">Qty</th>
                            <th className="py-2 px-3 text-muted-foreground font-medium">Priority</th>
                            <th className="py-2 px-3 text-muted-foreground font-medium hidden md:table-cell">Details</th>
                            <th className="py-2 px-3 text-muted-foreground font-medium">Status</th>
                            <th className="py-2 px-3 text-muted-foreground font-medium">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredRfqs.map((r) => {
                            const priority = priorityFromScore(r.priority_score);
                            return (
                              <tr key={r.id} className={`border-b border-border/50 ${priority === "hot" ? "bg-red-50/50" : ""}`}>
                                <td className="py-2.5 px-3">
                                  <div className="font-medium text-foreground">{r.buyer_name ?? "—"}</div>
                                  <div className="text-xs text-muted-foreground">{r.buyer_company ?? ""}</div>
                                </td>
                                <td className="py-2.5 px-3 text-foreground">{r.product_name}</td>
                                <td className="py-2.5 px-3 text-muted-foreground">{r.quantity}</td>
                                <td className="py-2.5 px-3">
                                  <Badge variant="outline" className={`text-xs ${priorityConfig[priority].color}`}>
                                    {priorityConfig[priority].icon} {priorityConfig[priority].label}
                                  </Badge>
                                </td>
                                <td className="py-2.5 px-3 text-muted-foreground hidden md:table-cell max-w-[200px]">
                                  <div className="text-xs truncate">{r.message ?? ""}</div>
                                  <div className="text-[10px] text-muted-foreground mt-0.5">
                                    {[r.delivery_location, r.delivery_timeline].filter(Boolean).join(" · ")}
                                  </div>
                                </td>
                                <td className="py-2.5 px-3">
                                  <Select value={r.status} onValueChange={(val) => updateStatus(r.id, val as RfqStatus)}>
                                    <SelectTrigger className="h-7 w-28 text-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="new">New</SelectItem>
                                      <SelectItem value="contacted">Contacted</SelectItem>
                                      <SelectItem value="negotiation">Negotiation</SelectItem>
                                      <SelectItem value="converted">Converted</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </td>
                                <td className="py-2.5 px-3 text-muted-foreground text-xs">
                                  {new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;
