# Flexy: Product Brief

## One-line pitch
Flexy is a plug-in companion to your utility's app that turns a dynamic tariff into simple, automatic savings: cheaper EV charging and clear price and usage visibility, with no rate-plan expertise required.

## Problem
Three concrete problems, all tied to the same root cause: dynamic electricity pricing creates real savings opportunity, but only for households that can track and act on it, and most can't.

1. **Bill shock and rate distrust.** US residential electricity prices are up roughly 40% since 2021.[^1] Once a household is offered a dynamic or time-of-use rate on top of that backdrop, the natural reaction is caution, not adoption: 93% of energy bill payers are loss-averse, weighing the risk of a higher bill more heavily than the promise of savings.[^2] Priya (see Who it's for) is a direct example: she's stuck on her current rate because ComEd's own comparison materials didn't make the answer legible.
2. **Smart meter data going unused.** About 73% of US residential electric meters are already smart (AMI) meters.[^3] The data exists; almost none of it reaches a household in a form they can act on day to day. Devon's pattern (checking prices manually for two weeks, then quietly giving up) is what that gap looks like in practice.
3. **EV home charging cost and scheduling.** Marcus's pattern is the common one: plug in the moment he gets home, which on a real-time or time-of-use rate often lands squarely in the highest-price window of the day. ComEd's own filed time-of-use structure prices the 1–7pm peak at 10.7¢/kWh delivery versus 5.9¢/kWh standard, a gap large enough to move a real bill.[^4]

## Who it's for
MVP scope: homeowners on, or eligible for, ComEd's real-time or time-of-use rate, in Illinois. Four personas anchor the MVP (full detail in personas.md):

- **Marcus, the Accidental Peak Charger**: charges his EV the moment he plugs in, often during the exact hours that cost the most.
- **Priya, the TOU Skeptic**: won't switch rate plans without a clear, personal before/after comparison.
- **Devon, the Overwhelmed Watcher**: wants the savings of real-time pricing without the burden of checking prices manually.
- **Jenna and Sam, the Multi-EV Household**: need two vehicles' charging coordinated against one shared price signal.

All four share the same underlying need: a way to act on dynamic pricing without becoming a rate-plan expert.

## Why now
Illinois is the strongest available anchor for a true dynamic-tariff story in the US right now, for three reasons that are converging at once:

1. ComEd (and Ameren Illinois) run a genuine hourly Residential Real-Time Pricing program, where supply rates track the actual wholesale market price hour by hour.[^5] ComEd's four-year voluntary pilot (2020–2024) cut participants' peak demand 6.5–9.7% each summer, and the Illinois Commerce Commission has approved a mandatory residential time-of-use rollout for 2026.[^6] That is close to what Octopus Agile does in the UK or Tibber does in the Nordics: a tariff volatile enough that a household genuinely cannot track it unaided.
2. The federal solar tax credit (25D) and heat pump tax credit (25C) both expired December 31, 2025, under the One Big Beautiful Bill Act.[^7] Net metering is now the main driver of solar return on investment, and it varies state by state, an added reason the specific tariff a household is on matters more than it used to.
3. Bills are rising into this shift, not away from it: the roughly 40% national price increase since 2021 is the backdrop every one of these tariff changes lands on.[^1]

Illinois gives Flexy a concrete, well-documented tariff to build against first. The underlying bill-shock and rate-complexity problem shows up nationally, so Illinois is a starting point for a genuine multi-market expansion.

## Market size & opportunity
Flexy is B2B2C: the utility is the paying customer, the household is the end user and never pays directly. That means two different ways to size the opportunity, both sized tightly to real ComEd and ICC filings.

**Sized to the household base (ComEd pilot):**
- **TAM: 3.3M.** ComEd residential customers in Northern Illinois, the full addressable base if Flexy were offered to every ComEd household.[^8]
- **SAM: ~38,600+.** Residential customers already on ComEd's Hourly (Real-Time) Pricing program as of 2023, the segment already living with a dynamic tariff, before the 2026 mandatory time-of-use rollout expands this pool.[^9]
- **SOM: ~1%.** Of ComEd residential customers currently on a dynamic rate, a conservative starting point for a first-year pilot cohort, drawn from testimony in ICC hourly-pricing proceedings describing enrollment as a small fraction of the eligible base.[^9]

**Sized to the paying customer (utility count):**
- **TAM: ~3,000.** US electric utilities nationwide, the full population Flexy's white-label model could in principle serve.[^10]
- **SAM: ~168.** US investor-owned utilities, serving roughly 72% of US electricity customers, large enough to run a program like ComEd's and the closest structural fit to Flexy's B2B2C model.[^10]
- **SOM: 1–3.** Pilot utility partnerships targeted in year one, following the ComEd model, before expanding to additional dynamic-rate utilities.

Beyond ComEd specifically, SEPA's 2023 Utility Transformation Profile, surveying 100+ utility members representing over half of US customer accounts, found 71% already offer a time-of-day rate and 19% offer real-time pricing.[^11] That is the expansion runway: most of the tariff complexity Flexy is built to translate already exists at other utilities, it just hasn't been paired with a product like Flexy yet.

## Competitive landscape & differentiation
No single US player currently combines live dynamic/TOU price visibility, real-time consumption, and hardware-agnostic smart EV charging, delivered as a plug-in a utility can hand to its own customers. Optiwatt and WeaveGrid validate the business model; Tibber, Jedlix, and Emporia validate pieces of the feature set. Flexy's bet is that stitching all three into one utility-distributed layer is the differentiated position.

**EU direct inspiration.** Tibber and Octopus Energy/Kraken are each the retail energy supplier themselves, a B2C model built around owning the customer relationship end to end.[^12] Ohme and Jedlix are structurally closer to Flexy: third-party layers that plug into whichever tariff or utility relationship the household already has. None of the four combine price visibility, consumption, and EV charging in one product the way Flexy's MVP does.
- Tibber sells dynamic-price electricity directly plus the Tibber Pulse device for real-time consumption and app-based smart EV charging, the closest functional match to Flexy's three-feature combination.
- Octopus's Intelligent Octopus Go auto-schedules EV charging within a guaranteed cheap overnight window; customers on it typically saved £771 (May 2025–April 2026) versus Octopus's standard variable tariff.[^13]
- Ohme is EV charging hardware plus an app that works across suppliers, scoped to EV charging only, with no price-graph or consumption features.
- Jedlix is a B2B2C smart EV charging platform partnering with automakers and utilities/suppliers, structurally the closest match to Flexy's business model, but EV charging only.

**US market, where Flexy would actually compete or partner.**
- Optiwatt integrates a household's exact utility rate plan to auto-schedule EV charging and HVAC for the cheapest hours, and explicitly offers a utility-partnership/white-label model, the closest direct US competitor to Flexy's plug-in positioning. Its own site currently reports $91.51 average rewards earned and $13.03 average savings per device, both self-reported.[^14] Gap: no combined price-graph and consumption view in its consumer offering.
- WeaveGrid partners directly with utilities (PG&E, BGE) for managed EV charging, real-time charge status, rate information, and utility program enrollment, very close to Flexy's B2B2C-with-a-utility model. Gap: focused on EV charging and program enrollment, not price-graph or consumption visualization.
- Emporia is a free app plus hardware (a Vue energy monitor, EV chargers, smart plugs) showing real-time circuit-level consumption and scheduling devices to the cheapest rate windows, the closest US competitor on the consumption side.[^15] Gap: requires buying hardware, and EV smart charging is tied to owning an Emporia charger specifically.
- Span is a premium smart electrical panel, roughly $4,500 in hardware and $8,250–9,250 or more installed before tax credits, aimed at solar/battery/EV households already renovating.[^16] Sense discontinued consumer hardware sales at the end of 2025 and is pivoting toward licensing its technology directly into utility-deployed smart meters, itself a signal that the utility-distributed software layer model Flexy is proposing is where this market is heading.[^17]

**What app store reviews reveal, beyond the marketing pages.** Marketing copy describes what these products claim; reviews show what breaks once someone actually relies on them. Optiwatt's own App Store reviews surface a recurring trust failure: cars charging during peak hours despite a saved schedule, exactly the automation-trust risk Flexy is betting against.[^18] Ohme users report a related gap: when the API can't read a vehicle's battery, there is no simple time-based fallback, so the app stops working for that user entirely.[^19] Tibber's reviews flag a different honesty problem: the app shows only the commodity rate, leaving out grid and demand fees that can make up most of the real bill.[^20] None of this shows up on a marketing page.

## Solution
Three MVP features, in the order a household would actually use them: a price graph (today, tomorrow, monthly, annual) so a household can see what electricity costs right now and over time; a real-time consumption view, informational only in the MVP, since Flexy does not control other household devices; and smart EV charging, the one device category Flexy actually automates, connecting one or more EVs and charging them in the cheapest available hours against the live tariff and a user-set ready-by time. Full feature-level detail lives in roadmap.md.

## Hypothesis
We believe households on a dynamic or time-of-use electricity rate will use Flexy to check prices before they'd otherwise guess, and to hand EV charging over to automatic scheduling. Two named, falsifiable behaviors this predicts: households will open the price graph multiple times per week on their own initiative, and enrolled EV owners will keep smart charging switched on past the first week, when trust in the automation is most likely to break. Both map directly to the signals in Success metrics below.

## Go-to-market
1. **Channel strategy per segment.** Marcus and Devon are reached through ComEd's own customer communications (bill inserts, the ComEd app, hourly-pricing enrollment emails), since they're already ComEd customers on the relevant rate. Priya is reached through ComEd's TOU-rollout communications specifically, since her JTBD is tied to that exact transition. Jenna and Sam are reached the same way as Marcus, with EV-owner segmentation from ComEd's own per-EV incentive program.[^21]
2. **Institutional distribution.** ComEd itself is the primary distribution partner, since Flexy is B2B2C: the utility recommends or bundles Flexy as part of its own dynamic-rate rollout, no paid-acquisition spend required, the same distribution motion WeaveGrid and Optiwatt already run with US utilities.
3. **Business model, kept distinct from distribution.** The utility pays two ways: a fee per customer registered through the rollout, plus an annual license fee for the Flexy platform itself. The household never pays directly. This is a deliberate structural choice: it avoids Flexy having to acquire individual households cold, which no direct competitor in this space has solved cheaply.

## Success metrics & validation methodology
Since Flexy is B2B2C, product-market fit isn't one signal, it's two: does the utility keep paying, and do the households it enrolls actually use the product.

**Leading indicators:**
- Downloads: how many enrolled customers install the app once ComEd distributes or recommends it. Tests whether the utility's own distribution channel converts.
- Smart charging activations: how many of those downloads go on to connect an EV and turn on smart charging, beyond simply checking pricing. This requires more trust (handing over charging control) and ties directly to the app-store-surfaced trust risk named above.

**Lagging indicator:**
- Pilot extension: whether ComEd renews or expands the rollout past the initial pilot cohort. The clearest signal of all, since it means the utility itself sees enough value to keep paying.

**Go/no-go test.** A Sean-Ellis-style "how would you feel if this no longer existed" question is built for people with real usage history, so asking a persona this about a product they've never used would be incoherent. The synthetic-interview methodology instead described the concept (the one-line pitch plus Solution) to each persona within the interview itself, then asked how they'd feel about it going away. That tests reaction to a concept, a weaker signal than a literal PMF survey, and the classic 40% "very disappointed" threshold it borrows was calibrated on real usage data, a reaction to actual habits, a stronger basis than a reaction to a pitch. This specific question has not yet been run against Flexy's four personas; see Open questions.

## Critical success factors
- ComEd (or a comparable dynamic-rate utility) actually signs a pilot agreement. Without a utility partner, Flexy has no distribution channel and no paying customer.
- Smartcar's cross-brand EV coverage needs to hold up in real pilot use, beyond its own published compatibility list, since Flexy's "any EV brand" claim depends on it.
- ComEd's 2026 time-of-use rollout proceeds on schedule. If it slips, Flexy's Illinois anchor story weakens.
- Households actually trust automated EV charging enough to turn it on and leave it on, given the automation-trust failures documented in Optiwatt's and Ohme's own reviews above.

## Not yet covered (separate artifacts, sequenced next)
- **Solar and heat-pump savings calculators**, and the two personas built around them, were cut from this round of work. Not part of the MVP scope, not permanently excluded.
- **Roadmap-level feature detail** (custom settings vs. max-savings charging modes, per-vehicle preferences, day-of-week variation) lives in roadmap.md, not repeated here.
- **The clickable prototype** demonstrates the three MVP features end to end; see prototype.html.
- **Funnel and experiment design**, and the **utility-partnership commercial offer**, are separate artifacts with their own grounding research (funnel-experiment-grounding-research.md, utility-offer-grounding-research.md).

## Open questions
- What does the utility actually pay per registered customer, and does that number hold up against ComEd's real program economics? Not yet validated against a real ComEd conversation.
- Does Smartcar's coverage remain reliable across brands at pilot scale, or only for the single brand tested so far? See technical-feasibility.md.
- Would Flexy's four personas actually say they'd be "very disappointed" if it went away? The go/no-go test described above has not yet been run.
- This brief predates Flexy's later grounding-research process (see Further reading); a dedicated grounding-research.md covering Illinois regulatory and market context in full depth has not yet been written for Flexy as a whole, only for its funnel-analysis and utility-offer sub-projects.

## Recommendation
**GO**, scoped exactly as above: single utility (ComEd), single state (Illinois), three MVP features. The dynamic-tariff timing is real and dated (2026 TOU rollout, federal credits already expired), the business model has two direct US precedents (Optiwatt, WeaveGrid) already running it, and the core risk, automation trust, is named explicitly, with competitors' own reviews showing exactly where it breaks. The open questions above are the next validation work, sequenced to run during the pilot itself.

## Further reading
Full detail: personas.md, roadmap.md, technical-feasibility.md, synthetic-interviews.md, jobs-to-be-done.md. Flexy does not yet have a single project-level grounding-research.md the way later portfolio projects do; the claims in this brief are footnoted directly to primary sources instead (see Sources below).

## Sources
[^1]: Fortune, "[2025 was a turning point for your electricity bill and it's just getting started](https://fortune.com/2026/05/20/electricity-bills-surging-not-just-data-centers/)" (May 2026), citing PowerLines and Bloomberg analysis: US residential electricity prices up nearly 40% since 2021.
[^2]: Nicolson, M. et al., *Energy Research & Social Science*, on [loss aversion among energy bill payers](https://discovery.ucl.ac.uk/id/eprint/1541213/) (93% loss-averse).
[^3]: US Energy Information Administration, "[How many smart meters are installed in the United States, and who has them?](https://www.eia.gov/tools/faqs/faq.php?id=108&t=3)" (2022 data: ~73% of residential electric meters are AMI).
[^4]: Citizens Utility Board, "[CUB's report on 2026 electric rates](https://www.citizensutilityboard.org/blog/2026/01/19/cubs-report-on-2026-electric-rates/)" (Jan 2026): ComEd's filed time-of-use delivery structure, 10.7¢/kWh peak (1–7pm) versus 5.9¢/kWh standard.
[^5]: [ComEd Hourly Pricing program](https://hourlypricing.comed.com/).
[^6]: Citizens Utility Board, "[ICC's ruling sets stage for 'time-of-use' rate](https://www.citizensutilityboard.org/blog/2025/04/14/iccs-ruling-sets-stage-for-time-of-use-rate-another-good-choice-for-consumers/)" (April 2025), citing Canary Media: ComEd's 2020–2024 pilot cut peak demand 6.5–9.7% each summer; ICC-approved mandatory residential TOU rate for 2026.
[^7]: Rewiring America, on the [25C heat pump tax credit](https://homes.rewiringamerica.org/federal-incentives/25c-heat-pump-tax-credits) and 25D solar tax credit both expiring December 31, 2025 under the One Big Beautiful Bill Act.
[^8]: [ComEd System Facts Sheet](https://www.comed.com/cdn/assets/v3/assets/blt3ebb3fed6084be2a/blt75a5a762e6a99951/65438a836aec50000acf329d/SystemFactsSheet.pdf?branch=prod_alias): 3.3 million residential customers in Northern Illinois.
[^9]: "Commonwealth Edison Company's Hourly Pricing 2023 Annual Report," [filed with the Illinois Commerce Commission, Docket P2015-0602](https://www.icc.illinois.gov/docket/P2015-0602/documents/350023/files/611973.pdf): 38,591 Hourly Pricing participants in 2023 (figure sourced via a search summary of the filing, not independently re-extracted from the PDF, flagged here for transparency); ICC Docket 24-0378 confirms the mandatory 2026 residential TOU rollout; the ~1% SOM figure is drawn from testimony referenced in ICC hourly-pricing proceedings describing enrollment as a small fraction of the eligible residential base.
[^10]: EIA, "[Investor-owned utilities served 72% of U.S. electricity customers in 2017](https://www.eia.gov/todayinenergy/detail.php?id=40913)": ~3,000 total US electric utilities, of which 168 are investor-owned.
[^11]: SEPA 2023 Utility Transformation Profile, [via pv magazine USA](https://pv-magazine-usa.com/2023/02/10/sepa-survey-shows-utilities-favored-approaches-to-become-carbon-free/): 71% of surveyed utilities offer a time-of-day rate, 19% offer real-time pricing.
[^12]: [Tibber](https://tibber.com), [Octopus Energy / Kraken](https://octopus.energy), [Ohme](https://ohme-ev.com), and [Jedlix](https://jedlix.com) company sites, for each company's own product/business-model description.
[^13]: Octopus Energy, [Intelligent Octopus Go](https://octopus.energy/smart/intelligent-octopus-go/): customers "typically saved £771" (May 2025–April 2026) versus Flexible Octopus, the standard variable tariff.
[^14]: Optiwatt, [consumer product page](https://optiwatt.com/consumers): self-reported $91.51 average rewards earned, $13.03 average savings per device.
[^15]: [Emporia Energy](https://www.emporiaenergy.com/) product site.
[^16]: Span smart panel pricing: approximately $4,500 hardware, $8,250–9,250+ installed before tax credits (installed cost varies materially by source, region, and model). [Source](https://www.greenwavedist.com/blog/how-much-does-a-span-panel-cost/).
[^17]: Sense, "[Looking ahead: the next chapter for Sense](https://sense.com/consumer-blog/looking-ahead-the-next-chapter-for-sense/)": consumer hardware sales discontinued December 31, 2025, technology moving into utility-deployed smart meters.
[^18]: [Optiwatt App Store reviews](https://apps.apple.com/us/app/optiwatt-local-energy-rewards/id1536047033), on cars charging during peak hours despite a saved schedule.
[^19]: [SpeakEV forum](https://www.speakev.com/threads/ohme-fails-to-reach-target-battery-level-as-set.187408/) and Ohme's own support documentation, on the app's inability to fall back to time-based charging when a vehicle's battery state can't be read.
[^20]: [Tibber reviews on Trustpilot](https://www.trustpilot.com/review/tibber.com), on the app showing only the commodity rate and omitting grid/demand fees.
[^21]: personas.md, Jenna Alvarez & Sam Kim: ComEd's proposed TOU program includes a $2/month per-EV bill credit, capped at two vehicles for up to two years.
