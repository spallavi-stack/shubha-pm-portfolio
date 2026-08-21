# Fund the Future: Product Brief

*Drafted August 2026. Compressed from [`grounding-research.md`](grounding-research.md), which holds the full sourcing and confidence level for every claim footnoted here. Scope and locked decisions are in [`scope.md`](scope.md); pilot market selection is in [`market-selection.md`](market-selection.md).*

## One-line pitch

Fund the Future verifies a grassroots climate-adaptation organisation once, in about a week, and then lets it publish a designed campaign page with a working donation path in an afternoon, without the registration history, audited accounts and funder track record that every existing platform asks for first.

## Problem

Adaptation finance needs in developing countries are projected at $310bn a year by 2035 against $26bn of international public adaptation finance in 2023, a gap of 12 to 14 times.[^1] Philanthropy is not closing it: foundation funding for adaptation and resilience reached $870m in 2024, which is 0.28% of the projected need.[^8] The money that does exist lands away from the organisations doing the work. Asia and Oceania receive under 10% of adaptation funding while holding more than half the world's population, and disaster risk management and community infrastructure are the least funded sectors in the category.[^8] In humanitarian funding, the best-tracked analog, $1.7bn went directly to local and national actors in 2023, 4.5% of trackable funding, against a 25% target set in 2016 that has never been met.[^6]

For a small Philippine organisation the practical problem is narrower than any of those numbers. The platforms that could carry its story ask for what it does not have. GlobalGiving already operates in 175 countries, so geography is not the barrier; formal registration, two years of financial statements, a documented board and a prior-funder track record are.[^4] Every requirement removed to reach this organisation is a fraud control that GlobalGiving chose to keep, which is the real design problem rather than a gap in the market nobody noticed.

## Who it's for

**The organisation: a Philippine grassroots adaptation group below the documentation floor.** Registered with the SEC or intending to be, doing work with a physical output such as mangrove replanting, watershed restoration or flood-resilient community infrastructure. It has a named leader accountable for money, no audited accounts, no grant history, and often no business bank account, which is why wallet payout matters more than bank payout.[^3] The scale of this population is not directly measurable: 64,087 NPOs were registered across all classifications as of December 2020, and of the 604 organisations PCNC has accredited, 11 are Environment/Biodiversity.[^2] That accredited tier is roughly the documentation floor this product sits below, so those 11 are close to the count of Philippine environmental organisations that do not need it.

**The donor: a US climate-motivated retail giver.** Someone already giving to environmental or climate causes who would give to adaptation if it were legible and checkable. They give roughly a third less per gift than the all-cause average, $93 against $139, and retain better, 53% against 48%, with monthly giving at 32% of environmental online revenue against 27% across causes.[^7] They are also the highest-due-diligence segment in the IRS donor database, researching environmental charities at close to the rate donors research medical and direct-aid charities.[^11]

**The institutional funder, who is a visitor rather than a user.** Programme officers arrive through a shared campaign link. The product builds nothing for them, per the locked product-surface decision, and the page has to survive their scrutiny anyway.

## Why now

Official development assistance fell 23.1% in real terms in 2025 to $174.3bn, the largest annual decline on record, with the United States alone accounting for 75.1% of the fall.[^6] The institutional money these organisations depend on is being withdrawn while the need grows. At the same time the category they work in is expanding: adaptation philanthropy more than doubled from $404m in 2021 to $870m in 2024, and the number of foundations making adaptation grants grew 55%.[^8] Two things are true at once, and the second is what makes a new entrant plausible rather than merely necessary.

The payout mechanics have also arrived. Two like-for-like providers, dLocal and Xendit, document bank and e-wallet payouts into the Philippines covering seven wallet providers, which means an organisation with no bank account can still be paid.[^3]

## Market size & opportunity

The realistic flow is small, and stating it honestly is the point of this section. Global individual charitable giving is roughly $770bn.[^6] Of that, cross-border philanthropy is about $82bn in 2023, roughly 11%.[^6] Environment and animals take 3.6% of US giving even domestically.[^6] Of what crosses a border, very little reaches local organisations directly.[^6] Compounding those shares puts individual cross-border giving currently reaching small local climate and environment organisations in the hundreds of millions of dollars globally rather than billions, an order-of-magnitude estimate built by multiplying independently sourced shares, since no source measures this flow directly.[^6]

**The opportunity is therefore to grow a category rather than to take a share of one.** Adaptation philanthropy doubling in three years with a 55% rise in the number of funders is the evidence that the category expands when it becomes fundable.[^8] Any framing that positions this as capturing a slice of $392bn or $2.3tn misstates the market by two orders of magnitude, and the brief should not be read that way.

## Competitive landscape & differentiation

