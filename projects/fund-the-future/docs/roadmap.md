# Fund the Future: Roadmap

*Drafted August 2026, after the prototype. Sequenced against [`product-brief.md`](product-brief.md) and the decisions in `HANDOVER.md`. Every claim about the market traces to [`grounding-research.md`](grounding-research.md).*

The product brief's recommendation is GO to prototype and concept test, and not GO to build. This roadmap is written to that recommendation. Phase 0 is the work that decides whether phase 1 should happen at all, and the phases after it are conditional on results rather than scheduled.

## The shape of the sequencing problem

Three facts set the order of everything below.

**The gate is the only fraud control.** The platform holds no funds, so there is no freezing, no reversal and no holding pending investigation. Anything that widens who can publish has to ship after the checks that decide who can publish, never alongside them.

**Verification cost is per organisation, not per campaign.** That is why onboarding is vetted once and campaigns are unlimited, and it is why anything that raises per-organisation cost is a bigger threat to the model than anything that raises per-campaign cost.

**Revenue is donor tips, so revenue tracks donor volume rather than gift size.** The environmental donor gives less per gift than average, $93 against $139, and retains better, 53% against 48%, with monthly giving at 32% of online revenue. Every prioritisation call below that looks like a choice between more donors and larger donors resolves toward more donors and toward retention.

---

## Phase 0: decide whether to build. Roughly one quarter.

Nothing here is engineering. The brief's recommendation stops at this phase, and passing it is the condition for phase 1.

| # | Work | What it settles | Why it is first |
|---|---|---|---|
| 0.1 | Concept test with roughly twenty donors in the proposed starting markets | Whether structured disclosure substitutes for audited financials, and whether the named-person structure conflicts with the effectiveness finding | These are the two questions no desk research can answer, and both sit under locked decisions |
| 0.2 | Assemble a sample of real Philippine grassroots adaptation organisations, starting from the 25 live projects returned by GlobalGiving's Philippines and Climate Action filters and the 11 PCNC-accredited environment organisations | Whether the fundable set is narrower than the target user base | The deepest open assumption in the project. Three data points currently point two ways |
| 0.3 | Register for the SEC free API tier, at ten calls a day, and inspect one response | Whether verification automates or stays manual, and what the response actually contains | The lookup is the gate, and its fields are undocumented. This is a signup rather than a fetch |
| 0.4 | Interview five to eight organisations from 0.2 on the registration flow | Whether an organisation accepts the public display of its own missing filings | Untested by any source, and it is what the whole verification design rests on |
| 0.5 | Establish what fiscal sponsors charge and how they handle the donor relationship | Whether the differentiation against the real substitute holds | The competitive section currently states this contrast without the numbers behind it |

**Kill criteria, stated in advance.** If 0.2 shows the fundable set is a dozen organisations rather than a population, the product is a service rather than a platform and should be rebuilt as one. If 0.4 shows organisations will not publish their filing gaps, the floor-and-cap model fails and the only remaining options are the documentation barrier the product exists to remove or a permissive front door it has no remedy behind.

---

## Phase 1: the minimum that can take a real donation. Two quarters.

Ships only if phase 0 passes. This is the scope the prototype demonstrates, built for real.

**Organisation side**

1. Registration and the SEC register check, automated where 0.3 allows and manual behind the same interface where it does not.
2. Sanctions and watchlist screening, and identity verification of the named accountable person, both riding on the payment provider's KYC.
3. The verification wait as one status screen. No draft state, because at five business days it earns too little to justify one.
4. Approval, with the raise ceiling set and explained in pesos.
5. The rejection path, carrying the reason, the specific missing item, and the cost and duration of SEC registration.
6. The campaign builder across all seven themes.
7. Payout onboarding with Xendit, including the e-wallet route, because an organisation with no bank account is a core case rather than an edge one.

**Donor side**

