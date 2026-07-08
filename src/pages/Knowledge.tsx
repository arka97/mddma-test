import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { PageHeader } from "@/components/PageHeader";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import { KNOWLEDGE } from "@/content/knowledge/_meta";

const Knowledge = () => {
  return (
    <Layout>
      <Seo
        title="Knowledge Base — Dry Fruits, Dates & Trade Compliance"
        description="Field guides and compliance notes for India's dry-fruit trade — Mamra almond grading, Medjool storage, dry-fruit import basics and MDDMA verification."
        path="/knowledge"
      />

      <div className="container mx-auto max-w-4xl px-5 py-6 sm:px-6 sm:py-8 lg:px-8">
        <PageHeader
          eyebrow="Knowledge base"
          title="Field guides for the dry-fruit trade"
          description="Working notes from MDDMA's members on grading, storage, import paperwork and platform policy."
        />

        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {KNOWLEDGE.map((k) => (
            <li key={k.slug}>
              <Link
                to={`/knowledge/${k.slug}`}
                className="group flex h-full flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="space-y-2">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(var(--gold))]/15 text-[hsl(var(--gold-dark))]">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <h2 className="text-base font-semibold leading-snug text-foreground">{k.title}</h2>
                  <p className="text-xs leading-relaxed text-muted-foreground">{k.summary}</p>
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {k.readTime}
                  </span>
                  <span className="inline-flex items-center gap-1 font-medium text-accent group-hover:underline">
                    Read <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {KNOWLEDGE.length === 0 && (
          <p className="mt-8 rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
            Articles coming soon.
          </p>
        )}
      </div>
    </Layout>
  );
};

export default Knowledge;
