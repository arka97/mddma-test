import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-primary font-bold">
                M
              </div>
              <div>
                <div className="font-bold">MDDMA</div>
                <div className="text-xs text-primary-foreground/70">Est. 1930</div>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Mumbai Dry Fruits & Dates Merchants Association has been serving
              the trade community for over 90 years, representing merchants
              across all major markets in Mumbai.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-accent">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-primary-foreground/80 hover:text-accent transition-colors"
                >
                  About MDDMA
                </Link>
              </li>
              <li>
                <Link
                  to="/directory"
                  className="text-primary-foreground/80 hover:text-accent transition-colors"
                >
                  Member Directory
                </Link>
              </li>
              <li>
                <Link
                  to="/circulars"
                  className="text-primary-foreground/80 hover:text-accent transition-colors"
                >
                  Circulars & Notices
                </Link>
              </li>
              <li>
                <Link
                  to="/apply"
                  className="text-primary-foreground/80 hover:text-accent transition-colors"
                >
                  Apply for Membership
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-primary-foreground/80 hover:text-accent transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4 text-accent">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-primary-foreground/80">
                  MDDMA Office, Sector 19,
                  <br />
                  APMC Market, Vashi,
                  <br />
                  Navi Mumbai - 400705
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-accent flex-shrink-0" />
                <span className="text-primary-foreground/80">+91 22 2784 1234</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-accent flex-shrink-0" />
                <span className="text-primary-foreground/80">info@mddma.org</span>
              </li>
            </ul>
          </div>

          {/* Office Hours */}
          <div>
            <h3 className="font-semibold mb-4 text-accent">Office Hours</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-accent flex-shrink-0" />
                <div>
                  <div>Monday - Saturday</div>
                  <div>10:00 AM - 6:00 PM</div>
                </div>
              </li>
              <li className="mt-4 text-xs">
                Closed on Sundays and Market Holidays
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/20">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-primary-foreground/60">
            <p>
              © {new Date().getFullYear()} Mumbai Dry Fruits & Dates Merchants
              Association. All rights reserved.
            </p>
            <p>Serving Mumbai's Trade Since 1930</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
