# SunnySideUp: Product Brief

## One-line pitch
SunnySideUp gives UK homeowners, leaseholders, and renters an honest, plain-English solar viability check for rooftop or plug-in systems, usable before or after they talk to a salesperson, from a source that doesn't get paid more when the answer is yes.

## Problem
Solar quotes are hard to compare. Installers vary system-size definitions, what's included (scaffolding, DNO paperwork, battery bundling), and financing terms enough that two quotes for a similar job can differ by thousands of pounds with no obvious reason why.[^12] No one in the current market has an incentive to fix that. Installer pricing opacity is a documented regulatory concern: the CMA's own 2022 investigation into this sector specifically flagged "inaccurate and unrealistic headline price information."[^1] Every existing UK solar comparison platform found in research runs a lead-generation/referral-fee model, so even the tools positioned as "helping you compare" get paid per lead, which rewards more quotes and conversions rather than clearer, more comparable ones.[^2] That's the exact conflict of interest SunnySideUp exists to avoid.

Sales pressure comes from that same gap. A "Which?" survey of solar-panel owners found more than a third had been cold-called with false claims (mandatory "government-required" checks, fire-risk warnings, unsolicited battery upsells), and the CMA and Ofgem have both run consumer-protection investigations into the sector.[^1]

The market has also just shifted underneath this problem, in a way that's confusing without an independent explainer. BS 7671 Amendment 4 (in force 15 April 2026) legalized hard-wired plug-in solar installs by a registered electrician. True DIY self-install, buying a kit and plugging it into a wall socket yourself, the version that actually matters for a renter with no capital for an electrician, remains illegal pending a BSI product standard that hadn't been published as of this research.[^3] That gap between electrician-installed and self-installed is exactly the kind of nuance a renter shopping for a £500 kit needs someone honest to explain to them.

## Who it's for
Two segments, defined by roof access rather than tenure:
- **Roof-access homeowners** considering rooftop solar. This is the segment most exposed to direct sales pressure (cold calls, in-home pitches).
- **No-roof-access renters and leaseholders** considering plug-in/balcony solar. Leaseholders own equity but generally still need freeholder/management-company consent to alter a building's exterior.[^4] This is a newly-legal, thinly-served category with almost no independent guidance today.

Both segments use the product at one of two moments: **before** any sales conversation (a baseline read), or **after** receiving a quote or pitch (an unbiased second opinion).

## Why now
The plug-in solar category is mid-transition. BS 7671 Amendment 4 (15 April 2026) legalized electrician-installed plug-in solar, DESNZ's consultation on the consumer self-install product standard closed 30 June 2026, and a government response was expected by ~22 July 2026 but isn't confirmed published as of this research.[^3] This is the window where an independent explainer is most valuable, while the category isn't yet fully legal and obvious and most consumers (and most existing solar sites) haven't caught up to the nuance. Separately, 2025 was UK solar's record installation year with 31–37% growth,[^5] so rooftop demand, and the sales pressure that comes with it, is already at an all-time high.

## Market size & opportunity
UK solar installations passed 2 million by March 2026, following a record 2025.[^5] No adoption data exists yet for plug-in/balcony solar specifically; the category is too new to measure. The closest comparable-market signal is Germany's Balkonkraftwerke market, which moved from ~270,000 registered units in 2023 to over 1 million by mid-2025, with growth accelerating sharply after German renters gained an explicit legal right to install in 2024. UK renters are still waiting on that same clarity.[^5][^10]

While no single figure captures the total addressable opportunity,[^7] two signals suggest it's substantial:

1. The UK government's 2025 Solar Roadmap targets 45–47GW of installed solar capacity by 2030, up from about 19GW in May 2025, roughly 2.5x growth in five years, with rooftop installations specifically prioritized.[^9]
2. Combining ONS data on renters (about 8.8 million private and social renting households) with MHCLG's leaseholder statistics (about 2.6 million owner-occupied leasehold homes) indicates roughly 11 million English households in the plug-in PV category.[^8]

The opportunity isn't purely financial: UK surveys consistently show a gap between climate concern and felt ability to act, with one 2025 survey finding 93% of respondents felt some degree of eco-anxiety, many describing frustration at caring about climate change while having no way to act on it.[^11]