8. The campaign page, with the verification display and the costed budget.
9. One-off and recurring giving at the same decision point. Recurring ships in phase 1 rather than later, on the environmental-sector retention evidence.
10. The donor tip.
11. The Matchmaker, ordered on a fact the donor chose.

**What phase 1 deliberately excludes**

- Reporting back to donors. Committed on the page, not delivered by the product. This is the largest gap and it is phase 2's first item.
- Any second pay-in provider. Collection rests on Xendit alone, which is critical success factor 7 in the brief and a known single point of failure.
- Any market other than the Philippines. The country selector shows Kenya, Ghana and Mozambique greyed out and unselectable.
- Tax relief in any form. Structurally unavailable and stated on the page.

---

## Phase 2: make the second donation possible. Two quarters.

Phase 1 gets money once. New-donor retention of 24% to 28% means a single campaign raises money roughly once, so a platform that stops at phase 1 is a platform organisations use once and leave.

1. **Reporting back.** The organisation states at build time what it will report and when. Phase 2 carries the reporting itself: a structured update against the commitment, delivered to everyone who gave. This is the mechanism behind retention and it is the promise phase 1 makes without keeping.
2. **The lapsed green light against a live recurring donation.** A green light is valid twelve months or until SEC status changes. Today nothing is designed for what happens to an active monthly donor when it lapses. This is a donor-trust hole rather than an administrative one and it needs both a policy and a screen.
3. **Repeat campaigns.** The second campaign should cost an afternoon and reuse everything settled at onboarding.
4. **A second pay-in provider.** dLocal cannot collect from any proposed starting donor market, so a split architecture is the likely answer, since what removed Stripe was payout to the Philippines rather than collection from the United States.
5. **Donor-facing evidence of completion.** From the interviews: the retention message is a photograph of the finished thing rather than a restatement of the crisis.

---

## Phase 3: conditional expansion. Unscheduled.

Each item is gated on a specific result rather than on a date.

| Work | Gate |
|---|---|
| A second market | Phase 2 retention holds in the Philippines, and the candidate market has a register that shows filing rather than only existence. Kenya beats the Philippines on registry quality and payout maturity and stays out on FATF grey-listing plus the 2024 referral of 16 civil society organisations to the Directorate of Criminal Investigations. That is the condition to watch |
| An impact module that carries a list rather than a count | The preparedness theme underperforms the others on conversion. Ruben's evacuation register is more persuasive than his drill count, and the design brief left the module's form open |
| A donor-facing unit translation per theme | Evidence that native units cost conversion. Hectares are correct and illegible, which cuts against the theme library's own premise |
| Corporate employee matching as a channel | Establishing whether matching programmes will match a cross-border gift to a Philippine organisation. Pledge 1% is 19,000 companies across 130+ countries, which raises the value of settling it, and nothing currently establishes eligibility for a foreign recipient |
| Institutional funder surfaces | Not planned. The product surface decision holds, and the programme officer stays a visitor |

---

## The real application

This case study ships a prototype. Building the product means building software, and the architecture for it is specified in [`technical-feasibility.md`](technical-feasibility.md) rather than left implied. Two things in that document set the engineering order rather than the product order: the register lookup has to be cached because its free tier allows ten calls a day, and Stripe Connect cannot pay a recipient in the Philippines, which makes the payment provider a load-bearing choice rather than a swappable one.

## What would change this roadmap

**The finding most likely to reorder everything** is 0.2. If the population of fundable Philippine grassroots adaptation organisations turns out to be roughly a dozen, phases 1 and 2 are the wrong shape and the right product is a hands-on service for a small set of organisations, priced and staffed accordingly.

**The finding most likely to stop it** is 0.1. Donation size is strongly driven by perceived effectiveness at addressing climate change, and adaptation protects against consequences rather than reducing emissions. The costed budget is the proposed answer and it is untested. If donors will not fund adaptation at retail, no amount of verification design fixes that, and the honest response is to say so rather than to iterate on the page.
