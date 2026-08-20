# Fund the Future: handover

Status as of 20 August 2026. Everything below is committed on `claude/nifty-rubin-6czdga`. Read this first in a new session, then `scope.md`, then `market-selection.md`, then `grounding-research.md`.

## What this project is
A campaign-building and fundraising platform for grassroots climate-adaptation organisations. An organisation enters who they are and what they need money for, and gets a shareable campaign page with a working donation path.

## Read this before anything else: what was corrected on 20 August 2026

Three things in the earlier version of this project were wrong and have been fixed. A new session should not reintroduce them.

1. **The diaspora thesis is deleted.** An earlier pass built the donor side on diaspora giving, reasoning that remittances are $905bn against $70bn of cross-border philanthropy, so the bigger rail should be used. **That conflated two different behaviours.** Remittance is money sent to one's own family under obligation. This product asks for charitable giving to strangers. Proximity to a country is not proximity to a cause. Diaspora was also criterion 4 of six in the market selection, so the selection was re-run without it. Do not reintroduce remittance volume as evidence of willingness to donate.
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

- `scope.md` — current. Carries all locked decisions, the restated criteria, the in-scope research list and the riskiest-assumption log.
- `market-selection.md` — rewritten 20 August 2026. Five criteria, criterion 4 deleted, criterion 2 restated to total registered NPO count. The Philippines is re-derived on the registry and payout-rail criteria. Kenya's override condition is stated plainly.
- `grounding-research.md` — sixteen sections, every claim tagged Fact, Inference or Assumption. Sections 10 to 16 were added 20 August 2026.
- **No product brief yet.** This is the next deliverable and nothing blocks it.

## Why the Philippines won, without diaspora

Selected on the two criteria that map to the product's two hard problems.

- **Registry.** The SEC runs a dedicated NPO regime where organisations file annual General Information Sheets and audited financial statements. Every other candidate offers a record that an organisation exists. This one shows whether it filed. Confirmed in section 15: the **free** public search returns status, address and a record of GIS and AFS submissions, while certified copies of the documents are a paid service the product does not need. Revocation commonly follows non-filing, so a status of Registered is weak evidence of continuing compliance rather than only of past existence.
- **Payout rail.** Banks plus seven wallet providers, through two like-for-like providers (dLocal and Xendit). The wallet channel matters most, because an organisation with no bank account can still be paid.
- **Honest weakness:** the Philippines is the weakest candidate on poverty rate at 15.5% and does not lead on climate impact. The weighting toward the two product-critical criteria is deliberate and stated in the document.
- **Kenya is the live override.** On registry quality and payout maturity Kenya beats the Philippines, and deleting the diaspora criterion strengthened Kenya rather than weakening it. It stays out on FATF grey-listing plus the 2024 referral of 16 civil society organisations to the Directorate of Criminal Investigations.

## The findings that should shape the brief

1. **The product grows a category rather than splitting one.** Cross-border philanthropy is ~$70bn against ~$770bn of global individual charitable giving, roughly 9%, and it has been broadly flat since 2018. Any framing that positions the opportunity as capturing a slice of $392bn or $2.3tn misstates the market by two orders of magnitude.
2. **The mismatch is the story.** Foundation funding for climate adaptation and resilience was **$870m in 2024** against a projected adaptation need of **$310bn per year by 2035**. That is 0.28%. Meanwhile adaptation philanthropy more than doubled from $404m in 2021 and the number of funders grew 55%, so the category is expanding, which is what makes the grow-the-pie goal evidence-backed rather than aspirational.
3. **There is a strong "why now".** ODA fell 23.1% in real terms in 2025 to $174.3bn, the largest annual decline on record, with the United States alone accounting for 75.1% of the fall. The institutional money these organisations depend on is being withdrawn as the need grows.
4. **Asia and Oceania receive under 10% of adaptation funding** while holding more than half the world's population, and disaster risk management and community infrastructure are the least funded sectors. The pilot market sits in the least-served region doing the least-funded work.
5. **The competitive gap is documentation, not geography.** GlobalGiving already operates in 175+ countries. What it does not do is serve organisations without formal registration, two years of financial statements, a documented board and a prior-funder track record. Every requirement removed to reach them is a fraud control GlobalGiving chose to keep.
6. **Two independent bodies of evidence converge on the same page design.** The identifiable victim effect favours a named person and a specific bounded project. The transparency evidence favours a named accountable person and a costed budget. Section 16 adds a third: climate donors are the highest-due-diligence segment in the IRS donor database, so a page built to be checked suits a donor who checks.
7. **Page creation is instant and payout is not.** Xendit KYC review takes 5 to 10 business days. The campaign page must work and be shareable during that gap, which is a product requirement rather than a caveat. Any speed claim must be stated against page creation, never against money arriving.
8. **One finding cuts against the product and must not be buried.** Donation size is strongly driven by perceived effectiveness at addressing climate change, and adaptation protects against consequences rather than reducing emissions. The costed line-by-line budget is the available answer, because it lets a donor judge effectiveness at project level instead of at the level of a climate claim.

