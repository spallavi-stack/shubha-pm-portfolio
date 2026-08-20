# Fund the Future: Discovery Scope

## Project basics
- **Problem area:** A fast campaign-building and fundraising platform for grassroots organisations, small municipalities, and NGOs doing climate *adaptation* work in the Global South. An organisation enters who they are and what they need money for, and gets back a complete, shareable campaign landing page with a working donation path attached to it.
- **Target user (campaign side):** Small climate-adaptation actors that are too small, too informal, or too under-resourced to compete for institutional climate finance: community flood-response groups, water and drought-resilience projects, mangrove and coastal restoration groups, heat-resilience and early-warning initiatives, and municipal-scale adaptation projects in small local government.
- **Target user (donor side):** Individual retail donors and diaspora givers in higher-income markets, plus larger organisational and philanthropic funders who arrive through a shared campaign link rather than through any discovery feature on the platform.
- **Status:** Brand new project. No prior material.
- **Known constraints:** Cross-border donation flows, foreign-contribution law, and payment-gateway country coverage are all outside personal domain experience, so grounding research goes deep on all three. The user has stated up front that similar platforms exist and that this is not a reason to skip the project, so competitive research is about finding the real gap, not about proving novelty.

## The two hard problems
This product has two problems that are harder than building a page generator, and the research is weighted toward them rather than spread evenly:

1. **Moving money across borders to small organisations.** Accepting a donor's card payment is solved. Getting that money into the hands of a small organisation in a low-income or climate-vulnerable country, legally, affordably, and without a compliance freeze, is not.
2. **Proving the organisation is real.** A donor is being asked to give to an unfamiliar, small organisation on the other side of the world. Verification is treated as a **product pillar and a stated differentiator**, not as a compliance chore bolted on at the end. The tension to design against is that the value proposition is speed and low barriers, while every existing trust mechanism works by adding barriers.

## Decisions locked before research starts
These were decided by the user at kickoff and are inputs to the research, not questions for it:

1. **Geography:** Global South organisations raising primarily from Global North and diaspora donors. Cross-border money movement is therefore the defining technical and regulatory constraint of the product.
2. **Product surface:** Campaign builder plus a shareable public link. The platform does **not** provide a funder-facing discovery surface, a browsable campaign directory, or algorithmic matching to grantmakers. Institutional funders are treated as visitors who arrive via a link the organisation sent them.
3. **Monetization:** A small platform fee on funds raised. Whether this is defensible against the target user's ability to pay is a research question, but fee-on-funds is the model being tested.
4. **This pass:** Scope and grounding research only. No product brief yet.

## Anchor jurisdictions (pilot and MVP only)
**These countries are the pilot and MVP launch markets, not the product's intended limit.** The long-term ambition is to serve grassroots climate-adaptation organisations across the Global South. Three markets are named because "the Global South" cannot be researched as a single regulatory unit: foreign-donation law, NGO registration, verification registries, and payout rails differ enough between countries that a generic answer would be worthless, and a pilot that launches everywhere at once cannot be compliant anywhere. Expanding the market list is a post-MVP roadmap decision rather than a scope cut.

**Selection method and full working: [`market-selection.md`](market-selection.md).** The first version of this scope named Kenya, the Philippines, and India, then swapped India for Maldives. Those were chosen by association rather than against criteria, so the selection was redone properly: hard filters first (foreign donations legally receivable, a working payout rail, no sanctions or conflict blocking payouts), then five ranked criteria (climate impact, registered climate NGO count with an informal-sector flag, poverty as both a rate and an absolute count, diaspora and remittance corridor strength, and whether a public NGO registry can actually be queried).

**Current selection:**

- **Philippines.** The only candidate scoring well on all five criteria. Top-ten climate impact in the Climate Risk Index long-term ranking, 64,087 registered NPOs, third largest remittance recipient in the world, a queryable SEC register with annual filing obligations, and off the FATF grey list since February 2025.
- **Nigeria.** Holds the largest absolute population in extreme poverty of any country, roughly 12% of the global total, which it wins by a margin no other candidate approaches. Around $20bn in annual remittances, roughly 38% of all inflows to sub-Saharan Africa. Off the FATF grey list since October 2025. Weakest of the three on climate-index ranking.
- **Honduras.** Third most affected country in the world in both editions of the Climate Risk Index long-term ranking, the strongest long-term climate-impact signal on the longlist. Remittances at roughly 31% of GDP. A registry (URSAC) operating under a law that deliberately limits official discretion, plus a special law covering environmental NGOs specifically. **Conditional on verifying that foreign donations are legally receivable**, which is a hard filter and is currently unverified.

