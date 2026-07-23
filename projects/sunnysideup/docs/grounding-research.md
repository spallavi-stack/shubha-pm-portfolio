# SunnySideUp — Grounding Research

## Methodology note (read this first)

Direct fetching of primary sources (gov.uk, Ofgem, HMRC, MCS, ENA, Which?) was blocked at the network/proxy level for this entire research session — confirmed both for the research agents and for direct attempts in this session. Everything below is drawn from web search results that name and quote specific real sources (organization, document title, URL, date) rather than from directly reading the primary page.

This matters for how to read the labels below: **[Fact]** here means "named, real source, corroborated across multiple independent references" — not "personally verified by reading the primary document." Before anything here goes into a product brief as a load-bearing claim, the specific named URLs should be opened and confirmed directly. The plug-in solar section is the least reliable part of this document regardless of label — treat it with extra caution.

---

## 1. Regulatory landscape

### Smart Export Guarantee (SEG) and dynamic export tariffs

**[Fact]** SEG launched 1 January 2020, replacing the closed Feed-in Tariff. Electricity suppliers with 150,000+ domestic customers must offer at least one SEG export tariff to small-scale generators (up to 5MW) — but suppliers set their own rate, with no government-mandated minimum above zero. (Source: Ofgem, "Smart Export Guarantee (SEG)," ofgem.gov.uk/environmental-and-social-schemes/smart-export-guarantee-seg — verify directly before publishing)

**[Fact]** Eligibility requires an MCS-certified installation registered on the MCS database, and a meter capable of recording half-hourly export (typically a SMETS2 smart meter). (Source: Ofgem SEG guidance, as above)

**[Assumption]** Specific current rates (e.g. up to ~25p/kWh with strings attached vs. ~6p/kWh no-strings per Which?, April 2026; Octopus Outgoing cut from 15p to 12p/kWh on 1 March 2026) converge across several comparison sites and one reputable consumer body (Which?), but rates change roughly monthly and weren't independently verified against Ofgem's or suppliers' own live tables. Treat as a representative range (roughly 3p–30p/kWh market-wide) and re-verify near publication time.

**[Fact]** Dynamic export tariffs exist as a distinct category — e.g. Octopus Agile Outgoing (half-hourly, tracks day-ahead wholesale price, no floor) and Octopus Flux/Intelligent Flux (time-of-use export paired with a home battery, paying a premium during evening peak). (Source: Octopus Energy product pages)

**[Assumption]** Specific figures (Agile Outgoing averaging ~9.4p/kWh over a year; Flux peak rates up to ~30p/kWh) are single-source-reported (aggregator sites) — re-verify directly before use.

### VAT treatment

**[Fact]** Residential solar installations (materials + labour, same contractor) have been zero-rated (0% VAT) in Great Britain since 1 April 2022. On 1 February 2024, the zero rate was extended to standalone battery storage retrofits. The relief applies to installed systems, not DIY material-only purchases. Governing guidance is HMRC VAT Notice 708/6. (Source: ICAEW, "Energy saving materials relief extended from February 2024"; AccountingWEB, "Further changes to VAT on energy-saving materials" — both real professional/industry bodies)

**[Assumption]** The relief is reportedly due to revert to 5% from 1 April 2027 — consistent across several industry sources but not verified against primary HMRC text. Worth checking directly, since it materially affects any payback math spanning that date.

**[Assumption]** Northern Ireland reportedly has different (reduced-rate, not zero-rate) treatment — mentioned but not independently verified.

### Permitted development (rooftop)

**[Fact]** Roof-mounted domestic solar in England is normally permitted development (no planning application) when it doesn't protrude more than 200mm from the roof slope/wall, doesn't project above the roof's highest point (excluding chimney), is no more than 1m above a flat roof's highest point, and isn't on a listed building. Listed buildings have no permitted development rights for solar at all. (Source: Historic England, "Consents and Permissions for PV Systems"; corroborated by multiple UK council planning pages; primary legal text is the GPDO 2015, Schedule 2 Part 14 Class J, not directly re-read this session)

**[Inference]** Panels fronting a highway within a conservation area likely need a full planning application, while rear/side-facing panels not visible from a highway are more often still permitted development — pattern is consistent across sources but the precise legal test wasn't confirmed against the GPDO text itself.

**[Assumption]** Scotland and Wales have their own broadly similar but distinct regimes — not researched in depth.

### Plug-in / balcony solar — verified follow-up (upgraded from original pass)

