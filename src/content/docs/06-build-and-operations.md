# Build & Operations

> **v3.3 · Documentation reviewed 17 October 2026.** Current source and selected hosted schema, policies, settings and buckets were checked. This is not a full security audit, legal approval or device-delivery certification.

## Developer setup

```bash
bun install
bun run dev
```

Managed frontend configuration and generated Cloud client/types are not hand-edited. Private credentials belong in Lovable Cloud secrets, never source/docs. The managed service-role key/database password are not available to extract manually.

## Function configuration

| Configuration | Purpose |
|---|---|
| DOCS_PASSWORD | Vault verification and per-request internal markdown |
| VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY / VAPID_SUBJECT | Push application-server identity/signing |
| PUSH_HOOK_SECRET | Server invocation validation for send-push |
| RAZORPAY_KEY_ID / KEY_SECRET / WEBHOOK_SECRET, APP_URL | Retained legacy functions; not proof of enabled checkout |
| Google Maps connection | Configured external integration; verify actual public origin restrictions |
| Cloud-managed runtime values | Managed by platform; never document secret values |

Do not infer a configured/healthy service from a variable name. Current membership payments are disabled; restore/review before testing payment activation. No live keys before approved public legal policies.

## Documentation release

29 markdown docs: public-marked 00–06 in `src/content/docs`; internal 07–28 in the function content directory. Internal bodies must not be imported into the client.

```bash
bunx tsx scripts/build-internal-docs-bundle.ts
```

Deploy `get-internal-doc` after regeneration. Check bundle coverage, current served version, invalid password rejection, hub metadata and ZIP entries. The password is held in memory and rechecked for each internal response; reload relocks the vault. Editing loose markdown without rebuilding/deploying leaves hosted owner docs stale.

## Test and QA

```bash
bunx vitest run src/lib/__tests__/membership.test.ts src/test/mobile-chrome.test.ts
```

Tests cover retained money helpers and shared mobile chrome geometry. They do not certify physical iOS scroll/keyboard behavior, all push delivery or full RLS. Lovable's preview harness builds automatically; do not run the project's build/typecheck manually in the managed editing workflow.

Real-user release flow: guest reads permitted feed; signed-in member posts/replies/reposts/follows with read-back; authorised business creates RFQ/quote/chat; outsider denied private data; mobile Updates/Buzz/Following hides/restores chrome without overlay/click interception; compose/reply clears keyboard and safe areas.

## PWA and push

Generated `/sw.js` owns the app shell and imports `/push-sw.js`; do not register the handler script as a second root worker. Development/preview workers are blocked. Confirm Get App/native dialog where eligible, Safari manual iOS instructions, branded installed startup and updated cached assets.

Push requires supported browser/HTTPS, granted permission, stored valid subscription, VAPID/hook configuration and suitable OS settings. Realtime bell/history is not sound-delivery proof. Test on an installed supported iOS/Android device; history and preferences separately.

## Deployment, URLs and SEO

Use preview QA, then publish only when requested. Supplied project context currently reports `https://gbaug.lovable.app` and no custom domain attached; older mddma.org references require domain verification. Don't certify the domain from an old diagram.

`scripts/generate-sitemap.ts` / `prerender-public.ts` still use historical home/circular/paid-plan routes/content. Current feed/noindex behavior and new Discover/FAQ/Knowledge pages are not all represented consistently. Record SEO parity as **pending**; this documentation update does not change routes, head metadata or prerender scripts.

## Operational checks

| Situation | Operator/developer response |
|---|---|
| Business pending | Review evidence; current Companies UI Verify/Hide is not full Approve/Reject workflow |
| Cannot post/follow/repost | Real session, actual request error, relevant RPC/setting and read-back |
| RFQ blocked while switches ON | Direct verified-business policy still applies; don't bypass contact/role protection |
| Attachment expires | Refresh one-hour signing; published-reference/session required for Bulletin |
| Bell but no push | Trace trigger → row → hook → delivery → subscription/device; check OS settings |
| Refund/deletion request | Officer intake, draft policy review and authorised developer handling; no automated button promised |
| Empty membership queue | Expected disabled legacy helpers; absent hosted membership table |
| Vault body stale | Rebuild/deploy internal bundle and check response |
| Possible security issue | Latest logs/scan/grants/policies; don't broaden unrelated permissions |
| Recovery needed | Confirm hosted backup/retention settings and run a restore drill; don't assume daily snapshots |

## Roadmap without invented dates

**Implemented:** feed channels/social changes, business/team surfaces, RFQ/quote/chat entities, notification/PWA infrastructure and mobile geometry.

**Pending validation/approval:** exact override policy consistency, complete business review flow, device push and recovery drill, public legal pack, approved commercial packaging/restored payments, external BIL and retention automation.

**Unverified operational history:** pilot start/week/outcome and migration execution. Pilot plan remains 8–10 sellers + 8–10 buyers over 90 days, not “currently week 3” in October.

Committee never runs SQL. Doc 25 is their UI guide; doc 13 is developer diagnostics. Read next: 08 function delivery; 15 security; 26 retention; 27 pilot targets.
