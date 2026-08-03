/**
 * SunnySideUp viability calculator — core scoring logic.
 *
 * Every constant below is commented with its confidence tier and source,
 * matching the Fact/Inference/Assumption discipline in grounding-research.md.
 * This is a simplified prototype model, not a certified solar-yield or
 * financial-advice calculation. Self-consumption (both segments) is modeled
 * via DESNZ Home Energy Model's own formula (selfConsumptionFactorFromDemandRatio),
 * applied to annual totals rather than the per-timestep basis it was designed
 * for — a real approximation, flagged in each result's assumptions/flags
 * rather than presented as more precise than it is. Plug-in falls back to a
 * fully-self-consumed assumption when no consumption figure is given at all;
 * see calculatePluginViability's own comment for why and how that's flagged.
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

// [Fact — MCS's own reported average domestic system size, checked 24 July
// 2026] All three figures above, and ROOFTOP_SYSTEM_COST_GBP, are
// calibrated to roughly this reference system size — MCS's own reported
// average UK domestic PV system is 4.6kWp (Feb 2025), and the figures above
// were researched against "a 4kW system," close enough to treat as the same
// reference point. Named here so the roof-area sizing logic below has an
// explicit multiplier base instead of a silently-repeated "4."
const REFERENCE_SYSTEM_SIZE_KWP = 4;

// --- Roof-area-based system sizing --------------------------------------------

// WHY THIS EXISTS: the calculator previously assumed every rooftop
// household gets the same flat ~4kWp "typical" system regardless of actual
// roof size — a low-consumption household and a high-consumption household
// got modeled identically. Real installers size against available roof
// area, not consumption (per the same MCS-anchored research this section
// draws from) — this lets someone who knows their usable roof area get a
// system sized to it instead of the flat default, while keeping the flat
// default as the fallback for anyone who doesn't know their roof area.
//
// [Inference — derived from an MCS-anchored range (a typical 3-bed UK semi
// has 22-30m² of usable south/west roof, fitting 9-12 standard panels),
// not a single directly-cited "roof area per panel" figure, checked 24 July
// 2026] Usable roof area per panel, including mounting/spacing clearance —
// more than a panel's own footprint alone (~1.9m², per separate UK panel-
// dimension research), since real installations need room for spacing and
// edge clearance that a flat panel-footprint sum would miss.
const ROOF_AREA_PER_PANEL_M2 = 2.45;

// [Inference — same source range, cross-checked against separate research
// into current UK residential panel wattage (400-460W depending on panel
// generation; older 60-cell panels run 350-400W, newer 66-cell half-cut
// panels run 425-460W), checked 24 July 2026] Typical per-panel output,
// blended across old and new panel stock likely to be actually quoted.
const PANEL_WATTAGE_KWP = 0.43;

// [Fact — MCS's own installed-cost-per-kWp figures, checked 24 July 2026]
// Cost does not scale linearly with system size: smaller systems cost more
// per kWp, since fixed costs (scaffolding, inverter, mobilisation) don't
// shrink with a smaller array. MCS-sourced figures: ~£1,800/kWp at 3kWp and
// below, ~£1,625/kWp at 4kWp and above (MCS's own overall average across
// all system sizes sits at £1,565-1,686/kWp, consistent with a blend of
// these two tiers). A two-tier model, not a continuous curve — a
// simplification of a real but more gradual relationship, not a precise
// costing tool.
const COST_PER_KWP_GBP_BY_TIER = { smallSystemThresholdKwp: 3, smallSystemCostPerKwp: 1800, standardCostPerKwp: 1625 };

// CORRECTED 1 Aug 2026: this file previously had a PERMITTED_DEVELOPMENT_KWP_CEILING_ENGLAND
// = 4 constant, tagged [Fact], claiming 4kWp was "the largest system size
// covered by Permitted Development Rights in England." That was wrong, and
// contradicted this project's own grounding-research.md (§Permitted
// development, sourced to Historic England and the GPDO 2015 Schedule 2
// Part 14 Class J), which documents the real test as physical, not
// electrical: panels not protruding more than 200mm from the roof
// slope/wall, not projecting above the roof's highest point (excluding
// chimney), not more than 1m above a flat roof's highest point, and not on
// a listed building. No kWp figure appears anywhere in that section. The
// 4kWp number most likely got carried over from a different, unrelated
// threshold this same research documents separately (§G98 vs G99): G98 is
// the DNO's fast-track *grid-connection notification* route for
// single-phase systems up to ~3.68kW, a distribution-network concept with
// no bearing on planning law. Removed rather than corrected to a "right"
// kWp number, because there isn't one — Permitted Development eligibility
// depends on roof pitch, ridge height, and panel protrusion, none of which
// this calculator collects. See the unconditional `permittedDevelopment`
// flag below (same treatment as tenancyConsent/listedBuilding/
// conservationArea): states the real physical criteria and says this tool
// can't evaluate them, instead of a false size-based determination.

/**
 * Converts a usable roof area (m²) into an estimated system: panel count,
 * size (kWp), and cost, using the nonlinear per-kWp cost tiers above.
 * Standalone helper — calculateRooftopViability only calls this if
 * roofAreaM2 is given, otherwise it keeps the flat "typical system"
 * assumption unchanged. Returns null (not a zeroed-out result) if the
 * given area is too small to fit even one panel, so the caller can fall
 * back to the flat default rather than compute a nonsensical 0kWp system.
 * @param {number} roofAreaM2
 */
