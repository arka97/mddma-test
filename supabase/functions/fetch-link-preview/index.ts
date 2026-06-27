import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const TIMEOUT_MS = 5000;
const MAX_BYTES = 1_000_000;
const cache = new Map<string, { at: number; data: unknown }>();
const CACHE_TTL = 10 * 60 * 1000;

function isPrivateHost(host: string): boolean {
  const h = host.toLowerCase();
  if (h === "localhost" || h.endsWith(".localhost")) return true;
  if (h === "0.0.0.0" || h === "::1") return true;
  // IPv4 literal
  const m = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (m) {
    const [a, b] = [parseInt(m[1]), parseInt(m[2])];
    if (a === 10) return true;
    if (a === 127) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 0) return true;
  }
  // IPv6 simple checks
  if (h.startsWith("fc") || h.startsWith("fd") || h.startsWith("fe80")) return true;
  return false;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
}

function pickMeta(html: string, patterns: RegExp[]): string | null {
  for (const re of patterns) {
    const m = html.match(re);
    if (m && m[1]) return decodeEntities(m[1]).trim().slice(0, 500);
  }
  return null;
}

function absolutize(url: string, base: URL): string | null {
  try {
    return new URL(url, base).toString();
  } catch {
    return null;
  }
}

async function fetchPreview(targetUrl: string) {
  const u = new URL(targetUrl);
  if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error("invalid_protocol");
  if (isPrivateHost(u.hostname)) throw new Error("blocked_host");

  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(u.toString(), {
      method: "GET",
      redirect: "follow",
      signal: ctl.signal,
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; MDDMA-LinkPreview/1.0)",
        accept: "text/html,application/xhtml+xml",
      },
    });
  } finally {
    clearTimeout(t);
  }
  if (!res.ok) throw new Error(`fetch_failed_${res.status}`);
  const ct = res.headers.get("content-type") ?? "";
  if (!ct.includes("text/html") && !ct.includes("xhtml")) throw new Error("not_html");

  const reader = res.body?.getReader();
  if (!reader) throw new Error("no_body");
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      total += value.length;
      chunks.push(value);
      if (total >= MAX_BYTES) {
        try { await reader.cancel(); } catch { /* ignore */ }
        break;
      }
    }
  }
  const buf = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) { buf.set(c, off); off += c.length; }
  const html = new TextDecoder("utf-8", { fatal: false }).decode(buf);

  const headMatch = html.match(/<head[\s\S]*?<\/head>/i);
  const head = headMatch ? headMatch[0] : html.slice(0, 100_000);

  const title =
    pickMeta(head, [
      /<meta\s+(?:property|name)=["']og:title["']\s+content=["']([^"']+)["']/i,
      /<meta\s+content=["']([^"']+)["']\s+(?:property|name)=["']og:title["']/i,
      /<meta\s+name=["']twitter:title["']\s+content=["']([^"']+)["']/i,
      /<title[^>]*>([^<]+)<\/title>/i,
    ]) ?? null;

  const description = pickMeta(head, [
    /<meta\s+(?:property|name)=["']og:description["']\s+content=["']([^"']+)["']/i,
    /<meta\s+name=["']twitter:description["']\s+content=["']([^"']+)["']/i,
    /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i,
  ]);

  const imageRaw = pickMeta(head, [
    /<meta\s+(?:property|name)=["']og:image:secure_url["']\s+content=["']([^"']+)["']/i,
    /<meta\s+(?:property|name)=["']og:image["']\s+content=["']([^"']+)["']/i,
    /<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i,
  ]);

  const siteName = pickMeta(head, [
    /<meta\s+(?:property|name)=["']og:site_name["']\s+content=["']([^"']+)["']/i,
  ]) ?? u.hostname.replace(/^www\./, "");

  const base = new URL(res.url);
  const image = imageRaw ? absolutize(imageRaw, base) : null;

  return {
    url: res.url,
    title,
    description,
    image,
    site_name: siteName,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const body = await req.json().catch(() => ({}));
    const url = typeof body?.url === "string" ? body.url.trim() : "";
    if (!url || url.length > 2048) {
      return new Response(JSON.stringify({ error: "invalid_url" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const now = Date.now();
    const cached = cache.get(url);
    if (cached && now - cached.at < CACHE_TTL) {
      return new Response(JSON.stringify(cached.data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await fetchPreview(url);
    cache.set(url, { at: now, data });
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "failed" }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
