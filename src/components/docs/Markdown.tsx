import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { Mermaid } from "./Mermaid";

export function Markdown({ source }: { source: string }) {
  return (
    <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-4xl prose-h2:text-2xl prose-h2:mt-10 prose-h2:pb-2 prose-h2:border-b prose-h2:border-border prose-h3:text-xl prose-a:text-accent hover:prose-a:underline prose-strong:text-foreground prose-code:text-accent prose-code:before:content-none prose-code:after:content-none prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-muted prose-pre:text-foreground prose-blockquote:border-l-accent prose-blockquote:text-foreground prose-blockquote:not-italic prose-table:text-sm prose-th:bg-muted prose-th:text-foreground prose-li:marker:text-accent">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]]}
        components={{
          code({ className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            const lang = match?.[1];
            const text = String(children).replace(/\n$/, "");
            if (lang === "mermaid") {
              return <Mermaid chart={text} />;
            }
            const isInline = !className;
            if (isInline) {
              return <code className={className} {...props}>{children}</code>;
            }
            return (
              <pre className="overflow-x-auto rounded-md bg-muted p-4 text-sm">
                <code className={className} {...props}>{text}</code>
              </pre>
            );
          },
          pre({ children }: any) {
            // react-markdown wraps code in <pre>; we already render <pre> in code() above for fenced.
            // For mermaid the Mermaid component is returned directly — unwrap if it's our custom node.
            return <>{children}</>;
          },
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