function estimateSystemSizeFromRoofArea(roofAreaM2) {
  const panelCount = Math.floor(Math.max(0, roofAreaM2) / ROOF_AREA_PER_PANEL_M2);
  if (panelCount === 0) {
    return null;
  }
  const systemSizeKwp = Math.round(panelCount * PANEL_WATTAGE_KWP * 100) / 100;
  const costPerKwpGbp =
    systemSizeKwp <= COST_PER_KWP_GBP_BY_TIER.smallSystemThresholdKwp
      ? COST_PER_KWP_GBP_BY_TIER.smallSystemCostPerKwp
      : COST_PER_KWP_GBP_BY_TIER.standardCostPerKwp;
  return {
    panelCount,
    systemSizeKwp,
    costPerKwpGbp,
    systemCostGbp: Math.round(systemSizeKwp * costPerKwpGbp),
  };
}

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
// This figure is treated as the south-facing baseline — the weak sources
// behind it don't specify an assumed orientation, but 770 sits centrally in
// the reported 640-900 range, which is the closest thing to a "typical/best
// case" reading available.
const PLUGIN_KIT_COST_GBP = 650;
const PLUGIN_ANNUAL_GENERATION_KWH = 770;

// [Assumption, deliberately stacked on another Assumption — a product
// decision, not a research finding] Plug-in generation should vary by
// orientation the same way rooftop does — same underlying physics — but no
// orientation-specific plug-in data was ever found (unsurprising, given the
// base figure above is already the weakest-sourced number in this
// calculator). Rather than presenting plug-in as orientation-agnostic
// (which is more a gap than a real property of plug-in solar) or inventing
// new plug-in-specific ratios with no basis, this reuses rooftop's own
// east/west ≈ 79% and north ≈ 50% ratios (ROOFTOP_ANNUAL_GENERATION_KWH
// above), computed from that same object at call time rather than
// hardcoded here, so the two stay in sync if rooftop's figures ever change.
// Flagged in the assumptions output as two stacked Assumption-tier figures,
// not hidden behind a single confident number.
function pluginOrientationMultiplier(orientation) {
  return ROOFTOP_ANNUAL_GENERATION_KWH[orientation] / ROOFTOP_ANNUAL_GENERATION_KWH.southFacing;
}

// CORRECTED 1 Aug 2026: this file previously modeled self-consumption as a
// hardcoded two-tier occupancy proxy (usuallyHome 0.55 / usuallyOut 0.30),
// with no basis beyond "home vs out" and no way to reflect that a household
// with, say, an EV or heat pump timed to run during daylight hours would
// self-consume a materially higher share than one without, at the same
// occupancy pattern. Replaced with a formula from DESNZ's own Home Energy
// Model technical documentation (HEM-TP-18 "PV generation and
// self-consumption", gov.uk, fetched and pdftotext-extracted directly 1 Aug
// 2026): [Fact, primary UK government source] HEM computes an instantaneous
// self-consumption factor as a function of the "demand ratio" (PV energy
// supply ÷ electricity demand) in each timestep: factor = min(0.6748 x
// demandRatio^-0.703, 1), derived from field data across a small sample of
// UK dwellings (hourly data from 4, monthly data from 15, used to check the
// formula against typical generation/demand profiles), cross-checked by HEM's
// own literature review against similar relationships in other datasets.
// [Inference, this calculator's own adaptation] HEM applies this formula per
// timestep (sub-hourly); this calculator only has annual totals, so it's
// applied once to the annual demand ratio as a coarser approximation — this
// loses the within-day timing HEM's own per-timestep design captures (e.g.
// a household whose high annual consumption is mostly evening-only vs one
// whose EV/heat pump load is scheduled into daylight hours would get the
// same result here, despite very different real self-consumption), which is
// exactly why the flag below still surfaces occupancy pattern as a caveat
// rather than treating this number as final. The real advantage over the
// old occupancy binary: annual consumption already reflects heat pump/EV
// additions (estimateAnnualConsumptionKwh above), so a household with either
// now gets a demand-ratio-driven, not occupancy-driven, self-consumption
// estimate — mechanically capturing what the occupancy proxy could not,
// without inventing a new unresearched per-appliance modifier.
const SELF_CONSUMPTION_DEMAND_RATIO_COEFFICIENT = 0.6748;
const SELF_CONSUMPTION_DEMAND_RATIO_EXPONENT = -0.703;

/**
 * DESNZ HEM-TP-18's self-consumption factor formula, applied to an annual
 * demand ratio as a single-figure approximation of what HEM computes per
 * timestep. See the constants above for the full sourcing note.
 * @param {number} generationKwh
 * @param {number} consumptionKwh
 */
function selfConsumptionFactorFromDemandRatio(generationKwh, consumptionKwh) {
  if (generationKwh <= 0 || consumptionKwh <= 0) {
    return 0;
  }
  const demandRatio = generationKwh / consumptionKwh;
  const rawFactor = SELF_CONSUMPTION_DEMAND_RATIO_COEFFICIENT * Math.pow(demandRatio, SELF_CONSUMPTION_DEMAND_RATIO_EXPONENT);
  // HEM's own stated limit: the factor should never exceed 1/demandRatio,
  // otherwise self-consumption could be predicted higher than total demand.
  return Math.min(rawFactor, 1, 1 / demandRatio);
}

