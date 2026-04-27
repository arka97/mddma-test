import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { sampleInquiries, type Inquiry } from "@/data/productListings";
import { useRole } from "@/contexts/RoleContext";
import { useToast } from "@/hooks/use-toast";
import { Inbox, Phone, Handshake, CheckCircle, Lock, ArrowRight, Bell, Flame, Users, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { MembershipStatusCard } from "@/components/account/MembershipStatusCard";

const statusConfig = {
  new: { label: "New", color: "bg-blue-100 text-blue-800 border-blue-200", icon: Inbox },
  contacted: { label: "Contacted", color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Phone },
  negotiation: { label: "Negotiation", color: "bg-purple-100 text-purple-800 border-purple-200", icon: Handshake },
  converted: { label: "Converted", color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
};

const priorityConfig = {
  hot: { label: "Hot Lead", color: "bg-red-100 text-red-700 border-red-200", icon: "🔥" },
  warm: { label: "Warm", color: "bg-orange-100 text-orange-700 border-orange-200", icon: "🟡" },
  cold: { label: "Cold", color: "bg-gray-100 text-gray-600 border-gray-200", icon: "🔵" },
};

const Dashboard = () => {
  const { canAccess } = useRole();
  const { toast } = useToast();
  const [inquiries, setInquiries] = useState<Inquiry[]>(sampleInquiries);
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  if (!canAccess("crm_dashboard")) {
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

  const updateStatus = (id: string, newStatus: Inquiry["status"]) => {
    setInquiries((prev) => prev.map((inq) => inq.id === id ? { ...inq, status: newStatus } : inq));
    toast({ title: "Status Updated", description: `Inquiry moved to ${statusConfig[newStatus].label}` });
  };

  const pipelineCounts = {
    new: inquiries.filter((i) => i.status === "new").length,
    contacted: inquiries.filter((i) => i.status === "contacted").length,
    negotiation: inquiries.filter((i) => i.status === "negotiation").length,
    converted: inquiries.filter((i) => i.status === "converted").length,
  };

  const priorityCounts = {
    hot: inquiries.filter((i) => i.priority === "hot").length,
    warm: inquiries.filter((i) => i.priority === "warm").length,
    cold: inquiries.filter((i) => i.priority === "cold").length,
  };

  const filteredInquiries = priorityFilter === "all"
    ? inquiries
    : inquiries.filter((i) => i.priority === priorityFilter);

  // Simulated notifications
  const notifications = [
    { text: "New inquiry from Amit Sharma — 500 kg Almonds", type: "new" as const, time: "2 min ago" },
    { text: "High-value buyer Kiran Reddy — 5 MT Cashews", type: "hot" as const, time: "1 hour ago" },
    { text: "RFQ sent to multiple sellers for Pistachios", type: "multi" as const, time: "3 hours ago" },
  ];

  return (
    <Layout>
      <section className="bg-primary py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-2">Lead CRM Dashboard</h1>
          <p className="text-primary-foreground/70 text-sm">Manage and track your trade inquiries · V2 Behavioral Engine</p>
        </div>
      </section>

      <section className="py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Membership status (hidden when no auth) */}
          <div className="mb-6"><MembershipStatusCard /></div>

          {/* Notifications */}
          <Card className="mb-6 border-accent/20 bg-accent/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Bell className="h-4 w-4 text-accent" />
                <h3 className="font-semibold text-foreground text-sm">Recent Notifications</h3>
              </div>
              <div className="space-y-2">
                {notifications.map((n, i) => (
                  <div key={i} className="flex items-center justify-between text-sm bg-background rounded-md p-2 border border-border">
                    <div className="flex items-center gap-2">
                      {n.type === "hot" && <Flame className="h-3.5 w-3.5 text-red-500" />}
                      {n.type === "new" && <Inbox className="h-3.5 w-3.5 text-blue-500" />}
                      {n.type === "multi" && <Users className="h-3.5 w-3.5 text-purple-500" />}
                      <span className="text-foreground">{n.text}</span>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{n.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pipeline */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {(Object.entries(pipelineCounts) as [Inquiry["status"], number][]).map(([status, count]) => {
              const config = statusConfig[status];
              const Icon = config.icon;
              return (
                <Card key={status} className="bg-card border-border">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${config.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{count}</div>
                      <div className="text-xs text-muted-foreground">{config.label}</div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pipeline flow */}
          <div className="hidden md:flex items-center justify-center gap-2 mb-6 text-xs text-muted-foreground">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800">New</span>
            <ArrowRight className="h-3 w-3" />
            <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">Contacted</span>
            <ArrowRight className="h-3 w-3" />
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800">Negotiation</span>
            <ArrowRight className="h-3 w-3" />
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-800">Converted</span>
          </div>

          {/* Priority tags */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm font-medium text-foreground">Filter by priority:</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={priorityFilter === "all" ? "default" : "outline"}
                className="text-xs h-7"
                onClick={() => setPriorityFilter("all")}
              >
                All ({inquiries.length})
              </Button>
              {(Object.entries(priorityCounts) as [Inquiry["priority"], number][]).map(([priority, count]) => (
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

          {/* Inquiries Table */}
          <Card>
            <CardHeader>
              <CardTitle>RFQ Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
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
                    {filteredInquiries.map((inq) => (
                      <tr key={inq.id} className={`border-b border-border/50 ${inq.priority === "hot" ? "bg-red-50/50" : ""}`}>
                        <td className="py-2.5 px-3">
                          <div className="font-medium text-foreground">{inq.buyerName}</div>
                          <div className="text-xs text-muted-foreground">{inq.buyerCompany}</div>
                        </td>
                        <td className="py-2.5 px-3 text-foreground">{inq.commodity}</td>
                        <td className="py-2.5 px-3 text-muted-foreground">{inq.quantity}</td>
                        <td className="py-2.5 px-3">
                          <Badge variant="outline" className={`text-xs ${priorityConfig[inq.priority].color}`}>
                            {priorityConfig[inq.priority].icon} {priorityConfig[inq.priority].label}
                          </Badge>
                          {inq.multiSellerFlag && (
                            <Badge variant="outline" className="text-[10px] ml-1 bg-purple-50 text-purple-700 border-purple-200">
                              Multi-seller
                            </Badge>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground hidden md:table-cell max-w-[200px]">
                          <div className="text-xs truncate">{inq.message}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">
                            {inq.deliveryLocation} · {inq.deliveryTimeline}
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          <Select value={inq.status} onValueChange={(val) => updateStatus(inq.id, val as Inquiry["status"])}>
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
                          {new Date(inq.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;
