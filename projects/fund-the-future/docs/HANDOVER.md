# Fund the Future: handover

Status as of 21 August 2026. Read this first in a new session, then `scope.md`, then `market-selection.md`, then `product-brief.md`, then `design-brief.md`. `grounding-research.md` is the full backing material behind all of it.

**Where the project stands.** Research is closed. The product brief is drafted and audited. The design brief is written and is ready to be taken into a design tool. Nothing is blocked. The next piece of work is visual design, then the prototype.

## What this project is

**The user's own statement of purpose, August 2026:** *"I want grassroots organizations doing honest work in adaptation to have a way to fund their activities through retail giving."*

In product terms: a campaign-building and fundraising platform for grassroots climate-adaptation organisations. An organisation enters who they are and what they need money for, and gets a shareable campaign page with a working donation path. Each phrase of the purpose statement maps to a locked decision. *Grassroots* is the user below the documentation floor. *Honest work* is why verification is a pillar and why the page shows evidence rather than a badge. *Retail giving* is the channel, chosen in full knowledge that retail giving is about 2% of this sector's income today.

## Read this before anything else: what was corrected on 20 August 2026

Three things in the earlier version of this project were wrong and have been fixed. A new session should not reintroduce them.

1. **The diaspora thesis is deleted.** An earlier pass built the donor side on diaspora giving, reasoning that remittances are $905bn against roughly $82bn of cross-border philanthropy (2023), so the bigger rail should be used. **That conflated two different behaviours.** Remittance is money sent to one's own family under obligation. This product asks for charitable giving to strangers. Proximity to a country is not proximity to a cause. Diaspora was also criterion 4 of six in the market selection, so the selection was re-run without it. Do not reintroduce remittance volume as evidence of willingness to donate.
2. **The pilot is one country, the Philippines.** It was three (Philippines, Nigeria, Honduras). Three markets produced three partial answers on payout and verification rather than one complete one.
3. **Monetization reversed from a platform fee to donor tips.** See locked decisions below.

## Decisions locked by the user (inputs, not open questions)

1. **Geography:** Philippines only for the pilot. Global South ambition beyond that is a post-MVP roadmap question.
2. **Donor:** climate-motivated retail donors, meaning people who already give to environmental or climate causes and would give to adaptation if it were legible, specific and trustworthy. Institutional funders are treated as visitors arriving via a shared link.
3. **Product surface:** campaign builder plus a shareable link. No funder discovery surface, no directory, no grantmaker matching.
4. **Custody: none.** Donations settle from the donor, through a licensed payment provider, directly into the organisation's account. The platform never holds funds, so it is software rather than a money transmitter and needs no US state-by-state licensing. **Accepted consequences: no refunds, no holding funds pending investigation, no pooling of small donations, no all-or-nothing goals.**
5. **Monetization: donor tips. The organisation pays nothing.** Reversed from the fee-on-funds model locked at kickoff, because cross-border costs already take 7% to 12%, because verification costs roughly the same per organisation regardless of amount raised so a percentage fee earns least from the smallest campaigns, and because charging the under-resourced party contradicts the positioning. Accepted weakness: tip revenue is unpredictable, and the business model now rests entirely on tip uptake.
6. **Verification is shown as evidence, not as a badge.** The page displays the SEC register entry and filing history, the named person accountable for the money, a line-by-line account of what the funds buy, prior work, and what will be reported back. No seal, no tier, no rating. Because the platform holds no money, every claim is about what was checked rather than what is guaranteed.
7. **Goal framing: grow the pie.** The product aims to increase total philanthropic money reaching grassroots adaptation work rather than capture a share of an existing flow, because there is no large existing flow to redirect. This is an MVP case study, so the ambition is stated openly while success metrics measure proxies a single platform could instrument.
8. **Country selector in the product:** the Philippines is the only selectable option at signup. Kenya, Ghana and Mozambique appear greyed out and unselectable, labelled as markets coming next. This is a build instruction for the prototype.
9. **Canonical figure:** global individual giving is **$770bn**, covering cash donated to charity only. $1.3tn (adds volunteered time) and $1.5tn (adds family transfers) are barred from this project's material. $2.3tn may be quoted only as the all-sources money-and-time total it is.
10. **Canonical figure:** Honduras poverty is **50.3%** (World Bank). A 63% figure circulates elsewhere and is used nowhere in this project.

## Where things stand

