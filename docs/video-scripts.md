# Case study video scripts

Drafted August 2026 against feedback items 3 to 5 in `portfolio-feedback.md`. The videos themselves are deliberately deferred; these exist so the scripting work doesn't get redone when they get made.

Flexy's homeowner view is the exception: it has actually been recorded, and the transcript below is the real closed-caption text, kept here as the source of truth rather than the earlier draft (an MVP-overview structure) that was written before recording and never used. It's a short, casual, first-person orientation clip, spoken to the reader before they get into the case study's reading material, not a persona-led or feature-benefit pitch. SunnySideUp's script (still a draft, not recorded) is written to match that same voice and shape. Flexy's utility view remains its own separate 90-second draft, five-beat structure, not yet recorded.

Every figure below is taken from the case study pages and is already sourced there. Nothing here needs fresh fact-checking.

**Before recording, check one thing.** Flexy is scripted as two separate videos, one per audience toggle state on that page. A single video covering both the homeowner app and the utility dashboard runs long and serves neither well. (SunnySideUp's plug-in cost figure, "a few hundred pounds," comes from `grounding-research.md`'s £400-£900 range for an 800W kit, itself flagged there as the weakest-sourced data in that document — fine for a casual aside, but don't tighten it into a more specific number without re-checking that section.)

---

## Flexy, homeowner view

**Status: recorded. Runtime 1:13. Text below is the actual closed-caption transcript of the recorded video, not a draft.**

### 0:02 to 0:10, intro

> Hi. Before you get into the reading material for this case study, here's a super quick introduction to help you navigate Flexy.

### 0:10 to 0:20, what it is

> Flexy is a dummy product built as a pilot MVP for ComEd. ComEd is an electricity supply company covering the north of Illinois.

### 0:20 to 0:36, the market signal, and the problem

> ComEd already offers an hourly dynamic tariff to around thirty-eight thousand customers and will soon start supplying time of use tariff as well. Households, however, express anxiety around these tariffs and are unsure about how to avoid higher electricity bills.

### 0:36 to 0:44, the aside

> Funny thing is that most households in US already have a smart meter as well.

### 0:44 to 0:52, scope of this case study

> With this case study, I have focused on establishing viability of most of the features necessary for a product like Flexy to exist.

### 0:52 to 1:13, what was proven, and close

> First one was the ability to fetch the live prices from ComEd directly. Next one was the ability to control EVs regardless of their brand or the brand of their charger, and that was done using the Smartcar API. And the last is the ability to fetch consumption data from the smart meters of households. As you go through this case study, you can dive into Flexy's competition, go to market strategy and prioritized roadmap.

---

## Flexy, utility view

**Runtime target 1:30. Narration 211 words.**

### 0:00 to 0:18, the problem

**On screen:** the utility market signal section, the 38,591 figure held on screen.

> ComEd's voluntary hourly pricing program has 38,591 residential customers. ComEd serves 3.3 million households. The pilot behind that rate cut peak demand between 6.5 and 9.7 percent every summer, so the rate works. Almost nobody is on it.

### 0:18 to 0:36, the pattern

**On screen:** the SEPA figures, then the competitive landscape table.

> That gap shows up across the industry. SEPA surveyed over 100 utility members representing more than half of US customer accounts. 71 percent already offer a time-of-day rate. 19 percent offer real-time pricing. The tariffs exist. The engagement does not.

### 0:36 to 0:54, why

**On screen:** the loss-aversion citation, then a household looking at the price chart.

> Part of the reason is measurable. 93 percent of energy bill payers are loss-averse, weighing the risk of a higher bill more heavily than the promise of savings. Asking a household to opt into a variable rate is asking them to take a bet.

### 0:54 to 1:09, what it is

**On screen:** the positioning paragraph, then the competitor table with Optiwatt and WeaveGrid rows highlighted.

> Flexy is a white-label layer you hand to your own customers. Live prices, real consumption, and automatic EV charging against your tariff. Optiwatt and WeaveGrid run the same distribution model, and both are EV-only.

### 1:09 to 1:22, the prototype

**On screen:** the operator dashboard, moving across the KPI tiles.

> This is the operator dashboard your team would use. Enrollment, aggregated flexible capacity, dispatch reliability, customer savings, and cost avoided.

### 1:22 to 1:30, the size of it

**On screen:** the TAM/SAM/SOM cards.

> There are about 3,000 electric utilities in the US, and 168 investor-owned ones serving 72 percent of customers. Year one targets one to three pilots.

---

## SunnySideUp

**Status: draft, not recorded. Target runtime ~1:37. Written August 2026 to match the actual recorded Flexy homeowner clip above: a short, casual, first-person orientation spoken to the reader before the case study's reading material, not a persona-led pitch. Replaces the earlier five-beat draft that was written before the real Flexy transcript was available.**

### 0:00 to 0:08, intro

> Hi. Before you get into the reading material for this case study, here's a super quick introduction to help you navigate SunnySideUp.

### 0:08 to 0:16, what it is

> SunnySideUp is a dummy product, an independent solar viability check for UK homes, covering both rooftop and plug-in solar.

### 0:16 to 0:29, the market signal, and the problem

> The UK just had its biggest year yet for solar installations, up 31 to 37 percent in 2025. Every comparison site in the country runs on lead generation or referral fees.

### 0:29 to 0:42, the problem, continued

> Households, however, are wary of quotes that can differ by thousands of pounds with no real explanation, and renters have it even harder, since they can't put anything on a roof they don't own.

### 0:42 to 0:54, the aside

> Most renters don't even know plug-in solar exists as an option, and it can cost as little as a few hundred pounds, less than most people would guess.

### 0:54 to 1:02, scope of this case study

> With this case study, I have focused on establishing viability of most of the features necessary for a product like SunnySideUp to exist.

### 1:02 to 1:30, what was proven

> First one was the ability to fetch live data directly from three real sources: a postcode's region and coordinates from postcodes.io, solar irradiance from Open-Meteo, and current electricity prices from Octopus Energy's API. Next one was a viability engine that covers both rooftop and plug-in solar, scoring a home green, amber, or red. And the last is that every assumption behind that score gets shown to the user, right in the result.

### 1:30 to 1:37, close

> As you go through this case study, you can dive into SunnySideUp's competition, personas and research, and prioritized roadmap.
