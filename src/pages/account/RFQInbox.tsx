import { friendlyErrorMessage } from "@/lib/errors";
import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Inbox, Send, Clock, IndianRupee, MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface RFQ {
  id: string;
  buyer_id: string;
  company_id: string;
  product_name: string;
  quantity: string;
  packaging: string | null;
  delivery_timeline: string | null;
  delivery_location: string | null;
  message: string | null;
  buyer_name: string | null;
  buyer_company: string | null;
  buyer_phone: string | null;
  buyer_email: string | null;
  status: string;
  created_at: string;
}

interface RFQResponse {
  id: string;
  rfq_id: string;
  price_quoted: number | null;
  unit: string | null;
  message: string | null;
  valid_until: string | null;
  created_at: string;
}

const statusColor: Record<string, string> = {
  new: "bg-blue-500",
  viewed: "bg-gray-500",
  responded: "bg-amber-500",
  negotiating: "bg-purple-500",
  converted: "bg-green-500",
  closed: "bg-slate-500",
};

const RFQInbox = () => {
  const { user, company } = useAuth();
  const { toast } = useToast();
  const [sent, setSent] = useState<RFQ[]>([]);
  const [received, setReceived] = useState<RFQ[]>([]);
  const [responses, setResponses] = useState<Record<string, RFQResponse[]>>({});
  const [loading, setLoading] = useState(true);
  const [respondTo, setRespondTo] = useState<RFQ | null>(null);
  const [respForm, setRespForm] = useState({ price_quoted: "", unit: "kg", message: "", valid_until: "" });
  const [savingResp, setSavingResp] = useState(false);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const sentQ = supabase.from("rfqs").select("*").eq("buyer_id", user.id).order("created_at", { ascending: false });
    const recvQ = company ? supabase.from("rfqs").select("*").eq("company_id", company.id).order("created_at", { ascending: false }) : Promise.resolve({ data: [] as RFQ[] });
    const [{ data: s }, { data: r }] = await Promise.all([sentQ, recvQ as Promise<{ data: RFQ[] | null }>]);
    setSent((s ?? []) as RFQ[]);
    setReceived((r ?? []) as RFQ[]);

    const ids = [...(s ?? []), ...(r ?? [])].map((x) => x.id);
    if (ids.length) {
      const { data: resp } = await supabase.from("rfq_responses").select("*").in("rfq_id", ids);
      const grouped: Record<string, RFQResponse[]> = {};
      (resp ?? []).forEach((rr) => { (grouped[rr.rfq_id] ||= []).push(rr); });
      setResponses(grouped);
    }
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user?.id, company?.id]);

  const updateStatus = async (rfq: RFQ, status: "viewed" | "negotiating" | "converted" | "closed") => {
    const { error } = await supabase.from("rfqs").update({ status }).eq("id", rfq.id);
    if (error) toast({ title: "Failed", variant: "destructive" });
    else load();
  };

  const submitResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!respondTo || !user) return;
    setSavingResp(true);
    const { error } = await supabase.from("rfq_responses").insert({
      rfq_id: respondTo.id,
      responder_id: user.id,
      price_quoted: respForm.price_quoted ? parseFloat(respForm.price_quoted) : null,
      unit: respForm.unit || "kg",
      message: respForm.message || null,
      valid_until: respForm.valid_until || null,
    });
    if (!error) {
      await supabase.from("rfqs").update({ status: "responded" }).eq("id", respondTo.id);
    }
    setSavingResp(false);
    if (error) toast({ title: "Response failed", description: friendlyErrorMessage(error), variant: "destructive" });
    else { toast({ title: "Quote sent" }); setRespondTo(null); setRespForm({ price_quoted: "", unit: "kg", message: "", valid_until: "" }); load(); }
  };

  if (!user) return null;

  const RFQCard = ({ rfq, side }: { rfq: RFQ; side: "sent" | "received" }) => {
    const replies = responses[rfq.id] ?? [];
    return (
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold">{rfq.product_name}</h3>
              <p className="text-xs text-muted-foreground">
                {side === "sent" ? "To seller" : `From ${rfq.buyer_name ?? "Buyer"}${rfq.buyer_company ? ` · ${rfq.buyer_company}` : ""}`}
              </p>
            </div>
            <Badge className={`${statusColor[rfq.status] ?? "bg-gray-500"} text-white`}>{rfq.status}</Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <span>Quantity: <strong className="text-foreground">{rfq.quantity}</strong></span>
            {rfq.packaging && <span>Packaging: <strong className="text-foreground">{rfq.packaging}</strong></span>}
            {rfq.delivery_timeline && <span>Timeline: <strong className="text-foreground">{rfq.delivery_timeline}</strong></span>}
            {rfq.delivery_location && <span>Location: <strong className="text-foreground">{rfq.delivery_location}</strong></span>}
          </div>
          {rfq.message && <p className="text-sm bg-muted/50 p-2 rounded">{rfq.message}</p>}

          {replies.length > 0 && (
            <div className="border-t pt-3 space-y-2">
              <p className="text-xs font-medium text-muted-foreground">{replies.length} response(s)</p>
              {replies.map((rr) => (
                <div key={rr.id} className="text-sm bg-accent/10 p-2 rounded">
                  {rr.price_quoted && <p className="font-semibold flex items-center gap-1"><IndianRupee className="h-3 w-3" />{rr.price_quoted} / {rr.unit}</p>}
                  {rr.message && <p className="text-muted-foreground">{rr.message}</p>}
                  {rr.valid_until && <p className="text-xs text-muted-foreground">Valid until {new Date(rr.valid_until).toLocaleDateString()}</p>}
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(rfq.created_at).toLocaleDateString()}</span>
            {side === "received" && (
              <>
                {rfq.buyer_phone && (
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" asChild>
                    <a
                      href={`https://wa.me/${rfq.buyer_phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                        `Hi ${rfq.buyer_name ?? rfq.buyer_company ?? "there"},\n\nI received your RFQ via MDDMA for ${rfq.product_name} (${rfq.quantity}).\n${rfq.delivery_location ? `Delivery: ${rfq.delivery_location}` : ""}${rfq.delivery_timeline ? ` by ${rfq.delivery_timeline}` : ""}\n\nMy company: ${company?.name ?? "MDDMA member"}.\nPlease let me know if you need samples or have questions.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-3 w-3 mr-1" /> WhatsApp Buyer
                    </a>
                  </Button>
                )}
                {rfq.status === "new" && <Button size="sm" variant="outline" onClick={() => updateStatus(rfq, "viewed")}>Mark viewed</Button>}
                <Button size="sm" onClick={() => setRespondTo(rfq)}>Send quote</Button>
                {rfq.status !== "converted" && <Button size="sm" variant="outline" onClick={() => updateStatus(rfq, "converted")}>Mark won</Button>}
                {rfq.status !== "closed" && <Button size="sm" variant="ghost" onClick={() => updateStatus(rfq, "closed")}>Close</Button>}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Layout>
      <section className="py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-3xl font-bold mb-6 flex items-center gap-2"><Inbox /> RFQ Center</h1>

          {loading ? <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div> : (
            <Tabs defaultValue={company ? "received" : "sent"}>
              <TabsList>
                <TabsTrigger value="sent"><Send className="h-3 w-3 mr-1" /> Sent ({sent.length})</TabsTrigger>
                {company && <TabsTrigger value="received"><Inbox className="h-3 w-3 mr-1" /> Received ({received.length})</TabsTrigger>}
              </TabsList>
              <TabsContent value="sent" className="space-y-3 mt-4">
                {sent.length === 0 ? <p className="text-muted-foreground text-center py-12">No RFQs sent yet. <Link to="/products" className="text-accent underline">Browse products</Link></p> :
                  sent.map((r) => <RFQCard key={r.id} rfq={r} side="sent" />)}
              </TabsContent>
              {company && (
                <TabsContent value="received" className="space-y-3 mt-4">
                  {received.length === 0 ? <p className="text-muted-foreground text-center py-12">No incoming RFQs yet.</p> :
                    received.map((r) => <RFQCard key={r.id} rfq={r} side="received" />)}
                </TabsContent>
              )}
            </Tabs>
          )}
        </div>
      </section>

      <Dialog open={!!respondTo} onOpenChange={(o) => !o && setRespondTo(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Send quote — {respondTo?.product_name}</DialogTitle></DialogHeader>
          {respondTo && (
            <form onSubmit={submitResponse} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Price (₹)</Label><Input type="number" step="0.01" value={respForm.price_quoted} onChange={(e) => setRespForm({ ...respForm, price_quoted: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Unit</Label><Input value={respForm.unit} onChange={(e) => setRespForm({ ...respForm, unit: e.target.value })} /></div>
              </div>
              <div className="space-y-1.5"><Label>Message</Label><Textarea rows={4} maxLength={1000} value={respForm.message} onChange={(e) => setRespForm({ ...respForm, message: e.target.value })} placeholder="Quality notes, delivery, payment terms…" /></div>
              <div className="space-y-1.5"><Label>Valid until</Label><Input type="date" value={respForm.valid_until} onChange={(e) => setRespForm({ ...respForm, valid_until: e.target.value })} /></div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setRespondTo(null)}>Cancel</Button>
                <Button type="submit" disabled={savingResp}>{savingResp ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send quote"}</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default RFQInbox;