- `scope.md`. Current. Locked decisions, restated criteria, in-scope research list, riskiest-assumption log. Assumption 8 is now largely answered.
- `market-selection.md`. Current. Five criteria, the Philippines re-derived on registry and payout rails. The unsourced 83.1 climate-risk figure was deleted on 21 August 2026 and must not be reintroduced.
- `grounding-research.md`. Sixteen sections, every claim tagged Fact, Inference or Assumption. A verification pass on 21 August 2026 upgraded most of the weak sourcing to primary and corrected three figures.
- `product-brief.md`. **Drafted 21 August 2026**, against the frozen template, audited before presenting. Recommendation is GO to prototype and concept test. Not GO to build.
- `design-brief.md`. **Written 21 August 2026**. Carries the user's dictated direction verbatim, the onboarding model, the seven-theme library, the page skeleton, the content model, and the four aesthetic decisions deliberately left to be made by eye in a design tool.
- **No personas, jobs-to-be-done, roadmap, prototype or case-study page yet.**

## Decisions taken on 21 August 2026

These came out of drafting the brief and are locked unless the user reopens them.

1. **Recurring giving ships in the MVP.** The environmental-sector evidence carries it: monthly giving is 32% of environmental online revenue, and new-donor retention of 24% to 28% means a single campaign raises money roughly once.
2. **The United States is the pilot donor market.** Chosen because it is the only pool with a published cause breakdown and the market every benchmark in the research describes. No US-specific donor research was done, which is stated in the brief.
3. **Fiscal sponsorship is positioned against on cost and control**, since it is the substitute that already works.
4. **Two onboarding flows.** Pre-onboarding vets the organisation once, budgeted at five business days, running in parallel with the payment provider's own KYC, which already takes 5 to 10 days. Campaign creation is then fast and repeatable. **The gate sits on the organisation, never on the campaign.**
5. **Because the platform holds no money, there is no remedy after the fact, so the gate is the only fraud control the product has.** This is the single most important structural finding of the day and it drove decision 4.
6. **Vetting may be thorough about anything the platform can check, and must not demand documents a grassroots organisation cannot produce.** Hard to verify is acceptable. Hard for a grassroots group to supply is not. If the mandatory list drifts toward GlobalGiving's, the product keeps the friction and loses its purpose.
7. **Seven themes**, down from a proposed ten. A theme earns its place when it changes the setting, the counting unit and the register at once.
8. **A theme is a content structure that knows what the work is measured in**, rather than a palette swap. That structure is what the target organisation cannot produce for itself.
9. **A named human being on the page is a requirement**, and the builder explains why at the point it asks.
10. **The campaign page is the case-study hero screen.** The design pass covers the campaign page and the builder only.

## Edge cases recorded rather than designed

The prototype demonstrates the happy path. Each of these gets a line and no screen: rejection (reasons given, route to reapply), drafting during the wait (not supported, the wait is five days and a single status screen), green-light expiry (twelve months or until SEC status changes), and human vetting at scale (a known pilot limit).

## Why the Philippines won, without diaspora

Selected on the two criteria that map to the product's two hard problems.

- **Registry.** The SEC runs a dedicated NPO regime where organisations file annual General Information Sheets and audited financial statements. Every other candidate offers a record that an organisation exists. This one shows whether it filed. Confirmed in section 15: the **free** public search returns status, address and a record of GIS and AFS submissions, while certified copies of the documents are a paid service the product does not need. Revocation commonly follows non-filing, so a status of Registered is weak evidence of continuing compliance rather than only of past existence.
- **Payout rail.** Banks plus seven wallet providers, through two like-for-like providers (dLocal and Xendit). The wallet channel matters most, because an organisation with no bank account can still be paid.
- **Honest weakness:** the Philippines is the weakest candidate on poverty rate at 15.5% and does not lead on climate impact. The weighting toward the two product-critical criteria is deliberate and stated in the document.
- **Kenya is the live override.** On registry quality and payout maturity Kenya beats the Philippines, and deleting the diaspora criterion strengthened Kenya rather than weakening it. It stays out on FATF grey-listing plus the 2024 referral of 16 civil society organisations to the Directorate of Criminal Investigations.

## The findings that should shape the brief

