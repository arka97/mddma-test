import { Link } from "react-router-dom";
import { Building2, Check, ExternalLink, ShieldCheck, Users } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth, type CompanyMemberRole } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const ROLE_TONE: Record<CompanyMemberRole, string> = {
  owner: "bg-primary/15 text-primary",
  admin: "bg-accent/40 text-foreground",
  editor: "bg-secondary text-foreground",
  viewer: "bg-muted text-muted-foreground",
};

export default function CompaniesPage() {
  const { memberships, company, setActiveCompany, loading } = useAuth();

  return (
    <Layout>
      <Seo
        title="My businesses | G-BAU-G"
        description="Switch between the businesses you represent on G-BAU-G."
        path="/account/companies"
        noindex
      />
      <div className="container mx-auto max-w-3xl px-5 py-6 sm:py-10">
        <header className="mb-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
            <Building2 className="h-3.5 w-3.5" /> Identity
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">My businesses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every business you represent on G-BAU-G. Switch to change which identity is used when you post,
            quote, and message.
          </p>
        </header>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : memberships.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No business yet</CardTitle>
              <CardDescription>
                Register a business profile or ask a teammate to add you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to="/account/company">Register business</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <ul className="space-y-3">
            {memberships.map(({ company: c, role }) => {
              const isActive = c.id === company?.id;
              return (
                <li key={c.id}>
                  <Card
                    className={cn(
                      "transition-colors",
                      isActive && "border-primary/60 ring-1 ring-primary/20",
                    )}
                  >
                    <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={c.logo_url ?? undefined} />
                        <AvatarFallback>
                          {c.name.slice(0, 1).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="truncate text-base font-semibold">{c.name}</span>
                          {c.is_verified && (
                            <Badge variant="outline" className="border-success/40 text-success">
                              <ShieldCheck className="mr-1 h-3 w-3" /> Verified
                            </Badge>
                          )}
                          {c.review_status !== "approved" && (
                            <Badge variant="outline" className="capitalize">
                              {c.review_status}
                            </Badge>
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs">
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 font-medium capitalize",
                              ROLE_TONE[role],
                            )}
                          >
                            {role}
                          </span>
                          {isActive && (
                            <span className="inline-flex items-center gap-1 text-primary">
                              <Check className="h-3 w-3" /> Currently active
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {!isActive && (
                          <Button size="sm" variant="secondary" onClick={() => setActiveCompany(c.id)}>
                            Act as this
                          </Button>
                        )}
                        {(role === "owner" || role === "admin") && (
                          <Button size="sm" variant="outline" asChild>
                            <Link to="/account/team">
                              <Users className="mr-1 h-3.5 w-3.5" /> Team
                            </Link>
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" asChild>
                          <Link to={`/store/${c.slug}`}>
                            <ExternalLink className="mr-1 h-3.5 w-3.5" /> Storefront
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Layout>
  );
}
