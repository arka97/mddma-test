# Notifications & Push for the G-BAU-G PWA

Turn the header bell into a real notification centre, and deliver Web Push to installed PWAs (Android, iOS 16.4+ when added to home screen, desktop Chrome/Edge).

## What users get

- **Bell with unread count** — the header bell shows a live unread badge; tapping opens a dropdown of recent notifications with avatars, plain-English text and time (2h, 3d).
- **Full notifications page** at `/notifications` — infinite list, "Mark all read", tap-through to the post, deal room, RFQ or bulletin that triggered it.
- **Push notifications** that arrive even when the app is closed, for:
  - Personal activity: likes, comments, reposts and new followers on your posts
  - Deal rooms & RFQ: new messages, new quotations, replies on your RFQs
  - Admin broadcasts: new bulletins/circulars and association announcements
  - Market signals: new price signals and market alerts in Updates
- **Notification settings** in the Account drawer / Dashboard: one master "Enable push on this device" switch plus per-category toggles (personal, deals & RFQ, announcements, market signals). Users can turn any category off without losing the in-app centre.
- **Sensible enablement flow** — no browser prompt on first load. A soft in-app card ("Get notified when someone replies") appears after the user signs in and has interacted once; the real browser prompt only fires when they tap Enable. iOS users who haven't installed the app see an "Add to Home Screen to get notifications" hint instead.
- **Anti-noise rules**: you never get notified about your own actions; bursts of likes on the same post collapse into one ("Ravi and 4 others liked your post"); market-signal and broadcast pushes are rate-limited so the app can't spam the tray.

## Technical approach

**Database (one migration)**
- `notifications` — recipient_id, actor_id, type (`like` | `comment` | `repost` | `follow` | `deal_message` | `quotation` | `rfq_reply` | `circular` | `market_signal`), entity refs (post_id, room_id, rfq_id, circular_id), title/body snapshot, `read_at`, `created_at`. RLS: recipients read/update their own rows only; inserts happen through security-definer triggers and service role. GRANTs for `authenticated` + `service_role`.
- `push_subscriptions` — user_id, endpoint (unique), p256dh, auth, user_agent, last_seen_at, revoked_at. RLS: users manage only their own rows.
- `notification_preferences` — user_id PK, four boolean category flags, all default true.
- Security-definer triggers that create notification rows on insert into `post_likes`, `post_comments`, `post_reposts`, `follows`, `deal_messages`, `rfq_quotations`, and on publish of `circulars` / `community_posts` with market-signal types. Self-actions are skipped; like/repost notifications de-duplicate within a 1-hour window per post.
- RPCs: `list_my_notifications(_limit, _before)`, `count_my_unread()`, `mark_notifications_read(_ids)`, `mark_all_notifications_read()`.
- A `pg_net` trigger (or a DB webhook) calls the send-push edge function whenever a notification row is created, so push is fire-and-forget from the app's perspective.

**Backend**
- New secrets `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` — generated and stored server-side; the public key is served to the client by an edge function so it never needs to be hard-coded.
- Edge function `push-vapid-key` — returns the public VAPID key.
- Edge function `send-push` — validates the payload, loads the recipient's subscriptions and category preferences, signs and sends Web Push (`npm:web-push`), and deletes subscriptions that return 404/410 (stale devices).
- Broadcast fan-out for admin announcements and market signals batches recipients so a single circular doesn't time out the function.

**Frontend**
- `public/sw.js` gains a `push` and `notificationclick` handler (messaging worker only — no app-shell caching, per the PWA rules), registered from a guarded wrapper that never runs in Lovable preview or dev.
- `src/lib/push.ts` — permission request, subscribe/unsubscribe, sync subscription to the backend, detect iOS-not-installed.
- `src/hooks/useNotifications.ts` — React Query list + unread count, with a Supabase realtime subscription so the badge updates live without polling.
- `NotificationsButton.tsx` rebuilt on the new data (keeping the existing deal-room shortcut), new `src/pages/Notifications.tsx` route, and a `NotificationSettings` section in the account area.
- Notification copy and icons follow the existing burgundy/gold tokens; badge and icon use `/icon-192.png`.

**Testing**
- Vitest coverage for de-duplication grouping and the preference filter.
- Manual verification: push works only on the published domain (`https://gbaug.lovable.app` / custom domain), not inside the editor preview iframe — that caveat will be stated when it ships.
