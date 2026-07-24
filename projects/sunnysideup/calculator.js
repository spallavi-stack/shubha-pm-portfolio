/**
 * SunnySideUp viability calculator — core scoring logic.
 *
 * Every constant below is commented with its confidence tier and source,
 * matching the Fact/Inference/Assumption discipline in grounding-research.md.
 * This is a simplified prototype model, not a certified solar-yield or
 * financial-advice calculation. Self-consumption in particular is modeled
 * from occupancy pattern as a rough two-tier proxy — that specific mapping
 * was not independently researched and is a prototype-only simplification,
 * flagged in the assumptions output rather than presented as researched.
 *
 * WHY EACH VALUE IS SOURCED THE WAY IT IS: every input in this file falls
 * into one of three sourcing strategies, chosen deliberately per input, not
 * uniformly:
 *   1. Live-fetched with a static fallback — used where a free, no-auth
 *      public API exists AND the value is either genuinely location-
 *      specific (postcodes.io, Open-Meteo) or regulatorily pinned to a
 *      single trackable figure (the Octopus-fetched electricity price, a
 *      proxy for the Ofgem price cap — see the reasoning above OCTOPUS_BASE_URL).
 *   2. A static, dated, per-provider table — used where the underlying
 *      value is genuinely discretionary per supplier, with no regulatory
 *      ceiling or live source to proxy it through (SEG_TARIFFS: suppliers
 *      set export rates as a commercial choice, unlike price-cap-tracked
 *      import rates, so there's nothing analogous to fetch live).
 *   3. A static Assumption-tier constant — used where no live, public,
 *      anonymous data source exists at all, for anyone (system install
 *      cost, plug-in kit cost/generation, self-consumption behavior,
 *      payback thresholds) — see each constant's own comment for why.
 * This isn't one blanket policy because the three categories of input are
 * genuinely different problems; treating them identically would mean either
 * inventing a live source that doesn't exist, or leaving a fetchable value
 * needlessly static.
 */

// --- Constants -------------------------------------------------------------

// [Fact] Ofgem price cap, Direct Debit standard variable tariff, 1 Jul-30 Sep
// 2026. grounding-research.md §Electricity price. Time-sensitive (changes
// quarterly), and applies only to default/standard-variable tariffs — many
// households are on a fixed deal above or below it, per the same section.
// Used as a DEFAULT only; calculateRooftopViability accepts a real
// electricityPricePencePerKwh from the user and prefers it when given.
const ELECTRICITY_PRICE_PENCE_PER_KWH_DEFAULT = 26.11;

