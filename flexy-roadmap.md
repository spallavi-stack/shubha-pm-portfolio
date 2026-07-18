# Flexy, Roadmap (v2)

## Prioritization framework: ICE

Using ICE (Impact, Confidence, Ease) rather than RICE. Reach isn't meaningfully estimable yet since Flexy has no real user base or ComEd partnership in place, so ICE fits a pre-launch, research-grounded prioritization better. Each scored 1-10; ICE score is the average of the three. Every score is justified against a specific persona, JTBD statement, or interview-synthesis theme, not a gut feeling.

**Legend:** Impact = how much this moves the needle on the core problem. Confidence = how sure we are, based on persona/interview evidence or real-world precedent, that this is the right feature. Ease = technical/data feasibility given known constraints.

---

## NOW (MVP, build first)

| Feature | Tied to | Impact | Confidence | Ease | ICE |
|---|---|---|---|---|---|
| Price & Cost view (combined, redesigned) | Priya's and Marcus's JTBDs, Core Problem #1 (bill shock) | 9 | 8 | 7 | 8.0 |
| Smart EV charging, two modes: Custom settings and Max-savings | Marcus, Devon, Jenna and Sam JTBDs; interview theme on readiness vs. savings trust | 9 | 9 | 6 | 8.0 |

### Price & Cost view: what changed and why

We looked at a real Tibber + Home Assistant community dashboard for inspiration (dual-axis bars and line, four time-range tabs, a separate Aktuell/Statistik split). It's a genuinely useful data model, consumption and price on one timeline plus a derived cost figure, but it's a power-user pattern built by and for Home Assistant hobbyists. For personas like Bob or Priya, a dual-axis chart with multiple tabs would be a barrier, not a feature.

So instead of copying that layout, Flexy takes the underlying idea (show consumption and price together, and surface the actual cost) and presents it more simply:

- One chart, not two axes: price shown as color-coded bands in the background (cheap, moderate, expensive) rather than a second numeric axis; the household's own consumption overlaid as a simple shape rather than competing bars.
- Three headline numbers above the chart: today's cost so far, the average price actually paid per kWh, and the next cheap window coming up. This is the "actual cost paid" metric from the reference dashboard, elevated to a first-class number rather than buried in a second chart, since it's the most direct answer to bill shock.
- A single time-range control (Today, Week, Month, Year) instead of a separate Aktuell/Statistik split. Collapsing those two into one continuous view removes a navigation decision that didn't add real value for our personas.
- A "See this on Time-of-Use" toggle: flips the background price bands to ComEd's proposed TOU rate structure, replayed against the household's actual historical usage. This directly answers Priya's ask, "show me based on how I actually use electricity whether I'd save money or lose money if I switched," without needing a separate feature or a manual PDF comparison.

### Smart EV charging: what changed and why

Two real-world references shaped this. Octopus Intelligent Go (UK) validates a simple two-mode pattern: a guaranteed custom deadline as the default, with a savings-maximizing option for people who don't have a hard deadline. A Home Assistant community project (Tibber plus a go-eCharger wallbox plus BMW CarData) goes further: it schedules charging based on actual current battery state of charge and a target state of charge rather than blindly charging for a fixed number of hours, and it stitches together today's and tomorrow's prices to find the cheapest continuous window across midnight.

Flexy's MVP adopts both ideas, with one structural advantage over the DIY project: that Home Assistant setup is hard-wired to one specific car brand (BMW CarData) and one specific wallbox (go-eCharger), so it only works for that exact hardware combination. Flexy would use an aggregator like Smartcar instead, which exposes battery state of charge across many EV brands through one API. That means state-of-charge-aware scheduling can be a cross-brand MVP feature for Flexy rather than a per-brand integration project, which is a real differentiator worth stating plainly in the pitch.

Both modes require a ready-by time. That was a deliberate correction from an earlier draft of this roadmap, which had Max savings running with no fixed deadline at all. In practice a household always knows what time they need to leave, and the interview finding that a car not being ready is the number one trust-breaker applies regardless of which mode someone picks. So the real difference between the two modes isn't whether readiness is guaranteed, it's how much the user configures:

1. **Custom settings.** For someone who wants precise control and is willing to set it up. Flexy treats every field below as a hard constraint and only optimizes for cost within them. This is the default for Marcus and for Jenna and Sam, who each described specific numbers they wanted control over. The settings panel includes:
   - **Ready by:** the time the car needs to be ready (for example, 7am).
   - **Target charge level:** most EV owners don't want 100 percent every night, many keep it around 80 percent for daily use and only charge to full before a longer trip. Without this, Flexy either overcharges or breaks the readiness promise.
   - **Minimum charge floor:** a safety net independent of the deadline, for example never letting the battery drop below 20 percent, in case the car is needed unexpectedly mid-optimization.
   - **One-tap override:** a "charge now, ignore price" button for when someone needs the car sooner than planned. This preserves trust in the moments the automation would otherwise get in the way.
   - **Per-vehicle settings:** each connected EV gets its own ready-by time, target charge, and floor, since a two-car household needs independent settings rather than one shared configuration.
   - **Day-of-week variation:** a toggle for a separate weekend ready-by time, since a single fixed time doesn't fit most schedules. Standard across Optiwatt and Tesla's own scheduled departure feature.
   - **Charging speed limit (amperage cap):** lets a household cap the current draw, for example reducing from 48A to 32A or 16A when sharing circuit capacity with another EV or a large appliance. Directly relevant to Jenna and Sam's two-EV household, and something Tesla's own app already exposes, so it's a realistic ask from a tech-savvy user rather than an invented feature.
   - **Home-only automation:** restricts smart scheduling to when the car is actually at the home charger, since Flexy's ComEd price data doesn't apply to a public or workplace charger. This is a correctness feature as much as a preference, borrowed from Ohme's location-aware charging.
   - **Achievable-at-setup check:** when the user saves their settings, Flexy immediately checks whether the target is physically reachable in the time available given the charger's speed, and says so on the spot. This replaced an earlier idea of an ongoing "at-risk of missing target" notification, which doesn't actually apply here: because the deadline is a hard constraint, Flexy will charge through expensive hours if needed to hit it, so price conditions never put the target at risk. The only real risk is a physical one (plugged in too late, or an unreachable target given charging speed), which is a one-time check, not an ongoing monitor.
