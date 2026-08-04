const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { calculatePluginViability, constants } = require('../calculator.js');

const { PLUGIN_ANNUAL_GENERATION_KWH, PLUGIN_VERTICAL_ORIENTATION_MULTIPLIER, PLUGIN_PAYBACK_THRESHOLDS, PLUGIN_KIT_COST_GBP } = constants;

describe('calculatePluginViability — orientation', () => {
  test('defaults to southFacing when orientation is omitted', () => {
    const withDefault = calculatePluginViability({ occupancy: 'usuallyHome' });
    const explicit = calculatePluginViability({ occupancy: 'usuallyHome', orientation: 'southFacing' });
    assert.equal(withDefault.generationKwh, explicit.generationKwh);
    assert.equal(withDefault.generationKwh, PLUGIN_ANNUAL_GENERATION_KWH);
  });

  test('east/west uses the vertical-mount-specific 85% ratio, higher than rooftop\'s old 79%', () => {
    const result = calculatePluginViability({ occupancy: 'usuallyHome', orientation: 'eastWestFacing' });
    assert.equal(result.generationKwh, Math.round(PLUGIN_ANNUAL_GENERATION_KWH * PLUGIN_VERTICAL_ORIENTATION_MULTIPLIER.eastWestFacing));
  });

  test('north uses the vertical-mount-specific 40% ratio, lower than rooftop\'s old 50%', () => {
    const result = calculatePluginViability({ occupancy: 'usuallyHome', orientation: 'northFacing' });
    assert.equal(result.generationKwh, Math.round(PLUGIN_ANNUAL_GENERATION_KWH * PLUGIN_VERTICAL_ORIENTATION_MULTIPLIER.northFacing));
  });

  test('north scores meaningfully worse (longer payback) than south', () => {
    const south = calculatePluginViability({ occupancy: 'usuallyHome' });
    const north = calculatePluginViability({ occupancy: 'usuallyHome', orientation: 'northFacing' });
    assert.ok((north.paybackYears ?? Infinity) > (south.paybackYears ?? Infinity));
  });
});

describe('calculatePluginViability — self-consumption without a consumption figure', () => {
  test('falls back to 100% self-consumed, unselfConsumedKwh 0', () => {
    const result = calculatePluginViability({ occupancy: 'usuallyHome' });
    assert.equal(result.selfConsumedKwh, result.generationKwh);
    assert.equal(result.unselfConsumedKwh, 0);
  });

  test('flags pluginSelfConsumptionUnverified as a warning this may overstate savings', () => {
    const result = calculatePluginViability({ occupancy: 'usuallyHome' });
    assert.ok(result.flags.some((f) => f.id === 'pluginSelfConsumptionUnverified'));
  });
});

describe('calculatePluginViability — self-consumption with a consumption figure', () => {
  test('large consumption relative to generation: near-full self-consumption, no unverified/unselfconsumed flags', () => {
    const result = calculatePluginViability({ occupancy: 'usuallyHome', annualConsumptionKwh: 4000 });
    assert.ok(!result.flags.some((f) => f.id === 'pluginSelfConsumptionUnverified'));
    assert.ok(!result.flags.some((f) => f.id === 'pluginUnselfConsumedShare'));
  });

  test('small consumption relative to generation: pluginUnselfConsumedShare fires, savings based on selfConsumedKwh only', () => {
    const result = calculatePluginViability({ occupancy: 'usuallyOut', annualConsumptionKwh: 500 });
    assert.ok(result.unselfConsumedKwh > 0);
    assert.ok(result.flags.some((f) => f.id === 'pluginUnselfConsumedShare'));
    // annualSavingsGbp should reflect only selfConsumedKwh at the default price, not full generationKwh.
    const expectedSavings = Math.round((result.selfConsumedKwh * constants.ELECTRICITY_PRICE_PENCE_PER_KWH_DEFAULT) / 100);
    assert.equal(result.annualSavingsGbp, expectedSavings);
  });

  test('unselfConsumedKwh share exactly at or below the 15% flag threshold does not fire pluginUnselfConsumedShare', () => {
    // A large consumption figure keeps the unselfconsumed share negligible.
    const result = calculatePluginViability({ occupancy: 'usuallyHome', annualConsumptionKwh: 100000 });
    const share = result.unselfConsumedKwh / result.generationKwh;
    assert.ok(share <= 0.15);
    assert.ok(!result.flags.some((f) => f.id === 'pluginUnselfConsumedShare'));
  });
});

describe('calculatePluginViability — no inverter modeling', () => {
  test('never includes an inverterReplacementFactored flag or inverter cost mention regardless of payback length', () => {
    const result = calculatePluginViability({ occupancy: 'usuallyHome', orientation: 'northFacing' });
    assert.ok(!result.flags.some((f) => f.id === 'inverterReplacementFactored'));
    assert.doesNotMatch(result.assumptions.paybackYears.note, /inverter replacement will be/i);
  });

  test('kitCostGbp always equals the flat PLUGIN_KIT_COST_GBP constant (no roof-area-style sizing exists for plug-in)', () => {
    const result = calculatePluginViability({ occupancy: 'usuallyHome' });
    assert.equal(result.kitCostGbp, PLUGIN_KIT_COST_GBP);
  });
});

describe('calculatePluginViability — status scoring', () => {
  test('a strong scenario (high price, full self-consumption, short kit payback) scores green', () => {
    const result = calculatePluginViability({ occupancy: 'usuallyHome', electricityPricePencePerKwh: 100 });
    assert.equal(result.status, 'green');
    assert.ok(result.paybackYears <= PLUGIN_PAYBACK_THRESHOLDS.green);
  });

  test('a poor scenario (north-facing, low price) scores red or amber, never green', () => {
    const result = calculatePluginViability({ occupancy: 'usuallyOut', orientation: 'northFacing', electricityPricePencePerKwh: 5, annualConsumptionKwh: 300 });
    assert.notEqual(result.status, 'green');
  });

  test('paybackYears note explains a never-recovering flat comparison too, when the flat calculation never pays back either', () => {
    const result = calculatePluginViability({ occupancy: 'usuallyHome', electricityPricePencePerKwh: 0 });
    assert.equal(result.paybackYears, null);
    assert.match(result.assumptions.paybackYears.note, /no payback within the simulated horizon/);
  });
});

describe('calculatePluginViability — user-provided rate plausibility', () => {
  const { ELECTRICITY_PRICE_PLAUSIBLE_RANGE_PENCE_PER_KWH } = constants;

  test('electricityPriceUnusual fires for a user-provided price outside the plausible range', () => {
    const result = calculatePluginViability({ occupancy: 'usuallyHome', electricityPricePencePerKwh: ELECTRICITY_PRICE_PLAUSIBLE_RANGE_PENCE_PER_KWH.max + 1 });
    assert.ok(result.flags.some((f) => f.id === 'electricityPriceUnusual'));
  });

  test('electricityPriceUnusual does not fire for a plausible user-provided price or the default', () => {
    const plausible = calculatePluginViability({ occupancy: 'usuallyHome', electricityPricePencePerKwh: 30 });
    const usingDefault = calculatePluginViability({ occupancy: 'usuallyHome' });
    assert.ok(!plausible.flags.some((f) => f.id === 'electricityPriceUnusual'));
    assert.ok(!usingDefault.flags.some((f) => f.id === 'electricityPriceUnusual'));
  });
});
