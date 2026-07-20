import { FormEvent, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Building2,
  FileCheck2,
  FileSearch,
  Loader2,
  LockKeyhole,
  MessageSquareText,
  Package,
  Send,
  ShieldCheck,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useDealMessages, useDealRoom } from "@/hooks/queries/useDealRooms";
import { useToast } from "@/hooks/use-toast";
import { qk } from "@/lib/queryKeys";
import { sendDealMessage, type DealContextType } from "@/repositories/dealRooms";

const contextMeta: Record<
  DealContextType,
  { label: string; icon: typeof MessageSquareText; href?: string }
> = {
  general: { label: "Business conversation", icon: MessageSquareText },
  rfq: { label: "RFQ discussion", icon: FileSearch, href: "/rfq" },
  quotation: { label: "Quotation discussion", icon: FileCheck2, href: "/quotes" },
  product: { label: "Product discussion", icon: Package, href: "/products" },
};

const DealRoom = () => {
  const { roomId } = useParams();
  const { company } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const roomQuery = useDealRoom(roomId);
  const messagesQuery = useDealMessages(roomId);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messagesQuery.data?.length]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const message = body.trim();
    if (!roomId || !message || sending) return;

    setSending(true);
    try {
      await sendDealMessage(roomId, message);
      setBody("");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: qk.dealRooms.messages(roomId) }),
        queryClient.invalidateQueries({ queryKey: qk.dealRooms.list() }),
        queryClient.invalidateQueries({ queryKey: qk.dealRooms.detail(roomId) }),
      ]);
    } catch (error) {
      toast({
        title: "Message could not be sent",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  if (roomQuery.isLoading) {
    return (
      <Layout>
        <div className="container mx-auto max-w-4xl space-y-4 px-4 py-10 sm:px-6 lg:px-8">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-[28rem] rounded-xl" />
        </div>
      </Layout>
    );
  }

  if (roomQuery.isError || !roomQuery.data) {
    return (
      <Layout>
        <div className="container mx-auto max-w-xl px-4 py-16">
          <EmptyState
            icon={LockKeyhole}
            title="Deal room unavailable"
            body="This room does not exist or your business is not a participant."
            action={
              <Button asChild variant="outline">
                <Link to="/messages">Back to deal rooms</Link>
              </Button>
            }
          />
        </div>
      </Layout>
    );
  }

  const { room, companies } = roomQuery.data;
  const counterpartyId = company
    ? room.initiator_company_id === company.id
      ? room.counterparty_company_id
      : room.initiator_company_id
    : room.counterparty_company_id;
  const counterparty = companies[counterpartyId];
  const meta = contextMeta[room.context_type];
  const ContextIcon = meta.icon;
  const canSend = Boolean(company && room.status === "open");

  return (
    <Layout>
      <Seo
        title={`${room.subject} — Private Deal Room · G-BAU-G`}
        description="Participant-only business conversation."
        path={`/messages/${room.id}`}
        noindex
      />

      <section className="border-b border-border bg-card">
        <div className="container mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/messages" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to deal rooms
          </Link>
          <div className="mt-4 flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary font-bold text-primary-foreground">
              {counterparty?.logo_url ? (
                <img src={counterparty.logo_url} alt="" className="h-full w-full object-cover" />
              ) : (
                (counterparty?.name ?? "B").slice(0, 1).toUpperCase()
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold text-foreground sm:text-2xl">{room.subject}</h1>
                {room.status === "archived" && <Badge variant="neutral">Archived</Badge>}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>{counterparty?.name ?? "Participating business"}</span>
                {counterparty?.is_verified && (
                  <ShieldCheck className="h-4 w-4 text-success" aria-label="Business verified" />
                )}
                {counterparty?.country && <span>· {counterparty.country}</span>}
              </div>
              <div className="mt-2">
                {meta.href ? (
                  <Button asChild variant="outline" size="sm">
                    <Link to={meta.href}>
                      <ContextIcon className="mr-1.5 h-3.5 w-3.5" /> {meta.label}
                    </Link>
                  </Button>
                ) : (
                  <Badge variant="outline" className="gap-1">
                    <ContextIcon className="h-3 w-3" /> {meta.label}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24 pt-5">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-border bg-muted/25 p-3 text-xs text-muted-foreground">
            <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>
              Messages are visible only to the two participating business owners and authorised administrators. Do not treat this room as an accepted order, payment instruction, escrow service, or fulfilment commitment.
            </span>
          </div>

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="max-h-[58vh] min-h-[24rem] overflow-y-auto px-4 py-5 sm:px-6">
                {messagesQuery.isLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <Skeleton key={index} className={`h-20 w-3/4 rounded-xl ${index % 2 ? "ml-auto" : ""}`} />
                    ))}
                  </div>
                ) : messagesQuery.isError ? (
                  <EmptyState
                    icon={LockKeyhole}
                    title="Messages could not be loaded"
                    body="The migration or participant access policies may still be syncing."
                  />
                ) : !messagesQuery.data?.length ? (
                  <div className="flex min-h-[20rem] items-center justify-center">
                    <EmptyState
                      icon={MessageSquareText}
                      title="Start the conversation"
                      body="Keep the discussion relevant to the business or trade context shown above."
                      className="w-full border-0 bg-transparent"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messagesQuery.data.map((message) => {
                      const ownMessage = message.sender_company_id === company?.id;
                      const sender = companies[message.sender_company_id];
                      return (
                        <div key={message.id} className={`flex ${ownMessage ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[88%] rounded-2xl px-4 py-3 sm:max-w-[72%] ${
                              ownMessage
                                ? "rounded-br-md bg-primary text-primary-foreground"
                                : "rounded-bl-md border border-border bg-muted/50 text-foreground"
                            }`}
                          >
                            {!ownMessage && (
                              <p className="mb-1 text-[11px] font-semibold opacity-70">
                                {sender?.name ?? "Participating business"}
                              </p>
                            )}
                            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{message.body}</p>
                            <p className={`mt-1 text-right text-[10px] ${ownMessage ? "text-primary-foreground/65" : "text-muted-foreground"}`}>
                              {new Date(message.created_at).toLocaleString([], {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={endRef} />
                  </div>
                )}
              </div>

              <form onSubmit={submit} className="border-t border-border bg-card p-3 sm:p-4">
                {canSend ? (
                  <div className="flex items-end gap-2">
                    <div className="min-w-0 flex-1">
                      <Textarea
                        value={body}
                        onChange={(event) => setBody(event.target.value.slice(0, 4000))}
                        placeholder="Write a private business message…"
                        rows={2}
                        className="min-h-[3rem] resize-none"
                        aria-label="Message"
                      />
                      <p className="mt-1 text-right text-[10px] text-muted-foreground">{body.length}/4000</p>
                    </div>
                    <Button type="submit" size="icon" className="h-12 w-12 shrink-0" disabled={!body.trim() || sending} aria-label="Send message">
                      {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">
                    <Building2 className="mt-0.5 h-4 w-4 shrink-0" />
                    This room is read-only because it is archived or the current account has no participant business.
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default DealRoom;