## Next steps, in order

1. **Draft `product-brief.md`** against `templates/product-brief-template.md`. Every claim-bearing section cites back to `grounding-research.md`. Do not re-derive the research. Nothing blocks this.
   - Note for the brief: the go-to-market section has no named donor market to stand on, because the user chose global donor-behaviour research without country depth. It should describe mechanisms rather than channels. Section 10's US cause breakdown is the available structural proxy. Worth raising with the user when that section is reached.
   - Product decisions deliberately left to the brief rather than settled in research: whether the product is built on structured disclosure, whether recurring giving ships in the MVP, and how it positions against fiscal sponsorship, which is the closest existing substitute.
2. **Run `research-auditor` on the brief draft before presenting it**, per the standing rule. Include the cross-document numeric-conflict check.
3. **Build the case study page** at `projects/fund-the-future/index.html`, following the `index.html` / `prototype.html` / `docs/` / `assets/` convention.
4. **Add a `fund-the-future` entry to `scripts/build_docs.py`**'s `PROJECTS` dict to render the docs to HTML. Note that `grounding-research.md` stays markdown-only and is never rendered or linked publicly.
5. **Link the project from the portfolio hub** `index.html`. It is currently unlinked. Read `docs/portfolio-feedback.md` first, per the repo instruction.
6. **Prototype**, including the greyed-out country selector from locked decision 8.

## Missing research areas

None of these blocks the product brief. Each is a flagged Assumption in `grounding-research.md`.

**Worth chasing**
1. **Whether the Philippine SEC register has a public API.** The SEC lists an "API Marketplace" among its online services, but sec.gov.ph returns HTTP 403 to automated fetching and the eSEARCH front end is a JavaScript application that returned no readable content. Decides whether verification is an automated check or a manual lookup. Lower stakes than it was, because under donor tips verification is a fixed operating cost rather than a per-campaign margin question.
2. **A current Philippine NPO count.** The 64,087 figure is as of December 2020 and search-snippet sourced. The AMLC NPO Risk Assessment PDF returned HTTP 503 when fetched, and no current figure was published elsewhere that could be found.
3. **A Philippine climate or environment NGO subset.** Never obtained in any market across three passes. The addressable-population estimate in section 2 applies Kenya's environment-sector share as a cross-country proxy, which is order-of-magnitude only.
4. **dLocal's onboarding timeline.** Xendit's is known at 5 to 10 business days. dLocal's is not published anywhere found.
5. **Time from deciding to fundraise to receiving a first donation** on any existing platform. This is the benchmark the product's core speed claim would be judged against and no measured figure exists.

**Verification tasks on existing citations**
6. **UNEP Adaptation Gap Report 2025** figures are corroborated by two independent searches but still search-snippet sourced. unep.org, sei.org, weadapt.org, iisd.org and the report PDF on wedocs.unep.org all returned HTTP 403 to automated fetching. **Needs a human to open the report.**
7. **The FATF June 2026 grey list** is secondary-sourced. FATF's own page returns 403.
8. **The Philippines' 83.1 composite climate-risk figure** is secondary-sourced and needs a primary check.
9. Also search-snippet sourced and worth upgrading: World Bank Remittance Prices Worldwide Q3 2025, Stripe country and Connect coverage, GoFundMe and Chuffed fee schedules, ClimateWorks reports, Giving USA cause-level data tables, the donor benchmarks in section 12, and everything in section 16.

**Expansion, not needed for the MVP**
10. **Ghana's foreign-funding position.** Ghanaian NGOs register under the Companies Act and no restriction was located, but nothing positively confirms that foreign donations are receivable without an approval gate. Ghana was previously dismissed partly for a small diaspora, which is no longer a reason for anything, so this is a live question rather than a closed one.

**Probably unanswerable**
11. **Whether donors accept structured disclosure in place of audited financials.** No source tests it. It sits directly under locked decision 6 as a named assumption.
12. **Whether individual donors will fund adaptation specifically**, as distinct from disaster relief. Nothing examined measures this, and it is the deepest assumption in the project. **Split it before testing it.** Adaptation with a countable physical output (mangroves planted, hectares restored, wells dug) has retail-funding precedent and suits the costed budget required by locked decision 6. Adaptation without one (early-warning governance, institutional capacity) has neither, and is equally adaptation. The real question is what share of the target user base does work of the first kind, and therefore whether the product's fundable set is narrower than the user base it is designed for. This is answerable with a sample of real Philippine organisations and is worth doing before the roadmap.

## Process notes
- UNEP, FATF, Reddit, niceic.com and sec.gov.ph all block automated fetching. Reddit and similar bot-walled sites are unreachable regardless of network settings.
- If a PDF extraction tool fails to install, run `apt-get update` before `apt-get install poppler-utils`. A stale package list has previously been misdiagnosed as a broken environment.
- The `scope.md`, `grounding-research.md`, `research-auditor` sequence is the repo's standing process. Run the auditor on your own draft before presenting it, not only when asked.
