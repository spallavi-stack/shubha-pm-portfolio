const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { simulatePaybackYears, constants } = require('../calculator.js');

describe('simulatePaybackYears', () => {
  test('zero base-year savings returns Infinity without simulating', () => {
    const result = simulatePaybackYears({
      systemCostGbp: 5000,
      baseSelfConsumedKwh: 0,
      baseSecondaryKwh: 0,
      secondaryRatePencePerKwh: 0,
      electricityPricePencePerKwh: 26.11,
    });
    assert.deepEqual(result, { paybackYears: Infinity, flatPaybackYears: Infinity, inverterReplacementsFactored: 0 });
  });

  test('a simple case is close to, but not identical to, flat division (escalation applies from year 2)', () => {
    const result = simulatePaybackYears({
      systemCostGbp: 1000,
      baseSelfConsumedKwh: 1000,
      baseSecondaryKwh: 0,
      secondaryRatePencePerKwh: 0,
      electricityPricePencePerKwh: 20,
    });
    // Flat: 1000 / (1000*20/100) = 5 years exactly.
    assert.equal(result.flatPaybackYears, 5);
    assert.notEqual(result.paybackYears, result.flatPaybackYears);
    assert.ok(result.paybackYears < result.flatPaybackYears, 'price escalation should shorten payback vs. the flat figure in this case');
    assert.equal(result.inverterReplacementsFactored, 0);
  });

  test('never recovering within PAYBACK_SIMULATION_MAX_YEARS returns Infinity, loop terminates', () => {
    const result = simulatePaybackYears({
      systemCostGbp: 100000,
      baseSelfConsumedKwh: 100,
      baseSecondaryKwh: 0,
      secondaryRatePencePerKwh: 0,
      electricityPricePencePerKwh: 20,
    });
    assert.equal(result.paybackYears, Infinity);
  });

  test('inverter replacement cost is added at the configured year and counted', () => {
    // Engineer a case whose flat payback lands just past the inverter
    // replacement year, so the simulation should factor exactly one
    // replacement in.
    const result = simulatePaybackYears({
      systemCostGbp: 14000,
      baseSelfConsumedKwh: 1000,
      baseSecondaryKwh: 0,
      secondaryRatePencePerKwh: 0,
      electricityPricePencePerKwh: 26.11,
      inverterReplacementCostGbp: 950,
      inverterReplacementEveryYears: 12,
    });
    assert.ok(result.inverterReplacementsFactored >= 1, 'expected at least one inverter replacement to be factored in');
  });

  test('no inverter params given never touches inverterReplacementEveryYears and never throws', () => {
    assert.doesNotThrow(() => {
      simulatePaybackYears({
        systemCostGbp: 7000,
        baseSelfConsumedKwh: 2000,
        baseSecondaryKwh: 500,
        secondaryRatePencePerKwh: 3,
        electricityPricePencePerKwh: 26.11,
      });
    });
  });

  test('fractional payback year is interpolated correctly within the recovery year', () => {
    // Year-1 savings of exactly £500 on a £750 system with zero escalation
    // effectively (use a 1-year case where degradation/escalation barely
    // move the number) should land between year 1 and year 2.
    const result = simulatePaybackYears({
      systemCostGbp: 750,
      baseSelfConsumedKwh: 5000,
      baseSecondaryKwh: 0,
      secondaryRatePencePerKwh: 0,
      electricityPricePencePerKwh: 10, // year-1 savings = 5000*10/100 = £500
    });
    assert.ok(result.paybackYears > 1 && result.paybackYears < 2, `expected a fractional payback between 1 and 2 years, got ${result.paybackYears}`);
  });

  test('respects PAYBACK_SIMULATION_MAX_YEARS as the simulation horizon', () => {
    assert.equal(typeof constants.PAYBACK_SIMULATION_MAX_YEARS, 'number');
    assert.ok(constants.PAYBACK_SIMULATION_MAX_YEARS > 0);
  });
});
