# Committee Operator Guide (Non-technical)

For the 5 committee members and 2 office staff. **Zero SQL.** Everything here is done from a normal browser using the admin UI at `/account/moderation`. If a task requires SQL, it belongs in doc 17 (Owner Quickstart), not here, and must be requested from the developer.

> **Sign in once:** go to `mddma.org`, click **Sign in** (top-right), use the email and password provided to you on onboarding. If you forget your password, use **Forgot password** on the sign-in screen. Never share your password.

## 1. The admin dashboard at a glance

After signing in as an admin, click your avatar (top-right) → **Admin Moderation**. You will see tabs:

- **Companies** — approve / reject members
- **Circulars** — publish notices
- **Ads** — manage banners
- **Posts** — pin / hide forum threads
- **RFQs** — read-only overview (developer can intervene if needed)

Tabs that show a small red dot have items waiting for your attention.

## 2. Approving a new member

When a member completes `/apply`, a draft company appears under **Companies** with status **Pending**.

1. Click the company name to open it.
2. Read: name, GSTIN, address, categories, contact details.
3. Spot-check:
   - Does the company exist? (Quick Google.)
   - Does GSTIN look real? (15-character alphanumeric.)
   - Is the description on-topic for dry fruits / dates / allied commodities?
4. If everything looks fine: click **Approve**. The listing goes live immediately.
5. If something looks off: click **Reject**, choose a reason from the dropdown, add a one-line note. The member is notified by email and may resubmit.
6. If you suspect fraud: click **Reject** **and** send the member's email to **grievance@mddma.org** for follow-up.

You do **not** need to be the same admin who finally activates the membership — any admin can approve.

## 3. Marking a member as "Verified"

A separate, optional badge.

1. Open the company in **Companies**.
2. Tick the **Verified** checkbox at the top.
3. Save.

Use this only after confirming GSTIN, address and a phone call. If unsure, leave it off — the member can still operate.

## 4. Publishing a circular

1. Go to **Circulars** → **New**.
2. **Title** — clear, no acronyms (e.g. "APMC market holiday – 25 March 2026").
3. **Category** — pick one from the dropdown (general, market, regulatory).
4. **Body** — write or paste the notice. Bold and bullets are supported via the toolbar.
5. Tick **Published**.
6. Click **Save**.

It now appears on `/circulars` and on the home page latest-circulars card.

To edit later: open the circular, change, save. To unpublish: open the circular, untick **Published**, save.

## 5. Running an ad banner

You need an image first: **1200 × 400 pixels**, JPG or PNG, under 1 MB. The office computer's screenshot tool or any free online tool works.

1. Go to **Ads** → **New**.
2. **Title** — a name only you see (e.g. "Diwali greeting – Mehta Traders").
3. **Image** — upload the file.
4. **Link URL** — the page the banner should click through to (paste a full https:// URL).
5. **Placement** — pick from the dropdown:
   - `homepage-banner` — top of the home page
   - `directory-banner` — top of the directory
   - `category-strip` — inside category pages
6. **Start date** and **End date** — when the ad runs.
7. **Active** — leave ticked.
8. Click **Save**.

The ad goes live at midnight on the start date and disappears at midnight on the end date.

## 6. Pinning a forum post

1. Go to **Posts**.
2. Find the post (use the search bar).
3. Click the **Pin** icon on the right.
4. The post now appears at the top of `/community`.

To unpin: click the same icon again.

To hide a post that breaks the rules: click **Hide**. The post disappears from public view. If the post is illegal or threatening, also forward it to **grievance@mddma.org**.

## 7. Reading RFQs (overview only)

The **RFQs** tab is read-only for you. It shows total RFQs received, by month and by seller. You cannot edit RFQs. If a member complains about a missing RFQ, copy the RFQ ID and email it to the developer.

## 8. Day-to-day "Did I do that right?" checklist

Before logging off:

- [ ] Every pending company older than 5 business days has been approved or rejected.
- [ ] Every pinned circular still makes sense (an old "Diwali holiday" notice should be unpinned in November).
- [ ] No expired ads still showing on the home page.
- [ ] No flagged post left unresolved overnight.

## 9. Things you must **never** do

- Never share your admin password.
- Never click a link in an email that says "Your MDDMA account is locked" — go to the site directly.
- Never publish a circular that mentions a specific price or stock level — this breaks the platform's Controlled-Transparency rule (memory, doc 03).
- Never approve a company whose GSTIN matches one already approved unless you have confirmed they are different entities (e.g. parent and subsidiary).
- Never download member contact details to a personal device or USB.
- Never delete a forum post yourself if the author has objected — escalate to the Grievance Officer.

## 10. Who to call for what

| Problem | Who |
|---|---|
| "I forgot my password" | Use **Forgot password** on the sign-in screen |
| "The site looks broken" | Email the developer; CC the Committee Chair |
| "A member says they were wrongly rejected" | Forward to **grievance@mddma.org** |
| "A buyer is harassing me on the forum" | Use **Hide** + forward thread URL to grievance |
| "I need to issue a refund" | See doc 21; forward to grievance with payment reference |
| "Razorpay says a payment failed" | Note the order ID; forward to the developer |
| "Suspected data leak" | Call the Grievance Officer immediately + email |

**Grievance Officer:** Aditya Parmar — grievance@mddma.org — +91 22 2784 1234.
