import { Link } from "react-router-dom";
import { CheckCircle2, FileText, CreditCard, Users } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const benefits = [
  "Access to complete member directory with contact details",
  "Members-only circulars and trade updates",
  "Dispute resolution and arbitration services",
  "Government liaison support for trade matters",
  "Networking opportunities with 850+ merchants",
  "Official MDDMA membership certificate",
  "Priority market information and price alerts",
  "Participation in annual events and meetings",
];

const steps = [
  {
    icon: FileText,
    title: "Fill Application",
    description: "Complete the online form with your business details",
  },
  {
    icon: Users,
    title: "Document Upload",
    description: "Upload GST certificate, Shop Act, and ID proof",
  },
  {
    icon: CreditCard,
    title: "Pay Fees",
    description: "Complete payment via UPI, Cards, or NetBanking",
  },
  {
    icon: CheckCircle2,
    title: "Get Approved",
    description: "Committee reviews and approves your application",
  },
];

const Apply = () => {
  return (
    <Layout>
      {/* Header */}
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
              Apply for Membership
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              Join Mumbai's premier dry fruits and dates trade association with
              over 850 members across 5 major markets
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-primary mb-8 text-center">
              Membership Benefits
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-primary mb-8 text-center">
              Application Process
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <Card key={step.title} className="bg-card border-border text-center">
                  <CardContent className="pt-6">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent mb-4">
                      <step.icon className="h-6 w-6" />
                    </div>
                    <div className="text-xs text-accent font-semibold mb-2">
                      Step {index + 1}
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Fees */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-primary mb-4">
              Membership Fees
            </h2>
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-accent text-4xl">₹5,000</CardTitle>
                <p className="text-muted-foreground">Annual Membership Fee</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p>+ ₹2,500 One-time Registration Fee (for new members)</p>
                  <p className="mt-2">GST applicable as per government norms</p>
                </div>
                <div className="pt-4">
                  <p className="text-sm font-medium text-foreground mb-2">
                    Payment Methods Accepted:
                  </p>
                  <p className="text-sm text-muted-foreground">
                    UPI • Credit/Debit Cards • Net Banking • Bank Transfer
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-primary mb-4">
              Ready to Join?
            </h2>
            <p className="text-muted-foreground mb-8">
              Start your membership application today and become part of
              Mumbai's largest dry fruits trade community.
            </p>
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-primary font-semibold px-8"
            >
              Start Application
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Application form will be available once backend is connected
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Apply;
