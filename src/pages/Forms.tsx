import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, Megaphone, Mail } from "lucide-react";

const Forms = () => {
  const { toast } = useToast();
  const handleSubmit = (formName: string) => (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: `${formName} Submitted!`, description: "We'll respond within 2 business days." });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <Layout>
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
            Get in Touch
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Choose the right form for your enquiry
          </p>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <Tabs defaultValue="verification" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="verification" className="text-xs sm:text-sm">Verification</TabsTrigger>
              <TabsTrigger value="advertise" className="text-xs sm:text-sm">Advertise</TabsTrigger>
              <TabsTrigger value="contact" className="text-xs sm:text-sm">Contact</TabsTrigger>
            </TabsList>

            {/* Verification Request */}
            <TabsContent value="verification">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-accent" /> Verification Request
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit("Verification Request")} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Company Name</Label><Input required placeholder="Your firm name" />
                      </div>
                      <div className="space-y-2">
                        <Label>Member ID</Label><Input required placeholder="e.g. M001" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>GST Number</Label><Input required placeholder="27AAAAA0000A1Z5" />
                    </div>
                    <div className="space-y-2">
                      <Label>FSSAI License (optional)</Label><Input placeholder="License number" />
                    </div>
                    <div className="space-y-2">
                      <Label>Verification Level</Label>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Additional Notes</Label><Textarea placeholder="Any additional information..." rows={3} />
                    </div>
                    <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-primary">Submit Verification Request</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Advertise */}
            <TabsContent value="advertise">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Megaphone className="h-5 w-5 text-accent" /> Advertise With Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit("Advertising Enquiry")} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2"><Label>Company Name</Label><Input required placeholder="Company" /></div>
                      <div className="space-y-2"><Label>Contact Person</Label><Input required placeholder="Name" /></div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2"><Label>Email</Label><Input type="email" required placeholder="email" /></div>
                      <div className="space-y-2"><Label>Phone</Label><Input type="tel" required placeholder="phone" /></div>
                    </div>
                    <div className="space-y-2">
                      <Label>Placement Preference</Label>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Select placement" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="homepage">Homepage Banner</SelectItem>
                          <SelectItem value="directory">Directory Sidebar</SelectItem>
                          <SelectItem value="category">Category Page Banner</SelectItem>
                          <SelectItem value="sponsored-member">Sponsored Member Listing</SelectItem>
                          <SelectItem value="sponsored-product">Sponsored Product Placement</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Budget & Duration</Label><Textarea placeholder="Tell us about your budget and preferred duration" rows={3} />
                    </div>
                    <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-primary">Submit Enquiry</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact */}
            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-accent" /> Contact Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit("Contact Form")} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2"><Label>Full Name</Label><Input required placeholder="Name" /></div>
                      <div className="space-y-2"><Label>Phone</Label><Input type="tel" required placeholder="Phone" /></div>
                    </div>
                    <div className="space-y-2"><Label>Email</Label><Input type="email" required placeholder="Email" /></div>
                    <div className="space-y-2"><Label>Subject</Label><Input required placeholder="How can we help?" /></div>
                    <div className="space-y-2"><Label>Message</Label><Textarea required placeholder="Your message..." rows={5} /></div>
                    <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-primary">Send Message</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Forms;