| | Reaches undocumented organisations | Charges the organisation | Holds the funds |
|---|---|---|---|
| GlobalGiving | No, by policy[^4] | 7% plus 3% for non-US/UK, 15% ceiling[^4] | Yes |
| Donorbox | Requires the org to already have a payment relationship | 2.95% plus processing[^4] | No |
| GoFundMe / Chuffed | Philippine payout coverage not established | 0%, donor tips[^4] | Yes |
| Fiscal sponsorship | Yes, this is the real substitute | Not researched | Yes, by definition |
| **Fund the Future** | **Yes, by design** | **Nothing** | **No** |

**Fiscal sponsorship is the substitute that already works,** and the differentiation has to be stated against it rather than around it. A fiscal sponsor lets an unregistered group receive charitable money under another entity's legal status, which means the funds pass through the sponsor's entity rather than the organisation's.[^12] What sponsors charge, and how they handle the donor relationship, was not researched, and both should be established before this contrast is used publicly. Fund the Future takes nothing from the organisation, never holds its money, and leaves the donor relationship with the organisation, because donations settle from the donor through a licensed payment provider directly into the organisation's account. The honest cost of that position is that the product cannot offer US tax-deductibility, which a fiscal sponsor can, and for some donors that will decide it.

**Against the platforms, the differentiator is what gets shown rather than what gets charged.** The Philippines was selected because its SEC register carries a continuing filing obligation, so the page can show whether an organisation filed rather than only that it exists.[^10]

## Solution

Eligibility is settled once, before any campaign exists. The organisation answers the bureaucratic questions, the platform vets them by API where it can and by human contact where it cannot, and issues a green light in about five business days, running alongside the payment provider's own KYC so the week costs nothing in elapsed time.[^10] After that, campaigns are fast and repeatable. The organisation picks the kind of work it does from seven themes, and the page is generated from that theme's structure, which already knows what that work is counted in; the organisation supplies a photograph, a logo, its own words, and a named accountable person, who is required rather than optional. The page displays evidence rather than a badge: the SEC register entry and filing record, the named person, the costed budget, prior work, and what will be reported back.[^5]

**Why the gate sits on the organisation rather than the campaign.** Because the platform never holds the money, there is no freezing, no reversal and no holding pending investigation, so there is no remedy after the fact and the only available fraud control is at the entrance. Vetting per organisation also matches the cost structure, since verification costs roughly the same per organisation regardless of what any campaign raises.[^14] Full reasoning is in [`design-brief.md`](design-brief.md).

**What the verification display depends on, input by input.** The core mechanism is a check, so its data model is named here rather than assumed:

| Input | Source | Status |
|---|---|---|
| SEC registration number | Self-reported at signup | Decided |
| Registration status, GIS and AFS filing record | SEC register. Free eSEARCH lookup, or the SEC API Marketplace: free SEC Number API at 10 calls/day, or Company Information Lookup at roughly PHP 50 to 100 per call[^10] | **Automated or manual is undecided**, see Open questions |
| PCNC accreditation and expiry date | PCNC public register, free[^10] | Decided, shown only where held, absent where not |
| Named accountable person | Self-reported, **checked against nothing** | Decided, and the page must say so |
| Line-item budget | Self-reported | Decided |
| Prior work | Self-reported photos and links | Decided |
| Reporting commitment | Self-reported | Decided |
| Payout readiness | dLocal or Xendit KYC status[^10] | Decided |
| Work category, one of seven | Self-reported at pre-onboarding, selects the theme | Decided |
| Named accountable person | Required to publish, prompted with an explanation of why | Decided |

The distinction between the checked rows and the self-reported rows is the product. Because the platform holds no money, every claim it makes is about what was checked, never about what is guaranteed.

## Hypothesis

We believe that showing a donor what has been checked about an organisation, alongside what that organisation says about itself, will let money reach groups that no existing platform will list, without the documentation those platforms require.

Four falsifiable behaviours follow:

1. An organisation with no audited accounts completes a campaign page unaided in under one working day.
2. Donors who reach a completed page convert at a rate comparable to published environmental-sector benchmarks, rather than materially below them.
3. A meaningful minority of donors choose the monthly path rather than the one-off path.
4. Enough donors add a tip, at a large enough average, to cover verification and operating cost per campaign.

Each maps to a metric below.

## Go-to-market

### Channel strategy per segment

**Philippine grassroots organisations.** These groups are reached through the institutions already touching them rather than through paid acquisition, because the defining trait of the segment is being outside formal funding networks. Three concrete routes are proposed. Regranting funds that exist specifically to move money to grassroots climate groups, notably the CLIMA Fund and Global Greengrants Fund.[^12] The PCNC accredited register, which names 604 Philippine organisations and the sector each works in.[^10] And organisations already listed on GlobalGiving's Philippine projects, which is the population that cleared the documentation floor this product sits below.[^4] Whether any of the three actually reaches the target user is untested.

