# Operations Runbook

> **v3.3 · Documentation reviewed 17 October 2026.** Current source and selected hosted schema, policies, settings and buckets were checked. This is not a full security audit, legal approval or device-delivery certification.

## Audience and safeguards

Developer troubleshooting reference. **Committee/office staff never run SQL (OPS-001); use doc 25.** Diagnose from the failing UI/network/log signal before changing policies. A signed-out demo role is not a permission test. Do not export personal data to unmanaged devices.

## Current task map

| Symptom | Check / next action |
|---|---|
| Sign-in fails | Hosted auth settings, user confirmation, public OAuth return origin and actual error; don't infer settings from source alone |
| Business invisible | Company `review_status`, `is_hidden`, safe view projection and grants; staff UI does not currently show full Approve/Reject workflow |
| Cannot follow / Following empty | Sign in, exercise actual business/person target, verify mutation/read-back and followed target filters |
| Comment says Member | Safe profile RPC requires login; verify stored display name and enrichment; never broaden private profiles read |
| Repost fails | Capture RPC error and read summary back; optimistic UI is not persistence |
| Compose/reply hidden by iOS keyboard | Visual viewport resize, 16px input, safe area, focus/scroll; compare actual device behavior |
| RFQ creation fails despite Access ON | Hosted insert still checks verified/approved/visible business and representative; do not claim the switch overrides this |
| RFQ empty signed out | Hosted RFQ listing reads require authentication |
| Contact reveal unavailable | `get_company_whatsapp` explicitly requires Paid/Broker/Admin; don't bypass by exposing company phone |
| Private chat inaccessible | Session plus room-company/representative access; `can_access_deal_room`, context and mutation RPC errors |
| Feed upload denied | Private `community-media`, opaque path, signed-in owner, current insert policy; no blanket bucket public toggle |
| Bulletin attachment denied/expired | Published attachment reference, authenticated signing policy, one-hour URL refresh |
| Bell changes but no device sound | History/realtime versus push are distinct; subscription, browser support, permission, VAPID, server hook and OS sound settings |
| Docs old | Rebuild `content.ts`, deploy `get-internal-doc`, read updated source through password-checked response |
| Docs 401 after secret rotation | Unlock again with the new secret; the password is held in memory and checked on every internal request |
| Payment queue empty | Expected: membership helpers are disabled stubs and hosted membership table is absent |
| Google Maps fails | Check configured custom connection and currently served origin allowlist; don't assume an old custom domain is attached |

## Release checks

- Run existing focused tests, including membership logic and `src/test/mobile-chrome.test.ts`; allow the preview harness to build.
- Test guest read-only feed and real signed-in interaction separately. Use a real authorised business for quotations/deals.
- Exercise post → open → reply to reply → repost/read-back; business/person follow → Following.
- Check Updates/Buzz/Following scroll direction, hidden chrome pointer behavior and FAB safe-area geometry.
- Verify `/market/:postId` detail still works while `/market` index redirects.
- Check install prompt where supported and iOS manual steps; test push on an installed supported device. Realtime badge is not push proof.
- Inspect latest scan findings/grants/RLS and run a recovery drill; a prior audit date is not today's clean bill.
- Verify all 29 docs and ZIP coverage, then publish only on an explicit owner request.

## Read-only diagnostics (developer)

```sql
-- Platform role distribution (no personal contact data)
select role, count(*) from public.user_roles group by role;

-- RFQ board status, not the removed rfqs table
select status, count(*) from public.rfq_listings group by status;

-- Paid/Free exclusivity violations
select user_id from public.user_roles
where role in ('free_member','paid_member','broker')
group by user_id
having bool_or(role='free_member')
   and (bool_or(role='paid_member') or bool_or(role='broker'));
```

Do not reuse old SQL targeting `rfqs`, `inquiry_products`, `rfq_responses`, `memberships`, the RFQ cart or ticker. Role updates go through reviewed admin actions or an authorised developer intervention with audit evidence, not casual committee queries.

## Admin surfaces actually present

Moderation tabs: Access, Companies, Products, Users, Circulars, Ads, Categories, Community, Anon Log, RFQs. Company rows expose Verify/Unverify and Hide/Unhide; Users has role buttons; Circulars has compose/Publish/Unpublish/Delete; RFQs has Hide/Unhide and force Expire. No email rejection workflow, red-dot queues or payment activation should be promised without implementation.

## Deployment/secrets/recovery

Keep `DOCS_PASSWORD`, Razorpay and VAPID private values in Lovable Cloud's secrets facilities; never write them in docs. Rotate external-service and app-side values together where relevant. Managed service-role/database credentials are not available to extract. Read logs without tokens/PII.

Backup frequency, retention and restore capability require a current hosted check and tested restore; don't state a daily snapshot guarantee from old prose. Storage recovery is separate from row recovery. Retention automation is absent; the officer coordinates any reviewed manual action through the developer.
