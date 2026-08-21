# Fund the Future: Design Brief

Working document. Started 21 August 2026. This file exists so design direction survives between sessions; an earlier detailed answer was lost to an interrupted tool call and could not be recovered.

## Status

Draft in progress. The user's direction below is captured verbatim and is the authority for everything that follows. Nothing in this file is settled unless it says so.

---

## 1. The user's direction, in her own words (21 August 2026)

Captured from dictation, lightly punctuated, not paraphrased.

### On visual direction and the builder

> This is where we need to do a little bit more work. What visual direction should the design system carry? The donor gives more to a named person and a specific project, and this particular donor segment researches before giving. We should have a human being there, and while the organization is filling out the form, we should clearly tell them why it's important for there to be a person here.
>
> What I was thinking of was that we collect some basic information from the organization, like: which area are they doing campaigning in? Is it wildlife protection? Is it conservation work? Is it planting trees? Is it building rain harvesting systems? What exactly are they doing? Now you might have to go back and research what the different segments are in which grassroots work generally takes place, especially in the Philippines. Is it marine wildlife conservation? Conservation? Something like that? Please go and look at some research.
>
> Once we have asked all these things, the landing page that we create is going to be pulled from maybe five, six, or ten landing pages that we have in the backend, customized with respect to design and theme. Let's say that there's a drop-down of ten themes that the organization can pull from, and we use that theme as the basis. Those are beautifully themed, quite specific, but they also look quite sophisticated and like they've been made with the help of a marketing or design agency.
>
> That's where I think we need to do a little bit more thinking with respect to design. The organization has small leeway to make customizations, like: they can upload their picture, they can upload their logo, they can upload their own content. Maybe there could be AI features like enhancing the content or changing the picture. Something like that, but we need to think more about it. That's the reason why the visual direction is something that I wanted to think more about.

### On thin evidence and donor trust

> I'm not sure about this one. If an organization gives signs that they may not be a legit organization, I don't know if they get to set up their campaign here. I think we might be playing with the trust of the donors, because a donor coming to this page does not know what a real organization looks like versus a fake one. How do we differentiate this? If we put them up still and if we let the donor decide whom to donate to, how will the donor know whether this is something the PCNC is missing? That's what we should be thinking about.

---

## 2. What this direction changes

Three things follow immediately, and each one is a departure from what the product brief currently assumes.

1. **The campaign page is generated from a themed template library, rather than being one page filled with variable content.** Five to ten agency-quality themes, chosen from a dropdown, keyed to the kind of work the organisation does. The organisation customises within a theme (photo, logo, its own copy) instead of designing anything.
2. **A named human on the page is a requirement rather than a recommendation**, and the builder has to teach the organisation why while they fill the form in.
3. **"Show the absence plainly" is superseded.** The question was never how to display a gap. It was whether an organisation with gaps should be publishable at all. Resolved by the two-flow onboarding model in section 4: the gate sits on the organisation before it can create any campaign, so the donor is never handed a judgment they are not equipped to make.

## 3. Decisions already taken by the user

Carried from the answers that did survive.

| Decision | Value |
|---|---|
| Surfaces to design in this pass | Campaign page plus builder. Dashboard and payout onboarding named as states rather than designed. |
| Design system depth | Tokens plus core components. Not a full variant and state matrix. |
| Case-study hero screen | The campaign page. |
| Visual language ownership | Fund the Future's product UI is its own language. Portfolio rule: each fictional product should look like its own thing.[^1] |
| Quality bar for tokens | SunnySideUp's prototype token scale (5-step spacing, 5-step radius, 4-step shadow) is the depth to match, without copying its neo-brutalist look.[^1] |

## 4. The onboarding model: two flows, decided 21 August 2026

The user's model, and it resolves the legitimacy question by moving the gate off the campaign and onto the organisation.

**Flow 1, pre-onboarding.** The organisation answers the bureaucratic questions once. The platform vets them, by API where possible and by human contact where not, and issues a green light. Budget five business days.

**Flow 2, campaign creation.** Only available to a green-lit organisation, and fast. Every campaign after the first costs the organisation an afternoon and costs the platform almost nothing.

**Why this is the right shape.**

1. **It uses a week that already exists.** Xendit's KYC review takes 5 to 10 business days and dLocal enforces a 30-day KYC window, so the organisation is already waiting about a week before it can receive money. Running vetting in parallel with payment-provider KYC costs nothing in elapsed time.
2. **It makes the speed claim precise.** Vetting once, up front, about a week. Every campaign after that in an afternoon. Since new-donor retention runs at 24 to 28%, a single campaign raises money roughly once, so organisations must run repeat campaigns and the amortised experience is the real one.
3. **It matches the cost structure.** Verification costs roughly the same per organisation regardless of what a campaign raises, which is why the percentage fee was dropped. Vetting per organisation rather than per campaign puts the cost where it belongs.

