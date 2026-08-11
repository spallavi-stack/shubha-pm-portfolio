# Case study video scripts

Drafted August 2026 against feedback items 3 to 5 in `portfolio-feedback.md`. The videos themselves are deliberately deferred; these exist so the scripting work doesn't get redone when they get made.

Flexy's utility view and SunnySideUp are 90 seconds each, five-beat structure. Flexy's homeowner view was revised in August 2026 to a six-beat MVP-overview structure running about 2 minutes (what it is and why, the problem, what mattered for the MVP, what's not in it yet, a quick demo, and a close). Narration is written to be read at a natural pace, around 150 words a minute.

Every figure below is taken from the case study pages and is already sourced there. Nothing here needs fresh fact-checking.

**Before recording, check two things.** The SunnySideUp script says DIY plug-in self-install becomes legal "at the end of this month," which is accurate only until 27 August 2026; state the date instead if recording later. And Flexy is scripted as two separate videos, one per audience toggle state on that page. A single video covering both the homeowner app and the utility dashboard runs long and serves neither well.

---

## Flexy, homeowner view

**Runtime ~2:02. Narration ~257 words. Revised August 2026 to an MVP-overview structure (what it is and why, the problem, what mattered for the MVP, what's not in it yet, a quick demo, close) rather than the persona-led structure originally used here.**

### 0:00 to 0:24, what it is, and why

**On screen:** Flexy home screen, then the live price chart.

> This is Flexy, a companion app a utility hands to its own customers alongside their existing account. I built it because dynamic electricity pricing is spreading. ComEd already runs a real hourly rate, with 38,591 residential customers on it today, and Illinois has a mandatory time-of-use rollout coming in 2026. Most households have no way to actually act on that.

### 0:24 to 0:47, the problem

**On screen:** the 40% bill-increase stat, then the smart-meter stat, sources visible.

> US electricity prices are up nearly 40 percent since 2021. About seven in ten homes already have a smart meter, but that data almost never reaches a household in a form they can use. And anyone who plugs in their EV the moment they get home is usually charging during the most expensive hour of the day.

### 0:47 to 1:03, what mattered for the MVP

**On screen:** ComEd's price API response, then the Smartcar Connect flow.

> For the MVP, two things had to be technically proven, and I could prove both without a partnership. Fetching live prices straight from ComEd's public API. And controlling EV charging across every major brand through one Smartcar integration, hardware-agnostic by design.

### 1:03 to 1:23, what's not in it

**On screen:** the technical feasibility doc, the "not yet proven" row on smart meter data.

> What's not in the MVP yet: a live smart meter feed. Households can already export their own usage data from ComEd manually, but pulling it in automatically needs a formal partnership with the utility, the same one Flexy's business model is already built around. That's sequenced next, not proven yet.

### 1:23 to 1:53, the prototype

**On screen:** click the real flow. Connect a ComEd account, connect a car through a manufacturer login, set a ready-by time, land on live pricing and smart charging.

> Here's the prototype itself. Connecting a ComEd account, connecting a car through a manufacturer login, setting a ready-by time, and landing on live pricing and smart charging.

### 1:53 to 2:02, close

**On screen:** the prototype full view, then the documents section.

> Go ahead and click through the prototype yourself. And if you want the research behind it, or have any questions, reach out.

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

**Runtime target 1:30. Narration 229 words.**

### 0:00 to 0:08, the problem

**On screen:** two quote documents side by side, the totals circled.

> Denise Okafor got two solar quotes four thousand pounds apart. Neither company explained the difference.

### 0:08 to 0:28, how widespread this is

**On screen:** the CMA finding, then the Which? survey line, sources visible.

> The UK Competition and Markets Authority flagged this in 2022, naming inaccurate and unrealistic headline prices in the solar sector. A Which? survey found more than a third of solar panel owners had been cold-called with false claims, including bogus government-required checks.

### 0:28 to 0:42, the structural reason

**On screen:** the competitive landscape table, the referral-fee column held on screen.

> Every UK solar comparison site I could find runs on lead generation or referral fees. They are paid per lead, so their incentive is to produce quotes. SunnySideUp takes no referral fees and sells nothing. It answers one question. Is this worth it for your specific house.

### 0:42 to 1:08, the research

**On screen:** the three persona cards, then the legal timeline, then the honest "still unresolved" flag in the prototype.

> I built it around three personas and synthetic interviews. All three said they would accept a negative result and act on it, specifically because nothing is being sold to them. The third persona is a renter, and her case surfaced something the product cannot fix. Plug-in solar became legal for electrician install in April, and DIY self-install becomes legal at the end of this month, but tenancy consent is still unresolved. Her ceiling is capped by law, so the product says that out loud.

### 1:08 to 1:22, the prototype

**On screen:** run a real check. Postcode, segment, inputs, then the amber result with the assumptions panel opened.

> Here is the check. Postcode, segment, your consumption and tariff, and a green, amber or red result with every assumption behind it shown.

### 1:22 to 1:30, close

**On screen:** the market opportunity cards, then the documents section.

> The company is invented. The regulations and the market data are real and cited.
