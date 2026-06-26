import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Lock, Plus } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeletons";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/contexts/RoleContext";
import { listActiveRfqs, type RfqListingRow, type RfqType } from "@/repositories/rfqListings";
import { RfqCard } from "@/components/rfq/RfqCard";
import { CreateRfqSheet } from "@/components/rfq/CreateRfqSheet";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const Rfq = () => {
  const { user, loading: authLoading } = useAuth();
  const { role } = useRole();
  const [type, setType] = useState<RfqType>("buy");
  const [rows, setRows] = useState<RfqListingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [composeOpen, setComposeOpen] = useState(false);
  const [companies, setCompanies] = useState<Record<string, { name: string; is_verified: boolean }>>({});

  const isPaid = role === "paid_member" || role === "broker" || role === "admin";

  const load = async () => {
    setLoading(true);
    try {
      const data = await listActiveRfqs(type);
      setRows(data);
      const ids = Array.from(new Set(data.map((r) => r.company_id).filter(Boolean))) as string[];
      if (ids.length) {
        const { data: cs } = await supabase.from("companies").select("id,name,is_verified").in("id", ids);
        const map: Record<string, { name: string; is_verified: boolean }> = {};
        (cs ?? []).forEach((c: { id: string; name: string; is_verified: boolean }) => { map[c.id] = { name: c.name, is_verified: c.is_verified }; });
        setCompanies(map);
      }
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (isPaid) load(); else setLoading(false); /* eslint-disable-next-line */ }, [type, isPaid]);

  return (
    <Layout>
      <Seo title="RFQ Board — MDDMA" description="Buying and selling requirements from verified MDDMA members." path="/rfq" noindex />
      <div className="container mx-auto max-w-3xl px-4 pb-24 pt-4 sm:px-6 lg:px-8">
        {authLoading ? (
          <Skeleton className="h-32 rounded-md" />
        ) : !isPaid ? (
          <div className="py-10">
            <EmptyState
              icon={Lock}
              title="RFQ Board — Members Only"
              body="Post buying and selling requirements. Connect directly with verified traders."
              action={<Button asChild variant="accent"><Link to="/apply">Upgrade to Paid Membership</Link></Button>}
            />
          </div>
        ) : (
          <>
            <div className="sticky top-0 z-10 -mx-4 grid grid-cols-2 gap-0 bg-background px-4 pb-3 pt-2 sm:-mx-6 sm:px-6">
              <button
                onClick={() => setType("buy")}
                className={cn("border-b-2 py-2 text-sm font-semibold transition-colors", type === "buy" ? "border-foreground text-foreground" : "border-transparent text-muted-foreground")}
              >BUYING</button>
              <button
                onClick={() => setType("sell")}
                className={cn("border-b-2 py-2 text-sm font-semibold transition-colors", type === "sell" ? "border-foreground text-foreground" : "border-transparent text-muted-foreground")}
              >SELLING</button>
            </div>

            <div className="mt-4 space-y-3">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-md" />)
              ) : rows.length === 0 ? (
                <EmptyState title="No active RFQs" body={`No ${type === "buy" ? "buying" : "selling"} requirements right now.`} />
              ) : (
                rows.map((r) => (
                  <RfqCard
                    key={r.id}
                    rfq={r}
                    companyName={r.company_id ? companies[r.company_id]?.name : undefined}
                    verified={r.company_id ? companies[r.company_id]?.is_verified : false}
                  />
                ))
              )}
            </div>

            <Button
              onClick={() => setComposeOpen(true)}
              className="fixed bottom-20 right-4 z-30 h-14 w-14 rounded-full shadow-lg lg:bottom-6"
              size="icon"
              variant="accent"
            >
              <Plus className="h-6 w-6" />
            </Button>
            <CreateRfqSheet open={composeOpen} onOpenChange={(v) => { setComposeOpen(v); if (!v) load(); }} />
          </>
        )}
      </div>
    </Layout>
  );
};

export default Rfq;
