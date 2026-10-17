# Security, RLS & Threat Model

> **v3.3 · Documentation reviewed 17 October 2026.** Current source and selected hosted schema, policies, settings and buckets were checked. This is not a full security audit, legal approval or device-delivery certification.

## Review scope

Selected **hosted** policies/helpers/buckets were read on 17 October 2026. This reference is not a new vulnerability scan or certification; no security findings or policies were changed by this documentation refresh. Inspect current grants, policy combinations, triggers and RPC bodies before changing permissions.

## Identity and privilege boundaries

- Platform roles live in `public.user_roles`: admin, broker, paid_member, free_member. Never derive privileges from user-editable metadata.
- `has_role` is a security-definer role helper, avoiding recursive checks through role-table RLS.
- Company team roles are distinct. Team membership does not grant platform administration.
- Profile trust fields are guarded; self-service profile updates are not trust promotion.
- Signed-out role simulation changes presentation only; real auth/RLS remains authoritative.

## Checked current access snapshot

| Surface | Read | Write / reveal boundary |
|---|---|---|
| Safe company discovery | Approved, visible safe rows through projection/grants | Owner/admin or applicable team permissions; preserve sensitive-column protection |
| Private profiles | Self/admin; `get_public_profiles` gives display fields only to signed-in callers | Self-safe fields / protected trust fields |
| Community posts | Non-hidden non-anonymous rows public; direct anonymous-row read limited to author/admin | Member INSERT requires matching author plus feature-open/Paid/Broker/Admin; admin updates; author/admin delete |
| Replies/likes/reposts/polls/follows | Use scoped rows and aggregate RPCs | Authenticated mutation RPCs with their own validation |
| `anonymous_identity_log` | Admin-only audit | No member-facing identity dump |
| RFQ listings | **Authenticated** non-hidden network rows, admin exception | Admin or approved/visible/verified business with authorised representative |
| Quotations | Sender user, recipient company owner, admin | Verified sender-owned business to current open RFQ; withdrawal RPC, no generic UPDATE |
| Deal rooms/messages | `can_access_deal_room` / platform-admin read | Validated start/send RPCs; owners and company owner/admin/editor representatives |
| RFQ phone reveal | `get_company_whatsapp` | Explicit Paid/Broker/Admin; not overridden by the two settings |
| Notifications/preferences/subscriptions | Owner-scoped personal delivery state | Own settings/subscription; server notification creation/delivery |
| Bulletin/ads | Published / active-in-window content | Admin content management |
| Settings | No broad public settings table read | Admin setting mutation; narrow boolean helpers |

Both open-access settings were true in the hosted snapshot. **Do not say this makes every commercial action open**: policies that directly require company verification or role checks do not automatically consult those helpers. This is an unresolved implementation/copy mismatch, not permission logic changed by the refresh.

Company-members hosted policy permits platform admins or company owner/admin actors, but protects another user's owner row from company-admin update/delete. Do not describe that as an absolute immutable owner row: self/platform-admin exceptions exist.

## Anonymous posting and media

The raw anonymous author UUID must not be exposed through public rows, enriched profile lookups or media paths. Current post upload paths contain random opaque UUIDs, not user IDs. Direct anonymous post-row reads are author/admin restricted; do not promise public anonymous-content visibility without a separately checked sanitised delivery path.

Hosted `community-media` is **private**, but policies permit signing/read of opaque `posts/` media for guests and signed-in members under current access rules. Private bucket means signed delivery, **not inherently confidential feed content**. The anonymous read policy excludes old user-ID second-level paths. Member INSERT uses authenticated storage owner; owner/admin can delete. No community-media UPDATE policy was returned in this review: do not claim a paid-only overwrite flow.

`circular-assets` is private. Authenticated read/signing is limited to admin or objects referenced by published Bulletin attachments; admin writes. Client signing TTL is one hour. Unreferenced/draft attachments are not broadly authenticated-readable.

## Storage and server validation

Public avatar/company/product/ad buckets contain display assets, not KYC or personal-ID documents. Ads are admin-write. No hosted KYC bucket exists. Hosted bucket file size/MIME options were unset in this check; frontend MIME/size validation is not a sufficient server-side guarantee. See doc 16.

## Function/network threats

| Threat | Control / review item |
|---|---|
| Vault disclosure | Server-side password each request, constant-time comparison, internal bodies not browser-bundled |
| Link-preview SSRF | URL/address/protocol/redirect filtering and auth; test private-address/redirect behavior, not only happy path |
| Unsafe links/XSS | Safe link validation, renderer escaping; block script protocols |
| Profile/role escalation | Protected role table, trust guards, admin checks |
| Cross-company trade data | Participant checks, validated RPC context, private quotations/messages |
| Personal interaction leakage | Scoped rows and summaries rather than broad likes/views/subscription reads |
| Forged payment event | Retained raw-body HMAC verifier; payment schema/path currently disabled |
| Push abuse/key leakage | Server delivery credential, private VAPID key and owner-scoped subscriptions |

## Unverified / unfinished controls

Hosted auth-provider options, leaked-password protection, CAPTCHA and email confirmation were **not read in this review**. Don't assert enabled/disabled based on old docs. Founder-email role provisioning must be reviewed in the current auth lifecycle trigger before relying on it. No retention-cron, in-app KYC document flow or restored membership-payment path is established. Backup/restore and all devices' push behavior require operational evidence.

## Release checklist

Run a fresh security/dependency review; examine grants + RLS + RPC execute privileges and trust triggers. Test as actual guest/new user/business representative/admin, not just a simulator. Confirm no commodity exact-price/stock exposure, no anonymous identity path, no private contact profile dump. Verify current media signing boundaries, owner protections, push preferences and recovery. Record findings and remaining limitations; don't silently ignore unrelated scan findings.