// WHY A STATIC TABLE HERE, NOT A LIVE FETCH LIKE THE ELECTRICITY PRICE
// BELOW: SEG export rates are a genuine commercial choice each supplier
// makes independently — unlike standard-variable *import* rates, they're
// not tied to a single regulatory ceiling, so there's no equivalent of "the
// cap" to fetch live as a trustworthy stand-in for every supplier at once
// (see the reasoning above OCTOPUS_BASE_URL for that mechanism, which
// doesn't apply here). Octopus's own SEG tariffs specifically could in
// principle be fetched the same way their import rate is — their public
// API does expose export tariffs too — but that would only ever cover one
// supplier's rows in a 30-row table spanning many suppliers, not solve the
// table as a whole, so it wasn't worth a second, narrower live-fetch path
// alongside this one. A static, dated, per-supplier table is the only
// approach that captures the real spread between suppliers, at the cost of
// going stale between updates — the same tradeoff SEG_TARIFFS already
// documents below.
//
// [User-provided, 23 July 2026, partially spot-checked 23 Jul 2026] A named
// supplier/tariff SEG rate table for Q2-Q3 2026, supplied by the user as a
// CSV export, each row citing a named source (e.g. "Ofgem SEG Licensee
// Register," a supplier's own export-tariff page, or a third-party
// comparison/league-table site). Named sourcing is real and worth more than
// an anonymous number. Nine rows (the ones citing Ofgem's SEG Licensee
// Register, Octopus Energy's own pages, and British Gas's own page) have
// since been spot-checked directly against those named sources — see each
// row's own comment for what was actually confirmed. Two came back clean
// Facts (Outgoing Octopus, Octopus's base SEG tariff); the rest turned up
// real mismatches worth reading before trusting: Ofgem's register lists
// licensee names only, never rates, so it can't be the actual source for
// any of the three rows citing it; British Gas's "Export & Earn Plus" no
// longer exists under that name on their current page; Intelligent Octopus
// Flux isn't a flat rate. The remaining 21 rows (of 30 total; Solar Energy
// UK's League Table, Uswitch's guide) are still unchecked — same caution as
// before applies to those specifically. Sorted highest to lowest rate. Tariffs
// requiring a supplier switch or an install through that specific company
// are named as such — collapsing this into one number would hide a real
// eligibility bar most users won't clear on day one.
const SEG_TARIFFS = [
  { supplier: 'Good Energy', tariff: 'Solar Savings Exclusive', ratePencePerKwh: 25.0, rateType: 'Fixed', eligibility: 'Good Energy import customer + system installed by Good Energy', source: 'Solar Energy UK SEG League Table' },
  // [MISMATCH — checked 23 Jul 2026] octopus.energy's own Intelligent Octopus
  // Flux and Flux pages, fetched directly, state no single flat rate — export
  // pricing is peak/off-peak and/or postcode-specific via a live rate
  // checker, and one live page currently shows the tariff "temporarily
  // unavailable" due to market volatility. A flat 23.0p doesn't match how
  // Octopus actually prices this tariff; treat as unconfirmed, not Fact.
  { supplier: 'Octopus Energy', tariff: 'Intelligent Octopus Flux', ratePencePerKwh: 23.0, rateType: 'Smart/Variable', eligibility: 'Octopus import customer with compatible solar + battery setup', source: 'Octopus Energy Export Tariffs (checked 23 Jul 2026: no flat rate stated — peak/off-peak and postcode-variable; currently shown unavailable)' },
  { supplier: 'OVO Energy', tariff: 'SEG Install Exclusive', ratePencePerKwh: 20.0, rateType: 'Variable', eligibility: 'OVO import customer + system bought through OVO', source: 'Solar Energy UK SEG League Table' },
  { supplier: 'So Energy', tariff: 'So Bright', ratePencePerKwh: 20.0, rateType: 'Fixed', eligibility: 'Installed solar/battery via So Energy (no import switch needed)', source: 'Uswitch Solar Export Guide' },
  { supplier: 'EDF Energy', tariff: 'Export Exclusive 12m V3', ratePencePerKwh: 18.0, rateType: 'Fixed', eligibility: 'EDF import customer + system installed by EDF / Contact Solar', source: 'Solar Energy UK SEG League Table' },
  { supplier: 'E.ON Next', tariff: 'Next Export Premium v3', ratePencePerKwh: 17.5, rateType: 'Fixed', eligibility: 'E.ON import customer + system installed by E.ON', source: 'Solar Energy UK SEG League Table' },
  // [MISMATCH — checked 23 Jul 2026, twice via direct fetch] britishgas.co.uk's
  // current SEG tariff page contains neither "Export & Earn Plus" nor "15.1"
  // anywhere (confirmed via explicit string search on two separate fetches).
  // Current live tariffs are named differently: "Export Premium" (12p/kWh,
  // systems <=15kW, BG electricity customers) and "Export Extra" (8p/kWh,
  // >15kW). Reads as a real rename/restructure since the CSV was compiled,
  // not a stale-but-still-accurate figure. Left unchanged rather than
  // silently replaced — the name and rate would both need revisiting.
  { supplier: 'British Gas', tariff: 'Export & Earn Plus', ratePencePerKwh: 15.1, rateType: 'Variable', eligibility: 'British Gas electricity import customer', source: 'britishgas.co.uk (checked 23 Jul 2026): name/rate not found — closest current match is "Export Premium" at 12p' },
  { supplier: 'EDF Energy', tariff: 'Export 12m', ratePencePerKwh: 15.0, rateType: 'Fixed', eligibility: 'EDF electricity import customer', source: 'Uswitch Solar Export Guide' },
  { supplier: 'Good Energy', tariff: 'Solar Savings', ratePencePerKwh: 15.0, rateType: 'Variable', eligibility: 'Good Energy electricity import customer', source: 'Solar Energy UK SEG League Table' },
  { supplier: 'ScottishPower', tariff: 'SmartGen Premium Plus', ratePencePerKwh: 15.0, rateType: 'Variable', eligibility: 'ScottishPower import customer + system installed by ScottishPower', source: 'Solar Energy UK SEG League Table' },
  { supplier: 'E.ON Next', tariff: 'Next Export Exclusive v3', ratePencePerKwh: 13.0, rateType: 'Fixed', eligibility: 'E.ON electricity import customer', source: 'Uswitch Solar Export Guide' },
  // [MISMATCH — checked 23 Jul 2026] Ofgem's SEG Licensee Register
  // (ofgem.gov.uk/guidance/smart-export-guarantee-supplier-list, fetched
  // directly) lists only which suppliers hold an SEG licence, never rates —
  // it cannot be this row's actual rate source for any supplier. Separately,
  // "100Green" doesn't appear on the current (Apr 2026-Mar 2027) register
  // under that name or its known legal name "Green Energy (UK) Ltd" — its
  // SEG-licensee status itself is unconfirmed, not just the rate.
  { supplier: '100Green', tariff: 'Export Tariff', ratePencePerKwh: 12.0, rateType: 'Variable', eligibility: '100Green electricity import customer', source: 'Ofgem SEG Licensee Register (checked 23 Jul 2026: name-only, no rates published; 100Green not found on current list)' },
  // [Fact — confirmed 23 Jul 2026] octopus.energy/smart/outgoing/, fetched
  // directly, states this flat rate explicitly: "get paid a flat rate when
  // you generate more power than you use," 12p/kWh.
  { supplier: 'Octopus Energy', tariff: 'Outgoing Octopus', ratePencePerKwh: 12.0, rateType: 'Fixed', eligibility: 'Octopus electricity import customer', source: 'octopus.energy/smart/outgoing/ (fetched directly, 23 Jul 2026)' },
  { supplier: 'OVO Energy', tariff: 'SEG Beyond Exclusive', ratePencePerKwh: 12.0, rateType: 'Fixed', eligibility: "OVO import customer on 'OVO Beyond' plan", source: 'Uswitch Solar Export Guide' },
  { supplier: 'ScottishPower', tariff: 'SmartGen Premium', ratePencePerKwh: 12.0, rateType: 'Variable', eligibility: 'ScottishPower electricity import customer', source: 'Solar Energy UK SEG League Table' },
  // [MISMATCH — checked 23 Jul 2026] Same Ofgem register as above, fetched
  // directly: confirms "Fuse Energy Supply Limited" is a real, current
  // mandatory SEG licensee, but the register lists names only, never rates.
  // The 10.0p figure itself is unverified by this citation.
  { supplier: 'Fuse Energy', tariff: 'Fuse Export', ratePencePerKwh: 10.0, rateType: 'Variable', eligibility: 'Fuse Energy electricity customer', source: 'Ofgem SEG Licensee Register (checked 23 Jul 2026: confirms Fuse Energy is a real licensee, but lists no rates)' },
  // [Assumption — checked 23 Jul 2026, not confirmable as a single figure]
  // Octopus's own pages describe Agile Outgoing as dynamic (half-hourly,
  // tracks wholesale prices) with no single stated rate to check against —
  // there's no primary "the rate is X.Xp" figure to fetch. A secondary
  // aggregator's calculated year-average (Apr 2025-Apr 2026) came out to
  // ~9.4p, close to but not an exact primary match for this row's 9.1p.
  // Left as Assumption; any flat figure is inherently an approximation here.
  { supplier: 'Octopus Energy', tariff: 'Outgoing Agile', ratePencePerKwh: 9.1, rateType: 'Wholesale Variable', eligibility: 'Octopus import customer (tracks 30-min market rates)', source: 'Octopus Energy Export Tariffs (checked 23 Jul 2026: inherently dynamic, no single primary rate to verify — secondary year-average ~9.4p)' },
  { supplier: 'Utility Warehouse', tariff: 'UW SEG – Bundle', ratePencePerKwh: 8.0, rateType: 'Variable', eligibility: 'UW import customer bundling 2+ additional services', source: 'Solar Energy UK SEG League Table' },
  { supplier: 'E.ON Next', tariff: 'Next Flex Export v1', ratePencePerKwh: 6.0, rateType: 'Variable', eligibility: 'Open to non-customers / E.ON import customers', source: 'Uswitch Solar Export Guide' },
  { supplier: 'ScottishPower', tariff: 'SmartGen', ratePencePerKwh: 6.0, rateType: 'Variable', eligibility: 'Open to anyone (no switch needed)', source: 'Solar Energy UK SEG League Table' },
  { supplier: 'EDF Energy', tariff: 'SEG Export Variable Value', ratePencePerKwh: 5.6, rateType: 'Variable', eligibility: 'EDF residential SEG customers', source: 'Solar Energy UK SEG League Table' },
  { supplier: 'So Energy', tariff: 'So Export Flex', ratePencePerKwh: 4.5, rateType: 'Variable', eligibility: 'Open to anyone (no switch needed)', source: 'Uswitch Solar Export Guide' },
  // [Fact — confirmed 23 Jul 2026] octopus.energy/smart/smart-export-guarantee/,
  // fetched directly, states 4.1p/kWh flat, open to export-only customers
  // (no Octopus import switch required) — matches.
  { supplier: 'Octopus Energy', tariff: 'Smart Export Guarantee', ratePencePerKwh: 4.1, rateType: 'Fixed', eligibility: 'Open to anyone (no switch needed)', source: 'octopus.energy/smart/smart-export-guarantee/ (fetched directly, 23 Jul 2026)' },
  { supplier: 'OVO Energy', tariff: 'Standard SEG', ratePencePerKwh: 4.0, rateType: 'Variable', eligibility: 'Open to anyone (no switch needed)', source: 'Uswitch Solar Export Guide' },
  // [Assumption — partially checked 23 Jul 2026] britishgas.co.uk's current
  // page has no tariff literally named "Standard SEG," but "Export SEG"
  // (non-British Gas customers) pays 3p/kWh — close enough to this row's
  // 3.02p to plausibly be the same tariff renamed, though not an exact name
  // match. Rate is essentially confirmed; the name is not.
  { supplier: 'British Gas', tariff: 'Standard SEG', ratePencePerKwh: 3.02, rateType: 'Variable', eligibility: 'Open to anyone (no switch needed)', source: 'britishgas.co.uk (checked 23 Jul 2026): rate close to current "Export SEG" (3p); tariff name doesn\'t match exactly' },
  { supplier: 'EDF Energy', tariff: 'SEG Export Variable', ratePencePerKwh: 3.0, rateType: 'Variable', eligibility: 'Open to anyone (no switch needed)', source: 'Uswitch Solar Export Guide' },
  { supplier: 'Utilita', tariff: 'Smart Export Guarantee', ratePencePerKwh: 3.0, rateType: 'Variable', eligibility: 'Open to anyone (no switch needed)', source: 'Uswitch Solar Export Guide' },
  { supplier: 'Utility Warehouse', tariff: 'UW SEG – Standard', ratePencePerKwh: 2.0, rateType: 'Variable', eligibility: 'Open to anyone (no switch needed)', source: 'Uswitch Solar Export Guide' },
  // [MISMATCH — checked 23 Jul 2026] Same Ofgem register, fetched directly:
  // confirms "Foxglove Energy Supply Limited" — Outfox Energy's registered
  // legal/trading name — as a real, current mandatory SEG licensee, but
  // again the register lists names only, never rates. The 1.05p figure
  // itself is unverified by this citation.
  { supplier: 'Outfox Energy', tariff: 'Outfox Export', ratePencePerKwh: 1.05, rateType: 'Variable', eligibility: 'Open to anyone (no switch needed)', source: 'Ofgem SEG Licensee Register (checked 23 Jul 2026: confirms Foxglove Energy Supply Ltd, Outfox\'s legal name, is a real licensee, but lists no rates)' },
  { supplier: 'E (Gas & Electricity)', tariff: 'SEG Tariff', ratePencePerKwh: 1.0, rateType: 'Variable', eligibility: 'Open to anyone (no switch needed)', source: 'Uswitch Solar Export Guide' },
];

