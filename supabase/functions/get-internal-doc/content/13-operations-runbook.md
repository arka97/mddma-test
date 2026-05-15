# Operations Runbook

The day-to-day playbook. Skim the table of contents; jump to the recipe you need.

## Recipes

1. Seed demo data for a pilot
2. Rotate a secret
3. Manually grant a role
4. Manually verify a member
5. Find a stuck RFQ
6. Read edge function logs
7. Debug a failed Razorpay webhook
8. Restore a soft-hidden company / product
9. Change the docs password
10. Publish a circular
11. Place a homepage ad
12. Common psql queries

---

### 1 · Seed demo data for a pilot

Discovery pages render only what's in the database. Insert a handful of real companies and products via the admin UI:

1. Sign in as `admin@mddma.org`.
2. `/account/company` — create a company you control as a smoke test.
3. `/account/products` — add 2–3 products with variants.
4. `/account/moderation` → **Members** — promote 5–10 founders to `paid_member`.
5. Have those members add their own companies + products.
6. `/account/moderation` → **Circulars** — publish ≥3 announcements.
7. `/account/moderation` → **Ads** — at least 1 active homepage banner.

The home page only looks "full" once 3+ products and 1+ ad exist.

### 2 · Rotate a secret

Secrets live in Lovable Cloud secrets manager. To rotate:

1. Generate the new value (Razorpay dashboard, etc.).
2. Update the secret in Lovable Cloud — secret name does **not** change. Edge functions pick up new values on next invocation.
3. For `RAZORPAY_WEBHOOK_SECRET` only: also update the corresponding Razorpay dashboard webhook secret. Both must match exactly.

Active secrets used by this project:

| Secret | Used by |
|---|---|
| `DOCS_PASSWORD` | `verify-doc-password` |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | `razorpay-create-payment-link` |
| `RAZORPAY_WEBHOOK_SECRET` | `razorpay-webhook` |
| `LOVABLE_API_KEY` | (reserved — AI features) |
| `SUPABASE_*` | injected automatically — do not rotate manually |

### 3 · Manually grant a role

The admin UI handles this. SQL fallback:

```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('<uuid>', 'paid_member');
```

The `remove_free_when_upgraded` trigger removes the `free_member` row automatically. To remove a role:

```sql
DELETE FROM public.user_roles WHERE user_id='<uuid>' AND role='paid_member';
```

If you removed all paid/broker rows manually, also restore free:

```sql
SELECT public.downgrade_to_free('<uuid>');
```

### 4 · Manually verify a member

Use `/account/moderation` → toggle `is_verified` on the company, or run:

```sql
UPDATE public.companies SET is_verified = true WHERE slug = '<slug>';
```

To bump KYC tier on a profile (admin / service role only — non-admin writes are blocked by `prevent_profile_privilege_escalation`):

```sql
UPDATE public.profiles
   SET verification_tier = 'gst',
       gst_verified_at   = now(),
       company_verified_at = COALESCE(company_verified_at, now()),
       email_verified_at   = COALESCE(email_verified_at,   now()),
       buyer_reputation_score = 80
 WHERE id = '<user-uuid>';
```

There is no `promote-verification` edge function — promotion is admin-driven.

### 5 · Find a stuck RFQ

A "stuck" RFQ is `status='new'` for more than 7 days with no response.

```sql
SELECT r.id, r.product_name, r.created_at, p.full_name AS buyer, c.name AS seller
FROM rfqs r
LEFT JOIN profiles p ON p.id = r.buyer_id
LEFT JOIN companies c ON c.id = r.company_id
WHERE r.status = 'new'
  AND r.created_at < now() - interval '7 days'
ORDER BY r.created_at;
```

To force-expire:

```sql
UPDATE rfqs SET status = 'expired' WHERE id = '<uuid>';
```

### 6 · Read edge function logs

In Lovable Cloud, open the project's Cloud panel and look at the function-specific log streams. Useful filters:

| Function | What to grep |
|---|---|
| `razorpay-webhook` | `signature mismatch`, `activate_membership failed`, `activated membership` |
| `razorpay-create-payment-link` | `Razorpay create link failed`, the HTTP status |
| `get-internal-doc` | `Unknown slug` (means a doc was added to `_meta.ts` but not to `SLUG_TO_FILE`) |
| `verify-doc-password` | usually silent — only logs on 500 |

### 7 · Debug a failed Razorpay webhook

Symptoms: user paid, role didn't grant.

