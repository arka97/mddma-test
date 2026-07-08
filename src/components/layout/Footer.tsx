import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Lock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";

const platformLinks = [
  { to: "/directory", label: "Member Directory" },
  { to: "/products", label: "Marketplace" },
  { to: "/brands", label: "Brands" },
  { to: "/market", label: "Community Feed" },
  { to: "/rfq", label: "RFQ Board" },
  { to: "/circulars", label: "Circulars" },
  { to: "/membership", label: "Membership" },
];

const learnLinks = [
  { to: "/about", label: "About MDDMA" },
  { to: "/apply", label: "Apply for Membership" },
  { to: "/contact", label: "Contact" },
  { to: "/install", label: "Install App" },
];

export function Footer() {
  const { isInstalled } = useInstallPrompt();
  return (
    <footer className="bg-primary text-primary-foreground pb-safe">
      <div className="container mx-auto px-5 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 inline-flex items-center gap-2">
              <Logo variant="mark" className="h-8 w-8" />
              <div className="leading-tight">
                <div className="font-semibold tracking-tight">G-BAU-G</div>
                <div className="text-[11px] text-primary-foreground/70">by MDDMA</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-primary-foreground/80">
              India's official trade network for dry fruits, dates and nuts — connecting verified importers, traders and brokers of the Mumbai Dry Fruits &amp; Dates Merchants Association since 1930.
            </p>
          </div>

          <div>
            <h3 className="t-eyebrow mb-4 text-primary-foreground/70">Platform</h3>
            <ul className="space-y-2 text-sm">
              {platformLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-primary-foreground/70 transition-colors hover:text-primary-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="t-eyebrow mb-4 text-primary-foreground/70">Association</h3>
            <ul className="space-y-2 text-sm">
              {learnLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-primary-foreground/70 transition-colors hover:text-primary-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" asChild>
                <Link to="/documents"><Lock className="mr-1.5 h-3.5 w-3.5" /> Documents</Link>
              </Button>
              {!isInstalled && (
                <Button variant="secondary" size="sm" asChild>
                  <Link to="/install"><Download className="mr-1.5 h-3.5 w-3.5" /> Install</Link>
                </Button>
              )}
            </div>
          </div>

          <div>
            <h3 className="t-eyebrow mb-4 text-primary-foreground/70">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-foreground/60" />
                <span className="text-primary-foreground/80">
                  C/o E-29, APMC Market-I, Phase-II, Sector-19, Masala Market, Navi Mumbai, Maharashtra 400705
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0 text-primary-foreground/60" />
                <a href="tel:+912227650827" className="text-primary-foreground/80 hover:text-primary-foreground">+91 22 2765 0827</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0 text-primary-foreground/60" />
                <a href="mailto:grievance@mddma.org" className="text-primary-foreground/80 hover:text-primary-foreground">grievance@mddma.org</a>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-foreground/60" />
                <div className="text-primary-foreground/80">
                  <div>Mon–Sat: 10 AM – 6 PM</div>
                  <div className="mt-0.5 text-xs text-primary-foreground/60">Closed Sundays &amp; market holidays</div>
                </div>
              </li>
            </ul>
            <p className="mt-3 text-[11px] text-primary-foreground/60">
              Grievance &amp; Data Protection Officer: Aditya Parmar
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15">
        <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-5 py-4 text-xs text-primary-foreground/60 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Mumbai Dry Fruits &amp; Dates Merchants Association. All rights reserved.</p>
          <p>G-BAU-G · Serving India's dry fruits trade since 1930</p>
        </div>
      </div>
    </footer>
  );
}