**[Fact]** BS 7671 Amendment 4 (IET Wiring Regulations) was published and came into force 15 April 2026, with a transition period to 15 October 2026 after which all new electrical work must comply. This is now corroborated directly by NICEIC (the actual UK electrical competent-person/certification body, niceic.com/amendment-four/ — independent of the plug-in-solar-specific sales cluster) as well as multiple electrical-trade sources (iCertifi, Virtual College), not just solar-marketing sites. Confidence upgraded from the original pass's Inference tier.

**[Fact]** A DESNZ consultation on plug-in solar ("Plug-in solar: Regulatory amendment and interim product specification") opened 16 June 2026 and closed 30 June 2026, proposing amendments to the Plugs and Sockets etc. (Safety) Regulations 1994 and an interim product specification covering panels + microinverters only (explicitly excluding batteries and wind). Corroborated by named gov.uk consultation URLs and a specific PDF filename (assets.publishing.service.gov.uk/media/.../plug-in-solar-consultation-document.pdf) appearing consistently across independent searches, plus Solar Power Portal (genuine UK trade press). A government response was expected "by 22 July 2026" — **not confirmed as actually published as of this research**; check gov.uk directly for the live status before stating a response exists.

**[Fact]** The practical, product-relevant distinction: a **hard-wired plug-in install by a registered/CPS electrician has been legal since 15 April 2026** (under BS 7671 Amendment 4). **True DIY self-install — plugging a kit directly into a standard wall socket yourself — is not yet legal**, pending the BSI product safety standard, which multiple independent July-2026 sources describe as still unpublished with "no confirmed in-force date." This is corroborated across enough independent source types (NICEIC-adjacent trade sources, not just the plug-in-solar sales cluster) to treat as solid, though the exact BSI publication date remains unconfirmed.

