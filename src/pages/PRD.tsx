import { Link } from "react-router-dom";
import { PitchSection } from "@/components/pitch/PitchSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Printer, ChevronDown, CheckCircle2, ArrowRight,
  FileText, Users, ShoppingBag, BarChart3, Megaphone,
  Shield, Target, Gavel, TrendingUp, MessageSquare,
  UserCheck, Eye, Settings, Briefcase, Globe
} from "lucide-react";

const NAV_ITEMS = [
  { id: "cover", label: "Cover" },
  { id: "vision", label: "Vision" },
  { id: "personas", label: "Personas" },
  { id: "stories", label: "User Stories" },
  { id: "features", label: "Features" },
  { id: "marketplace", label: "Marketplace" },
  { id: "intelligence", label: "Intelligence" },
  { id: "community", label: "Community" },
  { id: "metrics", label: "Metrics" },
  { id: "roadmap", label: "Roadmap" },
];

const PRD = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur border-b border-primary-foreground/10 print:hidden">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-2">
          <span className="text-primary-foreground font-bold text-sm tracking-wide">MDDMA PRD</span>
          <div className="flex gap-1 overflow-x-auto">
            {NAV_ITEMS.map((item) => (
              <button key={item.id} onClick={() => scrollTo(item.id)} className="text-xs text-primary-foreground/70 hover:text-primary-foreground px-2 py-1 rounded transition-colors whitespace-nowrap">
                {item.label}
              </button>
            ))}
          </div>
          <Button size="sm" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" onClick={() => window.print()}>
            <Printer className="h-3 w-3 mr-1" /> PDF
          </Button>
        </div>
      </nav>

      {/* Cover */}
      <PitchSection id="cover" dark>
        <div className="text-center space-y-6">
          <Badge className="bg-accent text-primary font-semibold text-sm px-4 py-1">Product Requirements Document</Badge>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            MDDMA<br />
            <span className="gold-gradient-text">Product Requirements</span>
          </h1>
          <p className="text-xl sm:text-2xl text-primary-foreground/70 max-w-2xl mx-auto">
            User personas, stories, feature specifications, and success metrics for the MDDMA B2B Trade Platform
          </p>
          <div className="pt-4 text-sm text-primary-foreground/50 space-y-1">
            <p>Prepared for: Mumbai Dry Fruits & Dates Merchants Association</p>
            <p>Document Version: 2.0 · April 2026</p>
          </div>
          <div className="flex gap-2 justify-center pt-2 flex-wrap print:hidden">
            <Link to="/pitch"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">← Pitch</Badge></Link>
            <Link to="/sow"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">← SOW</Badge></Link>
            <Link to="/brd"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">← BRD</Badge></Link>
            <Link to="/fsd"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">FRD →</Badge></Link>
            <Link to="/sdd"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">SDD →</Badge></Link>
            <Link to="/tsd"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">TSD →</Badge></Link>
            <Link to="/mvp-canvas"><Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/70 hover:text-primary-foreground cursor-pointer">MVP Canvas →</Badge></Link>
          </div>
          <button onClick={() => scrollTo("vision")} className="mt-8 inline-flex items-center gap-1 text-accent hover:text-accent/80 transition-colors">
            <ChevronDown className="h-5 w-5 animate-bounce" />
          </button>
        </div>
      </PitchSection>

      {/* Product Vision */}
      <PitchSection id="vision">
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><Target className="h-3 w-3 mr-1" /> Product Vision</Badge>
            <h2 className="text-4xl font-bold text-primary">Vision & Strategy</h2>
          </div>
          <Card className="border-accent/30 bg-accent/5">
            <CardContent className="p-8 text-center space-y-4">
              <p className="text-xl font-semibold text-primary italic">
                "Build India's most trusted B2B digital trade hub for dry fruits & commodities — where verified traders discover suppliers, manage leads, and grow their business through a modern, data-driven platform."
              </p>
            </CardContent>
          </Card>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { icon: Globe, title: "Discoverability", desc: "Make 350+ verified member businesses findable online by domestic and international buyers through SEO and structured directories." },
              { icon: TrendingUp, title: "Revenue Generation", desc: "Create 4 digital revenue streams (membership, ads, leads, affiliate) targeting ₹42–85L annually within Year 1." },
              { icon: Users, title: "Community Building", desc: "Transform WhatsApp chaos into a structured knowledge network via community.mddma.com with categorized discussions." },
            ].map((item) => (
              <Card key={item.title}>
                <CardContent className="p-5 space-y-2">
                  <item.icon className="h-6 w-6 text-accent" />
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* User Personas */}
      <PitchSection id="personas" dark>
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><Users className="h-3 w-3 mr-1" /> User Personas</Badge>
            <h2 className="text-4xl font-bold">Who Uses The Platform?</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Eye, role: "Guest / Buyer", persona: "Rajesh, Wholesale Buyer from Delhi", goals: ["Find verified almond suppliers in Mumbai", "Compare prices across multiple sellers", "Send trade inquiries via WhatsApp"], pain: "Can't find verified MDDMA traders online" },
              { icon: UserCheck, role: "Free Member", persona: "Hasmukh, Small Wholesaler", goals: ["Create online storefront for his shop", "List products with prices", "Receive buyer inquiries"], pain: "No affordable way to get online visibility" },
              { icon: Shield, role: "Paid Member", persona: "Sanjay, Large Importer", goals: ["Hide prices, use RFQ mode", "Priority listing in directory", "Access expo lead databases"], pain: "Losing leads to competitors with better online presence" },
              { icon: Briefcase, role: "Broker", persona: "Firoz, Commission Agent", goals: ["Post supply offers and buyer requirements", "Connect suppliers with buyers", "Build reputation through verified profile"], pain: "WhatsApp broadcasts are inefficient for deal matching" },
              { icon: Settings, role: "Admin / Staff", persona: "Priya, MDDMA Office Manager", goals: ["Approve member applications", "Publish circulars to members", "Manage ads and track revenue"], pain: "Everything is manual, paper-based, and slow" },
            ].map((p) => (
              <Card key={p.role} className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                      <p.icon className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{p.role}</h3>
                      <p className="text-xs text-primary-foreground/50">{p.persona}</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {p.goals.map((g) => (
                      <div key={g} className="flex items-start gap-2 text-sm text-primary-foreground/70">
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent mt-0.5 flex-shrink-0" />{g}
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-primary-foreground/10">
                    <p className="text-xs text-primary-foreground/40">Pain point: {p.pain}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* User Stories */}
      <PitchSection id="stories">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><FileText className="h-3 w-3 mr-1" /> User Stories</Badge>
            <h2 className="text-4xl font-bold text-primary">Key User Stories</h2>
          </div>
          <div className="space-y-4">
            {[
              { id: "US-01", role: "Guest", story: "search the member directory by product and location", value: "find verified dry fruit suppliers in my city" },
              { id: "US-02", role: "Guest", story: "view a member's storefront with their product catalog", value: "evaluate if they are a good trading partner" },
              { id: "US-03", role: "Guest", story: "send a trade inquiry via WhatsApp with a pre-filled message", value: "quickly initiate a business conversation" },
              { id: "US-04", role: "Free Member", story: "create and manage my seller storefront with product listings", value: "buyers can find and contact me online" },
              { id: "US-05", role: "Free Member", story: "view and manage inquiries in my CRM dashboard", value: "track leads from initial contact to conversion" },
              { id: "US-06", role: "Paid Member", story: "hide my prices and show 'Request Quote' instead", value: "negotiate better deals without public price competition" },
              { id: "US-07", role: "Paid Member", story: "appear as a priority listing in the directory", value: "get more visibility and buyer inquiries" },
              { id: "US-08", role: "Buyer", story: "bid on products across multiple member storefronts", value: "get competitive pricing from verified suppliers" },
              { id: "US-09", role: "Broker", story: "post supply offers and buyer requirements", value: "match suppliers with buyers and earn commissions" },
              { id: "US-10", role: "Admin", story: "approve pending membership applications with verification", value: "maintain the quality and trust of the member directory" },
              { id: "US-11", role: "Admin", story: "publish circulars that reach all members instantly", value: "replace slow paper-based communication" },
              { id: "US-12", role: "Admin", story: "manage ad placements and track click performance", value: "generate advertising revenue for the association" },
            ].map((s) => (
              <div key={s.id} className="flex gap-3 items-start p-4 rounded-lg bg-muted/50 border border-border/50">
                <Badge variant="outline" className="text-xs font-mono shrink-0 mt-0.5">{s.id}</Badge>
                <div className="space-y-1">
                  <p className="text-sm text-foreground">
                    As a <strong className="text-accent">{s.role}</strong>, I want to <strong>{s.story}</strong>, so that <span className="text-muted-foreground">{s.value}</span>.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* Core Features */}
      <PitchSection id="features" dark>
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><Megaphone className="h-3 w-3 mr-1" /> Core Features</Badge>
            <h2 className="text-4xl font-bold">Feature Map</h2>
          </div>
          {/* Feature map visual */}
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { title: "Directory & Discovery", icon: Users, features: ["Searchable member directory", "Advanced filters (product, location, tier)", "Verified badges (GST, FSSAI)", "Featured & sponsored placements", "Member profile with contact actions", "Seller storefront with catalog"] },
              { title: "Marketplace & Trading", icon: ShoppingBag, features: ["25+ product categories", "Product variants & origin details", "Price display or RFQ mode", "Trade inquiry via WhatsApp", "Multi-seller product bidding", "Broker supply/demand board"] },
              { title: "Intelligence & CRM", icon: BarChart3, features: ["Lead CRM with pipeline stages", "Market intelligence dashboard", "Price trend charts (Recharts)", "Expo lead pack marketplace", "Supply-demand signals", "Community discussion feed"] },
            ].map((group) => (
              <Card key={group.title} className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <group.icon className="h-5 w-5 text-accent" />
                    </div>
                    <h3 className="font-semibold text-lg">{group.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {group.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-primary-foreground/70">
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent mt-0.5 flex-shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Role-Feature Matrix */}
          <Card className="bg-primary-foreground/5 border-primary-foreground/20 text-primary-foreground">
            <CardContent className="p-6">
              <h3 className="font-semibold text-accent mb-4">Role × Feature Access Matrix</h3>
              <div className="overflow-x-auto">
                <Table className="border border-primary-foreground/20">
                  <TableHeader>
                    <TableRow className="border-primary-foreground/20 hover:bg-transparent">
                      <TableHead className="text-primary-foreground/70">Feature</TableHead>
                      <TableHead className="text-primary-foreground/70 text-center">Guest</TableHead>
                      <TableHead className="text-primary-foreground/70 text-center">Free</TableHead>
                      <TableHead className="text-primary-foreground/70 text-center">Paid</TableHead>
                      <TableHead className="text-primary-foreground/70 text-center">Broker</TableHead>
                      <TableHead className="text-primary-foreground/70 text-center">Admin</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { feature: "Browse Directory", guest: "✓", free: "✓", paid: "✓", broker: "✓", admin: "✓" },
                      { feature: "View Products", guest: "✓", free: "✓", paid: "✓", broker: "✓", admin: "✓" },
                      { feature: "Seller Storefront", guest: "—", free: "✓", paid: "✓", broker: "—", admin: "✓" },
                      { feature: "Product Listings", guest: "—", free: "✓", paid: "✓", broker: "—", admin: "✓" },
                      { feature: "CRM Dashboard", guest: "—", free: "✓", paid: "✓+", broker: "✓", admin: "✓" },
                      { feature: "RFQ / Hide Price", guest: "—", free: "—", paid: "✓", broker: "—", admin: "✓" },
                      { feature: "Priority Listing", guest: "—", free: "—", paid: "✓", broker: "—", admin: "✓" },
                      { feature: "Broker Board", guest: "View", free: "View", paid: "View", broker: "✓ Post", admin: "✓" },
                      { feature: "Lead Packs", guest: "—", free: "Member ₹", paid: "Member ₹", broker: "Member ₹", admin: "✓" },
                      { feature: "Admin Panel", guest: "—", free: "—", paid: "—", broker: "—", admin: "✓" },
                    ].map((row) => (
                      <TableRow key={row.feature} className="border-primary-foreground/10 hover:bg-primary-foreground/5">
                        <TableCell className="font-medium text-primary-foreground text-sm">{row.feature}</TableCell>
                        <TableCell className="text-center text-primary-foreground/60 text-sm">{row.guest}</TableCell>
                        <TableCell className="text-center text-primary-foreground/60 text-sm">{row.free}</TableCell>
                        <TableCell className="text-center text-accent text-sm font-semibold">{row.paid}</TableCell>
                        <TableCell className="text-center text-primary-foreground/60 text-sm">{row.broker}</TableCell>
                        <TableCell className="text-center text-primary-foreground/60 text-sm">{row.admin}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </PitchSection>

      {/* Marketplace & Bidding */}
      <PitchSection id="marketplace">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><Gavel className="h-3 w-3 mr-1" /> Marketplace & Bidding</Badge>
            <h2 className="text-4xl font-bold text-primary">Trade & Bidding System</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-accent/30">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-accent" /> Commodity Marketplace
                </h3>
                <p className="text-sm text-muted-foreground">A filterable marketplace where sellers list commodities with price, MOQ, origin, and packaging details.</p>
                <div className="space-y-2">
                  {["Free members show prices openly", "Paid members can hide price → RFQ mode", "Each listing links to seller storefront", "Filter by commodity, origin, price range, MOQ", "Inquiry button opens WhatsApp with pre-filled message"].map((item) => (
                    <div key={item} className="flex gap-2 items-start text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />{item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="border-accent/30">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
                  <Gavel className="h-5 w-5 text-accent" /> Product Bidding
                </h3>
                <p className="text-sm text-muted-foreground">Buyers can bid on products across multiple member storefronts to get competitive pricing.</p>
                <div className="space-y-2">
                  {["Bid button on product listings & storefronts", "Bid form: quantity, target price, delivery timeline", "Bids visible to seller in CRM dashboard", "Seller can accept, counter, or decline", "Multi-category bidding from single buyer session"].map((item) => (
                    <div key={item} className="flex gap-2 items-start text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />{item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Broker Board */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-accent" /> Broker Marketplace
              </h3>
              <p className="text-sm text-muted-foreground">Commission agents post supply offers and buyer requirements. Two-tab layout for matching deals.</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium text-sm mb-2">Supply Offers Tab</h4>
                  <p className="text-xs text-muted-foreground">Commodity, quantity, price range, origin, broker contact</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium text-sm mb-2">Buyer Requirements Tab</h4>
                  <p className="text-xs text-muted-foreground">Commodity, quantity needed, target price, delivery location</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PitchSection>

      {/* Intelligence & Community */}
      <PitchSection id="intelligence" dark>
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><BarChart3 className="h-3 w-3 mr-1" /> Intelligence & Analytics</Badge>
            <h2 className="text-4xl font-bold">Market Intelligence</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-accent text-lg">Lead CRM Dashboard</h3>
                <p className="text-sm text-primary-foreground/70">Pipeline-style lead management with stages: New → Contacted → Negotiation → Converted</p>
                <div className="flex gap-2">
                  {["New", "Contacted", "Negotiation", "Converted"].map((stage, i) => (
                    <div key={stage} className="flex-1 text-center">
                      <div className={`h-2 rounded-full bg-accent/${30 + i * 20}`} />
                      <p className="text-[10px] text-primary-foreground/50 mt-1">{stage}</p>
                    </div>
                  ))}
                </div>
                <ul className="space-y-1.5 text-sm text-primary-foreground/70">
                  {["Inquiry table with buyer, product, quantity, status", "Status update dropdown for each lead", "Filter by date, product, status", "Export leads to CSV"].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-accent mt-0.5 flex-shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-accent text-lg">Market Intelligence</h3>
                <p className="text-sm text-primary-foreground/70">Real-time market data and trend analysis for informed trading decisions.</p>
                <div className="space-y-3">
                  <div className="p-3 rounded bg-primary-foreground/5">
                    <p className="text-xs text-accent font-semibold">Price Trends</p>
                    <div className="flex items-end gap-1 h-8 mt-2">
                      {[40, 55, 45, 60, 70, 65, 80, 75, 85].map((h, i) => (
                        <div key={i} className="flex-1 bg-accent/60 rounded-t" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                    <p className="text-[10px] text-primary-foreground/40 mt-1">Almond prices — 9 month trend</p>
                  </div>
                  {["Origin price comparison charts", "Supply-demand signal cards", "Industry insight summaries"].map((item) => (
                    <div key={item} className="flex items-start gap-2 text-sm text-primary-foreground/70">
                      <CheckCircle2 className="h-3.5 w-3.5 text-accent mt-0.5 flex-shrink-0" />{item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PitchSection>

      {/* Community */}
      <PitchSection id="community">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><MessageSquare className="h-3 w-3 mr-1" /> Trade Community</Badge>
            <h2 className="text-4xl font-bold text-primary">Community Platform</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Move WhatsApp chaos → structured knowledge network at community.mddma.com</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-accent/30">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-primary">Community Categories</h3>
                <p className="text-sm text-muted-foreground">Powered by Discourse at community.mddma.com</p>
                {["Market Intelligence — Price signals, import data, crop reports", "Industry News — Regulatory changes, FSSAI updates, APMC reforms", "Trade Discussions — Packaging trends, logistics, quality standards", "Association Updates — Committee decisions, events, elections", "Events — Expo schedules, trade fairs, member meetups", "Social Lounge — Celebrations, achievements, networking"].map((cat) => (
                  <div key={cat} className="flex gap-2 items-start text-sm text-muted-foreground">
                    <MessageSquare className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />{cat}
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="border-destructive/30">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-primary">Community Rules</h3>
                <p className="text-sm text-muted-foreground">Clear separation between community discussions and trade activity.</p>
                <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20 space-y-2">
                  <p className="text-sm font-medium text-destructive">❌ Not Allowed in Community</p>
                  <p className="text-sm text-muted-foreground">• No trade offers or buy requests</p>
                  <p className="text-sm text-muted-foreground">• No price negotiations or deal-making</p>
                </div>
                <div className="p-4 rounded-lg bg-accent/5 border border-accent/20 space-y-2">
                  <p className="text-sm font-medium text-accent">✓ Community is for</p>
                  <p className="text-sm text-muted-foreground">• Discussion, intelligence, and networking</p>
                  <p className="text-sm text-muted-foreground">• All trading happens on mddma.com marketplace</p>
                </div>
                <h4 className="font-medium text-sm pt-2">Website Integration</h4>
                <div className="space-y-1.5">
                  {["Homepage shows 'Latest Industry Conversations'", "Product pages show 'Discussions about this product'", "Connects structured data with community knowledge"].map((item) => (
                    <div key={item} className="flex gap-2 items-start text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />{item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PitchSection>

      {/* Success Metrics */}
      <PitchSection id="metrics" dark>
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><Target className="h-3 w-3 mr-1" /> Success Metrics</Badge>
            <h2 className="text-4xl font-bold">How We Measure Success</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { metric: "Member Profiles Online", target: "350+", period: "Within 3 months" },
              { metric: "Monthly Active Users", target: "1,000+", period: "By month 6" },
              { metric: "Trade Inquiries/Month", target: "200+", period: "By month 6" },
              { metric: "Bidding Transactions", target: "50+/month", period: "By month 9" },
              { metric: "Community Members", target: "500+", period: "By month 6" },
              { metric: "Total Digital Revenue", target: "₹42–85L", period: "Year 1" },
            ].map((item) => (
              <Card key={item.metric} className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground text-center">
                <CardContent className="p-5 space-y-2">
                  <p className="text-3xl font-bold text-accent">{item.target}</p>
                  <p className="font-medium text-sm">{item.metric}</p>
                  <p className="text-xs text-primary-foreground/50">{item.period}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* Product Roadmap */}
      <PitchSection id="roadmap">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><TrendingUp className="h-3 w-3 mr-1" /> Product Roadmap</Badge>
            <h2 className="text-4xl font-bold text-primary">Release Plan</h2>
          </div>
          <div className="space-y-6">
            {[
              { version: "v1.0 — MVP", timeline: "Month 1–4", features: ["Member directory & storefronts", "Commodity marketplace with inquiry", "Broker marketplace", "Basic CRM dashboard", "Admin panel", "Documentation suite"] },
              { version: "v1.5 — Engagement", timeline: "Month 5–6", features: ["Product bidding system", "Discourse community integration", "Market intelligence charts", "Lead intelligence portal", "Enhanced RBAC with Paid tier benefits"] },
              { version: "v2.0 — Revenue", timeline: "Month 7–9", features: ["Advertising platform with tracking", "Membership payment integration", "Advanced CRM with analytics", "Mobile-optimized PWA", "API for third-party integrations"] },
              { version: "v3.0 — Scale", timeline: "Month 10–12", features: ["Multi-language support (Hindi, Gujarati)", "Advanced analytics dashboard", "Automated lead scoring", "Bulk import/export tools", "White-label storefront themes"] },
            ].map((release) => (
              <Card key={release.version}>
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-semibold text-primary">{release.version}</h3>
                    <Badge variant="outline" className="text-xs">{release.timeline}</Badge>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {release.features.map((f) => (
                      <div key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent mt-0.5 flex-shrink-0" />{f}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center pt-6 space-y-4">
            <p className="text-muted-foreground text-sm">Related Documents</p>
            <div className="flex gap-3 justify-center flex-wrap print:hidden">
              <Link to="/pitch"><Button variant="outline">← Pitch</Button></Link>
              <Link to="/sow"><Button variant="outline">← SOW</Button></Link>
              <Link to="/brd"><Button variant="outline">← BRD</Button></Link>
              <Link to="/fsd"><Button variant="outline">FRD <ArrowRight className="h-3 w-3 ml-1" /></Button></Link>
              <Link to="/sdd"><Button variant="outline">SDD <ArrowRight className="h-3 w-3 ml-1" /></Button></Link>
              <Link to="/tsd"><Button variant="outline">TSD <ArrowRight className="h-3 w-3 ml-1" /></Button></Link>
              <Link to="/mvp-canvas"><Button variant="outline">MVP Canvas <ArrowRight className="h-3 w-3 ml-1" /></Button></Link>
            </div>
          </div>
        </div>
      </PitchSection>

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

export default PRD;
