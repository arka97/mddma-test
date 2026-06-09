// Postbuild: write per-route static HTML for the public authority layer.
// GTM-001 — only the public layer is prerendered; transactional core stays SPA + noindex.
//
// Each generated file:
//   - sits at dist/<route>/index.html so Lovable's static hosting serves it for direct hits
//   - carries route-specific <title>, meta description, canonical, og:*, JSON-LD
//   - includes prerendered human-readable body content inside <div id="root">
//   - reuses Vite's hashed <script>/<link> tags so React hydrates and takes over for users

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";

const DIST = resolve("dist");
const SITE = "https://mddma.org";
const LOGO_PNG = `${SITE}/icon-192.png`;

interface PrerenderRoute {
  path: string;                // e.g. "/about" — must start with "/" and not end with "/"
  title: string;               // <60 chars ideal
  description: string;         // 150–160 chars ideal
  ogType?: "website" | "article";
  jsonLd?: object | object[];
  body: string;                // HTML to inject inside <div id="root">
}

const NAV = `
      <header>
        <p>Mumbai Dry-fruits &amp; Dates Merchants Association · Established 1930</p>
        <nav>
          <a href="/">Home</a> ·
          <a href="/about">About</a> ·
          <a href="/membership">Membership</a> ·
          <a href="/apply">Apply</a> ·
          <a href="/circulars">Circulars</a> ·
          <a href="/contact">Contact</a> ·
          <a href="/install">Install App</a>
        </nav>
      </header>`;

const ORG_REF = {
  "@type": "Organization",
  name: "Mumbai Dry-fruits & Dates Merchants Association",
  url: "https://mddma.org",
};