// [Inference, drawn from the table above] A realistic no-commitment default:
// the median rate among tariffs explicitly "open to anyone, no switch
// needed" (the baseline a household gets without switching supplier or
// installing through a specific company). This replaces the old flat 15p
// guess, which sat far above what an uncommitted household would actually
// receive — most of the higher rates above require a real eligibility step.
// Corrected 24 Jul 2026: the 10 qualifying rows (§SEG_TARIFFS above) are
// [1.0, 1.05, 2.0, 3.0, 3.0, 3.02, 4.0, 4.1, 4.5, 6.0]p; the true median
// (mean of the 5th and 6th values) is 3.01p. The constant previously read
// 4.0p, nearer the 70th percentile than the 50th, contradicting its own
// "median" label — fixed to actually match it.
const SEG_RATE_PENCE_PER_KWH_DEFAULT = 3.01;

// [Assumption — wide range, no single authoritative figure] Typical UK
// domestic rooftop system cost estimates range £5,500-£8,700; £7,000 is
// close to MCS's 2025 average. grounding-research.md §System cost, size, and generation.
const ROOFTOP_SYSTEM_COST_GBP = 7000;

// [Assumption, same section] Annual generation for a 4kW south-facing system
// is commonly cited around 3,400-4,200kWh/year; 3,800 is a midpoint.
// East/west and north-facing figures below are NOT independently researched —
// they're a prototype-only proportional estimate, flagged in assumptions output.
const ROOFTOP_ANNUAL_GENERATION_KWH = {
  southFacing: 3800, // within researched 3,400-4,200kWh/yr range
  eastWestFacing: 3000, // prototype estimate only, not independently researched
  northFacing: 1900, // prototype estimate only, not independently researched
};

// [Inference — WebSearch findings, 24 Jul 2026, not independently fetched
// against a primary source] UK regional solar irradiance varies enough to
// matter: general figures put South England around 900-1,100kWh/kW/yr and
// Scotland around 850-900kWh/kW/yr. A separate specific London/Brighton/
// Glasgow example found in the same search implied somewhat different
// per-kW figures than that general range — the two sources don't fully
// agree, which is why this is Inference, not Fact. ROOFTOP_ANNUAL_GENERATION_KWH
// above is treated as the England baseline (multiplier 1.0). Wales and
// Northern Ireland have no figure found in this search at all; both are
// extrapolated from Scotland's climate/latitude band, which is a weaker
// claim than the England/Scotland split itself and flagged as such below.
const REGIONAL_GENERATION_MULTIPLIER = {
  England: { value: 1.0, tier: 'Baseline', note: 'ROOFTOP_ANNUAL_GENERATION_KWH figures above are themselves England-calibrated; this is the reference point, not a separate finding.' },
  Wales: { value: 0.93, tier: 'Assumption — extrapolated, not independently found', note: 'No Wales-specific figure found; placed between England and Scotland as a geographic estimate only.' },
  Scotland: { value: 0.85, tier: 'Inference', note: 'General researched range ~850-900kWh/kW/yr vs England ~900-1,100kWh/kW/yr; low end of that ratio used. A separate specific-city example in the same research did not fully agree with this general range.' },
  'Northern Ireland': { value: 0.85, tier: 'Assumption — extrapolated, not independently found', note: "No Northern Ireland-specific figure found; assumed similar to Scotland's climate/latitude band." },
};

// Scotland and Wales have differing permitted-development/building-regulation
// regimes for solar installations that this prototype has not researched in
// depth (grounding-research.md flags this explicitly). Surfaced as a flag,
// not folded silently into the generation number.
const REGIONS_WITH_UNRESEARCHED_REGULATORY_REGIME = {
  Scotland: 'Scotland has its own permitted-development and building-regulation regime for solar installations, separate from England and Wales, which this prototype has not researched in depth. Check with your local authority before relying on this result for a Scottish address.',
  Wales: 'Wales has its own permitted-development regime for solar installations, separate from England, which this prototype has not researched in depth. Check with your local authority before relying on this result for a Welsh address.',
};

// [Assumption — "the weakest data in this document," per grounding-research.md
// §Plug-in/balcony solar cost and generation]. Kit cost reported £400-900,
// generation 640-900kWh/year. Midpoints used below; treat outputs from this
// segment as the least reliable in the calculator, and say so to the user.
const PLUGIN_KIT_COST_GBP = 650;
const PLUGIN_ANNUAL_GENERATION_KWH = 770;

// Prototype-only simplification, not independently researched: self-consumption
// rate modeled from occupancy as a rough two-tier proxy. grounding-research.md's
// Payback period section names self-consumption rate as a real sensitivity
// factor but does not supply a specific researched percentage.
const SELF_CONSUMPTION_RATE = {
  usuallyHome: 0.55,
  usuallyOut: 0.30,
};

// Payback thresholds for green/amber/red. Not a cited figure — a design
// judgment loosely anchored to grounding-research.md's own reported payback
// range ("roughly 6-14 years across sources" for rooftop), not a regulator
// or industry-body standard.
const ROOFTOP_PAYBACK_THRESHOLDS = { green: 8, amber: 13 };
const PLUGIN_PAYBACK_THRESHOLDS = { green: 5, amber: 8 };

// [Fact] SI 2026/848 legal status, verified directly against legislation.gov.uk.
// grounding-research.md §Plug-in / balcony solar.
const PLUGIN_LEGAL_STATUS = {
  electricianInstall: { legal: true, since: '2026-04-15', basis: 'BS 7671 Amendment 4' },
  diySelfInstall: {
    legal: false,
    becomesLegal: '2026-08-27',
    basis: 'SI 2026/848',
    note: 'Made and dated, but not yet in force as of this check.',
  },
  tenancyConsent: {
    status: 'unresolved',
    note: "The Renters' Rights Act 2025 has no provision on this either way. Whether your specific tenancy agreement requires landlord permission is a separate question this check cannot resolve.",
  },
};

// --- Scoring helpers ---------------------------------------------------------

function scoreStatus(paybackYears, thresholds) {
  if (paybackYears <= thresholds.green) return 'green';
  if (paybackYears <= thresholds.amber) return 'amber';
  return 'red';
}

/** Returns SEG_TARIFFS, already sorted highest to lowest rate. For a UI to build a picker from. */
function getSegTariffs() {
  return SEG_TARIFFS;
}

/** Looks up a specific tariff's rate and eligibility by supplier + tariff name. Returns undefined if not found. */
function findSegTariff(supplier, tariff) {
  return SEG_TARIFFS.find((t) => t.supplier === supplier && t.tariff === tariff);
}

/**
 * Returns SEG_TARIFFS rows for a given supplier, sorted with fixed-rate
 * tariffs first (then highest rate first within each group). For the "same
 * as my current import supplier" SEG choice: this shows what that
 * supplier's own SEG tariffs are, WITHOUT filtering by whether the
 * eligibility text requires more than just being an existing import
 * customer (e.g. some rows also require the system being installed by that
 * same supplier, which isn't guaranteed just because someone already gets
 * their electricity from them). Deliberately not auto-filtered further than
 * that — parsing free-text eligibility strings to decide "achievable
 * without switching install company" reliably would be fragile and could
 * silently misclassify a row; showing the real eligibility text and letting
 * the person judge it themselves is the same pattern the tariff dropdown
 * already uses elsewhere in this file. Fixed-rate IS prioritized over a
 * pure highest-rate sort, though, because that's a structured field (rateType),
 * not free text, and sorting by raw rate alone surfaced a real problem:
 * Octopus's "Intelligent Octopus Flux" row (rateType "Smart/Variable") has
 * the highest listed number but its own source note says it isn't a flat
 * rate and is "currently shown unavailable" — a Fixed tariff several rows
 * down is the more honest "best" pick for a single quoted number.
 */
