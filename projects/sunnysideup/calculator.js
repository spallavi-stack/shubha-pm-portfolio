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
 */

// --- Constants -------------------------------------------------------------

// [Fact] Ofgem price cap, Direct Debit standard variable tariff, 1 Jul-30 Sep
// 2026. grounding-research.md §Electricity price. Time-sensitive (changes
// quarterly), and applies only to default/standard-variable tariffs — many
// households are on a fixed deal above or below it, per the same section.
// Used as a DEFAULT only; calculateRooftopViability accepts a real
// electricityPricePencePerKwh from the user and prefers it when given.
const ELECTRICITY_PRICE_PENCE_PER_KWH_DEFAULT = 26.11;

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
const SEG_RATE_PENCE_PER_KWH_DEFAULT = 4.0;

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

// --- Rooftop calculator -------------------------------------------------------

/**
 * @param {Object} input
 * @param {'southFacing'|'eastWestFacing'|'northFacing'} input.orientation
 * @param {'usuallyHome'|'usuallyOut'} input.occupancy
 * @param {number} input.annualConsumptionKwh - household's own annual electricity use
 * @param {number} [input.electricityPricePencePerKwh] - the user's own known rate; falls back to the Ofgem price-cap default if omitted
 * @param {number} [input.segRatePencePerKwh] - a specific SEG tariff's rate, e.g. from findSegTariff(); falls back to the no-switch-needed baseline default if omitted
 * @param {string} [input.segTariffLabel] - "Supplier — Tariff name" for display, if segRatePencePerKwh came from a specific named tariff rather than a manually-typed number
 * @param {string} [input.segTariffSource] - the named source for that tariff row (e.g. "Ofgem SEG Licensee Register"), if available
 * @param {Object} [input.regionalGeneration] - a REGIONAL_GENERATION_MULTIPLIER entry, e.g. from resolvePostcodeRegion(); omit to use the England-calibrated baseline unchanged
 */
function calculateRooftopViability({
  orientation,
  occupancy,
  annualConsumptionKwh,
  electricityPricePencePerKwh,
  segRatePencePerKwh,
  segTariffLabel,
  segTariffSource,
  regionalGeneration,
}) {
  const baseGeneration = ROOFTOP_ANNUAL_GENERATION_KWH[orientation];
  const generation = regionalGeneration ? Math.round(baseGeneration * regionalGeneration.value) : baseGeneration;
  const selfConsumptionRate = SELF_CONSUMPTION_RATE[occupancy];
  const selfConsumedKwh = Math.min(generation * selfConsumptionRate, annualConsumptionKwh);
  const exportedKwh = generation - selfConsumedKwh;

  const usedElectricityPrice = electricityPricePencePerKwh ?? ELECTRICITY_PRICE_PENCE_PER_KWH_DEFAULT;
  const usedSegRate = segRatePencePerKwh ?? SEG_RATE_PENCE_PER_KWH_DEFAULT;
  const electricityPriceIsUserProvided = electricityPricePencePerKwh != null;
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
      generationKwh: regionalGeneration
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

/**
 * Postcode-aware wrapper around calculateRooftopViability: resolves the
 * postcode to a country via postcodes.io, applies that country's generation
 * multiplier and any unresearched-regulatory-regime flag, then delegates the
 * actual scoring to the pure, synchronous calculateRooftopViability. On a
 * failed/unresolvable postcode, falls back to the unadjusted England
 * baseline rather than blocking the calculation.
 * @param {string} postcode
 * @param {Object} otherInputs - same shape as calculateRooftopViability's input, minus regionalGeneration
 */
async function calculateRooftopViabilityByPostcode(postcode, otherInputs) {
  const lookup = await lookupPostcodeRegion(postcode);
  if (!lookup.ok) {
    const result = calculateRooftopViability(otherInputs);
    result.postcodeLookup = { ok: false, error: lookup.error };
    return result;
  }
  const regionalGeneration = REGIONAL_GENERATION_MULTIPLIER[lookup.country];
  const result = calculateRooftopViability({ ...otherInputs, regionalGeneration });
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
  if (!regionalGeneration) {
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
  getSegTariffs,
  findSegTariff,
  constants: {
    ELECTRICITY_PRICE_PENCE_PER_KWH_DEFAULT,
    SEG_RATE_PENCE_PER_KWH_DEFAULT,
    SEG_TARIFFS,
    ROOFTOP_SYSTEM_COST_GBP,
    ROOFTOP_ANNUAL_GENERATION_KWH,
    REGIONAL_GENERATION_MULTIPLIER,
    REGIONS_WITH_UNRESEARCHED_REGULATORY_REGIME,
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
