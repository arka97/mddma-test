import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import JSZip from "jszip";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, FileText, CheckCircle2, Circle, Package } from "lucide-react";
import { DOCS, SOURCES } from "@/content/docs/_meta";

const READ_KEY = "mddma:doc-read";

async function downloadAll() {
  const zip = new JSZip();
  const folder = zip.folder("mddma-docs")!;
  folder.file(
    "README.md",
    `# MDDMA Documentation\n\nCanonical specification, in reading order:\n\n${DOCS.map(
      (d) => `- ${d.number}. **${d.title}** — ${d.summary} (\`${d.slug}.md\`)`,
    ).join("\n")}\n`,
  );
  for (const d of DOCS) {
    folder.file(`${d.number}-${d.slug}.md`, SOURCES[d.slug]);
  }
  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mddma-docs.zip";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const DocumentsHub = () => {
  const [read, setRead] = useState<Set<string>>(new Set());
  useEffect(() => {
    try {
      setRead(new Set<string>(JSON.parse(localStorage.getItem(READ_KEY) || "[]")));
    } catch {}
  }, []);

  return (
    <div className="min-h-screen bg-primary text-primary-foreground">
      <div className="max-w-5xl mx-auto px-6 py-16 space-y-10">
        <div className="text-center space-y-4">
          <Badge className="bg-accent text-primary font-semibold text-sm px-4 py-1">v3.1 · April 2026</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            MDDMA <span className="gold-gradient-text">Documentation</span>
          </h1>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto">
            One canonical specification — six markdown documents, read in order. Diagrams included. Download any single doc or the full set.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button onClick={downloadAll} className="bg-accent hover:bg-accent/90 text-primary font-semibold">
              <Download className="h-4 w-4 mr-2" /> Download all (.zip)
            </Button>
          </div>
        </div>

        {/* reading order strip */}
        <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
          {DOCS.map((d, i) => (
            <div key={d.slug} className="flex items-center gap-2">
              <Link
                to={`/documents/${d.slug}`}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full border transition-colors ${
                  read.has(d.slug)
                    ? "bg-accent/15 border-accent text-accent"
                    : "border-primary-foreground/20 text-primary-foreground/70 hover:border-accent hover:text-accent"
                }`}
              >
                {read.has(d.slug) ? <CheckCircle2 className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
                {d.number} · {d.title}
              </Link>
              {i < DOCS.length - 1 && <ArrowRight className="h-3 w-3 text-primary-foreground/30" />}
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {DOCS.map((doc) => (
            <Link key={doc.slug} to={`/documents/${doc.slug}`}>
              <Card className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground card-hover h-full">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold gold-gradient-text">{doc.number}</span>
                      <FileText className="h-5 w-5 text-accent" />
                    </div>
                    {read.has(doc.slug) && (
                      <Badge variant="outline" className="text-xs border-accent/40 text-accent">read</Badge>
                    )}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{doc.title}</h3>
                    <p className="text-sm text-primary-foreground/60">{doc.summary}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap text-xs text-primary-foreground/50">
                    <Badge variant="outline" className="border-primary-foreground/20 text-primary-foreground/70 text-xs">
                      {doc.readTime}
                    </Badge>
                    {doc.diagramCount > 0 && (
                      <Badge variant="outline" className="border-primary-foreground/20 text-primary-foreground/70 text-xs">
                        <Package className="h-3 w-3 mr-1" /> {doc.diagramCount} diagrams
                      </Badge>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-1 text-accent text-sm font-medium pt-1">
                    Open <ArrowRight className="h-3 w-3" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center text-xs text-primary-foreground/50 pt-4 border-t border-primary-foreground/10">
          Source-controlled in <code className="text-accent">src/content/docs/</code>. Updated April 2026.
        </div>
      </div>
    </div>
  );
};

export default DocumentsHub;
