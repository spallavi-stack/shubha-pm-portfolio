# SunnySideUp — Product Brief

## One-line pitch
SunnySideUp gives UK homeowners, leaseholders, and renters an honest, plain-English solar viability check — rooftop or plug-in — before or after they talk to a salesperson, from a source that doesn't get paid more when the answer is yes.

## Problem
Solar quotes are genuinely hard to compare: installers vary system-size definitions, what's included (scaffolding, DNO paperwork, battery bundling), and financing terms enough that two quotes for a similar job can differ by thousands of pounds with no obvious reason why.[^12] That's not incidental — no one in the current market is structurally incentivized to fix it. Installer pricing opacity is a documented regulatory concern: the CMA's own 2022 investigation into this sector specifically flagged "inaccurate and unrealistic headline price information."[^1] And every existing UK solar comparison platform found in research runs a lead-generation/referral-fee model — even the tools positioned as "helping you compare" are paid per lead, so their incentive is more quotes and conversions, not fewer, clearer, more comparable ones.[^2] That's the exact conflict of interest SunnySideUp exists to avoid.

Sales pressure is a symptom of that same gap, not a separate problem: a "Which?" survey of solar-panel owners found more than a third had been cold-called with false claims (mandatory "government-required" checks, fire-risk warnings, unsolicited battery upsells), and the CMA and Ofgem have both run consumer-protection investigations into the sector.[^1]

The market has also just shifted underneath this problem, in a way that's genuinely confusing without an independent explainer: BS 7671 Amendment 4 (in force 15 April 2026) legalized *hard-wired* plug-in solar installs by a registered electrician, but true DIY self-install — buying a kit and plugging it into a wall socket yourself, the version that actually matters for a renter with no capital for an electrician — is still not legal, pending a BSI product standard that hadn't been published as of this research.[^3] That gap between "legal with an electrician" and "legal to self-install" is exactly the kind of nuance a renter shopping for a £500 kit needs someone honest to explain to them.

## Who it's for
Two segments, defined by roof access rather than tenure:
- **Roof-access homeowners** considering rooftop solar — the segment most exposed to direct sales pressure (cold calls, in-home pitches).
- **No-roof-access renters and leaseholders** considering plug-in/balcony solar. Leaseholders own equity but generally still need freeholder/management-company consent to alter a building's exterior[^4] — a genuinely newly-legal, thinly-served category with almost no independent guidance today.

Both segments use the product at one of two moments: **before** any sales conversation (a baseline read), or **after** receiving a quote or pitch (an unbiased second opinion).

## Why now
The plug-in solar category is mid-transition right now, not settled: BS 7671 Amendment 4 (15 April 2026) legalized electrician-installed plug-in solar, DESNZ's consultation on the consumer self-install product standard closed 30 June 2026, and a government response was expected by ~22 July 2026 but isn't confirmed published as of this research.[^3] That's the window where an independent explainer is most valuable — before the category is fully legal and obvious, while most consumers (and most existing solar sites) haven't caught up to the nuance yet. Separately, 2025 was UK solar's record installation year with 31–37% growth,[^5] so rooftop demand — and the sales pressure that comes with it — is already at an all-time high.

## Market size & opportunity
UK solar installations passed 2 million by March 2026, following a record 2025.[^5] No adoption data exists yet for plug-in/balcony solar specifically — the category is too new to measure. The closest comparable-market signal: Germany's Balkonkraftwerke market moved from ~270,000 registered units in 2023 to over 1 million by mid-2025, growth accelerating sharply after German renters gained an explicit legal right to install in 2024 — the same clarity UK renters are still waiting on.[^5][^10]

The addressable opportunity is larger than current adoption suggests, though no single authoritative figure sizes it.[^7] Two directional signals: the UK government's 2025 Solar Roadmap targets 45–47GW of installed capacity by 2030, up from ~19GW in May 2025, with an explicit rooftop focus,[^9] and the no-roof-access segment alone is roughly 11 million English households — combining ONS renter data (~8.8M private and social renters) with MHCLG's leaseholder statistics (~2.6M owner-occupied leasehold dwellings).[^8]

The opportunity isn't purely financial: UK surveys consistently show a gap between climate concern and felt ability to act, with one 2025 survey finding 93% of respondents felt some degree of eco-anxiety, many describing frustration at caring about climate change while having no way to act on it.[^11] For renters and leaseholders, plug-in solar may be one of very few concrete actions available to them.

This brief still deliberately doesn't state a TAM/SAM/SOM figure — the signals above support a real, likely large opportunity without combining into one number the research doesn't back.

## Competitive landscape & differentiation
Every UK solar comparison platform identified in research — CompareMySolar, Uswitch's solar comparison, Solar Selections, Easy PV, Renewable Energy Hub, Solar Planet, Solar PV Quotes Compare — runs a lead-generation/referral-fee model (Fact).[^2] None were found to be structurally independent of installer payment. The closest real analog to SunnySideUp's positioning is Energy Saving Trust, a UK body funded by government and private sources providing impartial advice (Fact)[^2] — evidence that "independently funded, not referral-funded" is a viable model in this space, not just a hopeful assumption.

## Solution
A plain-English viability check — postcode plus a few basic details — covering both rooftop and plug-in solar, giving a same-session honest read where "this probably isn't worth it for you" is a valid, non-default answer, without collecting a lead for any installer.

