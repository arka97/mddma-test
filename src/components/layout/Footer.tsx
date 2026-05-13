import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Lock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";

const platformLinks = [
  { to: "/directory", label: "Member Directory" },
  { to: "/products", label: "Commodity Marketplace" },
  { to: "/broker", label: "Broker Board" },
  { to: "/market", label: "Market Intelligence" },
  { to: "/dashboard", label: "Lead CRM" },
  { to: "/community", label: "Trade Community" },
  { to: "/membership", label: "Membership Plans" },
];

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pb-safe">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 inline-flex items-center gap-2">
              <Logo variant="mark" className="h-8 w-8" />
              <span className="font-semibold tracking-tight">MDDMA</span>
            </div>
            <p className="text-sm leading-relaxed text-primary-foreground/80">
              India's digital trade hub for dry fruits & commodities — connecting verified traders, importers, and buyers since 1930.
            </p>
          </div>

          <div>
            <h3 className="t-eyebrow mb-4 text-primary-foreground/70">Platform</h3>
            <ul className="space-y-2 text-sm">
              {platformLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-primary-foreground/70 transition-colors hover:text-primary-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="t-eyebrow mb-4 text-primary-foreground/70">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-foreground/60" />
                <span className="text-primary-foreground/80">
                  MDDMA Office, Sector 19, APMC Market, Vashi, Navi Mumbai - 400705
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0 text-primary-foreground/60" />
                <span className="text-primary-foreground/80">+91 22 2784 1234</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0 text-primary-foreground/60" />
                <span className="text-primary-foreground/80">info@mddma.org</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="t-eyebrow mb-4 text-primary-foreground/70">Office Hours</h3>
            <div className="mb-4 flex items-start gap-2 text-sm text-primary-foreground/80">
              <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-foreground/60" />
              <div>
                <div>Mon-Sat: 10AM - 6PM</div>
                <div className="mt-1 text-xs text-primary-foreground/60">Closed Sundays & Market Holidays</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" asChild>
                <Link to="/documents">
                  <Lock className="mr-1.5 h-3.5 w-3.5" /> Documents
                </Link>
              </Button>
              <Button variant="secondary" size="sm" asChild>
                <Link to="/install">
                  <Download className="mr-1.5 h-3.5 w-3.5" /> Install App
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15">
        <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-primary-foreground/60 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Mumbai Dry Fruits & Dates Merchants Association. All rights reserved.</p>
          <p>India's Digital Trade Hub · Serving Since 1930</p>
        </div>
      </div>
    </footer>
  );
}
