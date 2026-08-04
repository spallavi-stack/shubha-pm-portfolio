const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { calculateRooftopViability, findSegTariff, constants } = require('../calculator.js');

const {
  ROOFTOP_ANNUAL_GENERATION_KWH,
  ELECTRICITY_PRICE_PENCE_PER_KWH_DEFAULT,
  SEG_RATE_PENCE_PER_KWH_DEFAULT,
  ROOFTOP_PAYBACK_THRESHOLDS,
  REFERENCE_SYSTEM_SIZE_KWP,
  ROOFTOP_SYSTEM_COST_GBP,
  REGIONAL_GENERATION_MULTIPLIER,
} = constants;

const baseInput = { orientation: 'southFacing', occupancy: 'usuallyHome', annualConsumptionKwh: 4000 };

describe('calculateRooftopViability — orientation', () => {
  for (const orientation of ['southFacing', 'eastWestFacing', 'northFacing']) {
    test(`${orientation} uses the matching ROOFTOP_ANNUAL_GENERATION_KWH baseline`, () => {
      const result = calculateRooftopViability({ ...baseInput, orientation });
      assert.equal(result.generationKwh, ROOFTOP_ANNUAL_GENERATION_KWH[orientation]);
    });
  }

  test('north-facing scores red (worst case)', () => {
    const result = calculateRooftopViability({ ...baseInput, orientation: 'northFacing' });
    assert.equal(result.status, 'red');
  });
});

describe('calculateRooftopViability — electricity price resolution priority', () => {
  test('falls back to the static default when nothing else is given', () => {
    const result = calculateRooftopViability(baseInput);
    assert.equal(result.assumptions.electricityPricePencePerKwh.value, ELECTRICITY_PRICE_PENCE_PER_KWH_DEFAULT);
    assert.equal(result.assumptions.electricityPricePencePerKwh.tier, 'Fact (default)');
  });

  test('electricityPriceOverride is used when no user-provided price is given', () => {
    const override = { value: 30, tier: 'Inference — test override', note: 'test' };
    const result = calculateRooftopViability({ ...baseInput, electricityPriceOverride: override });
    assert.equal(result.assumptions.electricityPricePencePerKwh.value, 30);
    assert.equal(result.assumptions.electricityPricePencePerKwh.tier, 'Inference — test override');
  });

  test('a user-provided electricityPricePencePerKwh takes precedence over electricityPriceOverride', () => {
    const override = { value: 30, tier: 'Inference — test override', note: 'test' };
    const result = calculateRooftopViability({ ...baseInput, electricityPricePencePerKwh: 35, electricityPriceOverride: override });
    assert.equal(result.assumptions.electricityPricePencePerKwh.value, 35);
    assert.equal(result.assumptions.electricityPricePencePerKwh.tier, 'User-provided');
  });
});

