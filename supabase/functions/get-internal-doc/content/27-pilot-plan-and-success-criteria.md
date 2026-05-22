# Pilot Plan & Success Criteria

Closes the gap between docs 02 (Business & Scope) and 06 (Build & Operations): we have milestones and a deployment plan but no defined **pilot cohort, duration, success metrics, or kill-switch criteria**.

## 1. Pilot definition

The **MDDMA Pilot** is the first 90 days after production go-live with a defined cohort of members, after which the committee makes a documented **continue / iterate / sunset** decision.

## 2. Cohort

Pilot is **two-sided** — sellers alone do not validate the platform. Locked at **8–10 active members per side** (PILOT-001).

| Group | Target size | Recruitment path |
|---|---|---|
| **Anchor Paid sellers** | 8–10 | Bhuta & committee warm intros (locked Pattern D, memory) |
| **Anchor Paid buyers** | 8–10 | Bhuta & committee warm intros; ideally trading with the seller cohort |
| **Free observers** | 30–40 | Office staff + WhatsApp opt-in (per doc 18) |
| **Buyer guests** | open | Public; no recruitment |

**Anchor selection criteria:** active trader, willing to RSVP to a 30-minute onboarding call, agreeable to a 2-week and 6-week feedback call. The seller and buyer cohorts should overlap in commodity to guarantee real RFQ flow rather than a one-sided directory.

## 3. Phases

| Week | Phase | Focus |
|---|---|---|
| W0 | **Pre-launch** | Privacy / Terms / Refund / Grievance live; founding-window banner up; 8–10 seller anchors + 8–10 buyer anchors privately briefed |
| W1–W2 | **Soft launch** | Anchors only; founding-window pricing; daily monitoring; bug bashes |
| W3–W4 | **Open beta** | Free observers invited; first round of RFQs encouraged; first circular published |
| W5–W8 | **Steady state** | Public discoverability via SEO; first ad campaigns; first refund request expected |
| W9–W12 | **Review** | Data freeze, metrics report, committee decision call |

## 4. Success metrics (quantitative)

Three tiers: **Must-hit** (any miss = iterate/sunset), **Target** (aspirational), **Stretch** (above-and-beyond).

| Metric | Must-hit (W12) | Target | Stretch |
|---|---|---|---|
| Seller anchor activation (Paid, listed ≥3 products, responded to ≥1 RFQ) | **≥ 6/10** | 8/10 | 10/10 |
| Buyer anchor activation (Paid, submitted ≥2 RFQs to anchor sellers) | **≥ 6/10** | 8/10 | 10/10 |
| Total approved companies (anchors + organic) | **≥ 25** | 50 | 80 |
| Total RFQs submitted | **≥ 40** | 100 | 200 |
| Median time-to-first-seller-response on an RFQ | **≤ 48 office hours** | ≤ 24h | ≤ 8h |
| Total Razorpay-captured Paid memberships | **≥ 12** | 20 | 30 |
| Refund request rate | **≤ 20% of paid** | ≤ 10% | ≤ 5% |
| Privacy / grievance complaints upheld | **0 systemic** | 0 | 0 |
| S1 incidents (per doc 24 §9) | **≤ 2 in 90 days** | 0 | 0 |
| PWA installs (sum across devices) | **≥ 30** | 75 | 150 |

## 5. Success metrics (qualitative)

Collected via two structured calls per anchor (Week 2, Week 6) and a closing survey to all observers.

- "I trust the directory more than my WhatsApp group for finding new counterparties" — agreement scale 1–5 (target mean ≥ 3.5 by W12).
- "I would recommend the Paid membership to another MDDMA member" — NPS-style (target ≥ +20).
- Three free-text fields: what works, what's broken, what's missing.

Themes are coded and presented to the committee in the W12 review.

## 6. Hypotheses being tested

| H# | Hypothesis | How we'll know |
|---|---|---|
| H1 | Controlled-Transparency (no exact price/stock) reduces "I'll just ring you" friction by giving enough signal | Median time-to-first-response metric + qualitative theme |
| H2 | Buyer reputation > seller reputation reduces low-quality RFQs | Sellers complain less about junk RFQs in W6 vs W2 calls |
| H3 | Founding-lock pricing is enough to convert anchors without a freemium discount | Paid conversion rate ≥ 60% of anchor cohort |
| H4 | PWA install is preferred over native app demand | If install rate is healthy AND no anchor demands native, we defer native indefinitely |
| H5 | KYC-maximalist (the locked decision) does not scare anchors off | < 10% anchors drop out citing KYC friction |

## 7. Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| < 16 anchors activate by W12 | Medium | High | Bhuta-led 1:1 onboarding in W1; dev pairs with each anchor on listing creation |
| Razorpay merchant onboarding stalls | Medium | High | Submit Privacy/Terms/Refund pre-W0; have backup PG (PhonePe/Cashfree) shortlisted |
| Sellers ghost RFQs in early weeks | High | High | "Buyer reputation" governance message in every onboarding; W4 nudge email to lapsed sellers |
| Bug surge in W1 from real traffic | Medium | Medium | Daily standup with dev; S1/S2 SLA per doc 24 |
| One bad-actor seller poisons the cohort | Low | High | Grievance flow live from W0; admin trained per doc 25 |
| KYC-doc upload UI not ready by W3 | High | Medium | Out-of-band KYC via email allowed (doc 23 §3) |

## 8. Decision rule at W12

The committee meets in week 13 with this doc, the metrics report, and the qualitative themes.

- **All Must-hit metrics hit AND no upheld systemic privacy complaint AND ≤ 2 S1 incidents** → **CONTINUE** to general launch; lift founding window; begin BIL Phase 2 contract per doc 14.
- **1–2 Must-hit misses BUT clear path to fix in 90 days** → **ITERATE**; extend pilot 90 days with revised plan; founding window extended.
- **≥ 3 Must-hit misses OR upheld systemic privacy complaint** → **SUNSET** the platform; communicate to members; honour outstanding memberships pro-rata per doc 21; archive data per doc 26.

The decision is logged in `decisions-log` (doc 11) under a new ID (`PILOT-001`).

## 9. Out of scope for the pilot

- No BIL Phase 2 features beyond the façade.
- No Discourse migration (native forum is enough to test H1/H2).
- No analytics product analytics SDK beyond Cloud's built-in logs.
- No mobile app beyond PWA.
- No multi-language UI.
