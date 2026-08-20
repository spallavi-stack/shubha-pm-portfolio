# Fund the Future: Discovery Scope

## Project basics
- **Problem area:** A fast campaign-building and fundraising platform for grassroots organisations, small municipalities, and NGOs doing climate *adaptation* work in the Global South. An organisation enters who they are and what they need money for, and gets back a complete, shareable campaign landing page with a working donation path attached to it.
- **Target user (campaign side):** Small climate-adaptation actors that are too small, too informal, or too under-resourced to compete for institutional climate finance: community flood-response groups, water and drought-resilience projects, mangrove and coastal restoration groups, heat-resilience and early-warning initiatives, and municipal-scale adaptation projects in small local government.
- **Target user (donor side):** Individual retail donors and diaspora givers in higher-income markets, plus larger organisational and philanthropic funders who arrive through a shared campaign link rather than through any discovery feature on the platform.
- **Status:** Brand new project. No prior material.
- **Known constraints:** Cross-border donation flows, foreign-contribution law, and payment-gateway country coverage are all outside personal domain experience, so grounding research goes deep on all three. The user has stated up front that similar platforms exist and that this is not a reason to skip the project, so competitive research is about finding the real gap, not about proving novelty.

## Decisions locked before research starts
These were decided by the user at kickoff and are inputs to the research, not questions for it:

1. **Geography:** Global South organisations raising primarily from Global North and diaspora donors. Cross-border money movement is therefore the defining technical and regulatory constraint of the product.
2. **Product surface:** Campaign builder plus a shareable public link. The platform does **not** provide a funder-facing discovery surface, a browsable campaign directory, or algorithmic matching to grantmakers. Institutional funders are treated as visitors who arrive via a link the organisation sent them.
3. **Monetization:** A small platform fee on funds raised. Whether this is defensible against the target user's ability to pay is a research question, but fee-on-funds is the model being tested.
4. **This pass:** Scope and grounding research only. No product brief yet.

## Open decision for the user
**Anchor jurisdictions.** "The Global South" cannot be researched as a single regulatory unit. Foreign-donation law, NGO registration, and payout rails differ enough between countries that a generic answer would be worthless. Recommendation is to anchor the regulatory and payments research in three markets and treat everything else as generalisation from them:

- **Kenya:** mature mobile-money payout infrastructure, an active NGO regulatory regime, and a large existing base of community climate-adaptation groups.
- **India:** the hardest legal case, because the Foreign Contribution (Regulation) Act places severe restrictions on which organisations may receive foreign donations at all. If the core flow is illegal for most small Indian grassroots groups, that is a finding worth having early rather than late.
- **Philippines:** a climate-vulnerability frontline market with heavy adaptation need, a large diaspora remittance corridor, and a different regulatory shape from either of the above.

Alternates if you would rather swap one out: Bangladesh, Nigeria, or a Small Island Developing State. Change this list before research starts if it does not match what you want the case study to be about.

## In scope for this pass

### Problem statement
Framing that names what is actually broken: the mismatch between where adaptation funding decisions are made and where adaptation work happens, the reasons small actors are structurally excluded from institutional climate finance (application burden, absorptive-capacity requirements, minimum grant sizes, reporting overheads), and the specific friction in standing up a credible online fundraising presence from a standing start.

### Grounding research: adaptation funding gap and market sizing
- The size and shape of the climate-adaptation finance gap, sourced to primary reporting (UNEP Adaptation Gap Report, OECD climate finance figures, or equivalent), including how much adaptation finance reaches local and community level.
- Market sizing must not stop at historical crowdfunding volumes for climate causes. Per the `grounding-research` standing rule, it also needs comparable-market analogs (disaster-relief giving, diaspora remittances as a giving channel, general-purpose crowdfunding volumes in the anchor markets) and an addressable-population estimate for how many organisations of this type plausibly exist.
- Every figure tagged Fact / Inference / Assumption. Any figure that already appears elsewhere in this portfolio gets checked for conflict before it is written.

### Grounding research: regulatory, recipient side
For each anchor jurisdiction: who may legally receive foreign donations, what registration or approval that requires, what reporting it triggers, and what happens to an organisation that is real and active but not formally registered. India's FCRA gets specific treatment because it may invalidate the core flow for a large share of the intended user base.

