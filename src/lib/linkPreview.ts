import { supabase } from "@/integrations/supabase/client";

export interface LinkPreview {
  url: string;
  title: string | null;
  description: string | null;
  image: string | null;
  site_name: string | null;
}

const URL_RE = /\bhttps?:\/\/[^\s<>"']+/i;

export function extractFirstUrl(text: string): string | null {
  const m = text.match(URL_RE);
  if (!m) return null;
  // Trim trailing punctuation
  return m[0].replace(/[.,;:!?)\]}'"]+$/, "");
}

export async function fetchLinkPreview(url: string): Promise<LinkPreview | null> {
  try {
    const { data, error } = await supabase.functions.invoke("fetch-link-preview", {
      body: { url },
    });
    if (error) return null;
    const d = data as Partial<LinkPreview> & { error?: string };
    if (!d || d.error) return null;
    if (!d.title && !d.image && !d.description) return null;
    return {
      url: d.url ?? url,
      title: d.title ?? null,
      description: d.description ?? null,
      image: d.image ?? null,
      site_name: d.site_name ?? null,
    };
  } catch {
    return null;
  }
}

export function linkifyText(text: string): Array<{ type: "text" | "link"; value: string }> {
  const out: Array<{ type: "text" | "link"; value: string }> = [];
  const re = /\bhttps?:\/\/[^\s<>"']+/gi;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push({ type: "text", value: text.slice(last, m.index) });
    const raw = m[0].replace(/[.,;:!?)\]}'"]+$/, "");
    out.push({ type: "link", value: raw });
    last = m.index + raw.length;
  }
  if (last < text.length) out.push({ type: "text", value: text.slice(last) });
  return out;
}
