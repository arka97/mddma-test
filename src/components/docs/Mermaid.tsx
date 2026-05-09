import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

let initialized = false;
function ensureInit() {
  if (initialized) return;
  mermaid.initialize({
    startOnLoad: false,
    theme: "base",
    securityLevel: "strict",
    fontFamily: "inherit",
    themeVariables: {
      primaryColor: "hsl(220 70% 25%)",
      primaryTextColor: "hsl(45 75% 52%)",
      primaryBorderColor: "hsl(45 75% 52%)",
      lineColor: "hsl(220 25% 50%)",
      secondaryColor: "hsl(220 30% 92%)",
      tertiaryColor: "hsl(0 0% 100%)",
      background: "hsl(0 0% 100%)",
      mainBkg: "hsl(220 70% 25%)",
      secondBkg: "hsl(45 75% 95%)",
      textColor: "hsl(220 30% 15%)",
    },
  });
  initialized = true;
}

let counter = 0;

export function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    ensureInit();
    let cancelled = false;
    const id = `mmd-${++counter}-${Date.now()}`;
    mermaid
      .render(id, chart.trim())
      .then(({ svg }) => {
        if (!cancelled) setSvg(svg);
      })
      .catch((e) => {
        if (!cancelled) setErr(String(e?.message || e));
      });
    return () => {
      cancelled = true;
    };
  }, [chart]);

  if (err) {
    return (
      <pre className="my-4 p-4 rounded-md bg-destructive/10 text-destructive text-xs overflow-auto">
        Mermaid error: {err}
        {"\n\n"}
        {chart}
      </pre>
    );
  }

  return (
    <div
      ref={ref}
      className="my-6 flex justify-center overflow-x-auto rounded-lg border border-border bg-card p-4 [&_svg]:max-w-full [&_svg]:h-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
