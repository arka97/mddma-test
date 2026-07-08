// Auto-loaded knowledge base articles.
// Add a new .md file in this folder and it appears in /knowledge automatically.

interface FrontMatter {
  title: string;
  summary: string;
  published: string;
  readTime: string;
}

export interface KnowledgeArticle extends FrontMatter {
  slug: string;
  source: string;
}

const rawFiles = import.meta.glob<string>("./*.md", { as: "raw", eager: true });

function parse(source: string): { data: FrontMatter; body: string } {
  const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(source);
  if (!m) {
    return { data: { title: "", summary: "", published: "", readTime: "" }, body: source };
  }
  const data: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    data[key] = value;
  }
  return {
    data: {
      title: data.title ?? "",
      summary: data.summary ?? "",
      published: data.published ?? "",
      readTime: data.readTime ?? "",
    },
    body: m[2],
  };
}

export const KNOWLEDGE: KnowledgeArticle[] = Object.entries(rawFiles)
  .map(([path, source]) => {
    const slug = path.replace(/^\.\//, "").replace(/\.md$/, "");
    const { data, body } = parse(source);
    return { slug, source: body, ...data };
  })
  .sort((a, b) => (a.published < b.published ? 1 : -1));

export function getKnowledgeArticle(slug: string) {
  return KNOWLEDGE.find((k) => k.slug === slug) ?? null;
}