**US climate-motivated retail donors.** The donor arrives through a link an organisation shared, so the product's donor-side channel work is making that link perform rather than buying attention. Two sourced facts shape the calendar and the page: 37% of all online revenue arrives in December and 4% on the final day of the year,[^7] so payout onboarding of 5 to 10 business days must be complete before December rather than started in it;[^10] and this donor researches before giving,[^11] so the page's checkable content is the acquisition mechanism.

### Institutional and strategic distribution

The regranting funds above are the first candidate, since they already select for grassroots climate groups.[^12] Fiscal sponsors are the second, on the argument that the two products suit different needs: an organisation requiring US tax-deductibility is better served by a sponsor, and one wanting speed and the full donation is better served here. Neither relationship has been tested, both are proposals rather than findings, and the referral logic is reasoning rather than something any source establishes.

### Business model

Donor tips. The organisation pays nothing, which is a positioning decision as much as a pricing one: cross-border cost already takes 8% to 12% of a donation before any platform charge,[^3] and verification costs roughly the same per organisation regardless of how much a campaign raises, so a percentage fee would earn least from the smallest campaigns.[^14] The honest weakness is that tip revenue is unpredictable, and the one public data point on how far it carries an operator is Chuffed's disclosure that optional donations supply 46% of its funding, with the remainder from investment and grants.[^4] The business model rests entirely on assumption 4 above.

## Success metrics & validation methodology

**Leading indicators.** Time from signup to a published page. Share of organisations completing a page without support contact. Share of pages carrying a complete line-item budget. Donor conversion on a completed page. Share of gifts taken as monthly. Tip attach rate and average tip.

**Lagging indicators.** Total raised per campaign. Share of organisations running a second campaign. Monthly donor retention at 12 months, against the published environmental benchmark. Platform tip revenue against verification and operating cost per campaign.

**Go/no-go test, and what it is not.** With no product and no users, the available test is a concept test run against synthetic personas: describe the one-line pitch and Solution inside the interview, then ask the disappointment question anchored to that description. **This is not a product-market-fit survey.** Sean Ellis's 40% threshold was calibrated on people with real usage history, and a reaction to a pitch is not equivalent evidence. Any percentage this produces is reported as a synthetic concept-test signal and nothing stronger.

**Disproof signals for the riskiest-assumption log.**

| Assumption | What would prove it wrong |
|---|---|
| 1. The constraint is campaign creation rather than distribution | Organisations complete pages and the pages get no traffic. Median campaign raises near zero while completion rates stay high |
| 2. A compliant payout path exists for informal organisations | A material share of verified organisations fail dLocal or Xendit KYC, or hit the 30-day window and deactivate[^10] |
| 3. Verification is light enough for speed and strong enough for trust | Either donors say the evidence display does not move them, or a fraudulent campaign clears it |
| 4. Enough donors tip, and tip enough | Tip revenue per campaign falls below verification cost per campaign at pilot volume |
| 5. Adaptation is fundable retail, and the fundable set is not narrower than the user base | Campaigns with a countable physical output raise, and capacity or governance campaigns raise nothing |
| 6. Retail giving works for this sector at all | Total raised stays at the ~2% of income that Kenyan sector data shows for individual donors[^15] |
| 8. Climate donors behave like the benchmarks | Philippine campaigns convert far below the environmental-sector figures, which describe US organisations with existing lists[^7] |
| 9. Structured disclosure substitutes for audited financials | Donors in concept tests ask for audited accounts specifically and discount the page without them |

## Critical success factors

1. **The gate holding, because nothing behind it can.** Direct settlement removes every remedy after a donation is made, so pre-onboarding is the only fraud control the product has. It also has to stay light enough that a genuine grassroots organisation clears it, which is the tension the whole product lives inside.
2. **A payout rail that accepts the target user.** dLocal and Xendit both reserve the right to reject without giving reasons, and dLocal deactivates an account if KYC is not completed within 30 days.[^10] Some legitimate organisations will be refused a rail for reasons the platform cannot see or appeal.
3. **The SEC register staying free to check.** The gate depends on it. Automating it is priced and affordable; losing free access to status and filing history would change the product.[^10]
4. **The platform never touching the money.** Direct settlement is what keeps this software rather than a money transmitter, and it is what removes state-by-state licensing.[^13] It also removes refunds, pooling and all-or-nothing goals, and those are accepted consequences rather than gaps to fix later.
5. **Tip uptake.** See assumption 4.
6. **Stripe being unavailable, and the architecture reflecting it.** Stripe Connect supports none of the candidate markets as payout recipients, so the default marketplace architecture cannot pay this product's users.[^3]

## Not yet covered (separate artifacts, sequenced next)

Everything below is a matter of sequencing. Each is a separate artifact to be built in order, and none is cut from the project.

