// Generates public/sitemap.xml. Runs before `vite dev` and `vite build`.
// Fetches dynamic slugs (companies, products, brands) via Supabase REST.

import { writeFileSync } from "node:fs";
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

const staticEntries: SitemapEntry[] = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.7" },
  { path: "/directory", changefreq: "daily", priority: "0.9" },
  { path: "/products", changefreq: "daily", priority: "0.9" },
  { path: "/brands", changefreq: "weekly", priority: "0.8" },
  { path: "/broker", changefreq: "weekly", priority: "0.7" },
  { path: "/market", changefreq: "daily", priority: "0.8" },
  { path: "/community", changefreq: "daily", priority: "0.7" },
  { path: "/membership", changefreq: "monthly", priority: "0.8" },
  { path: "/circulars", changefreq: "weekly", priority: "0.6" },
  { path: "/forms", changefreq: "monthly", priority: "0.5" },
  { path: "/contact", changefreq: "monthly", priority: "0.5" },
  { path: "/apply", changefreq: "monthly", priority: "0.6" },
  { path: "/install", changefreq: "monthly", priority: "0.4" },
];

async function fetchSlugs(table: string, filter = ""): Promise<string[]> {
  const url = `${SUPABASE_URL}/rest/v1/${table}?select=slug${filter ? `&${filter}` : ""}`;
  try {
    const res = await fetch(url, {
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
    });
    if (!res.ok) {
      console.warn(`sitemap: ${table} fetch failed (${res.status})`);
      return [];
    }
    const rows = (await res.json()) as Array<{ slug: string | null }>;
    return rows.map((r) => r.slug).filter((s): s is string => Boolean(s));
  } catch (err) {
    console.warn(`sitemap: ${table} fetch error`, err);
    return [];
  }
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
  const [companies, products, brands] = await Promise.all([
    fetchSlugs("companies_public"),
    fetchSlugs("products"),
    fetchSlugs("brands", "is_active=eq.true"),
  ]);

  const entries: SitemapEntry[] = [
    ...staticEntries,
    ...companies.map((s) => ({ path: `/store/${s}`, changefreq: "weekly" as const, priority: "0.7" })),
    ...products.map((s) => ({ path: `/products/${s}`, changefreq: "weekly" as const, priority: "0.6" })),
    ...brands.map((s) => ({ path: `/brands/${s}`, changefreq: "weekly" as const, priority: "0.6" })),
  ];

  writeFileSync(resolve("public/sitemap.xml"), xml(entries));
  console.log(
    `sitemap.xml written — ${entries.length} entries (${companies.length} stores, ${products.length} products, ${brands.length} brands)`,
  );
}

main().catch((err) => {
  console.error("sitemap generation failed:", err);
  process.exit(0); // don't block dev/build
});