function findSegTariffsBySupplier(supplier) {
  return SEG_TARIFFS.filter((t) => t.supplier === supplier).sort((a, b) => {
    if (a.rateType === 'Fixed' && b.rateType !== 'Fixed') return -1;
    if (a.rateType !== 'Fixed' && b.rateType === 'Fixed') return 1;
    return b.ratePencePerKwh - a.ratePencePerKwh;
  });
}

// --- Annual consumption estimator ---------------------------------------------

// WHY THIS DATA SOURCE: household electricity consumption before someone
// has ever seen a bill (i.e. before installing solar, most people haven't
// looked closely at their annual kWh) has no live-fetchable source — no
// public API tells you "a 3-person household with a heat pump uses X kWh."
// This is category 3 from the top-of-file note: a static, sourced estimate
// built from the best available research, not a live fetch or a per-
// supplier table. Full sourcing trail: grounding-research.md §Household
// electricity consumption — TDCV, heat pumps, EVs (24 July 2026).
//
// [Fact — direct primary-source fetch of Ofgem's own TDCV decision PDF, 24
// July 2026] Standard single-rate-meter electricity TDCV, effective 1 July
// 2026: low 1,600 / medium 2,500 / high 3,800 kWh/year. Ofgem's own
// household-size description for each band (corroborated across multiple
// sources, not read verbatim on an Ofgem page despite three attempts): low
// = flat/1-bed, 1-2 people; medium = 2-3 bed, 2-3 people; high = 4+ bed,
// 4-5 people. Ofgem's own bands overlap at the edges (low says "1-2 people,"
// medium says "2-3 people" — 2 people fits both descriptions); Ofgem
// doesn't publish a strict occupant-count formula, only illustrative
// examples. The boundary rule below (household size 1-2 -> low, 3 ->
// medium, 4+ -> high) is this calculator's own tie-breaking choice, not an
// Ofgem rule — flagged here so it isn't mistaken for an official cutoff.
const TDCV_ELECTRICITY_KWH_BY_BAND = {
  low: { value: 1600, description: 'flat or 1-bedroom house, 1-2 people' },
  medium: { value: 2500, description: '2-3 bedroom house, 2-3 people' },
  high: { value: 3800, description: '4+ bedroom house, 4-5 people' },
};

function tdcvBandForHouseholdSize(householdSize) {
  if (householdSize <= 2) return 'low';
  if (householdSize === 3) return 'medium';
  return 'high'; // 6+ is extrapolated beyond Ofgem's own stated "4-5 people" high-band description
}

// [Inference — calculated, not a single published figure, 24 July 2026] No
// body (MCS, Heat Pump Association, DESNZ, Energy Saving Trust) publishes a
// headline "UK heat pump uses X kWh/year" figure — checked directly and
// confirmed absent. This is the most defensible estimate buildable from
// what does exist: DESNZ's own field trial of 742 monitored UK
// installations measured a median Seasonal Performance Factor of 2.78
// (heat output ÷ electricity input); a named Energy Saving Trust modelling
// assumption puts average UK home heat demand at ~12,000kWh/year. 12,000 ÷
// 2.78 ≈ 4,317, rounded to 4,300. Presented as a calculation built from two
// real sources, not a citation of a single authoritative number, because no
// such number exists to cite.
const HEAT_PUMP_ANNUAL_KWH_ESTIMATE = 4300;

// [Inference — calculated, not a single published figure, 24 July 2026] Two
// of the three inputs are now Fact-tier, directly fetched: DfT's National
// Travel Survey 2024 gives 8,900 miles/year average annual mileage
// specifically for battery-electric cars; Zap-Map's own 2024 EV Charging
// Survey states home charging covers 85% of a typical home-charging
// driver's needs. No government or industry body publishes a real-world
// miles/kWh efficiency figure, so that piece stays Assumption-tier
// (commercial-site convergence only, ~3.5-4.3 mi/kWh). 8,900 ÷ 3.5-4.3 ≈
// 2,070-2,543 kWh/year total; × 85% home-charging share ≈ 1,759-2,161
// kWh/year charged at home. Midpoint used below as the per-vehicle working
// estimate.
const EV_ANNUAL_HOME_CHARGING_KWH_ESTIMATE = 1960;

/**
 * Estimates annual household electricity consumption from inputs someone
 * can actually answer without a bill in hand: household size, and whether
 * they have a heat pump and/or EV(s). A standalone helper, not baked into
 * calculateRooftopViability — call this first (if the person doesn't know
 * their exact annual consumption), then pass its totalKwh in as
 * annualConsumptionKwh. Keeps calculateRooftopViability itself simple and
 * pure, matching how postcode/live-price lookups are also kept as separate
 * wrapper logic rather than parameters baked into the core scoring function.
 * @param {Object} input
 * @param {number} input.householdSize - number of people living in the home
 * @param {boolean} [input.hasHeatPump]
 * @param {boolean} [input.hasEv]
 * @param {number} [input.evCount] - defaults to 1 if hasEv is true and this is omitted
 */
function estimateAnnualConsumptionKwh({ householdSize, hasHeatPump, hasEv, evCount }) {
  const band = tdcvBandForHouseholdSize(householdSize);
  const baseline = TDCV_ELECTRICITY_KWH_BY_BAND[band];
  const resolvedEvCount = hasEv ? evCount ?? 1 : 0;
  const heatPumpAddition = hasHeatPump ? HEAT_PUMP_ANNUAL_KWH_ESTIMATE : 0;
  const evAddition = resolvedEvCount * EV_ANNUAL_HOME_CHARGING_KWH_ESTIMATE;
  const totalKwh = baseline.value + heatPumpAddition + evAddition;

  const breakdown = {
    baseline: {
      value: baseline.value,
      tier: 'Fact',
      note: `Ofgem TDCV ${band} band (standard single-rate meter, effective 1 Jul 2026): ${baseline.description}. Household size ${householdSize} mapped to this band by this calculator's own tie-breaking rule, not an Ofgem-published cutoff.`,
    },
  };
  if (hasHeatPump) {
    breakdown.heatPump = {
      value: heatPumpAddition,
      tier: 'Inference',
      note: 'Derived from a DESNZ field-trial median efficiency figure (SPF 2.78, 742 monitored UK installations) and a named Energy Saving Trust heat-demand modelling assumption (~12,000kWh/yr) — a calculation, not a single published figure.',
    };
  }
  if (resolvedEvCount > 0) {
    breakdown.ev = {
      value: evAddition,
      tier: 'Inference',
      note: `Derived from DfT's National Travel Survey (8,900 miles/yr average for battery-electric cars) and Zap-Map's home-charging share (85%), combined with an Assumption-tier efficiency figure (no government source found; ~3.5-4.3mi/kWh commercial-site convergence). ${EV_ANNUAL_HOME_CHARGING_KWH_ESTIMATE}kWh/yr per vehicle x ${resolvedEvCount}.`,
    };
  }

  return { totalKwh: Math.round(totalKwh), breakdown };
}

// --- Rooftop calculator -------------------------------------------------------

