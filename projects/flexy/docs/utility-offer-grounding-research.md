# Flexy for Utilities — Grounding Research

Every claim below is tagged **[Fact]** (cited, ideally primary-sourced), **[Inference]** (reasoned from stated facts, shown), or **[Assumption]** (flagged, unverified), per the portfolio's research discipline. This document backs `utility-partnership-offer.md`; it stays markdown-only and isn't rendered or published.

## Track A — What ComEd / grid operators actually value

### A1. Illinois's Clean and Reliable Grid Affordability Act (CRGA) legally mandates EV-charger VPPs

Governor Pritzker signed the CRGA on January 8, 2026. It directs Illinois utilities to deploy 3GW of grid-scale energy storage by 2030 and to build virtual power plant (VPP) programs that pay customers for the demand flexibility of batteries, smart thermostats, **and electric vehicle chargers**. Bidirectional EVs are classified as distributed energy resources for the first time, eligible for net billing credits. **[Fact — Utility Dive, Illinois House Democrats' own release, and the governor's newsroom all corroborate the signing and the EV-charger provision.]**

### A2. ComEd's currently-approved VPP is battery-only — the EV-charger VPP the law requires doesn't exist yet

The ICC approved ComEd's "Scheduled Dispatch Virtual Power Plant" (SDVPP): battery-based, discharges enrolled batteries during high-demand periods, five-season participant commitment (June 1–Sept 30). It replaced a broader VPP proposal ComEd withdrew in November 2025. ComEd has roughly 1.8GW of distributed energy resources connected to its grid today. **The approved SDVPP does not include EV chargers**, even though the CRGA that authorizes it names EV chargers as a required VPP resource category. **[Fact — Utility Dive.]**

**Why this matters for the offer:** this is the sharpest "why ComEd, why now" hook available — sharper than the TOU-rollout framing currently in `product-brief.md`. State law already requires ComEd to build an EV-charger VPP; the one program it has stood up doesn't have one yet. That's a live, dated, government-mandated gap, not an inferred opportunity.

### A3. ComEd already ran a dated EV managed-charging pilot — but it solved a different problem, and its own report says more is needed

