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

// [Assumption — wide range, re-verify near publication] SEG export tariffs
// span roughly 3-30p/kWh market-wide, are genuinely supplier-specific (there
// is no single "the SEG rate"), and change roughly monthly.
// grounding-research.md §Smart Export Guarantee. 15p is a rough market
// midpoint used as a DEFAULT only; prefer a real segRatePencePerKwh from the
// user (their own supplier's published rate) when given.
const SEG_RATE_PENCE_PER_KWH_DEFAULT = 15;

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

// --- Rooftop calculator -------------------------------------------------------

/**
 * @param {Object} input
 * @param {'southFacing'|'eastWestFacing'|'northFacing'} input.orientation
 * @param {'usuallyHome'|'usuallyOut'} input.occupancy
 * @param {number} input.annualConsumptionKwh - household's own annual electricity use
 * @param {number} [input.electricityPricePencePerKwh] - the user's own known rate; falls back to the Ofgem price-cap default if omitted
 * @param {number} [input.segRatePencePerKwh] - the user's own supplier's published SEG rate; falls back to a rough market-midpoint default if omitted
 */
function calculateRooftopViability({
  orientation,
  occupancy,
  annualConsumptionKwh,
  electricityPricePencePerKwh,
  segRatePencePerKwh,
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
        ? { value: usedSegRate, tier: 'User-provided', note: "Your own supplier's stated rate" }
        : { value: usedSegRate, tier: 'Assumption (default)', note: 'A rough midpoint only — real SEG rates are supplier-specific and range roughly 3-30p/kWh; enter your own supplier\'s rate for an accurate result' },
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
  constants: {
    ELECTRICITY_PRICE_PENCE_PER_KWH_DEFAULT,
    SEG_RATE_PENCE_PER_KWH_DEFAULT,
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
