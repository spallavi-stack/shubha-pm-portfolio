# BarrioGrid — Discovery Scope

## Project basics
- Problem area: hyperlocal peer-to-peer (P2P) energy trading — letting a commercial solar prosumer sell surplus generation directly to nearby residential consumers at a price between the utility's surplus buyback rate and its retail rate, instead of both sides settling for the utility's spread.
- Target user: two distinct sides of one transaction — (1) a commercial solar prosumer with a 100-150 kW rooftop array producing more than it self-consumes, and (2) 15-20 residential consumers within a ~2 km radius who currently buy all their power from the grid retailer.
- Geography/constraints: suburban Valencia, Spain (Paterna / Torrent corridor), under distributor i-DE (Iberdrola network operator for the region). Regulated by Spanish P2P/collective self-consumption rules, which route physical settlement through the distributor's allocation-coefficient mechanism rather than a private ledger.
- Known constraint from prior research: the primary technical bottleneck is generating allocation-coefficient XML files in the format i-DE's systems will actually accept — this is a real, named integration risk, not a hypothetical one.
- Deliverable: a portfolio case study plus an interactive Python/Streamlit prototype, backtested against real historical data pulled from free open APIs (PVGIS for solar generation, REE/ESIOS for wholesale price context, Datadis for metered consumption).

## In scope for this pass
- **Product brief** — states the core hypothesis (a 12¢/kWh matched rate beats both the utility's ~5¢ surplus buyback and Virtual Battery's ~5-8¢ banked credit for the prosumer, while beating the utility's ~20¢ retail rate for consumers), the anchor model (1 prosumer : 15-20 consumers, <2km), and named success metrics.
- **Grounding research**, covering:
  - Spanish collective self-consumption / P2P energy-sharing regulation — what legally allows this trading model today, and what the allocation-coefficient mechanism actually requires operationally (not just that it exists).
  - i-DE's specific role and technical requirements as the local distributor, including what's known about their allocation-coefficient submission format/process — this is the named bottleneck and needs real sourcing, not an assumed workaround.
  - Competitive grounding on "Batería Virtual" (Virtual Battery) offers — what they actually pay per kWh, how the banked-credit model works, and specifically what they *don't* offer (e.g. real-time/dynamic allocation, direct prosumer-consumer pricing) that BarrioGrid's model would.
  - Market sizing for the addressable opportunity — not just how many Virtual Battery contracts exist today, but the addressable population of commercial solar rooftops + nearby residential density in comparable Spanish suburban corridors.
- **Runtime data model for the core calculation** — BarrioGrid's core value is an arbitrage-matching calculation (surplus generation matched to consumer demand at a computed rate). Grounding research and the technical-feasibility doc must name the actual runtime inputs this needs (generation profile, consumption profile, wholesale price signal, distributor tariff periods) and which free API (PVGIS / REE-ESIOS / Datadis) plausibly supplies each one, including known gaps or access restrictions in each API.
- **Technical feasibility doc** — focused specifically on (a) the i-DE allocation-coefficient XML bottleneck: what format is required, whether it's documented publicly, and what a prototype can realistically simulate versus what would require an actual distributor integration in production; and (b) feasibility of backtesting the Streamlit prototype against PVGIS/REE-ESIOS/Datadis historical data, including any access/auth constraints on each.
- **Personas** — grounded in the two sides named above (commercial prosumer operator, residential consumer within radius), only as many segments as have meaningfully different needs/incentives — likely 2, not more invented for padding.

## Out of scope for this pass
- No roadmap yet — sequencing comes after the product brief and technical feasibility findings are in, since the roadmap depends on knowing what's actually buildable pre-distributor-integration.
- No synthetic interviews or user stories yet — these follow once personas are drafted and validated against the grounding research, per the standard project sequence.
- No account-connection/real-data-integration guide yet as a separate doc — API access details belong inside technical feasibility for this pass; a dedicated integration guide (mirroring Flexy's/SunnySideUp's pattern) can be split out later once the prototype is actually being built against live APIs.
- No Streamlit prototype code yet — this pass is research and the product brief only; the interactive prototype is a build step that follows once the technical feasibility findings confirm what's simulatable.
- No cross-references to other portfolio projects (Flexy, SunnySideUp) — BarrioGrid's docs stand alone per the portfolio-wide writing rule.
