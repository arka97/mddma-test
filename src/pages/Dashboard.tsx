import { Link } from "react-router-dom";
import {
  Building2,
  FileCheck2,
  Lock,
  Megaphone,
  MessageSquareText,
  Package,
  Sparkles,
  Users,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRole } from "@/contexts/RoleContext";
import { useAuth } from "@/contexts/AuthContext";
import { MembershipStatusCard } from "@/components/account/MembershipStatusCard";
import { OnboardingChecklist } from "@/components/account/OnboardingChecklist";
import { InstallAppNudge } from "@/components/account/InstallAppNudge";

const tiles = [
  { label: "My Business", href: "/account/company", icon: Building2, desc: "Manage identity and verification" },
  { label: "Deal Rooms", href: "/messages", icon: MessageSquareText, desc: "Private business conversations" },
  { label: "My Quotations", href: "/quotes", icon: FileCheck2, desc: "Private sent and received terms" },
  { label: "My Products", href: "/account/products", icon: Package, desc: "Manage your catalogue" },
  { label: "My Brands", href: "/account/brands", icon: Sparkles, desc: "House brands and retail SKUs" },
  { label: "Business Directory", href: "/directory", icon: Users, desc: "Discover verified firms" },
  { label: "Bulletin", href: "/circulars", icon: Megaphone, desc: "Association and trade notices" },
];

const Dashboard = () => {
  const { canAccess } = useRole();
  const { company } = useAuth();
  const access = canAccess("crm_dashboard");

  if (!access) {
    return (
      <Layout>
        <Seo title="Workspace — G-BAU-G" description="Private account workspace." path="/dashboard" noindex />
        <section className="border-b border-border bg-card py-10">
          <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
            <div className="mx-auto mb-2 h-0.5 w-16 rounded-full bg-[hsl(var(--gold))]" aria-hidden="true" />
            <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">G-BAU-G Workspace</h1>
            <p className="mt-1 text-sm text-muted-foreground">Business identity, storefront and commercial tools</p>
          </div>
        </section>
        <section className="py-16">
          <div className="container mx-auto max-w-md px-4 text-center">
            <Lock className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-bold text-foreground">Business access required</h2>
            <p className="mb-6 text-muted-foreground">
              Register an existing business and complete the required review to access commercial workspace tools.
            </p>
            <Button variant="accent" asChild>
              <Link to="/apply">Register your business</Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <Seo title="Workspace — G-BAU-G" description="Private business workspace." path="/dashboard" noindex />
      <section className="border-b border-border bg-card py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-2 h-0.5 w-12 rounded-full bg-[hsl(var(--gold))]" aria-hidden="true" />
          <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">Business Workspace</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your presence and commercial activity on G-BAU-G.</p>
        </div>
      </section>

      <section className="py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4"><InstallAppNudge /></div>
          <div className="mb-6"><MembershipStatusCard /></div>
          <div className="mb-6"><OnboardingChecklist /></div>

          {!company?.id && (
            <Card className="mb-6 border-dashed border-border">
              <CardContent className="p-8 text-center">
                <Building2 className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                <h3 className="mb-1 font-semibold text-foreground">Create your business profile</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Add the business identity, location and capabilities required for staff review.
                </p>
                <Button asChild><Link to="/account/company">Create business profile</Link></Button>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tiles.map((tile) => {
              const Icon = tile.icon;
              return (
                <Link key={tile.href} to={tile.href} className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <Card className="h-full transition hover:border-accent/60">
                    <CardContent className="flex items-start gap-3 p-5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{tile.label}</div>
                        <div className="text-xs text-muted-foreground">{tile.desc}</div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;