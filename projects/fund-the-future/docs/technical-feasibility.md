# Fund the Future: Technical Feasibility and Architecture

*Drafted August 2026. This document carries the architecture the real product would need. It exists because the case study ships a prototype, and the engineering thinking should be recorded rather than implied by a click-through. Every market and provider fact traces to [`grounding-research.md`](grounding-research.md). Scope is phase 1 of [`roadmap.md`](roadmap.md).*

## The constraint everything else follows from

**The platform never holds funds.** That decision was made to stay out of money transmitter licensing, and it is not primarily a legal choice once you start building. It determines the payment architecture, it removes refunds, it removes pooled or all-or-nothing goals, and it is the reason the verification gate carries the entire fraud burden. An architecture that lets money rest in a platform account for even a moment reopens all of it.

The practical form of the constraint: **the organisation is the merchant of record for its own donations.** The platform originates the transaction and never appears in the settlement path.

---

## 1. The payment layer, which is the hardest part

### What is ruled out

**Stripe Connect cannot pay this product's users.** Its cross-border payout recipients are limited to the United States, the United Kingdom, the EEA, Canada and Switzerland. The Philippines is not among them, and neither is any market this project has considered for expansion. The default architecture a developer would reach for is unavailable, which is what makes the remaining providers load-bearing rather than convenient.

**dLocal cannot collect from the donor markets.** Its pay-in coverage is emerging markets only, and it lists none of the United States, the United Kingdom, the Netherlands, Germany, Canada or Australia as countries a payer can pay from. For this product dLocal is a payout provider and nothing else. A claim made earlier in the project that two providers gave redundancy on both legs was checked and was half right.

### What is left

| Leg | Provider | What it does | Confidence |
|---|---|---|---|
| Pay-in, donor to organisation | Xendit | Multi-currency card processing lets a Philippine merchant accept foreign-issued Visa and Mastercard presented in USD, EUR or GBP and settled in PHP, with Xendit doing the FX. Xendit charges cards worldwide regardless of currency | Verified against Xendit's own documentation and help centre |
| Payout, into the organisation's hands | Xendit or dLocal | Banks plus seven e-wallet providers. The wallet channel is the one that matters, because an organisation with no bank account can still be paid | Verified against both providers' documentation |

**The single point of failure is stated plainly: collection rests on Xendit alone.** This is critical success factor 7 in the product brief and a phase 2 item in the roadmap. A split architecture looks plausible, because what removed Stripe was payout to the Philippines rather than collection from the United States, so Stripe, Adyen, Checkout.com or PayPal could in principle collect while Xendit or dLocal pays out. That has not been researched and should not be assumed.

**Philippine merchants sit on a smaller currency subset than Hong Kong or Singapore merchants, and pair availability is confirmed per account rather than published.** Any currency claim in donor-facing copy has to be verified against the live account rather than against the documentation.

### How direct settlement is actually implemented

Xendit's platform model lets a parent account originate transactions on behalf of sub-accounts that are themselves the merchants. Each organisation is onboarded as its own sub-account, completes its own KYC, and holds its own payout destination. The platform's roles are to create the transaction, to receive the webhook, and to record what happened. Funds never enter a platform-controlled balance.

**Two consequences to design around.**

1. **The organisation's KYC is not the platform's to schedule.** Xendit's review takes 5 to 10 business days, and dLocal imposes a hard 30-day KYC completion window after which the account deactivates, and reserves the right to reject an applicant without giving reasons. The campaign page therefore has to work and be shareable before payout is live, which is a product requirement rather than a caveat.
2. **The tip cannot ride inside the organisation's transaction.** A donor tip is platform revenue and the organisation's donation is not, so they are separate transactions to separate merchants, presented as one action. Getting this wrong either routes platform revenue through the organisation's books or routes the donation through the platform's, and the second one recreates custody.

---

## 2. The verification pipeline, which is the product

The gate is the only fraud control, so this pipeline is the highest-consequence code in the system.

### Inputs and where each comes from

