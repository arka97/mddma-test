import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

Deno.serve((req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const key = Deno.env.get("VAPID_PUBLIC_KEY") ?? "";
  return new Response(JSON.stringify({ publicKey: key }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: key ? 200 : 503,
  });
});
