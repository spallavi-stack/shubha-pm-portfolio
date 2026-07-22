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

### Plug-in / balcony solar — the highest-uncertainty area

**[Fact]** A live UK Government (DESNZ) consultation on plug-in solar exists — evidenced by a gov.uk consultation URL structure consistent with genuine departmental consultations, and independently corroborated by Solar Power Portal (genuine UK solar trade press, not a content farm: "DESNZ opens consultations for plug-in solar deployment") and NationalWorld (mainstream UK regional news: government approval of plug-in solar panels reported). (Sources: Solar Power Portal, solarpowerportal.co.uk; NationalWorld, nationalworld.com)

**[Inference]** Combining the consultation's existence, BS 7671 Amendment 4 (IET Wiring Regulations, reportedly introducing a new Chapter 708 for small-scale/plug-in generation), and G98's existing "notify DNO within 28 days" process: as of mid-2026, an 800W-class plug-in unit is most likely legal only when hard-wired by a registered electrician with DNO notification — true consumer self-install ("plug into a wall socket yourself") is not yet confirmed legal, pending a forthcoming BSI product safety standard.

**[Assumption — treat with real caution]** Specific details are inconsistent across sources: named retail partners differ between sources (one lists "Amazon, Lidl, Iceland," another "Amazon, B&Q, Currys, Lidl" — internally contradictory), the exact announcement date and a quote attributed to Ed Miliband are unverified against a primary transcript, and most supporting content comes from small SEO-style sites (balconysolar.uk, plugsolarhub.co.uk, and similar) that may be echoing or inventing details around a real underlying story. The 800W AC cap recurs consistently enough to be plausible but should be verified against the actual consultation document before being stated as settled.

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

## Open questions / lowest-confidence areas

1. **Plug-in solar's exact legal status and timeline** — the single least-verified topic here. Sources show internal inconsistencies (disagreeing retailer lists); most supporting content is SEO sites, not primary documents. Read the actual gov.uk consultation and BS 7671 Amendment 4 text directly before this becomes load-bearing for the pitch to renters/leaseholders.
1a. **Whether renters actually need landlord permission for a plug-in kit** — the "no permission needed for a removable kit" claim comes only from sites with a commercial incentive to say so, and isn't corroborated by the one independent legal source found. This is close to a core product claim (how easy is this, really, for a renter to just do?) and deserves direct verification of the Renters' Rights Act 2025's actual text before it's repeated anywhere user-facing.
2. **Current SEG/dynamic export tariff rates** — change roughly monthly; re-verify near publication.
3. **Battery arbitrage annual value** — widest, least-corroborated range in the technical section.
4. **A validated funding mechanism for the monetization hypothesis** — SIF/NIA/Innovate UK/Nesta are real, plausible categories; no confirmed precedent of a project like SunnySideUp being funded this way was found. Still a hypothesis, not a validated path.
5. **VAT relief's 2027 sunset date** — consistently reported but not verified against primary HMRC text.

---
*Direct fetching of primary sources was blocked at the network/proxy level for this entire research session (confirmed for both research agents and direct attempts). [Fact] labels here mean "well-sourced and named, corroborated across independent references" — not "personally verified by reading the primary document." Re-open the specific named URLs by hand where a claim is decision-critical, and run this document through `research-auditor` before treating it as final.*
