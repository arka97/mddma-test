import { useEffect, useRef, useState } from "react";
import { ExternalLink } from "lucide-react";

interface DiscourseEmbedProps {
  embedUrl?: string;
  username?: string;
  discourseUrl?: string;
}

declare global {
  interface Window {
    DiscourseEmbed?: {
      discourseUrl: string;
      discourseEmbedUrl: string;
      className?: string;
    };
  }
}

export function DiscourseEmbed({
  embedUrl,
  username = "system",
  discourseUrl = "https://mddma.discourse.group/",
}: DiscourseEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  const resolvedEmbedUrl =
    embedUrl ??
    (typeof window !== "undefined"
      ? `${window.location.origin}/community`
      : "https://mddma.org/community");

  useEffect(() => {
    setFailed(false);
    window.DiscourseEmbed = { discourseUrl, discourseEmbedUrl: resolvedEmbedUrl };

    const meta = document.createElement("meta");
    meta.name = "discourse-username";
    meta.content = username;
    document.head.appendChild(meta);

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = `${discourseUrl}javascripts/embed.js`;
    document.head.appendChild(script);

    // If after 6s the container has no iframe (Discourse refused to connect
    // or host is not whitelisted), show a friendly fallback.
    const timer = window.setTimeout(() => {
      const iframe = containerRef.current?.querySelector("iframe");
      if (!iframe) setFailed(true);
    }, 6000);

    return () => {
      window.clearTimeout(timer);
      script.remove();
      meta.remove();
      delete window.DiscourseEmbed;
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [resolvedEmbedUrl, username, discourseUrl]);

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        id="discourse-comments"
        className="rounded-lg border border-border bg-card p-4 min-h-[400px]"
      />
      {failed && (
        <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm">
          <p className="font-medium text-foreground mb-1">
            Forum embed couldn’t load on this domain.
          </p>
          <p className="text-muted-foreground mb-3">
            The current host is not yet allow-listed in Discourse’s Embeddable
            Hosts settings. You can still join the discussion directly:
          </p>
          <a
            href={discourseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
          >
            Open MDDMA Community Forum
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      )}
    </div>
  );
}