- **Personas, jobs-to-be-done and synthetic interviews.** Not started. The concept test above depends on them.
- **Roadmap and user stories.** Not started.
- **The prototype.** [`design-brief.md`](design-brief.md) now exists and specifies the two surfaces, the page skeleton, the content model and the seven themes. The build itself is next, including the country selector where the Philippines is the only selectable market and Kenya, Ghana and Mozambique appear greyed out as markets coming next.
- **Technical feasibility**, including which of the SEC lookup routes is used and how KYC status is received.
- **A second pilot market.** A post-MVP expansion question. Kenya is the live override on registry quality and payout maturity, held out on FATF grey-listing and the 2024 referral of 16 civil society organisations to the Directorate of Criminal Investigations.

## Open questions

**Runtime inputs, per the data model above.** Every input the verification display needs is named, and one source is undecided: whether the SEC lookup runs through the free SEC Number API, the paid Company Information Lookup, or a manual eSEARCH check. The free tier's response fields are not published, so the deciding task is to register and inspect one response.[^10] This matters more than it did when the lookup only fed a display. It is now the gate, and the gate is the only fraud control the product has, so a lookup that cannot confirm current registration status would need replacing with a manual check rather than dropped.

**Whether individual donors fund adaptation specifically, as distinct from disaster relief.** The deepest assumption in the project. Two data points bear on it and point opposite ways: a Philippine mangrove-rehabilitation campaign raised PHP 2.9m through GlobalGiving for a countable output, though it dates from 2014 and the organisation is a large corporate-backed foundation; and only 11 of 604 accredited Philippine NGOs are Environment/Biodiversity, with 2 naming disaster or resilience work.[^2] A sample of real Philippine organisations would settle whether the fundable set is narrower than the target user base, and it is worth assembling before the roadmap.

**Whether donors accept structured disclosure in place of audited financials.** No source tests it.[^9] It sits directly under the evidence-not-badge decision.

**Time from deciding to fundraise to a first donation.** No platform publishes it, so the product's speed claim has no external benchmark and must be stated against page creation, which the product controls.

**Whether the identifiable-victim page structure and the effectiveness finding conflict.** Donors give more to a named person and a bounded project,[^7] and give more when they believe the organisation is effective at addressing climate change, while adaptation protects against consequences rather than reducing emissions.[^11] The costed budget is the proposed answer, and it is untested.

## Recommendation

**GO, to prototype and concept test. Not GO to build.**

The case for continuing is that three independent things line up: a category that doubled in three years,[^8] a competitor gap that is documentation rather than geography,[^4] and a pilot market whose register can actually be checked and whose wallet rails can actually pay an organisation without a bank account.[^10] The donor evidence points the same way, since the segment this product needs is the segment that checks before giving.[^11]

The case against building yet is that the two assumptions the business rests on are both untested and both cheap to test. Whether enough donors tip to fund a platform, and whether the fundable set is narrower than the user base, can each be probed with a prototype and a sample of real organisations before any payment integration exists. The traffic problem is the third: at published conversion rates, outcomes are dominated by traffic volume, and a builder plus a link puts that problem entirely on an organisation with no audience.

**What would flip this to PIVOT:** evidence that organisations complete pages and cannot get anyone to them. The pivot in that case is toward distribution, which means the funder-discovery surface the current scope deliberately excludes.

## Further reading

- [`scope.md`](scope.md). Locked decisions, restated criteria, riskiest-assumption log.
- [`market-selection.md`](market-selection.md). The five criteria and why the Philippines was selected.
- [`grounding-research.md`](grounding-research.md). Sixteen sections of sourced research, every claim tagged Fact, Inference or Assumption. Permanent backing material for everything above.

## Sources

[^1]: `grounding-research.md` §1 The adaptation funding gap
[^2]: `grounding-research.md` §2 Market sizing beyond historical adoption
[^3]: `grounding-research.md` §5 Payments and payout rails
[^4]: `grounding-research.md` §6 Competitive landscape
[^5]: `grounding-research.md` §7 Verification and donor trust
[^6]: `grounding-research.md` §10 Where philanthropic money actually goes
[^7]: `grounding-research.md` §12 Why people give, and how much
[^8]: `grounding-research.md` §13 The climate and environment slice, and the five-year mismatch
[^9]: `grounding-research.md` §14 The small-organisation problem: trust, effort, and transparency
[^10]: `grounding-research.md` §15 Philippine verification and onboarding mechanics
[^11]: `grounding-research.md` §16 Who the climate donor is
[^12]: `grounding-research.md` §11 How money moves through the philanthropy sector
[^13]: `grounding-research.md` §4 Platform-side regulation
[^14]: `grounding-research.md` §9 Monetization
[^15]: `grounding-research.md` §Open questions, item 1 (Kenyan individual-donor share, primary-sourced to the Annual NGO Sector Report 2022/2023)