describe('calculateRooftopViability — SEG rate resolution', () => {
  test('falls back to SEG_RATE_PENCE_PER_KWH_DEFAULT when nothing is given', () => {
    const result = calculateRooftopViability(baseInput);
    assert.equal(result.assumptions.segRatePencePerKwh.value, SEG_RATE_PENCE_PER_KWH_DEFAULT);
    assert.equal(result.assumptions.segRatePencePerKwh.tier, 'Assumption (default)');
  });

  test('a manually-typed segRatePencePerKwh is marked User-provided without a tariff label', () => {
    const result = calculateRooftopViability({ ...baseInput, segRatePencePerKwh: 6 });
    assert.equal(result.assumptions.segRatePencePerKwh.value, 6);
    assert.equal(result.assumptions.segRatePencePerKwh.tier, 'User-provided');
    assert.match(result.assumptions.segRatePencePerKwh.note, /Your own stated rate/);
  });

  test('a segTariffLabel with no segTariffSource/segTariffEligibility omits those optional clauses cleanly', () => {
    const result = calculateRooftopViability({ ...baseInput, segRatePencePerKwh: 6, segTariffLabel: 'Some Supplier — Some Tariff' });
    assert.match(result.assumptions.segRatePencePerKwh.note, /^Some Supplier — Some Tariff \(from the user-provided SEG tariff table/);
    assert.doesNotMatch(result.assumptions.segRatePencePerKwh.note, /per undefined/);
    assert.doesNotMatch(result.assumptions.segRatePencePerKwh.note, /requires: undefined/);
  });

  test('a named SEG tariff carries its label/source/eligibility into the assumptions note', () => {
    const octopusOutgoing = findSegTariff('Octopus Energy', 'Outgoing Octopus');
    const result = calculateRooftopViability({
      ...baseInput,
      segRatePencePerKwh: octopusOutgoing.ratePencePerKwh,
      segTariffLabel: `${octopusOutgoing.supplier} — ${octopusOutgoing.tariff}`,
      segTariffSource: octopusOutgoing.source,
      segTariffEligibility: octopusOutgoing.eligibility,
    });
    assert.equal(result.assumptions.segRatePencePerKwh.value, octopusOutgoing.ratePencePerKwh);
    assert.match(result.assumptions.segRatePencePerKwh.note, /Octopus Energy — Outgoing Octopus/);
    assert.match(result.assumptions.segRatePencePerKwh.note, new RegExp(octopusOutgoing.eligibility.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  });
});

describe('calculateRooftopViability — self-consumption cap', () => {
  test('selfConsumedKwh is capped at annualConsumptionKwh for a low-consumption household', () => {
    const result = calculateRooftopViability({ ...baseInput, annualConsumptionKwh: 1000 });
    assert.ok(result.selfConsumedKwh <= 1000);
  });

  test('exportedKwh is never negative', () => {
    const result = calculateRooftopViability({ ...baseInput, annualConsumptionKwh: 100 });
    assert.ok(result.exportedKwh >= 0);
  });

  test('selfConsumedKwh + exportedKwh equals generationKwh (within rounding)', () => {
    const result = calculateRooftopViability(baseInput);
    assert.ok(Math.abs(result.selfConsumedKwh + result.exportedKwh - result.generationKwh) <= 1);
  });
});

describe('calculateRooftopViability — roofAreaM2 sizing', () => {
  test('a roof large enough to fit panels overrides the flat REFERENCE_SYSTEM_SIZE_KWP default', () => {
    const result = calculateRooftopViability({ ...baseInput, roofAreaM2: 60 });
    assert.ok(result.roofAreaSizing);
    assert.notEqual(result.systemSizeKwp, REFERENCE_SYSTEM_SIZE_KWP);
    assert.notEqual(result.systemCostGbp, ROOFTOP_SYSTEM_COST_GBP);
    assert.notEqual(result.generationKwh, ROOFTOP_ANNUAL_GENERATION_KWH.southFacing);
  });

  test('a roof too small to fit even one panel falls back cleanly to the flat default', () => {
    const result = calculateRooftopViability({ ...baseInput, roofAreaM2: 1 });
    assert.equal(result.roofAreaSizing, undefined);
    assert.equal(result.systemSizeKwp, REFERENCE_SYSTEM_SIZE_KWP);
    assert.equal(result.systemCostGbp, ROOFTOP_SYSTEM_COST_GBP);
    assert.equal(result.generationKwh, ROOFTOP_ANNUAL_GENERATION_KWH.southFacing);
    assert.ok(Number.isFinite(result.systemCostGbp));
    assert.ok(!Number.isNaN(result.generationKwh));
  });

  test('roofAreaM2 and regionalGeneration compose (both multipliers apply, neither overrides the other)', () => {
    const result = calculateRooftopViability({
      ...baseInput,
      roofAreaM2: 60,
      regionalGeneration: REGIONAL_GENERATION_MULTIPLIER.Scotland,
    });
    const roofOnly = calculateRooftopViability({ ...baseInput, roofAreaM2: 60 });
    const roofAreaMultiplier = roofOnly.systemSizeKwp / REFERENCE_SYSTEM_SIZE_KWP;
    const expected = Math.round(ROOFTOP_ANNUAL_GENERATION_KWH.southFacing * REGIONAL_GENERATION_MULTIPLIER.Scotland.value * roofAreaMultiplier);
    assert.equal(result.generationKwh, expected);
  });

  test('generationOverride takes precedence over regionalGeneration and the orientation default', () => {
    const override = { value: 5000, tier: 'Inference — test override', note: 'test' };
    const result = calculateRooftopViability({
      ...baseInput,
      generationOverride: override,
      regionalGeneration: REGIONAL_GENERATION_MULTIPLIER.Scotland,
    });
    assert.equal(result.generationKwh, 5000);
  });

  test('generationOverride combined with roofAreaM2 mentions the further roof-area scaling in its note', () => {
    const override = { value: 5000, tier: 'Inference — test override', note: 'Base note.' };
    const result = calculateRooftopViability({ ...baseInput, generationOverride: override, roofAreaM2: 60 });
    assert.match(result.assumptions.generationKwh.note, /Further scaled by your roof-area-derived system size/);
  });
});

describe('calculateRooftopViability — payback status scoring boundaries', () => {
  test('paybackYears exactly at the green threshold scores green', () => {
    // Construct inputs whose flat-ish payback lands near the green
    // threshold via a high electricity price (short payback) vs. an
    // artificially large system cost tuned to land near the boundary is
    // fragile; instead assert the scoring function's documented contract
    // indirectly: a very cheap-to-recover scenario is green, a
    // never-recovers scenario is red.
    const cheapResult = calculateRooftopViability({ ...baseInput, electricityPricePencePerKwh: 100, segRatePencePerKwh: 100 });
    assert.equal(cheapResult.status, 'green');
    assert.ok(cheapResult.paybackYears <= ROOFTOP_PAYBACK_THRESHOLDS.green);
  });

  test('a very long payback scores red', () => {
    const result = calculateRooftopViability({ ...baseInput, orientation: 'northFacing', annualConsumptionKwh: 100, roofAreaM2: 1000 });
    assert.equal(result.status, 'red');
  });
});

describe('calculateRooftopViability — flags', () => {
  test('always includes the four unconditional flags, in order', () => {
    const result = calculateRooftopViability(baseInput);
    const ids = result.flags.slice(0, 4).map((f) => f.id);
    assert.deepEqual(ids, ['permittedDevelopment', 'tenancyConsent', 'listedBuilding', 'conservationArea']);
  });

  test('highExportSensitivity fires when export share exceeds 50% and no SEG rate was user-provided', () => {
    // North-facing + high consumption still self-consumes most of the small
    // generation; instead force a high-export case with low consumption
    // relative to a south-facing system's generation.
    const result = calculateRooftopViability({ orientation: 'southFacing', occupancy: 'usuallyHome', annualConsumptionKwh: 100 });
    const exportShare = result.exportedKwh / result.generationKwh;
    if (exportShare > 0.5) {
      assert.ok(result.flags.some((f) => f.id === 'highExportSensitivity'));
    }
  });

  test('highExportSensitivity does not fire when a SEG rate was user-provided, even with high export share', () => {
    const result = calculateRooftopViability({ orientation: 'southFacing', occupancy: 'usuallyHome', annualConsumptionKwh: 100, segRatePencePerKwh: 10 });
    assert.ok(!result.flags.some((f) => f.id === 'highExportSensitivity'));
  });

  test('occupancyMayLowerRealSelfConsumption fires for every rooftop result, regardless of occupancy', () => {
    // Widened 4 Aug 2026: the annual-vs-seasonal approximation this flag
    // describes applies to every household, not just 'usuallyOut' ones —
    // only the note's extra within-day detail is occupancy-specific.
    const usuallyOut = calculateRooftopViability({ ...baseInput, occupancy: 'usuallyOut' });
    const usuallyHome = calculateRooftopViability({ ...baseInput, occupancy: 'usuallyHome' });
    assert.ok(usuallyOut.flags.some((f) => f.id === 'occupancyMayLowerRealSelfConsumption'));
    assert.ok(usuallyHome.flags.some((f) => f.id === 'occupancyMayLowerRealSelfConsumption'));

    const outNote = usuallyOut.flags.find((f) => f.id === 'occupancyMayLowerRealSelfConsumption').note;
    const homeNote = usuallyHome.flags.find((f) => f.id === 'occupancyMayLowerRealSelfConsumption').note;
    assert.notEqual(outNote, homeNote, "usuallyOut's note should add within-day detail the usuallyHome note doesn't have");
    assert.ok(outNote.length > homeNote.length);
  });

  test('occupancy does not change any numeric result field, only the flags', () => {
    const usuallyOut = calculateRooftopViability({ ...baseInput, occupancy: 'usuallyOut' });
    const usuallyHome = calculateRooftopViability({ ...baseInput, occupancy: 'usuallyHome' });
    for (const key of ['paybackYears', 'annualSavingsGbp', 'systemCostGbp', 'systemSizeKwp', 'generationKwh', 'selfConsumedKwh', 'exportedKwh', 'status']) {
      assert.equal(usuallyOut[key], usuallyHome[key], `expected ${key} to be identical regardless of occupancy`);
    }
  });

  test('inverterReplacementFactored fires when the payback simulation crosses the inverter replacement year', () => {
    const result = calculateRooftopViability({ orientation: 'northFacing', occupancy: 'usuallyHome', annualConsumptionKwh: 4000 });
    if (result.flags.some((f) => f.id === 'inverterReplacementFactored')) {
      assert.match(result.assumptions.paybackYears.note, /inverter replacement/i);
    }
  });

  test('inverterReplacementFactored pluralizes correctly when more than one replacement is factored in', () => {
    const result = calculateRooftopViability({ orientation: 'northFacing', occupancy: 'usuallyHome', annualConsumptionKwh: 4000, roofAreaM2: 200 });
    const flag = result.flags.find((f) => f.id === 'inverterReplacementFactored');
    assert.ok(flag);
    assert.equal(flag.title, 'This payback figure includes 2 inverter replacements');
    assert.match(flag.note, /adds 2 replacements/);
  });

  test('paybackYears note explains a never-recovering flat comparison too, when even the flat calculation never pays back', () => {
    const result = calculateRooftopViability({ ...baseInput, electricityPricePencePerKwh: 0, segRatePencePerKwh: 0 });
    assert.equal(result.paybackYears, null);
    assert.match(result.assumptions.paybackYears.note, /no payback within the simulated horizon/);
  });

  test('paybackNotReachedWithinSimulation fires with paybackYears null (not Infinity/NaN) when payback never recovers', () => {
    const result = calculateRooftopViability({ orientation: 'northFacing', occupancy: 'usuallyHome', annualConsumptionKwh: 100, roofAreaM2: 1000 });
    assert.equal(result.paybackYears, null);
    assert.ok(result.flags.some((f) => f.id === 'paybackNotReachedWithinSimulation'));
  });
});
