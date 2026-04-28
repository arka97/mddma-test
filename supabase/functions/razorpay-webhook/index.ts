// Razorpay webhook receiver. Handles `payment_link.paid` events and flips
// the matching membership to active via the activate_membership(uuid, jsonb)
// SECURITY DEFINER function defined in 20260428100000_phase_d_payment_admin.sql.
//
// Required Supabase secret:
//   RAZORPAY_WEBHOOK_SECRET — copy from Razorpay dashboard → Webhooks
//
// Configure the webhook in Razorpay to send `payment_link.paid` (and
// `payment_link.partially_paid` if you ever enable partial payments) to:
//   https://<project>.functions.supabase.co/razorpay-webhook

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "x-razorpay-signature, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// HMAC-SHA256(rawBody, secret) — Razorpay's signature scheme.
async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Constant-time hex compare to dodge timing oracles.
function safeEqHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

interface RzPaymentLinkPaidPayload {
  event: string;
  payload: {
    payment_link: {
      entity: {
        id: string;
        notes: { membership_id?: string; tier?: string; profile_id?: string };
        amount_paid: number; // in paise
      };
    };
    payment: {
      entity: {
        id: string;
      };
    };
  };
}

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
    const SECRET = Deno.env.get("RAZORPAY_WEBHOOK_SECRET");

    if (!SECRET) return json({ error: "Webhook secret not configured" }, 500);

    const sig = req.headers.get("x-razorpay-signature") ?? "";
    const raw = await req.text();
    const expected = await hmacSha256Hex(SECRET, raw);
    if (!safeEqHex(sig, expected)) {
      console.warn("razorpay-webhook: signature mismatch");
      return json({ error: "Invalid signature" }, 401);
    }

    let body: RzPaymentLinkPaidPayload;
    try {
      body = JSON.parse(raw);
    } catch {
      return json({ error: "Malformed JSON" }, 400);
    }

    if (body.event !== "payment_link.paid") {
      // Acknowledge other events (refunded, expired, ...) without acting on them
      // so Razorpay stops retrying.
      return json({ ok: true, ignored: body.event });
    }

    const link = body.payload?.payment_link?.entity;
    const payment = body.payload?.payment?.entity;
    const membershipId = link?.notes?.membership_id;
    if (!link || !payment || !membershipId) {
      return json({ error: "Missing required fields in payload" }, 400);
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data, error } = await admin.rpc("activate_membership", {
      _membership_id: membershipId,
      _payload: {
        razorpay_payment_id: payment.id,
        razorpay_order_id: link.id,
        amount_paid_inr: String(Math.round((link.amount_paid ?? 0) / 100)),
      },
    });
    if (error) {
      console.error("activate_membership failed", error);
      return json({ error: error.message }, 500);
    }

    console.log("activated membership", membershipId, payment.id);
    return json({ ok: true, membership: data });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("razorpay-webhook error", msg);
    return json({ error: msg }, 500);
  }
});
