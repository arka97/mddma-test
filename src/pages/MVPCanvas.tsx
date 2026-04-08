import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Printer, AlertTriangle, Lightbulb, Target, TrendingUp,
  BarChart3, Users, Megaphone, DollarSign, ShieldAlert,
  ArrowRight, Gem, CheckCircle2, Globe, ShoppingBag,
  Handshake, FileText
} from "lucide-react";

const MVPCanvas = () => {
  return (
    <div className="relative bg-background min-h-screen">
      {/* Sticky nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur border-b border-primary-foreground/10 print:hidden">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-2">
          <span className="text-primary-foreground font-bold text-sm tracking-wide">MVP Canvas</span>
          <div className="flex gap-1 overflow-x-auto">
            {["overview","problem","segments","uvp","solution","channels","revenue","costs","metrics","advantage"].map((id) => (
              <button
                key={id}
                onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
                className="text-xs text-primary-foreground/70 hover:text-primary-foreground px-2 py-1 rounded transition-colors whitespace-nowrap capitalize"
              >
                {id === "uvp" ? "UVP" : id}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Link to="/pitch">
              <Button size="sm" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-xs">
                <FileText className="h-3 w-3 mr-1" /> Pitch
              </Button>
            </Link>
            <Button size="sm" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" onClick={() => window.print()}>
              <Printer className="h-3 w-3 mr-1" /> PDF
            </Button>
          </div>
        </div>
      </nav>

      {/* Cover */}
      <section id="overview" className="min-h-screen flex items-center justify-center bg-primary text-primary-foreground pt-16 px-6 print:min-h-0 print:py-10">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <Badge className="bg-accent text-accent-foreground text-sm px-4 py-1">MVP Canvas</Badge>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">MDDMA Digital Trade Platform</h1>
          <p className="text-xl text-primary-foreground/70 max-w-2xl mx-auto">
            Lean Canvas — Defining the minimum viable product for India's first digital dry fruits trade hub
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/80 text-xs">B2B Marketplace</Badge>
            <Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/80 text-xs">Industry Directory</Badge>
            <Badge variant="outline" className="border-primary-foreground/30 text-primary-foreground/80 text-xs">Trade Intelligence</Badge>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section id="problem" className="min-h-screen flex items-center justify-center py-20 px-6 print:min-h-0 print:py-10 print:break-inside-avoid">
        <div className="w-full max-w-5xl mx-auto space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            <h2 className="text-3xl font-bold text-foreground">1. Problem</h2>
          </div>
          <p className="text-muted-foreground text-lg">Top 3 problems the MDDMA trade ecosystem faces today</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Fragmented Discovery",
                desc: "Buyers rely on word-of-mouth, WhatsApp forwards, and physical visits to find suppliers. No centralized directory exists for the ₹15,000 Cr dry fruits trade.",
                icon: Users,
                existing: "WhatsApp groups, personal networks, broker phone calls"
              },
              {
                title: "Zero Digital Presence",
                desc: "95% of MDDMA's 350+ members have no online storefront. They lose business to digitally-savvy competitors on IndiaMART and TradeIndia.",
                icon: Globe,
                existing: "Printed catalogs, visiting cards, word of mouth"
              },
              {
                title: "Opaque Market Intelligence",
                desc: "Price discovery, supply signals, and demand trends are shared informally — creating information asymmetry that hurts smaller traders.",
                icon: BarChart3,
                existing: "Informal broker networks, unstructured WhatsApp chats"
              }
            ].map((p, i) => (
              <Card key={i} className="border-destructive/20 bg-destructive/5">
                <CardContent className="p-6 space-y-4">
                  <p.icon className="h-6 w-6 text-destructive" />
                  <h3 className="font-bold text-lg text-foreground">{p.title}</h3>
                  <p className="text-sm text-muted-foreground">{p.desc}</p>
                  <div className="pt-2 border-t border-destructive/10">
                    <p className="text-xs text-muted-foreground"><span className="font-semibold">Existing alternative:</span> {p.existing}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Segments */}
      <section id="segments" className="min-h-screen flex items-center justify-center py-20 px-6 bg-muted print:min-h-0 print:py-10 print:break-inside-avoid">
        <div className="w-full max-w-5xl mx-auto space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">2. Customer Segments</h2>
          </div>
          <p className="text-muted-foreground text-lg">Who are the early adopters?</p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-accent/30">
              <CardContent className="p-6 space-y-3">
                <Badge className="bg-accent text-accent-foreground">Primary — Sellers</Badge>
                <h3 className="font-bold text-lg text-foreground">MDDMA Member Businesses</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" /> 350+ registered dry fruit traders in Mumbai</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" /> Wholesalers, importers & processors</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" /> Tech-curious but digitally underserved</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" /> Annual trade volume: ₹1,000 Cr+</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-primary/30">
              <CardContent className="p-6 space-y-3">
                <Badge className="bg-primary text-primary-foreground">Primary — Buyers</Badge>
                <h3 className="font-bold text-lg text-foreground">B2B Buyers Nationwide</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /> Retailers, confectionery brands, HoReCa</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /> Regional distributors seeking Mumbai supply</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /> Export houses looking for certified origins</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /> Currently using IndiaMART, TradeIndia, or brokers</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-muted-foreground/20">
              <CardContent className="p-6 space-y-3">
                <Badge variant="outline">Secondary</Badge>
                <h3 className="font-bold text-lg text-foreground">Brokers & Commission Agents</h3>
                <p className="text-sm text-muted-foreground">
                  Intermediaries facilitating bulk transactions. Platform gives them a structured marketplace to post supply offers and buyer requirements.
                </p>
              </CardContent>
            </Card>

            <Card className="border-muted-foreground/20">
              <CardContent className="p-6 space-y-3">
                <Badge variant="outline">Tertiary</Badge>
                <h3 className="font-bold text-lg text-foreground">MDDMA Administration</h3>
                <p className="text-sm text-muted-foreground">
                  Association committee managing member approvals, circulars, and industry events. Platform digitizes their governance workflows.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Unique Value Proposition */}
      <section id="uvp" className="min-h-screen flex items-center justify-center py-20 px-6 bg-primary text-primary-foreground print:min-h-0 print:py-10 print:break-inside-avoid">
        <div className="w-full max-w-5xl mx-auto space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <Gem className="h-8 w-8 text-accent" />
            <h2 className="text-3xl font-bold">3. Unique Value Proposition</h2>
          </div>

          <div className="bg-primary-foreground/10 rounded-xl p-8 border border-primary-foreground/20 text-center space-y-4">
            <p className="text-2xl sm:text-3xl font-bold leading-snug">
              "The only trade platform built <span className="text-accent">by the industry</span>, <span className="text-accent">for the industry</span> — combining a 95-year trade legacy with modern digital commerce."
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 pt-4">
            {[
              { title: "Association Trust", desc: "MDDMA's stamp of credibility — every member is verified. No anonymous sellers.", icon: ShieldAlert },
              { title: "Industry-Specific", desc: "Purpose-built for dry fruits & commodities — not a generic marketplace with irrelevant features.", icon: Target },
              { title: "Community + Commerce", desc: "Trade happens alongside structured industry discussion — market intelligence feeds commerce.", icon: Handshake },
            ].map((v, i) => (
              <div key={i} className="space-y-3">
                <v.icon className="h-6 w-6 text-accent" />
                <h3 className="font-bold text-lg">{v.title}</h3>
                <p className="text-sm text-primary-foreground/70">{v.desc}</p>
              </div>
            ))}
          </div>

          <div className="pt-6">
            <p className="text-sm text-primary-foreground/50 font-medium">HIGH-LEVEL CONCEPT</p>
            <p className="text-lg text-primary-foreground/80 mt-1">
              "IndiaMART meets LinkedIn" — but exclusively for the dry fruits trade, backed by MDDMA's 95-year legacy.
            </p>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section id="solution" className="min-h-screen flex items-center justify-center py-20 px-6 print:min-h-0 print:py-10 print:break-inside-avoid">
        <div className="w-full max-w-5xl mx-auto space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <Lightbulb className="h-8 w-8 text-accent" />
            <h2 className="text-3xl font-bold text-foreground">4. Solution</h2>
          </div>
          <p className="text-muted-foreground text-lg">MVP feature set mapped to each problem</p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                problem: "Fragmented Discovery",
                features: [
                  "Searchable member directory with filters",
                  "Commodity-based marketplace browsing",
                  "Individual seller storefronts with product catalogs"
                ]
              },
              {
                problem: "Zero Digital Presence",
                features: [
                  "One-click storefront creation for members",
                  "Product listing with origin, MOQ, pricing",
                  "WhatsApp-integrated inquiry buttons",
                  "Verified member badges"
                ]
              },
              {
                problem: "Opaque Market Intelligence",
                features: [
                  "Commodity price trend charts",
                  "Supply-demand signal cards",
                  "Community discussion forum (Discourse)",
                  "Association circulars & announcements"
                ]
              }
            ].map((s, i) => (
              <Card key={i}>
                <CardContent className="p-6 space-y-4">
                  <Badge variant="outline" className="text-xs">Solves: {s.problem}</Badge>
                  <ul className="space-y-3">
                    {s.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-foreground">
                        <ArrowRight className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-muted border-accent/30">
            <CardContent className="p-6">
              <p className="text-sm font-semibold text-foreground mb-2">MVP Scope — What's OUT:</p>
              <div className="flex flex-wrap gap-2">
                {["Payment processing", "Logistics/shipping", "Inventory sync", "Mobile app", "Multi-language", "AI recommendations"].map((item) => (
                  <Badge key={item} variant="outline" className="text-xs text-muted-foreground">{item}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Channels */}
      <section id="channels" className="min-h-screen flex items-center justify-center py-20 px-6 bg-muted print:min-h-0 print:py-10 print:break-inside-avoid">
        <div className="w-full max-w-5xl mx-auto space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <Megaphone className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">5. Channels</h2>
          </div>
          <p className="text-muted-foreground text-lg">How we reach and onboard early adopters</p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6 space-y-3">
                <Badge className="bg-primary text-primary-foreground">Free / Organic</Badge>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /> MDDMA general body meetings — live demo</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /> Existing WhatsApp groups — migration campaign</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /> Association circulars & email blasts</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /> SEO for "dry fruits suppliers Mumbai"</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /> Word-of-mouth among 350+ members</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-3">
                <Badge className="bg-accent text-accent-foreground">Paid / Scaled (Phase 2)</Badge>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" /> Google Ads targeting commodity buyers</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" /> Industry trade show presence</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" /> Partnership with logistics providers</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" /> Cross-promotion with other trade associations</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Revenue Streams */}
      <section id="revenue" className="min-h-screen flex items-center justify-center py-20 px-6 print:min-h-0 print:py-10 print:break-inside-avoid">
        <div className="w-full max-w-5xl mx-auto space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="h-8 w-8 text-accent" />
            <h2 className="text-3xl font-bold text-foreground">6. Revenue Streams</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                tier: "Free Member",
                price: "₹0/yr",
                revenue: "Onboarding funnel",
                items: ["Basic storefront", "5 product listings", "Directory presence", "Community access"]
              },
              {
                tier: "Paid Member",
                price: "₹10,000/yr",
                revenue: "Primary revenue",
                items: ["Unlimited listings", "RFQ mode / hide price", "Priority placement", "Lead CRM dashboard", "Market intelligence"]
              },
              {
                tier: "Broker",
                price: "₹5,000/yr",
                revenue: "Marketplace fees",
                items: ["Broker marketplace access", "Supply/demand posting", "Buyer matching", "Commission tracking"]
              }
            ].map((t, i) => (
              <Card key={i} className={i === 1 ? "border-accent ring-2 ring-accent/20" : ""}>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Badge className={i === 1 ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground"}>{t.tier}</Badge>
                    <p className="text-2xl font-bold text-foreground mt-2">{t.price}</p>
                    <p className="text-xs text-muted-foreground">{t.revenue}</p>
                  </div>
                  <ul className="space-y-2">
                    {t.items.map((item, j) => (
                      <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-accent mt-0.5 shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-muted">
            <CardContent className="p-6">
              <p className="font-semibold text-foreground mb-2">Additional Revenue (Phase 2+)</p>
              <div className="grid sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
                <div><span className="font-medium text-foreground">Banner Ads:</span> ₹5,000–25,000/month for homepage & category placements</div>
                <div><span className="font-medium text-foreground">Sponsored Listings:</span> ₹500–2,000/listing for priority visibility</div>
                <div><span className="font-medium text-foreground">Data Reports:</span> Premium market intelligence reports for non-members</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Cost Structure */}
      <section id="costs" className="min-h-screen flex items-center justify-center py-20 px-6 bg-muted print:min-h-0 print:py-10 print:break-inside-avoid">
        <div className="w-full max-w-5xl mx-auto space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingBag className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">7. Cost Structure</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-bold text-foreground">Fixed Costs (Monthly)</h3>
                <div className="space-y-3">
                  {[
                    { item: "Supabase (DB, Auth, Storage)", cost: "₹2,500" },
                    { item: "Hosting & CDN (Vercel/Cloudflare)", cost: "₹1,500" },
                    { item: "Discourse Community Hosting", cost: "₹5,000" },
                    { item: "Domain & SSL", cost: "₹500" },
                  ].map((c, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{c.item}</span>
                      <span className="font-medium text-foreground">{c.cost}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm pt-2 border-t border-border">
                    <span className="font-bold text-foreground">Total Fixed</span>
                    <span className="font-bold text-foreground">~₹9,500/mo</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-bold text-foreground">Variable / One-Time Costs</h3>
                <div className="space-y-3">
                  {[
                    { item: "MVP Development", cost: "<₹30k" },
                    { item: "Data Entry (initial 350 members)", cost: "₹15,000" },
                    { item: "Onboarding & Training", cost: "₹10,000" },
                    { item: "Design & Branding", cost: "₹10,000" },
                  ].map((c, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{c.item}</span>
                      <span className="font-medium text-foreground">{c.cost}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm pt-2 border-t border-border">
                    <span className="font-bold text-foreground">Total One-Time</span>
                    <span className="font-bold text-foreground">~₹65,000</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-accent/10 border-accent/30">
            <CardContent className="p-6 text-center">
              <p className="text-lg font-bold text-foreground">Break-even: ~15 paid members at ₹10,000/yr covers annual operating costs</p>
              <p className="text-sm text-muted-foreground mt-1">That's just 4% of MDDMA's 350+ member base</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Key Metrics */}
      <section id="metrics" className="min-h-screen flex items-center justify-center py-20 px-6 print:min-h-0 print:py-10 print:break-inside-avoid">
        <div className="w-full max-w-5xl mx-auto space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="h-8 w-8 text-accent" />
            <h2 className="text-3xl font-bold text-foreground">8. Key Metrics</h2>
          </div>
          <p className="text-muted-foreground text-lg">The numbers that tell us if the MVP is working</p>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { metric: "Member Signups", target: "100 in 3 months", desc: "Onboarded & active on platform" },
              { metric: "Product Listings", target: "500 in 3 months", desc: "Active commodity listings" },
              { metric: "Inquiries Sent", target: "50/month by M3", desc: "Buyer-to-seller inquiries" },
              { metric: "Paid Conversions", target: "15% of free members", desc: "Free → Paid upgrade rate" },
            ].map((m, i) => (
              <Card key={i} className="text-center">
                <CardContent className="p-6 space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{m.metric}</p>
                  <p className="text-2xl font-bold text-accent">{m.target}</p>
                  <p className="text-xs text-muted-foreground">{m.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-foreground mb-4">Pirate Metrics (AARRR) for MVP</h3>
              <div className="space-y-4">
                {[
                  { stage: "Acquisition", metric: "New visitors/week", source: "MDDMA meetings, WhatsApp migration, SEO" },
                  { stage: "Activation", metric: "Storefront created within 48h", source: "Onboarding flow completion rate" },
                  { stage: "Retention", metric: "Weekly return visits", source: "Community engagement, new listings alerts" },
                  { stage: "Revenue", metric: "Paid member conversions", source: "Free → Paid upgrade funnel" },
                  { stage: "Referral", metric: "Member-invited signups", source: "Invite link tracking, WhatsApp shares" },
                ].map((a, i) => (
                  <div key={i} className="flex items-start gap-4 text-sm">
                    <Badge variant="outline" className="shrink-0 w-24 justify-center">{a.stage}</Badge>
                    <span className="font-medium text-foreground w-48 shrink-0">{a.metric}</span>
                    <span className="text-muted-foreground">{a.source}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Unfair Advantage */}
      <section id="advantage" className="min-h-screen flex items-center justify-center py-20 px-6 bg-primary text-primary-foreground print:min-h-0 print:py-10 print:break-inside-avoid">
        <div className="w-full max-w-5xl mx-auto space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-8 w-8 text-accent" />
            <h2 className="text-3xl font-bold">9. Unfair Advantage</h2>
          </div>
          <p className="text-primary-foreground/70 text-lg">What cannot be easily copied or bought</p>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                title: "95-Year Legacy & Trust",
                desc: "MDDMA's institutional credibility is irreplaceable. No startup can manufacture decades of trade relationships and industry authority."
              },
              {
                title: "Captive 350+ Member Base",
                desc: "Built-in distribution to verified businesses. No cold outreach — the community already exists and is organized."
              },
              {
                title: "Domain Expertise",
                desc: "Deep understanding of dry fruits trade workflows, pricing, origins, and compliance — baked into every feature."
              },
              {
                title: "Network Effects",
                desc: "Every new member listing increases the platform's value for buyers. Every buyer inquiry attracts more sellers. The moat grows with usage."
              }
            ].map((a, i) => (
              <div key={i} className="bg-primary-foreground/10 rounded-lg p-6 border border-primary-foreground/20 space-y-2">
                <h3 className="font-bold text-lg">{a.title}</h3>
                <p className="text-sm text-primary-foreground/70">{a.desc}</p>
              </div>
            ))}
          </div>

          <div className="pt-8 text-center space-y-4">
            <p className="text-primary-foreground/50 text-sm font-medium">RELATED DOCUMENTS</p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: "Sales Pitch", to: "/pitch" },
                { label: "SOW", to: "/sow" },
                { label: "BRD", to: "/brd" },
                { label: "PRD", to: "/prd" },
                { label: "FSD", to: "/fsd" },
                { label: "SDD", to: "/sdd" },
                { label: "TSD", to: "/tsd" },
              ].map((doc) => (
                <Link key={doc.to} to={doc.to}>
                  <Button size="sm" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                    {doc.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MVPCanvas;
