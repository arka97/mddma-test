import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Printer, ChevronRight } from "lucide-react";
import { Markdown } from "./Markdown";
import type { DocMeta } from "@/content/docs/_meta";

interface Heading {
  id: string;
  text: string;
  level: number;
}

function extractHeadings(md: string): Heading[] {
  const lines = md.split("\n");
  const out: Heading[] = [];
  let inFence = false;
  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (m) {
      const level = m[1].length;
      const text = m[2].replace(/`/g, "");
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      out.push({ id, text, level });
    }
  }
  return out;
}

function downloadMd(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function DocPage({ meta, source }: { meta: DocMeta; source: string }) {
  const headings = useMemo(() => extractHeadings(source), [source]);

  // mark as read
  useEffect(() => {
    try {
      const key = "mddma:doc-read";
      const set = new Set<string>(JSON.parse(localStorage.getItem(key) || "[]"));
      set.add(meta.slug);
      localStorage.setItem(key, JSON.stringify([...set]));
    } catch {}
  }, [meta.slug]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50 print:hidden">
        <div className="h-full bg-accent transition-all" style={{ width: `${progress}%` }} />
      </div>

      {/* top bar */}
      <div className="sticky top-0 z-40 bg-primary/95 backdrop-blur border-b border-primary-foreground/10 print:hidden">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link to="/documents" className="flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground text-sm">
            <ArrowLeft className="h-4 w-4" /> All documents
          </Link>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" onClick={() => downloadMd(`${meta.slug}.md`, source)}>
              <Download className="h-3 w-3 mr-1" /> .md
            </Button>
            <Button size="sm" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" onClick={() => window.print()}>
              <Printer className="h-3 w-3 mr-1" /> Print
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-10">
        <article>
          <header className="mb-8 space-y-3 not-prose">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-accent text-primary font-semibold">{meta.number}</Badge>
              <Badge variant="outline" className="text-xs">{meta.readTime}</Badge>
              {meta.diagramCount > 0 && (
                <Badge variant="outline" className="text-xs">{meta.diagramCount} diagrams</Badge>
              )}
            </div>
            <h1 className="text-4xl font-bold tracking-tight">{meta.title}</h1>
            <p className="text-muted-foreground">{meta.summary}</p>
          </header>

          <Markdown source={source} />

          <footer className="mt-16 pt-6 border-t border-border flex items-center justify-between text-sm not-prose">
            <Link to="/documents" className="text-accent hover:underline inline-flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" /> Documentation hub
            </Link>
            <Button variant="outline" size="sm" onClick={() => downloadMd(`${meta.slug}.md`, source)}>
              <Download className="h-3 w-3 mr-1" /> Download this doc
            </Button>
          </footer>
        </article>

        {/* TOC */}
        <aside className="hidden lg:block print:hidden">
          <div className="sticky top-24 space-y-2 text-sm">
            <p className="font-semibold uppercase tracking-wider text-xs text-muted-foreground">On this page</p>
            <nav className="space-y-1 max-h-[70vh] overflow-y-auto pr-2">
              {headings.map((h) => (
                <a
                  key={h.id}
                  href={`#${h.id}`}
                  className={`flex items-start gap-1 text-muted-foreground hover:text-accent transition-colors ${h.level === 3 ? "pl-4 text-xs" : ""}`}
                >
                  {h.level === 2 && <ChevronRight className="h-3 w-3 mt-1 flex-shrink-0" />}
                  <span>{h.text}</span>
                </a>
              ))}
            </nav>
          </div>
        </aside>
      </div>
    </div>
  );
}
