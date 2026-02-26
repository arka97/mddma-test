import { Link } from "react-router-dom";
import { PitchSection } from "@/components/pitch/PitchSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Users, ShoppingBag, BarChart3, Megaphone, Settings,
  AlertTriangle, TrendingUp, Clock, Phone, Printer,
  ChevronDown, CheckCircle2, ArrowRight, Globe, Shield
} from "lucide-react";
import { membershipTiers } from "@/data/sampleData";

const NAV_ITEMS = [
  { id: "cover", label: "Cover" },
  { id: "problem", label: "Problem" },
  { id: "solution", label: "Solution" },
  { id: "features", label: "Features" },
  { id: "revenue", label: "Revenue" },
  { id: "why-now", label: "Why Now" },
  { id: "timeline", label: "Timeline" },
  { id: "roi", label: "ROI" },
  { id: "cta", label: "Next Steps" },
];

const SalesPitch = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Sticky nav - hidden in print */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur border-b border-primary-foreground/10 print:hidden">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-2">
          <span className="text-primary-foreground font-bold text-sm tracking-wide">MDDMA Pitch</span>
          <div className="flex gap-1 overflow-x-auto">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-xs text-primary-foreground/70 hover:text-primary-foreground px-2 py-1 rounded transition-colors whitespace-nowrap"
              >
                {item.label}
              </button>
            ))}
          </div>
          <Button size="sm" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 print:hidden" onClick={() => window.print()}>
            <Printer className="h-3 w-3 mr-1" /> PDF
          </Button>
        </div>
      </nav>

      {/* 1 — Cover */}
      <PitchSection id="cover" dark>
        <div className="text-center space-y-6">
          <Badge className="bg-accent text-primary font-semibold text-sm px-4 py-1">Digital Transformation Proposal</Badge>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            MDDMA<br />
            <span className="gold-gradient-text">Digital Platform</span>
          </h1>
          <p className="text-xl sm:text-2xl text-primary-foreground/70 max-w-2xl mx-auto">
            A modern, verified trade network for Mumbai's dry fruits & dates industry
          </p>
          <div className="pt-4 text-sm text-primary-foreground/50 space-y-1">
            <p>Prepared for: Mumbai Dry Fruits & Dates Merchants Association</p>
            <p>February 2026 · v1.0</p>
          </div>
          <button onClick={() => scrollTo("problem")} className="mt-8 inline-flex items-center gap-1 text-accent hover:text-accent/80 transition-colors">
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </button>
        </div>
      </PitchSection>

      {/* 2 — The Problem */}
      <PitchSection id="problem">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge variant="destructive" className="text-sm"><AlertTriangle className="h-3 w-3 mr-1" /> The Problem</Badge>
            <h2 className="text-4xl font-bold text-primary">The Current State</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">MDDMA's digital presence is stuck in the past, costing the association credibility, revenue, and member engagement.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Globe, title: "Outdated Website", desc: "Flash-based site is non-functional on modern browsers — members and buyers see a broken page." },
              { icon: Users, title: "Invisible Members", desc: "No searchable directory means 350+ member businesses can't be found online by potential buyers." },
              { icon: Clock, title: "Manual Workflows", desc: "Membership applications, renewals, and circular distribution are entirely paper-based." },
              { icon: TrendingUp, title: "Zero Digital Revenue", desc: "No advertising platform, no lead intelligence, no digital revenue streams." },
              { icon: Shield, title: "Credibility Gap", desc: "Younger traders and international partners expect a professional online presence." },
              { icon: BarChart3, title: "No Data Insights", desc: "Committee has no analytics on member activity, market interest, or engagement." },
            ].map((item) => (
              <Card key={item.title} className="border-destructive/20 bg-destructive/5">
                <CardContent className="p-5 space-y-2">
                  <item.icon className="h-6 w-6 text-destructive" />
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* 3 — The Solution */}
      <PitchSection id="solution" dark>
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm">The Solution</Badge>
            <h2 className="text-4xl font-bold">Five Core Modules</h2>
            <p className="text-primary-foreground/70 max-w-xl mx-auto">A comprehensive digital platform built specifically for MDDMA's needs.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Users, title: "Verified Member Directory", desc: "Searchable, filterable directory with verification badges, contact details, and company profiles.", link: "/directory" },
              { icon: ShoppingBag, title: "Product Discovery Catalog", desc: "25+ product pages with variants, packaging info, verified sellers, and affiliate retail links.", link: "/products" },
              { icon: BarChart3, title: "Lead Intelligence Portal", desc: "Curated expo exhibitor databases from Gulfood, SIAL, Anuga, and more.", link: "/leads" },
              { icon: Megaphone, title: "Advertising Platform", desc: "Homepage banners, directory placements, and sponsored member listings for revenue generation.", link: "/" },
              { icon: Settings, title: "Admin Dashboard", desc: "Manage members, products, ads, and lead packs — designed for office staff.", link: "/admin" },
            ].map((item) => (
              <Card key={item.title} className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                <CardContent className="p-6 space-y-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-sm text-primary-foreground/70">{item.desc}</p>
                  <Link to={item.link} className="inline-flex items-center gap-1 text-accent text-sm font-medium hover:underline print:hidden">
                    View Demo <ArrowRight className="h-3 w-3" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* 4 — Key Features */}
      <PitchSection id="features">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="text-sm">Key Features</Badge>
            <h2 className="text-4xl font-bold text-primary">What Members & Buyers Get</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-primary">For Members</h3>
              {["Verified company profile with logo & badges", "Product tags for discoverability", "Contact buttons: Call, WhatsApp, Email", "GST & FSSAI certification display", "Featured/Sponsored placement options", "Access to expo lead intelligence packs"].map((f) => (
                <div key={f} className="flex gap-2 items-start">
                  <CheckCircle2 className="h-4 w-4 text-accent mt-1 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{f}</span>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-primary">For Buyers & Trade Partners</h3>
              {["Search by product, origin, or member type", "Filter by verification status", "Direct contact with verified traders", "Product catalog with variant details", "Packaging format information", "Affiliate retail purchase links"].map((f) => (
                <div key={f} className="flex gap-2 items-start">
                  <CheckCircle2 className="h-4 w-4 text-accent mt-1 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PitchSection>

      {/* 5 — Revenue Model */}
      <PitchSection id="revenue" dark>
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><TrendingUp className="h-3 w-3 mr-1" /> Revenue Model</Badge>
            <h2 className="text-4xl font-bold">Four Revenue Streams</h2>
          </div>
          <Table className="border border-primary-foreground/20 rounded-lg overflow-hidden">
            <TableHeader>
              <TableRow className="border-primary-foreground/20 hover:bg-transparent">
                <TableHead className="text-primary-foreground/70">Stream</TableHead>
                <TableHead className="text-primary-foreground/70">Description</TableHead>
                <TableHead className="text-primary-foreground/70 text-right">Est. Annual</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { stream: "Membership Fees", desc: "Silver ₹5K / Gold ₹15K / Platinum ₹30K — 350+ members", est: "₹25–50L" },
                { stream: "Advertising", desc: "Homepage banners, directory placements, sponsored listings", est: "₹10–20L" },
                { stream: "Lead Intelligence", desc: "Expo database packs sold to members & non-members", est: "₹5–10L" },
                { stream: "Affiliate Commission", desc: "Retail links to Amazon, Flipkart, BigBasket", est: "₹2–5L" },
              ].map((row) => (
                <TableRow key={row.stream} className="border-primary-foreground/10 hover:bg-primary-foreground/5">
                  <TableCell className="font-medium text-primary-foreground">{row.stream}</TableCell>
                  <TableCell className="text-primary-foreground/70 text-sm">{row.desc}</TableCell>
                  <TableCell className="text-right text-accent font-semibold">{row.est}</TableCell>
                </TableRow>
              ))}
              <TableRow className="border-primary-foreground/20 bg-primary-foreground/10 hover:bg-primary-foreground/10">
                <TableCell className="font-bold text-primary-foreground">Total Potential</TableCell>
                <TableCell />
                <TableCell className="text-right text-accent font-bold text-lg">₹42–85L/yr</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="grid sm:grid-cols-3 gap-4 pt-4">
            {membershipTiers.map((tier) => (
              <Card key={tier.name} className={`bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground ${tier.highlighted ? "ring-2 ring-accent" : ""}`}>
                <CardContent className="p-5 text-center space-y-2">
                  <h4 className="font-semibold">{tier.name}</h4>
                  <p className="text-2xl font-bold text-accent">{tier.price}</p>
                  <p className="text-xs text-primary-foreground/50">per {tier.period}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* 6 — Why Now */}
      <PitchSection id="why-now">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="text-sm">Why Now</Badge>
            <h2 className="text-4xl font-bold text-primary">The Time Is Now</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { emoji: "🏛️", title: "95-Year Legacy at Risk", desc: "Without a digital presence, MDDMA's historic credibility fades for the next generation of traders." },
              { emoji: "⚡", title: "Competitors Are Digitizing", desc: "Other trade associations are launching directories and member portals — MDDMA must keep pace." },
              { emoji: "📱", title: "Members Expect Online Access", desc: "Younger traders and new members expect to find information, apply, and connect online." },
              { emoji: "🏛️", title: "Government Push", desc: "GST, FSSAI, and APMC reforms are driving digital compliance — MDDMA can lead the transition." },
            ].map((item) => (
              <Card key={item.title} className="border-accent/20">
                <CardContent className="p-6 space-y-2">
                  <span className="text-3xl">{item.emoji}</span>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* 7 — Implementation Timeline */}
      <PitchSection id="timeline" dark>
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><Clock className="h-3 w-3 mr-1" /> Timeline</Badge>
            <h2 className="text-4xl font-bold">3-Phase Rollout</h2>
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-accent/30" />
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { phase: "Phase 1", period: "Month 1–2", title: "Foundation", items: ["Public website launch", "Member directory (read-only)", "Product catalog", "Contact & application forms"] },
                { phase: "Phase 2", period: "Month 2–3", title: "Membership System", items: ["Online membership applications", "Payment integration", "Member login & profile management", "Circular distribution system"] },
                { phase: "Phase 3", period: "Month 3–4", title: "Revenue & Intelligence", items: ["Admin dashboard", "Lead intelligence portal", "Advertising system", "Analytics & reporting"] },
              ].map((p, i) => (
                <div key={p.phase} className="relative text-center md:text-left">
                  <div className="hidden md:flex absolute -top-[1.35rem] left-1/2 md:left-0 h-5 w-5 rounded-full bg-accent border-4 border-primary items-center justify-center" />
                  <Card className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground mt-4">
                    <CardContent className="p-5 space-y-3">
                      <Badge className="bg-accent/20 text-accent border-0">{p.phase} · {p.period}</Badge>
                      <h3 className="font-semibold text-lg">{p.title}</h3>
                      <ul className="space-y-1.5">
                        {p.items.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-primary-foreground/70">
                            <CheckCircle2 className="h-3.5 w-3.5 text-accent mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PitchSection>

      {/* 8 — Investment & ROI */}
      <PitchSection id="roi">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="text-sm">Investment & ROI</Badge>
            <h2 className="text-4xl font-bold text-primary">Returns That Justify the Investment</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: "Platform Development", value: "₹40-60k", sub: "One-time" },
              { label: "Annual Hosting & Maintenance", value: "<₹30k", sub: "Per year" },
              { label: "Projected Year 1 Revenue", value: "₹42–85L", sub: "From 4 streams" },
              { label: "Break-Even", value: "2–3 Months", sub: "After launch" },
            ].map((item) => (
              <Card key={item.label} className="text-center">
                <CardContent className="p-6 space-y-1">
                  <p className="text-3xl font-bold text-accent">{item.value}</p>
                  <p className="font-medium text-foreground text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="bg-accent/5 border-accent/20">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-3">Growth Projections</h3>
              <div className="grid sm:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">350+</p>
                  <p className="text-sm text-muted-foreground">Current Members</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">500+</p>
                  <p className="text-sm text-muted-foreground">Year 1 Target</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">750+</p>
                  <p className="text-sm text-muted-foreground">Year 2 Target</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PitchSection>

      {/* 9 — Call to Action */}
      <PitchSection id="cta" dark>
        <div className="text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl font-bold">
            Let's Build This<br />
            <span className="gold-gradient-text">Together</span>
          </h2>
          <p className="text-xl text-primary-foreground/70 max-w-xl mx-auto">
            MDDMA has the legacy, the membership, and the market position. This platform gives it the digital presence to match.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center print:hidden">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-primary font-semibold text-lg px-8">
              <Phone className="h-5 w-5 mr-2" /> Schedule a Discussion
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" onClick={() => window.print()}>
              <Printer className="h-5 w-5 mr-2" /> Export as PDF
            </Button>
          </div>
          <div className="pt-8 text-sm text-primary-foreground/40 space-y-1">
            <p>For questions or a live demo walkthrough, contact:</p>
            <p className="text-primary-foreground/60 font-medium">info@mddma.org · +91 22 2781 XXXX</p>
          </div>
        </div>
      </PitchSection>

      {/* Print styles */}
      <style>{`
        @media print {
          nav, .print\\:hidden { display: none !important; }
          section { page-break-inside: avoid; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
};

export default SalesPitch;