## Hypothesis
We believe that a genuinely independent (non-referral-funded) viability check will be used by both UK homeowners weighing a sales pitch and renters/leaseholders exploring the newly-legal plug-in category, because the existing market has no structurally independent option and documented sales pressure creates real demand for a source that isn't trying to sell anything.

## Go-to-market
Leading hypothesis, not yet validated: revenue and distribution come through an institutional partner aligned with SunnySideUp's independence — an Ofgem DNO innovation-funding mechanism (Strategic Innovation Fund or Network Innovation Allowance, both real and currently live)[^6] or a climate/public-interest grant, rather than installer referral fees. No specific funded precedent matching this exact product type was found. This is the least-proven part of the brief — called out again below.

## Success metrics & validation methodology
- **Leading indicators:** completed viability checks per segment (rooftop vs. plug-in); % of sessions ending in a "not worth it" result — a high honest-no rate is a *trust* signal here, not a failure metric, since a tool that always says yes isn't actually independent.
- **Lagging indicators:** return usage — someone completing a "before" check and later returning for an "after" second-opinion check would be strong evidence the second-opinion use case is real, not assumed.
- **Go/no-go test:** adapted from Sean Ellis's product-market-fit methodology — after the synthetic-interview pass (next in sequence), ask personas from both segments a "how would you feel if this didn't exist" question and apply the same 40%-"very disappointed" threshold Ellis validated across real startups. This is a **synthetic proxy, not real user data**, until an actual prototype exists — stated plainly, not implied otherwise.
- **Riskiest-assumption signals** (from `scope.md`):
  1. *Renters/leaseholders seek an independent check before buying* → signal: synthetic interviews show this as a real, named step in their process, not skipped.
  2. *Homeowners mid-sales-conversation pause for a second opinion* → signal: synthetic interviews surface this as plausible persona behavior, not contradicted by their own reasoning.
  3. *A non-conflicted revenue model exists* → signal: a specific, named funding mechanism (not just a category) gets identified as a plausible fit at the roadmap stage.
  4. *Plug-in regulatory stability* → signal: the BSI product standard and self-install rules land as currently expected, without another material change.

## Critical success factors
- The BSI plug-in product safety standard needs to actually publish and legalize DIY self-install — if it stalls, the plug-in segment's pitch shrinks to "get an electrician to install a £500 kit," a materially less compelling product.
- A funding partner needs to exist willing to fund independent consumer advice rather than requiring a referral/commission structure — currently a hypothesis, not a validated path.
- The "honest no" has to be genuinely defensible — real payback/viability math, not a marketing claim. This depends on the technical/economic grounding, which `grounding-research.md` itself flags as its weakest-sourced section (no official UK payback dataset exists).

## Out of scope
No roadmap, synthetic interviews, clickable prototype, account-connection guide, AI-collaboration-review, user-stories, or technical-feasibility docs yet — sequenced next, per `scope.md`.

## Open questions
- Which specific funding mechanism (SIF, NIA, Innovate UK, Nesta, or something else) actually fits — to be researched at the roadmap stage.
- Whether renters genuinely need landlord permission for a plug-in kit — flagged in `grounding-research.md` as an unverified, sales-favorable claim from sources with a commercial incentive to say no permission is needed; needs direct verification of the Renters' Rights Act's actual text before it's ever repeated to a real user.
- How the two use-timings (before/after sales conversation) map to product flow — one flow with a branch, or two distinct entry points.

## Recommendation
**GO, with one explicit condition.** This brief's honesty depends on the technical/economic grounding (payback math, plug-in generation estimates) getting materially firmer than what currently exists — that's the weakest-sourced part of the research today. Proceed to personas and synthetic interviews next, as scoped, but treat the payback-math gap as something to actively tighten before any success-metrics claim gets tested for real — not something to paper over with placeholder numbers in the meantime.

## Further reading
Full research: `scope.md`, `grounding-research.md` (same folder).

## A note on what this is
SunnySideUp is a fictional product built for a product management portfolio. Market research (UK solar regulation, market size, sales-practice complaints, and named competitors) is real and cited; personas, interviews, and user data are synthetic — generated to be internally consistent with that research, not real people or real user data.

## Sources
[^1]: `grounding-research.md` §Sales practices and consumer protection
[^2]: `grounding-research.md` §Competitors
[^3]: `grounding-research.md` §Plug-in / balcony solar — verified follow-up
[^4]: `grounding-research.md` §Leasehold and tenancy consent requirements
[^5]: `grounding-research.md` §Market size and growth
[^6]: `grounding-research.md` §Funding mechanisms
[^7]: `grounding-research.md` §Addressable rooftop opportunity — a real gap, reported honestly
[^8]: `grounding-research.md` §No-roof-access population size (renters + leaseholders)
[^9]: `grounding-research.md` §UK solar capacity trajectory (forward-looking, not just historical)
[^10]: `grounding-research.md` §Balkonkraftwerke (balcony solar) growth in Germany — the closest comparable-market signal
[^11]: `grounding-research.md` §Consumer climate-agency and eco-anxiety surveys
[^12]: `grounding-research.md` §Quote complexity and misaligned incentives — the structural "why"