| Input | Source | Cost | Automatable |
|---|---|---|---|
| Registration status, incorporation, address | Philippine SEC register | Free eSEARCH lookup, or the API below | Yes |
| General Information Sheet and audited financial statement filing record | Same | Same | Yes |
| PCNC accreditation and expiry | PCNC public register | Free, dated register | Yes, by scheduled read |
| Identity of the named accountable person | Government ID via the payment provider's KYC | Included in provider onboarding | Provider-side |
| Sanctions and watchlist screening, organisation and person | Provider's AML screening | Included | Provider-side, though what the provider passes back is an open question |
| Work category, budget, prior work, reporting commitment | The organisation | Free | Not checked, and labelled as unchecked |

### The SEC API, and the reason for a cache

The SEC API Marketplace sells a nine-API Company Information Lookup bundle covering registration status, audited financial statements and General Information Sheets at PHP 10,000 per 100 calls a year or PHP 50,000 per 1,000, which is roughly PHP 50 to 100 per lookup. A separate SEC Number API is free at ten calls a day.

**Ten calls a day is a development allowance rather than a production one**, and PHP 50 to 100 a lookup is fine per organisation and ruinous per page view. The lookup therefore has to be a cached, versioned record rather than a live call:

- One lookup at registration, stored as a dated verification record.
- Re-checked on a schedule, at least at the twelve-month green-light expiry.
- Campaign pages render from the stored record and display the date it was read, which is what makes the display honest rather than merely current.
- The free tier's response fields are undocumented, and inspecting one response is a registration task rather than a fetch. It is roadmap item 0.3.

### The floor and the cap, as code

The rule that decides who publishes and for how much is a platform judgment applied to real organisations, so three properties matter more than the rule itself.

1. **Deterministic.** The same register record always produces the same ceiling. No scoring model, no discretion at the point of decision.
2. **Versioned.** The rule version is stored on every verification record, so an organisation can be told which rule produced its ceiling and a rule change does not silently rewrite history.
3. **Explainable in one sentence.** If the reason for a ceiling cannot be stated to the organisation in a sentence, the rule is wrong. The prototype's version is: registered and not revoked publishes, and each year of missing audited financial statements lowers the ceiling.

**What the rule must never become.** A composite score, a tier, or anything a donor could read as a quality rating. That reintroduces the badge the product ruled out, and it makes a promise the platform has no mechanism to keep.

---

## 3. Data model, phase 1

Seven tables carry the product. The shape below is the part worth arguing about; the columns are not.

- **organisation.** Registration number, name as registered, contact, work category, payout provider account reference, current green-light state and expiry.
- **verification.** One row per check, per organisation, dated, with the raw provider or register response retained, the rule version applied, and the resulting ceiling. Append-only. This table is the product's evidence, so nothing in it is ever updated in place.
- **campaign.** Organisation, theme, title, one-sentence ask, prior work, reporting commitment, state.
- **impact_line** and **budget_line.** Both belong to a campaign. Units on impact lines come from the theme and are not free text.
- **donation.** Campaign, amount, currency, one-off or recurring, provider transaction reference, state. Carries no account or card data of any kind.
- **tip.** Deliberately its own table with its own transaction reference, for the reason in section 1.
- **theme.** Content structure rather than configuration: unit definitions, suggested budget lines, accent, imagery treatment, placeholder copy.

**The one modelling decision that matters.** `verification` being append-only and retaining the raw response is what lets a campaign page say what was read and when, rather than what is true now. The product's central claim is about what was checked, and a table that overwrites cannot support that claim.

---

## 4. Stack

Chosen for a solo builder on free infrastructure, which is the real constraint on a case study.

| Layer | Choice | Reason |
|---|---|---|
| Application | Next.js with the App Router, TypeScript | Server components render the campaign page as HTML, which matters because the page is the product and it must be fast and indexable on a phone in the Philippines |
| Data | Postgres, through Prisma | The verification model is relational and append-only. A document store would make the evidence trail harder rather than easier |
| Hosting | Any Node host with a free tier | Nothing in the architecture needs more, and the campaign page caches well |
| Auth | Email link, built in the application | Managed auth costs money or an account, and the organisation logs in rarely |
| Images | Object storage, fixed aspect ratios, one grade applied on upload | Design rule 5. These are phone photographs taken in bad light, and the gap between that and an agency page is mostly photographic |
| Payments | Xendit platform accounts | Section 1 |
| Register lookups | An adapter interface, with a cached implementation | Section 2 |

