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
import { Inbox, Phone, Handshake, CheckCircle, Lock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const statusConfig = {
  new: { label: "New", color: "bg-blue-100 text-blue-800 border-blue-200", icon: Inbox },
  contacted: { label: "Contacted", color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Phone },
  negotiation: { label: "Negotiation", color: "bg-purple-100 text-purple-800 border-purple-200", icon: Handshake },
  converted: { label: "Converted", color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
};

const Dashboard = () => {
  const { canAccess } = useRole();
  const { toast } = useToast();
  const [inquiries, setInquiries] = useState<Inquiry[]>(sampleInquiries);

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
            <p className="text-muted-foreground mb-6">Sign up as a Free Member or upgrade to access the CRM dashboard. Switch your role using the simulator in the header.</p>
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

          {/* Inquiries Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Inquiries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="py-2 px-3 text-muted-foreground font-medium">Buyer</th>
                      <th className="py-2 px-3 text-muted-foreground font-medium">Product</th>
                      <th className="py-2 px-3 text-muted-foreground font-medium">Quantity</th>
                      <th className="py-2 px-3 text-muted-foreground font-medium hidden md:table-cell">Message</th>
                      <th className="py-2 px-3 text-muted-foreground font-medium">Status</th>
                      <th className="py-2 px-3 text-muted-foreground font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.map((inq) => (
                      <tr key={inq.id} className="border-b border-border/50">
                        <td className="py-2.5 px-3">
                          <div className="font-medium text-foreground">{inq.buyerName}</div>
                          <div className="text-xs text-muted-foreground">{inq.buyerCompany}</div>
                        </td>
                        <td className="py-2.5 px-3 text-foreground">{inq.commodity}</td>
                        <td className="py-2.5 px-3 text-muted-foreground">{inq.quantity}</td>
                        <td className="py-2.5 px-3 text-muted-foreground hidden md:table-cell max-w-[200px] truncate">{inq.message}</td>
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