### Grounding research: regulatory, donor and platform side
Charitable-solicitation and fundraising rules that apply to the *platform* in donor markets, whether a platform moving donor money is acting as a money transmitter or payment intermediary and what licensing that implies, KYC and AML obligations on both the organisation and the donor side, sanctions and counter-terrorism-financing screening for payouts to fragile regions, and whether donors can claim any tax relief on a cross-border gift.

### Grounding research: payments and payout rails
The user has already identified this as the hard part, so it gets treated as a first-class research area rather than an implementation detail:
- Which mainstream gateways (Stripe, PayPal, Adyen, regional processors) actually support **payouts** to organisations in each anchor jurisdiction, as distinct from accepting payments from donors there.
- Mobile money as a payout rail where card and bank infrastructure is thin.
- Total fee drag on a single donation, end to end: gateway fee, cross-border fee, FX spread, payout fee, and the proposed platform fee stacked together. This number matters more to the product's credibility than any single one of its components.
- Settlement times, chargeback and fraud exposure, and what happens when a payout is frozen for compliance review.
- Whether an intermediary structure (fiscal sponsorship, a payments partner, a registered nonprofit of record) is required in practice for small organisations to receive money at all.

### Grounding research: competitive landscape
GlobalGiving, GoFundMe, Chuffed, Open Collective, Every.org, Donorbox, and regionally relevant platforms such as M-Changa, Ketto, and Milaap, plus any climate-specific funding platforms. Per the `grounding-research` standing rule, this covers **what the closest analog does not do**, not just whether it exists: specifically their vetting requirements, minimum organisational maturity, onboarding time, and payout country coverage, since those are the barriers this product would exist to remove.

### Grounding research: trust and verification
How a donor in a high-income market decides that a small, unfamiliar, possibly unregistered organisation on the other side of the world is real. Covers what existing platforms require before a campaign can collect money, documented fraud rates in charitable crowdfunding, and what verification signals actually change donor behaviour. This is the sharpest tension in the product: the entire value proposition is speed and low barriers, and every existing trust mechanism works by adding barriers.

### Product mechanics: runtime inputs for page generation and payment
The core promise is that a small amount of entered information becomes a complete campaign page with a working donation path. That requires naming, explicitly, what the system actually needs at runtime and where each input comes from:
- What the organisation types in, versus what the platform generates, versus what it must verify.
- What is required before money can move: legal entity status, bank or mobile-money destination, identity documents for a responsible person, tax status.
- What the funding goal is derived from and whether it is validated at all.
- Where campaign imagery comes from, given that most target organisations will not have marketing assets ready.

### Monetization grounding
Real fee benchmarks from comparable platforms, and evidence on whether a percentage fee on funds raised is workable for organisations raising small amounts. The stacked-fee figure above feeds directly into this.

### Limitations section
Explicit boundaries stated up front: what the platform does not do (no grant-writing, no institutional funder matching, no fund administration or spend tracking, no impact verification after the money lands), and the honest statement that a fictional case study has not tested any live payment integration.

## Riskiest-assumption log
1. **The binding constraint for these organisations is campaign-creation friction, not distribution.** The locked scope is a builder plus a link, which assumes organisations can get that link in front of donors themselves. If the real constraint is donor access, a faster page builder solves the wrong problem. This is the single riskiest assumption in the project and research should actively look for evidence either way.
2. A compliant, affordable payout path exists for small and informally-registered organisations in the anchor markets. If it does not, the product's target user cannot legally or practically be served.
3. Organisations raising small totals will accept a percentage fee on funds raised, from a platform positioned as serving the under-resourced.
4. Donor trust can be established by page quality and lightweight verification, without the heavy vetting that existing platforms use.
5. Adaptation, as distinct from mitigation, is a fundable story for retail donors. Adaptation work is often less visually dramatic and less legible to a general audience than either disaster relief or renewable energy.

## Out of scope for this pass
- **No product brief yet.** This pass ends at audited grounding research, so the evidence base can be reviewed before any product decisions are built on top of it.
- No personas, jobs-to-be-done, synthetic interviews, roadmap, user stories, technical-feasibility doc, or AI-collaboration review.
- No prototype and no live payment integration. Any later prototype demonstrates the flow with a mocked payment step.
- No funder-side discovery, directory, or matching research, per the locked product-surface decision.
- No crypto or on-chain giving rails, unless payments research finds that this is the only viable payout path in an anchor market, in which case it gets one honest paragraph rather than a section.
- No paid proprietary market-intelligence databases. Public, citable sources only.
- No fourth or fifth anchor jurisdiction. Three is the boundary, and findings beyond them are labelled as generalisation.
