import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Lock, Download } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <div className="mb-4 inline-block rounded-lg bg-primary-foreground/95 p-3">
              <Logo variant="stacked" className="h-24 w-auto" />
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              India&apos;s digital trade hub for dry fruits &amp; commodities — connecting verified traders, importers, and buyers since 1930.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-semibold mb-4 text-accent text-sm">Platform</h3>
            <ul className="space-y-2 text-sm">
              {[
                { to: "/directory", label: "Member Directory" },
                { to: "/products", label: "Commodity Marketplace" },
                { to: "/broker", label: "Broker Board" },
                { to: "/market", label: "Market Intelligence" },
                { to: "/dashboard", label: "Lead CRM" },
                { to: "/community", label: "Trade Community" },
                { to: "/membership", label: "Membership Plans" },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-primary-foreground/70 hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-accent text-sm">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-primary-foreground/70">MDDMA Office, Sector 19, APMC Market, Vashi, Navi Mumbai - 400705</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-accent flex-shrink-0" />
                <span className="text-primary-foreground/70">+91 22 2784 1234</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-accent flex-shrink-0" />
                <span className="text-primary-foreground/70">info@mddma.org</span>
              </li>
            </ul>
          </div>

          {/* Hours + Links */}
          <div>
            <h3 className="font-semibold mb-4 text-accent text-sm">Office Hours</h3>
            <div className="flex items-start gap-2 text-sm text-primary-foreground/70 mb-4">
              <Clock className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <div>Mon-Sat: 10AM - 6PM</div>
                <div className="text-xs mt-1">Closed Sundays &amp; Market Holidays</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <Link to="/documents" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 border border-accent/20 text-accent hover:bg-accent/20 transition-colors text-sm font-medium">
                <Lock className="h-4 w-4" /> Documents
              </Link>
              <Link to="/install" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 border border-accent/20 text-accent hover:bg-accent/20 transition-colors text-sm font-medium">
                <Download className="h-4 w-4" /> Install App
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/20">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-primary-foreground/50">
          <p>© {new Date().getFullYear()} Mumbai Dry Fruits &amp; Dates Merchants Association. All rights reserved.</p>
          <p>India&apos;s Digital Trade Hub · Serving Since 1930</p>
        </div>
      </div>
    </footer>
  );
}
