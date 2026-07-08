import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRole } from "@/contexts/RoleContext";
import { useAuth } from "@/contexts/AuthContext";
import { Lock, Building2, Package, Sparkles, Users, Megaphone } from "lucide-react";
import { Link } from "react-router-dom";
import { MembershipStatusCard } from "@/components/account/MembershipStatusCard";

const tiles = [
  { label: "My Company", href: "/account/company", icon: Building2, desc: "Edit your verified profile" },
  { label: "My Products", href: "/account/products", icon: Package, desc: "Manage your catalog" },
  { label: "My Brands", href: "/account/brands", icon: Sparkles, desc: "House brands & retail SKUs" },
  { label: "Member Directory", href: "/directory", icon: Users, desc: "Browse verified traders" },
  { label: "Circulars", href: "/circulars", icon: Megaphone, desc: "Latest trade notices" },
];

const Dashboard = () => {
  const { canAccess } = useRole();
  const { company } = useAuth();
  const access = canAccess("crm_dashboard");

  if (!access) {
    return (
      <Layout>
        <Seo title="Dashboard — MDDMA" description="Members-only page." path="/dashboard" noindex />
        <section className="border-b border-border bg-card py-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mx-auto mb-2 h-0.5 w-16 rounded-full bg-[hsl(var(--gold))]" aria-hidden="true" />
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Member Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">Your G-BAU-G workspace</p>
          </div>
        </section>
        <section className="py-16">
          <div className="container mx-auto px-4 text-center max-w-md">
            <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">Members Only</h2>
            <p className="text-muted-foreground mb-6">Sign up as a Free Member or upgrade to access the member dashboard.</p>
            <Button variant="accent" asChild>
              <Link to="/apply">Join MDDMA</Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <Seo title="Dashboard — MDDMA" description="Members-only page." path="/dashboard" noindex />
      <section className="border-b border-border bg-card py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-2 h-0.5 w-12 rounded-full bg-[hsl(var(--gold))]" aria-hidden="true" />
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">Member Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Your G-BAU-G workspace</p>
        </div>
      </section>

      <section className="py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6"><MembershipStatusCard /></div>

          {!company?.id && (
            <Card className="mb-6 border-dashed border-border">
              <CardContent className="p-8 text-center">
                <Building2 className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-1">Set up your company profile</h3>
                <p className="text-sm text-muted-foreground mb-4">Create your company profile so buyers can discover you in the directory.</p>
                <Button asChild><Link to="/account/company">Create Company Profile</Link></Button>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tiles.map((t) => {
              const Icon = t.icon;
              return (
                <Link key={t.href} to={t.href}>
                  <Card className="h-full hover:border-accent/60 transition">
                    <CardContent className="p-5 flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{t.label}</div>
                        <div className="text-xs text-muted-foreground">{t.desc}</div>
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