const ROUTES: PrerenderRoute[] = [
  {
    path: "/",
    title: "MDDMA — Mumbai Dry-fruits & Dates Merchants Association",
    description:
      "MDDMA is the official 95-year-old trade association for India's dry fruits, dates and nuts trade. Verified members, governance, circulars and knowledge base — based at APMC Vashi, Navi Mumbai.",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Mumbai Dry-fruits & Dates Merchants Association",
        alternateName: "MDDMA",
        foundingDate: "1930",
        url: SITE,
        logo: LOGO_PNG,
        image: `${SITE}/og-image.png`,
        description:
          "A 95-year-old non-profit trade association governing the dry fruits, dates and nuts trade in Mumbai and Navi Mumbai, India. Originally founded in 1930 by importers of dates and dry fruits from Muscat, Basra, Iran and Afghanistan; today operates from APMC Market, Vashi.",
        address: {
          "@type": "PostalAddress",
          streetAddress: "C/o E-29, APMC Market-I, Phase-II, Sector-19, Masala Market",
          addressLocality: "Navi Mumbai",
          addressRegion: "Maharashtra",
          postalCode: "400705",
          addressCountry: "IN",
        },
        telephone: "+91-22-27650827",
        email: "grievance@mddma.org",
        areaServed: "IN",
        knowsAbout: [
          "dry fruits",
          "dates",
          "nuts",
          "almonds",
          "cashews",
          "pistachios",
          "walnuts",
          "raisins",
          "wholesale trade",
          "import-export",
          "APMC Vashi",
          "trade association governance",
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        url: `${SITE}/`,
        name: "MDDMA",
        publisher: { "@type": "Organization", name: "Mumbai Dry-fruits & Dates Merchants Association" },
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is MDDMA?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "MDDMA (Mumbai Dry-fruits & Dates Merchants Association) is a 95-year-old non-profit trade association governing India's dry fruits, dates and nuts trade. Founded in 1930 in Bombay by importers of dates and dry fruits from Muscat, Basra, Iran and Afghanistan, it operates today from APMC Market, Vashi, Navi Mumbai.",
            },
          },
          {
            "@type": "Question",
            name: "What does MDDMA do for its members?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "MDDMA verifies traders, runs trade-dispute arbitration, liaises with APMC, FSSAI, Customs and policy bodies, shares market intelligence, advocates on import policy, runs educational seminars, and represents members at trade shows.",
            },
          },
          {
            "@type": "Question",
            name: "How can I become a member of MDDMA?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "There are two membership options: a free tier for buyers (basic directory listing and browse access) and a paid tier at ₹10,000 per year for verified seller storefronts, priority directory placement and market intelligence. Apply at https://mddma.org/apply.",
            },
          },
          {
            "@type": "Question",
            name: "Where is MDDMA based?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "MDDMA is based at C/o E-29, APMC Market-I, Phase-II, Sector-19, Masala Market, Navi Mumbai, Maharashtra 400705, India. Phone: +91-22-27650827.",
            },
          },
        ],
      },
    ],
    body: `
      <main>
        <h1>MDDMA — the official 95-year-old trade association for India's dry fruits, dates and nuts trade.</h1>
        <p>
          The Mumbai Dry-fruits &amp; Dates Merchants Association (MDDMA) was founded in 1930 in Bombay
          by importers and traders of dates and dry fruits from Muscat (Oman), Basra (Iraq), Iran and
          Afghanistan. Today MDDMA operates from APMC Market, Vashi (Navi Mumbai) and represents
          verified importers, traders and brokers across India.
        </p>
        <h2>What MDDMA does</h2>
        <ul>
          <li>Verifies members and maintains the trusted trader directory.</li>
          <li>Arbitrates trade disputes between members.</li>
          <li>Liaises with APMC, FSSAI, Customs and policy bodies.</li>
          <li>Publishes circulars, market intelligence and trade signals.</li>
          <li>Connects verified buyers and sellers through a controlled-transparency catalogue.</li>
          <li>Advocates on import policy for dates, nuts and dry fruits.</li>
        </ul>
        <h2>Membership</h2>
        <p>
          <strong>Free</strong> — basic directory listing and browse access.
          <strong>Paid (₹10,000/year)</strong> — verified seller storefront, priority
          directory placement, market intelligence reports and trust badge.
          <a href="/apply">Apply for membership</a>.
        </p>
        <h2>Contact</h2>
        <p>
          C/o E-29, APMC Market-I, Phase-II, Sector-19, Masala Market, Navi Mumbai, Maharashtra
          400705, India. Phone: <a href="tel:+912227650827">+91-22-27650827</a>. Email:
          <a href="mailto:grievance@mddma.org">grievance@mddma.org</a>.
        </p>
      </main>`,
  },
  {
    path: "/about",
    title: "About MDDMA — Mumbai Dry-fruits & Dates Association, est. 1930",
    description:
      "MDDMA was founded in 1930 by Bombay importers of dates and dry fruits from Muscat, Basra, Iran and Afghanistan. Today the association operates from APMC Vashi, governing India's dry fruits trade.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      url: `${SITE}/about`,
      mainEntity: {
        "@type": "Organization",
        name: "Mumbai Dry-fruits & Dates Merchants Association",
        alternateName: "MDDMA",
        foundingDate: "1930",
        url: "https://mddma.org",
        telephone: "+91-22-27650827",
        email: "grievance@mddma.org",
        address: {
          "@type": "PostalAddress",
          streetAddress: "C/o E-29, APMC Market-I, Phase-II, Sector-19, Masala Market",
          addressLocality: "Navi Mumbai",
          addressRegion: "MH",
          postalCode: "400705",
          addressCountry: "IN",
        },
      },
    },
    body: `
      <main>
        <h1>About MDDMA</h1>
        <p>
          The Mumbai Dry-fruits &amp; Dates Merchants Association — known as MDDMA — is a
          non-profit trade association founded in <strong>1930</strong> in Bombay by 11
          pioneer importers and traders dealing in dry and wet dates and dry fruits sourced
          from Muscat (Oman), Basra (Iraq), Iran and Afghanistan. The Association was created
          to protect the interests of the trade and to advise members on the rules,
          regulations and laws of the Government of India.
        </p>
        <h2>Our journey</h2>
        <ul>
          <li><strong>1930</strong> — Foundation in Bombay by 11 pioneer merchants.</li>
          <li><strong>1975</strong> — Reconstituted as “The Bombay Kharek Bazar &amp; Mewa Merchants Association”.</li>
          <li><strong>1990s</strong> — Agri-markets shifted from Masjid Bunder to APMC Market, Navi Mumbai.</li>
          <li><strong>1998</strong> — Renamed “The Bombay Dry Fruits &amp; Dates Association” via Govt. Order NTC 1596/463(92), 4 May 1998.</li>
          <li><strong>2020s</strong> — Launch of MDDMA's digital trade hub — verified directory, controlled-transparency catalogue, discovery tools.</li>
        </ul>
        <h2>What we do</h2>
        <ul>
          <li>Verified trader directory of importers, traders and brokers.</li>
          <li>Trade-dispute arbitration and resolution between members.</li>
          <li>Liaison with APMC, FSSAI, Customs and policy bodies.</li>
          <li>Market intelligence — demand trends, port arrivals, price-band signals.</li>
          <li>Quality &amp; FSSAI compliance advocacy across the supply chain.</li>
          <li>Import-policy advocacy on duties, quotas and trade rules.</li>
          <li>Educational seminars and the Annual MDDMA Meet.</li>
        </ul>
        <h2>Office bearers</h2>
        <p>
          Presidents — Shri Vijay Bhuta &amp; Shri Chandan Mehta · Hon. Gen. Secretary — Shri Girish
          Bhandary · Hon. Jt. Secretary — Shri Manesh Lund · Hon. Treasurer — Shri Suresh Dama ·
          Hon. Jt. Treasurer — Shri Rajendra Shah.
        </p>
        <h2>Contact</h2>
        <p>
          C/o E-29, APMC Market-I, Phase-II, Sector-19, Masala Market, Navi Mumbai, Maharashtra
          400705, India. Phone: <a href="tel:+912227650827">+91-22-27650827</a>. Email:
          <a href="mailto:grievance@mddma.org">grievance@mddma.org</a>.
        </p>
      </main>`,
  },
  {
    path: "/membership",
    title: "MDDMA Membership — Free & Paid (₹10,000/year) Plans",
    description:
      "Join MDDMA. Free tier for buyers (directory listing + browsing) or Paid at ₹10,000/year for verified seller storefront, priority placement and market intelligence.",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "Product",
        name: "MDDMA Paid Membership",
        description:
          "Verified seller storefront, priority directory placement, market intelligence reports and trust badge.",
        brand: ORG_REF,
        offers: {
          "@type": "Offer",
          price: "10000",
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          url: `${SITE}/apply`,
          category: "Annual membership",
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "Product",
        name: "MDDMA Free Membership",
        description:
          "Basic directory listing, browse verified members and view public circulars.",
        brand: ORG_REF,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          url: `${SITE}/apply`,
        },
      },
    ],
    body: `
      <main>
        <h1>MDDMA Membership Plans</h1>
        <p>
          Choose the right plan for your business. All members receive an MDDMA directory listing
          and association membership benefits.
        </p>
        <h2>Free — ₹0</h2>
        <ul>
          <li>Basic directory listing</li>
          <li>Browse verified members</li>
          <li>View public circulars and news</li>
          <li>Direct contact with sellers</li>
        </ul>
        <h2>Paid — ₹10,000 per year</h2>
        <ul>
          <li>Verified seller storefront</li>
          <li>Product listings with controlled-transparency pricing</li>
          <li>Priority placement in directory</li>
          
          <li>Market intelligence reports</li>
          <li>Trust seal &amp; verification badge</li>
        </ul>
        <p><a href="/apply">Apply for MDDMA membership →</a></p>
        <p>
          Brokers pay the same ₹10,000/year fee — there is no separate broker tier. Tick the
          “I operate as a broker” option on the application form.
        </p>
      </main>`,
  },
  {
    path: "/apply",
    title: "Apply for MDDMA Membership — Verified Trade Network",
    description:
      "Apply to join MDDMA. Submit firm details for committee review; approved applicants receive a payment link. Founding-member pricing of ₹10,000/year locked for 24 months.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      url: `${SITE}/apply`,
      name: "Apply for MDDMA Membership",
      isPartOf: ORG_REF,
    },
    body: `
      <main>
        <h1>Apply for MDDMA Membership</h1>
        <p>
          MDDMA is an association of verified importers, traders and brokers of dates, nuts and
          dry fruits. Membership applications are reviewed by the MDDMA committee. Approved
          applicants receive a Razorpay payment link by email.
        </p>
        <h2>Paid Membership — ₹10,000 / year</h2>
        <ul>
          <li>Verified storefront on the MDDMA trade hub</li>
          <li>Direct buyer enquiries via WhatsApp, phone and email — no broker tax</li>
          <li>Priority placement in directory and product search</li>
          <li>Multi-product catalogue with controlled-transparency pricing</li>
          <li>Market intelligence reports and trade signals</li>
          <li>Trust seal · founding-member badge · rate locked 24 months</li>
        </ul>
        <p>
          The free tier (basic directory listing) requires no application —
          just <a href="/login">create an account</a>.
        </p>
        <p>
          Open the interactive application form to submit your firm details:
          <a href="/apply">Apply now</a>.
        </p>
      </main>`,
  },
  {
    path: "/install",
    title: "Install the MDDMA App — Progressive Web App",
    description:
      "Install MDDMA as a Progressive Web App on Android, iOS or desktop for one-tap access to the directory, circulars and market signals. Works offline-friendly on market-day connections.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "MDDMA Trade Hub",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Android, iOS, Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      publisher: ORG_REF,
    },
    body: `
      <main>
        <h1>Install MDDMA Trade Hub</h1>
        <p>
          Add the MDDMA trade hub to your phone's home screen for instant, app-like access to the
          directory, circulars and market signals — fast on spotty market-day connections, with no
          browser bars or distractions.
        </p>
        <h2>Android (Chrome)</h2>
        <ol>
          <li>Tap the menu (⋮) in the top-right of Chrome.</li>
          <li>Choose <strong>Install app</strong> or <strong>Add to Home screen</strong>.</li>
          <li>Confirm to add the MDDMA icon to your home screen.</li>
        </ol>
        <h2>iPhone / iPad (Safari)</h2>
        <ol>
          <li>Tap the Share button.</li>
          <li>Choose <strong>Add to Home Screen</strong>.</li>
          <li>Tap <strong>Add</strong> in the top-right.</li>
        </ol>
        <h2>Desktop (Chrome / Edge)</h2>
        <ol>
          <li>Look for the install icon in the address bar.</li>
          <li>Click <strong>Install MDDMA</strong>.</li>
          <li>Pin the launched app to your taskbar or dock.</li>
        </ol>
      </main>`,
  },
  {
    path: "/circulars",
    title: "MDDMA Circulars & Trade Notices — Official Announcements",
    description:
      "Official circulars, government notifications, trade updates and association announcements from the Mumbai Dry-fruits & Dates Merchants Association.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      url: `${SITE}/circulars`,
      name: "MDDMA Circulars & Notices",
      isPartOf: ORG_REF,
    },
    body: `
      <main>
        <h1>MDDMA Circulars &amp; Notices</h1>
        <p>
          Latest government notifications, trade updates and association announcements
          published by MDDMA. The full list — including live search across published circulars —
          loads in the interactive app below.
        </p>
        <p>
          Circulars cover topics such as APMC notifications, FSSAI compliance, customs
          procedures, import policy changes, AGM notices and member alerts.
        </p>
      </main>`,
  },
  {
    path: "/contact",
    title: "Contact MDDMA — Mumbai Dry-fruits & Dates Association",
    description:
      "Contact the Mumbai Dry-fruits & Dates Merchants Association. Office at APMC Vashi, Navi Mumbai. Phone +91-22-27650827. Email grievance@mddma.org.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      url: `${SITE}/contact`,
      mainEntity: {
        ...ORG_REF,
        telephone: "+91-22-27650827",
        email: "grievance@mddma.org",
        address: {
          "@type": "PostalAddress",
          streetAddress: "C/o E-29, APMC Market-I, Phase-II, Sector-19, Masala Market",
          addressLocality: "Navi Mumbai",
          addressRegion: "MH",
          postalCode: "400705",
          addressCountry: "IN",
        },
      },
    },
    body: `
      <main>
        <h1>Contact MDDMA</h1>
        <p>
          Get in touch with the Mumbai Dry-fruits &amp; Dates Merchants Association office at
          APMC Vashi. The form on this page also lets you submit verification requests and
          advertising enquiries.
        </p>
        <h2>Office</h2>
        <p>
          C/o E-29, APMC Market-I, Phase-II, Sector-19, Masala Market, Navi Mumbai, Maharashtra
          400705, India.
        </p>
        <h2>Phone</h2>
        <p><a href="tel:+912227650827">+91-22-27650827</a></p>
        <h2>Email</h2>
        <p>
          General &amp; grievance: <a href="mailto:grievance@mddma.org">grievance@mddma.org</a>
        </p>
        <h2>Grievance &amp; Data Protection Officer</h2>
        <p>Aditya Parmar — <a href="mailto:grievance@mddma.org">grievance@mddma.org</a></p>
      </main>`,
  },
];