**[Assumption — still unverified]** Specific named retail partners (lists disagree across sources), the exact wording of any DESNZ announcement, and any quote attributed to a named minister remain unverified against a primary transcript. The 800W AC cap is now well-corroborated (appears consistently, including in the DESNZ consultation's own described scope) and can be treated with reasonably high confidence.

**Why this matters for the product**: the gap between "legal with an electrician" (since April) and "legal to self-install" (still pending) is exactly the kind of nuance an independent viability check should explain honestly to a renter who assumes they can just buy a kit and plug it in today.

**[Assumption]** The Renters' Rights Act 2025 is confirmed real legislation strengthening tenants' improvement rights, but the claim that it specifically targets balcony solar looks like solar-industry commentary applying a broader provision, not something stated in the primary legislation. Don't state this as fact about the Act's intent.

### Leasehold and tenancy consent requirements

**[Fact]** Leaseholders generally need explicit freeholder (or management company) consent before altering a building's exterior/fabric, including installing solar panels — this is standard, well-established UK leasehold law, not something introduced by recent legislation. Lease terms vary widely: some explicitly prohibit roof/exterior alterations, others allow with consent. The Leasehold Reform (Ground Rent) Act 2022 does not grant an automatic right to install solar. (Source: Sunsave, "Solar panels for leasehold homes: explained," sunsave.energy; Pine, "Solar Panels on a Leasehold Property: Selling Guide," getpine.co.uk — consistent with well-established general UK leasehold law)

**[Inference]** For flats/maisonettes specifically, since the roof/exterior involves common or shared structure, a leaseholder installing solar realistically faces two separate hurdles — freeholder/management-company approval *and* the permitted-development/planning requirements covered above — not just one.

**[Fact]** The Renters' Rights Act 2025 is real legislation giving tenants a right to request consent for certain improvements, with landlords required to give written reasons for refusal. (Source: Pinsent Masons, "The Renters' Rights Act 2025: a guide for private landlords in England," pinsentmasons.com/out-law — a genuine UK law firm publication, not a solar-specific site)

**[Assumption — treat with real caution]** The specific claims that the Act "explicitly includes solar panels" as a named example, that landlords have exactly 28 days to respond to *this* kind of request, and that a "fully removable, no-drilling" plug-in kit categorically needs no landlord consent at all — these come exclusively from the same small cluster of balcony-solar SEO sites (balconysolar.uk, plugsolarhub.co.uk, themoshmanual.com, linksolar.net, pluggedin.solar) already flagged as unreliable elsewhere in this document. None of it is corroborated by the one credible legal source found (Pinsent Masons), which describes the Act's improvement-request mechanics in general terms without naming solar or a 28-day window for this scenario. This is exactly the pattern worth being suspicious of: several sources with an obvious commercial incentive (selling plug-in kits) converging on a suspiciously convenient, product-favorable claim, absent from the one independent legal source. Treat "renters can install a plug-in kit with zero landlord permission" as an unverified, sales-favorable claim, not settled law — read the Act's actual text or a non-solar-specific legal summary before this becomes something the product relies on.

### G98 vs G99 (DNO connection process)

**[Fact]** G98 ("Requirements for the Connection of Micro-generators up to 16A per phase") covers systems ≤16A/phase — roughly 3.68kW on a single-phase domestic supply, the scale of a typical residential rooftop inverter. G99 applies above that threshold or where the generator isn't a fully type-tested unit under G98's pre-approval route. (Source: ENA EREC G98 Issue 2 and EREC G99 Issue 2, March 2025 — real named engineering recommendation documents hosted at dcode.org.uk / energynetworks.org, the actual UK Energy Networks Association)

**[Fact]** G98 is a "fit and inform" process — install first, notify the DNO within 28 days, no pre-approval needed. G99 requires pre-approval before installation with a multi-stage DNO assessment. (Source: same ENA documents, plus consistent industry commentary)

**[Inference]** A typical domestic single-phase rooftop system, staying within ~3.68kW, falls under the simpler G98 route; larger systems, three-phase supplies, or export-limited setups more likely cross into the slower G99 route. Correct general framing for a viability-check tool; exact processing times should come from a specific DNO rather than aggregator commentary.

**[Assumption]** Broader "grid connection queue reform" statistics circulating in industry commentary relate primarily to large-scale/transmission-level queues, not typical small domestic G99 cases — a nuance worth naming if this topic comes up, not directly relevant to a residential check.

---

## 2. Market, competitors, sales practices, and funding

### Market size and growth

**[Fact]** UK solar installations passed 2,003,000 by end of March 2026, with March 2026 alone adding 27,000 installations — the highest monthly deployment since 2012. 2025 was a record year for MCS-certified installations (reported between 257,397 and 269,000 depending on source), a 31–37% increase over 2024. Total deployed UK capacity reached roughly 21.6–21.8GW by early 2026, generating an estimated 18,314GWh in 2025 (~6.4% of UK electricity). (Source: Solar Power Portal and pv magazine, both citing DESNZ/government figures and MCS)

**[Fact]** No adoption data exists yet for plug-in/balcony solar specifically, because the category only became legally operational (BS 7671 Amendment 4) on 15 April 2026 — a genuine "too new to have data" gap, not a research failure.

**[Assumption]** A widely-circulated "2.5 million" installation figure (Segen, May 2026) is actually combined solar + battery + heat pump MCS certifications, not solar alone — don't conflate with the ~2 million solar-only figure.

### Competitors

**[Fact]** Multiple UK solar quote-comparison platforms exist, and every one identified runs a lead-generation/referral-fee model (free to consumers, installers pay per lead or completed sale): CompareMySolar (founded 2010, 35+ installer network), Uswitch, Solar Selections (50+ installers), Easy PV, Renewable Energy Hub, Solar Planet, Solar PV Quotes Compare.

**[Inference]** No UK platform surfaced in this research that is explicitly *not* installer-funded — every identified competitor's model creates the same "more referrals = more revenue" incentive SunnySideUp is positioned against. This supports the case for an independent-positioning gap, though it's an inference from an incomplete competitor scan.

**[Fact]** Energy Saving Trust is a real UK organization providing independent, impartial advice on solar and renewables, explicitly funded by UK/devolved governments and the private sector — the closest real analog to SunnySideUp's positioning. (Source: Energy Saving Trust, "How we're run," energysavingtrust.org.uk)

### Sales practices and consumer protection

**[Fact]** Which? surveyed 2,039 solar-panel-owning members of its Which? Connect panel in April 2024 and found more than a third had been cold-called about their panels in the past five years — including false claims about "free health checks," remote monitoring, fire risk, mandatory annual government-required checks (which Which? states is untrue), and unsolicited battery upsells. (Source: Which?, "Solar panel cold calls to watch out for" and "Beware these solar panel cold calls," which.co.uk)

**[Fact]** The CMA launched an investigation into the green heating and insulation sector (including home solar marketing) in September 2022, citing concerns like "inaccurate and unrealistic headline price information," and published sector compliance advice in July 2024. Ofgem separately investigated Community Energy Scheme UK Ltd (solar-on-social-housing scheme in Stoke-on-Trent) from August 2021 to July 2024 for potential consumer protection breaches, ultimately securing remedial actions including a free exit option for early customers. (Source: CMA and Ofgem case pages, via trade press — Solar Power Portal, Utility Week, Inside Housing)

**[Assumption]** A Financial Ombudsman Service warning about "misleading" solar sales complaints was found only as a headline with no body text seen. An ASA ruling against a named solar company was confirmed to exist by URL but its content wasn't verified. Treat both as unverified until read directly.

**[Assumption]** Current (2023–2024) RECC complaint-volume figures could not be found — only a 2013 figure (average 130 complaints/month, 1.1% of installations) was located. Don't cite the 2013 figure as representing current conditions. RECC's dispute-resolution role reportedly transferred to "Green Homes Dispute Resolution" from 20 January 2026.

### Funding mechanisms (for the monetization hypothesis)

**[Fact]** Ofgem's Strategic Innovation Fund (SIF) is real: a five-year £450 million initiative from 2021, delivered with Innovate UK, with a further £500 million allocated for April 2026–March 2031 (including a £50 million Deployment Phase). Ofgem's Network Innovation Allowance (NIA) is a separate ongoing mechanism funding DNO-level innovation that must demonstrate consumer benefit. (Source: Ofgem SIF/NIA pages; Citizens Advice, "Making Innovation Count — A Transparency Review of NIA and SIF Projects," confirming active third-party oversight of this funding stream)

**[Inference]** These mechanisms fund network/DNO-level innovation generally and require demonstrated consumer benefit, making them a plausible fit for something like SunnySideUp — but no specific SIF/NIA-funded project matching "independent consumer solar advice tool" was found. This is a plausible funding *category*, not a confirmed precedent.

**[Fact]** Innovate UK Smart Grants and Nesta (a real UK innovation foundation) fund adjacent categories — Innovate UK's rolling competitions typically cover 50–70% of project costs including funding for consumer-facing flexible-energy technologies; Nesta ran a "Greener Homes" call for ideas with development grants for home-heating/power content projects.

**[Assumption]** None of these mechanisms were confirmed to have funded a project structurally identical to SunnySideUp — plausible categories to research further at the roadmap stage, not validated paths.

---

## 3. Technical and economic grounding

### System cost, size, and generation

**[Assumption — wide range, no single authoritative figure found]** A typical UK domestic rooftop system is reported around 4–6kW, with installed cost estimates ranging from ~£6,100 (Energy Saving Trust, per one summary) to "just over £7,000" (MCS, 2025 average) to £5,500–£8,700 depending on size/source. Annual generation for a 4kW south-facing system is commonly cited around 3,400–4,200kWh/year with significant regional variation. No single official MCS/DESNZ generation dataset was directly confirmed — present as an industry-consensus range.

### Electricity price

**[Fact — time-sensitive, verify before publishing]** Ofgem's price cap for 1 July–30 September 2026 sets 26.11p/kWh (Direct Debit, standard variable tariff) with a 57.19p/day standing charge — a reported 13% rise from the prior quarter. (Source: Ofgem, "Changes to energy price cap between 1 July and 30 September 2026" — corroborated across three independent search results including a reference to an official Ofgem PDF; this is a quarterly-changing figure)

**[Inference]** The price cap is a ceiling for default/standard-variable tariffs only — many households are on fixed deals above or below it. Any payback calculator built on this should state that explicitly.

### Battery storage and time-of-use arbitrage

**[Fact]** Time-of-use arbitrage (charging a battery overnight on a cheap tariff like Octopus Go, using stored power during expensive peak hours) is a genuine, well-documented tariff mechanic. (Source: Octopus Energy product pages and multiple independent tariff-comparison sites)

**[Assumption — wide, inconsistent range]** Battery costs are commonly cited around £2,500–£4,000 installed for 5kWh and £4,000–£6,500 for 10kWh, from consumer-guide sites rather than an authoritative dataset. Realistic annual arbitrage value is the least certain figure found: most-repeated range is roughly £100–£300/year; wider claims (£400–£1,100/year) rest on a single uncorroborated source. Treat £100–£300/year as the more defensible range.

### Payback period

**[Assumption — no official dataset found]** No primary UK government, MCS, or established-body payback study was located. Secondary sources converge loosely on 8–13 years for panels alone, generally agreeing that adding a battery purely for arbitrage/self-consumption *lengthens* rather than shortens payback — one source states a battery's own payback often exceeds its working lifespan. Present as a wide range (roughly 6–14 years across sources) with explicit sensitivity to self-consumption rate, occupancy, export tariff, and region — not a single confident number.

### Plug-in/balcony solar cost and generation

**[Assumption — the weakest data in this document, as anticipated in scope]** An 800W plug-in kit is reported to cost roughly £400–£900, generating an estimated 640–900kWh/year, translating to roughly £75–£200/year in savings with a claimed 3–4 year payback in one source. None of these figures trace to a government, MCS, or established consumer body — they come from newly-created, narrowly-focused sites that appear to exist specifically to cover this just-legalized category. Present as clearly-labeled placeholder estimates, not sourced facts.

---

## 4. Market opportunity and demand signals

Follow-up research (added after initial product brief review) targeting the addressable-opportunity gap: the original Market size section only had *historical adoption* (installs to date), nothing sizing the *unmet* opportunity or demand.

### Addressable rooftop opportunity — a real gap, reported honestly

**[Assumption — no authoritative figure found]** No government, MCS, or established body publishes a clean "X million UK homes have a viable roof but no solar yet" figure. What search surfaced instead: ~92% of UK homes have a pitched roof (a weak technical-compatibility signal, not a viability assessment — sourced from solar-installer/comparison sites, the same category of source flagged as lower-confidence elsewhere in this document) and a separate claim that ~1.14 million of 1.5 million *planned new-build* homes are estimated solar-suitable (a forward-looking new-build figure, not the existing-housing-stock addressable market this question was actually about).

**[Inference]** Roughly triangulating from Fact-tier numbers elsewhere in this document: England has ~25 million households (§below), UK-wide solar installations total ~2 million. Even allowing generously for homes that are flats, north-facing, shaded, or otherwise unsuitable, the gap between total housing stock and current installs is large — solar is very much not saturated. This is a directional inference (large addressable gap exists), not a specific defensible number — don't state a precise addressable-market figure in the brief; state the direction and flag the absence of a precise source.

### No-roof-access population size (renters + leaseholders)

**[Fact]** England, 2024–25 (ONS): ~25.0 million households total. Owner-occupied 65% (16.2 million); private rented 19% (4.7 million); social rented 16% (4.1 million). (Source: ONS, "Private rented sector statistics from across the UK: 2025," and English Housing Survey 2024–25 headline findings, ons.gov.uk / gov.uk)

**[Fact]** England, 2024–25 (MHCLG, "Leasehold dwellings, 2024 to 2025" — a named, recurring official government statistical release with multi-year editions, the strongest single source found in this whole research effort): ~4.90 million leasehold dwellings, 20% of English housing stock (up from 4.83 million / 19% in 2023–24). Of these, 54% (2.59 million) are owner-occupied by the leaseholder, 41% (1.96 million) are privately rented out by the leaseholder to a tenant, and 6% (277,000) are owned by social landlords. 72% of leasehold dwellings are flats (3.5 million); 28% are houses (1.3 million). (Source: MHCLG via GOV.UK, "Leasehold dwellings, 2024 to 2025," gov.uk)

**[Inference]** Leaseholders and renters are distinct, overlapping populations, easy to double-count carelessly — worth being precise: the "no roof access" segment is roughly *renters of any tenure (private + social, ~8.8 million English households) plus owner-occupying leaseholders (~2.6 million)*, since a socially- or privately-rented leasehold flat's occupant is counted once as a renter, not separately as "the leaseholder" (that's their landlord). Very roughly, this suggests **on the order of 11 million English households** with no direct control over a roof — a rough sum of two real datasets, not a single published "no-roof-access population" statistic, so present it as an approximation with the math shown, not a clean sourced number.