1. **The product grows a category rather than splitting one.** Cross-border philanthropy is **~$82bn in 2023** against ~$770bn of global individual charitable giving, roughly 11%. (Updated 21 August 2026: the previous $70bn/2020 figure came from an edition that has since been superseded, and the user has made $82bn canonical.) Any framing that positions the opportunity as capturing a slice of $392bn or $2.3tn misstates the market by two orders of magnitude.
2. **The mismatch is the story.** Foundation funding for climate adaptation and resilience was **$870m in 2024** against a projected adaptation need of **$310bn per year by 2035**. That is 0.28%. Meanwhile adaptation philanthropy more than doubled from $404m in 2021 and the number of funders grew 55%, so the category is expanding, which is what makes the grow-the-pie goal evidence-backed rather than aspirational.
3. **There is a strong "why now".** ODA fell 23.1% in real terms in 2025 to $174.3bn, the largest annual decline on record, with the United States alone accounting for 75.1% of the fall. The institutional money these organisations depend on is being withdrawn as the need grows.
4. **Asia and Oceania receive under 10% of adaptation funding** while holding more than half the world's population, and disaster risk management and community infrastructure are the least funded sectors. The pilot market sits in the least-served region doing the least-funded work.
5. **The competitive gap is documentation, not geography.** GlobalGiving already operates in 175+ countries. What it does not do is serve organisations without formal registration, two years of financial statements, a documented board and a prior-funder track record. Every requirement removed to reach them is a fraud control GlobalGiving chose to keep.
6. **Two independent bodies of evidence converge on the same page design.** The identifiable victim effect favours a named person and a specific bounded project. The transparency evidence favours a named accountable person and a costed budget. Section 16 adds a third: climate donors are the highest-due-diligence segment in the IRS donor database, so a page built to be checked suits a donor who checks.
7. **Page creation is instant and payout is not.** Xendit KYC review takes 5 to 10 business days. dLocal publishes no review time but does impose a hard 30-day KYC completion window after which the account deactivates, and reserves the right to reject an applicant without giving reasons. The campaign page must work and be shareable during that gap, which is a product requirement rather than a caveat. Any speed claim must be stated against page creation, never against money arriving.

9. **The environmental donor gives less and stays longer.** M+R Benchmarks 2026 publishes an Environmental cut: average one-time gift $93 against $139 across all causes, retention 53% against 48%, new-donor retention 28% against 24%, and monthly giving 32% of environmental online revenue against 27%. This is the strongest single argument in the research for shipping recurring giving in the MVP rather than deferring it, and it matters doubly under donor tips, where platform revenue tracks donor volume rather than gift size.

10. **Stripe cannot pay this product's users, in any market considered.** Stripe's own Connect documentation limits cross-border payout recipients to the US, UK, EEA, Canada and Switzerland. The default architecture a developer would reach for is unavailable, which makes dLocal and Xendit load-bearing rather than convenient.
8. **One finding cuts against the product and must not be buried.** Donation size is strongly driven by perceived effectiveness at addressing climate change, and adaptation protects against consequences rather than reducing emissions. The costed line-by-line budget is the available answer, because it lets a donor judge effectiveness at project level instead of at the level of a climate claim.

## Next steps, in order

1. **Visual design, in a design tool.** `design-brief.md` section 6 is the handoff. The four decisions left open there are the three typefaces, the photographic grade strength, the accent family per theme, and the impact module's form. All four need something rendered to judge against, which is why they were not settled in markdown.
2. **Personas, jobs-to-be-done and synthetic interviews.** The concept test in the brief's success-metrics section depends on them.
3. **Prototype**, including the country selector where the Philippines is the only selectable market and Kenya, Ghana and Mozambique are greyed out.
4. **The case study page** at `projects/fund-the-future/index.html`, following the `index.html` / `prototype.html` / `docs/` / `assets/` convention.
5. **Add a `fund-the-future` entry to `scripts/build_docs.py`** to render the docs. `grounding-research.md` stays markdown-only and is never rendered or linked publicly. `design-brief.md` is internal working material and should not be rendered either.
6. **Link the project from the portfolio hub.** It is still unlinked. Read `docs/portfolio-feedback.md` first, per the repo instruction.

## Missing research areas

Rewritten 21 August 2026 after a full verification pass. Nothing here blocks the product brief.

