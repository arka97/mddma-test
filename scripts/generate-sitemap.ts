// Generates public/sitemap.xml. Runs before `vite dev` and `vite build`.
// GTM-001: lists ONLY the public authority layer. Transactional routes
// (/directory, /products, /brands, /broker, /market, /community, /dashboard,
// /account/*, /documents, /login, /forms) are intentionally excluded —
// they are `noindex` per-route via <Seo noindex />.

import { writeFileSync, readdirSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const BASE_URL = "https://mddma.org";
const SUPABASE_URL = "https://jkqckirzgdfgssgcfags.supabase.co";
const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprcWNraXJ6Z2RmZ3NzZ2NmYWdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NjI2ODQsImV4cCI6MjA5MjUzODY4NH0.DCmiaON6xBZBeqjwdSrKBfUnwZvAgmlK1E709BESt3I";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

// Public authority layer only. Legal pack (/privacy /terms /refund /grievance)
// is deferred to the sitemap until LEGAL-001 ships counsel-reviewed copy.
const staticEntries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.9" },
  { path: "/membership", changefreq: "monthly", priority: "0.8" },
  { path: "/apply", changefreq: "monthly", priority: "0.7" },
  { path: "/install", changefreq: "monthly", priority: "0.5" },
  { path: "/circulars", changefreq: "weekly", priority: "0.7" },
  { path: "/contact", changefreq: "monthly", priority: "0.6" },
];

// Circular detail pages (/circulars/<slug>) are intentionally NOT emitted —
// no public route handles them yet (see src/routes.tsx). The /circulars index
// remains indexable. Restore detail emission once a public CircularDetail route ships.


function readKnowledgeSlugs(): string[] {
  const dir = resolve("src/content/knowledge");
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

function xml(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

async function main() {
  const circulars = await fetchPublishedCircularSlugs();
  const knowledge = readKnowledgeSlugs();

  // /knowledge index + knowledge slugs only included when articles exist
  // (route is not wired up yet — avoid 404 entries per SEO sitemap audit).
  const knowledgeEntries: SitemapEntry[] =
    knowledge.length > 0
      ? [
          { path: "/knowledge", changefreq: "weekly", priority: "0.8" },
          ...knowledge.map((s) => ({ path: `/knowledge/${s}`, changefreq: "monthly" as const, priority: "0.7" })),
        ]
      : [];

  const entries: SitemapEntry[] = [
    ...staticEntries,
    ...knowledgeEntries,
    ...circulars.map((s) => ({ path: `/circulars/${s}`, changefreq: "monthly" as const, priority: "0.6" })),
  ];

  const seen = new Set<string>();
  const unique = entries.filter((e) => (seen.has(e.path) ? false : (seen.add(e.path), true)));

  writeFileSync(resolve("public/sitemap.xml"), xml(unique));
  console.log(
    `sitemap.xml written — ${unique.length} entries (${knowledge.length} knowledge, ${circulars.length} circulars, public layer only — GTM-001)`,
  );
}

main().catch((err) => {
  console.error("sitemap generation failed:", err);
  process.exit(0); // don't block dev/build
});
