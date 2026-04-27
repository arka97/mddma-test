// Server-side verification tier promotion. Performs format checks and
// updates protected profile fields using the service role, bypassing the
// anti-self-promotion trigger.
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Tier = "unverified" | "email" | "company" | "gst";
const ORDER: Tier[] = ["unverified", "email", "company", "gst"];
const idx = (t: Tier) => ORDER.indexOf(t);

const GSTIN_RE = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;

    // Identify the caller
    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) return json({ error: "Unauthorized" }, 401);
    const user = userData.user;

    const body = await req.json().catch(() => ({}));
    const target = body?.target as Tier | undefined;
    if (!target || !ORDER.includes(target)) return json({ error: "Invalid target" }, 400);

    // Fetch current profile via service role
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data: profile, error: pErr } = await admin
      .from("profiles")
      .select("verification_tier,company_name,gstin")
      .eq("id", user.id)
      .maybeSingle();
    if (pErr || !profile) return json({ error: "Profile not found" }, 404);

    const current = (profile.verification_tier ?? "unverified") as Tier;
    if (idx(target) <= idx(current)) return json({ error: "Cannot demote" }, 400);

    const update: Record<string, unknown> = {};
    const now = new Date().toISOString();

    if (target === "email") {
      if (!user.email_confirmed_at) return json({ error: "Email not confirmed" }, 400);
      update.verification_tier = "email";
      update.email_verified_at = user.email_confirmed_at;
    } else if (target === "company") {
      const companyName = String(body?.company_name ?? "").trim();
      if (companyName.length < 2 || companyName.length > 120) {
        return json({ error: "Invalid company name" }, 400);
      }
      if (idx(current) < idx("email")) return json({ error: "Verify email first" }, 400);
      update.verification_tier = "company";
      update.company_name = companyName;
      update.company_verified_at = now;
    } else if (target === "gst") {
      const gstin = String(body?.gstin ?? "").trim().toUpperCase();
      if (!GSTIN_RE.test(gstin)) return json({ error: "Invalid GSTIN format" }, 400);
      if (idx(current) < idx("company")) return json({ error: "Verify company first" }, 400);
      update.verification_tier = "gst";
      update.gstin = gstin;
      update.gst_verified_at = now;
    }

    update.buyer_reputation_score = Math.min(100, idx(target as Tier) * 20 + (target === "gst" ? 20 : 0));

    const { error: uErr } = await admin.from("profiles").update(update).eq("id", user.id);
    if (uErr) {
      console.error("verification update failed", uErr);
      return json({ error: "Update failed" }, 500);
    }
    return json({ ok: true });
  } catch (err) {
    console.error("promote-verification error", err);
    return json({ error: "Server error" }, 500);
  }
});
