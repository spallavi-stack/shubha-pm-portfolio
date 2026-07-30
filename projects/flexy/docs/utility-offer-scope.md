# Flexy for Utilities — Scope

## What this addition is

Flexy's B2B2C model (see `product-brief.md`) has only ever been shown from the consumer side. This addition builds the other half: the offer Flexy makes *to* ComEd, and the operator-facing dashboard that offer runs on. Named as a gap in `next-steps.md` ("Missing half of the product: the utility side") and in the portfolio audit that produced the working checklist this is sequenced from.

## In scope for this pass

- **Grounding research, Track A — what ComEd/grid operators actually value, with a real mechanism behind each claim.** Not "reduces grid costs" as an abstract good; the specific demand-response/virtual-power-plant value-stack categories (capacity value, energy arbitrage, ancillary services, T&D deferral, avoided unscheduled outage/load-shedding cost) checked against what's real and claimable for an EV-charging aggregation specifically, and against ComEd's actual market context (PJM capacity and demand-response programs, ComEd's own DR tariffs).
- **Grounding research, Track B — what utility-facing competitors actually offer and price.** WeaveGrid, AutoGrid/Uplight, Itron/EnergyHub, Leap, Voltus, OhmConnect, and Optiwatt: their utility-facing dashboard/reporting offer, partnership/pricing structure where public, and any case study with a utility naming a real MW or dollar figure.
- **`utility-partnership-offer.md`** — positioning, why-ComEd-cares argument (sourced), offer structure, partnership success metrics distinct from the consumer PMF signals already in `product-brief.md`.
- **KPI framework** for the operator dashboard, validated against Track A/B research rather than asserted from first principles.
- **`utility-dashboard.html`** — a coded operator-dashboard prototype.

## Explicitly out of scope for this pass

- **No change to the existing B2B2C fee structure** (per-registered-customer fee + annual platform license) in `product-brief.md`, unless Track A/B research surfaces a specific reason to revisit it. If that happens, it gets flagged as an open question, not silently changed.
- **No rebuild of the consumer-side prototype or docs.** This is additive.
- **No claim that Flexy currently qualifies for fast-response ancillary services / frequency regulation markets** unless research specifically supports it — this is a category competitors sometimes overclaim, and Track A should say plainly if EV-aggregation timing/precision doesn't actually qualify rather than asserting it does.
- **No new persona.** This offer is written to ComEd as an institutional counterparty, not a persona-driven end-user artifact.

## Research questions Track A needs to answer

1. What DR/capacity mechanisms does ComEd (via PJM) actually participate in today, and which ones could an aggregated EV-charging-timing product plausibly plug into?
2. What's the real cost ComEd avoids by shifting EV charging load out of peak hours — is there a citable figure (a demand charge, a capacity price, an avoided-cost estimate) rather than a directional claim?
3. Does EV-charging-timing control (minutes-to-hours response, not sub-second) genuinely qualify for any ancillary-services/frequency-regulation program, or is that overclaiming?
4. What does ComEd's own public materials (rate filings, DR program pages, IRP/grid-modernization filings) say it already values or is planning around EV load?

## Research questions Track B needs to answer

1. What do WeaveGrid, AutoGrid/Uplight, Itron/EnergyHub, Leap, Voltus, and OhmConnect each show a utility partner, specifically (dashboard, reporting, KPIs)?
2. Where public, how is the utility partnership priced or structured (fee-per-enrollment, revenue share, platform license, something else)?
3. Is there a named case study anywhere with a real utility, a real MW or dollar figure, and a citable source (press release, case study page, regulatory filing)?
4. What gap, if any, is visible across these competitors that Flexy's offer could credibly claim to fill?

## Preliminary Track B data point (collected during scope review, to carry into Phase 2)

**Optiwatt** (optiwatt.com/#results, fetched during scoping): publishes real production numbers — 31,224+ enrolled devices (27,597 EVs, 3,195 thermostats, 432 chargers), 1.3+ GWh cumulative load shifted out of peak hours, 44 programs deployed, 36 utility partners. [Fact — directly fetched from their own marketing page, not independently corroborated against a third-party source yet.] Their utility portal offers role-based access, device-level/load analytics, event management/reporting, and self-serve data downloads. Names "snapback demand" (a new spike when many devices resume simultaneously after a naive load shift) as a failure mode their "peak smoothing" strategy specifically targets — a real technical risk worth checking Flexy's own KPI framework against. No partnership pricing or utility-specific financial case study was disclosed on this page.

## Status

Scope drafted, ready for review before Track A/B research begins. Optiwatt added to the Track B competitor list with one preliminary data point already collected.
