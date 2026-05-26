import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Partner {
  id: string;
  title: string;
  link_url: string | null;
}

export function PartnersStrip() {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    let alive = true;
    const today = new Date().toISOString().slice(0, 10);
    supabase
      .from("advertisements")
      .select("id,title,link_url,end_date")
      .eq("is_active", true)
      .lte("start_date", today)
      .then(({ data }) => {
        if (!alive) return;
        const filtered = (data ?? []).filter(
          (a: { end_date: string | null }) => !a.end_date || a.end_date >= today,
        );
        setPartners(filtered.slice(0, 8) as Partner[]);
      });
    return () => { alive = false; };
  }, []);

  if (partners.length === 0) return null;

  return (
    <section className="rounded-2xl border border-border bg-card p-4">
      <p className="t-eyebrow mb-3 text-muted-foreground">Our partners</p>
      <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-1">
        {partners.map((p) => (
          <a
            key={p.id}
            href={p.link_url ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 whitespace-nowrap text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {p.title}
          </a>
        ))}
      </div>
    </section>
  );
}
