# Flexy — Personas (v2, frozen)

Grounded in real ComEd/Illinois specifics: ComEd's Residential Real-Time Pricing (hourly wholesale-tracking rate, live today), ComEd's TOU rate rollout finalizing for 2026 (steep afternoon/evening delivery charge, cheap overnight, +$2/month per EV up to 2 EVs for 2 years), Illinois Shines / Adjustable Block Program (upfront lump-sum SREC payment, ~25-40% of system cost even with no federal credit), and the Illinois EPA HEAR heat pump rebate (up to $8,000, income-qualified under 80% AMI, rolling out in phases by county — not yet universally live).

Template per persona: identity, quote, goal, pain point, current behavior/workaround, desired solution (in their own words), tech-savviness, JTBD statement, Flexy feature, grounding fact.

---

## 1. Marcus Webb — The Accidental Peak Charger
**Age/gender:** 42, male · **Location:** Naperville, IL · **Occupation:** Sales manager · **Household:** Homeowner, married, two kids · **Income:** ~$110k

> "I plug in when I get home. I don't have time to think about electricity prices."

**Goal:** Keep his EV charged without any extra mental effort.
**Pain point:** On Real-Time Pricing, but charges the moment he plugs in after work — often exactly during the hot summer afternoon/early-evening price spike.
**Current behavior:** Ignores ComEd's hourly price alert emails; only notices the cost impact when the bill arrives.
**Desired solution (his words):** "Just tell the app when I need the car ready, and let it figure out the cheapest time — I don't want to check prices myself."
**Tech-savviness:** Moderate — comfortable with scheduling apps, not interested in manually optimizing anything.
**JTBD:** When I plug in my EV after work, I want it charged by the time I need it the next day at the lowest possible cost, so I can save money without thinking about electricity pricing.
**Flexy feature:** Smart EV charging (auto-schedule to cheapest hours, "ready by 8am" preference).
**Grounding fact:** ComEd explicitly flags hot summer afternoons as the highest-value shifting window.

---

## 2. Priya Raman — The TOU Skeptic
**Age/gender:** 55, female · **Location:** Oak Park, IL · **Occupation:** High school teacher · **Household:** Homeowner, empty nester · **Income:** ~$75k

> "I don't want to gamble on a new rate plan and end up paying more."

**Goal:** Decide confidently whether switching to ComEd's new TOU rate will actually save her money.
**Pain point:** She's often home doing laundry in the afternoon — exactly the window the proposed TOU rate charges the most for.
**Current behavior:** Stuck on her current rate; found ComEd's rate-comparison PDF confusing and gave up trying to model it herself.
**Desired solution (her words):** "Just show me, based on how I actually use electricity, whether I'd save money or lose money if I switched."
**Tech-savviness:** Low-to-moderate — comfortable with basic apps, not a spreadsheet person.
**JTBD:** When ComEd's TOU rate becomes available, I want a clear before/after comparison based on my real usage, so I can decide without guessing.
**Flexy feature:** Price graph (today/tomorrow/monthly/annual views) to compare her real usage against both rate structures.
**Grounding fact:** ComEd's proposed TOU plan pairs a steep peak delivery charge with a significant overnight discount, per the 2026 filing before state regulators.

---

## 3. Devon Michaels — The Overwhelmed Watcher
**Age/gender:** 34, non-binary · **Location:** Evanston, IL · **Occupation:** Software QA tester · **Household:** Renter, lives alone, owns one EV (a used Chevy Bolt) · **Income:** ~$65k

> "I signed up for real-time pricing to save money, but now checking prices feels like a part-time job."

**Goal:** Benefit from Real-Time Pricing without daily manual monitoring.
**Pain point:** Checks the live price page for a week or two, then quietly gives up — anxious about missing a high-price window but unwilling to keep checking forever. Would like more of their usage to shift automatically, but realistically the only thing that actually can shift automatically is EV charging — everything else in the house still requires them to notice and act manually.
**Current behavior:** Set a phone reminder to check ComEd's hourly prices; abandoned it after about two weeks. Still manually decides when to run the dishwasher/laundry based on vague memory of "prices are usually better at night," with no real feedback on whether that's accurate.
**Desired solution (their words):** "I know you probably can't control my dishwasher, but at minimum, just handle my car charging automatically, and show me clearly what my usage looks like so I stop having to guess about the rest."
**Tech-savviness:** High — comfortable with smart-home automation, wants set-and-forget by default, understands the difference between "informational" and "automated" features without needing it over-explained.
**JTBD:** When electricity prices spike, I want my EV charging to automatically shift away from those hours, and I want clear visibility into my broader usage, so I can benefit from real-time pricing without actively monitoring prices myself.
**Flexy feature:** Real-time consumption view (informational) + smart EV charging (the one device Flexy actually automates in the MVP).
**Grounding fact:** ComEd's own program guide relies on customers manually watching price alerts and responding in real time — exactly the burden Flexy's EV automation removes, even though it can't yet extend that to other appliances.