### UK solar capacity trajectory (forward-looking, not just historical)

**[Fact]** The UK government's 2025 Solar Roadmap targets 45–47 GW of installed solar capacity by 2030, up from ~19 GW as of May 2025 — roughly a 2.5x increase in five years. 72 actions are named, overseen by a newly-established Solar Council (co-chaired government/industry). The roadmap explicitly prioritizes rooftop solar — the Energy Secretary has described wanting a "rooftop revolution" — and the most optimistic scenario cited reaches 50 GW by 2030 and 85 GW by 2035. (Source: UK government 2025 Solar Roadmap, corroborated by pv magazine and a named law firm's client briefing, cms.law — reasonably strong corroboration for a policy target figure)

### Balkonkraftwerke (balcony solar) growth in Germany — the closest comparable-market signal

**[Fact]** Germany's plug-in/balcony solar market, the closest real-world comparable to what SunnySideUp's plug-in segment addresses, shows a clear multi-year adoption curve: ~270,000–300,000 units registered in 2023; more than doubled in 2024, surpassing 700,000 by October and ~780,000 (~700 MW) by year-end; surpassed **1 million registered systems** by late June 2025, with 220,000+ added in just the first half of that year. The share of balcony solar sold *with* battery storage rose from 20% (2023) to 40% (2025). Growth was directly driven by two regulatory changes: VDE simplified registration and raised the power cap to 800W in 2023, and in 2024 German renters gained a legal right to install balcony solar, with landlords only able to refuse for genuine safety/structural reasons. (Source: Clean Energy Wire — a genuinely reputable German/EU energy-policy journalism outlet, not a sales site — corroborated by pv-tech.org and ess-news.com, both real energy trade press)