// Payback thresholds for green/amber/red. Not a cited figure — a design
// judgment loosely anchored to grounding-research.md's own reported payback
// range ("roughly 6-14 years across sources" for rooftop), not a regulator
// or industry-body standard.
//
// ADDRESSED 1 Aug 2026 (without inventing new precision): these cutoffs were
// criticized on two distinct grounds. (1) Payback tolerance is genuinely
// subjective — how long someone plans to own the property, and how much
// they weight upfront cost vs. long-term saving, both change what "good"
// means, and no single cutoff can be right for everyone. This calculator
// doesn't try to personalize the thresholds (that would mean asking for a
// planned ownership horizon and inventing an unresearched mapping from
// horizon to acceptable payback — a worse kind of false precision than the
// fixed cutoffs it would replace). Instead, both results now carry an
// explicit `paybackYears` entry in `assumptions` naming the thresholds as a
// design judgment and pointing back to the raw number, which was already
// shown as the headline figure, not hidden behind the color. (2) The
// payback model previously ignored a real, quantifiable mid-life cost:
// inverter replacement. See INVERTER_REPLACEMENT_COST_GBP /
// _YEAR below and calculateRooftopViability's own comment for how that's
// now factored in for rooftop specifically (not plug-in — no comparable
// cost research exists at plug-in's much smaller scale, and reusing the
// rooftop figure would repeat the same rooftop-borrowed-for-plugin mismatch
// already flagged elsewhere in this file for orientation ratios).
const ROOFTOP_PAYBACK_THRESHOLDS = { green: 8, amber: 13 };
const PLUGIN_PAYBACK_THRESHOLDS = { green: 5, amber: 8 };