ComEd's Electric Vehicle Energy Management System (EV EMS) Pilot, led by WeaveGrid (subcontracting Emporia and Treehouse), released its executive summary December 19, 2025. Twelve residential participants. Purpose: let homes with limited electrical panel capacity (ComEd's own 2022 study found roughly two-thirds of homes in its territory have 100A service or less — about 2.2 million homes) install Level 2 EV chargers by throttling charging to stay under the panel's amp rating, avoiding a $5,000–$15,000 panel upgrade. WeaveGrid's market-sizing in the report assumes Illinois hits its 1-million-EV goal by 2030, ComEd holds a 90% share (900k EVs), two-thirds of those sit in ≤100A homes (~600k homes), and $5,000 is a conservative average avoided-upgrade cost. **[Fact — direct primary-source read of the pilot's executive-summary PDF, ComEd/WeaveGrid, released Dec 2025.]**

**The single most important finding of this research pass**, quoted directly from that report:

> "EMS programs alone are insufficient to address the bulk system and distribution constraints increasingly impacting ComEd's system. Even if home load limits are addressed with EMS technology, active managed charging programs are required to address bulk system and localized peak constraints. WeaveGrid suggests ComEd require rebate recipients to participate in an active managed charging program to ensure overall grid value of EV charging is maximized."

**[Fact — same primary source.]** This is WeaveGrid — the vendor already inside ComEd's pilot process — telling ComEd, in a report ComEd itself commissioned, that panel-level load management isn't enough and that ComEd should require an active, price/grid-aware managed-charging program on top of it. That is almost exactly Flexy's MVP. This is real, dated, unprompted validation from inside the target account, not an inferred or invented rationale.

### A4. PJM capacity market economics — the concrete revenue mechanism, if one exists

ComEd sits in PJM's territory. PJM's capacity price for the 2026/2027 delivery year is $329.17/MW-day (≈$120,147/MW-year) — up from $28.92/MW-day in 2024/2025, an over 11x increase. **[Fact — cross-validated across two independent sources: Voltus's own reporting and a separate PJM market-conditions summary, which is why this is treated as Fact rather than a single-source claim.]** PJM's Economic (Load Response) program pays curtailment at the real-time or day-ahead LMP when it clears above a "Net Benefits Test" trigger price, historically around $75/MWh. **[Fact, but the source's own wording ("historically") leaves the current trigger value unconfirmed — flag for a fresher check before citing a specific number in a real pitch.]**

### A5. What managed EV charging is worth to a utility, per a named independent methodology

ev.energy, developed with research support from The Brattle Group, publishes a "Cost-Avoidance Stack" for actively-managed EV charging: $145–$575 per EV per year, broken into Generation Capacity ($60–140), Transmission ($20–55), Distribution ($5–300), Energy Procurement ($100–180), Ancillary Services ($0–80), and Customer Operations ($7–10). **[Fact — named methodology and named research partner, but ev.energy is itself a managed-charging vendor with a commercial interest in a favorable number; treat with the same caution the portfolio already applies to installer-sourced figures in SunnySideUp.]** Independent case precedent (not ComEd): El Paso Electric shifts residential EV charging out of its 4-hour summer peak to defer generation investment; PG&E sites using load management cut power needs 50%+, saving $30k–$200k per site in avoided infrastructure upgrades. **[Fact, different utilities — useful as precedent, not ComEd-specific evidence.]**

### A6. Ancillary services / frequency regulation — the overclaim check the scope note asked for

Engineering literature confirms EV chargers can physically respond fast enough for several regulation products (sub-second charger-level response; PJM-adjacent FFR needs ~1.3s, FCR-D ~2.5–7.5s, general frequency regulation "within a minute or less"). **[Fact — engineering/research literature.]** But this is feasibility research, not confirmation that a one-directional, price-driven charging-schedule product like Flexy's MVP would actually qualify for a specific ancillary-services program. Most of the literature assumes bidirectional (V2G) capability for the fastest-responding use cases; Flexy's MVP is start/stop only, no V2G. **Conclusion: ancillary services / frequency regulation should not be claimed as a near-term Flexy value stream.** This is the exact overclaiming risk the scope note flagged — fold it into the offer as a "later, if bidirectional" note, not a Now claim. **[Judgment call, explicitly flagged as such, not a sourced Fact.]**

### A7. ComEd's own committed capital shows real institutional appetite for this category

ComEd's Beneficial Electrification Plan 2 (2026–2028): $167.7M total investment, $136.6M specifically for EV charging infrastructure rebates, at least 56% reserved for low-income customers and communities. The ICC approved roughly $254M in combined transportation-electrification investment across ComEd and Ameren Illinois in March 2025. **[Fact — ICC filings, Sierra Club coverage.]**

---

## Track B — What utility-facing competitors actually show and offer

### B1. Optiwatt — the most transparent published production numbers found this pass

31,224+ enrolled devices (27,597 EVs, 3,195 thermostats, 432 chargers), 1.3+ GWh cumulative load shifted out of peak hours, 44 programs deployed, 36 utility partners. Utility portal: role-based access, device-level/load analytics, event management/reporting, self-serve data downloads. Names "snapback demand" (a new spike when many devices resume simultaneously after a naive load shift) as a failure mode its "peak smoothing" strategy specifically targets. "ResiFlex" packages pre-built flexibility products deployable "in weeks, not quarters." No partnership pricing or utility-specific financial case study disclosed. **[Fact — directly fetched from optiwatt.com/#results, their own marketing page, not independently corroborated against a third-party source.]**

### B2. WeaveGrid — already inside ComEd, but solving a narrower problem than Flexy's MVP

Real, current ComEd relationship confirmed via the Dec 2025 pilot (see A3): panel-capacity management, 12 participants. DISCO platform: described as "a single dispatch center" for behind-the-meter devices, with an EV-hotspot map by zip code and "comprehensive reporting," though no specific KPI figures are published on WeaveGrid's public utilities page. Largest publicly named deployment scale: Baltimore Gas & Electric's Smart Charge Management Program, expanded to 30,000 participants with Maryland PSC approval. **[Fact — WeaveGrid's own site, the SEPA managed-charging report, and the ComEd pilot PDF itself.]**

**Positioning implication:** WeaveGrid isn't a head-on competitor for Flexy's exact MVP inside ComEd today — their current ComEd work is panel-level throttling, not price-driven active managed charging. But they're the incumbent relationship-holder, and their own report makes the case for what Flexy sells. The offer should name this relationship honestly (ComEd already has an EV-managed-charging conversation underway) rather than pitch as if Flexy is the first mover into a blank space.

### B3. AutoGrid/Uplight — proof at real utility scale, vendor-reported

Acquired by Uplight (2023/2024), now a combined DERMS + customer-engagement platform. CPS Energy (San Antonio): $40M savings over 3 years, 240MW of flexibility managed. **[Fact per Uplight's own materials — no independent CPS Energy source corroborated this figure during this research pass, so treat as vendor-reported until checked further.]** Platform is explicitly framed as going beyond "dashboarding and reporting" into monetization/dispatch — a credibility bar worth matching in Flexy's own framing.

### B4. Itron/EnergyHub — dated, lower relevance to this offer

Partnership traces to 2009; the dashboard focus at that time was in-home display plus thermostat control, not clearly EV-specific or utility-operator-facing in what surfaced this pass. **[Fact but dated — deprioritized for the offer doc.]**

### B5. Leap — an aggregation-layer model structurally different from Flexy's direct offer

Software-only DERMS/aggregation platform: 400,000+ sites/devices, 100+ technology partners. New Enel partnership (Dec 2025) connects commercial/industrial DERs into utility DR programs in Washington, Arizona, and the Tennessee Valley. Leap's model works through technology partners into utility programs (closer to B2B2B2C) rather than Flexy's direct utility-partnership structure — a useful contrast, not a direct competitor for this specific offer.

### B6. Voltus — scale leader as a curtailment aggregator, not a utility-facing software/dashboard vendor

2025: 816,000 MWh of grid relief, 8.1GW of flexible capacity managed, $240M paid to customers. Google partnership: up to 100MW from flexible DERs in PJM. Octopus Energy partnership: residential DER aggregation into VPP portfolios across PJM, MISO, New York, and California. Voltus is the source that independently corroborates the PJM capacity-price figures in A4. **[Fact.]** Different category from Flexy (aggregator/market participant vs. utility-facing product), but its scale sets the bar for what "real" looks like in this space.

### B7. OhmConnect — residential behavioral DR, dated but relevant to equity framing

Historically the largest third-party residential DR provider in North America (as of 2018 sourcing — dated). UC Berkeley research found lower-income areas (e.g., Bakersfield) had higher program adoption than higher-income areas (e.g., Beverly Hills) after controlling for price. **[Fact but dated methodology/timeframe.]** Worth noting alongside ComEd's own BE Plan 2, which reserves 56%+ of its EV-rebate funding for low-income customers — an equity angle Flexy's offer could credibly connect to.

---

## Track C — Pricing benchmarks and a savings-to-ComEd model

Added to answer a direct question: what should Flexy charge ComEd. Two inputs are needed before a number means anything — what comparable platforms charge, and what Flexy would actually save ComEd. Searched specifically for both; neither was fully public, so this section builds the best available range from what is.

### C1. No competitor discloses utility-partnership pricing

Searched directly for WeaveGrid, Optiwatt, and AutoGrid/Uplight contract values, dollar figures in regulatory filings, and any RFP or procurement record naming a real number. None surfaced. **[Confirmed absence, not an unsearched gap — this matches Track B's earlier finding that Optiwatt's own results page also didn't disclose pricing.]**

### C2. A real, third-party benchmark for utility DR/DERMS SaaS pricing exists

An industry vendor guide (Codibly, a software consultancy publishing DR-platform buyer guidance, not a party selling into this specific deal) states: utility-deployed SaaS DR/DERMS platforms typically run **$5–$20 per participant per year, plus implementation services**; aggregator-model platforms (paid from wholesale market revenue, not a utility relationship) run 5–15% of that revenue instead; a utility building the equivalent capability in-house/custom runs $1M (accelerator-based) to $5M+ (green-field, utility-grade). **[Fact — directly fetched from the source, industry-guide-sourced rather than a regulatory filing or a specific vendor's disclosed contract, so treat as a benchmark range, not a confirmed ComEd-specific number.]** Flexy's existing model (a per-registered-customer fee, ComEd pays directly, no wholesale-market revenue share) matches the SaaS category, not the aggregator category.

### C3. A savings-to-ComEd model, built from figures already sourced in Track A

Using ComEd's own EV projection (900k EVs in its territory by 2030, per the WeaveGrid pilot's market sizing, §A3) and the Brattle/ev.energy avoided-cost figure ($145–$575 per actively-managed EV per year, §A5), annual value to ComEd scales with enrollment:

| Share of ComEd's projected 900k EVs enrolled | Enrolled EVs | Annual value to ComEd (at $145–$575/EV) |
|---|---|---|
| 1% | 9,000 | $1.3M – $5.2M |
| 5% | 45,000 | $6.5M – $25.9M |
| 10% | 90,000 | $13.1M – $51.8M |
| 25% | 225,000 | $32.6M – $129.4M |

**[Inference — the enrolled-EV figures are simple arithmetic on two already-sourced Fact-tier inputs; the enrollment-share rows themselves are illustrative scenarios, not a forecast, since no real pilot has run yet to know which one is realistic.]**

### C4. Cross-checking the SaaS benchmark against the savings model

At the $5–20/participant/year SaaS benchmark, Flexy's fee would represent roughly **1%–14% of the per-EV value ComEd realizes** (calculated against the $145–$575 range: $5/$575 ≈ 0.9%, $20/$145 ≈ 13.8%). That's a defensible vendor share regardless of which enrollment scenario in C3 plays out, since it's a per-participant rate, not tied to scale. **[Inference from C2 and A5's already-sourced figures.]**

---

## Synthesis — what this means for the offer

1. **The sharpest "why ComEd, why now" available is A1 + A2**: state law already requires an EV-charger VPP; ComEd's one live VPP doesn't have one. This should sit alongside, or replace, the TOU-rollout framing currently anchoring `product-brief.md`'s "why Illinois, why now" for the utility-facing doc specifically.
2. **A3 is the strongest evidence in this entire pass.** A primary-sourced, dated, ComEd-commissioned document where ComEd's own current EV-managed-charging vendor recommends exactly the category of program Flexy is built to be. Cite it directly and precisely in the offer doc — this is real, unprompted validation, not invented rationale.
3. **Flexy isn't walking into a blank room.** ComEd already has an active WeaveGrid relationship, on a materially different problem (panel capacity vs. active price-driven charging). Naming this honestly is stronger than pretending otherwise, and research-auditor should check for that framing directly when this goes into the offer doc.
4. **Exclude ancillary services / frequency regulation from near-term claims** (A6) — the overclaiming risk the scope note flagged is real, and the technical case doesn't support it for a one-directional MVP.
5. **PJM's capacity-price spike (A4) is real, cross-validated, timely market context** — but no ComEd-specific dollar or MW figure exists yet for what an active-managed-charging program (as opposed to panel EMS) would actually be worth. That gap should be stated plainly in the offer doc, not filled with an invented placeholder number.
6. **Optiwatt's and CPS Energy's numbers (B1, B3) set the credibility bar** for the KPI framework in Phase 4 — not to claim Flexy already matches them (it has no real users), but to make sure the KPI categories match what serious competitors already report to utilities.

## Open items — needs a fresher check before anything here goes into a pitch doc

- PJM Economic Load Response's *current* Net Benefits Test trigger price (source says "historically" ~$75/MWh; confirm before citing a specific number).
- CPS Energy's $40M/240MW figure is vendor-reported only; look for independent corroboration (CPS Energy's own materials, trade press) before treating it as settled.
- No ComEd-specific dollar or MW value exists yet for active managed charging specifically (distinct from the panel-EMS pilot's avoided-upgrade figure). This is a real, named gap — not something to paper over with an estimate in the offer doc.
- Whether Flexy's MVP would actually qualify for PJM's Economic Load Response program (day-ahead/real-time LMP-triggered curtailment) given its response characteristics is a still-open technical/regulatory question, separate from general capacity-market context.

## Sources

- [Illinois regulators approve ComEd VPP under new clean energy law — Utility Dive](https://www.utilitydive.com/news/illinois-approves-commonwealth-edison-vpp-under-new-clean-energy-law/824723/)
- [Illinois sets 3-GW energy storage target, requires utilities to develop virtual power plants — Utility Dive](https://www.utilitydive.com/news/illinois-sets-3-gw-energy-storage-target-requires-utilities-to-develop-vir/809189/)
- [Gov. Pritzker signs the Clean and Reliable Grid Affordability Act — governor's newsroom](https://gov-pritzker-newsroom.prezly.com/gov-pritzker-signs-historic-clean-and-reliable-grid-affordability-act)
- ComEd Electric Vehicle Energy Management System Pilot — Executive Summary (Dec 19, 2025), fetched directly from innovate.comed.com and read via local PDF extraction
- [ComEd Beneficial Electrification Plan 2 (2026–2028) — ICC docket P2024-0484](https://www.icc.illinois.gov/docket/P2024-0484/documents/366102/files/641295.pdf)
- [Illinois Commerce Commission approves $254 million investment in clean transportation — Sierra Club](https://www.sierraclub.org/press-releases/2025/04/illinois-commerce-commission-approves-254-million-investment-clean)
- [PJM Demand Response fact sheet — PJM.com](https://www.pjm.com/-/media/DotCom/about-pjm/newsroom/fact-sheets/demand-response-fact-sheet.pdf)
- [Economic Demand Response Settlements (Load Response) — PJM Knowledge Base](https://pjm.my.site.com/publicknowledge/s/article/Economic-Demand-Response-Settlements-Load-Response?language=en_US)
- [Voltus to Deliver $240 Million to Customers in Record 2025 — Voltus](https://www.voltus.co/press/record-2025-customer-awards)
- [PJM Demand Response — Voltus](https://www.voltus.co/demand-response/pjm)
- [Value of Managed Charging — ev.energy / The Brattle Group](https://platform.ev.energy/resources/value-of-managed-charging)
- [Optiwatt results page](https://optiwatt.com/#results)
- [WeaveGrid — Utilities](https://www.weavegrid.com/utilities)
- [WeaveGrid: Making EV Charging Accessible — ComEd Pilot with WeaveGrid](https://www.weavegrid.com/news/comed-evems-pilot-and-panel-upgrade-avoidance)
- [Five Key Takeaways from SEPA's State of Managed Charging Report — WeaveGrid](https://www.weavegrid.com/news/five-key-takeaways-from-sepas-state-of-managed-charging-report)
- [DERMS Solution Guide — AutoGrid | Uplight](https://uplight.com/resources/derms/)
- [CPS Energy Demand Response Program Named POWERGRID International Project of the Year — Black & Veatch](https://www.bv.com/en-US/news/cps-energy-demand-response-program-named-powergrid-international-project-of)
- [Leap and Enel Partner to Accelerate Nationwide Growth of Virtual Power Plants](https://www.leap.energy/news/leap-and-enel-partner-to-accelerate-nationwide-growth-of-virtual-power-plants)
- [Sense and OhmConnect partner to increase participant savings by 160%](https://www.prnewswire.com/news-releases/sense-and-ohmconnect-partner-to-increase-participant-savings-by-160-301414758.html)
- [Demand Response Software & Platform: A Vendor Guide for Utilities, Aggregators, and C&I Buyers — Codibly](https://codibly.com/blog/articles/demand-response-software)

## Status

Draft v2. Track A and Track B research complete per `utility-offer-scope.md`'s research questions. Track C (pricing benchmarks + savings-to-ComEd model) added to answer a direct pricing question. Not yet run through `research-auditor`. Ready for review before updating `utility-partnership-offer.md`'s Business Model section.
