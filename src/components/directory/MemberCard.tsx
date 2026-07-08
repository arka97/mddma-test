import { Link } from "react-router-dom";
import { BadgeCheck, MapPin, ShieldCheck, Star, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface DirMember {
  id: string;
  slug: string;
  firmName: string;
  ownerName: string;
  memberType: string;
  area: string;
  commodities: string[];
  memberSince: number;
  isSponsored?: boolean;
  verificationStatus: "Verified" | "Not Verified" | string;
  gstNumber?: string | null;
  fssaiNumber?: string | null;
  logoPlaceholder: string;
}

export function MemberCard({ m }: { m: DirMember }) {
  const initials = (m.logoPlaceholder || m.firmName.slice(0, 2)).toUpperCase();
  const verified = m.verificationStatus === "Verified";
  const hasGst = m.gstNumber && m.gstNumber.length >= 5;
  const hasFssai = !!m.fssaiNumber;

  return (
    <article className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        {m.isSponsored && (
          <span className="inline-flex items-center gap-0.5 rounded bg-accent/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-accent">
            <Star className="h-2.5 w-2.5" /> Sponsored
          </span>
        )}
        {verified && (
          <span className="inline-flex items-center gap-0.5 rounded bg-success/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-success">
            <ShieldCheck className="h-2.5 w-2.5" /> Verified
          </span>
        )}
      </div>

      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-foreground">{m.firmName}</h3>
          <p className="truncate text-[11px] text-muted-foreground">{m.ownerName || m.memberType}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1">
        <Badge variant="outline" className="h-5 text-[10px]">{m.memberType}</Badge>
        {hasGst && (
          <Badge variant="outline" className="h-5 gap-0.5 border-success/30 bg-success/10 text-[10px] text-success">
            <BadgeCheck className="h-2.5 w-2.5" /> GST
          </Badge>
        )}
        {hasFssai && (
          <Badge variant="outline" className="h-5 gap-0.5 border-success/30 bg-success/10 text-[10px] text-success">
            <BadgeCheck className="h-2.5 w-2.5" /> FSSAI
          </Badge>
        )}
        {m.area && (
          <span className="inline-flex items-center gap-0.5 text-[11px] text-muted-foreground">
            <MapPin className="h-3 w-3" /> {m.area}
          </span>
        )}
      </div>

      {m.commodities.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {m.commodities.slice(0, 3).map((c) => (
            <Badge key={c} variant="secondary" className="h-5 text-[10px]">{c}</Badge>
          ))}
          {m.commodities.length > 3 && (
            <Badge variant="secondary" className="h-5 text-[10px]">+{m.commodities.length - 3}</Badge>
          )}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-border pt-3 text-[11px] text-muted-foreground">
        <span>
          Member since <span className="font-semibold text-foreground">{m.memberSince || "—"}</span>
        </span>
        <Button asChild size="sm" variant="outline" className="h-8 text-xs">
          <Link to={`/store/${m.slug}`}>
            <Store className="mr-1 h-3 w-3" /> View store
          </Link>
        </Button>
      </div>
    </article>
  );
}