**The constraint that keeps this honest.** Vetting may be as slow and as thorough as it likes about things the platform can check. It must not demand documents the organisation cannot produce. Hard to verify is acceptable; hard for a grassroots group to supply is not. If the mandatory list drifts toward GlobalGiving's (two years of financial statements, a documented board, a prior-funder track record), the product keeps the friction and loses its reason to exist.

**Edge cases, recorded rather than designed.** These get a line here and no screen in the prototype, because the click dummy demonstrates the happy path.

| Case | Decision |
|---|---|
| Rejection | Reasons given, with a route to fix and reapply. Not in the prototype. |
| Drafting during the wait | Not supported. At five business days it earns too little to justify a draft state. The wait is a single status screen. |
| Green light expiry | Valid twelve months, or until SEC status changes, whichever comes first. Lapsed means re-running eligibility before publishing again. |
| Human vetting at scale | A known limit of the pilot, not the steady state. Recorded, not solved. |

## 5. The theme library: model and count

**A theme is a content structure that knows what the work is measured in.** Palette and photographic treatment are the smaller half. The larger half is that a mangrove theme already knows about hectares and seedlings, a water theme about households served, a waste theme about tonnes diverted. That structure is the thing a grassroots organisation without a communications team cannot produce for itself, and supplying it is what makes a page read as agency-made rather than templated.

This is also where the product answers its own hardest research finding. The categories with no natural countable output are the ones where the theme has to supply a unit, so the organisation is never asked to invent a metric on a blank form.

**Each theme carries four things:** a palette and imagery treatment drawn from its setting; a pre-structured impact module with the right unit already in it; a layout rhythm; and placeholder copy shaped for that kind of work. The organisation supplies photo, logo and words.

**Seven themes, decided 21 August 2026.** The test applied: a theme earns its place when it changes the setting a photograph is taken in, the unit the work is counted in, and the register the page speaks in. Where two categories share all three, they share a theme.

| # | Theme | Covers | Unit | Setting |
|---|---|---|---|---|
| 1 | Coastal and mangrove | Mangrove restoration, coastal protection | Hectares restored, seedlings planted | Tidal, silt, low horizon |
| 2 | Sea and fisheries | Marine protected areas, reefs, sustainable gear, marine wildlife | Area protected, sites, gear replaced | Underwater and boat-level |
| 3 | Forest and watershed | Rainforestation with native species, upland reforestation, habitat and wildlife | Native trees planted, hectares | Upland, canopy |
| 4 | Farms and food security | Climate-resilient agriculture, agroforestry, seed banks | Farms converted, households supported | Farmland |
| 5 | Community infrastructure | Rainwater harvesting, potable water, small community energy | Systems built, households served | Village, built structures |
| 6 | Preparedness and capacity | Disaster risk management, early warning, evacuation, training, education, advocacy | Supplied by the theme: drills run, households with a plan, people trained | People and community spaces |
| 7 | Waste and plastics | Collection, recovery facilities, shoreline and urban cleanup | Tonnes diverted, facilities built | Urban and shoreline |

**Two judgment calls, open to reversal.** Coastal was split from marine because mangrove restoration is the flagship Philippine grassroots activity and because above-water and below-water photography share nothing. Community renewable energy was folded into infrastructure rather than given its own theme, because grassroots energy work is thin in the Philippines relative to the rest of this list.

**Theme 6 is the one to design first or second, despite being the least photogenic.** It is the only theme whose job is to invent legibility rather than present it, and if the model works there it works everywhere.

## 6. Still open

- **Visual direction proper.** Palettes, typography, imagery treatment and the impact module's form, for seven themes on one skeleton.
- **How much an organisation can change within a theme.** Photo, logo and copy are agreed. The limits are not set.
- **AI assistance in the builder.** Content enhancement and image handling were raised and need a decision before they go in or out.

## 7. The work-type taxonomy: research result and proposal

Researched 21 August 2026 at the user's request, to decide the builder's category question and the theme library. Sources are secondary (sector overviews and NGO directories) rather than a government sector classification, so this is a **proposal for review** rather than an established taxonomy.

Ten categories cover what Philippine grassroots environmental and adaptation organisations actually do:

| # | Category | Typical countable output |
|---|---|---|
| 1 | Mangrove and coastal restoration | Hectares restored, seedlings planted |
| 2 | Marine protection and sustainable fisheries | Protected area established, reef sites, gear replaced |
| 3 | Forest and watershed restoration | Native trees planted, hectares reforested |
| 4 | Climate-resilient agriculture and food security | Farms converted, seed banks, households supported |
| 5 | Water access and rainwater harvesting | Systems built, households served |
| 6 | Disaster preparedness and community resilience | Drills run, early-warning units, evacuation sites |
| 7 | Waste management and plastic pollution | Tonnes diverted, facilities built |
| 8 | Wildlife and biodiversity conservation | Habitat hectares, species monitored |
| 9 | Community renewable energy | Installations, households connected |
| 10 | Environmental education and advocacy | Participants trained, schools reached |

**What the research supports.** Mangrove rehabilitation and coastal resource management are heavily represented in Philippine community-based work and are frequently NGO-funded and NGO-implemented. Rainforestation using native species is a recognised Philippine restoration practice, chosen partly because native trees withstand typhoons better. Marine protection, sustainable fisheries, climate-smart agriculture and community-based disaster risk management recur as focus areas across Philippine environmental organisations, alongside solid waste and renewable energy.[^2]

**Why this list is shaped this way.** The categories are ordered so that the ones with the clearest countable physical output come first. That is deliberate, because the project's deepest open assumption is whether adaptation without a countable output can be funded retail at all. Categories 1 to 5, 7 and 9 have a natural unit to put in a costed budget. Categories 6 and 10 do not, and they are the ones where the theme design has to work hardest, since a theme is the only place a product can supply concreteness that the work itself does not hand over.

**Consequence for the theme library.** Ten categories map cleanly onto the five-to-ten themes described in the direction above. The open design question is whether a theme is keyed one-to-one to a category, or whether a smaller number of themes each serve a family of categories.

## 8. The legitimacy question: the reasoning that led to the two-flow model

The user's challenge stands, and one fact from the research makes it sharper than a page-design problem.

**The platform holds no money, so there is no remedy after the fact.** Direct settlement means no ability to freeze funds, reverse a donation, or hold money pending investigation, and those consequences are already accepted in the locked decisions. The practical effect is that **the only fraud control available is at the gate**, before a campaign publishes. A platform that can claw back can afford a permissive front door. This one cannot.

That reframes the original question. "How should the page display a missing PCNC accreditation" assumed the organisation is already publishable and the donor is the one deciding. The user's objection is that the donor is not equipped to make that call, and the structure above says the platform cannot correct the call afterwards either.

**Three directions, none chosen.**

1. **A floor the platform checks itself.** Publishing requires an SEC registration number that returns an active, non-revoked status. That is free to check and is a fact rather than a judgment. Organisations below it do not publish. This is a real eligibility bar, and it is far lower than the one the product exists to get under: GlobalGiving asks for two years of financial statements, a documented board and a prior-funder track record, while this asks only that the register says the organisation exists and has not been revoked.
2. **Graduated limits rather than graduated warnings.** Everyone above the floor publishes, and the amount a campaign may raise is capped by how much has been verified, with the cap rising as evidence accrues. The donor is never asked to interpret a gap, because the platform has already priced it.
3. **The platform states its own conclusion.** The page carries what the platform checked and what it concluded, in the platform's voice, rather than presenting raw evidence for the donor to assemble. This is the largest departure from the evidence-not-badge decision and should be treated as reopening it rather than implementing it.

**Recommendation, for the user to accept or reject:** 1 and 2 together. A checkable floor keeps the worst cases off the platform without recreating the documentation barrier, and a raise cap converts "how much evidence exists" into a number the platform applies rather than a warning the donor has to weigh. Option 3 is not recommended, because the moment the platform states a conclusion about an organisation whose money it never touches, it is making a promise it has no mechanism to keep.

## 9. Deliberately not decided yet

Palette, typography and component specs. Those follow the theme-library decision rather than preceding it, because a library of ten distinct themes is a different type system from a single page skin.

## Sources

[^1]: Portfolio design system audit, 25 July 2026 (private artifact). Documents four separate visual languages in the repo and the rule that product UI mockups stay deliberately distinct per project.
[^2]: Secondary sources, 21 August 2026: [Wetlands International Philippines](https://www.wetlands.org/case-study/scaling-science-based-mangrove-restoration-in-the-philippines/), [mangrove restoration case study, Disasters journal](https://onlinelibrary.wiley.com/doi/pdfdirect/10.1111/disa.12630), [Mongabay on community mangrove restoration](https://news.mongabay.com/2020/11/a-philippine-community-sees-life-saving-payoffs-from-restoring-its-mangroves/), [EcoHubMap Philippine climate NGO directory](https://www.ecohubmap.com/list/NGO/climate/Philippines). No Philippine government sector classification for environmental NGO work was located, so this taxonomy is assembled from sector overviews and should be treated as a proposal.
