# Flexy — Jobs to Be Done

Consolidates the JTBD statement from each persona (see Personas doc) into one reference, adds the situation/motivation/outcome breakdown behind each statement, and maps every job to the Flexy feature that serves it.

## 1. Marcus Webb (Accidental Peak Charger)

**JTBD:** When I plug in my EV after work, I want it charged by the time I need it the next day at the lowest possible cost, so I can save money without thinking about electricity pricing.

- **Situation:** Comes home, plugs in immediately, on Real-Time Pricing but not watching it.
- **Motivation:** Wants the savings ComEd's rate structure makes possible, without the ongoing attention it currently requires.
- **Outcome he actually wants:** A charged car at the time he needs it, at a lower cost than charging the moment he plugs in.
- **Feature:** Smart EV charging, Max Savings mode. A ready-by time is the only input required.

## 2. Priya Raman (TOU Skeptic)

**JTBD:** When ComEd's TOU rate becomes available, I want a clear before/after comparison based on my real usage, so I can decide without guessing.

- **Situation:** Home in the afternoon, exactly the window ComEd's proposed TOU rate prices highest.
- **Motivation:** Doesn't want to switch rate plans on a guess and end up paying more.
- **Outcome she actually wants:** A concrete answer, grounded in her own usage pattern rather than a generic rate comparison.
- **Feature:** Price & Cost view, "See this on Time-of-Use" toggle, replaying her actual historical usage against the TOU rate structure.

## 3. Devon Michaels (Overwhelmed Watcher)

**JTBD:** When electricity prices spike, I want my EV charging to automatically shift away from those hours, and I want clear visibility into my broader usage, so I can benefit from real-time pricing without actively monitoring prices myself.

- **Situation:** Tried manually watching ComEd's price page, abandoned it after about two weeks.
- **Motivation:** Wants the benefit of Real-Time Pricing without the ongoing labor of tracking it.
- **Outcome they actually want:** Awareness without the work. Automation where it's possible (EV charging), visibility where it isn't yet (everything else).
- **Feature:** Smart EV charging, Max Savings mode, plus the Price & Cost view's real-time consumption display.

## 4. Jenna Alvarez & Sam Kim (Multi-EV Household)

**JTBD:** When we have two EVs needing charge on the same night, we want the app to sequence and optimize both against live pricing and our schedules, so we minimize total cost without manual coordination.

- **Situation:** Manually alternating which car charges each night; both cars have occasionally ended up charging during peak hours by accident.
- **Motivation:** Wants the per-EV ComEd sign-up incentive captured, without turning charging into a household coordination task.
- **Outcome they actually want:** Independent settings per car, with the app doing the sequencing math.
- **Feature:** Smart EV charging, Custom Settings mode, with per-vehicle ready-by time, target charge, and amperage cap.

## Coverage map

| Feature | Persona(s) served |
|---|---|
| Price & Cost view | Priya (rate comparison), Devon (consumption visibility) |
| Smart EV charging — Max Savings | Marcus, Devon |
| Smart EV charging — Custom Settings | Jenna & Sam |

## What this doesn't cover

This doc maps jobs to features at the MVP-scope level. It doesn't restate the acceptance-criteria-level detail (what "done" looks like for each feature); that lives in the User Stories & Use Cases doc.

## Status

Frozen. Grounded in the four personas in flexy-personas.md and the MVP/Next feature split in flexy-roadmap.md.
