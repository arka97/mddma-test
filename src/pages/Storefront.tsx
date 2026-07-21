import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock3,
  ExternalLink,
  Eye,
  Globe,
  Languages,
  MapPin,
  Package,
  Pencil,
  ShieldCheck,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ListingsGridSkeleton, ProfileHeaderSkeleton } from "@/components/ui/skeletons";
import { ProductTile } from "@/components/products/ProductTile";
import { BrandStrip } from "@/components/brands/BrandStrip";
import { StartDealRoomButton } from "@/components/deals/StartDealRoomButton";
import { useAuth } from "@/contexts/AuthContext";
import { useBrandsByCompany } from "@/hooks/queries/useBrands";
import { useCompanyBySlug } from "@/hooks/queries/useCompanies";
import { useProducts } from "@/hooks/queries/useProducts";
import { CompanyTeamStrip } from "@/components/company/CompanyTeamStrip";
import { FollowButton } from "@/components/social/FollowButton";
import { useFollowerCount } from "@/hooks/queries/useFollowerCount";

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "·"
  );
}

function externalUrl(value: string) {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

const Storefront = () => {
  const { slug } = useParams();
  const { company: ownCompany, hasRole } = useAuth();
  const [previewMode, setPreviewMode] = useState(false);
  const companyQuery = useCompanyBySlug(slug);
  const company = companyQuery.data;
  const productsQuery = useProducts({
    companyId: company?.id,
    enabled: Boolean(company?.id),
  });
  const { data: companyBrands = [] } = useBrandsByCompany(company?.id);
  const { data: followerCount = 0 } = useFollowerCount(company?.id);


  const products = useMemo(
    () =>
      (productsQuery.data ?? []).map((product) => ({
        ...product,
        sellerName: company?.name,
        sellerSlug: company?.slug,
      })),
    [company?.name, company?.slug, productsQuery.data],
  );

  const isOwner = Boolean(company && ownCompany?.id === company.id);
  const canManage = isOwner || hasRole("admin");
  const location = company
    ? [company.city, company.state, company.country].filter(Boolean).join(", ")
    : "";
  const yearsInBusiness = company?.established_year
    ? Math.max(new Date().getFullYear() - company.established_year, 0)
    : null;

  if (companyQuery.isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <ProfileHeaderSkeleton />
          <div className="mt-8">
            <ListingsGridSkeleton count={6} className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" />
          </div>
        </div>
      </Layout>
    );
  }

  if (companyQuery.isError || !company) {
    return (
      <Layout>
        <div className="container mx-auto max-w-xl px-4 py-16">
          <EmptyState
            icon={Building2}
            title="Business profile not found"
            body="This profile may still be under review, hidden, or no longer available."
            action={
              <Button asChild variant="outline">
                <Link to="/directory">Back to business directory</Link>
              </Button>
            }
          />
        </div>
      </Layout>
    );
  }

  const description =
    company.description ||
    company.tagline ||
    `${company.name} is listed on the verified G-BAU-G food-trade network.`;

  return (
    <Layout>
      <Seo
        title={`${company.name} — Business Profile · G-BAU-G`}
        description={description.slice(0, 160)}
        path={`/store/${company.slug}`}
      />

      {canManage && !previewMode && (
        <div className="border-b border-accent/30 bg-accent/10">
          <div className="container mx-auto flex flex-col gap-2 px-4 py-2 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <div className="flex items-start gap-2 text-xs">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
              <span>
                <span className="font-medium text-foreground">
                  {isOwner ? "You are viewing your public business profile" : "Admin moderation view"}
                </span>{" "}
                <span className="text-muted-foreground">
                  — private contact and registration evidence are not displayed here.
                </span>
              </span>
            </div>
            <div className="grid grid-cols-1 gap-1.5 sm:flex sm:items-center sm:gap-2">
              <Button size="sm" variant="outline" onClick={() => setPreviewMode(true)}>
                <Eye className="mr-1 h-3 w-3" /> View as public
              </Button>
              <Button size="sm" asChild>
                <Link to="/account/company">
                  <Pencil className="mr-1 h-3 w-3" /> Edit business
                </Link>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link to="/account/products">
                  <Package className="mr-1 h-3 w-3" /> Edit catalogue
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {previewMode && canManage && (
        <div className="border-b border-border bg-muted">
          <div className="container mx-auto flex items-center justify-between px-4 py-1.5 text-xs sm:px-6 lg:px-8">
            <span className="text-muted-foreground">Public preview mode</span>
            <Button size="sm" variant="ghost" className="h-7" onClick={() => setPreviewMode(false)}>
              Exit preview
            </Button>
          </div>
        </div>
      )}

      <section className="border-b border-border bg-gradient-to-b from-muted/40 to-background py-8 sm:py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/directory" className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to business directory
          </Link>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-primary text-xl font-bold text-primary-foreground">
              {company.logo_url ? (
                <img src={company.logo_url} alt={`${company.name} logo`} className="h-full w-full object-cover" />
              ) : (
                initials(company.name)
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="t-h1 text-foreground">{company.name}</h1>
                    {company.is_verified && (
                      <Badge variant="success">
                        <ShieldCheck className="mr-1 h-3 w-3" /> Business verified
                      </Badge>
                    )}
                  </div>
                  {company.tagline && <p className="mt-1 text-sm text-muted-foreground">{company.tagline}</p>}
                </div>
                {!isOwner && (
                  <FollowButton id={company.id} name={company.name} size="default" />
                )}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>
                  <span className="font-semibold text-foreground">{followerCount.toLocaleString()}</span>{" "}
                  {followerCount === 1 ? "follower" : "followers"}
                </span>
                {location && (
                  <>
                    <span aria-hidden>·</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {location}
                    </span>
                  </>
                )}
                {company.established_year && (
                  <>
                    <span aria-hidden>·</span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Est. {company.established_year}
                    </span>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="min-w-0 space-y-6 lg:col-span-2">
              <Card>
                <CardHeader><CardTitle>About the business</CardTitle></CardHeader>
                <CardContent>
                  <p className="leading-relaxed text-muted-foreground">{description}</p>
                  <div className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-5 sm:grid-cols-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-accent">{products.length}</div>
                      <div className="text-xs text-muted-foreground">Active products</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-accent">{company.categories.length}</div>
                      <div className="text-xs text-muted-foreground">Capabilities</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-accent">{company.markets.length}</div>
                      <div className="text-xs text-muted-foreground">Markets listed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-accent">
                        {yearsInBusiness === null ? "—" : `${yearsInBusiness}+`}
                      </div>
                      <div className="text-xs text-muted-foreground">Years operating</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Verification and trade reach</CardTitle></CardHeader>
                <CardContent className="space-y-5">
                  <div className="rounded-xl border border-border bg-muted/30 p-4">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className={`mt-0.5 h-5 w-5 shrink-0 ${company.is_verified ? "text-success" : "text-muted-foreground"}`} />
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {company.is_verified ? company.verification_tier_label || "Business evidence reviewed" : "Business not yet verified"}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          Verification confirms that submitted business evidence was reviewed. It does not guarantee inventory, product quality, creditworthiness, pricing, or fulfilment.
                        </p>
                      </div>
                    </div>
                  </div>

                  {company.certifications.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Listed certifications</p>
                      <div className="flex flex-wrap gap-2">
                        {company.certifications.map((certification) => (
                          <Badge key={certification} variant="outline">{certification}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {company.markets.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Markets served</p>
                      <div className="flex flex-wrap gap-2">
                        {company.markets.map((market) => (
                          <Badge key={market} variant="secondary">
                            <Globe className="mr-1 h-3 w-3" /> {market}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {companyBrands.length > 0 && (
                <Card>
                  <CardContent className="p-5">
                    <BrandStrip brands={companyBrands} title="Brands" />
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-accent" /> Product catalogue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {productsQuery.isLoading ? (
                    <ListingsGridSkeleton count={6} className="grid-cols-2 sm:grid-cols-3" />
                  ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                      {products.map((product) => (
                        <ProductTile key={product.id} listing={product} hideSeller />
                      ))}
                    </div>
                  ) : (
                    <p className="py-6 text-center text-muted-foreground">No active products have been published yet.</p>
                  )}
                </CardContent>
              </Card>

              <CompanyTeamStrip companyId={company.id} />
            </div>


            <div className="min-w-0 space-y-6">
              <Card>
                <CardHeader><CardTitle>Trade with this business</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Start a private business conversation for early discussion, then use RFQs and quotations for structured commercial terms.
                  </p>
                  <StartDealRoomButton
                    counterpartyCompanyId={company.id}
                    subject={`Business enquiry: ${company.name}`}
                    label="Message business privately"
                    className="w-full"
                  />
                  <Button className="w-full" variant="outline" asChild>
                    <Link to="/rfq">Browse or post an RFQ</Link>
                  </Button>
                  {company.website && (
                    <Button className="w-full" variant="outline" asChild>
                      <a href={externalUrl(company.website)} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" /> Visit business website
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>

              {location && (
                <Card>
                  <CardHeader><CardTitle>Location</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span>{location}</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {company.categories.length > 0 && (
                <Card>
                  <CardHeader><CardTitle>Capabilities</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {company.categories.map((category) => (
                        <Badge key={category} variant="secondary">{category}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {(company.languages.length > 0 || company.hours) && (
                <Card>
                  <CardHeader><CardTitle>Business information</CardTitle></CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    {company.languages.length > 0 && (
                      <div className="flex items-start gap-2">
                        <Languages className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <span>{company.languages.join(", ")}</span>
                      </div>
                    )}
                    {company.hours && (
                      <div className="flex items-start gap-2">
                        <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <span>{company.hours}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Storefront;