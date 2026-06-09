import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
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
import { Megaphone, Mail } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

const Forms = () => {
  const { toast } = useToast();
  const { pathname } = useLocation();
  const isContact = pathname === "/contact";
  const handleSubmit = (formName: string) => (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: `${formName} Submitted!`, description: "We'll respond within 2 business days." });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <Layout>
      {isContact ? (
        <Seo
          title="Contact MDDMA — Mumbai Dry-fruits & Dates Association"
          description="Contact the Mumbai Dry-fruits & Dates Merchants Association. Office at APMC Vashi, Navi Mumbai. Phone +91-22-27650827. Email grievance@mddma.org."
          path="/contact"
        />
      ) : (
        <Seo title='Forms & Contact — MDDMA' description='Member forms (verification, advertising). Public contact lives at /contact.' path='/forms' noindex />
      )}
      <PageHeader
        title="Get in touch"
        subtitle="Choose the right form for your enquiry."
      />


      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <Tabs defaultValue="advertise" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="advertise" className="text-xs sm:text-sm">Advertise</TabsTrigger>
              <TabsTrigger value="contact" className="text-xs sm:text-sm">Contact</TabsTrigger>
            </TabsList>

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
                    <Button type="submit" variant="accent" className="w-full">Submit Enquiry</Button>
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
                    <Button type="submit" variant="accent" className="w-full">Send Message</Button>
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
