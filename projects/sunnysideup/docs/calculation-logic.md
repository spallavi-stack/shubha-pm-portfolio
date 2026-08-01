# SunnySideUp calculator - calculation logic

## What this document is

A description of how `calculator.js` actually turns user inputs into a green/amber/red
viability result: the decision logic and formulas, not the sourcing arguments. Written to
be read by a human and by an AI reviewing whether this is *good* logic (correct formulas,
sensible fallback order, reasonable thresholds), as a follow-up pass to this one.

**What this document is not:** a sourcing/citation document. Every constant below names its
confidence tier (Fact / Inference / Assumption) so a reviewer knows how solid each number is,
but the full "why this source, not an alternative" reasoning lives in `calculator.js`'s own
comments and in `grounding-research.md`; this document doesn't repeat it. If a review of this
logic changes a formula or a fallback order, that's a code change in `calculator.js`; if it
changes a constant's value, that's also a `calculator.js` change with its own sourcing note.

**Source of truth:** `calculator.js` as of this document's writing (25 July 2026, after the
Octopus live-fetch bug fixes on `claude/sunnysideup-intake-flow-2h5vm1`). Line numbers below
are for cross-checking exact code, not required reading. This document should stand on its own.

**Where the decision logic actually lives:** `calculator.js` exports pure scoring functions
(`calculateRooftopViability`, `calculatePluginViability`) plus async lookup/estimate helpers.
Two decisions described below, "which consumption path" (exact figure vs. estimate) and
"which SEG choice" (same supplier / different supplier / don't know), are made by the UI
wiring layer (`calculator-test-standalone.html`'s script), not inside `calculator.js` itself.
`calculator.js` only ever receives an already-resolved number plus, for SEG, an optional label
for display. This matters for review: changing *whether* a fallback fires is a UI-layer change;
changing *what the fallback value is* is a `calculator.js` change.

---

## 1. Entry points

| Function | Type | What it does |
|---|---|---|
| `calculateRooftopViability(inputs)` | sync, pure | Core rooftop formula. All inputs already resolved or intentionally omitted (falls back to flat defaults). |
| `calculateRooftopViabilityByPostcode(postcode, otherInputs)` | async | Resolves postcode-dependent inputs (generation via Open-Meteo, price via Octopus) first, then calls the function above. |
| `calculatePluginViability(inputs)` | sync, pure | Plug-in/balcony formula. No postcode dependency, no export modeled. |

---

## 2. Overview: both segments, top to bottom

```mermaid
flowchart TD
  Start(["User inputs"]) --> Seg{"Segment?"}

  Seg -->|"Plug-in"| P1["Resolve<br/>orientation<br/>multiplier"]
  P1 --> P2["Resolve generation:<br/>770kWh x multiplier"]
  P2 --> P3["Resolve price"]
  P3 --> P4["Formula: savings,<br/>payback, status"]
  P4 --> POut(["Output: plugin<br/>result + legal<br/>status"])

  Seg -->|"Rooftop"| R1["Resolve<br/>consumption"]
  R1 --> R2["Resolve<br/>generation"]
  R2 --> R3["Resolve roof-area<br/>system sizing"]
  R3 --> R4["Resolve<br/>electricity price"]
  R4 --> R5["Resolve SEG<br/>export rate"]
  R5 --> R6["Formula: self-<br/>consumption, export,<br/>savings, payback,<br/>status"]
  R6 --> ROut(["Output: rooftop<br/>result + flags"])
```

Each stage is detailed in the matching section below: §3 for plug-in, §4a-4e for rooftop.

---

## 3. Plug-in / balcony solar

The simpler of the two segments: no postcode dependency, no export mechanism (all generation
is treated as self-consumed, matching how the underlying source figures were reported), no
roof-area sizing (it's a fixed small kit).

```mermaid
flowchart TD
  A["Orientation<br/>(default: south)"] --> B["Multiplier =<br/>rooftop's own<br/>E/W 79% / N 50%<br/>ratio"]
  B --> C["Generation =<br/>770kWh x<br/>multiplier"]
  D{"User typed<br/>a price?"} -->|Yes| E["Use as-is"]
  D -->|No| F["Default:<br/>26.11p"]
  C --> G["Savings =<br/>generation x<br/>price / 100"]
  E --> G
  F --> G
  G --> H["Payback =<br/>650 / savings"]
  H --> I{"Payback<br/>≤ 5?"}
  I -->|Yes| Green(["green"])
  I -->|No| J{"Payback<br/>≤ 8?"}
  J -->|Yes| Amber(["amber"])
  J -->|No| Red(["red"])
```

**Key constants** (`calculator.js` L311-345, L349-361):

| Constant | Value | Tier | Note |
|---|---|---|---|
| `PLUGIN_KIT_COST_GBP` | £650 | Assumption, weakest-sourced figure in the calculator | Midpoint of reported £400-900 range; no government/MCS/consumer-body source |
| `PLUGIN_ANNUAL_GENERATION_KWH` | 770kWh/yr | Assumption, same caveat | Midpoint of reported 640-900kWh/yr range; treated as the south-facing baseline |
| orientation multiplier | 79% (E/W) / 50% (N) of south | Assumption stacked on Assumption | Borrowed from rooftop's own orientation ratios; no plug-in-specific orientation data exists |
| `PLUGIN_PAYBACK_THRESHOLDS` | green ≤5yr, amber ≤8yr | Design judgment, not cited | Loosely anchored to grounding-research.md's reported range |

Output also carries a static `PLUGIN_LEGAL_STATUS` block (electrician install legal since
2026-04-15 under BS 7671 Amendment 4 [Fact]; DIY self-install not legal until 2026-08-27 under
SI 2026/848 [Fact]; tenancy consent status unresolved, no relevant provision either way). This
isn't part of the calculation, but ships alongside it in the same result object.

---

## 4. Rooftop solar

### 4a. Consumption resolution (UI-layer decision + `calculator.js` estimator)

```mermaid
flowchart TD
  A{"Exact annual<br/>kWh typed?"}
  B["Use as-is<br/>(user-provided)"]
  C["Estimate from<br/>household"]
  D["TDCV band by size:<br/>≤2 low (1,600)<br/>3 medium (2,500)<br/>4+ high (3,800)"]
  E{"Has heat<br/>pump?"}
  F["+ 4,300kWh"]
  G["+ 0"]
  H{"Has EV(s)?"}
  I["+ 1,960kWh x<br/>vehicle count<br/>(default: 1)"]
  J["+ 0"]
  K["Total annual<br/>consumption"]

  A -->|Yes| B
  A -->|No| C
  C --> D
  D --> E
  E -->|Yes| F
  E -->|No| G
  F --> H
  G --> H
  H -->|Yes| I
  H -->|No| J
  I --> K
  J --> K
  B --> K
```

**Key constants** (`calculator.js` L433-469):

| Constant | Value | Tier | Note |
|---|---|---|---|
| TDCV bands | low 1,600 / medium 2,500 / high 3,800 kWh/yr | Fact | Ofgem TDCV, effective 1 Jul 2026. The household-size-to-band boundary rule itself (≤2/3/4+) is this calculator's own tie-breaking choice, not an Ofgem-published cutoff. |
| `HEAT_PUMP_ANNUAL_KWH_ESTIMATE` | 4,300kWh/yr | Inference | Calculated: ~12,000kWh/yr EST heat-demand assumption ÷ 2.78 DESNZ field-trial median SPF |
| `EV_ANNUAL_HOME_CHARGING_KWH_ESTIMATE` | 1,960kWh/yr per vehicle | Inference | Calculated: 8,900mi/yr DfT BEV mileage ÷ 3.5-4.3mi/kWh (Assumption-tier efficiency, no gov't source) × 85% Zap-Map home-charging share |

### 4b. Generation resolution + roof-area system sizing

```mermaid
flowchart TD
  subgraph GEN["Generation source"]
    G0{"Postcode<br/>given?"}
    G1["Flat baseline:<br/>South 3,800<br/>E/W 3,000<br/>North 1,900"]
    G2["postcodes.io:<br/>→ country,<br/>lat/long"]
    G3{"Resolved<br/>OK?"}
    G4["Open-Meteo:<br/>hourly irradiance,<br/>35° tilt"]
    G5{"≥90% hourly<br/>data + valid<br/>shape?"}
    G6["Coordinate-precise:<br/>insolation x 4kWp<br/>x 0.86 PR"]
    G7["Country x<br/>baseline:<br/>Eng 1.0 / Wal 0.93<br/>Sco 0.85 / NI 0.85"]
    G8["Pre-scaling<br/>generation"]

    G0 -->|No| G1
    G0 -->|Yes| G2
    G2 --> G3
    G3 -->|No| G1
    G3 -->|Yes| G4
    G4 --> G5
    G5 -->|Yes| G6
    G5 -->|No| G7
    G1 --> G8
    G6 --> G8
    G7 --> G8
  end

  subgraph ROOF["Roof-area sizing"]
    RA0{"Roof area<br/>given?"}
    RA1["Flat reference:<br/>4kWp, £7,000"]
    RA2["Panels =<br/>floor(area /<br/>2.45m²)"]
    RA3{"≥1 panel<br/>fits?"}
    RA4["kWp = panels<br/>x 0.43;<br/>cost tier by kWp"]
    RA5{"kWp over 4?"}
    RA6["Flag: exceeds<br/>Permitted Dev<br/>ceiling"]
    RA7["No flag"]
    RA8["System size<br/>+ cost resolved"]

    RA0 -->|No| RA1
    RA0 -->|Yes| RA2
    RA2 --> RA3
    RA3 -->|No| RA1
    RA3 -->|Yes| RA4
    RA4 --> RA5
    RA5 -->|Yes| RA6
    RA5 -->|No| RA7
    RA1 --> RA8
    RA6 --> RA8
    RA7 --> RA8
  end

  SCALE["Final generation<br/>= pre-scaling x<br/>(kWp / 4 ref)"]
  GenFinal(["generationKwh,<br/>systemSizeKwp,<br/>systemCostGbp"])
  G8 --> SCALE
  RA8 --> SCALE
  SCALE --> GenFinal
```

**Key constants** (`calculator.js` L184-245, L287-292, L217-236, L723-727):

| Constant | Value | Tier | Note |
|---|---|---|---|
| `ROOFTOP_ANNUAL_GENERATION_KWH.southFacing` | 3,800kWh/yr | Assumption | Midpoint of researched 3,400-4,200kWh/yr range for a ~4kWp south-facing system |
| `...eastWestFacing` / `...northFacing` | 3,000 / 1,900 kWh/yr | Prototype estimate, not independently researched | Proportional estimate only |
| `REFERENCE_SYSTEM_SIZE_KWP` | 4kWp | Fact (reference point) | MCS's own reported UK average is 4.6kWp; the figures above were researched against "a 4kW system" |
| `ROOFTOP_SYSTEM_COST_GBP` (flat default) | £7,000 | Assumption | Industry range £5,500-8,700; close to MCS's 2025 average |
| `ROOF_AREA_PER_PANEL_M2` | 2.45m² | Inference | Derived from MCS-anchored range (typical 3-bed semi: 22-30m² usable roof fits 9-12 panels) |
| `PANEL_WATTAGE_KWP` | 0.43kWp/panel | Inference | Blended across old (350-400W) and new (425-460W) panel stock |
| `COST_PER_KWP_GBP_BY_TIER` | £1,800/kWp (≤3kWp) / £1,625/kWp (>3kWp) | Fact | MCS's own nonlinear installed-cost figures; smaller systems cost more per kWp |
| `PERMITTED_DEVELOPMENT_KWP_CEILING_ENGLAND` | 4kWp | Fact | England only; Scotland/Wales have separate, unresearched thresholds |
| Regional generation multiplier | England 1.0 / Wales 0.93 / Scotland 0.85 / N.Ireland 0.85 | England: baseline. Scotland: Inference. Wales, N.Ireland: Assumption, extrapolated | No Wales/N.Ireland-specific figure was found; both extrapolated from Scotland's climate/latitude band |
| Open-Meteo tilt / performance ratio / assumed peak power | 35° / 0.86 / 4kWp | Assumption (all three) | Same near-optimal-UK-roof and system-loss assumptions used throughout |

### 4c. Electricity price resolution

```mermaid
flowchart TD
  E0{"User typed<br/>a rate?"}
  E1["Use as-is<br/>(top priority)"]
  E2{"Postcode<br/>given?"}
  E3["Static default:<br/>26.11p<br/>(Ofgem cap)"]
  E4["Octopus:<br/>postcode →<br/>GSP region"]
  E5{"Resolved<br/>OK?"}
  E6["Octopus: find<br/>current product<br/>(prefer exact<br/>'Flexible Octopus'<br/>name match)"]
  E7{"Found?"}
  E8["Octopus: fetch<br/>unit rate for<br/>product + region"]
  E9{"Resolved<br/>OK?"}
  E10["Live rate"]
  PriceFinal(["Final price<br/>(p/kWh)"])

  E0 -->|Yes| E1
  E0 -->|No| E2
  E2 -->|No| E3
  E2 -->|Yes| E4
  E4 --> E5
  E5 -->|No| E3
  E5 -->|Yes| E6
  E6 --> E7
  E7 -->|No| E3
  E7 -->|Yes| E8
  E8 --> E9
  E9 -->|No| E3
  E9 -->|Yes| E10
  E1 --> PriceFinal
  E3 --> PriceFinal
  E10 --> PriceFinal
```

**Key constants / behavior** (`calculator.js` L43, L888-1012):

| Item | Value | Tier | Note |
|---|---|---|---|
| `ELECTRICITY_PRICE_PENCE_PER_KWH_DEFAULT` | 26.11p | Fact (default) | Ofgem price cap, Direct Debit standard variable tariff, 1 Jul-30 Sep 2026, changes quarterly |
| Live Octopus rate | varies by region | Inference | Confirmed end-to-end via a direct-HTTP test across 4 real UK regions (25 Jul 2026); see `calculator.js`'s comment on `OCTOPUS_BASE_URL` for the two bugs found and fixed during that test |
| Product-selection rule | exact "Flexible Octopus" name match, else most-recent `available_from` among filtered candidates | N/A | Candidates exclude green/tracker/prepay/business/restricted/expired products |
| Why Octopus's rate stands in for any supplier | N/A | Fact, empirically checked | 5 real (supplier, region) pairs landed within ~0.03p/kWh of Ofgem's regional cap; standard-variable tariffs are regulatorily pinned to the cap, unlike SEG export rates |

### 4d. SEG export rate resolution (UI-layer logic)

```mermaid
flowchart TD
  S0{"User typed a<br/>manual rate?"}
  S1["Use as-is"]
  S2{"Which SEG<br/>choice?"}
  S3["Look up supplier's<br/>rows: Fixed-rate<br/>sorted first"]
  S4{"Match<br/>found?"}
  S5["Use that tariff's<br/>rate + label"]
  S6["Default: 3.01p"]
  S7["User picks a row<br/>from the 30-tariff<br/>table"]
  SEGFinal(["Final SEG<br/>rate (p/kWh)"])

  S0 -->|Yes| S1
  S0 -->|No| S2
  S2 -->|"Same supplier"| S3
  S3 --> S4
  S4 -->|Yes| S5
  S4 -->|No| S6
  S2 -->|"Different"| S7
  S2 -->|"Don't know"| S6
  S1 --> SEGFinal
  S5 --> SEGFinal
  S7 --> SEGFinal
  S6 --> SEGFinal
```

For the "different supplier" choice, a manually typed rate overrides the table selection if
both are filled in. Either resolution path also carries the picked row's eligibility text (e.g.
"requires system installed by that same supplier") into the final result; see §5.

**Key constants** (`calculator.js` L81-173):

| Item | Value | Tier | Note |
|---|---|---|---|
| `SEG_RATE_PENCE_PER_KWH_DEFAULT` | 3.01p | Inference | Median of the 10 tariffs in `SEG_TARIFFS` explicitly "open to anyone, no switch needed" |
| `SEG_TARIFFS` table | 30 rows, £1.00-25.00p, named supplier/tariff/eligibility/source | Mixed, see table | User-provided CSV (23 Jul 2026); 9 rows spot-checked directly (2 confirmed Fact, e.g. Octopus's own "Outgoing Octopus" and "Smart Export Guarantee"; 7 turned up real mismatches, e.g. Ofgem's SEG register lists licensee names only, never rates); 21 rows still unchecked. Full per-row detail in `calculator.js`, not reproduced here. |
| Fixed-first sort rule | N/A | N/A | A structured field (`rateType`), not a parsed guess. It surfaced a real issue where the numerically-highest row (Octopus's "Intelligent Octopus Flux") isn't actually a flat quotable rate |

### 4e. Core formula

```mermaid
flowchart TD
  F1["selfConsumed =<br/>min(generation x<br/>rate, consumption)"]
  F2["exported =<br/>generation −<br/>selfConsumed"]
  F3["savings =<br/>(selfConsumed x price<br/>+ exported x SEG) / 100"]
  F4["payback =<br/>systemCost / savings"]
  F5{"payback<br/>≤ 8?"}
  F6{"payback<br/>≤ 13?"}
  Green(["green"])
  Amber(["amber"])
  Red(["red"])

  F1 --> F2
  F2 --> F3
  F3 --> F4
  F4 --> F5
  F5 -->|Yes| Green
  F5 -->|No| F6
  F6 -->|Yes| Amber
  F6 -->|No| Red
```

**Key constants** (`calculator.js` L335-345):

| Constant | Value | Tier | Note |
|---|---|---|---|
| `SELF_CONSUMPTION_RATE` | usually-home 0.55 / usually-out 0.30 | Prototype simplification, not independently researched | Modeled from occupancy as a rough two-tier proxy. `grounding-research.md` names self-consumption rate as a real sensitivity factor but doesn't supply a researched percentage |
| `ROOFTOP_PAYBACK_THRESHOLDS` | green ≤8yr, amber ≤13yr | Design judgment, not cited | Loosely anchored to `grounding-research.md`'s reported "roughly 6-14 years across sources" range, not a regulator or industry-body standard |

---

## 5. What comes back alongside the number

Every result carries an `assumptions` object naming each input's resolved value, confidence
tier, and a plain-language note, so a user (or a future reviewer) can see exactly which parts
of a given result are Fact-backed vs. Assumption-backed, not just the final figure. This is
sourcing-confidence detail: intended as a collapsible "read it if you want it" section below
the headline numbers (payback, annual savings, system cost), not something that needs to
interrupt anyone by default.

Rooftop results also carry a `flags` array: situational, always-worth-surfacing callouts,
distinct from `assumptions` in kind, not just placement: `assumptions` explains how confident a
*number* is, `flags` tells the user about a *condition attached to this specific result* that
the number alone doesn't convey. Each entry is `{ id, tier, title, note }`. Three are
unconditional (every rooftop result gets them, since no input this calculator collects tells it
whether a property is leasehold, listed, or in a conservation area, deliberately not adding new
inputs just to gate these):

| id | Trigger | Tier | What it says |
|---|---|---|---|
| `permittedDevelopment` | Roof-area-derived system exceeds England's 4kWp Permitted Development ceiling | Fact | May need planning permission for a system this size |
| `tenancyConsent` | Always | Fact | Leaseholders generally need freeholder consent for exterior alterations; renters should check with their landlord; standard UK leasehold law, not resolved by this tool |
| `listedBuilding` | Always | Fact | Listed buildings have zero Permitted Development rights for solar at any size. The `permittedDevelopment` flag above only checks size, not listed status |
| `conservationArea` | Always | Inference | Street-visible panels in a conservation area may need planning permission even under the size ceiling |
| `regulatoryRegime` | Postcode resolves to Scotland or Wales | Fact | That country's own permitted-development/building-regulation regime hasn't been researched here |
| `highExportSensitivity` | No user-picked SEG tariff, and exported share of generation exceeds 50% | Inference | This result uses the low default SEG rate; a high-export household's result moves more than most when a real (much higher) tariff is picked |

Rooftop results additionally carry, when applicable: `postcodeLookup`, `openMeteoLookup`,
`electricityPriceLookup` (each `{ ok, error? }`, so a failed live lookup is visible rather than
silently masked by its fallback) and `roofAreaSizing`.

Separately, when a SEG rate comes from a specific named tariff (either the "same as my import
supplier" lookup or a manually-picked row from the full table), that tariff's eligibility text
(e.g. "requires system installed by that same supplier") is folded into
`assumptions.segRatePencePerKwh.note`, not just shown in the picker UI, so the condition
attached to the picked rate survives into the calculated result instead of getting lost between
the two.

---

## 6. Simplifications already flagged in the code

Pulled from `calculator.js`'s own comments, not new critique. Worth having in one place for
the next review pass to weigh in on:

- **Self-consumption rate** is a rough two-tier occupancy proxy (0.55 / 0.30), not an
  independently researched behavioral figure.
- **Plug-in generation and kit cost** are the weakest-sourced figures in the calculator. No
  government, MCS, or established consumer-body source for either.
- **Plug-in orientation multiplier** stacks one Assumption on another: it borrows rooftop's
  own east/west and north ratios because no plug-in-specific orientation data exists at all.
- **East/west and north-facing rooftop generation** figures are a prototype-only proportional
  estimate, not independently researched the way the south-facing figure is.
- **Payback thresholds** (both segments) are a design judgment loosely anchored to the
  researched payback range, not a cited industry or regulatory standard.
- **21 of 30 rows** in the SEG tariff table are still unverified against their named source.
- **Wales and Northern Ireland** regional generation multipliers are extrapolated from
  Scotland's climate/latitude band, not independently found.
- **Scotland and Wales** permitted-development/building-regulation regimes for solar are
  flagged as unresearched, not silently assumed equivalent to England's.
