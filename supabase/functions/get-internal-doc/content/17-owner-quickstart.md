# Owner Quickstart & "Where do I…?"

> **v3.3 · Documentation reviewed 17 October 2026.** Current source and selected hosted schema, policies, settings and buckets were checked. This is not a full security audit, legal approval or device-delivery certification.

## Start here

Owner task index; committee instructions are in **doc 25**. No one should assume the old founder-email bootstrap, live payment queue or daily snapshot guarantee without current evidence. Sign in with an already authorised account on the actual currently attached app domain.

## Where do I…?

| Task | Current surface / next step |
|---|---|
| Open account menu | Mobile top-left avatar; notifications are at the bell |
| Manage business/profile | `/account/company`, `/account/profile` |
| Switch businesses / team | `/account/companies`, `/account/team`; role-specific permissions |
| Manage catalogue/brands | `/account/products`, `/account/brands` |
| Review company verification/visibility | Moderation → Companies: Verify/Unverify, Hide/Unhide |
| Resolve a pending business application | Staff/developer review; current Companies tab does not expose complete Approve/Reject actions |
| Manage platform roles | Moderation → Users; grant carefully, with recorded approval |
| Open access switches | Moderation → **Access**: feature-open and verification-not-required |
| Publish Bulletin | Moderation → **Circulars** → compose → Publish; appears in feed/Bulletin chip |
| Run an ad | Moderation → Ads: primary/mobile creative, placement, priority, dates |
| Moderate feed | Moderation → Community; identity audit → Anon Log |
| Moderate RFQ | Moderation → RFQs: Hide/Unhide, Expire |
| View quotations | `/quotes` under a permitted business/session |
| Open deal chat | `/messages` and room detail; bottom tab is **Chat** |
| Saved posts | `/account/bookmarks` |
| Notification history/settings | `/notifications`; profile notification preferences and push enable |
| Install app | Get App/install cards or `/install`; iOS uses Share → Add to Home Screen |
| Refund or delete request | Grievance Officer, doc 21/doc 26; no in-app refund/erasure automation promised |
| Change vault password | Lovable Cloud secret `DOCS_PASSWORD`; share only out-of-band |
| Refresh internal docs | Edit source, rebuild bundle, deploy `get-internal-doc`, read updated response |

Current open-access settings are **ON as checked 17 October 2026**, but RFQ/quote/contact checks retain narrower hosted gates; read doc 15 before telling a member “signup is enough for everything.” Admin controls never become guest controls.

## Feature → source map (developer)

| Feature | Source |
|---|---|
| Home / discovery | `pages/Home.tsx`, `pages/Discover.tsx`, feed/home components |
| Directory/store/products/brands | Corresponding pages, query hooks and repositories |
| Feed/replies/reposts | market components, `PostDetail.tsx`, `communityPosts.ts`, `postComments.ts`, `postReposts.ts` |
| Following | `lib/follow.ts`, `useFollow.ts`, feed repositories |
| RFQ/quotations | `pages/Rfq.tsx`, `MyQuotations.tsx`, RFQ components/repositories |
| Chat | `DealRooms.tsx`, `DealRoom.tsx`, `dealRooms.ts` |
| Team/business context | `TeamPage.tsx`, `CompaniesPage.tsx`, company-member repository |
| Moderation | `pages/account/AdminModeration.tsx`, admin tabs |
| Notifications/PWA | `useNotifications.ts`, `lib/push.ts`, `registerSW.ts`, pwa components, `public/push-sw.js` |
| Public-marked docs 00–06 | `src/content/docs/*.md`, `_meta.ts` |
| Internal docs 07–28 | `get-internal-doc/content/*.md`, generated `content.ts` |
| Uploads | `lib/storage.ts`, `lib/uploads.ts` |
| Chrome geometry | `ChromeVisibilityContext.tsx`, `lib/chrome-layout.ts` |
| Routes/tokens | `src/routes.tsx`, `src/index.css`, `tailwind.config.ts` |

No cart/inbox/ticker route or component should be restored from historical guides.

## Documentation update procedure

For a new internal doc, add numbered markdown, slug mapping in function index, and metadata with `internal:true`. **Never import internal body into client metadata**. For public-marked docs, add raw import + source mapping. The current suite is 29 docs: 7 public-marked + 22 internal. The whole hub remains password-gated; public-marked means bundled, not an ungated policy-publication route.

```bash
bunx tsx scripts/build-internal-docs-bundle.ts
```

Deploy `get-internal-doc` after regeneration. Test a valid internal response, invalid-password denial and ZIP coverage. The vault keeps password in memory; reloading relocks it. A rotated secret is checked on the next internal request.

## Release and recovery

Verify app errors/tests, real-session social/trade flows, mobile scroll/keyboard/safe areas, install and supported-device push. Recheck hosted auth/security and backup/restore settings rather than guessing from source. Read all doc statuses before release; legal drafts and pending public policies do not constitute launch approval.

The currently reported published address is `https://gbaug.lovable.app`; no custom domain is reported attached in the supplied project context. Existing contact/email identifiers and historical mddma.org references remain subject to owner/domain verification. Do not send members to an assumed domain or promise working policy URLs that do not have routes.

If a task needs SQL, secrets, code or recovery, request the developer; routine committee work stays within the UI. Never export personal records to a laptop/USB as an informal backup.