/**
 * @param {Object} input
 * @param {'southFacing'|'eastWestFacing'|'northFacing'} input.orientation
 * @param {'usuallyHome'|'usuallyOut'} input.occupancy
 * @param {number} input.annualConsumptionKwh - household's own annual electricity use
 * @param {number} [input.electricityPricePencePerKwh] - the user's own known rate; takes precedence over electricityPriceOverride and the static default
 * @param {Object} [input.electricityPriceOverride] - a specific { value, tier, note } to use for the electricity price outright (e.g. a live-fetched current regional rate), used only if electricityPricePencePerKwh is omitted; falls back to the static Ofgem default if this is also omitted
 * @param {number} [input.segRatePencePerKwh] - a specific SEG tariff's rate, e.g. from findSegTariff(); falls back to the no-switch-needed baseline default if omitted
 * @param {string} [input.segTariffLabel] - "Supplier — Tariff name" for display, if segRatePencePerKwh came from a specific named tariff rather than a manually-typed number
 * @param {string} [input.segTariffSource] - the named source for that tariff row (e.g. "Ofgem SEG Licensee Register"), if available
 * @param {Object} [input.regionalGeneration] - a REGIONAL_GENERATION_MULTIPLIER entry, e.g. from calculateRooftopViabilityByPostcode()'s country-level fallback; omit to use the England-calibrated baseline unchanged. Ignored if generationOverride is also given.
 * @param {Object} [input.generationOverride] - a specific { value, tier, note } to use for generationKwh outright (e.g. a coordinate-precise weather-API estimate), taking precedence over regionalGeneration and the orientation-based default
 */
function calculateRooftopViability({
  orientation,
  occupancy,
  annualConsumptionKwh,
  electricityPricePencePerKwh,
  electricityPriceOverride,
  segRatePencePerKwh,
  segTariffLabel,
  segTariffSource,
  regionalGeneration,
  generationOverride,
}) {
  const baseGeneration = ROOFTOP_ANNUAL_GENERATION_KWH[orientation];
  const generation = generationOverride
    ? generationOverride.value
    : regionalGeneration
      ? Math.round(baseGeneration * regionalGeneration.value)
      : baseGeneration;
  const selfConsumptionRate = SELF_CONSUMPTION_RATE[occupancy];
  const selfConsumedKwh = Math.min(generation * selfConsumptionRate, annualConsumptionKwh);
  const exportedKwh = generation - selfConsumedKwh;

  const electricityPriceIsUserProvided = electricityPricePencePerKwh != null;
  const usedElectricityPrice = electricityPriceIsUserProvided
    ? electricityPricePencePerKwh
    : electricityPriceOverride
      ? electricityPriceOverride.value
      : ELECTRICITY_PRICE_PENCE_PER_KWH_DEFAULT;
  const usedSegRate = segRatePencePerKwh ?? SEG_RATE_PENCE_PER_KWH_DEFAULT;
  const segRateIsUserProvided = segRatePencePerKwh != null;

  const annualSavingsGbp = (selfConsumedKwh * usedElectricityPrice + exportedKwh * usedSegRate) / 100;

  const paybackYears = ROOFTOP_SYSTEM_COST_GBP / annualSavingsGbp;
  const status = scoreStatus(paybackYears, ROOFTOP_PAYBACK_THRESHOLDS);

  return {
    segment: 'rooftop',
    status,
    paybackYears: Math.round(paybackYears * 10) / 10,
    annualSavingsGbp: Math.round(annualSavingsGbp),
    systemCostGbp: ROOFTOP_SYSTEM_COST_GBP,
    generationKwh: generation,
    selfConsumedKwh: Math.round(selfConsumedKwh),
    exportedKwh: Math.round(exportedKwh),
    assumptions: {
      electricityPricePencePerKwh: electricityPriceIsUserProvided
        ? { value: usedElectricityPrice, tier: 'User-provided', note: 'Your own stated rate' }
        : electricityPriceOverride
          ? { value: usedElectricityPrice, tier: electricityPriceOverride.tier, note: electricityPriceOverride.note }
          : { value: usedElectricityPrice, tier: 'Fact (default)', note: "Ofgem price cap, Jul-Sep 2026, changes quarterly, and applies only to default/standard-variable tariffs — if you're on a fixed deal, enter your own rate for an accurate result" },
      segRatePencePerKwh: segRateIsUserProvided
        ? {
            value: usedSegRate,
            tier: 'User-provided',
            note: segTariffLabel
              ? `${segTariffLabel}${segTariffSource ? `, per ${segTariffSource}` : ''} (from the user-provided SEG tariff table, dated 23 July 2026)`
              : "Your own stated rate",
          }
        : {
            value: usedSegRate,
            tier: 'Assumption (default)',
            note: "The no-switch-needed baseline (median of tariffs open to anyone). Switching supplier or installing through a specific company can get a meaningfully higher rate, up to 25p/kWh in the researched tariff table — pick your actual tariff for an accurate result",
          },
      systemCostGbp: { value: ROOFTOP_SYSTEM_COST_GBP, tier: 'Assumption', note: 'Industry-consensus range is £5,500-£8,700; not a quote for your specific roof' },
      generationKwh: generationOverride
        ? { value: generation, tier: generationOverride.tier, note: generationOverride.note }
        : regionalGeneration
          ? { value: generation, tier: regionalGeneration.tier, note: `England-baseline figure (${baseGeneration}kWh/yr) adjusted by a ${regionalGeneration.value}x regional multiplier. ${regionalGeneration.note}` }
          : { value: generation, tier: orientation === 'southFacing' ? 'Assumption' : 'Prototype estimate, not independently researched', note: 'Researched range is 3,400-4,200kWh/yr for a south-facing 4kW system, England-calibrated. No postcode given, so no regional adjustment applied.' },
      selfConsumptionRate: { value: selfConsumptionRate, tier: 'Prototype simplification', note: 'Modeled from occupancy as a rough proxy, not an independently researched figure' },
    },
  };
}

// --- Postcode / regional lookup ----------------------------------------------

// [Fact — API contract, checked against public documentation, not live-called
// from this session (network-restricted); needs a live check from a browser
// or unrestricted session before being fully trusted] postcodes.io is a free,
// open, no-auth-required UK postcode lookup API. GET
// https://api.postcodes.io/postcodes/{postcode} returns { status, result:
// { postcode, country, region, admin_district, latitude, longitude, ... } }
// on success, or a non-200 status with an error body for an invalid/unknown
// postcode.
const POSTCODES_IO_BASE_URL = 'https://api.postcodes.io/postcodes/';

/**
 * Resolves a UK postcode to country/region/lat-long via postcodes.io.
 * Runs client-side (browser fetch), not from this repo's dev/CI environment.
 * @param {string} postcode
 * @returns {Promise<{ok: true, postcode: string, country: string, region: string|null, latitude: number, longitude: number} | {ok: false, error: string}>}
 */
async function lookupPostcodeRegion(postcode) {
  const cleaned = String(postcode || '').trim();
  if (!cleaned) {
    return { ok: false, error: 'No postcode entered.' };
  }
  const url = POSTCODES_IO_BASE_URL + encodeURIComponent(cleaned.replace(/\s+/g, ''));
  let response;
  try {
    response = await fetch(url);
  } catch (err) {
    return { ok: false, error: `Couldn't reach the postcode lookup service (${err.message}). Falling back to the England-calibrated default.` };
  }
  if (response.status === 404) {
    return { ok: false, error: `"${cleaned}" wasn't recognized as a valid UK postcode. Falling back to the England-calibrated default.` };
  }
  if (!response.ok) {
    return { ok: false, error: `The postcode lookup service returned an unexpected error (HTTP ${response.status}). Falling back to the England-calibrated default.` };
  }
  const body = await response.json();
  const result = body && body.result;
  if (!result) {
    return { ok: false, error: `"${cleaned}" wasn't recognized as a valid UK postcode. Falling back to the England-calibrated default.` };
  }
  return {
    ok: true,
    postcode: result.postcode,
    country: result.country,
    region: result.region || null,
    latitude: result.latitude,
    longitude: result.longitude,
  };
}