**Two interfaces are worth defining before anything else**, because both external dependencies are single points of failure and both are likely to change. A `RegisterLookup` interface with one live implementation and one fixture implementation, and a `PaymentProvider` interface with the same. The prototype runs entirely on the fixture implementations, which is not a shortcut so much as the same seam the real system needs for testing.

---

## 5. Unit economics, and what they demand of the architecture

Revenue is donor tips and the organisation pays nothing, which puts an unusual amount of weight on cost per organisation.

**Cost is per organisation and roughly fixed.** A register lookup is PHP 50 to 100. Human review where the register is unclear is the dominant cost and is a known limit of the pilot rather than a steady state. Verification costs about the same whether a campaign raises PHP 20,000 or PHP 400,000, which is exactly why the percentage fee was dropped.

**Revenue is per donation and variable.** The environmental donor gives $93 on a one-time gift against $139 across all causes, and monthly giving is 32% of environmental online revenue. Tip uptake and average tip rate are both unknown, and the business model rests entirely on them. That is stated in the brief as an accepted weakness rather than modelled here, because a number invented for this document would be worse than an admission.

**What this demands of the build.** Every avoidable per-organisation cost is a threat to the model, which is the architectural argument for caching register lookups, for automating the lookup rather than reviewing by hand, and for vetting once per organisation rather than per campaign. It is also the argument against anything that raises support load per organisation, which is a real risk given the target user's administrative capacity.

---

## 6. Compliance

- **Not a money transmitter.** Because the platform never holds funds, it is software rather than a money services business, and it needs no US state-by-state licensing. This is the whole reason for the custody decision and every architectural choice above protects it.
- **AML and sanctions ride on the payment provider.** The provider performs KYC on the organisation and its officers and screens both. What the provider passes back to the platform is an open technical question and it matters, because the campaign page displays the result.
- **Tax deductibility is unavailable and is not an engineering problem.** US IRC section 170(c)(2) allows a deduction only for gifts to US-organised entities, and the conduit rule requires an intermediary that genuinely holds the funds and is free not to send them, which is the custody the product gave up. *Persche* covers giving inside the EU and EEA and does not reach the Philippines. UK Gift Aid needs an HMRC-recognised charity. There is no implementation that changes this, so the page states it.
- **Data protection in two jurisdictions at once.** Organisation and officer data is Philippine and falls under the Data Privacy Act. Donor data is worldwide, which brings GDPR into scope for European donors. The named accountable person's details are published deliberately, which makes consent at registration a real requirement rather than a formality.

---

## 7. Risks, ranked by what they would cost

1. **Collection rests on one provider.** If Xendit declines the account or changes its multi-currency terms, the donor side stops. No second pay-in provider has been researched. Phase 2, and arguably earlier.
2. **The register lookup is the gate and its API is priced per call with an undocumented free tier.** If the response does not contain the filing record, verification stays manual and per-organisation cost rises against a revenue model that cannot absorb it.
3. **Human vetting does not scale.** Recorded as a known limit of the pilot rather than solved. It is the cost line most likely to break the model at growth.
4. **The tip is the entire business model and its uptake is unmeasured.** No architectural fix exists. It is instrumented from day one or it is guessed at forever.
5. **Published personal data.** The product requires a named individual on a public page, in a country where civil society organisations have faced state pressure. This is recorded here because it is a real risk to a real person in the live product, and it is not addressed by anything in this document.

---

## 8. What the prototype fakes, and what that hides

Stated because a click-through can make hard things look solved.

| The prototype does this | The real product would face this |
|---|---|
| Reads a hardcoded register record instantly | A priced API with undocumented fields, a cache, a re-check schedule, and a manual fallback |
| Advances the five-day wait with a button | Two asynchronous processes, the platform's and the provider's, neither of which reports progress on a schedule |
| Adds a donation to a number in memory | Two separate transactions to two separate merchants, webhooks, retries, failed cards, and recurring donations that outlive the campaign |
| Generates its imagery | Uploads from phones in bad light, fixed crops, a consistent grade, and storage |
| Assumes the named person consents | Consent, and the safety of publishing an identifiable individual |
| Has no failure states | Rejected KYC, lapsed green lights against live recurring donations, revoked registrations mid-campaign |

The last row is the one that matters most. Every hard problem in this product is a failure state, and a happy-path prototype is the least honest possible view of it. That is why the failure states are written down here and in the roadmap rather than left for the build to discover.