// [Assumption — consumer-guide convergence, no MCS/government primary
// source found, checked 1 Aug 2026] A like-for-like string inverter
// replacement for a residential 3-4kWp system is commonly cited around
// £700-1,200 including labour (equipment £600-1,200 + labour £200-400);
// £950 is a midpoint. Standard string inverters are commonly cited as
// lasting 10-15 years, materially shorter than a panel's own ~25-year
// lifespan; 12 is a midpoint, consistent with the "around year 10-12"
// figure this constant addresses. Micro-inverters (e.g. Enphase) carry
// 25-year warranties and aren't expected to need this at all, so this is
// itself a simplification (assumes a string inverter, the more common UK
// residential setup, not a system-specific inverter type input this
// calculator doesn't collect).
const INVERTER_REPLACEMENT_COST_GBP = 950;
const INVERTER_REPLACEMENT_YEAR = 12;

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
 * @param {'usuallyHome'|'usuallyOut'} input.occupancy - no longer drives the self-consumption number itself (see selfConsumptionFactorFromDemandRatio's sourcing note); used only to decide whether the lowConfidenceOccupancyMismatch flag below is worth surfacing
 * @param {number} input.annualConsumptionKwh - household's own annual electricity use
 * @param {number} [input.electricityPricePencePerKwh] - the user's own known rate; takes precedence over electricityPriceOverride and the static default
 * @param {Object} [input.electricityPriceOverride] - a specific { value, tier, note } to use for the electricity price outright (e.g. a live-fetched current regional rate), used only if electricityPricePencePerKwh is omitted; falls back to the static Ofgem default if this is also omitted
 * @param {number} [input.segRatePencePerKwh] - a specific SEG tariff's rate, e.g. from findSegTariff(); falls back to the no-switch-needed baseline default if omitted
 * @param {string} [input.segTariffLabel] - "Supplier — Tariff name" for display, if segRatePencePerKwh came from a specific named tariff rather than a manually-typed number
 * @param {string} [input.segTariffSource] - the named source for that tariff row (e.g. "Ofgem SEG Licensee Register"), if available
 * @param {string} [input.segTariffEligibility] - that tariff row's eligibility text (e.g. "requires system installed by that same supplier"), if available — carried into the result so the condition attached to the picked rate isn't lost between the picker UI and the calculated output
 * @param {Object} [input.regionalGeneration] - a REGIONAL_GENERATION_MULTIPLIER entry, e.g. from calculateRooftopViabilityByPostcode()'s country-level fallback; omit to use the England-calibrated baseline unchanged. Ignored if generationOverride is also given.
 * @param {Object} [input.generationOverride] - a specific { value, tier, note } to use for generationKwh outright (e.g. a coordinate-precise weather-API estimate), taking precedence over regionalGeneration and the orientation-based default
 * @param {number} [input.roofAreaM2] - usable roof area; if given, sizes the system (panels, kWp, cost) against it via estimateSystemSizeFromRoofArea() instead of the flat REFERENCE_SYSTEM_SIZE_KWP default, and scales whatever generation figure was otherwise resolved (flat/regional/override) proportionally to the derived system size
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
  segTariffEligibility,
  regionalGeneration,
  generationOverride,
  roofAreaM2,
}) {
  const baseGeneration = ROOFTOP_ANNUAL_GENERATION_KWH[orientation];
  const preRoofAreaGeneration = generationOverride
    ? generationOverride.value
    : regionalGeneration
      ? Math.round(baseGeneration * regionalGeneration.value)
      : baseGeneration;

  const roofAreaSizing = roofAreaM2 != null ? estimateSystemSizeFromRoofArea(roofAreaM2) : null;
  const systemSizeKwp = roofAreaSizing ? roofAreaSizing.systemSizeKwp : REFERENCE_SYSTEM_SIZE_KWP;
  const roofAreaMultiplier = roofAreaSizing ? roofAreaSizing.systemSizeKwp / REFERENCE_SYSTEM_SIZE_KWP : 1;
  const generation = Math.round(preRoofAreaGeneration * roofAreaMultiplier);
  const systemCostGbp = roofAreaSizing ? roofAreaSizing.systemCostGbp : ROOFTOP_SYSTEM_COST_GBP;

  const selfConsumptionRate = selfConsumptionFactorFromDemandRatio(generation, annualConsumptionKwh);
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

  // If the naive payback (cost ÷ annual savings) already runs past
  // INVERTER_REPLACEMENT_YEAR, a real cost lands inside that payback window
  // that the naive number ignores: a replacement inverter. Re-solving for
  // when cumulative savings actually clears (systemCost + inverterCost),
  // not just systemCost, pushes payback out further — a materially more
  // honest number for any result already running into double digits.
  // Deliberately only ever adds one replacement cycle: if payback still
  // exceeds two replacement cycles (24yr+) even after this adjustment, that
  // result is already deep in "red" territory regardless of the exact
  // figure, so a second cycle's precision wouldn't change what the number
  // tells the user. See INVERTER_REPLACEMENT_COST_GBP/_YEAR's comment for
  // sourcing.
  const naivePaybackYears = systemCostGbp / annualSavingsGbp;
  const paybackAssumesInverterReplacement = naivePaybackYears > INVERTER_REPLACEMENT_YEAR;
  const paybackYears = paybackAssumesInverterReplacement
    ? (systemCostGbp + INVERTER_REPLACEMENT_COST_GBP) / annualSavingsGbp
    : naivePaybackYears;
  const status = scoreStatus(paybackYears, ROOFTOP_PAYBACK_THRESHOLDS);

  const result = {
    segment: 'rooftop',
    status,
    paybackYears: Math.round(paybackYears * 10) / 10,
    annualSavingsGbp: Math.round(annualSavingsGbp),
    systemCostGbp,
    systemSizeKwp,
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
              ? `${segTariffLabel}${segTariffSource ? `, per ${segTariffSource}` : ''} (from the user-provided SEG tariff table, dated 23 July 2026)${segTariffEligibility ? ` — requires: ${segTariffEligibility}` : ''}`
              : "Your own stated rate",
          }
        : {
            value: usedSegRate,
            tier: 'Assumption (default)',
            note: "The no-switch-needed baseline (median of tariffs open to anyone). Switching supplier or installing through a specific company can get a meaningfully higher rate, up to 25p/kWh in the researched tariff table — pick your actual tariff for an accurate result",
          },
      systemCostGbp: roofAreaSizing
        ? {
            value: systemCostGbp,
            tier: 'Inference — derived from your roof area',
            note: `${roofAreaSizing.panelCount} panels x ${PANEL_WATTAGE_KWP}kWp x £${roofAreaSizing.costPerKwpGbp}/kWp (MCS-sourced installed-cost rate for this system size). Not a quote for your specific roof — actual roof shape, shading, and access all affect a real quote.`,
          }
        : { value: systemCostGbp, tier: 'Assumption', note: `Industry-consensus range is £5,500-£8,700 for a ~${REFERENCE_SYSTEM_SIZE_KWP}kWp system (MCS's own reported UK average is 4.6kWp); not a quote for your specific roof. Give your usable roof area for a size-adjusted estimate instead of this flat default.` },
      generationKwh: generationOverride
        ? { value: generation, tier: generationOverride.tier, note: `${generationOverride.note}${roofAreaSizing ? ` Further scaled by your roof-area-derived system size (${systemSizeKwp}kWp vs the ${REFERENCE_SYSTEM_SIZE_KWP}kWp this figure and your postcode estimate are both otherwise calibrated to).` : ''}` }
        : regionalGeneration
          ? { value: generation, tier: regionalGeneration.tier, note: `England-baseline figure (${baseGeneration}kWh/yr) adjusted by a ${regionalGeneration.value}x regional multiplier${roofAreaSizing ? ` and a roof-area-derived ${systemSizeKwp}kWp system size (vs the ${REFERENCE_SYSTEM_SIZE_KWP}kWp reference)` : ''}. ${regionalGeneration.note}` }
          : {
              value: generation,
              tier: orientation === 'southFacing' ? 'Assumption' : 'Prototype estimate, not independently researched',
              note: `Researched range is 3,400-4,200kWh/yr for a south-facing ${REFERENCE_SYSTEM_SIZE_KWP}kWp system, England-calibrated. No postcode given, so no regional adjustment applied.${roofAreaSizing ? ` Scaled to your roof-area-derived ${systemSizeKwp}kWp system size.` : ''}`,
            },
      selfConsumptionRate: {
        value: Math.round(selfConsumptionRate * 1000) / 1000,
        tier: 'Inference — DESNZ Home Energy Model formula, applied annually rather than per-timestep',
        note: `Computed from the ratio of your annual generation (${generation}kWh) to your annual consumption (${annualConsumptionKwh}kWh) via DESNZ's own Home Energy Model self-consumption formula (HEM-TP-18), not from occupancy pattern directly. Applying a formula designed for sub-hourly timesteps to annual totals is a coarser approximation — it can't distinguish a household whose consumption is concentrated in daylight hours (higher real self-consumption) from one whose same annual total is mostly evening (lower real self-consumption).`,
      },
      paybackYears: {
        value: Math.round(paybackYears * 10) / 10,
        tier: 'Design judgment (color thresholds)' + (paybackAssumesInverterReplacement ? ' + Inference (inverter replacement cost)' : ''),
        note: `The green/amber/red cutoffs (≤${ROOFTOP_PAYBACK_THRESHOLDS.green}yr / ≤${ROOFTOP_PAYBACK_THRESHOLDS.amber}yr / longer) are this calculator's own design judgment, loosely anchored to a researched 6-14yr range, not a personalized recommendation — how long you plan to own the property and how you weigh upfront cost against long-term saving both change what counts as a good payback for you specifically. Weigh the raw number above against your own plans rather than the color alone.${paybackAssumesInverterReplacement ? ` This figure also assumes one inverter replacement (£${INVERTER_REPLACEMENT_COST_GBP}, around year ${INVERTER_REPLACEMENT_YEAR}) partway through the payback period, since the unadjusted payback (${Math.round(naivePaybackYears * 10) / 10}yr) ran past a typical string inverter's working life — see the inverterReplacementFactored flag.` : ''}`,
      },
    },
  };

  if (roofAreaSizing) {
    result.roofAreaSizing = {
      roofAreaM2,
      panelCount: roofAreaSizing.panelCount,
      systemSizeKwp: roofAreaSizing.systemSizeKwp,
    };
  }

  // Situational, always-worth-reading callouts, distinct from the per-field
  // assumptions above: those explain how confident a number is, these tell
  // the user about a condition attached to *this specific result* that the
  // number alone doesn't convey. calculateRooftopViabilityByPostcode may
  // append a regulatory-regime flag to this same array once it knows the
  // resolved country. The first three below are unconditional — every
  // rooftop result gets them, not just some — because none of the inputs
  // this calculator collects (deliberately no new ones added for this) can
  // tell it whether a given property is leasehold, listed, or in a
  // conservation area.
  const flags = [];

  flags.push({
    id: 'permittedDevelopment',
    tier: 'Fact',
    title: 'Check Permitted Development criteria before installing',
    note: 'Roof-mounted domestic solar in England is normally Permitted Development (no planning application) only if it does not protrude more than 200mm from the roof slope or wall, does not project above the roof\'s highest point (excluding chimney), and is no more than 1m above a flat roof\'s highest point. These are physical constraints this calculator cannot check (it has no roof pitch, ridge height, or protrusion inputs) — system size in kWp is not itself part of the test. Scotland and Wales have their own separate regimes, not researched here.',
  });

  flags.push({
    id: 'tenancyConsent',
    tier: 'Fact',
    title: 'Leasehold or renting? You likely need consent',
    note: "If you're a leaseholder, UK leasehold law generally requires freeholder (or management company) consent before altering a building's exterior — including rooftop solar — regardless of system size; lease terms vary, so check yours. If you rent, check with your landlord. This tool doesn't resolve either question for your specific situation.",
  });

  flags.push({
    id: 'listedBuilding',
    tier: 'Fact',
    title: 'Listed building? No permitted development rights apply',
    note: 'Listed buildings have no permitted development rights for solar at all, regardless of system size — not checked by this tool.',
  });

  flags.push({
    id: 'conservationArea',
    tier: 'Inference',
    title: 'In a conservation area? Extra rules may apply',
    note: 'Panels visible from a highway in a conservation area may need full planning permission even within the Permitted Development ceiling; rear- or side-facing panels not visible from a highway are more often still exempt. Not checked by this tool.',
  });

  // High-export households are unusually sensitive to which SEG rate this
  // result assumes: real tariffs span roughly 1-25p/kWh (SEG_TARIFFS above),
  // a much wider spread than electricity import prices do. When no specific
  // tariff was picked, this result falls back to the no-switch-needed
  // baseline (SEG_RATE_PENCE_PER_KWH_DEFAULT), which sits near the bottom of
  // that range — so the more of the generated electricity a household
  // exports rather than uses itself, the more this result understates what
  // an actual, higher-paying tariff would be worth.
  const exportShareOfGeneration = generation > 0 ? exportedKwh / generation : 0;
  if (!segRateIsUserProvided && exportShareOfGeneration > 0.5) {
    const topSegRate = SEG_TARIFFS[0].ratePencePerKwh;
    flags.push({
      id: 'highExportSensitivity',
      tier: 'Inference',
      title: 'High-export household: this result is unusually sensitive to your SEG rate',
      note: `You're projected to export ${Math.round(exportShareOfGeneration * 100)}% of what you generate, more than most households. This result uses the no-switch-needed baseline SEG rate (${SEG_RATE_PENCE_PER_KWH_DEFAULT}p/kWh) since no specific tariff was picked, but real SEG rates researched here range up to ${topSegRate}p/kWh. For a high-export household like this one, picking your actual tariff will move this result more than it would for most, not just the import price. Use the SEG tariff picker for an accurate result.`,
    });
  }

  // The self-consumption formula above is annual-average, so it can't see
  // *when* within the day a household's consumption happens — only its
  // total relative to generation. Occupancy pattern is a reasonable signal
  // for whether that blind spot cuts in a particular direction: a household
  // that's usually out on weekdays is more likely to have its consumption
  // concentrated outside midday solar hours than the annual total alone
  // would suggest, which would make real self-consumption lower than this
  // result's formula-driven estimate, not higher. Not shown for
  // 'usuallyHome' households, since there's no comparably clear directional
  // case that the annual approximation is biased for them specifically.
  if (occupancy === 'usuallyOut') {
    flags.push({
      id: 'occupancyMayLowerRealSelfConsumption',
      tier: 'Inference',
      title: "Usually out during the day? Your real self-consumption may be lower than this",
      note: "This result's self-consumption figure comes from your annual generation-to-consumption ratio (DESNZ's Home Energy Model formula), not from your occupancy pattern directly — it assumes your consumption is reasonably well spread across the day. If you're usually out on weekdays, your actual consumption is more likely concentrated in the morning/evening, outside peak solar hours, which would make your real self-consumption (and savings) lower than this estimate. A battery or a smart diverter for a timed load (immersion heater, EV charger) can close some of that gap.",
    });
  }

  if (paybackAssumesInverterReplacement) {
    flags.push({
      id: 'inverterReplacementFactored',
      tier: 'Inference',
      title: 'This payback figure includes one inverter replacement',
      note: `Your unadjusted payback (${Math.round(naivePaybackYears * 10) / 10}yr) ran past a typical string inverter's working life, so this result adds one replacement (£${INVERTER_REPLACEMENT_COST_GBP}, around year ${INVERTER_REPLACEMENT_YEAR} — a consumer-guide-sourced estimate, no MCS/government figure found) to the payback math. Panels themselves are commonly warrantied well beyond this; the inverter is the part that typically needs mid-life replacement.`,
    });
  }

  result.flags = flags;

  return result;
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
// [Fact — confirmed via a live end-to-end test, 25 Jul 2026] The full chained
// lookup (postcode -> GSP region -> current default product -> that
// product's live unit rate) was run against the real API for 4 real UK
// postcodes across 4 different GSP regions, reproducing this file's exact
// fetch logic. This surfaced two real bugs, both fixed as a direct result of
// running the test rather than just reading the docs:
//   1. lookupCurrentOctopusVariableProduct()'s "most recently launched"
//      heuristic picked a niche specialty product ("Snug Octopus") over the
//      actual flagship "Flexible Octopus" default, since Octopus launches
//      niche variable tariffs more often than it reissues the flagship one.
//      Fixed by preferring an exact name match on the flagship product.
//   2. lookupOctopusUnitRate() built the tariff code using groupId verbatim
//      (e.g. "E-1R-{product}-_C"), but Octopus's tariff-code convention
//      drops the GSP region's leading underscore (the real code is
//      "E-1R-{product}-C") — the underscored form 200s with a "no tariff
//      matches" error body instead of a rate. Fixed by stripping it.
// After both fixes, all 4 test postcodes returned real rates landing within
// ~0.3p of the static ELECTRICITY_PRICE_PENCE_PER_KWH_DEFAULT above, as
// expected. What this test could NOT confirm: an actual browser (Chromium
// via Playwright, launched fresh for this check) could not reach the
// internet at all in this session — every outbound HTTPS request failed
// with ERR_CONNECTION_RESET, including to postcodes.io and Open-Meteo,
// which a *different* session's live browser test confirmed working
// earlier (see those functions' own comments). Diagnosed via this session's
// proxy status endpoint, which showed no relay attempt ever reached it for
// any of these hosts — a browser-level network restriction specific to this
// session, not a targeted block on Octopus, and not evidence those earlier
// browser confirmations were wrong. The direct-HTTP chained test above is a
// strictly stronger check of the actual request/response contract this code
// depends on than a browser test would have added on top of it; what a
// browser test would still catch that this doesn't is a real CORS rejection
// specific to Octopus's API — unconfirmed either way, though Open-Meteo and
// postcodes.io both turned out to be CORS-open, and Octopus's own headers
// (checked via curl, same session) return `Access-Control-Allow-Origin: *`,
// so a CORS block here would be a surprise, not the expected case.
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
  // [Bug found via live end-to-end test, 25 Jul 2026 — see OCTOPUS_BASE_URL's
  // comment for the full test] Sorting by most-recently-launched alone picks
  // whatever niche variable product Octopus happened to launch last (e.g.
  // "Snug Octopus," a smart/time-of-use product) over the actual long-running
  // flagship default "Flexible Octopus" — Octopus launches specialty variable
  // tariffs more often than it reissues the flagship one, so recency isn't a
  // reliable proxy for "the standard one most people are on." Prefer an exact
  // name match on the flagship product; fall back to the recency heuristic
  // only if Octopus ever renames or retires it.
  const flagship = candidates.find((p) => p.display_name === 'Flexible Octopus');
  candidates.sort((a, b) => new Date(b.available_from) - new Date(a.available_from));
  const product = flagship || candidates[0];
  return { ok: true, productCode: product.code, displayName: product.display_name };
}

