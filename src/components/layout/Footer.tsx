import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-primary font-bold text-sm">M</div>
              <div>
                <div className="font-bold text-sm">MDDMA</div>
                <div className="text-[10px] text-primary-foreground/60">Est. 1930s</div>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Mumbai's trusted dry fruits trade association — connecting verified traders, importers, and buyers since the 1930s.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-accent text-sm">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { to: "/directory", label: "Member Directory" },
                { to: "/products", label: "Products Catalog" },
                { to: "/leads", label: "Expo Lead Intelligence" },
                { to: "/membership", label: "Membership Plans" },
                { to: "/circulars", label: "Circulars & Notices" },
                { to: "/forms", label: "Contact & Forms" },
                { to: "/admin", label: "Admin Panel" },
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

          {/* Hours + Social */}
          <div>
            <h3 className="font-semibold mb-4 text-accent text-sm">Office Hours</h3>
            <div className="flex items-start gap-2 text-sm text-primary-foreground/70">
              <Clock className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <div>Mon-Sat: 10AM - 6PM</div>
                <div className="text-xs mt-1">Closed Sundays & Market Holidays</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/20">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-primary-foreground/50">
          <p>© {new Date().getFullYear()} Mumbai Dry Fruits & Dates Merchants Association. All rights reserved.</p>
          <p>Serving Mumbai's Trade Since 1930s</p>
        </div>
      </div>
    </footer>
  );
}
