import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Target,
  Eye,
  Compass,
  ShieldCheck,
  Scale,
  Landmark,
  LineChart,
  BadgeCheck,
  FileText,
  GraduationCap,
  Globe2,
  Users,
  UserPlus,
  BookOpen,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  Clock,
  Crown,
  ArrowRight,
} from "lucide-react";

const founderMembers = [
  "S. Jagit Singh",
  "Ishwardas Maganlal",
  "Jadavji C. Kothari",
  "Surendra Natwarlal",
  "Jugaldas Damodar Mody",
  "Haji Usman Haji Aziz",
  "Mansukhlal H. Sheth",
  "S. Harnam Singh",
  "Vallabhdas Ramji",
  "Tulsidas Pragji Khandhar",
  "Himatlal H. Khandhar",
];

const objectives = [
  { icon: BadgeCheck, title: "Verified Trader Network", desc: "A trusted directory of importers, traders and brokers vetted by the Association." },
  { icon: Scale, title: "Trade Dispute Resolution", desc: "Fair, fast arbitration between members to keep disputes out of public courts." },
  { icon: Landmark, title: "Government & APMC Liaison", desc: "Direct representation with APMC, FSSAI, Customs and policy bodies." },
  { icon: LineChart, title: "Market Intelligence", desc: "Demand trends, port arrivals and price-band signals shared with members." },
  { icon: ShieldCheck, title: "Quality & FSSAI Standards", desc: "Promoting compliance, hygiene and quality across the supply chain." },
  { icon: FileText, title: "Import Policy Advocacy", desc: "Member voice on duties, quotas and trade rules for dates & dry fruits." },
  { icon: GraduationCap, title: "Educational Seminars", desc: "Workshops on GST, taxation, export procedures and modern trade tools." },
  { icon: Globe2, title: "Trade Show Representation", desc: "Collective presence at domestic and international expos and buyer meets." },
  { icon: Users, title: "Networking & Brotherhood", desc: "Decades of trust-based relationships across Mumbai's mewa community." },
  { icon: UserPlus, title: "Women in Trade", desc: "Encouraging women entrepreneurs and professionals across the trade." },
  { icon: BookOpen, title: "Legal & Technical Guidance", desc: "Advisory access on contracts, compliance and dispute matters." },
  { icon: Briefcase, title: "Annual MDDMA Meet", desc: "Flagship gathering for members, buyers, importers and policy partners." },
];

const milestones = [
  { year: "1930", title: "Foundation", description: "Importers & traders dealing in dates and dry fruits from Muscat (Oman), Basra (Iraq), Iran and Afghanistan founded the Association in Bombay to protect trade interests and advise members on regulation." },
  { year: "1975", title: "Reconstruction", description: "The Association was reconstituted and renamed “The Bombay Kharek Bazar & Mewa Merchants Association”." },
  { year: "1990s", title: "APMC Shift to Vashi", description: "Per State Government notification, all agri-markets relocated from Masjid Bunder, Mumbai to APMC Market, Navi Mumbai — easing congestion in South Mumbai." },
  { year: "1998", title: "Renaming", description: "Renamed “The Bombay Dry Fruits & Dates Association” via Govt. Order No. NTC 1596/463(92), dated 4 May 1998." },
  { year: "2020s", title: "Digital Transformation", description: "Launch of MDDMA's digital trade hub — verified directory, controlled-transparency catalogue and structured RFQ engine." },
];

const officeBearers = [
  { name: "Shri Vijay Bhuta", role: "President" },
  { name: "Shri Chandan Mehta", role: "President" },
  { name: "Shri Girish Bhandary", role: "Hon. Gen. Secretary" },
  { name: "Shri Manesh Lund", role: "Hon. Jt. Secretary" },
  { name: "Shri Suresh Dama", role: "Hon. Treasurer" },
  { name: "Shri Rajendra Shah", role: "Hon. Jt. Treasurer" },
];

const committeeMembers = [
  "Shri Chandrashi Jesrani",
  "Shri Mukesh Dattani",
  "Shri Mahesh Jothawani",
  "Shri Arjan Khatri",
  "Shri Ramesh Soni",
  "Shri Jatin Ashar",
  "Shri Darshan Kapadia",
  "Shri Dilip Jain",
];