function extractHeadAssets(distIndexHtml: string): string {
  // Pull out the Vite-injected <script type="module" ...> and <link rel="stylesheet" ...>
  // and the Lovable analytics tag, so each prerendered page boots the SPA correctly.
  const tags: string[] = [];
  const re = /<(script|link)\b[^>]*>(?:<\/script>)?/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(distIndexHtml))) {
    const tag = m[0];
    if (/\/assets\/[^"']+\.(?:js|css)/.test(tag)) tags.push(tag);
    else if (/~flock\.js|~api\/analytics/.test(tag)) tags.push(tag);
    else if (/type=["']application\/ld\+json["']/.test(tag)) {
      // skip — we emit our own JSON-LD per route
    }
  }
  return tags.join("\n    ");
}

function renderPage(route: PrerenderRoute, assetTags: string): string {
  const canonical = route.path === "/" ? `${SITE}/` : `${SITE}${route.path}`;
  const ogType = route.ogType ?? "website";
  const jsonLdArr = route.jsonLd ? (Array.isArray(route.jsonLd) ? route.jsonLd : [route.jsonLd]) : [];
  const jsonLdTags = jsonLdArr
    .map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`)
    .join("\n    ");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>${route.title}</title>
    <meta name="description" content="${route.description.replace(/"/g, "&quot;")}" />
    <meta name="author" content="MDDMA" />

    <link rel="manifest" href="/manifest.json" />

    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" type="image/svg+xml" href="/brand/MDDMA_logomark.svg" />
    <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <meta name="theme-color" content="#1B2F5E" />
    <meta name="google-site-verification" content="snCmNoEIyEYd88Qm830ByXgiPEc1BxAYBZFugC6z5So" />

    <meta property="og:type" content="${ogType}" />
    <meta property="og:site_name" content="MDDMA" />
    <meta property="og:title" content="${route.title.replace(/"/g, "&quot;")}" />
    <meta property="og:description" content="${route.description.replace(/"/g, "&quot;")}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${SITE}/og-image.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${route.title.replace(/"/g, "&quot;")}" />
    <meta name="twitter:description" content="${route.description.replace(/"/g, "&quot;")}" />
    <meta name="twitter:image" content="${SITE}/og-image.png" />

    ${jsonLdTags}
    ${assetTags}
  </head>
  <body>
    <div id="root">${NAV}${route.body}
    </div>
  </body>
</html>
`;
}

function main() {
  const indexPath = resolve(DIST, "index.html");
  if (!existsSync(indexPath)) {
    console.warn(`prerender: ${indexPath} not found — skipping (was vite build run?)`);
    return;
  }
  const indexHtml = readFileSync(indexPath, "utf8");
  const assetTags = extractHeadAssets(indexHtml);
  if (!assetTags) {
    console.warn("prerender: no Vite asset tags extracted from dist/index.html");
  }

  for (const route of ROUTES) {
    const outPath = route.path === "/"
      ? resolve(DIST, "index.html")
      : resolve(DIST, route.path.replace(/^\//, ""), "index.html");
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, renderPage(route, assetTags));
    console.log(`prerender: wrote ${outPath}`);
  }
  console.log(`prerender: ${ROUTES.length} public routes written`);
}

main();
