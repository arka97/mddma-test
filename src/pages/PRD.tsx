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
  UserCheck, Eye, Settings, Briefcase, Globe, Brain, Lock, Zap
} from "lucide-react";

const NAV_ITEMS = [
  { id: "cover", label: "Cover" },
  { id: "vision", label: "Vision" },
  { id: "personas", label: "Personas" },
  { id: "stories", label: "User Stories" },
  { id: "features", label: "Features" },
  { id: "behavioral", label: "Behavioral UX" },
  { id: "marketplace", label: "Marketplace" },
  { id: "intelligence", label: "Intelligence" },
  { id: "principles", label: "Principles" },
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
            Behavioral trade operating system — controlled negotiation marketplace with strategic UX design
          </p>
          <div className="pt-4 text-sm text-primary-foreground/50 space-y-1">
            <p>Prepared for: Mumbai Dry Fruits & Dates Merchants Association</p>
            <p>Document Version: 3.0 · April 2026</p>
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
                "Build a controlled negotiation marketplace that protects sellers, empowers buyers, and shifts market power from brokers to the platform — backed by MDDMA's 95-year legacy."
              </p>
            </CardContent>
          </Card>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { icon: Lock, title: "Controlled Transparency", desc: "Show signals (price ranges, stock bands, trends) — never exact data. Protect seller margins through information design." },
              { icon: Gavel, title: "Negotiation-First", desc: "Replace open pricing with RFQ-based private negotiation. Every product leads to 'Request Best Price', not 'Add to Cart'." },
              { icon: Brain, title: "Behavioral Intelligence", desc: "Anchoring, loss aversion, social proof, and variable rewards guide user actions toward platform-optimal outcomes." },
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
              { icon: Eye, role: "Guest / Buyer", persona: "Rajesh, Wholesale Buyer from Delhi", goals: ["Find verified almond suppliers in Mumbai", "Compare market signals across sellers", "Send RFQ to multiple suppliers at once"], pain: "Can't find verified traders, forced to use brokers for price discovery" },
              { icon: UserCheck, role: "Free Member", persona: "Hasmukh, Small Wholesaler", goals: ["Create online storefront", "List products with price ranges", "Receive buyer RFQs"], pain: "No affordable way to get online visibility" },
              { icon: Shield, role: "Paid Member", persona: "Sanjay, Large Importer", goals: ["Full price masking via RFQ mode", "Priority listing in directory", "Access market intelligence"], pain: "Competitors undercutting on public price platforms" },
              { icon: Briefcase, role: "Broker", persona: "Firoz, Commission Agent", goals: ["Post supply offers and buyer needs", "Facilitate deals through platform", "Build reputation"], pain: "Platform may reduce dependency on brokers — needs clear value prop" },
              { icon: Settings, role: "Admin / Staff", persona: "Priya, MDDMA Office Manager", goals: ["Approve member applications", "Monitor RFQ activity", "Manage market signals"], pain: "Everything is manual, paper-based, and slow" },
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
                    <p className="text-xs text-primary-foreground/40">Pain: {p.pain}</p>
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
              { id: "US-01", role: "Guest", story: "search the directory by product and location", value: "find verified suppliers in my city", priority: "P0" },
              { id: "US-02", role: "Guest", story: "view market signals (price range, stock band, trend)", value: "gauge the market without needing a broker", priority: "P0" },
              { id: "US-03", role: "Guest", story: "send an RFQ to multiple sellers simultaneously", value: "get competitive private quotes efficiently", priority: "P0" },
              { id: "US-04", role: "Free Member", story: "create a storefront with price ranges", value: "buyers find me without seeing exact pricing", priority: "P0" },
              { id: "US-05", role: "Free Member", story: "view incoming RFQs in my CRM dashboard", value: "track and respond to buyer inquiries", priority: "P0" },
              { id: "US-06", role: "Paid Member", story: "fully hide prices and show only 'Request Best Price'", value: "protect my margins from public competition", priority: "P1" },
              { id: "US-07", role: "Paid Member", story: "see market intelligence signals and demand indicators", value: "make informed decisions without broker dependency", priority: "P1" },
              { id: "US-08", role: "Buyer", story: "compare multiple sellers by market signals (not price)", value: "choose based on trust, stock, and trends", priority: "P0" },
              { id: "US-09", role: "Broker", story: "post supply offers and buyer requirements", value: "facilitate deals as optional intermediary", priority: "P1" },
              { id: "US-10", role: "Admin", story: "monitor RFQ flow and platform engagement", value: "understand platform effectiveness", priority: "P1" },
              { id: "US-13", role: "Seller", story: "hide exact prices and respond privately to inquiries", value: "protect margins while engaging buyers", priority: "P0" },
              { id: "US-14", role: "Buyer", story: "compare multiple sellers without seeing exact prices", value: "negotiate better deals based on signals", priority: "P0" },
              { id: "US-15", role: "Member", story: "see market trends and signals without relying on brokers", value: "make informed decisions independently", priority: "P1" },
            ].map((s) => (
              <div key={s.id} className="flex gap-3 items-start p-4 rounded-lg bg-muted/50 border border-border/50">
                <Badge variant="outline" className="text-xs font-mono shrink-0 mt-0.5">{s.id}</Badge>
                <div className="space-y-1 flex-1">
                  <p className="text-sm text-foreground">
                    As a <strong className="text-accent">{s.role}</strong>, I want to <strong>{s.story}</strong>, so that <span className="text-muted-foreground">{s.value}</span>.
                  </p>
                </div>
                <Badge className={`text-xs ${s.priority === "P0" ? "bg-destructive text-destructive-foreground" : "bg-accent/20 text-accent"}`}>{s.priority}</Badge>
              </div>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* Smart Product Listing Feature */}
      <PitchSection id="features" dark>
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><ShoppingBag className="h-3 w-3 mr-1" /> Smart Product Listing</Badge>
            <h2 className="text-4xl font-bold">What Each Product Displays</h2>
          </div>
          <Card className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-accent">Product Card Elements</h3>
                  {[
                    { label: "Stock Status", desc: "Band-based: High / Medium / Low / On Order" },
                    { label: "Price Range", desc: "Min–Max range, never exact price" },
                    { label: "Market Reference", desc: "Industry benchmark price for anchoring" },
                    { label: "Demand Indicator", desc: "Inquiry volume signals (Hot / Active / Normal)" },
                    { label: "Trend Direction", desc: "Price trend arrow: ↑ Rising / ↓ Falling / → Stable" },
                    { label: "CTA Button", desc: "'Request Best Price' — opens multi-step RFQ form" },
                  ].map((item) => (
                    <div key={item.label} className="flex gap-3 items-start">
                      <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-primary-foreground">{item.label}</p>
                        <p className="text-xs text-primary-foreground/60">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-accent">Role × Feature Matrix</h3>
                  <Table className="border border-primary-foreground/20">
                    <TableHeader>
                      <TableRow className="border-primary-foreground/20 hover:bg-transparent">
                        <TableHead className="text-primary-foreground/70">Feature</TableHead>
                        <TableHead className="text-primary-foreground/70 text-center">Guest</TableHead>
                        <TableHead className="text-primary-foreground/70 text-center">Free</TableHead>
                        <TableHead className="text-primary-foreground/70 text-center">Paid</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { f: "Price Range", g: "✓", fr: "✓", p: "Hidden" },
                        { f: "Stock Band", g: "✓", fr: "✓", p: "✓" },
                        { f: "Market Reference", g: "✓", fr: "✓", p: "✓" },
                        { f: "Demand Signal", g: "—", fr: "✓", p: "✓" },
                        { f: "Trend Direction", g: "—", fr: "✓", p: "✓" },
                        { f: "RFQ Button", g: "✓", fr: "✓", p: "Only RFQ" },
                      ].map((r) => (
                        <TableRow key={r.f} className="border-primary-foreground/10">
                          <TableCell className="text-sm text-primary-foreground">{r.f}</TableCell>
                          <TableCell className="text-center text-primary-foreground/60 text-sm">{r.g}</TableCell>
                          <TableCell className="text-center text-primary-foreground/60 text-sm">{r.fr}</TableCell>
                          <TableCell className="text-center text-accent text-sm font-semibold">{r.p}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PitchSection>

      {/* Behavioral UX Layer — NEW */}
      <PitchSection id="behavioral">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><Brain className="h-3 w-3 mr-1" /> Behavioral UX Layer</Badge>
            <h2 className="text-4xl font-bold text-primary">Psychology-Driven Design</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Every interaction is designed to guide users toward platform-optimal outcomes.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: "Anchoring", desc: "Market reference price displayed alongside price range. Buyer perceives value relative to industry benchmark.", icon: Target, example: "Market Avg: ₹850/kg → Seller Range: ₹780–920/kg" },
              { title: "Loss Aversion", desc: "Limited stock indicators create urgency. 'Low Stock' and 'Fast Moving' badges drive faster inquiry.", icon: AlertTriangle, example: "🔴 Low Stock · Fast Moving · 12 inquiries today" },
              { title: "Social Proof", desc: "Inquiry counts and 'Popular Seller' badges validate quality. Buyers trust what others are buying.", icon: Users, example: "47 inquiries this month · ⭐ Popular Seller" },
              { title: "Zeigarnik Effect", desc: "Multi-step RFQ form creates investment. Once started, users are compelled to complete the inquiry.", icon: Zap, example: "Step 1: Product → Step 2: Quantity → Step 3: Details" },
              { title: "Variable Rewards", desc: "CRM notifications with unpredictable timing. 'New inquiry received' and 'High-value buyer' alerts.", icon: TrendingUp, example: "🔔 New RFQ · High-value buyer from Delhi" },
              { title: "Reciprocity", desc: "Free market signals and trend data build trust. Users reciprocate by engaging with RFQ system.", icon: Globe, example: "Free: Market trends, signals → Earned: RFQ engagement" },
            ].map((item) => (
              <Card key={item.title} className="border-accent/20">
                <CardContent className="p-5 space-y-3">
                  <item.icon className="h-6 w-6 text-accent" />
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                  <div className="p-2 rounded bg-muted/50 text-xs font-mono text-muted-foreground">{item.example}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* Controlled Negotiation Marketplace */}
      <PitchSection id="marketplace" dark>
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><Gavel className="h-3 w-3 mr-1" /> Controlled Negotiation Marketplace</Badge>
            <h2 className="text-4xl font-bold">RFQ-Based Trade System</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-accent">Multi-Seller RFQ Flow</h3>
                {[
                  "Buyer browses marketplace → sees price ranges, stock bands, trends",
                  "Clicks 'Request Best Price' on 1+ products across sellers",
                  "Multi-step form: Product → Quantity → Timeline → Message",
                  "RFQ distributed to selected sellers simultaneously",
                  "Each seller receives in CRM → responds privately",
                  "Buyer compares private quotes → initiates negotiation",
                  "Platform tracks: sent, viewed, responded, converted",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-primary-foreground/70">
                    <span className="h-5 w-5 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-bold text-accent flex-shrink-0">{i + 1}</span>
                    {step}
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-accent">Broker Marketplace</h3>
                <p className="text-sm text-primary-foreground/70">Brokers exist as optional facilitators — not mandatory intermediaries.</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded bg-primary-foreground/5">
                    <h4 className="font-medium text-sm text-accent mb-1">Supply Offers</h4>
                    <p className="text-xs text-primary-foreground/60">Commodity, qty, range, origin</p>
                  </div>
                  <div className="p-3 rounded bg-primary-foreground/5">
                    <h4 className="font-medium text-sm text-accent mb-1">Buyer Needs</h4>
                    <p className="text-xs text-primary-foreground/60">Commodity, qty, target, location</p>
                  </div>
                </div>
                <div className="p-3 rounded border border-accent/20 mt-2">
                  <p className="text-xs text-accent font-semibold">Direct trade paths bypass brokerage entirely. Platform provides full support for broker-free transactions.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PitchSection>

      {/* Intelligence */}
      <PitchSection id="intelligence">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><BarChart3 className="h-3 w-3 mr-1" /> Intelligence & CRM</Badge>
            <h2 className="text-4xl font-bold text-primary">Market Intelligence & Lead CRM</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-lg text-primary">Behavioral Lead CRM</h3>
                <p className="text-sm text-muted-foreground">Lead prioritization with behavioral scoring: Hot / Warm / Cold</p>
                <div className="flex gap-2">
                  {["🔥 Hot", "🟡 Warm", "🔵 Cold"].map((stage) => (
                    <Badge key={stage} variant="outline" className="text-xs">{stage}</Badge>
                  ))}
                </div>
                {["RFQ inbox with buyer details and product interests", "Lead scoring based on inquiry volume and engagement", "Response time tracking per seller", "Notifications: 'New RFQ received', 'High-value buyer'", "Pipeline: New → Responded → Negotiation → Converted"].map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-accent mt-0.5 flex-shrink-0" />{item}
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-lg text-primary">Market Signals Dashboard</h3>
                <p className="text-sm text-muted-foreground">Controlled intelligence — show the weather, not the forecast.</p>
                {["Price trend charts with direction indicators (↑ ↓ →)", "Demand heatmap by commodity and region", "Supply signal cards: availability, movement speed", "Origin price comparison (California vs Iran vs Afghan)", "Community discussion integration per commodity"].map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-accent mt-0.5 flex-shrink-0" />{item}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </PitchSection>

      {/* Design Principles */}
      <PitchSection id="principles" dark>
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><Brain className="h-3 w-3 mr-1" /> Platform Design Principles</Badge>
            <h2 className="text-4xl font-bold">Behavioral Operating Principles</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: "Controlled Transparency", desc: "Show signals, not exact data" },
              { title: "Negotiation-First Design", desc: "Replace price display with RFQ" },
              { title: "Trust Acceleration", desc: "Verification > price" },
              { title: "Cognitive Simplicity", desc: "Reduce decision fatigue" },
              { title: "Behavioral Nudging", desc: "Guide user actions intentionally" },
              { title: "Platform Control", desc: "Structure and control market interactions" },
            ].map((item) => (
              <Card key={item.title} className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                <CardContent className="p-5 space-y-2">
                  <h3 className="font-semibold text-accent">{item.title}</h3>
                  <p className="text-sm text-primary-foreground/70">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="bg-accent/10 border-accent/30 text-primary-foreground">
            <CardContent className="p-6 text-center">
              <p className="text-lg font-semibold italic">"This platform does not expose the market — it structures and controls it."</p>
            </CardContent>
          </Card>
        </div>
      </PitchSection>

      {/* Success Metrics */}
      <PitchSection id="metrics">
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="text-sm"><Target className="h-3 w-3 mr-1" /> Success Metrics</Badge>
            <h2 className="text-4xl font-bold text-primary">How We Measure Success</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { metric: "RFQs Sent / Month", target: "200+", period: "By month 6" },
              { metric: "Seller Response Rate", target: "80%+", period: "Within 24 hours" },
              { metric: "Broker-Free Trades", target: "40%+", period: "By month 9" },
              { metric: "Monthly Active Users", target: "1,000+", period: "By month 6" },
              { metric: "Community Members", target: "500+", period: "By month 6" },
              { metric: "Total Digital Revenue", target: "₹42–85L", period: "Year 1" },
            ].map((item) => (
              <Card key={item.metric} className="text-center border-accent/20">
                <CardContent className="p-5 space-y-2">
                  <p className="text-3xl font-bold text-accent">{item.target}</p>
                  <p className="font-medium text-sm">{item.metric}</p>
                  <p className="text-xs text-muted-foreground">{item.period}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </PitchSection>

      {/* Product Roadmap */}
      <PitchSection id="roadmap" dark>
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <Badge className="bg-accent text-primary text-sm"><TrendingUp className="h-3 w-3 mr-1" /> Product Roadmap</Badge>
            <h2 className="text-4xl font-bold">Release Plan</h2>
          </div>
          <div className="space-y-6">
            {[
              { version: "v1.0 — MVP", timeline: "Month 1–4", features: ["Member directory & storefronts", "Price range display (never exact)", "Basic RFQ inquiry system", "Stock band visibility", "Basic CRM dashboard"] },
              { version: "v2.0 — Behavioral Trade OS", timeline: "Month 5–7", features: ["Multi-seller RFQ aggregation engine", "Behavioral UX layer (anchoring, nudges)", "Market intelligence signals", "Lead scoring (Hot/Warm/Cold)", "Price masking for paid members"] },
              { version: "v2.5 — Intelligence", timeline: "Month 8–9", features: ["Demand heatmaps", "Community integration (Discourse)", "Advertising platform", "Broker neutralization features", "Variable reward notifications"] },
              { version: "v3.0 — Scale", timeline: "Month 10–12", features: ["Multi-language (Hindi, Gujarati)", "Advanced analytics dashboard", "API for integrations", "Automated lead scoring", "White-label storefront themes"] },
            ].map((release) => (
              <Card key={release.version} className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-semibold">{release.version}</h3>
                    <Badge className="bg-accent/20 text-accent border-0 text-xs">{release.timeline}</Badge>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {release.features.map((f) => (
                      <div key={f} className="flex items-start gap-2 text-sm text-primary-foreground/70">
                        <CheckCircle2 className="h-3.5 w-3.5 text-accent mt-0.5 flex-shrink-0" />{f}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center pt-6 space-y-4">
            <div className="flex gap-3 justify-center flex-wrap print:hidden">
              <Link to="/pitch"><Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">← Pitch</Button></Link>
              <Link to="/brd"><Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">← BRD</Button></Link>
              <Link to="/fsd"><Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">FRD <ArrowRight className="h-3 w-3 ml-1" /></Button></Link>
              <Link to="/sdd"><Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">SDD <ArrowRight className="h-3 w-3 ml-1" /></Button></Link>
              <Link to="/tsd"><Button variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">TSD <ArrowRight className="h-3 w-3 ml-1" /></Button></Link>
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