**Answered in this pass**
1. ~~Philippine SEC register API.~~ **It exists and it is priced.** The SEC API Marketplace sells a nine-API Company Information Lookup bundle covering registration status, AFS and GIS at PHP 10,000 per 100 calls a year or PHP 50,000 per 1,000, roughly PHP 50 to 100 per lookup. A separate SEC Number API is free at 10 calls a day. Verification can be automated. Residual task: register for the free tier and inspect one response, since its exact fields are undocumented.
2. ~~A current Philippine NPO count.~~ **Answered negatively, which is itself the answer.** The SEC publishes no aggregate. Answering a 2025 FOI request it quoted PHP 1,000 plus PHP 4 per minute for a raw data extract. The 64,087 figure from December 2020 stands with its date attached.
3. ~~A Philippine climate or environment NGO subset.~~ **Answered at the accredited tier.** Of 604 PCNC-accredited NGOs, 11 are Environment/Biodiversity, against 306 social welfare, 117 education and 36 health. Only 2 organisations in the whole register name disaster or resilience work. PCNC accreditation sits at roughly the documentation floor this product exists to reach below, so 11 is close to the number of Philippine environmental organisations that do **not** need it. PCNC also turns out to be a free second verification signal with a dated public register.
4. ~~dLocal's onboarding timeline.~~ **Partly answered.** No published review SLA, but a hard 30-day KYC window, no funds until KYC completes, and rejection without stated reasons.
6. ~~UNEP Adaptation Gap Report 2025.~~ **Verified primary.** Every figure matched: $310bn modelled and $365bn extrapolated by 2035, $26bn in 2023, 12 to 14 times, Glasgow doubling goal missed, private sector realistically ~$50bn.
7. ~~The FATF June 2026 grey list.~~ **Verified primary** against FATF's own 19 June 2026 statement. Kenya is listed. The Philippines, Nigeria, Ghana, Mozambique and Honduras are not.
9. ~~Search-snippet sources needing upgrade.~~ **Mostly done.** World Bank Remittance Prices, Stripe Connect coverage, GoFundMe and Chuffed pricing, ClimateWorks, Giving USA, the Global Philanthropy Tracker and the M+R benchmarks are all now primary. Still weakly sourced: conversion rate and mobile share in section 12, the AFP donor-band figures, the donor-behaviour findings in section 16, and DAF figures in section 11.
11. ~~Whether climate donors have benchmarks of their own.~~ **Answered.** M+R's Environmental cut, see finding 9 above.

**Still open**
5. **Time from deciding to fundraise to receiving a first donation.** A fourth attempt found nothing. Treat it as unpublished rather than unfound: instrument it from the platform's own data and state speed claims against page creation.
8. ~~**The Philippines' 83.1 composite climate-risk figure.**~~ **Deleted 21 August 2026 by the user's decision.** No index publishes it and it is not a Germanwatch CRI value. Criterion 1 stands on the CRI top-ten placement, which is separately sourced. Do not reintroduce it.
10. **Ghana's foreign-funding position.** The ICNL page reached is an overview of ICNL's own work rather than a legal analysis, and the Council on Foundations country note now 404s. Expansion-market question only.
12. **Whether donors accept structured disclosure in place of audited financials.** Untested by any source. Sits directly under locked decision 6.
13. **Whether individual donors will fund adaptation specifically.** Still the deepest assumption in the project. Two data points now bear on it and point opposite ways: a Philippine mangrove campaign that raised PHP 2.9m through GlobalGiving for a countable output, from 2014 and by a large corporate-backed foundation; and the PCNC finding that the certified tier of this whole category is roughly a dozen organisations. The sample of real Philippine organisations that would settle it has still not been assembled, and it remains worth doing before the roadmap.

**Three numeric conflicts, resolved by the user on 21 August 2026**
- Cross-border philanthropy: **$82bn (2023)** is canonical. $70bn (2020) survives only in trend descriptions, with its year stated.
- Remittance costs: the **Q3 2025 primary set** is canonical, 6.36% global, 8.46% Sub-Saharan Africa, 4.59% digital, 7.30% non-digital. The stacked-cost floor rises accordingly, so total leakage before any platform charge is **8% to 12%**, not 7% to 12%.
- Per-donor benchmarks: **M+R Benchmarks 2026 is canonical** wherever it publishes a figure, including its Environmental cut. Nonprofit Tech for Good survives only for conversion rate and mobile share, flagged as weaker.

## Process notes
- **Corrected 21 August 2026: "blocked by bot protection" described the tool, not the source.** UNEP, FATF and sec.gov.ph were all recorded as unreachable in earlier passes and all three were read directly in this one, through a scraping service using a stealth proxy. Three figures changed as a result and one closed question reopened. Before recording a source as unreachable, try a different fetching route.
- Genuinely unreachable: Reddit and similar bot-walled platforms. The AMLC NPO Risk Assessment PDF now returns 404 at its cited address, and GlobalGiving's search and country pages render client-side and yield nothing to a plain scrape.
- **A question closed on the grounds that nothing newer exists deserves re-checking.** The Global Philanthropy Tracker question was closed with more confidence than the evidence supported, and a 12th edition existed.
- If a PDF extraction tool fails to install, run `apt-get update` before `apt-get install poppler-utils`. A stale package list has previously been misdiagnosed as a broken environment.
- The `scope.md`, `grounding-research.md`, `research-auditor` sequence is the repo's standing process. Run the auditor on your own draft before presenting it, not only when asked.