// [Fact — confirmed via live browser test, 24 July 2026] PVGIS was tried
// first for a coordinate-precise generation estimate and removed: it sends
// no Access-Control-Allow-Origin header, so a browser blocks the request
// with a CORS error regardless of calling origin — a permanent block for a
// pure static-site prototype with no backend server to proxy the request
// through, confirmed against a real request from a live browser.
//
// [Inference — corroborated by multiple independent secondary sources
// (Open-Meteo's own docs, a GitHub PR referencing them, two third-party
// Python client libraries), not fetched directly against Open-Meteo's own
// documentation, which this session's network policy blocks (HTTP 403,
// same as everywhere else). Confirmed working end to end via a live
// browser test (Chrome DevTools, 24 July 2026): a real London postcode
// resolved to 1,104.3kWh/m²/yr with no CORS error, landing in the same
// range this document's own separate research found for South England
// (900-1,100kWh/kW/yr) — a real cross-check, not just an absence of
// errors. That's one location/orientation confirmed, not an exhaustive
// test.] Open-Meteo's archive API returns hourly Global
// Tilted Irradiance (GTI, W/m²) for a given lat/lon/tilt/azimuth over a
// date range (same south=0/east=-90/west=90/north=±180 azimuth convention
// as PVGIS, per a GitHub PR quoting Open-Meteo's docs directly). Unlike
// PVGIS's PVcalc, this returns raw irradiance, not a ready annual-kWh
// figure for a system — converting one to the other uses a standard PV
// yield formula (annual generation kWh = annual in-plane irradiation
// kWh/m²/yr × system size kWp × performance ratio), the same approach
// PVGIS itself uses internally, not something invented for this project.
const OPEN_METEO_ARCHIVE_BASE_URL = 'https://archive-api.open-meteo.com/v1/archive';
const OPEN_METEO_TILT_ANGLE_DEGREES = 35; // [Assumption] same near-optimal UK roof tilt assumption used throughout this file
const OPEN_METEO_PERFORMANCE_RATIO = 0.86; // [Assumption] derived the same way as the earlier 14% system-loss figure (1 - 0.14); typical for a well-installed UK system, not a specific-system figure
const OPEN_METEO_ASSUMED_PEAK_POWER_KWP = 4; // [Assumption] matches the ~4kW system ROOFTOP_ANNUAL_GENERATION_KWH is calibrated to
const OPEN_METEO_AZIMUTH_BY_ORIENTATION = {
  southFacing: 0,
  // A single azimuth can't represent a real east/west split system (panels
  // on both sides); 90 (west) is a same-order-of-magnitude proxy, not a
  // precise model of a split array — same simplification used for PVGIS.
  eastWestFacing: 90,
  northFacing: 180,
};

/**
 * Calls Open-Meteo's archive API for a full past calendar year of hourly
 * Global Tilted Irradiance at a location + orientation, sums it into an
 * annual in-plane irradiation figure, then converts to an estimated annual
 * generation for a OPEN_METEO_ASSUMED_PEAK_POWER_KWP system via the
 * standard PV yield formula.
 * @param {number} latitude
 * @param {number} longitude
 * @param {'southFacing'|'eastWestFacing'|'northFacing'} orientation
 */
async function lookupOpenMeteoGeneration(latitude, longitude, orientation) {
  const azimuth = OPEN_METEO_AZIMUTH_BY_ORIENTATION[orientation];
  // The most recently completed calendar year, computed at call time so
  // this doesn't go stale — Open-Meteo's archive only covers past dates.
  const year = new Date().getFullYear() - 1;
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    start_date: `${year}-01-01`,
    end_date: `${year}-12-31`,
    hourly: 'global_tilted_irradiance',
    tilt: String(OPEN_METEO_TILT_ANGLE_DEGREES),
    azimuth: String(azimuth),
  });
  let response;
  try {
    response = await fetch(`${OPEN_METEO_ARCHIVE_BASE_URL}?${params.toString()}`, { signal: AbortSignal.timeout(15000) });
  } catch (err) {
    return { ok: false, error: `Couldn't reach Open-Meteo (${err.message}).` };
  }
  if (!response.ok) {
    return { ok: false, error: `Open-Meteo returned an unexpected error (HTTP ${response.status}).` };
  }
  let body;
  try {
    body = await response.json();
  } catch (err) {
    return { ok: false, error: `Open-Meteo's response wasn't valid JSON (${err.message}) — the response shape assumed by this code may be wrong.` };
  }
  const hourlyValues = body?.hourly?.global_tilted_irradiance;
  if (!Array.isArray(hourlyValues) || hourlyValues.length === 0) {
    return { ok: false, error: "Open-Meteo's response didn't contain the expected hourly.global_tilted_irradiance array — the response shape assumed by this code may be wrong." };
  }
  const validHours = hourlyValues.filter((v) => typeof v === 'number');
  // Each hourly value is average W/m² during that hour, so summing them
  // directly gives Wh/m² for the year (W/m² x 1 hour = Wh/m² per reading).
  const annualInsolationKwhPerM2 = validHours.reduce((sum, v) => sum + v, 0) / 1000;
  if (validHours.length < hourlyValues.length * 0.9) {
    return { ok: false, error: `Open-Meteo's response was missing too much hourly data for ${year} (${validHours.length}/${hourlyValues.length} hours present) to trust an annual total.` };
  }
  const annualGenerationKwh = annualInsolationKwhPerM2 * OPEN_METEO_ASSUMED_PEAK_POWER_KWP * OPEN_METEO_PERFORMANCE_RATIO;
  return {
    ok: true,
    annualGenerationKwh: Math.round(annualGenerationKwh),
    annualInsolationKwhPerM2: Math.round(annualInsolationKwhPerM2 * 10) / 10,
    peakPowerKwp: OPEN_METEO_ASSUMED_PEAK_POWER_KWP,
    tiltAngleDegrees: OPEN_METEO_TILT_ANGLE_DEGREES,
    performanceRatio: OPEN_METEO_PERFORMANCE_RATIO,
    yearUsed: year,
  };
}

// --- Live electricity price lookup --------------------------------------------

// WHY THIS DATA SOURCE, NOT AN ALTERNATIVE — the reasoning, not just the
// result, since this was an explicit product decision, not just an
// engineering default. Full evidence trail in grounding-research.md
// §Electricity price, "Regional price cap vs. actual supplier rates."
//
// The problem: most people don't know their own per-kWh electricity rate,
// and the static ELECTRICITY_PRICE_PENCE_PER_KWH_DEFAULT above goes stale
// every quarter as Ofgem's price cap changes. Four options were considered:
//
// 1. Ask the user to type their rate. Kept as the top-priority override
//    (electricityPricePencePerKwh, below) since it's the only genuinely
//    exact answer — but insufficient alone, since most people can't supply
//    it, which is the whole problem being solved here.
// 2. Keep the static default, just update it by hand each quarter. Simplest,
//    but doesn't solve "no one knows their rate" and requires remembering
//    to update a hardcoded number four times a year.
// 3. Fetch Ofgem's own regional price-cap data directly — the most
//    obviously "neutral" source, and the one this decision started from.
//    Ruled out: Ofgem publishes it as an XLSX file, not a JSON/CSV API, with
//    no dataset on data.gov.uk either. Using it live in-browser would need
//    (a) a reliable way to find the current quarter's file URL, unconfirmed
//    to exist as a stable link, (b) an XLSX-parsing library added to what's
//    otherwise a zero-dependency prototype, and (c) mapping Ofgem's region
//    naming to whatever postcodes.io returns. Meaningfully more fragile than
//    a JSON API for an uncertain accuracy gain — see point 4.
// 4. Build a static, dated per-supplier rate table, the same pattern used
//    for SEG_TARIFFS. Directly tested rather than assumed: checked 5 real
//    (supplier, region) pairs against Ofgem's own regional cap (24 Jul
//    2026). Result: every standard-variable-tariff rate found landed within
//    ~0.03p/kWh of that region's cap — rounding-noise small, not a real
//    pricing difference. This is a structurally different situation from
//    SEG rates, which genuinely vary supplier-to-supplier by commercial
//    choice (why a static table earns its keep there). Standard-variable
//    tariffs are regulatorily pinned to the cap, so a static table here
//    would mostly duplicate what a live cap-tracking fetch already gives,
//    while missing the cap's quarterly changes that a live fetch handles
//    automatically.
//
// Conclusion: fetch a live rate that tracks the cap, since the cap itself
// was empirically shown to be a trustworthy proxy for standard-variable
// customers regardless of supplier. Ofgem has no fetchable API for this;
// Octopus Energy does — a genuinely public, no-auth REST API for their
// product catalog and unit rates [Fact — confirmed via GitHub source of a
// production Octopus Energy Home Assistant integration
// (BottlecapDave/HomeAssistant-OctopusEnergy), since Octopus's own docs
// pages are blocked the same way every other primary source in this session
// is]. This is Octopus's own rate specifically, used as a stand-in — it is
// NOT claiming a British Gas or OVO customer is billed at Octopus's rate,
// only that their own supplier's independently-set rate has been shown to
// land at nearly the same number, because all of them track the same
// regional cap. That equivalence is the actual finding being relied on
// here, not an assumption.
//
// What's still unconfirmed: the request/response contract below was
// directly fetched successfully once from an unrestricted session
// (grounding-research.md, 24 Jul 2026 — confirms the API shape assumed by
// this code is correct), but not yet from an actual browser the way
// postcodes.io and Open-Meteo were — this is also a longer chained lookup
// (postcode -> GSP region -> current default product -> that product's live
// unit rate) with more surface for something to go wrong than a single API
// call, so treat it with proportionally more caution until browser-tested.
const OCTOPUS_BASE_URL = 'https://api.octopus.energy/v1';

