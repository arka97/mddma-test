import { useState } from "react";
import { Link } from "react-router-dom";
import { FileCheck2, LogIn, Plus, ShieldAlert } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useRfqBoard } from "@/hooks/queries/useRfqs";
import { RfqCard } from "@/components/rfq/RfqCard";
import { CreateRfqSheet } from "@/components/rfq/CreateRfqSheet";
import { QuoteRfqSheet } from "@/components/rfq/QuoteRfqSheet";
import { cn } from "@/lib/utils";
import type { RfqListingRow, RfqType } from "@/repositories/rfqListings";

const Rfq = () => {
  const { user, loading: authLoading, company } = useAuth();
  const [type, setType] = useState<RfqType>("buy");
  const [composeOpen, setComposeOpen] = useState(false);
  const [selectedRfq, setSelectedRfq] = useState<RfqListingRow | null>(null);
  const { data, isLoading, isError } = useRfqBoard(type, Boolean(user));

  const canTrade = Boolean(
    user &&
      company?.is_verified &&
      company.review_status === "approved" &&
      !company.is_hidden,
  );

  const accessMessage = !company
    ? {
        title: "Register a business to participate",
        body: "You may browse requirements after signing in. Posting and quoting require an existing business profile.",
        href: "/apply",
        cta: "Register business",
      }
    : company.review_status === "pending"
      ? {
          title: "Business review pending",
          body: "You can browse current requirements while MDDMA staff review the business evidence.",
          href: "/account/company",
          cta: "Review profile",
        }
      : {
          title: "Business verification required",
          body: "Posting RFQs and quotations is enabled after the business is approved and verified.",
          href: "/account/company",
          cta: "Update business",
        };

  return (
    <Layout>
      <Seo
        title="RFQ Network — G-BAU-G"
        description="Discover verified food-trade requirements and exchange private indicative or formal quotations."
        path="/rfq"
        noindex
      />

      <section className="border-b border-border bg-card py-7">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[hsl(var(--gold-dark))]">
                Commercial network
              </p>
              <h1 className="mt-1 text-2xl font-semibold text-foreground sm:text-3xl">RFQs and supply requirements</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Discover active requirements, then exchange exact price, payment and delivery terms through private quotations.
              </p>
            </div>
            {user && (
              <Button asChild variant="outline">
                <Link to="/quotes">
                  <FileCheck2 className="mr-2 h-4 w-4" /> My quotations
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl px-4 pb-24 pt-5 sm:px-6 lg:px-8">
        {authLoading ? (
          <Skeleton className="h-36 rounded-xl" />
        ) : !user ? (
          <div className="py-12">
            <EmptyState
              icon={LogIn}
              title="Sign in to enter the RFQ network"
              body="Business requirements are shared within the authenticated G-BAU-G network."
              action={
                <Button asChild>
                  <Link to="/login?next=%2Frfq">Sign in</Link>
                </Button>
              }
            />
          </div>
        ) : (
          <>
            {!canTrade && (
              <div className="mb-5 flex flex-col gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-warning-foreground" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{accessMessage.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{accessMessage.body}</p>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link to={accessMessage.href}>{accessMessage.cta}</Link>
                </Button>
              </div>
            )}

            <div className="sticky top-[3.25rem] z-10 -mx-4 grid grid-cols-2 bg-background/95 px-4 pb-3 pt-2 backdrop-blur sm:-mx-6 sm:px-6 lg:top-[6.5rem]">
              <button
                onClick={() => setType("buy")}
                className={cn(
                  "border-b-2 py-2 text-sm font-semibold transition-colors",
                  type === "buy"
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground",
                )}
              >
                BUY REQUIREMENTS
              </button>
              <button
                onClick={() => setType("sell")}
                className={cn(
                  "border-b-2 py-2 text-sm font-semibold transition-colors",
                  type === "sell"
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground",
                )}
              >
                SUPPLY AVAILABLE
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-64 rounded-xl" />
                ))
              ) : isError ? (
                <EmptyState
                  title="RFQs could not be loaded"
                  body="The database migration or access policy may still be syncing in Lovable."
                />
              ) : !data?.rows.length ? (
                <EmptyState
                  title="No active requirements"
                  body={`No ${type === "buy" ? "buy requirements" : "supply notices"} are open right now.`}
                />
              ) : (
                data.rows.map((rfq) => {
                  const business = rfq.company_id ? data.companies[rfq.company_id] : undefined;
                  return (
                    <RfqCard
                      key={rfq.id}
                      rfq={rfq}
                      company={business}
                      canQuote={canTrade && Boolean(rfq.company_id) && rfq.company_id !== company?.id}
                      isOwn={Boolean(company?.id && rfq.company_id === company.id)}
                      onQuote={() => setSelectedRfq(rfq)}
                    />
                  );
                })
              )}
            </div>

            {canTrade && (
              <Button
                onClick={() => setComposeOpen(true)}
                className="fixed bottom-20 right-4 z-30 h-14 w-14 rounded-full shadow-lg lg:bottom-6"
                size="icon"
                aria-label="Post RFQ"
              >
                <Plus className="h-6 w-6" />
              </Button>
            )}

            <CreateRfqSheet open={composeOpen} onOpenChange={setComposeOpen} canPost={canTrade} />
            <QuoteRfqSheet
              open={Boolean(selectedRfq)}
              onOpenChange={(open) => {
                if (!open) setSelectedRfq(null);
              }}
              rfq={selectedRfq}
              recipient={
                selectedRfq?.company_id && data
                  ? data.companies[selectedRfq.company_id]
                  : undefined
              }
              canQuote={canTrade}
            />
          </>
        )}
      </div>
    </Layout>
  );
};

export default Rfq;