## Competitive landscape & differentiation
Every UK solar comparison platform identified in research (CompareMySolar, Uswitch's solar comparison, Solar Selections, Easy PV, Renewable Energy Hub, Solar Planet, Solar PV Quotes Compare) runs a lead-generation/referral-fee model (Fact).[^2] None were found to be structurally independent of installer payment. The closest real analog to SunnySideUp's positioning is Energy Saving Trust, a UK body funded by government and private sources providing impartial advice (Fact).[^2] That's evidence an independently funded model can actually work in this space.

Even Energy Saving Trust leaves a real gap. It doesn't sell or install anything itself, and its own solar calculator uses generic assumptions before telling users to check with their installer for a more accurate number.[^2] That final, personalized figure gets handed back to the same installer whose headline pricing the CMA has already flagged as often inaccurate.[^1] SunnySideUp gives that specific, personalized read directly, without sending the user back to the party being evaluated.

## Solution
A plain-English viability check, using postcode plus a few basic details, covering both rooftop and plug-in solar. It gives a same-session honest read where "this probably isn't worth it for you" is a valid, non-default answer, without collecting a lead for any installer.

## Hypothesis
We believe that an independent (non-referral-funded) viability check will be used by both UK homeowners weighing a sales pitch and renters/leaseholders exploring the newly-legal plug-in category, because the existing market has no structurally independent option and documented sales pressure creates real demand for a source that isn't trying to sell anything.

## Go-to-market
This is a leading hypothesis that hasn't been validated yet: revenue and distribution come through an institutional partner aligned with SunnySideUp's independence, such as an Ofgem DNO innovation-funding mechanism (Strategic Innovation Fund or Network Innovation Allowance, both real and currently live)[^6] or a climate/public-interest grant, instead of installer referral fees. No specific funded precedent matching this exact product type was found. This is the least-proven part of the brief, called out again below.

## Success metrics & validation methodology
- **Leading indicators:** completed viability checks per segment (rooftop vs. plug-in), and the percentage of sessions ending in a "not worth it" result. A high honest-no rate is a *trust* signal here: a tool that always says yes isn't actually independent.
- **Lagging indicators:** return usage. Someone completing a "before" check and later returning for an "after" second-opinion check would be strong evidence the second-opinion use case is real.
- **Go/no-go test:** adapted from Sean Ellis's product-market-fit methodology. After the synthetic-interview pass (next in sequence), ask personas from both segments a "how would you feel if this didn't exist" question, and apply the same 40%-"very disappointed" threshold Ellis validated across real startups. This is a synthetic proxy until an actual prototype exists and real users can be asked directly.
- **Riskiest-assumption signals** (from `scope.md`):
  1. *Renters/leaseholders seek an independent check before buying* → signal: synthetic interviews show this as a real, named step in their process.
  2. *Homeowners mid-sales-conversation pause for a second opinion* → signal: synthetic interviews surface this as plausible persona behavior consistent with their own reasoning.
  3. *A non-conflicted revenue model exists* → signal: a specific, named funding mechanism is identified as a plausible fit at the roadmap stage.
  4. *Plug-in regulatory stability* → signal: the BSI product standard and self-install rules land as currently expected, without another material change.

## Critical success factors
- The BSI plug-in product safety standard needs to actually publish and legalize DIY self-install. If it stalls, the plug-in segment's pitch shrinks to "get an electrician to install a £500 kit," a materially less compelling product.
- A funding partner needs to exist willing to fund independent consumer advice rather than requiring a referral/commission structure. This is currently a hypothesis that hasn't been validated.
- The "honest no" has to be defensible with real payback/viability math. This depends on the technical/economic grounding, which `grounding-research.md` itself flags as its weakest-sourced section (no official UK payback dataset exists).

## Out of scope
No roadmap, synthetic interviews, clickable prototype, account-connection guide, AI-collaboration-review, user-stories, or technical-feasibility docs yet, sequenced next per `scope.md`.

## Open questions
- Which specific funding mechanism (SIF, NIA, Innovate UK, Nesta, or something else) actually fits: to be researched at the roadmap stage.
- Whether renters genuinely need landlord permission for a plug-in kit: flagged in `grounding-research.md` as an unverified, sales-favorable claim from sources with a commercial incentive to say no permission is needed. Needs direct verification of the Renters' Rights Act's actual text before it's ever repeated to a real user.
- How the two use-timings (before/after sales conversation) map to product flow: one flow with a branch, or two distinct entry points.

## Recommendation
**GO, with one explicit condition.** This brief's honesty depends on the technical/economic grounding (payback math, plug-in generation estimates) getting materially firmer than what currently exists. That's the weakest-sourced part of the research today. Proceed to personas and synthetic interviews next, as scoped, and treat the payback-math gap as something to actively tighten before any success-metrics claim gets tested for real, rather than papering over it with placeholder numbers in the meantime.

## Further reading
Full research: `scope.md`, `grounding-research.md` (same folder).

## A note on what this is
SunnySideUp is a fictional product built for a product management portfolio. Market research (UK solar regulation, market size, sales-practice complaints, and named competitors) is real and cited. Personas, interviews, and user data are synthetic, generated to stay internally consistent with that research rather than drawn from real people.

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