**[Inference — clearly an analog, not UK evidence]** Germany's trajectory is the best available *proxy* for whether real consumer demand exists for plug-in solar once the regulatory path is clear — the UK has no domestic adoption data yet because the category only became partly legal in April 2026 (§Plug-in/balcony solar). Notably, Germany's growth accelerated sharply *after* renters gained an explicit legal right to install (2024) — which is exactly the still-unresolved question for UK renters (§Leasehold and tenancy consent requirements, §Open questions). This is directional evidence a comparable market can scale quickly once that legal friction clears, not proof the UK will follow the same curve.

### Consumer climate-agency and eco-anxiety surveys

**[Fact]** Multiple independent UK surveys document a documented gap between climate concern and felt ability to act: a BT/Livity survey (2021) found almost half of the UK population feels unable to actively tackle climate change, despite ranking it as a top-three societal concern. A more recent Reading Agency survey (2025) found 93% of respondents felt some degree of eco-anxiety (44% "very worried," 49% "fairly worried"), with many describing "frustrated helplessness" from caring about climate change while feeling unable to make a difference. Which?'s Annual Sustainability Report (2023) and an Ofgem-published "Consumer Attitudes to Decarbonisation and net zero" study cover related ground. (Sources: BT/Livity via E&T Magazine; Reading Agency, "Eco Anxiety in the UK: What Our 2025 Survey Reveals"; Which?, Annual Sustainability Report 2023; Ofgem, "Consumer Attitudes to Decarbonisation and net zero")

