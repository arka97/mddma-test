import { useMemo, useState } from "react";
import { Search, Phone, Mail, MapPin } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import roster from "@/data/memberRoster.json";

type Member = {
  srNo: number | null;
  companyName: string;
  memberName: string | null;
  address: string | null;
  mobile: string | null;
  fssai: string | null;
  gst: string | null;
  email: string | null;
};

const MEMBERS = roster as Member[];
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function telHref(mob: string | null) {
  if (!mob) return null;
  const digits = mob.replace(/\D/g, "");
  if (digits.length < 7) return null;
  return `tel:+${digits.length === 10 ? "91" + digits : digits}`;
}

function mailHref(email: string | null) {
  if (!email) return null;
  const e = email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return null;
  return `mailto:${e}`;
}

const DirectoryList = () => {
  const [q, setQ] = useState("");
  const [hasFilter, setHasFilter] = useState<"all" | "gst" | "fssai" | "email">("all");
  const [letter, setLetter] = useState<string>("all");
  const [sort, setSort] = useState<"name" | "sr">("name");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = MEMBERS.filter((m) => {
      if (letter !== "all") {
        const c = (m.companyName || "").trim().charAt(0).toUpperCase();
        if (c !== letter) return false;
      }
      if (hasFilter === "gst" && !m.gst) return false;
      if (hasFilter === "fssai" && !m.fssai) return false;
      if (hasFilter === "email" && !m.email) return false;
      if (!term) return true;
      const hay = [m.companyName, m.memberName, m.address, m.mobile, m.fssai, m.gst, m.email]
        .filter(Boolean).join(" ").toLowerCase();
      return hay.includes(term);
    });
    list = [...list].sort((a, b) => {
      if (sort === "sr") return (a.srNo ?? 9e9) - (b.srNo ?? 9e9);
      return a.companyName.localeCompare(b.companyName);
    });
    return list;
  }, [q, hasFilter, letter, sort]);

  return (
    <Layout>
      <Seo
        title="Member List — MDDMA"
        description="Full association member roster: company, contact person, address, and contact details."
        path="/directorylist"
        noindex
      />
      <PageHeader
        title="Association Member List"
        subtitle={`Searchable roster of all ${MEMBERS.length} association members with contact details.`}
      />

      <section className="border-b border-border bg-muted/30 py-5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search company, member, mobile, GST, FSSAI, email…"
                className="pl-10"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <Select value={hasFilter} onValueChange={(v) => setHasFilter(v as typeof hasFilter)}>
              <SelectTrigger className="w-full md:w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All members</SelectItem>
                <SelectItem value="gst">Has GST</SelectItem>
                <SelectItem value="fssai">Has FSSAI</SelectItem>
                <SelectItem value="email">Has Email</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
              <SelectTrigger className="w-full md:w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Sort: Company A→Z</SelectItem>
                <SelectItem value="sr">Sort: Sr. No.</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-1">
            <Button
              size="sm"
              variant={letter === "all" ? "default" : "outline"}
              className="h-7 px-2 text-xs"
              onClick={() => setLetter("all")}
            >
              All
            </Button>
            {ALPHABET.map((l) => (
              <Button
                key={l}
                size="sm"
                variant={letter === l ? "default" : "outline"}
                className="h-7 w-7 p-0 text-xs"
                onClick={() => setLetter(l)}
              >
                {l}
              </Button>
            ))}
          </div>

          <p className="mt-3 text-sm text-muted-foreground">
            Showing {filtered.length} of {MEMBERS.length} members
          </p>
        </div>
      </section>

      <section className="py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              No members match your search.
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50 sticky top-0">
                    <TableRow>
                      <TableHead className="w-14">#</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Contact Person</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>FSSAI</TableHead>
                      <TableHead>GST</TableHead>
                      <TableHead>Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((m, i) => {
                      const tel = telHref(m.mobile);
                      const mail = mailHref(m.email);
                      return (
                        <TableRow key={`${m.srNo ?? "x"}-${i}`}>
                          <TableCell className="text-muted-foreground">{m.srNo ?? ""}</TableCell>
                          <TableCell className="font-medium">{m.companyName}</TableCell>
                          <TableCell>{m.memberName ?? "—"}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{m.address ?? "—"}</TableCell>
                          <TableCell>
                            {tel ? <a href={tel} className="text-primary hover:underline">{m.mobile}</a> : "—"}
                          </TableCell>
                          <TableCell className="text-xs">{m.fssai ?? "—"}</TableCell>
                          <TableCell className="text-xs">{m.gst ?? "—"}</TableCell>
                          <TableCell className="text-xs">
                            {mail ? <a href={mail} className="text-primary hover:underline break-all">{m.email}</a> : "—"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-3">
                {filtered.map((m, i) => {
                  const tel = telHref(m.mobile);
                  const mail = mailHref(m.email);
                  return (
                    <Card key={`${m.srNo ?? "x"}-${i}`} className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-foreground truncate">{m.companyName}</h3>
                          {m.memberName && (
                            <p className="text-xs text-muted-foreground truncate">{m.memberName}</p>
                          )}
                        </div>
                        {m.srNo !== null && (
                          <Badge variant="outline" className="text-[10px] shrink-0">#{m.srNo}</Badge>
                        )}
                      </div>
                      {m.address && (
                        <div className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                          <span>{m.address}</span>
                        </div>
                      )}
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        {tel && (
                          <a href={tel} className="inline-flex items-center gap-1 text-primary">
                            <Phone className="h-3 w-3" /> {m.mobile}
                          </a>
                        )}
                        {mail && (
                          <a href={mail} className="inline-flex items-center gap-1 text-primary break-all">
                            <Mail className="h-3 w-3" /> {m.email}
                          </a>
                        )}
                      </div>
                      {(m.gst || m.fssai) && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {m.gst && <Badge variant="secondary" className="text-[10px]">GST {m.gst}</Badge>}
                          {m.fssai && <Badge variant="secondary" className="text-[10px]">FSSAI {m.fssai}</Badge>}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default DirectoryList;