1. **Razorpay dashboard → Webhooks → recent deliveries.** Look for the failed POST.
2. If status code is **401**, `RAZORPAY_WEBHOOK_SECRET` mismatch. Compare the value in Lovable secrets with the one in Razorpay dashboard. Rotate if needed (recipe 2).
3. If status code is **400**, the payload is malformed or `notes.membership_id` is missing. The link must have been created **outside** our edge function. Re-create via the admin UI.
4. If status code is **500**, look at `razorpay-webhook` logs for the actual error. Most common: `activate_membership` RPC failed because the membership row doesn't exist (was deleted) or `_payload` is malformed.
5. **Replay**: in the Razorpay dashboard, click "Resend" on the delivery. The webhook is idempotent.
6. **Manual fallback**: use `/account/moderation` → "Mark active manually" with the actual amount paid.

### 8 · Restore a soft-hidden company / product

```sql
UPDATE companies SET is_hidden = false WHERE slug = '<slug>';
UPDATE products  SET is_hidden = false WHERE slug = '<slug>';
```

If `review_status='rejected'` you also need:

```sql
UPDATE companies SET review_status = 'approved', rejection_reason = null WHERE slug = '<slug>';
```

### 9 · Change the docs password

1. Update the `DOCS_PASSWORD` secret in Lovable Cloud.
2. Share the new value out-of-band with anyone who needs access. Never write the value into source-controlled files or memory documents.
3. Tell anyone who needs access. Old sessions cached in `sessionStorage` continue to work until the user closes the tab — that is intentional.

### 10 · Publish a circular

`/account/moderation` → **Circulars** → New → fill title + body + category → tick **Published**. The public list at `/circulars` shows only `is_published=true` rows. Unpublish by toggling the same checkbox.

### 11 · Place a homepage ad

`/account/moderation` → **Ads** → New. Required fields: `title`, `image_url` (upload to `ad-assets` bucket first), `placement` (default `homepage-banner`). Optional: `link_url`, `start_date`, `end_date`. The public RLS policy only shows ads where `is_active AND start_date <= today AND (end_date IS NULL OR end_date >= today)`.

### 12 · Common psql queries

**Role distribution**
```sql
SELECT role, count(*) FROM user_roles GROUP BY role ORDER BY count DESC;
```

**KYC funnel**
```sql
SELECT verification_tier, count(*) FROM profiles GROUP BY verification_tier;
```

**Active memberships expiring in next 30 days**
```sql
SELECT m.id, p.full_name, m.expires_at
FROM memberships m
JOIN profiles p ON p.id = m.profile_id
WHERE m.status = 'active'
  AND m.expires_at BETWEEN now() AND now() + interval '30 days'
ORDER BY m.expires_at;
```

**RFQ funnel by status**
```sql
SELECT status, count(*) FROM rfqs GROUP BY status ORDER BY count DESC;
```

**Top sellers by inquiry count (last 30 days)**
```sql
SELECT c.name, count(*) AS rfqs
FROM rfqs r
JOIN companies c ON c.id = r.company_id
WHERE r.created_at > now() - interval '30 days'
GROUP BY c.name
ORDER BY rfqs DESC
LIMIT 20;
```

**Recent signups**
```sql
SELECT id, full_name, created_at FROM profiles
ORDER BY created_at DESC LIMIT 25;
```

**Find users with both paid and free (should always return 0 rows)**
```sql
SELECT user_id, array_agg(role) AS roles
FROM user_roles
WHERE role IN ('free_member','paid_member','broker')
GROUP BY user_id
HAVING count(*) > 1
   AND 'free_member' = ANY(array_agg(role::text))
   AND ('paid_member' = ANY(array_agg(role::text)) OR 'broker' = ANY(array_agg(role::text)));
```

If this query ever returns rows, the ROLE-001 trigger has been bypassed. Run `SELECT downgrade_to_free(<uuid>); SELECT activate_membership(...);` to repair.

## Health checks before a release

1. `bunx vitest run` — must pass.
2. Spot-check `/`, `/directory`, `/products`, `/community`, `/documents`, `/account/profile`, `/account/moderation` (admin) — all render without console errors.
3. Use the role simulator to view the home page as Guest, Free, Paid, Broker, Admin. No layout shifts, no role badges where they shouldn't be.
4. Verify the live ticker shows ≥1 priced product. If empty, seed a product with `price_min` and `price_max`.
5. Submit a test RFQ as a Paid member, then check the Sent / Received tabs.