/**
 * Resolves a UK postcode to its electricity Grid Supply Point (GSP) region
 * code (e.g. "_C" for London) — Octopus's own tariff codes are region-
 * specific, so this is needed before a region-correct rate can be fetched.
 * @param {string} postcode
 */
async function lookupGspRegion(postcode) {
  const cleaned = String(postcode || '').trim();
  if (!cleaned) {
    return { ok: false, error: 'No postcode entered.' };
  }
  let response;
  try {
    response = await fetch(`${OCTOPUS_BASE_URL}/industry/grid-supply-points/?postcode=${encodeURIComponent(cleaned)}`, { signal: AbortSignal.timeout(8000) });
  } catch (err) {
    return { ok: false, error: `Couldn't reach Octopus's GSP lookup (${err.message}).` };
  }
  if (!response.ok) {
    return { ok: false, error: `Octopus's GSP lookup returned an unexpected error (HTTP ${response.status}).` };
  }
  const body = await response.json();
  const groupId = body?.results?.[0]?.group_id;
  if (!groupId) {
    return { ok: false, error: `Couldn't resolve a GSP region for "${cleaned}".` };
  }
  return { ok: true, groupId };
}

/**
 * Finds Octopus's current flagship default variable-rate electricity
 * product (the closest live equivalent to "the standard variable tariff
 * most people are on without actively choosing a deal") by filtering the
 * public products list, rather than hardcoding a product code — Octopus
 * reissues these under a new dated code roughly every quarter as the Ofgem
 * price cap changes, so a hardcoded code would go stale the same way the
 * static ELECTRICITY_PRICE_PENCE_PER_KWH_DEFAULT constant does.
 */
async function lookupCurrentOctopusVariableProduct() {
  let response;
  try {
    response = await fetch(`${OCTOPUS_BASE_URL}/products/?brand=OCTOPUS_ENERGY&is_variable=true`, { signal: AbortSignal.timeout(10000) });
  } catch (err) {
    return { ok: false, error: `Couldn't reach Octopus's product list (${err.message}).` };
  }
  if (!response.ok) {
    return { ok: false, error: `Octopus's product list returned an unexpected error (HTTP ${response.status}).` };
  }
  const body = await response.json();
  const products = body?.results;
  if (!Array.isArray(products)) {
    return { ok: false, error: "Octopus's product list response didn't contain the expected results array." };
  }
  // Heuristic, not a guaranteed match: excludes green/tracker/prepay/business
  // variants and Agile-style wholesale-linked tariffs (no single flat rate to
  // fetch, same reason Octopus's Agile SEG/export tariffs were left as
  // Assumption-tier elsewhere in this file), looking for the plain
  // "Flexible Octopus"-style default among currently-available products.
  const candidates = products.filter(
    (p) => !p.is_green && !p.is_tracker && !p.is_prepay && !p.is_business && !p.is_restricted && (p.available_to == null || new Date(p.available_to) > new Date())
  );
  if (candidates.length === 0) {
    return { ok: false, error: 'No currently-available default variable Octopus product found matching the expected filters.' };
  }
  // Most recently launched matching product, since Octopus periodically
  // reissues this tariff under a new code.
  candidates.sort((a, b) => new Date(b.available_from) - new Date(a.available_from));
  const product = candidates[0];
  return { ok: true, productCode: product.code, displayName: product.display_name };
}

/**
 * Fetches the current standard-unit-rate (Direct Debit, pence/kWh inc VAT)
 * for a given Octopus product code + GSP region, via the single-register
 * electricity tariff code convention (E-1R-{productCode}-{groupId}).
 * @param {string} productCode
 * @param {string} groupId - e.g. "_C", from lookupGspRegion()
 */
async function lookupOctopusUnitRate(productCode, groupId) {
  const tariffCode = `E-1R-${productCode}-${groupId}`;
  let response;
  try {
    response = await fetch(`${OCTOPUS_BASE_URL}/products/${productCode}/electricity-tariffs/${tariffCode}/standard-unit-rates/`, { signal: AbortSignal.timeout(10000) });
  } catch (err) {
    return { ok: false, error: `Couldn't reach Octopus's unit-rates endpoint (${err.message}).` };
  }
  if (!response.ok) {
    return { ok: false, error: `Octopus's unit-rates endpoint returned an unexpected error (HTTP ${response.status}) for tariff code "${tariffCode}".` };
  }
  const body = await response.json();
  const currentRate = body?.results?.[0];
  const ratePencePerKwh = currentRate?.value_inc_vat;
  if (typeof ratePencePerKwh !== 'number') {
    return { ok: false, error: "Octopus's unit-rates response didn't contain the expected value_inc_vat field." };
  }
  return { ok: true, ratePencePerKwh, tariffCode, validFrom: currentRate.valid_from };
}

/**
 * Chains the three lookups above into one live current electricity price
 * for a given postcode: postcode -> GSP region, current default variable
 * product, that product's live unit rate for the region. Falls back
 * cleanly to { ok: false } (letting the caller use the static default) at
 * any failed step, rather than throwing or silently producing a wrong
 * number.
 * @param {string} postcode
 */
async function lookupLiveElectricityPrice(postcode) {
  const gsp = await lookupGspRegion(postcode);
  if (!gsp.ok) {
    return { ok: false, error: gsp.error };
  }
  const product = await lookupCurrentOctopusVariableProduct();
  if (!product.ok) {
    return { ok: false, error: product.error };
  }
  const rate = await lookupOctopusUnitRate(product.productCode, gsp.groupId);
  if (!rate.ok) {
    return { ok: false, error: rate.error };
  }
  return {
    ok: true,
    ratePencePerKwh: rate.ratePencePerKwh,
    productDisplayName: product.displayName,
    tariffCode: rate.tariffCode,
    validFrom: rate.validFrom,
  };
}

/**
 * Postcode-aware wrapper around calculateRooftopViability. Resolves the
 * postcode via postcodes.io, then tries Open-Meteo for a coordinate-precise
 * generation estimate; if Open-Meteo is unreachable or its response doesn't
 * match the assumed shape, falls back to the country-level generation
 * multiplier; if the postcode itself can't be resolved, falls back further
 * to the unadjusted England baseline. Also tries a live current electricity
 * price for the user's region (via Octopus's public API) unless the user
 * already gave their own rate, falling back to the static Ofgem default on
 * any failure. Never blocks the calculation.
 * @param {string} postcode
 * @param {Object} otherInputs - same shape as calculateRooftopViability's input, minus regionalGeneration/generationOverride/electricityPriceOverride
 */
