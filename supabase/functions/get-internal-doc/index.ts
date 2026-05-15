// Serves "internal" markdown docs only after server-side password check.
// Files live next to this script under ./content/<NN-slug>.md and are NEVER
// shipped to the client bundle. Password is the same DOCS_PASSWORD secret
// used by verify-doc-password.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SLUG_TO_FILE: Record<string, string> = {
  "database-reference": "07-database-reference.md",
  "edge-functions-reference": "08-edge-functions-reference.md",
  "frontend-architecture": "09-frontend-architecture.md",
  "component-and-design": "10-component-and-design.md",
  "decisions-log": "11-decisions-log.md",
  "money-and-membership": "12-money-and-membership.md",
  "operations-runbook": "13-operations-runbook.md",
  "roadmap-and-glossary": "14-roadmap-and-glossary.md",
  "security-and-rls": "15-security-and-rls.md",
  "storage-and-media": "16-storage-and-media.md",
  "owner-quickstart": "17-owner-quickstart.md",
};

function constantTimeEqual(a: string, b: string) {
  const ea = new TextEncoder().encode(a);
  const eb = new TextEncoder().encode(b);
  let diff = ea.length ^ eb.length;
  const len = Math.max(ea.length, eb.length);
  for (let i = 0; i < len; i++) diff |= (ea[i] ?? 0) ^ (eb[i] ?? 0);
  return diff === 0;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const password = typeof body?.password === "string" ? body.password : "";
    const slug = typeof body?.slug === "string" ? body.slug : "";

    if (!password || password.length > 200) {
      return new Response(JSON.stringify({ ok: false, error: "Bad password" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const expected = Deno.env.get("DOCS_PASSWORD") ?? "";
    if (!expected || !constantTimeEqual(password, expected)) {
      return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Optional: list available slugs when none requested
    if (!slug) {
      return new Response(JSON.stringify({ ok: true, slugs: Object.keys(SLUG_TO_FILE) }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const file = SLUG_TO_FILE[slug];
    if (!file) {
      return new Response(JSON.stringify({ ok: false, error: "Unknown slug" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(`./content/${file}`, import.meta.url);
    const source = await Deno.readTextFile(url);

    return new Response(JSON.stringify({ ok: true, slug, source }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "Server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
