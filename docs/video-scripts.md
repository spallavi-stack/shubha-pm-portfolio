# Case study video scripts

Drafted August 2026 against feedback items 3 to 5 in `portfolio-feedback.md`. The videos themselves are deliberately deferred; these exist so the scripting work doesn't get redone when they get made.

Flexy's homeowner view and SunnySideUp have both actually been recorded now; the transcripts below are the real closed-caption text for each, kept here as the source of truth rather than the earlier drafts written before recording. Both are short, casual, first-person orientation clips, spoken to the reader before they get into the case study's reading material, not a persona-led or feature-benefit pitch. Flexy's utility view remains its own separate 90-second draft, five-beat structure, not yet recorded.

Each video is embedded on its case study page (`assets/video-*.mp4`, with a poster frame and a toggleable WebVTT captions track at `assets/captions-*.vtt`), positioned directly under the hero, above everything else on the page. Flexy set this pattern (#135, #136, #138); SunnySideUp's video, poster, and captions were added the same way, matching Flexy's `.video-frame-wrap` / `.video-overlay-wrap` markup, CSS, and play-button JS exactly.

Every figure below is taken from the case study pages and is already sourced there. Nothing here needs fresh fact-checking.

**Before recording (Flexy utility view only).** Flexy is scripted as two separate videos, one per audience toggle state on that page. A single video covering both the homeowner app and the utility dashboard runs long and serves neither well.

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

**Status: recorded. Runtime 1:55. Text below is the actual closed-caption transcript of the recorded video, not a draft. Replaces the earlier draft that was written before recording (which itself replaced an even earlier five-beat draft written before the real Flexy transcript was available).**

### 0:00 to 0:10, intro

> Hi. Before you get into the reading material for this case study, here's a super quick introduction to help you navigate Sunnyside Up.

### 0:10 to 0:19, what it is

> Sunnyside Up is a dummy product and an independent solar viability check for UK homes, covering both rooftops and plug-in solar.

### 0:19 to 0:32, the market signal, and the problem

> The UK just had its biggest year yet for solar installation, up thirty-one to thirty-seven percent in twenty-twenty five. Every comparison site in the country runs on lead generation or a referral fee.

### 0:32 to 0:45, the problem, continued

> Households, however, are very wary of quotes that can differ by thousands of pounds with no real explanation, and renters have it even harder since they can't put anything on a roof they don't own.

### 0:45 to 0:53, the aside

> Most renters don't even know that a plug-in solar option exists for them, and it can cost as little as a few hundred pounds, less than most people would have guessed.

### 0:53 to 1:04, scope of this case study

> With this case study, I have focused on establishing viability of most of the features necessary for a product like Sunnyside Up to exist.

### 1:04 to 1:38, what was proven, and close

> First was the ability to fetch live data directly from three sources: a postcode's region and coordinates from postcodes.io, solar irradiance from Open Meteo, and current electricity prices from Octopus Energy's API. Next one was a viability engine that covers both rooftops and plug-in solar, scoring a home green, amber, or red. And the last is every assumption behind the score that gets shown to the user right in the results. As you go through this case study, you can dive directly into Sunnyside Up's competition, personas, and research, as well as the roadmap.

### 1:38 to 1:55, invitation to try it

> Feel free to click around with the prototype, check the solar viability for your own home as well.