async function calculateRooftopViabilityByPostcode(postcode, otherInputs) {
  const lookup = await lookupPostcodeRegion(postcode);
  if (!lookup.ok) {
    const result = calculateRooftopViability(otherInputs);
    result.postcodeLookup = { ok: false, error: lookup.error };
    return result;
  }

  const userProvidedElectricityPrice = otherInputs.electricityPricePencePerKwh != null;
  const [openMeteo, electricityPrice] = await Promise.all([
    lookupOpenMeteoGeneration(lookup.latitude, lookup.longitude, otherInputs.orientation),
    userProvidedElectricityPrice ? Promise.resolve({ ok: false, error: 'Skipped: you provided your own rate.' }) : lookupLiveElectricityPrice(postcode),
  ]);

  const calcInputs = { ...otherInputs };
  if (openMeteo.ok) {
    calcInputs.generationOverride = {
      value: openMeteo.annualGenerationKwh,
      tier: 'Inference — Open-Meteo coordinate estimate, confirmed working via a live browser test (24 Jul 2026) but not exhaustively verified across locations/orientations',
      note: `Derived from Open-Meteo's ${openMeteo.yearUsed} hourly irradiance data for this exact location (${openMeteo.annualInsolationKwhPerM2}kWh/m²/yr on a ${openMeteo.tiltAngleDegrees}° tilted, ${otherInputs.orientation === 'southFacing' ? 'south-facing' : otherInputs.orientation === 'northFacing' ? 'north-facing' : 'east/west-facing'} plane), scaled to a ${openMeteo.peakPowerKwp}kWp system at a ${openMeteo.performanceRatio} performance ratio (both assumed, not your actual system). More precise than the country-level multiplier.`,
    };
  } else {
    calcInputs.regionalGeneration = REGIONAL_GENERATION_MULTIPLIER[lookup.country];
  }
  if (!userProvidedElectricityPrice && electricityPrice.ok) {
    calcInputs.electricityPriceOverride = {
      value: electricityPrice.ratePencePerKwh,
      tier: "Inference — live-fetched from Octopus Energy's public API, not yet confirmed via a live browser test",
      note: `Octopus's current "${electricityPrice.productDisplayName}" rate for your region (tariff ${electricityPrice.tariffCode}, valid from ${electricityPrice.validFrom}), fetched live rather than assumed. This is Octopus's own price-cap-tracking rate, not necessarily your actual supplier's identical figure — Ofgem's price cap sets a regional ceiling every standard-variable-tariff supplier must match or beat, so this is a close proxy if you're on a standard variable deal, not a guarantee if you're on a fixed deal or with a different supplier. Enter your own rate above for an exact result.`,
    };
  }

  const result = calculateRooftopViability(calcInputs);
  result.openMeteoLookup = openMeteo.ok ? { ok: true } : { ok: false, error: openMeteo.error };
  result.electricityPriceLookup = userProvidedElectricityPrice
    ? { ok: false, note: 'Skipped: you provided your own rate.' }
    : electricityPrice.ok
      ? { ok: true, productDisplayName: electricityPrice.productDisplayName, tariffCode: electricityPrice.tariffCode, validFrom: electricityPrice.validFrom }
      : { ok: false, error: electricityPrice.error };

  result.postcodeLookup = {
    ok: true,
    postcode: lookup.postcode,
    country: lookup.country,
    region: lookup.region,
  };
  const regulatoryNote = REGIONS_WITH_UNRESEARCHED_REGULATORY_REGIME[lookup.country];
  if (regulatoryNote) {
    result.regulatoryFlag = { country: lookup.country, note: regulatoryNote };
  }
  if (!openMeteo.ok && !REGIONAL_GENERATION_MULTIPLIER[lookup.country]) {
    result.postcodeLookup.note = `No regional generation figure for "${lookup.country}"; used the England-calibrated default.`;
  }
  return result;
}

// --- Plug-in calculator -------------------------------------------------------

/**
 * @param {Object} input
 * @param {'usuallyHome'|'usuallyOut'} input.occupancy - retained for interface symmetry; not used in this scoring pass, since plug-in generation is assumed fully self-consumed
 * @param {number} [input.electricityPricePencePerKwh] - the user's own known rate; falls back to the Ofgem price-cap default if omitted
 */
function calculatePluginViability({ occupancy, electricityPricePencePerKwh }) {
  const generation = PLUGIN_ANNUAL_GENERATION_KWH;
  const usedElectricityPrice = electricityPricePencePerKwh ?? ELECTRICITY_PRICE_PENCE_PER_KWH_DEFAULT;
  const electricityPriceIsUserProvided = electricityPricePencePerKwh != null;
  // Plug-in units are treated as fully self-consumed at this scale, no export
  // mechanism assumed. This mirrors how the source figures were reported,
  // not an independently modeled export split.
  const annualSavingsGbp = (generation * usedElectricityPrice) / 100;
  const paybackYears = PLUGIN_KIT_COST_GBP / annualSavingsGbp;
  const status = scoreStatus(paybackYears, PLUGIN_PAYBACK_THRESHOLDS);

  return {
    segment: 'plugin',
    status,
    paybackYears: Math.round(paybackYears * 10) / 10,
    annualSavingsGbp: Math.round(annualSavingsGbp),
    kitCostGbp: PLUGIN_KIT_COST_GBP,
    generationKwh: generation,
    legalStatus: PLUGIN_LEGAL_STATUS,
    assumptions: {
      electricityPricePencePerKwh: electricityPriceIsUserProvided
        ? { value: usedElectricityPrice, tier: 'User-provided', note: 'Your own stated rate' }
        : { value: usedElectricityPrice, tier: 'Fact (default)', note: "Ofgem price cap, Jul-Sep 2026, changes quarterly, and applies only to default/standard-variable tariffs — if you're on a fixed deal, enter your own rate for an accurate result" },
      kitCostGbp: { value: PLUGIN_KIT_COST_GBP, tier: 'Assumption — weakest-sourced figure in this calculator', note: 'Reported range £400-900; none of these figures trace to a government, MCS, or established consumer body' },
      generationKwh: { value: generation, tier: 'Assumption — weakest-sourced figure in this calculator', note: 'Reported range 640-900kWh/yr, same sourcing caveat as kit cost' },
    },
  };
}

// --- Exports -----------------------------------------------------------------

const SunnySideUpCalculator = {
  calculateRooftopViability,
  calculateRooftopViabilityByPostcode,
  calculatePluginViability,
  lookupPostcodeRegion,
  lookupOpenMeteoGeneration,
  lookupGspRegion,
  lookupCurrentOctopusVariableProduct,
  lookupOctopusUnitRate,
  lookupLiveElectricityPrice,
  getSegTariffs,
  findSegTariff,
  findSegTariffsBySupplier,
  estimateAnnualConsumptionKwh,
  constants: {
    ELECTRICITY_PRICE_PENCE_PER_KWH_DEFAULT,
    SEG_RATE_PENCE_PER_KWH_DEFAULT,
    SEG_TARIFFS,
    ROOFTOP_SYSTEM_COST_GBP,
    ROOFTOP_ANNUAL_GENERATION_KWH,
    REGIONAL_GENERATION_MULTIPLIER,
    REGIONS_WITH_UNRESEARCHED_REGULATORY_REGIME,
    OPEN_METEO_ASSUMED_PEAK_POWER_KWP,
    OPEN_METEO_TILT_ANGLE_DEGREES,
    OPEN_METEO_PERFORMANCE_RATIO,
    TDCV_ELECTRICITY_KWH_BY_BAND,
    HEAT_PUMP_ANNUAL_KWH_ESTIMATE,
    EV_ANNUAL_HOME_CHARGING_KWH_ESTIMATE,
    PLUGIN_KIT_COST_GBP,
    PLUGIN_ANNUAL_GENERATION_KWH,
    SELF_CONSUMPTION_RATE,
    ROOFTOP_PAYBACK_THRESHOLDS,
    PLUGIN_PAYBACK_THRESHOLDS,
    PLUGIN_LEGAL_STATUS,
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SunnySideUpCalculator;
}
if (typeof window !== 'undefined') {
  window.SunnySideUpCalculator = SunnySideUpCalculator;
}
