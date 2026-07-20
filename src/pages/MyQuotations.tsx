import { useState } from "react";
import { Link } from "react-router-dom";
import { FileCheck2, Inbox, Send } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { QuotationCard } from "@/components/rfq/QuotationCard";
import { useAuth } from "@/contexts/AuthContext";
import { useReceivedQuotations, useSentQuotations } from "@/hooks/queries/useQuotations";
import { useToast } from "@/hooks/use-toast";
import { qk } from "@/lib/queryKeys";
import { cn } from "@/lib/utils";
import { withdrawQuotation } from "@/repositories/rfqQuotations";

const MyQuotations = () => {
  const { user, company } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"received" | "sent">("received");
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);
  const sent = useSentQuotations(user?.id);
  const received = useReceivedQuotations(company?.id);

  if (!user) return null;

  const active = tab === "received" ? received : sent;
  const data = active.data;

  const withdraw = async (id: string) => {
    setWithdrawingId(id);
    try {
      await withdrawQuotation(id);
      await queryClient.invalidateQueries({ queryKey: qk.quotations.all });
      toast({ title: "Quotation withdrawn" });
    } catch (error) {
      toast({
        title: "Could not withdraw quotation",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setWithdrawingId(null);
    }
  };

  return (
    <Layout>
      <Seo
        title="My Quotations — G-BAU-G"
        description="Private indicative and formal quotations sent and received through G-BAU-G RFQs."
        path="/quotes"
        noindex
      />
      <PageHeader
        eyebrow="Private commercial records"
        title="My quotations"
        subtitle="Exact price, delivery and payment terms are visible only to the participating businesses and authorised administrators."
      />

      <section className="pb-16 pt-6">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-5 flex flex-col gap-3 rounded-xl border border-border bg-muted/25 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <FileCheck2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">Quotation boundary</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Formal quotations are recorded, but this release has no acceptance, purchase-order, payment, escrow or fulfilment workflow.
                </p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/rfq">Browse RFQs</Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 border-b border-border">
            <button
              onClick={() => setTab("received")}
              className={cn(
                "flex items-center justify-center gap-2 border-b-2 px-3 py-3 text-sm font-semibold transition-colors",
                tab === "received"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground",
              )}
            >
              <Inbox className="h-4 w-4" /> Received
              {received.data ? <span className="text-xs">({received.data.rows.length})</span> : null}
            </button>
            <button
              onClick={() => setTab("sent")}
              className={cn(
                "flex items-center justify-center gap-2 border-b-2 px-3 py-3 text-sm font-semibold transition-colors",
                tab === "sent"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground",
              )}
            >
              <Send className="h-4 w-4" /> Sent
              {sent.data ? <span className="text-xs">({sent.data.rows.length})</span> : null}
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {tab === "received" && !company ? (
              <EmptyState
                title="Register a business to receive quotations"
                body="Received quotations belong to a business, not to a personal account."
                action={
                  <Button asChild>
                    <Link to="/apply">Register business</Link>
                  </Button>
                }
              />
            ) : active.isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-72 rounded-xl" />
              ))
            ) : active.isError ? (
              <EmptyState
                title="Quotations could not be loaded"
                body="The quotation migration or access policy may still be syncing in Lovable."
              />
            ) : !data?.rows.length ? (
              <EmptyState
                title={tab === "received" ? "No quotations received" : "No quotations sent"}
                body={
                  tab === "received"
                    ? "Private quotations responding to your RFQs will appear here."
                    : "Open an RFQ and submit an indicative or formal quotation."
                }
                action={
                  tab === "sent" ? (
                    <Button asChild>
                      <Link to="/rfq">Browse RFQs</Link>
                    </Button>
                  ) : undefined
                }
              />
            ) : (
              data.rows.map((quotation) => {
                const counterpartyId =
                  tab === "received"
                    ? quotation.sender_company_id
                    : quotation.recipient_company_id;
                return (
                  <QuotationCard
                    key={quotation.id}
                    quotation={quotation}
                    rfq={data.rfqs[quotation.rfq_id]}
                    counterparty={data.companies[counterpartyId]}
                    direction={tab}
                    onWithdraw={tab === "sent" ? () => withdraw(quotation.id) : undefined}
                    withdrawing={withdrawingId === quotation.id}
                  />
                );
              })
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MyQuotations;
