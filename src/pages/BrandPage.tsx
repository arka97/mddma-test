import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Globe, Store, Sparkles, Loader2 } from "lucide-react";
import { useBrandBySlug } from "@/hooks/queries/useBrands";
import { useProducts } from "@/hooks/queries/useProducts";
import { useCompanyBySlug } from "@/hooks/queries/useCompanies";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductMediaCarousel } from "@/components/commodity/ProductMediaCarousel";

interface CompanyMini {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
}

const BrandPage = () => {
  const { slug } = useParams();
  const { data: brand, isLoading } = useBrandBySlug(slug);
  const { data: allProducts = [] } = useProducts();
  const [company, setCompany] = useState<CompanyMini | null>(null);

  useEffect(() => {
    if (!brand) return;
    let alive = true;
    supabase
      .from("companies_public" as never)
      .select("id,slug,name,logo_url")
      .eq("id", brand.company_id)
      .maybeSingle()
      .then(({ data }) => {
        if (alive && data) setCompany(data as unknown as CompanyMini);
      });
    return () => { alive = false; };
  }, [brand?.company_id]);

  // Branded products for this brand (fetched separately to include brand_id field)
  const [brandedProducts, setBrandedProducts] = useState<Array<{
    id: string; name: string; slug: string; image_url: string | null; gallery: string[] | null;
    video_url: string | null; retail_pack_size: string | null; b2c_url: string | null; category: string | null;
  }>>([]);

  useEffect(() => {
    if (!brand) return;
    let alive = true;
    supabase
      .from("products")
      .select("id,name,slug,image_url,gallery,video_url,retail_pack_size,b2c_url,category")
      .eq("brand_id", brand.id)
      .eq("is_hidden", false)
      .order("is_featured", { ascending: false })
      .then(({ data }) => { if (alive) setBrandedProducts((data ?? []) as typeof brandedProducts); });
    return () => { alive = false; };
  }, [brand?.id]);

  if (isLoading) {
    return <Layout><div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div></Layout>;
  }
  if (!brand) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="t-h2 mb-4">Brand not found</h1>
          <Link to="/brands" className="text-accent hover:underline">← Back to brands</Link>
        </div>
      </Layout>
    );
  }

  const buyUrl = (override?: string | null) => override || brand.b2c_url || null;

  return (
    <Layout>
      <Seo
        title={`${brand.name} — House Brand on MDDMA`}
        description={(brand.tagline ?? brand.description ?? `${brand.name} — a house brand from an MDDMA member company.`).slice(0, 160)}
        path={`/brands/${brand.slug}`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Brand",
          name: brand.name,
          url: `https://mddma.org/brands/${brand.slug}`,
          logo: brand.logo_url ?? undefined,
        }}
      />
      {/* Hero */}
      <section className="relative border-b border-border">
        {brand.cover_url && (
          <div className="absolute inset-0">
            <img src={brand.cover_url} alt="" className="h-full w-full object-cover opacity-30" />
          </div>
        )}
        <div className="relative bg-gradient-to-b from-background/50 to-background py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/brands" className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-1 h-4 w-4" /> All brands
            </Link>
            <div className="flex flex-col sm:flex-row items-start gap-5">
              {brand.logo_url ? (
                <div className="h-24 w-24 rounded-xl border border-border bg-background overflow-hidden flex items-center justify-center">
                  <img src={brand.logo_url} alt={brand.name} className="h-full w-full object-contain" />
                </div>
              ) : (
                <div className="h-24 w-24 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                  <Sparkles className="h-10 w-10" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h1 className="t-h1 text-foreground">{brand.name}</h1>
                {brand.tagline && <p className="mt-1 text-muted-foreground">{brand.tagline}</p>}
                {brand.categories && brand.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {brand.categories.map((c) => <Badge key={c} variant="secondary">{c}</Badge>)}
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mt-4">
                  {brand.b2c_url && (
                    <Button asChild>
                      <a href={brand.b2c_url} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-1.5" /> Buy retail
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  )}
                  {company && (
                    <Button variant="outline" asChild>
                      <Link to={`/store/${company.slug}`}>
                        <Store className="h-4 w-4 mr-1.5" /> By {company.name}
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {brand.story && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="t-h3 mb-3">Our Story</h2>
                  <p className="text-muted-foreground whitespace-pre-line leading-relaxed">{brand.story}</p>
                </CardContent>
              </Card>
            )}

            <div>
              <h2 className="t-h3 mb-3">Branded products</h2>
              {brandedProducts.length === 0 ? (
                <Card><CardContent className="py-10 text-center text-muted-foreground text-sm">
                  No branded SKUs listed yet.
                </CardContent></Card>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {brandedProducts.map((p) => {
                    const url = buyUrl(p.b2c_url);
                    return (
                      <Card key={p.id} className="overflow-hidden card-hover">
                        <ProductMediaCarousel
                          commodity={p.name}
                          alt={p.name}
                          images={[p.image_url, ...(p.gallery ?? [])]}
                          videoUrl={p.video_url}
                          aspect="4/3"
                          rounded={false}
                        />
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-foreground">{p.name}</h3>
                          {p.retail_pack_size && (
                            <p className="text-xs text-muted-foreground mt-0.5">{p.retail_pack_size}</p>
                          )}
                          {url ? (
                            <Button size="sm" className="w-full mt-3" asChild>
                              <a href={url} target="_blank" rel="noopener noreferrer">
                                Buy retail <ExternalLink className="h-3 w-3 ml-1" />
                              </a>
                            </Button>
                          ) : company ? (
                            <Button size="sm" variant="outline" className="w-full mt-3" asChild>
                              <Link to={`/store/${company.slug}`}>Inquire on storefront</Link>
                            </Button>
                          ) : null}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>

            {brand.gallery && brand.gallery.length > 0 && (
              <div>
                <h2 className="t-h3 mb-3">Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {brand.gallery.map((url) => (
                    <div key={url} className="aspect-square rounded-lg overflow-hidden bg-muted">
                      <img src={url} alt="" loading="lazy" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-4">
            {company && (
              <Card>
                <CardContent className="p-5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Brand owner</p>
                  <Link to={`/store/${company.slug}`} className="flex items-center gap-3 group">
                    {company.logo_url ? (
                      <img src={company.logo_url} alt="" className="h-12 w-12 rounded border border-border object-contain bg-background" />
                    ) : (
                      <div className="h-12 w-12 rounded bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                        {company.name.slice(0, 1)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-medium text-foreground group-hover:text-accent truncate">{company.name}</div>
                      <div className="text-xs text-muted-foreground">View storefront →</div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            )}
          </aside>
        </div>
      </section>
    </Layout>
  );
};

export default BrandPage;