**Kenya was dropped**, despite being the best-documented market on the longlist, because it is on the FATF grey list as of June 2026 and its foreign-funded civil society is politically exposed. It is the correct swap back in if registered-NGO data quality and verifiability are weighted above climate impact. Full reasoning in `market-selection.md`.

**Maldives was dropped.** Its foreign-funding regime is permissive and its climate exposure is existential, but a population of roughly half a million cannot compete on NGO count or poverty scale, and it had been selected on qualitative argument rather than against the criteria.

## In scope for this pass

### Problem statement
Framing that names what is actually broken: the mismatch between where adaptation funding decisions are made and where adaptation work happens, the reasons small actors are structurally excluded from institutional climate finance (application burden, data and absorptive-capacity requirements, minimum grant sizes, reporting overheads, income-classification cutoffs), and the specific friction in standing up a credible online fundraising presence from a standing start.

### Grounding research: adaptation funding gap and market sizing
- The size and shape of the climate-adaptation finance gap, sourced to primary reporting (UNEP Adaptation Gap Report, OECD climate finance figures, or equivalent), including how much adaptation finance reaches local and community level.
- Market sizing must not stop at historical crowdfunding volumes for climate causes. Per the `grounding-research` standing rule, it also needs comparable-market analogs (disaster-relief giving, diaspora remittances as a giving channel, general-purpose crowdfunding volumes in the anchor markets) and an addressable-population estimate for how many organisations of this type plausibly exist.
- Every figure tagged Fact / Inference / Assumption. Any figure that already appears elsewhere in this portfolio gets checked for conflict before it is written.

### Grounding research: regulatory, recipient side
For each anchor jurisdiction: who may legally receive foreign donations, what registration or approval that requires, what reporting it triggers, and what happens to an organisation that is real and active but not formally registered. Maldives' Associations Act obligations get verified against primary text, since the whole reason it is an anchor is that its regime is permissive.

### Grounding research: regulatory, donor and platform side
Charitable-solicitation and fundraising rules that apply to the *platform* in donor markets, whether a platform moving donor money is acting as a money transmitter or payment intermediary and what licensing that implies, KYC and AML obligations on both the organisation and the donor side, sanctions and counter-terrorism-financing screening for payouts, and whether donors can claim any tax relief on a cross-border gift. Research must also check current FATF grey-list status for each anchor jurisdiction, because listing status drives correspondent-bank de-risking and heightened scrutiny of nonprofit payment flows, which lands directly on this product's core operation.

### Grounding research: payments and payout rails
The user has already identified this as the hard part, so it gets treated as a first-class research area rather than an implementation detail:
- Which mainstream gateways (Stripe, PayPal, Adyen, regional processors) actually support **payouts** to organisations in each anchor jurisdiction, as distinct from accepting payments from donors there.
- Mobile money as a payout rail where card and bank infrastructure is thin.
- Total fee drag on a single donation, end to end: gateway fee, cross-border fee, FX spread, payout fee, and the proposed platform fee stacked together. This number matters more to the product's credibility than any single one of its components.
- Settlement times, chargeback and fraud exposure, and what happens when a payout is frozen for compliance review.
- Whether an intermediary structure (fiscal sponsorship, a payments partner, a registered nonprofit of record) is required in practice for small organisations to receive money at all.

### Grounding research: verification and donor trust
This is the differentiator the product is being built around, so the research treats it as a design problem with a real answer, not as a risk to acknowledge:

