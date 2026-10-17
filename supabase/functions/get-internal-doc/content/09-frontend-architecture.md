# Frontend Architecture

> **v3.3 · Documentation reviewed 17 October 2026.** Current source and selected hosted schema, policies, settings and buckets were checked. This is not a full security audit, legal approval or device-delivery certification.

## Provider tree

```text
QueryClientProvider
└─ TooltipProvider
   └─ BrowserRouter
      ├─ ScrollToTop
      └─ AuthProvider
         └─ RoleProvider
            └─ ChromeVisibilityProvider
               └─ DocAuthProvider
                  ├─ Toaster / Sonner
                  └─ app routes and layout
```

Defined in `src/providers/AppProviders.tsx`; routes are in `src/routes.tsx`. There is **no CartProvider**. Auth is available to role resolution; coordinated chrome state is shared across feed lanes.

## Route map

| Route | Current page / purpose | Gate |
|---|---|---|
| `/` | `Home`: Updates/Buzz/Following/Bulletin and other chips | Public permitted feed reads; login for interactions |
| `/discover` | `Discover`: discovery modules and install promotion | Public page |
| `/market/:postId` | `PostDetail`: full post/replies/statistics | Reads subject to data access |
| `/directory`, `/directory/:slug`, `/store/:slug` | Firms, member and storefront | Public safe discovery; contact separately controlled |
| `/products`, `/products/:slug`, `/brands`, `/brands/:slug` | Catalogue and brands | Safe discovery; noindex |
| `/rfq` | RFQ board | Listing database reads authenticated; business gates for writes |
| `/quotes` | `MyQuotations` | Protected session and participant-scoped data |
| `/messages`, `/messages/:roomId` | Deal-room list/detail | Protected session and company participation |
| `/dashboard` | Account overview | Page has internal account states |
| `/notifications` | Notification history | Owner-scoped history |
| `/membership`, `/apply` | Account/business access explanation; business registration | Apply requires login to submit |
| `/account/profile`, `/account/company`, `/account/products`, `/account/brands` | Personal/business management | Protected session |
| `/account/companies`, `/account/team`, `/account/bookmarks` | Business switcher/team/saved content | Protected session and applicable ownership |
| `/account/moderation` | Admin moderation | Protected admin |
| `/about`, `/faq`, `/knowledge`, `/knowledge/:slug`, `/contact`, `/install`, `/forms` | Public content/help/enquiry pages | According to page logic |
| `/documents`, `/documents/:slug` | Markdown hub/viewer | Shared password |

Redirects: `/market`, `/community`, `/circulars` → `/`; `/broker` → `/directory?type=Broker`; `/directorylist` → `/directory`; `/admin` → moderation. Old spec routes redirect to docs. No `/circulars/:slug`, `/account/rfqs`, `/account/verify`, `/leads` or public legal routes currently exist. `/market/:postId` is **not** retired with the index route.

## Identity and roles

`AuthContext` owns the real session, user, roles and business context. Keep auth-change callbacks synchronous; defer async work outside the callback.

`RoleContext` exports `role`, `setRole`, `canAccess`, `featuresOpen`, `isEffectivePaid`. Actual role precedence: admin → broker → paid → free. Demo role is held in component state and honored **only signed out**. It never grants a hosted privilege. `isEffectivePaid` is a frontend convenience, not proof that a hosted RPC/policy permits an action. Verification override is read through the separate app-settings hook.

## Data flow

Prefer query hooks → repositories → Cloud. Current code also includes direct calls in pages and components; this is a layering goal, not a claim that every existing page already complies.

| Responsibility | Current source |
|---|---|
| Safe businesses/team | `repositories/companies.ts`, `companyMembers.ts`; `hooks/queries/useCompanies.ts`, `useCompanyTeam.ts` |
| Catalogue/brands | `repositories/products.ts`, `brands.ts`, `productCategories.ts` |
| Feed/channels | `repositories/communityPosts.ts`, `reels.ts`, `feedEvents.ts` |
| Comment identity/threading | `repositories/postComments.ts`, `profiles.ts` |
| Likes/reposts/views/polls | Corresponding `post*` repositories |
| Follow targets | `lib/follow.ts`, `hooks/useFollow.ts` |
| RFQ/quotes/deals | `rfqListings.ts`, `rfqQuotations.ts`, `dealRooms.ts` plus query hooks |
| Notifications | `hooks/useNotifications.ts`, `lib/push.ts` |
| Media | `lib/storage.ts` for catalogue/Bulletin; `lib/uploads.ts` for feed |

`dataSource.ts` projects **live** rows; it never fills production lists with sample members/products. Avoid public `companies.select('*')`; discovery uses safe projection. Profile display enrichment uses `get_public_profiles`, never broad private-profile reads.

## Feed and mobile composition

`FeedShell`, `Header`, `MobileBottomTabBar` and `ChromeVisibilityContext` coordinate scroll-driven chrome. `Home.tsx` owns ad/chips, lanes/swipes and the floating Post action; `ReelsView` owns the vertical media scroller. `chrome-layout.ts` supplies safe-area and FAB geometry. `useVisualViewportHeight` sizes mobile compose/reply sheets when the keyboard opens; 16px inputs avoid iOS focus zoom.

Action order: comment, share, like, repost, save; views appear on opened posts. Threads flatten deeper replies under the top-level ancestor. Reposts reconcile to server state. Share exposes native, copy link and WhatsApp, not X/LinkedIn.

## PWA, docs and caches

`registerSW.ts` registers generated `/sw.js`; `useInstallPrompt`/`useInstallVisibility` coordinate install UI and dismissal. `SplashScreen` is branding, not an authentication/loading guarantee. Notification subscribers use unique channel names to avoid registering callbacks on an already-subscribed realtime channel.

Doc metadata is browser-safe; internal bodies are server-only. The vault password lives in memory. Rebuild/deploy the internal bundle after edits (doc 08).

`lib/membership.ts` now has labels/price helpers and disabled legacy management stubs; do not call removed create/activate helpers described by old docs. See doc 12.
