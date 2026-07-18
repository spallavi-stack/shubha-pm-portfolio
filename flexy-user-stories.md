# Flexy - User Stories & Use Cases

Jobs to Be Done describe the underlying motivation. User stories break that motivation into sprint-sized, testable pieces with acceptance criteria. Use cases go a level further and walk through what happens when something doesn't go as planned, including the paths a user story alone wouldn't surface.

## User stories: Price & Cost view

**US1.** As Priya, I want to see my TOU-mode cost side by side with my real-time-pricing cost, using my own usage history, so I can decide whether to switch rate plans without guessing.
- Acceptance criteria: toggling "See this on Time-of-Use" replays the household's actual historical consumption against ComEd's TOU rate structure; both figures are visible without navigating away.

**US2.** As Devon, I want to see today's cost so far and my average price paid per kWh without digging through a settings menu, so I get the awareness I want without the manual tracking I gave up on.
- Acceptance criteria: today's running cost and average price paid are both headline numbers, visible on load, no additional taps required.

**US3.** As any Price & Cost view user, I want to see when the next cheap window is coming, so I can decide whether to delay a discretionary task like laundry.
- Acceptance criteria: a "next cheap window" figure is shown alongside today's cost and average price.

## User stories: Smart EV charging

**US4.** As Marcus, I want to set only a ready-by time and trust Flexy to find the cheapest way to hit it, so I don't have to configure anything else.
- Acceptance criteria: Max Savings mode requires only a ready-by time as input; Flexy charges to a safe default floor and full charge using the cheapest available hours, using more expensive hours only if needed to hit the deadline.

**US5.** As Jenna or Sam, I want independent ready-by times, target charge levels, and amperage caps for each of our two cars, so the app can sequence both without us coordinating manually.
- Acceptance criteria: Custom Settings mode supports per-vehicle configuration; two vehicles can have different ready-by times, target charge levels, and amperage caps simultaneously.

**US6.** As a Custom Settings user, I want Flexy to tell me immediately if my target is unreachable, so I can adjust before it's too late rather than finding out at the deadline.
- Acceptance criteria: on saving Custom Settings, Flexy checks whether the target charge level is physically reachable given charger speed and time available, and surfaces a clear pass/fail result immediately at save time.

**US7.** As any Smart EV charging user, I want a one-tap override to charge immediately regardless of price, so I'm not blocked by the automation when my plans change.
- Acceptance criteria: an override control is available at all times during an active charging session and takes effect immediately when used.

## Use cases

Use cases describe what happens on a path where something doesn't go as expected. None of the flows below are built into the click-dummy prototype today; they're documented here as the acceptance criteria the eventual build needs to satisfy.

**UC1: ComEd price connection fails.**
Trigger: Flexy's price feed can't reach ComEd's API (outage, rate limit, network failure).
Expected flow: Flexy falls back to the most recent successfully fetched price data, labels it clearly as not live, and does not silently present stale data as current. Smart EV charging continues operating on the last known price pattern rather than stopping entirely, since a charging deadline still needs to be met.

**UC2: Connected vehicle reports a charge level below the safety floor mid-session.**
Trigger: A GM or Chevy vehicle connected through Smartcar reports state of charge has dropped below the user's configured minimum floor (for example during an unplanned trip) while a scheduled optimization is in progress.
Expected flow: Flexy treats the floor as a hard constraint and begins charging immediately regardless of price, overriding the cost-optimization schedule, since the safety floor exists precisely for this situation.

**UC3: Price data is stale or unavailable when a user opens the Price & Cost view.**
Trigger: The most recent successful price fetch is older than a defined freshness window.
Expected flow: The view shows the last known data with a visible timestamp and a clear "not current" indicator, rather than presenting an old number as if it were live.

**UC4: The achievable-at-setup check fails.**
Trigger: A user sets a Custom Settings target that isn't reachable given the charger's speed and the time available before the ready-by deadline.
Expected flow: Flexy flags this at the moment of saving, states specifically what's not reachable (for example, "80% by 6am isn't reachable at this charging speed, the earliest full charge is 7:40am"), and lets the user adjust the ready-by time, target level, or accept a later completion, rather than silently under-delivering at the deadline.

## Status

Drafted from the roadmap's Custom Settings / Max Savings detail and the six personas' JTBD statements. Acceptance criteria are written to be testable once a real build exists; none of the use-case failure flows are implemented in the click-dummy prototype yet.