- **What can actually be checked, per anchor jurisdiction.** Which public registries exist and are queryable (Kenya's NGO and public-benefit-organisation register, the Philippine SEC register of non-stock corporations, the Maldives Registrar of Associations), what each record proves, whether any are machine-readable, and what a real but unregistered community group can produce instead.
- **What the platform can verify itself.** Identity checks on a named responsible person, matching a payout account's registered name to the organisation's legal name, proof of an operating history, and third-party attestation or vouching from a known local intermediary. Each option assessed for what fraud it actually stops.
- **Which signals change donor behaviour.** Evidence on whether verification badges, named accountable individuals, spend reporting, or refund guarantees measurably affect donor conversion and average gift size. A verification scheme that donors do not notice buys compliance, not trust.
- **Documented fraud base rates in charitable crowdfunding**, and the specific fraud patterns that hit cross-border and disaster giving, since those are the ones this product is most exposed to.
- **How existing platforms vet, and what that costs them.** GlobalGiving's due-diligence and site-visit model versus GoFundMe's largely open model sit at opposite ends of this trade-off. What each catches, what each misses, and how long each takes to onboard an organisation.
- **The tiered model to design against.** The likely answer is a ladder rather than a gate: a campaign page can be created immediately, while progressively stronger verification unlocks the ability to receive and withdraw money. Research needs to establish what evidence each rung can realistically demand, and what happens to donations already pledged if an organisation fails to clear the next rung.
- **What the platform promises the donor, and what it does when verification fails.** Whether the platform refunds, and the liability that promise creates, is a business-model question and not only a trust one.

### Grounding research: competitive landscape
GlobalGiving, GoFundMe, Chuffed, Open Collective, Every.org, Donorbox, and regionally relevant platforms such as M-Changa, Ketto, and Milaap, plus any climate-specific funding platforms. Per the `grounding-research` standing rule, this covers **what the closest analog does not do**, not just whether it exists: specifically their vetting requirements, minimum organisational maturity, onboarding time, and payout country coverage, since those are the barriers this product would exist to remove.

### Product mechanics: runtime inputs for page generation, verification, and payment
The core promise is that a small amount of entered information becomes a complete campaign page with a working donation path. That requires naming, explicitly, what the system actually needs at runtime and where each input comes from:
- What the organisation types in, versus what the platform generates, versus what it must verify.
- What is required before money can move: legal entity status, bank or mobile-money destination, identity documents for a responsible person, tax status.
- Which verification inputs are collected at which rung of the ladder above, and which of them can be checked automatically against a registry rather than reviewed by a human.
- What the funding goal is derived from and whether it is validated at all.
- Where campaign imagery comes from, given that most target organisations will not have marketing assets ready.

### Monetization grounding
Real fee benchmarks from comparable platforms, and evidence on whether a percentage fee on funds raised is workable for organisations raising small amounts. The stacked-fee figure above feeds directly into this, as does the cost of running verification, which is the main variable cost the platform would carry per organisation.

### Limitations section
Explicit boundaries stated up front: what the platform does not do (no grant-writing, no institutional funder matching, no fund administration or spend tracking, no impact verification after the money lands), what verification can and cannot prove (including that in Kenya, the best-documented market examined, only 2,829 of 10,279 active NGOs filed annual reports, so registration status proves less than it appears to), that the three pilot markets are a starting point rather than the served market, and the honest statement that a fictional case study has not tested any live payment integration.

## Riskiest-assumption log
1. **The binding constraint for these organisations is campaign-creation friction, not distribution.** The locked scope is a builder plus a link, which assumes organisations can get that link in front of donors themselves. If the real constraint is donor access, a faster page builder solves the wrong problem. This is the single riskiest assumption in the project and research should actively look for evidence either way.
2. A compliant, affordable payout path exists for small and informally-registered organisations in the anchor markets. If it does not, the product's target user cannot legally or practically be served.
3. **Verification light enough to preserve the speed promise is still strong enough for donors to trust, and strong enough to stop real fraud.** Both halves have to hold. Light verification that donors do not believe fails commercially; light verification that fraudsters walk through fails catastrophically and publicly.
4. Organisations raising small totals will accept a percentage fee on funds raised, from a platform positioned as serving the under-resourced.
5. Adaptation, as distinct from mitigation, is a fundable story for retail donors. Adaptation work is often less visually dramatic and less legible to a general audience than either disaster relief or renewable energy.
6. Retail individual giving is a viable funding channel for this sector at all. Kenya's government sector report puts individual donors at 2.3% of NGO income and shrinking 10% year on year, against affiliates at 27.6% and foreign government agencies at 21.2%. This product is a retail-giving tool aimed at a sector where retail giving is currently marginal. Research has to establish whether that channel is small because no usable tool exists or because retail donors do not fund this work.
7. What the platform learns in three pilot markets generalises to a fourth. Each new country brings its own foreign-donation law, its own registries, and its own payout rails, so an expansion cost that stays roughly flat per market is an assumption, not a given. Research should form an early view on whether adding a market is mostly configuration or mostly rebuild.

## Out of scope for this pass
- **No product brief yet.** This pass ends at audited grounding research, so the evidence base can be reviewed before any product decisions are built on top of it.
- No personas, jobs-to-be-done, synthetic interviews, roadmap, user stories, technical-feasibility doc, or AI-collaboration review.
- No prototype and no live payment integration. Any later prototype demonstrates the flow with a mocked payment step.
- No selection of a specific KYC or identity-verification vendor, and no integration assessment of one. Research establishes what must be verified and what is checkable; picking the supplier is a later technical-feasibility question.
- No funder-side discovery, directory, or matching research, per the locked product-surface decision.
- No crypto or on-chain giving rails, unless payments research finds that this is the only viable payout path in an anchor market, in which case it gets one honest paragraph rather than a section.
- No paid proprietary market-intelligence databases. Public, citable sources only.
- No fourth anchor jurisdiction **in this pass**. Three is the research boundary for the pilot, and findings beyond them are labelled as generalisation. Additional markets are a post-MVP expansion question, and the research should note, where it cheaply can, which findings look portable to other countries and which are specific to the anchor market they came from.
