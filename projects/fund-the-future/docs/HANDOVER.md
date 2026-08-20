# Fund the Future: handover

Status as of 20 August 2026. Everything below is committed on `claude/fund-the-future-platform-7dcuva`. Read this first in a new session, then the three docs it points at.

## What this project is
A fast campaign-building and fundraising platform for grassroots climate-adaptation organisations in the Global South. An organisation enters who they are and what they need money for, and gets a shareable campaign page with a working donation path.

## Decisions locked by the user (inputs, not open questions)
1. **Geography:** Global South organisations, Global North and diaspora donors.
2. **Product surface:** campaign builder plus a shareable link. No funder discovery surface, no directory, no grantmaker matching.
3. **Monetization:** a small platform fee on funds raised.
4. **Pilot markets:** Philippines, Nigeria, Honduras. Pilot only, not the product's limit.
5. **Verification is a product pillar and stated differentiator**, not a compliance afterthought.
6. **Canonical figure:** Honduras poverty is **50.3%** (World Bank). A 63% figure circulates elsewhere and is not used anywhere in this project.

## Where things stand
- `scope.md` — agreed. Six selection criteria, riskiest-assumption log, in/out of scope.
- `market-selection.md` — agreed. Method, per-market evidence, why Kenya/India/Maldives were dropped, and a full analysis of whether anything replaces Honduras (answer: no, keep it, with override conditions written down).
- `grounding-research.md` — complete and self-audited. Nine sections, every claim tagged Fact/Inference/Assumption.
- **Scope said this pass ends at audited grounding research. It has ended. The product brief has not started.**

## The five findings that should shape the brief
1. **Retail giving may not work for this sector.** Kenya's government sector report puts individual donors at 2.3% of NGO income, falling 10% year on year, against affiliates at 27.6%. This is a retail-giving product aimed at a sector where retail giving is marginal. Unresolved, and upstream of everything else.
2. **The competitive gap is not geographic.** GlobalGiving already operates in 175+ countries. What it does not do is serve organisations without formal registration, two years of financial statements, a documented board, and a prior-funder track record. Your users sit below that eligibility floor on documentation rather than legitimacy. Every requirement removed to reach them is a fraud control GlobalGiving chose to keep.
3. **Cross-border cost dominates the fee decision.** 7% to 12% is gone before the platform charges anything. GlobalGiving charges non-US/UK organisations 10% all-in with a 15% ceiling. That leaves roughly 2% to 3% of room.
4. **The evidence argues against a verification badge.** Research on certification seals is narrow and contradictory; research on financial transparency is stronger. The catch is that financial transparency is exactly what these organisations cannot produce. No answer to this yet.
5. **Money transmitter classification decides the architecture.** If the platform holds and disburses donor funds it likely needs US state-by-state licensing. If funds settle directly to the organisation through a licensed provider, the platform is software. The second is the viable route, and it means no escrow, no easy refund guarantee, no pooling of small donations.

## Honduras: two caveats the brief must carry
- Its government has administratively restricted foreign donations **during natural disasters**, which is when this product would see peak demand.
- It is single-rail for local-currency bank payout. Its only verified alternative provider reaches a Visa card or a SWIFT account instead, which is a different rail rather than a substitute.

## Open questions carried forward
Listed in full at the end of `grounding-research.md`. The ones that matter most: whether retail giving works for this sector at all, money transmitter classification, whether any pilot registry offers programmatic lookup (assumed not, which makes verification a manual per-organisation cost that collides with a percentage fee), and registered climate NGO counts, which could not be obtained for any pilot market.

## Suggested next step
Run the `product-brief` work against `templates/product-brief-template.md`, citing back to `grounding-research.md` for every claim-bearing section. Do not re-derive the research; it is the backing material and stays markdown-only.

## Note on process
UNEP's site blocks automated fetching, so the Adaptation Gap Report 2025 figures are search-snippet sourced and need a human to open the report. Reddit, niceic.com and similar bot-walled sites remain unreachable regardless of network settings.