---

## 4. Carla Jimenez — The SREC Skeptic
**Age/gender:** 47, female · **Location:** Aurora, IL · **Occupation:** Small business owner (bakery) · **Household:** Homeowner, married · **Income:** ~$130k

> "Solar salespeople keep throwing numbers at me. I want the real math for my house."

**Goal:** Get an honest, personalized payback estimate for rooftop solar now that the federal credit is gone.
**Pain point:** Three solar company quotes, three different sets of assumptions — she can't tell what's real and what's a sales pitch.
**Current behavior:** Collected quotes eight months ago; hasn't signed anything since, stuck in analysis paralysis.
**Desired solution (her words):** "I want to just put in my actual electric bills and get a straight answer — payback period, real annual savings — without a sales pitch attached."
**Tech-savviness:** Moderate — comfortable uploading bills or photos to an app.
**JTBD:** When I'm evaluating a rooftop solar quote, I want to see a real projected payback using my actual usage and Illinois Shines incentives, so I can decide without relying on a salesperson's numbers.
**Flexy feature:** Solar savings calculator, using her actual usage plus real Illinois Shines SREC economics.
**Grounding fact:** Illinois Shines pays 25-40% of system cost upfront via SRECs (e.g. ~$11-12k on a typical 8.5kW system at current ~$78/credit pricing) — even with no federal credit.

---

## 5. Bob Thornton — The HEAR Rebate Chaser
**Age/gender:** 63, male · **Location:** Rockford, IL · **Occupation:** Retired factory worker · **Household:** Homeowner, lives with spouse · **Income:** ~$48k (fixed)

> "I heard there's free money for a heat pump, but I can't figure out if it applies to me."

**Goal:** Find out definitively whether he qualifies for HEAR funding before committing to a purchase.
**Pain point:** The rebate rolls out by county and by measure type; two contractors gave him conflicting answers about whether it's available where he lives.
**Current behavior:** Called two local HVAC contractors, got contradictory information, and stalled on the decision entirely.
**Desired solution (his words):** "Just tell me straight — am I eligible, is it available in my county right now, and how much would I actually get?"
**Tech-savviness:** Low — prefers phone calls, but will use a simple app if someone walks him through it once.
**JTBD:** When I'm considering a heat pump, I want to know clearly whether I qualify for HEAR funding in my county right now, so I can decide with confidence instead of guessing.
**Flexy feature:** Heat pump savings calculator, flagging eligibility and county rollout status alongside the savings number.
**Grounding fact:** Illinois EPA's HEAR program is phased by county/measure type and currently prioritized for households under 80% AMI — not yet universally available statewide as of mid-2026.

---

## 6. Jenna Alvarez & Sam Kim — The Multi-EV Household
**Age/gender:** Jenna, 39, female; Sam, 41, male · **Location:** Schaumburg, IL · **Occupation:** Both work in tech (hybrid) · **Household:** Homeowners, two kids, two EVs · **Income:** ~$180k (combined)

> "Coordinating two cars' charging schedules around one price feed is like a logistics puzzle we didn't sign up for." — Jenna

**Goal:** Charge both EVs cheaply without manually coordinating who charges when.
**Pain point:** Juggling two cars' overnight readiness needs against a single shared price signal, plus wanting to capture ComEd's per-EV sign-up incentive.
**Current behavior:** Manually alternates which car charges each night; occasionally both end up plugged in during peak hours by accident.
**Desired solution (their words):** "Let us set individual charge-by times for each car, and have the app figure out how to sequence or split charging between them at the lowest total cost."
**Tech-savviness:** High — both comfortable with smart-home tech and scheduling apps.
**JTBD:** When we have two EVs needing charge on the same night, we want the app to sequence and optimize both against live pricing and our schedules, so we minimize total cost without manual coordination.
**Flexy feature:** Smart EV charging with multiple vehicles and per-vehicle preferences.
**Grounding fact:** ComEd's proposed TOU program includes a $2/month per-EV bill credit, capped at two vehicles for up to two years — directly relevant to a two-EV household deciding whether to enroll.

---

## Coverage check
- Price graph: Persona 2 (Priya)
- Real-time consumption: Persona 3 (Devon)
- Smart EV charging: Personas 1 (Marcus), 6 (Jenna & Sam)
- Solar savings calculator: Persona 4 (Carla)
- Heat pump savings calculator: Persona 5 (Bob)

## Status
**Frozen v3** — 6 personas in full brief format. Devon's persona (v3) corrected to match actual MVP feasibility: Flexy automates EV charging only in the MVP (device-level control of dishwashers/thermostats/etc. would require per-appliance smart-plug/API integrations well beyond MVP scope); real-time consumption remains informational. Next: synthetic interviews (Week 2), one per persona.
