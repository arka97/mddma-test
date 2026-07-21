import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

const TIMEOUT_MS = 6000;
const MAX_BYTES = 1_500_000;
const cache = new Map<string, { at: number; data: unknown }>();
const CACHE_TTL = 10 * 60 * 1000;

function ipIsPrivate(ip: string): boolean {
  const m = ip.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (m) {
    const [a, b] = [parseInt(m[1]), parseInt(m[2])];
    if (a === 10) return true;
    if (a === 127) return true;
    if (a === 0) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
    if (a >= 224) return true; // multicast + reserved
    return false;
  }
  const v6 = ip.toLowerCase();
  if (v6 === "::1" || v6 === "::") return true;
  if (v6.startsWith("fc") || v6.startsWith("fd")) return true; // ULA
  if (v6.startsWith("fe80")) return true; // link-local
  if (v6.startsWith("ff")) return true; // multicast
  const mapped = v6.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) return ipIsPrivate(mapped[1]);
  return false;
}

async function assertPublicHost(hostname: string): Promise<void> {
  const h = hostname.toLowerCase();
  if (!h || h === "localhost" || h.endsWith(".localhost") || h.endsWith(".local") || h.endsWith(".internal")) {
    throw new Error("blocked_host");
  }
  // Literal IP: check directly.
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(h) || h.includes(":")) {
    if (ipIsPrivate(h)) throw new Error("blocked_host");
    return;
  }
  // Resolve DNS and verify no A/AAAA record points to private space (SSRF/DNS-rebinding guard).
  let ips: string[] = [];
  const results = await Promise.allSettled([
    Deno.resolveDns(h, "A"),
    Deno.resolveDns(h, "AAAA"),
  ]);
  for (const r of results) {
    if (r.status === "fulfilled") ips = ips.concat(r.value);
  }
  if (ips.length === 0) throw new Error("dns_no_records");
  for (const ip of ips) {
    if (ipIsPrivate(ip)) throw new Error("blocked_host");
  }
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
  try { return new URL(url, base).toString(); } catch { return null; }
}

function extYoutubeId(u: URL): string | null {
  const host = u.hostname.replace(/^www\./, "");
  if (host === "youtu.be") {
    const id = u.pathname.split("/").filter(Boolean)[0];
    return id && /^[\w-]{6,}$/.test(id) ? id : null;
  }
  if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
    const v = u.searchParams.get("v");
    if (v && /^[\w-]{6,}$/.test(v)) return v;
    const parts = u.pathname.split("/").filter(Boolean);
    if ((parts[0] === "shorts" || parts[0] === "embed" || parts[0] === "live") && parts[1]) {
      return /^[\w-]{6,}$/.test(parts[1]) ? parts[1] : null;
    }
  }
  return null;
}

function extVimeoId(u: URL): string | null {
  const host = u.hostname.replace(/^www\./, "");
  if (!host.endsWith("vimeo.com")) return null;
  const id = u.pathname.split("/").filter(Boolean).pop();
  return id && /^\d{5,}$/.test(id) ? id : null;
}

async function youtubeOembed(targetUrl: string, videoId: string) {
  let oembed: { title?: string; author_name?: string; thumbnail_url?: string } = {};
  try {
    const r = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(targetUrl)}&format=json`,
      { headers: { accept: "application/json" } },
    );
    if (r.ok) oembed = await r.json();
  } catch { /* ignore */ }
  const image =
    oembed.thumbnail_url ??
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  return {
    url: targetUrl,
    title: oembed.title ?? null,
    description: oembed.author_name ? `By ${oembed.author_name}` : null,
    image,
    site_name: "YouTube",
    kind: "video" as const,
    provider: "youtube" as const,
    video_id: videoId,
    embed_url: `https://www.youtube.com/embed/${videoId}`,
    video_url: null,
  };
}

async function vimeoOembed(targetUrl: string, videoId: string) {
  let oembed: { title?: string; author_name?: string; thumbnail_url?: string; description?: string } = {};
  try {
    const r = await fetch(
      `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(targetUrl)}`,
      { headers: { accept: "application/json" } },
    );
    if (r.ok) oembed = await r.json();
  } catch { /* ignore */ }
  return {
    url: targetUrl,
    title: oembed.title ?? null,
    description: oembed.description ?? (oembed.author_name ? `By ${oembed.author_name}` : null),
    image: oembed.thumbnail_url ?? null,
    site_name: "Vimeo",
    kind: "video" as const,
    provider: "vimeo" as const,
    video_id: videoId,
    embed_url: `https://player.vimeo.com/video/${videoId}`,
    video_url: null,
  };
}