**[Inference]** This is relevant to *motivation*, not just economics: for the no-roof-access segment especially, plug-in solar may appeal partly as one of the few concrete, achievable climate actions available to someone who can't install rooftop panels or choose their landlord's energy supplier — a documented "I care but have no way to act" gap that a low-cost, low-commitment product could plausibly address. This is a reasonable interpretation of the survey data, not something the surveys directly measured about solar specifically.

---

## Open questions / lowest-confidence areas

1. **~~Plug-in solar's exact legal status and timeline~~ RESOLVED via follow-up verification.** Cross-checked against NICEIC and multiple independent trade sources: BS 7671 Amendment 4 (15 April 2026) legalized hard-wired-by-electrician installs; true DIY self-install is still pending the BSI product standard, not yet published as of this research. Retailer-name and quote specifics remain unverified, but the core legal-status question is now solidly answered. One residual open item: whether the DESNZ consultation response (expected ~22 July 2026) has actually been published — check gov.uk directly for current status.
1a. **Whether renters actually need landlord permission for a plug-in kit** — the "no permission needed for a removable kit" claim comes only from sites with a commercial incentive to say so, and isn't corroborated by the one independent legal source found. This is close to a core product claim (how easy is this, really, for a renter to just do?) and deserves direct verification of the Renters' Rights Act 2025's actual text before it's repeated anywhere user-facing.
2. **Current SEG/dynamic export tariff rates** — change roughly monthly; re-verify near publication.
3. **Battery arbitrage annual value** — widest, least-corroborated range in the technical section.
4. **A validated funding mechanism for the monetization hypothesis** — SIF/NIA/Innovate UK/Nesta are real, plausible categories; no confirmed precedent of a project like SunnySideUp being funded this way was found. Still a hypothesis, not a validated path.
5. **VAT relief's 2027 sunset date** — consistently reported but not verified against primary HMRC text.

---
*Direct fetching of primary sources was blocked at the network/proxy level for this entire research session (confirmed for both research agents and direct attempts). [Fact] labels here mean "well-sourced and named, corroborated across independent references" — not "personally verified by reading the primary document." Re-open the specific named URLs by hand where a claim is decision-critical, and run this document through `research-auditor` before treating it as final.*
