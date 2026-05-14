import { useEffect, useRef } from "react";

interface DiscourseEmbedProps {
  embedUrl: string;
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

  useEffect(() => {
    window.DiscourseEmbed = { discourseUrl, discourseEmbedUrl: embedUrl };

    const meta = document.createElement("meta");
    meta.name = "discourse-username";
    meta.content = username;
    document.head.appendChild(meta);

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = `${discourseUrl}javascripts/embed.js`;
    document.head.appendChild(script);

    return () => {
      script.remove();
      meta.remove();
      delete window.DiscourseEmbed;
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [embedUrl, username, discourseUrl]);

  return (
    <div
      ref={containerRef}
      id="discourse-comments"
      className="rounded-lg border border-border bg-card p-4 min-h-[400px]"
    />
  );
}