2. **Max savings.** For someone who doesn't want to configure anything beyond the deadline. The user sets only a ready-by time; Flexy defaults to charging to 100 percent with a safe floor and picks the cheapest available hours to get there, using more expensive hours only if that's what it takes to hit the deadline. This fits Devon, whose JTBD was explicitly "I want the awareness without the labor" - fewer inputs is the point, not a missing feature.

Both modes combine today's and tomorrow's ComEd price data once tomorrow's prices are available, so an overnight session isn't artificially cut off at midnight, the same pattern the Home Assistant project uses with Tibber's day-ahead prices.

---

## NEXT (build once MVP is validated)

| Feature | Tied to | Impact | Confidence | Ease | ICE |
|---|---|---|---|---|---|
| Monthly EV charging budget cap | Inspired directly by the go-eCharger project's budget feature; general cost-conscious households | 7 | 6 | 6 | 6.3 |
| "Here's what we did and why" transparency and savings digest | Cross-persona interview theme: automation is only trusted alongside visibility | 8 | 7 | 6 | 7.0 |

The budget cap lets a user set a monthly dollar ceiling for EV charging specifically, tracked separately from the rest of the household's electricity cost, and pauses charging if the cap is hit. This is a real feature from the Home Assistant project worth borrowing, but it's Next rather than Now because it depends on the core charging engine already running reliably, and because it adds a second constraint (budget) on top of the two modes above that's easier to reason about once those are proven.

The transparency digest is unchanged in rationale from the prior version of this roadmap: high confidence but lower ease, since it depends on carrying accurate savings data over time rather than a one-time build.

Solar and heat-pump savings calculators, and a solar-aware charging mode paired with them, were cut from this roadmap along with the two personas built around them (see flexy-personas.md and flexy-product-brief.md) - outside a realistic MVP-plus-Next scope for a portfolio piece centered on price visibility and EV charging.

---

## LATER (roadmap-level vision, not built in this portfolio)

| Item | Rationale |
|---|---|
| Negative-price handling | Edge case seen in the Home Assistant project (Tibber's wholesale-linked pricing can occasionally go negative); ComEd's retail hourly pricing rarely does, so this is a nice-to-have rather than a core need for our MVP market. |
| Charging efficiency and loss tracking | Compares power delivered by the charger against power actually received by the battery, a trust-building detail from the reference project, but not essential for an MVP demonstration. |
| Voltage and capacity protection for multi-EV households | A real technical constraint, two EVs charging at once can strain a home's electrical capacity, directly relevant to Jenna and Sam's persona, but genuinely deferred past MVP scope rather than glossed over. |
| General appliance and device automation (smart plugs, thermostats) | Explicitly descoped from MVP. Requires per-appliance API or hardware integrations Flexy can't promise yet. |
| Multi-utility and multi-state expansion | Natural next client-acquisition motion once the ComEd relationship is proven. |
| Pan-European expansion (UK, Netherlands, and so on) | The original multi-market vision, sequenced as future scope once the US model is validated. |
| Household benchmarking and social proof features | Appears in comparable products (Tibber, Emporia) but wasn't requested by any of our four personas, so it's deprioritized. |

---

## Competitive grounding for the smart charging design

- **Octopus Intelligent Go (UK):** validates the custom-deadline-plus-savings-default pattern, and the idea of a manual "boost" override for when the default schedule isn't enough.
- **go-eCharger, Tibber, and BMW CarData (Home Assistant community project):** validates state-of-charge-aware scheduling, day-ahead price stitching across midnight, and a monthly budget cap as real, working ideas, while also showing the limitation of building this per specific hardware brand rather than through an aggregator.
- **Ohme, Optiwatt:** validate that hardware-agnostic, cross-brand charging control is buildable at product scale, reinforcing that Flexy's Smartcar-based approach is the more scalable path than the DIY single-brand pattern above.

## What this roadmap deliberately does not do

It doesn't rank purely by highest ICE score. The calculator features score respectably but are sequenced into Next specifically because they depend on infrastructure (accurate usage data, a working EV charging engine) that Now builds first. This is a dependency-aware roadmap, not a sorted list, which is closer to how a real roadmap gets built and defended to stakeholders.

## Status
Draft v5. Price and consumption merged into one redesigned Price and Cost view with a Time-of-Use comparison toggle. Smart EV charging expanded into two explicit modes, custom settings and max savings, both now requiring a ready-by time; the differentiator between them is depth of configuration, not presence of a deadline. Custom settings mode fully specified: ready-by time, target charge level, minimum floor, one-tap override, per-vehicle settings, weekend-specific scheduling, charging speed limit (amperage cap), home-only automation, and a one-time achievable-at-setup check rather than an ongoing at-risk notification. Max savings simplified to a single ready-by input with sensible defaults for everything else. Solar and heat-pump savings calculators and solar-aware charging removed from Next along with the two personas built around them; Next is now the budget cap and the transparency digest. Negative-price handling, efficiency tracking, and multi-EV voltage protection remain in Later as named, deliberate deferrals. Click dummy (Weeks 4 to 5) updated to match all of the above.