/**
 * Fetches the current standard-unit-rate (Direct Debit, pence/kWh inc VAT)
 * for a given Octopus product code + GSP region, via the single-register
 * electricity tariff code convention (E-1R-{productCode}-{region letter}).
 * @param {string} productCode
 * @param {string} groupId - e.g. "_C", from lookupGspRegion() (leading
 *   underscore stripped internally before building the tariff code)
 */
async function lookupOctopusUnitRate(productCode, groupId) {
  // [Bug found via live end-to-end test, 25 Jul 2026 — see OCTOPUS_BASE_URL's
  // comment] groupId comes back from the GSP lookup with a leading underscore
  // (e.g. "_C"), matching the region keys inside a product's own
  // single_register_electricity_tariffs object — but the actual tariff-code
  // convention Octopus's URLs use is the bare region letter with no
  // underscore ("E-1R-VAR-22-11-01-C", not "...-_C"). Using groupId verbatim
  // silently 200s with a "no tariff matches" error body instead of a real
  // rate. Confirmed against 4 real regions after this fix.
  const regionLetter = groupId.replace(/^_/, '');
  const tariffCode = `E-1R-${productCode}-${regionLetter}`;
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
      tier: "Inference — live-fetched from Octopus Energy's public API, confirmed end-to-end via a direct-HTTP test across 4 real UK regions (25 Jul 2026, see OCTOPUS_BASE_URL's comment); a browser-specific CORS check could not be run this session (network-restricted)",
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
    result.flags.push({ id: 'regulatoryRegime', tier: 'Fact', title: `${lookup.country}: regulatory regime not researched`, country: lookup.country, note: regulatoryNote });
  }
  if (!openMeteo.ok && !REGIONAL_GENERATION_MULTIPLIER[lookup.country]) {
    result.postcodeLookup.note = `No regional generation figure for "${lookup.country}"; used the England-calibrated default.`;
  }
  return result;
}

