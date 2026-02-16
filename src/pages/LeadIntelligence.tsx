import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sampleLeadPacks } from "@/data/sampleData";
import { Download, Lock, Database, FileSpreadsheet, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LeadIntelligence = () => {
  const { toast } = useToast();
  const [showRequestForm, setShowRequestForm] = useState(false);

  const handleRequestAccess = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Request Submitted!", description: "We'll get back to you within 24 hours." });
    setShowRequestForm(false);
  };

  return (
    <Layout>
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
            Expo Lead Intelligence
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Access curated exhibitor databases from top global food trade expos. Download verified buyer and supplier contacts.
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sampleLeadPacks.map((pack) => (
              <Card key={pack.id} className="bg-card border-border hover:border-accent/50 card-hover">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="h-5 w-5 text-accent" />
                    <Badge variant="secondary" className="text-xs">{pack.expoName}</Badge>
                    <Badge variant="outline" className="text-xs">{pack.year}</Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">{pack.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Categories</span>
                      <div className="flex flex-wrap gap-1 justify-end">
                        {pack.categories.map((c) => (
                          <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Format</span>
                      <span className="flex items-center gap-1 text-foreground">
                        <FileSpreadsheet className="h-3 w-3" /> {pack.format}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Records</span>
                      <span className="font-medium text-foreground">{pack.recordCount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Price</span>
                      <span className="font-semibold text-accent">₹{pack.price.toLocaleString()}</span>
                    </div>
                    {pack.includedInTiers.length > 0 && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        Included in: {pack.includedInTiers.join(", ")} tier
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => setShowRequestForm(true)}
                    >
                      <Lock className="mr-2 h-4 w-4" /> Request Access
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Request Access Form */}
          {showRequestForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <Card className="w-full max-w-md bg-card">
                <CardHeader>
                  <CardTitle>Request Lead Pack Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRequestAccess} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="req-name">Full Name</Label>
                      <Input id="req-name" required placeholder="Your name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="req-company">Company</Label>
                      <Input id="req-company" required placeholder="Company name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="req-email">Email</Label>
                      <Input id="req-email" type="email" required placeholder="you@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="req-phone">Phone</Label>
                      <Input id="req-phone" type="tel" required placeholder="+91 98765 43210" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="req-message">Message (optional)</Label>
                      <Textarea id="req-message" placeholder="Which lead packs interest you?" rows={3} />
                    </div>
                    <div className="flex gap-3">
                      <Button type="submit" className="flex-1 bg-accent hover:bg-accent/90 text-primary">Submit Request</Button>
                      <Button type="button" variant="outline" onClick={() => setShowRequestForm(false)}>Cancel</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default LeadIntelligence;
