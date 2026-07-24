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

// [User-provided, 23 July 2026 — not independently fetched or verified by
// this process] A named supplier/tariff SEG rate table for Q2-Q3 2026,
// supplied by the user as a CSV export, each row citing a named source
// (e.g. "Ofgem SEG Licensee Register," a supplier's own export-tariff page,
// or a third-party comparison/league-table site). Named sourcing is real
// and worth more than an anonymous number, but none of these sources have
// actually been fetched and read by this process — treat as usable and
// cited, not upgraded to Fact tier until someone with fetch access spot-
// checks a sample against the named source directly. Sorted highest to
// lowest rate. Tariffs requiring a supplier switch or an install through
// that specific company are named as such — collapsing this into one
// number would hide a real eligibility bar most users won't clear on day one.
const SEG_TARIFFS = [
  { supplier: 'Good Energy', tariff: 'Solar Savings Exclusive', ratePencePerKwh: 25.0, rateType: 'Fixed', eligibility: 'Good Energy import customer + system installed by Good Energy', source: 'Solar Energy UK SEG League Table' },
  { supplier: 'Octopus Energy', tariff: 'Intelligent Octopus Flux', ratePencePerKwh: 23.0, rateType: 'Smart/Variable', eligibility: 'Octopus import customer with compatible solar + battery setup', source: 'Octopus Energy Export Tariffs' },
  { supplier: 'OVO Energy', tariff: 'SEG Install Exclusive', ratePencePerKwh: 20.0, rateType: 'Variable', eligibility: 'OVO import customer + system bought through OVO', source: 'Solar Energy UK SEG League Table' },
  { supplier: 'So Energy', tariff: 'So Bright', ratePencePerKwh: 20.0, rateType: 'Fixed', eligibility: 'Installed solar/battery via So Energy (no import switch needed)', source: 'Uswitch Solar Export Guide' },
  { supplier: 'EDF Energy', tariff: 'Export Exclusive 12m V3', ratePencePerKwh: 18.0, rateType: 'Fixed', eligibility: 'EDF import customer + system installed by EDF / Contact Solar', source: 'Solar Energy UK SEG League Table' },
  { supplier: 'E.ON Next', tariff: 'Next Export Premium v3', ratePencePerKwh: 17.5, rateType: 'Fixed', eligibility: 'E.ON import customer + system installed by E.ON', source: 'Solar Energy UK SEG League Table' },
  { supplier: 'British Gas', tariff: 'Export & Earn Plus', ratePencePerKwh: 15.1, rateType: 'Variable', eligibility: 'British Gas electricity import customer', source: 'British Gas SEG Tariffs' },
  { supplier: 'EDF Energy', tariff: 'Export 12m', ratePencePerKwh: 15.0, rateType: 'Fixed', eligibility: 'EDF electricity import customer', source: 'Uswitch Solar Export Guide' },
  { supplier: 'Good Energy', tariff: 'Solar Savings', ratePencePerKwh: 15.0, rateType: 'Variable', eligibility: 'Good Energy electricity import customer', source: 'Solar Energy UK SEG League Table' },
  { supplier: 'ScottishPower', tariff: 'SmartGen Premium Plus', ratePencePerKwh: 15.0, rateType: 'Variable', eligibility: 'ScottishPower import customer + system installed by ScottishPower', source: 'Solar Energy UK SEG League Table' },
  { supplier: 'E.ON Next', tariff: 'Next Export Exclusive v3', ratePencePerKwh: 13.0, rateType: 'Fixed', eligibility: 'E.ON electricity import customer', source: 'Uswitch Solar Export Guide' },
  { supplier: '100Green', tariff: 'Export Tariff', ratePencePerKwh: 12.0, rateType: 'Variable', eligibility: '100Green electricity import customer', source: 'Ofgem SEG Licensee Register' },
  { supplier: 'Octopus Energy', tariff: 'Outgoing Octopus', ratePencePerKwh: 12.0, rateType: 'Fixed', eligibility: 'Octopus electricity import customer', source: 'Octopus Energy Export Tariffs' },
  { supplier: 'OVO Energy', tariff: 'SEG Beyond Exclusive', ratePencePerKwh: 12.0, rateType: 'Fixed', eligibility: "OVO import customer on 'OVO Beyond' plan", source: 'Uswitch Solar Export Guide' },
  { supplier: 'ScottishPower', tariff: 'SmartGen Premium', ratePencePerKwh: 12.0, rateType: 'Variable', eligibility: 'ScottishPower electricity import customer', source: 'Solar Energy UK SEG League Table' },
  { supplier: 'Fuse Energy', tariff: 'Fuse Export', ratePencePerKwh: 10.0, rateType: 'Variable', eligibility: 'Fuse Energy electricity customer', source: 'Ofgem SEG Licensee Register' },
  { supplier: 'Octopus Energy', tariff: 'Outgoing Agile', ratePencePerKwh: 9.1, rateType: 'Wholesale Variable', eligibility: 'Octopus import customer (tracks 30-min market rates)', source: 'Octopus Energy Export Tariffs' },
  { supplier: 'Utility Warehouse', tariff: 'UW SEG – Bundle', ratePencePerKwh: 8.0, rateType: 'Variable', eligibility: 'UW import customer bundling 2+ additional services', source: 'Solar Energy UK SEG League Table' },
  { supplier: 'E.ON Next', tariff: 'Next Flex Export v1', ratePencePerKwh: 6.0, rateType: 'Variable', eligibility: 'Open to non-customers / E.ON import customers', source: 'Uswitch Solar Export Guide' },
  { supplier: 'ScottishPower', tariff: 'SmartGen', ratePencePerKwh: 6.0, rateType: 'Variable', eligibility: 'Open to anyone (no switch needed)', source: 'Solar Energy UK SEG League Table' },
  { supplier: 'EDF Energy', tariff: 'SEG Export Variable Value', ratePencePerKwh: 5.6, rateType: 'Variable', eligibility: 'EDF residential SEG customers', source: 'Solar Energy UK SEG League Table' },
  { supplier: 'So Energy', tariff: 'So Export Flex', ratePencePerKwh: 4.5, rateType: 'Variable', eligibility: 'Open to anyone (no switch needed)', source: 'Uswitch Solar Export Guide' },
  { supplier: 'Octopus Energy', tariff: 'Smart Export Guarantee', ratePencePerKwh: 4.1, rateType: 'Fixed', eligibility: 'Open to anyone (no switch needed)', source: 'Octopus Energy SEG Official Page' },
  { supplier: 'OVO Energy', tariff: 'Standard SEG', ratePencePerKwh: 4.0, rateType: 'Variable', eligibility: 'Open to anyone (no switch needed)', source: 'Uswitch Solar Export Guide' },
  { supplier: 'British Gas', tariff: 'Standard SEG', ratePencePerKwh: 3.02, rateType: 'Variable', eligibility: 'Open to anyone (no switch needed)', source: 'British Gas SEG Tariffs' },
  { supplier: 'EDF Energy', tariff: 'SEG Export Variable', ratePencePerKwh: 3.0, rateType: 'Variable', eligibility: 'Open to anyone (no switch needed)', source: 'Uswitch Solar Export Guide' },
  { supplier: 'Utilita', tariff: 'Smart Export Guarantee', ratePencePerKwh: 3.0, rateType: 'Variable', eligibility: 'Open to anyone (no switch needed)', source: 'Uswitch Solar Export Guide' },
  { supplier: 'Utility Warehouse', tariff: 'UW SEG – Standard', ratePencePerKwh: 2.0, rateType: 'Variable', eligibility: 'Open to anyone (no switch needed)', source: 'Uswitch Solar Export Guide' },
  { supplier: 'Outfox Energy', tariff: 'Outfox Export', ratePencePerKwh: 1.05, rateType: 'Variable', eligibility: 'Open to anyone (no switch needed)', source: 'Ofgem SEG Licensee Register' },
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
 */
function calculateRooftopViability({
  orientation,
  occupancy,
  annualConsumptionKwh,
  electricityPricePencePerKwh,
  segRatePencePerKwh,
  segTariffLabel,
  segTariffSource,
}) {
  const generation = ROOFTOP_ANNUAL_GENERATION_KWH[orientation];
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
              ? `${segTariffLabel}${segTariffSource ? `, per ${segTariffSource}` : ''} (SEG tariff table, user-provided 23 July 2026, not independently fetched or verified by this process)`
              : "Your own stated rate",
          }
        : {
            value: usedSegRate,
            tier: 'Assumption (default)',
            note: "The no-switch-needed baseline (median of tariffs open to anyone). Switching supplier or installing through a specific company can get a meaningfully higher rate, up to 25p/kWh in the researched tariff table — pick your actual tariff for an accurate result",
          },
      systemCostGbp: { value: ROOFTOP_SYSTEM_COST_GBP, tier: 'Assumption', note: 'Industry-consensus range is £5,500-£8,700; not a quote for your specific roof' },
      generationKwh: { value: generation, tier: orientation === 'southFacing' ? 'Assumption' : 'Prototype estimate, not independently researched', note: 'Researched range is 3,400-4,200kWh/yr for a south-facing 4kW system' },
      selfConsumptionRate: { value: selfConsumptionRate, tier: 'Prototype simplification', note: 'Modeled from occupancy as a rough proxy, not an independently researched figure' },
    },
  };
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
  calculatePluginViability,
  getSegTariffs,
  findSegTariff,
  constants: {
    ELECTRICITY_PRICE_PENCE_PER_KWH_DEFAULT,
    SEG_RATE_PENCE_PER_KWH_DEFAULT,
    SEG_TARIFFS,
    ROOFTOP_SYSTEM_COST_GBP,
    ROOFTOP_ANNUAL_GENERATION_KWH,
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
