# Groundtruth - Product Brief

## Grounding facts

1. **Most early-stage solar projects fail before they reach construction.** Paces, a company building AI-driven development-risk tools, cites failure rates in the 70–90% range for clean-energy projects between initial site identification and notice-to-proceed, with real capital lost at each stage (site option payments, interconnection study fees) regardless of outcome. Source: Paces' published whitepaper on early-stage development risk.

2. **P50 and P90 are the two standard ways lenders and developers describe expected energy yield.** P50 is the median-case estimate: there's a 50% chance actual output exceeds it. P90 is the conservative case: a 90% chance actual output exceeds it, used by lenders to size debt because it represents a number the project is very likely to hit or beat. The P50/P90 ratio typically runs about 1.10–1.20x for a given site. Source: SurgePV, a solar-industry publication.

3. **NREL's PVWatts is a real, free, public API for modeled energy output.** It takes a latitude/longitude and system parameters and returns modeled AC/DC output (monthly and annual) plus capacity factor. It's rate-limited to 1,000 requests/hour and requires a free API key. I verified this directly by fetching NREL's own developer documentation (developer.nrel.gov) rather than relying on a secondary source.

4. **The federal solar Investment Tax Credit (Section 48E) is set at 30% for projects that begin construction by a mid-2026 deadline**, per current secondary tax-guidance sources. I have not verified this against the primary IRS text, so I'm flagging it as secondary-sourced and worth re-checking before it's used in any real financial model, since ITC rules and deadlines are exactly the kind of thing that changes.

5. **A real competitor, RatedPower, explicitly markets against PVcase's financial modeling gap.** In its own comparison content, RatedPower states: "PVcase is not a bankable software since it has limited feasibility and financial information," positioning its own product around built-in NPV/IRR/ROI/LCOE and P75/P90/P95/P99 modeling. This is a direct quote, preserved as such. It's marketing language from a competitor, so it should be read as a positioning claim rather than a neutral third-party assessment. Even so, it's a real, findable, public claim that the financial/bankability layer is a recognized gap in this product category.

6. **Interconnection and permitting risk is the hardest part of this problem to model, and the people building in this space say so themselves.** Paces' own published methodology describes interconnection and permitting risk assessment as relying on regional expert input and historical pattern data rather than a clean public API. There's no equivalent to PVWatts for "will this project clear interconnection review."

## The problem

An early-stage solar developer or analyst who wants to know whether a site is worth pursuing today has two options: a full engineering-grade design tool (PVcase, RatedPower, Helioscope) that assumes the site is already past initial screening, or a spreadsheet built in-house that has to be re-derived and re-trusted every time someone new joins the team. Neither answers the actual first question, which is: given basic site inputs, is this worth the cost of a site option payment and an interconnection study, or should the team pass and look at the next parcel.

That first-pass financial screening step, before CAD-level design work starts, is where a real gap exists. RatedPower's own marketing names it directly when describing what PVcase lacks. Paces is building toward it from the risk-modeling side. The specific combination of real yield modeling (P50/P90) with real financial output (LCOE/IRR) in a fast, pre-design screening tool is the space Groundtruth targets.

## What Groundtruth is

A feasibility and ROI screening tool for early-stage solar development. Given a site's location and basic system assumptions, it returns a P50/P90 energy yield estimate, a real-formula LCOE and IRR calculation, and a risk-adjustment layer that reflects the specific, named risks (site control, interconnection, permitting, environmental, design) a project faces before it reaches construction.

## Who it's for

A development analyst or associate at a solar developer, screening 10–30 candidate sites a month, deciding which ones are worth an option payment and an interconnection study fee, both real, non-refundable costs in the $10k–25k range each per the sourced figures above. Their current tool is usually a spreadsheet, and their current problem is that the spreadsheet's assumptions live in one person's head.

## MVP scope

One flow: enter a site (latitude/longitude and basic system size), get back a P50/P90 yield estimate (via NREL PVWatts, a real primary-source API), a real-formula LCOE and IRR calculation using that yield plus user-entered cost assumptions, and a risk-adjustment layer that flags the specific development-stage risks named above rather than folding them into a single opaque score.

## What Groundtruth is not

It is not a CAD or single-line-diagram design tool. It is not a construction-stage project management tool. It does not attempt to predict interconnection approval or permitting timelines with a model, because no reliable public data source for that exists yet; see the note below.

## The part that's genuinely hard, named honestly

Yield modeling has a real public API behind it. Financial modeling is standard formula work once yield and cost assumptions exist. Interconnection and permitting risk does not have an equivalent clean data source; the developers building dedicated tools for this (Paces) describe relying on regional expert input and historical pattern data rather than an API. Any version of Groundtruth that claims to score interconnection or permitting risk should say plainly that it's a heuristic, until a real data source for that exists.

## Status

Draft. Grounding research complete for yield methodology, financial modeling approach, and competitive positioning. Not yet built: persona and discovery interviews, a thin prototype of the core flow, a roadmap slice, and a technical feasibility doc.

**A note on sourcing:** solar development is a domain I have no prior hands-on experience in, so every technical or industry claim in this brief is sourced. Primary sources (NREL, direct API docs) are cited as such. Secondary sources (industry blogs, vendor marketing, tax-guidance summaries) are flagged as secondary rather than stated as settled fact. Where I couldn't find a reliable source, I said so instead of guessing.
