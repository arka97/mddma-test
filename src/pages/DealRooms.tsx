import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
  Building2,
  FileCheck2,
  FileSearch,
  MessageSquareText,
  Package,
  ShieldCheck,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Seo } from "@/components/Seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useDealRooms } from "@/hooks/queries/useDealRooms";
import type { DealContextType } from "@/repositories/dealRooms";

const contextMeta: Record<DealContextType, { label: string; icon: typeof MessageSquareText }> = {
  general: { label: "Business conversation", icon: MessageSquareText },
  rfq: { label: "RFQ discussion", icon: FileSearch },
  quotation: { label: "Quotation discussion", icon: FileCheck2 },
  product: { label: "Product discussion", icon: Package },
};

const DealRooms = () => {
  const { company } = useAuth();
  const roomsQuery = useDealRooms(Boolean(company?.id));

  return (
    <Layout>
      <Seo
        title="Private Deal Rooms — G-BAU-G"
        description="Participant-only business conversations linked to products, RFQs, and quotations."
        path="/messages"
        noindex
      />
      <PageHeader
        eyebrow="Private business communication"
        title="Deal rooms"
        subtitle="Discuss products and commercial records without publishing phone numbers, email addresses, or exact terms."
      />

      <section className="pb-16 pt-6">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-border bg-muted/25 p-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground">Participant-only records</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Rooms and messages are visible only to the two participating business owners and authorised administrators. Deal rooms do not create orders, payments, acceptance, escrow, or fulfilment obligations.
              </p>
            </div>
          </div>

          {!company ? (
            <EmptyState
              icon={Building2}
              title="Register a business to use deal rooms"
              body="Private conversations belong to verified businesses rather than personal accounts."
              action={
                <Button asChild>
                  <Link to="/apply">Register business</Link>
                </Button>
              }
            />
          ) : roomsQuery.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-32 rounded-xl" />
              ))}
            </div>
          ) : roomsQuery.isError ? (
            <EmptyState
              icon={MessageSquareText}
              title="Deal rooms could not be loaded"
              body="The migration or access policies may still be syncing in Lovable."
            />
          ) : !roomsQuery.data?.rooms.length ? (
            <EmptyState
              icon={MessageSquareText}
              title="No private conversations yet"
              body="Open a verified business profile, product, or quotation to start a participant-only conversation."
              action={
                <Button asChild variant="outline">
                  <Link to="/directory">Browse businesses</Link>
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {roomsQuery.data.rooms.map((room) => {
                const counterpartyId =
                  room.initiator_company_id === company.id
                    ? room.counterparty_company_id
                    : room.initiator_company_id;
                const counterparty = roomsQuery.data.companies[counterpartyId];
                const meta = contextMeta[room.context_type];
                const Icon = meta.icon;

                return (
                  <Link
                    key={room.id}
                    to={`/messages/${room.id}`}
                    className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <Card className="transition hover:border-accent/60">
                      <CardContent className="p-4 sm:p-5">
                        <div className="flex items-start gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary text-sm font-bold text-primary-foreground">
                            {counterparty?.logo_url ? (
                              <img
                                src={counterparty.logo_url}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              (counterparty?.name ?? "B").slice(0, 1).toUpperCase()
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h2 className="truncate font-semibold text-foreground">
                                {counterparty?.name ?? "Participating business"}
                              </h2>
                              {counterparty?.is_verified && (
                                <ShieldCheck className="h-4 w-4 shrink-0 text-success" aria-label="Business verified" />
                              )}
                              {room.status === "archived" && <Badge variant="neutral">Archived</Badge>}
                            </div>
                            <p className="mt-1 truncate text-sm text-foreground/90">{room.subject}</p>
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              <Badge variant="outline" className="gap-1">
                                <Icon className="h-3 w-3" /> {meta.label}
                              </Badge>
                              {counterparty?.country && <span>{counterparty.country}</span>}
                              <span className="ml-auto">
                                {formatDistanceToNow(new Date(room.last_message_at), { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default DealRooms;