function initialsOf(name: string) {
  return name
    .replace(/^Shri\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

const About = () => {
  return (
    <Layout>
      <Seo
        title="About MDDMA — Mumbai Dry Fruits & Dates Association"
        description="MDDMA, founded 1930. History, leadership, committee members and contact details for the Mumbai Dryfruits & Dates Merchants Association."
        path="/about"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Mumbai Dryfruits & Dates Merchants Association",
          alternateName: "MDDMA",
          url: "https://mddma.org/about",
          telephone: "+91-22-27650827",
          email: "vijaybhuta@gmail.com",
          foundingDate: "1930",
          address: {
            "@type": "PostalAddress",
            streetAddress: "C/o E-29, APMC Market-I, Phase-II, Sector-19, Masala Market",
            addressLocality: "Navi Mumbai",
            postalCode: "400705",
            addressRegion: "MH",
            addressCountry: "IN",
          },
        }}
      />
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-muted/40 to-background py-12 sm:py-16">
        <div className="container mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="t-eyebrow mb-3 inline-flex items-center gap-2 text-accent">
            <Crown className="h-3.5 w-3.5" /> Established 1930 · Mumbai
          </div>
          <h1 className="t-h1 mb-3 text-foreground sm:t-display">About MDDMA</h1>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Mumbai Dryfruits & Dates Merchants Association — 95+ years representing importers, traders and brokers of dates, nuts and dry fruits across India.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {["95+ Years of Service", "APMC Vashi · Navi Mumbai", "Founded by 11 Pioneer Traders"].map((chip) => (
              <span key={chip} className="rounded-full border border-border bg-card px-3 py-1 text-xs text-foreground">
                {chip}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-5">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-accent" aria-hidden /> Our Story
              </h2>
              <p className="text-foreground/85 leading-relaxed">
                In <strong>1930</strong>, a small group of importers and traders of Bombay dealing in dry and wet dates and dry fruits — sourced from <strong>Muscat (Oman), Basra (Iraq), Iran and Afghanistan</strong> — gathered and founded the Association to protect the interests of the trade and to advise members on the various rules, regulations and laws of the Government of India.
              </p>
              <p className="text-foreground/85 leading-relaxed">
                In <strong>1975</strong>, the Association was reconstituted and renamed <em>“The Bombay Kharek Bazar & Mewa Merchants Association.”</em>
              </p>
              <p className="text-foreground/85 leading-relaxed">
                Subsequently, the Government of Maharashtra developed Navi Mumbai as a twin city, and per State Government notification all agri-markets were shifted from <strong>Masjid Bunder, Mumbai to APMC Market, Navi Mumbai</strong>, easing congestion and pollution in South Mumbai.
              </p>
              <p className="text-foreground/85 leading-relaxed">
                In <strong>1998</strong>, the Association was renamed <em>“The Bombay Dry Fruits & Dates Association”</em> per State Government Order No. <strong>NTC 1596/463(92), dated 4 May 1998</strong> — today known as <strong>MDDMA</strong>.
              </p>
            </div>

            <Card className="border-accent/40 bg-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="h-5 w-5 text-accent" aria-hidden />
                  <h3 className="font-semibold text-primary text-sm uppercase tracking-wide">Founder Members</h3>
                </div>
                <ol className="space-y-2 text-sm text-foreground/85">
                  {founderMembers.map((name, i) => (
                    <li key={name} className="flex items-start gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-accent text-xs font-bold flex-shrink-0">
                        {i + 1}
                      </span>
                      <span>{name}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Aim · Vision · Mission */}
      <section className="py-16 bg-muted/50 border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Target, label: "AIM", text: "Protect and advance the interests of Mumbai's dry fruits and dates trade community — built on trust, brotherhood and fair practice." },
              { icon: Eye, label: "VISION", text: "A structured, association-governed digital trade hub that preserves member margins and formalises India's mewa trade for the next generation." },
              { icon: Compass, label: "MISSION", text: "Verify members, govern fair trade, advise on regulations, and connect importers, traders and buyers across India through controlled transparency." },
            ].map(({ icon: Icon, label, text }) => (
              <Card key={label} className="bg-card border-border hover:border-accent/40 transition-colors">
                <CardContent className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-accent mb-4">
                    <Icon className="h-6 w-6" aria-hidden />
                  </div>
                  <h3 className="text-lg font-bold text-primary tracking-wider mb-2">{label}</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why MDDMA */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-3">Why MDDMA</h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Decades of collective strength — distilled into the services that protect and grow your trade.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {objectives.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-5 rounded-lg border border-border bg-card hover:border-accent/40 hover:shadow-sm transition">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent/15 text-accent mb-3">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="font-semibold text-primary text-sm mb-1">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-16 bg-muted/50 border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-10 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-accent" aria-hidden /> Our Journey
          </h2>
          <div className="space-y-6">
            {milestones.map((m, i) => (
              <div key={m.year} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-xs flex-shrink-0 ring-4 ring-accent/20">
                    {m.year}
                  </div>
                  {i < milestones.length - 1 && <div className="w-0.5 flex-1 bg-border mt-2" />}
                </div>
                <div className="pb-6 pt-1">
                  <h3 className="font-semibold text-primary text-lg">{m.title}</h3>
                  <p className="text-sm text-foreground/80 mt-1 leading-relaxed">{m.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Bearers */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-3 flex items-center justify-center gap-2">
              <Crown className="h-6 w-6 text-accent" aria-hidden /> Office Bearers
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              The current leadership of the Mumbai Dryfruits & Dates Merchants Association.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {officeBearers.map((p) => (
              <Card key={p.name + p.role} className="bg-card border-border hover:border-accent/40 transition-colors">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-accent font-bold text-lg ring-2 ring-accent/30 flex-shrink-0">
                    {initialsOf(p.name)}
                  </div>
                  <div>
                    <div className="font-semibold text-primary">{p.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{p.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Committee Members */}
      <section className="py-16 bg-muted/50 border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-3 flex items-center gap-2">
            <Users className="h-6 w-6 text-accent" aria-hidden /> Committee Members
          </h2>
          <p className="text-muted-foreground text-sm mb-8">Members serving on the MDDMA managing committee.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {committeeMembers.map((name) => (
              <div key={name} className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent text-xs font-bold flex-shrink-0">
                  {initialsOf(name)}
                </div>
                <span className="text-sm font-medium text-foreground">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-3">Contact MDDMA</h2>
              <p className="text-muted-foreground text-sm mb-6">
                Visit us at our APMC Market office or get in touch by phone or email.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
                  <MapPin className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" aria-hidden />
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Address</div>
                    <div className="text-sm text-foreground mt-1">
                      C/o E-29, APMC Market-I, Phase-II,<br />
                      Sector-19, Masala Market,<br />
                      Navi Mumbai – 400 705
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
                    <Phone className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" aria-hidden />
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Phone</div>
                      <a href="tel:+912227650827" className="text-sm text-foreground mt-1 hover:text-primary block">022-27650827</a>
                      <a href="tel:+912227666501" className="text-sm text-foreground hover:text-primary block">022-27666501</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
                    <Mail className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" aria-hidden />
                    <div className="min-w-0">
                      <div className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Email</div>
                      <a href="mailto:vijaybhuta@gmail.com" className="text-sm text-foreground mt-1 hover:text-primary block break-all">vijaybhuta@gmail.com</a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
                  <Clock className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" aria-hidden />
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">Office Hours</div>
                    <div className="text-sm text-foreground mt-1">Mon – Sat · 10:00 AM – 6:00 PM</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Closed Sundays & market holidays</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                <Button asChild>
                  <Link to="/apply">
                    Apply for Membership <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/directory">View Member Directory</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden border border-border bg-card min-h-[360px]">
              <iframe
                title="MDDMA — APMC Market, Navi Mumbai"
                src="https://www.google.com/maps?q=APMC+Market+Phase+II+Sector+19+Vashi+Navi+Mumbai&output=embed"
                className="w-full h-full min-h-[360px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
