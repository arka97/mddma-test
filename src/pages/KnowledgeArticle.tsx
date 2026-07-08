import { Link, useParams, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Seo } from "@/components/Seo";
import { Markdown } from "@/components/docs/Markdown";
import { ArrowLeft, Clock } from "lucide-react";
import { getKnowledgeArticle } from "@/content/knowledge/_meta";

const KnowledgeArticle = () => {
  const { slug = "" } = useParams();
  const article = getKnowledgeArticle(slug);
  if (!article) return <Navigate to="/knowledge" replace />;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.summary,
    datePublished: article.published,
    author: { "@type": "Organization", name: "MDDMA" },
    publisher: { "@type": "Organization", name: "MDDMA", logo: { "@type": "ImageObject", url: "https://mddma.org/icon-192.png" } },
  };

  return (
    <Layout>
      <Seo
        title={`${article.title} — MDDMA Knowledge`}
        description={article.summary}
        path={`/knowledge/${article.slug}`}
        ogType="article"
        jsonLd={jsonLd}
      />

      <article className="container mx-auto max-w-3xl px-5 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Link
          to="/knowledge"
          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" /> All articles
        </Link>

        <header className="mt-4 border-b border-border pb-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--gold-dark))]">
            Knowledge base
          </p>
          <h1 className="mt-1.5 text-2xl font-bold leading-tight text-foreground sm:text-3xl">
            {article.title}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">{article.summary}</p>
          <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
            <span>{new Date(article.published).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {article.readTime}</span>
          </div>
        </header>

        <div className="mt-6">
          <Markdown source={article.source} />
        </div>
      </article>
    </Layout>
  );
};

export default KnowledgeArticle;
