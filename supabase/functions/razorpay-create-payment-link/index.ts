// Admin-only: generate a Razorpay Payment Link for a pending membership.
// Stores the resulting plink id in memberships.razorpay_order_id.
//
// Required Supabase secrets:
//   RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
//   APP_URL (the public site URL, used for callback redirects)
//
// Caller must be authenticated AND have role='admin'. Service role is used
// only for the membership UPDATE — caller's auth token gates entry.

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface CreateLinkBody {
  membership_id: string;
  // Optional: override expiry seconds (default: link valid 14 days).
  expire_seconds?: number;
}

const TIER_PRICE_INR: Record<string, number> = {
  broker: 9999,
  trader: 14999,
  importer: 29999,
};

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
    const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID");
    const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
    const APP_URL = Deno.env.get("APP_URL") ?? "https://mddma.in";

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      return json({ error: "Razorpay not configured. Set RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET as Supabase secrets." }, 500);
    }

    // Identify and authorize the caller (admin only).
    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) return json({ error: "Unauthorized" }, 401);

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data: roleRows } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin");
    if (!roleRows || roleRows.length === 0) return json({ error: "Admin role required" }, 403);

    const body = (await req.json().catch(() => null)) as CreateLinkBody | null;
    if (!body?.membership_id) return json({ error: "membership_id required" }, 400);

    // Fetch the membership + buyer profile for prefill.
    const { data: m } = await admin
      .from("memberships")
      .select("id, profile_id, tier, status, razorpay_order_id")
      .eq("id", body.membership_id)
      .maybeSingle();
    if (!m) return json({ error: "Membership not found" }, 404);
    if (m.status !== "pending") return json({ error: `Membership status is "${m.status}", expected "pending"` }, 409);
    if (m.razorpay_order_id) {
      return json({ error: "Payment link already generated for this membership", razorpay_order_id: m.razorpay_order_id }, 409);
    }

    const { data: profile } = await admin
      .from("profiles")
      .select("full_name, phone")
      .eq("id", m.profile_id)
      .maybeSingle();
    const { data: authUser } = await admin.auth.admin.getUserById(m.profile_id);

    const amountInr = TIER_PRICE_INR[m.tier as string];
    if (!amountInr) return json({ error: `Unknown tier "${m.tier}"` }, 400);

    const expireSeconds = body.expire_seconds ?? 14 * 24 * 60 * 60;
    const expireBy = Math.floor(Date.now() / 1000) + expireSeconds;

    const linkPayload = {
      amount: amountInr * 100, // paise
      currency: "INR",
      accept_partial: false,
      expire_by: expireBy,
      reference_id: `membership-${m.id}`,
      description: `MDDMA Founding Membership — ${m.tier} (24-month lock)`,
      customer: {
        name: profile?.full_name ?? "MDDMA Member",
        email: authUser?.user?.email ?? undefined,
        contact: profile?.phone ?? undefined,
      },
      notify: { sms: !!profile?.phone, email: !!authUser?.user?.email },
      reminder_enable: true,
      notes: {
        membership_id: m.id,
        profile_id: m.profile_id,
        tier: m.tier,
      },
      callback_url: `${APP_URL}/account/verify?membership=${m.id}`,
      callback_method: "get",
    };

    const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);
    const rzResp = await fetch("https://api.razorpay.com/v1/payment_links", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Basic ${auth}` },
      body: JSON.stringify(linkPayload),
    });

    if (!rzResp.ok) {
      const errBody = await rzResp.text();
      console.error("Razorpay create link failed", rzResp.status, errBody);
      return json({ error: "Razorpay rejected the request", detail: errBody }, 502);
    }

    const link = await rzResp.json() as { id: string; short_url: string };

    await admin
      .from("memberships")
      .update({
        razorpay_order_id: link.id,
        payment_link_url: link.short_url,
        notes: `payment-link-created-by:${userData.user.id} at ${new Date().toISOString()}`,
      })
      .eq("id", m.id);

    return json({ payment_url: link.short_url, razorpay_order_id: link.id });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("create-payment-link error", msg);
    return json({ error: msg }, 500);
  }
});