// --- Plug-in calculator -------------------------------------------------------

/**
 * @param {Object} input
 * @param {'usuallyHome'|'usuallyOut'} input.occupancy - retained for interface symmetry; not used directly (mirrors calculateRooftopViability, where self-consumption is demand-ratio-driven, not occupancy-driven)
 * @param {'southFacing'|'eastWestFacing'|'northFacing'} [input.orientation] - defaults to southFacing (the figure PLUGIN_ANNUAL_GENERATION_KWH is itself calibrated to) if omitted
 * @param {number} [input.electricityPricePencePerKwh] - the user's own known rate; falls back to the Ofgem price-cap default if omitted
 * @param {number} [input.annualConsumptionKwh] - household's own annual electricity use, e.g. from estimateAnnualConsumptionKwh() or a bill; if given, self-consumption is computed the same way as rooftop's (see selfConsumptionFactorFromDemandRatio) instead of assuming the full amount is self-consumed
 */
function calculatePluginViability({ occupancy, orientation, electricityPricePencePerKwh, annualConsumptionKwh }) {
  const usedOrientation = orientation ?? 'southFacing';
  const orientationMultiplier = pluginOrientationMultiplier(usedOrientation);
  const generation = Math.round(PLUGIN_ANNUAL_GENERATION_KWH * orientationMultiplier);
  const usedElectricityPrice = electricityPricePencePerKwh ?? ELECTRICITY_PRICE_PENCE_PER_KWH_DEFAULT;
  const electricityPriceIsUserProvided = electricityPricePencePerKwh != null;

  // CORRECTED 1 Aug 2026: this function previously treated 100% of
  // generation as self-consumed, with no export/unmet-demand concept at
  // all — a real gap, not just an unresearched simplification like the
  // constants below. Plug-in kits have no export meter or SEG tracking, so
  // a household away during the day gets nothing for a midday generation
  // spike that exceeds its baseload demand: that surplus is fed to the grid
  // for free, not banked as savings, unlike rooftop's SEG-credited export.
  // When annualConsumptionKwh is available, self-consumption is now modeled
  // the same way as rooftop's (selfConsumptionFactorFromDemandRatio, DESNZ
  // HEM's own formula) and any unconsumed generation earns nothing at all
  // (no SEG-equivalent for plug-in). When it isn't available (this input is
  // optional, since a plug-in kit's own onboarding may be lighter-weight
  // than rooftop's), this falls back to the old fully-self-consumed
  // assumption, but that fallback is now named as a real overstatement risk
  // in the result's flags/assumptions, not silently presented as fine.
  const hasConsumptionInput = annualConsumptionKwh != null && annualConsumptionKwh > 0;
  const selfConsumptionRate = hasConsumptionInput ? selfConsumptionFactorFromDemandRatio(generation, annualConsumptionKwh) : 1;
  const selfConsumedKwh = hasConsumptionInput ? Math.min(generation * selfConsumptionRate, annualConsumptionKwh) : generation;
  const unselfConsumedKwh = generation - selfConsumedKwh;

  const annualSavingsGbp = (selfConsumedKwh * usedElectricityPrice) / 100;
  const paybackYears = PLUGIN_KIT_COST_GBP / annualSavingsGbp;
  const status = scoreStatus(paybackYears, PLUGIN_PAYBACK_THRESHOLDS);

  const flags = [];
  if (!hasConsumptionInput) {
    flags.push({
      id: 'pluginSelfConsumptionUnverified',
      tier: 'Assumption',
      title: 'This result assumes every unit generated is used, which may overstate savings',
      note: "No household consumption figure was given, so this result falls back to assuming 100% of the kit's generation is self-consumed. Plug-in kits have no export meter, so any generation your home isn't using at that moment is fed to the grid for free, not credited as savings. If you're often out during the day, or your generation regularly exceeds what a small appliance load draws at once, your real savings are likely lower than this. Give your annual electricity use for a more realistic estimate.",
    });
  } else if (unselfConsumedKwh / generation > 0.15) {
    flags.push({
      id: 'pluginUnselfConsumedShare',
      tier: 'Inference',
      title: 'A meaningful share of this kit\'s generation is projected to go unused',
      note: `Based on your annual consumption, roughly ${Math.round((unselfConsumedKwh / generation) * 100)}% of this kit's generation (${Math.round(unselfConsumedKwh)}kWh/yr) is projected to exceed what your household draws at the time it's generated. Plug-in kits have no export meter, so that portion earns nothing — it isn't credited as savings, unlike rooftop's SEG-paid export.`,
    });
  }

  return {
    segment: 'plugin',
    status,
    paybackYears: Math.round(paybackYears * 10) / 10,
    annualSavingsGbp: Math.round(annualSavingsGbp),
    kitCostGbp: PLUGIN_KIT_COST_GBP,
    generationKwh: generation,
    selfConsumedKwh: Math.round(selfConsumedKwh),
    unselfConsumedKwh: Math.round(unselfConsumedKwh),
    legalStatus: PLUGIN_LEGAL_STATUS,
    flags,
    assumptions: {
      electricityPricePencePerKwh: electricityPriceIsUserProvided
        ? { value: usedElectricityPrice, tier: 'User-provided', note: 'Your own stated rate' }
        : { value: usedElectricityPrice, tier: 'Fact (default)', note: "Ofgem price cap, Jul-Sep 2026, changes quarterly, and applies only to default/standard-variable tariffs — if you're on a fixed deal, enter your own rate for an accurate result" },
      kitCostGbp: { value: PLUGIN_KIT_COST_GBP, tier: 'Assumption — weakest-sourced figure in this calculator', note: 'Reported range £400-900; none of these figures trace to a government, MCS, or established consumer body' },
      generationKwh: {
        value: generation,
        tier: 'Assumption, stacked on another Assumption — weakest-sourced figure in this calculator',
        note:
          usedOrientation === 'southFacing'
            ? 'Reported range 640-900kWh/yr, same sourcing caveat as kit cost. Treated as the south-facing baseline (the range itself does not specify an assumed orientation).'
            : `${PLUGIN_ANNUAL_GENERATION_KWH}kWh/yr south-facing baseline (reported range 640-900kWh/yr, same sourcing caveat as kit cost) adjusted by rooftop's own ${usedOrientation === 'eastWestFacing' ? 'east/west' : 'north-facing'} ratio (${Math.round(orientationMultiplier * 100)}% of south) — no orientation-specific plug-in data exists, so this borrows rooftop's proportional estimate rather than presenting plug-in as orientation-agnostic.`,
      },
      selfConsumptionRate: hasConsumptionInput
        ? {
            value: Math.round(selfConsumptionRate * 1000) / 1000,
            tier: 'Inference — DESNZ Home Energy Model formula, applied annually rather than per-timestep',
            note: `Computed from the ratio of this kit's generation (${generation}kWh) to your annual consumption (${annualConsumptionKwh}kWh), same formula and same annual-approximation caveat as the rooftop calculator (see calculateRooftopViability). Any generation beyond this rate is assumed to earn nothing, since plug-in kits have no export meter.`,
          }
        : {
            value: 1,
            tier: 'Assumption, not verified for this result',
            note: "No household consumption figure was given, so this defaults to assuming full self-consumption — the weakest assumption in this calculator's plug-in segment. See the pluginSelfConsumptionUnverified flag.",
          },
      paybackYears: {
        value: Math.round(paybackYears * 10) / 10,
        tier: 'Design judgment',
        note: `The green/amber/red cutoffs (≤${PLUGIN_PAYBACK_THRESHOLDS.green}yr / ≤${PLUGIN_PAYBACK_THRESHOLDS.amber}yr / longer) are this calculator's own design judgment, not a personalized recommendation — how long you plan to keep the kit and how you weigh upfront cost against long-term saving both change what counts as a good payback for you specifically. Weigh the raw number above against your own plans rather than the color alone. (No inverter-replacement adjustment is modeled here, unlike rooftop's payback figure — no cost research exists at plug-in's much smaller scale.)`,
      },
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
  estimateSystemSizeFromRoofArea,
  selfConsumptionFactorFromDemandRatio,
  constants: {
    ELECTRICITY_PRICE_PENCE_PER_KWH_DEFAULT,
    SEG_RATE_PENCE_PER_KWH_DEFAULT,
    SEG_TARIFFS,
    ROOFTOP_SYSTEM_COST_GBP,
    ROOFTOP_ANNUAL_GENERATION_KWH,
    REFERENCE_SYSTEM_SIZE_KWP,
    ROOF_AREA_PER_PANEL_M2,
    PANEL_WATTAGE_KWP,
    COST_PER_KWP_GBP_BY_TIER,
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
    SELF_CONSUMPTION_DEMAND_RATIO_COEFFICIENT,
    SELF_CONSUMPTION_DEMAND_RATIO_EXPONENT,
    ROOFTOP_PAYBACK_THRESHOLDS,
    PLUGIN_PAYBACK_THRESHOLDS,
    INVERTER_REPLACEMENT_COST_GBP,
    INVERTER_REPLACEMENT_YEAR,
    PLUGIN_LEGAL_STATUS,
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SunnySideUpCalculator;
}
if (typeof window !== 'undefined') {
  window.SunnySideUpCalculator = SunnySideUpCalculator;
}
