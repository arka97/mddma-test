# GTM & Onboarding Playbook


> **v3.1.3 Removal Notice (June 2026)** — The **RFQ engine, multi-item RFQ cart, `rfqs` / `inquiry_products` tables, /account/rfqs inbox, RFQ-related edge functions, and the /forms Verification Request** flow have all been **removed from the product**. Any section below that references RFQs, RFQ cart, RFQ inbox, `rfqs` / `inquiry_products`, or the /forms verification form is **historical only** and does not reflect the live app. The mobile bottom tab now opens the Member Dashboard from the Account tab, and Circulars / Members positions in the bottom tab bar have been swapped.

---


Operationalises the locked **Pattern D** (Bhuta & committee warm intros) from memory. No cold outreach, no paid acquisition during pilot. Every member is brought in by a known, trusted hand.

## 1. Channel strategy

| Channel | Use | Owner |
|---|---|---|
| 1:1 Bhuta intros | Anchor Paid cohort (25) | Bhuta + Committee Chair |
| Committee WhatsApp broadcasts | Free observers (75) | Office staff |
| MDDMA AGM / monthly meet | In-person walkthrough | Committee Chair |
| Office desk during business hours | Walk-in onboarding | Office staff |
| Press / trade publications | Reserved for post-pilot | — |
| Paid ads | **Not used during pilot** | — |

## 2. Anchor outreach sequence (Bhuta-led)

Pilot anchors are **8–10 sellers + 8–10 buyers** (PILOT-001). They are contacted in alternating seller/buyer order, one per business day, so onboarding load stays sane and the platform never tips into being a one-sided directory.

**T-0 (call):** Bhuta phones the member. ~10 minutes. Script in §3.
**T+1 (WhatsApp):** Bhuta sends the personal intro template (§4).
**T+2 (email):** Office sends the formal welcome email (§5).
**T+3 to T+10:** Member completes sign-up + `/apply` + (sellers) lists 3 products / (buyers) submits 2 RFQs to anchor sellers. Office checks in on day 5 if incomplete.
**T+14 (call):** Bhuta or office calls for 2-week feedback (§6).
**T+45 (call):** Same, 6-week feedback.

## 3. Bhuta phone-call script

> "Namaste — Bhuta here. You know me from [past trade / past committee work]. I'm calling about something the Association is putting together that I think you'll want to be in on early. It's a digital directory and trade hub for our community — only members, only verified, no Alibaba-style chaos. We're inviting a small founding group of trusted houses — eight to ten sellers and eight to ten buyers — to join in a founding window with a locked price. I'd like to add you. Can I send you the details on WhatsApp and have my office walk you through it later this week? It takes 15 minutes."

**Allowed pivots:**
- If they ask "what does it cost?" → "Ten thousand a year, locked at this price for two years if you join in the first 90 days."
- If they ask "what's in it for me?" → "Verified buyers reach you directly; you don't fight on price discovery in WhatsApp groups; you keep your existing relationships."
- If they ask "is this safe for my data?" → "Yes — the policy is written and the Association has named a grievance officer. I'll send you the link."

**Do not:**
- Promise BIL/AI features.
- Promise lead packs (killed).
- Compare to specific named competitors.
- Discuss exact price/stock data on the platform.

## 4. WhatsApp intro template (Bhuta to anchor)

> Respected [Name] ji,
>
> Following our call. The platform is **mddma.org**. Three things to do this week:
>
> 1. Sign up using the email you check daily.
> 2. Click *Apply for Paid Membership* and tick the broker box if it applies.
> 3. List your top 3 products with one good photo each.
>
> The Association's office (Aditya Parmar, our Grievance Officer, +91 22 2784 1234) will help if anything is unclear.
>
> Privacy policy: mddma.org/privacy. Refund policy: mddma.org/refund. Terms: mddma.org/terms.
>
> Welcome aboard.
> — Bhuta

## 5. Formal welcome email (office)

**Subject:** Welcome to MDDMA Digital — your founding-member access

> Dear [Name],
>
> Thank you for joining the MDDMA digital platform as one of our founding two-sided pilot members (8–10 sellers + 8–10 buyers). This email is your written welcome and a copy of the key links you'll need.
>
> - Sign in: mddma.org/login
> - Apply / claim listing: mddma.org/apply
> - Documents hub (member-facing): mddma.org/documents
> - Privacy: mddma.org/privacy
> - Terms: mddma.org/terms
> - Refund & cancellation: mddma.org/refund
>
> Your founding-window price (₹10,000/year, locked for two years) is reserved until [date = T+10].
>
> If you have any question, technical or otherwise, please reply to this email or call the Grievance Officer, Aditya Parmar, at grievance@mddma.org or +91 22 2784 1234.
>
> Warm regards,
> Office of MDDMA
> Sector 19, APMC Market, Vashi, Navi Mumbai

## 6. Two-week feedback call (10 minutes)

Office runs the call. Open the call with: *"This isn't a sales call — we want to know what's broken."*

Ask, in order:
1. Did you complete sign-up and listing? If not, what stopped you?
2. Did you receive any RFQs? If yes, how did they feel — serious or junk?
3. What confused you most?
4. What's one thing that, if missing, would make you cancel?
5. Anything you'd like to tell us that we haven't asked?

Capture verbatim in `pilot-feedback.xlsx`. Anything S1/S2 (per doc 24) goes to the developer same day.

## 7. Free observer onboarding (75)

Lighter touch than anchors:

1. Committee WhatsApp broadcast (one-time, opt-in already collected per doc 18).
2. Members reply with "JOIN" → office sends a link to `/login` and a one-line note.
3. No follow-up call; office answers tickets as they come.
4. After 30 days, office sends a single "What's stopping you upgrading?" check-in email.

## 8. Founding-window rules

- 90 days from public go-live.
- Founding price visible only when signed in and during the window.
- Price-lock honoured for the agreed duration (default 24 months) even after the window closes — recorded in the member's profile note.
- Post-window: list price applies; no retroactive upgrade of pre-pilot members.

## 9. Press & external comms

**Silence during pilot.** No press release, no LinkedIn launch post by the developer or committee. The risk of half-baked discovery driving in non-MDDMA traffic outweighs the brand upside.

A single post-pilot announcement (W14) is drafted by the Committee Chair, reviewed by the Grievance Officer (for compliance with Terms §10 IP and Privacy §10), and published only after the **CONTINUE** decision is taken.

## 10. Anti-goals

What we are explicitly **not** doing during the pilot:

- No referral incentives for members (would distort cohort signal).
- No discount codes (Founding price is the only deal).
- No SEO content marketing beyond the meta basics already shipped.
- No partnership announcements with banks, NBFCs, logistics players — these wait for post-pilot.

## 11. Hand-off to post-pilot

If the W12 review returns **CONTINUE** (doc 27 §8):

- This playbook is reviewed and the founding-window passage is removed.
- A formal GTM v2 is drafted, covering paid acquisition, content, and partnerships.
- The Bhuta-warm-intro track continues as an evergreen high-trust acquisition channel.
