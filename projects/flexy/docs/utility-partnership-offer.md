# Flexy for Utilities — Partnership Offer

## One-liner
Flexy gives ComEd a live, aggregated view of enrolled EV charging as coordinated, dispatchable grid capacity, the active managed-charging layer Illinois law already requires ComEd to build, and one ComEd's own pilot work has already identified as the missing piece next to panel-level load management.

## Positioning statement
For ComEd, Flexy is the operator-facing layer that turns a fleet of individually-charging EVs into a single, visible, reportable resource: a pool of flexible load ComEd can see, predict, and shift away from strained hours, without building device-level charging software itself. Flexy sells to ComEd; the household never pays directly (see Business model).

## Why ComEd cares

An electric grid has to keep supply and demand matched in real time to hold a stable frequency. Two things make that harder every year: demand spikes that weren't scheduled for, and supply that shows up or disappears on its own schedule (wind and solar output shifting faster than dispatchable generation can follow). A utility carries real, ongoing cost for both sides of that problem: building and maintaining capacity margin, buying expensive last-minute supply when demand outruns forecast, and absorbing or shedding load when supply outruns it.

Aggregated, price-aware EV charging is one of the few levers that can move in either direction without new hardware in the field. Charging load can be shifted into a surplus-supply window (soaking up power the grid would otherwise waste or curtail) or out of a strained window (acting, in effect, like a battery the utility doesn't have to build). The specific value categories this maps to, and what's actually confirmed for ComEd versus true in general:

- **Capacity value.** PJM's capacity price for the 2026/2027 delivery year is $329.17/MW-day (≈$120,147/MW-year), up from $28.92/MW-day the year before, an over 11x increase.[^1] Flexible, aggregated EV load is a candidate resource for this market; what a ComEd-specific program would actually be worth in this market is not yet calculated (see Open questions).
- **Distribution and transmission deferral.** Shifting charging away from local peaks can delay the substation and feeder upgrades a fixed load pattern would otherwise force. This is the same mechanism ComEd's own EV EMS pilot used to avoid $5,000–$15,000 household panel upgrades, applied at the circuit and substation level instead of the panel level.[^2]
- **Avoided unscheduled outage and load-shedding cost.** Every measure a utility keeps on hand for a demand spike it didn't plan for (emergency purchases, load shedding, spinning reserve) has a real cost; shifting predictable EV load out of unpredictable peak windows reduces how often those measures get triggered.
- **What this pass did not confirm**: whether Flexy's charging-control profile (start/stop scheduling, no bidirectional power flow) would actually qualify for a fast-response ancillary-services or frequency-regulation program. The literature shows EV chargers can be physically fast enough for some regulation products, but that's a feasibility finding, not a qualification one, and most of it assumes vehicle-to-grid (V2G) hardware Flexy's MVP doesn't use. This offer doesn't claim ancillary-services revenue.[^3]

Illinois has also just made this a legal obligation, not only an economic opportunity. The Clean and Reliable Grid Affordability Act (CRGA), signed January 8, 2026, requires Illinois utilities to build virtual power plant programs paying customers for the flexibility of batteries, smart thermostats, and electric vehicle chargers specifically.[^4] ComEd's one approved VPP so far, the Scheduled Dispatch VPP, is battery-only.[^5] The EV-charger VPP the law names is a gap ComEd has to close, not a feature Flexy has to convince ComEd it wants.

## The WeaveGrid relationship, and the gap it names

ComEd is not new to EV managed charging. In December 2025, ComEd released the executive summary of its Electric Vehicle Energy Management System (EV EMS) Pilot, run by WeaveGrid with Emporia and Treehouse as subcontractors: twelve residential participants, testing whether panel-level load management could let homes with limited electrical service (roughly two-thirds of ComEd's territory, about 2.2 million homes) install a Level 2 charger without a costly panel upgrade.[^2]

That pilot solved a different problem than Flexy solves. It keeps a single home's total load under its panel's amp rating; it doesn't shift charging toward the grid's cheapest or least-strained hours, and it doesn't aggregate charging across households into a resource ComEd can see or dispatch as one thing. WeaveGrid's own report to ComEd names this gap directly:

> "EMS programs alone are insufficient to address the bulk system and distribution constraints increasingly impacting ComEd's system... active managed charging programs are required to address bulk system and localized peak constraints. WeaveGrid suggests ComEd require rebate recipients to participate in an active managed charging program to ensure overall grid value of EV charging is maximized."[^2]

Flexy is built for exactly that category: active, price- and grid-aware managed charging, aggregated across every enrolled household into one dispatchable view. The offer to ComEd is to fill the gap ComEd's own pilot partner already flagged, not to displace the panel-level work WeaveGrid has already done, and not to pitch a category ComEd hasn't heard of before.

## What ComEd gets

An operator dashboard (built out in the next phase of this work) giving ComEd:
- A live view of enrolled EV charging as aggregated, flexible capacity, updated continuously, not a static report.
- Forecast and actual load-shift data by time window, so ComEd can plan around it the way it plans around any other resource.
- Reporting formatted for what ComEd itself has to demonstrate: CRGA compliance, Beneficial Electrification Plan outcomes, and the enrollment/impact figures a utility reports to its own regulator.
- A partner that owns the household-facing product entirely, so ComEd doesn't have to build or maintain EV-charging software of its own.

## What Flexy needs from ComEd

- **Distribution.** ComEd promotes or bundles Flexy to its real-time and TOU rate customers (the consumer-side product already assumes this; see `product-brief.md`).
- **Data access.** A Green Button Connect My Data partnership for live interval usage data, beyond the self-service manual export Flexy can already use without a formal relationship (see `technical-feasibility.md`).
- **Program design input.** ComEd's own read on which flexibility mechanism (a CRGA-aligned VPP tariff, a BE Plan-funded pilot, a PJM-facing program, or some combination) it wants Flexy's aggregated load to plug into. This offer identifies the opportunity; ComEd's own regulatory and market position determines which specific mechanism it becomes.

## Business model and pricing

Structure unchanged from `product-brief.md`: ComEd pays a fee per customer registered through the rollout, plus an annual platform license fee.

The per-customer fee can now be grounded in two figures rather than left unset. No competitor publishes what it actually charges a utility, but a third-party industry guide (not a party selling into this deal) puts utility-deployed DR/DERMS SaaS platforms at **$5–$20 per participant per year, plus implementation services** — the category Flexy's model matches, as distinct from an aggregator's revenue-share model.[^6] Checked against what ComEd would actually realize per enrolled EV ($145–$575/year, per the Brattle/ev.energy avoided-cost figure already cited above), that benchmark represents roughly 1%–14% of the value delivered per vehicle, a defensible share regardless of how many households ultimately enroll.[^6][^7]

That gives a workable **per-customer fee range of $5–$20/year** to anchor a real negotiation, not a single frozen number, since the low and high ends both fall inside what comparable platforms already charge. What the total contract is worth to Flexy still depends on enrollment scale, which no pilot has established yet:

| Share of ComEd's projected 900k EVs (2030) enrolled | Enrolled EVs | Flexy's annual fee revenue (at $5–$20/participant) | ComEd's annual value realized (at $145–$575/EV) |
|---|---|---|---|
| 1% | 9,000 | $45k – $180k | $1.3M – $5.2M |
| 5% | 45,000 | $225k – $900k | $6.5M – $25.9M |
| 10% | 90,000 | $450k – $1.8M | $13.1M – $51.8M |

The annual platform license fee stays a separate, unbenchmarked component — no source found this pass prices that piece specifically, so it remains a number to set in direct negotiation with ComEd, not one to estimate here. If ComEd's own program design ties Flexy's fee to verified capacity delivered (a performance-based component) rather than a flat per-participant rate, that's a real option worth raising directly rather than assumed in this document.

## Partnership success metrics

Distinct from the consumer PMF signals already defined in `product-brief.md` (pilot extension, downloads, smart-charging activations), these measure whether the *partnership itself* is delivering what this document claims it will:

- **Aggregated flexible capacity enrolled**, tracked over time (kW/MW of dispatchable EV charging under management).
- **Dispatch reliability**, the share of the time enrolled load actually shifted when a peak or surplus window called for it, since this is the trust mechanism the offer depends on as much as any consumer-facing one.
- **Forecast accuracy**, predicted versus actual load shift.
- **Reporting completeness against ComEd's own compliance needs** (CRGA, BE Plan), since that's a concrete, checkable deliverable rather than a soft partnership-health signal.

## Open questions

- What a ComEd-specific active-managed-charging program would actually be worth in dollars or MW is not calculated anywhere in this research. The panel-EMS pilot's avoided-cost figure ($5,000–$15,000 per household) answers a different question. This is a real gap to close with ComEd directly, not something to estimate here.
- The current PJM Economic Load Response Net Benefits Test trigger price needs a fresher check before being cited as a specific number in any real conversation with ComEd.[^1]
- Which CRGA-aligned mechanism (VPP tariff, BE Plan program, a PJM-facing structure, or something ComEd designs) this offer should actually target is ComEd's call, not something this document can settle unilaterally.

## Status
Draft v2. Positioning, why-ComEd-cares argument, the WeaveGrid-relationship framing, offer structure, and partnership success metrics are drafted from `utility-offer-grounding-research.md`. Business Model section updated with a sourced per-customer fee range ($5–$20/year) and a savings-to-ComEd model at three enrollment scenarios, replacing the earlier unset placeholder. Platform license fee remains explicitly unbenchmarked. Not yet run through `research-auditor`. KPI framework above is a first pass, to be validated and expanded in Phase 4 before the dashboard build.

## Sources
[^1]: `utility-offer-grounding-research.md` §A4. PJM capacity market economics
[^2]: `utility-offer-grounding-research.md` §A3. ComEd already ran a dated EV managed-charging pilot
[^3]: `utility-offer-grounding-research.md` §A6. Ancillary services / frequency regulation — the overclaim check
[^4]: `utility-offer-grounding-research.md` §A1. Illinois's Clean and Reliable Grid Affordability Act
[^5]: `utility-offer-grounding-research.md` §A2. ComEd's currently-approved VPP is battery-only
[^6]: `utility-offer-grounding-research.md` §Track C. Pricing benchmarks and a savings-to-ComEd model
[^7]: `utility-offer-grounding-research.md` §A5. What managed EV charging is worth to a utility, per a named independent methodology
