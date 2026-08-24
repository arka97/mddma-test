import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const HOOK_SECRET = Deno.env.get("PUSH_HOOK_SECRET") ?? "";
const VAPID_PUBLIC = Deno.env.get("VAPID_PUBLIC_KEY") ?? "";
const VAPID_PRIVATE = Deno.env.get("VAPID_PRIVATE_KEY") ?? "";
const VAPID_SUBJECT = Deno.env.get("VAPID_SUBJECT") ?? "mailto:info@mddma.org";

const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

if (VAPID_PUBLIC && VAPID_PRIVATE) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);
}

type Category = "personal" | "deals" | "announcements" | "market";

function categoryFor(type: string): Category {
  if (["like", "comment", "repost", "follow"].includes(type)) return "personal";
  if (["deal_message", "quotation", "rfq_reply"].includes(type)) return "deals";
  if (type === "circular") return "announcements";
  return "market";
}

async function allowsCategory(userId: string, category: Category): Promise<boolean> {
  const { data } = await admin
    .from("notification_preferences")
    .select("personal,deals,announcements,market")
    .eq("user_id", userId)
    .maybeSingle();
  if (!data) return true; // default: everything on
  return Boolean((data as Record<string, boolean>)[category]);
}

/** Sends one payload to every registered device of a user; prunes dead endpoints. */
async function pushToUser(userId: string, payload: Record<string, unknown>) {
  const { data: subs } = await admin
    .from("push_subscriptions")
    .select("id,endpoint,p256dh,auth")
    .eq("user_id", userId);

  if (!subs?.length) return 0;
  const body = JSON.stringify(payload);
  let sent = 0;

  await Promise.all(
    subs.map(async (s) => {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          body,
          { TTL: 3600 },
        );
        sent += 1;
      } catch (err) {
        const status = (err as { statusCode?: number })?.statusCode;
        if (status === 404 || status === 410) {
          await admin.from("push_subscriptions").delete().eq("id", s.id);
        } else {
          console.error("push failed", status, (err as Error)?.message);
        }
      }
    }),
  );
  return sent;
}

/** Fans a broadcast out into individual notification rows (each row pushes itself). */
async function fanOutBroadcast(input: {
  category: Category;
  type: string;
  title: string;
  body?: string;
  url?: string;
  post_id?: string;
  circular_id?: string;
  actor_id?: string;
}) {
  const column = input.circular_id ? "circular_id" : "post_id";
  const value = input.circular_id ?? input.post_id;

  if (value) {
    const { count } = await admin
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("type", input.type)
      .eq(column, value);
    if ((count ?? 0) > 0) return { skipped: "already-sent" };
  }

  const { data: prefs } = await admin
    .from("notification_preferences")
    .select("user_id")
    .eq(input.category, false);
  const optedOut = new Set((prefs ?? []).map((p) => p.user_id));

  const { data: profiles } = await admin.from("profiles").select("id");
  const recipients = (profiles ?? [])
    .map((p) => p.id as string)
    .filter((id) => !optedOut.has(id) && id !== input.actor_id);

  const rows = recipients.map((id) => ({
    recipient_id: id,
    actor_id: input.actor_id ?? null,
    type: input.type,
    title: input.title,
    body: input.body ?? null,
    url: input.url ?? null,
    post_id: input.post_id ?? null,
    circular_id: input.circular_id ?? null,
  }));

  for (let i = 0; i < rows.length; i += 200) {
    const { error } = await admin.from("notifications").insert(rows.slice(i, i + 200));
    if (error) console.error("broadcast insert failed", error.message);
  }
  return { recipients: rows.length };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status,
    });

  if (!HOOK_SECRET || req.headers.get("x-push-secret") !== HOOK_SECRET) {
    return json({ error: "Unauthorized" }, 401);
  }
  if (!VAPID_PUBLIC || !VAPID_PRIVATE) return json({ error: "Push keys not configured" }, 503);

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  try {
    if (payload.kind === "broadcast") {
      const result = await fanOutBroadcast({
        category: (payload.category as Category) ?? "announcements",
        type: String(payload.type ?? "circular"),
        title: String(payload.title ?? "New update"),
        body: payload.body ? String(payload.body) : undefined,
        url: payload.url ? String(payload.url) : undefined,
        post_id: payload.post_id ? String(payload.post_id) : undefined,
        circular_id: payload.circular_id ? String(payload.circular_id) : undefined,
        actor_id: payload.actor_id ? String(payload.actor_id) : undefined,
      });
      return json({ ok: true, ...result });
    }

    if (payload.kind !== "notification" || typeof payload.id !== "string") {
      return json({ error: "Unsupported payload" }, 400);
    }

    const { data: n } = await admin
      .from("notifications")
      .select("id,recipient_id,type,title,body,url")
      .eq("id", payload.id)
      .maybeSingle();
    if (!n) return json({ error: "Notification not found" }, 404);

    const category = categoryFor(n.type);
    if (!(await allowsCategory(n.recipient_id, category))) {
      return json({ ok: true, skipped: "opted-out" });
    }

    const sent = await pushToUser(n.recipient_id, {
      title: n.title,
      body: n.body ?? "",
      url: n.url ?? "/notifications",
      tag: n.id,
    });
    return json({ ok: true, sent });
  } catch (err) {
    console.error("send-push error", (err as Error)?.message);
    return json({ error: "Push delivery failed" }, 500);
  }
});