function detectMediaByExt(u: URL): { kind: "image" | "video" | "pdf" } | null {
  const p = u.pathname.toLowerCase();
  if (/\.(jpe?g|png|gif|webp|avif|bmp|svg)$/.test(p)) return { kind: "image" };
  if (/\.(mp4|webm|mov|m4v)$/.test(p)) return { kind: "video" };
  if (/\.pdf$/.test(p)) return { kind: "pdf" };
  return null;
}

async function fetchWithRedirectGuard(startUrl: string, signal: AbortSignal): Promise<Response> {
  let currentUrl = startUrl;
  for (let hop = 0; hop < 5; hop++) {
    const u = new URL(currentUrl);
    if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error("invalid_protocol");
    await assertPublicHost(u.hostname);
    const res = await fetch(u.toString(), {
      method: "GET",
      redirect: "manual",
      signal,
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; MDDMA-LinkPreview/1.0; +https://mddma.org)",
        accept: "text/html,application/xhtml+xml,*/*",
      },
    });
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      try { await res.body?.cancel(); } catch { /* ignore */ }
      if (!loc) return res;
      currentUrl = new URL(loc, currentUrl).toString();
      continue;
    }
    return res;
  }
  throw new Error("too_many_redirects");
}

async function fetchScrape(targetUrl: string) {
  const u = new URL(targetUrl);
  if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error("invalid_protocol");
  await assertPublicHost(u.hostname);

  // YouTube/Vimeo via oEmbed (don't scrape consent walls)
  const yt = extYoutubeId(u);
  if (yt) return await youtubeOembed(targetUrl, yt);
  const vm = extVimeoId(u);
  if (vm) return await vimeoOembed(targetUrl, vm);

  // Direct media files
  const mediaExt = detectMediaByExt(u);
  if (mediaExt) {
    const host = u.hostname.replace(/^www\./, "");
    const filename = u.pathname.split("/").pop() ?? host;
    if (mediaExt.kind === "image") {
      return {
        url: targetUrl, title: filename, description: null,
        image: targetUrl, site_name: host,
        kind: "image" as const, provider: null, video_id: null, embed_url: null, video_url: null,
      };
    }
    if (mediaExt.kind === "video") {
      return {
        url: targetUrl, title: filename, description: null,
        image: null, site_name: host,
        kind: "video" as const, provider: null, video_id: null, embed_url: null, video_url: targetUrl,
      };
    }
    return {
      url: targetUrl, title: filename, description: null,
      image: null, site_name: host,
      kind: "pdf" as const, provider: null, video_id: null, embed_url: null, video_url: null,
    };
  }

  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetchWithRedirectGuard(u.toString(), ctl.signal);
  } finally { clearTimeout(t); }


  const ct = (res.headers.get("content-type") ?? "").toLowerCase();
  const host = u.hostname.replace(/^www\./, "");

  // Content-type based media detection (for URLs without extensions)
  if (ct.startsWith("image/")) {
    return {
      url: res.url, title: u.pathname.split("/").pop() || host, description: null,
      image: res.url, site_name: host,
      kind: "image" as const, provider: null, video_id: null, embed_url: null, video_url: null,
    };
  }
  if (ct.startsWith("video/")) {
    return {
      url: res.url, title: u.pathname.split("/").pop() || host, description: null,
      image: null, site_name: host,
      kind: "video" as const, provider: null, video_id: null, embed_url: null, video_url: res.url,
    };
  }
  if (ct.includes("application/pdf")) {
    return {
      url: res.url, title: u.pathname.split("/").pop() || host, description: null,
      image: null, site_name: host,
      kind: "pdf" as const, provider: null, video_id: null, embed_url: null, video_url: null,
    };
  }

  if (!res.ok) throw new Error(`fetch_failed_${res.status}`);
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
      if (total >= MAX_BYTES) { try { await reader.cancel(); } catch { /* ignore */ } break; }
    }
  }
  const buf = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) { buf.set(c, off); off += c.length; }
  const html = new TextDecoder("utf-8", { fatal: false }).decode(buf);

  const headMatch = html.match(/<head[\s\S]*?<\/head>/i);
  const head = headMatch ? headMatch[0] : html.slice(0, 200_000);

  const title = pickMeta(head, [
    /<meta\s+(?:property|name)=["']og:title["']\s+content=["']([^"']+)["']/i,
    /<meta\s+content=["']([^"']+)["']\s+(?:property|name)=["']og:title["']/i,
    /<meta\s+name=["']twitter:title["']\s+content=["']([^"']+)["']/i,
    /<title[^>]*>([^<]+)<\/title>/i,
  ]);
  const description = pickMeta(head, [
    /<meta\s+(?:property|name)=["']og:description["']\s+content=["']([^"']+)["']/i,
    /<meta\s+name=["']twitter:description["']\s+content=["']([^"']+)["']/i,
    /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i,
  ]);
  const imageRaw = pickMeta(head, [
    /<meta\s+(?:property|name)=["']og:image:secure_url["']\s+content=["']([^"']+)["']/i,
    /<meta\s+(?:property|name)=["']og:image["']\s+content=["']([^"']+)["']/i,
    /<meta\s+name=["']twitter:image(?::src)?["']\s+content=["']([^"']+)["']/i,
    /<link\s+rel=["']image_src["']\s+href=["']([^"']+)["']/i,
  ]);
  const videoRaw = pickMeta(head, [
    /<meta\s+(?:property|name)=["']og:video:secure_url["']\s+content=["']([^"']+)["']/i,
    /<meta\s+(?:property|name)=["']og:video:url["']\s+content=["']([^"']+)["']/i,
    /<meta\s+(?:property|name)=["']og:video["']\s+content=["']([^"']+)["']/i,
    /<meta\s+name=["']twitter:player:stream["']\s+content=["']([^"']+)["']/i,
  ]);
  const ogType = pickMeta(head, [
    /<meta\s+(?:property|name)=["']og:type["']\s+content=["']([^"']+)["']/i,
  ]);
  const siteName = pickMeta(head, [
    /<meta\s+(?:property|name)=["']og:site_name["']\s+content=["']([^"']+)["']/i,
  ]) ?? host;

  const base = new URL(res.url);
  const image = imageRaw ? absolutize(imageRaw, base) : null;
  const video_url = videoRaw ? absolutize(videoRaw, base) : null;

  // Favicon fallback (so even empty pages get a small visual)
  let favicon: string | null = null;
  if (!image) {
    const iconRaw = pickMeta(head, [
      /<link\s+rel=["'](?:apple-touch-icon|apple-touch-icon-precomposed|icon|shortcut icon)["'][^>]*?href=["']([^"']+)["']/i,
      /<link\s+href=["']([^"']+)["'][^>]*?rel=["'](?:apple-touch-icon|icon|shortcut icon)["']/i,
    ]);
    favicon = iconRaw ? absolutize(iconRaw, base) : null;
  }

  const isVideo = !!video_url || (ogType && /video\./i.test(ogType));

  return {
    url: res.url,
    title: title ?? null,
    description: description ?? null,
    image: image ?? favicon,
    site_name: siteName,
    kind: (isVideo ? "video" : "link") as "video" | "link",
    provider: null,
    video_id: null,
    embed_url: null,
    video_url,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    // Require an authenticated caller with paid/broker/admin role (matches the paid feature gate).
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const token = authHeader.slice("Bearer ".length);
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims?.sub) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub as string;

    // Allow the call if features are globally opened by admin, or the user has a qualifying role.
    const [{ data: flagRow }, { data: roleRows }] = await Promise.all([
      supabase.from("app_settings").select("value").eq("key", "features_open_to_all").maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", userId),
    ]);
    const featuresOpen = (flagRow as { value?: unknown } | null)?.value === true;
    const roles = ((roleRows as Array<{ role: string }> | null) ?? []).map((r) => r.role);
    const allowed = featuresOpen || roles.some((r) => r === "admin" || r === "paid_member" || r === "broker");
    if (!allowed) {
      return new Response(JSON.stringify({ error: "forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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

    const data = await fetchScrape(url);
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
