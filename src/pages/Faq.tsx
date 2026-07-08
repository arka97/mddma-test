import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { PageHeader } from "@/components/layout/PageHeader";
import { ArrowRight, ChevronDown } from "lucide-react";

interface Qa {
  q: string;
  a: string;
}

const FAQS: Qa[] = [
  {
    q: "What is MDDMA?",
    a: "MDDMA (Mumbai Dry-fruits & Dates Merchants Association) is a 95-year-old non-profit trade association governing India's dry fruits, dates and nuts trade. Founded in 1930 in Bombay by importers of dates and dry fruits from Muscat, Basra, Iran and Afghanistan, it operates today from APMC Market, Vashi, Navi Mumbai.",
  },
  {
    q: "What does MDDMA do for its members?",
    a: "MDDMA verifies traders, runs trade-dispute arbitration, liaises with APMC, FSSAI, Customs and policy bodies, shares market intelligence, advocates on import policy, runs educational seminars, and represents members at trade shows.",
  },
  {
    q: "How can I become a member of MDDMA?",
    a: "There are two options: a free tier for buyers (basic directory listing and browse access) and a paid tier at ₹10,000 per year for verified seller storefronts, priority directory placement, live RFQs and market intelligence. Brokers pay the same ₹10,000 with a broker flag — no separate fee. Apply at /apply.",
  },
  {
    q: "How does MDDMA verify a trader?",
    a: "Four tiers: email verified, company verified (GSTIN + incorporation document), and GST verified (adds a physical office visit by MDDMA staff). Full details on the process are in the Knowledge base article \"How MDDMA verifies a trader\".",
  },
  {
    q: "What products does the directory cover?",
    a: "Almonds (Mamra, Sanora, Californian), pistachios, cashews, dates (Medjool, Kimia, Ajwa, Safawi, Deglet Noor), walnuts, raisins, figs, hazelnuts and specialty nuts. Category filters are available on the Directory and Products pages.",
  },
  {
    q: "Do you show live prices?",
    a: "MDDMA publishes ranges and trend signals rather than exact prices. Exact prices are private commercial data between buyer and seller. Paid members can post and respond to RFQs to negotiate directly.",
  },
  {
    q: "How do RFQs work?",
    a: "Paid members and admins can post a Request for Quote at /rfq for 1–90 days. Interested sellers reveal their contact via the platform; the reveal is logged for audit. Free members and guests see teaser text only.",
  },
  {
    q: "Where is MDDMA based?",
    a: "C/o E-29, APMC Market-I, Phase-II, Sector-19, Masala Market, Navi Mumbai, Maharashtra 400705, India. Phone +91 22 2765 0827. Email grievance@mddma.org.",
  },
  {
    q: "How do I raise a grievance or dispute?",
    a: "Write to grievance@mddma.org or use the /contact form. Aditya Parmar is the named Grievance and Data Protection Officer. Turnaround for acknowledgement is 3 working days; resolution target is 30 days as per the Grievance & Redressal Policy.",
  },
  {
    q: "Is there a mobile app?",
    a: "The site is a Progressive Web App — install it from any modern browser via /install. There is no separate Play Store or App Store listing.",
  },
];

const Faq = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <Layout>
      <Seo
        title="MDDMA FAQ — Verified Dry Fruits & Dates Trade Network"
        subtitle="Answers about MDDMA membership, verification, RFQs, market signals, dispute resolution and how India's 95-year-old dry-fruit trade association works."
        path="/faq"
        jsonLd={jsonLd}
      />

      <div className="container mx-auto max-w-3xl px-5 py-6 sm:px-6 sm:py-8 lg:px-8">
        <PageHeader
          eyebrow="Frequently asked"
          title="Answers about MDDMA & the trade network"
          subtitle="What the association does, how membership works, and how buyers and sellers use the platform."
        />

        <div className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {FAQS.map((f, i) => (
            <details key={i} className="group open:bg-muted/30">
              <summary className="flex cursor-pointer items-start justify-between gap-4 px-5 py-4 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden">
                <span>{f.q}</span>
                <ChevronDown className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <div className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">{f.a}</div>
            </details>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start gap-3 rounded-2xl border border-[hsl(var(--gold))]/30 bg-[hsl(var(--gold))]/8 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Still have a question?</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Reach the association secretariat or the Grievance Officer directly.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background hover:opacity-90"
          >
            Contact us <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Faq;
