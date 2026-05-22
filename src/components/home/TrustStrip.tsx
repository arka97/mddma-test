import { ShieldCheck, Award, Users, CalendarCheck } from "lucide-react";

/**
 * Hims-style trust band: small stats + verification signals.
 * Single row scroll on mobile, evenly spaced on md+.
 */
const stats = [
  { icon: Users, label: "Verified members", value: "1,200+" },
  { icon: ShieldCheck, label: "GST verified", value: "100%" },
  { icon: CalendarCheck, label: "Since", value: "1930" },
  { icon: Award, label: "Trade volume", value: "₹2,400 Cr+" },
];

export function TrustStrip() {
  return (
    <section className="border-y border-border bg-surface-cream py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map(({ icon: Icon, label, value }) => (
            <li
              key={label}
              className="flex items-center gap-3 rounded-2xl bg-card/60 p-3 md:flex-col md:items-center md:bg-transparent md:p-0 md:text-center"
            >
              <Icon className="h-5 w-5 shrink-0 text-accent" />
              <div className="min-w-0">
                <div className="text-lg font-semibold text-foreground md:text-2xl">{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
