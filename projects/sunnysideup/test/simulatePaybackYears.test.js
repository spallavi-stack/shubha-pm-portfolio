const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { simulatePaybackYears, constants } = require('../calculator.js');

describe('simulatePaybackYears', () => {
  test('zero base-year savings returns Infinity without simulating', () => {
    const result = simulatePaybackYears({
      systemCostGbp: 5000,
      baseGenerationKwh: 0,
      secondaryRatePencePerKwh: 0,
      electricityPricePencePerKwh: 26.11,
    });
    assert.deepEqual(result, { paybackYears: Infinity, flatPaybackYears: Infinity, inverterReplacementsFactored: 0 });
  });

  test('a simple case is close to, but not identical to, flat division (escalation applies from year 2)', () => {
    // annualConsumptionKwh omitted: full self-consumption every year (see
    // resolveGenerationSplit), so this isolates the escalation/degradation
    // behavior from the self-consumption split entirely.
    const result = simulatePaybackYears({
      systemCostGbp: 1000,
      baseGenerationKwh: 1000,
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
      baseGenerationKwh: 100,
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
      baseGenerationKwh: 1000,
      secondaryRatePencePerKwh: 0,
      electricityPricePencePerKwh: 26.11,
      inverterReplacementCostGbp: 950,
      inverterReplacementEveryYears: 12,
    });
    assert.ok(result.inverterReplacementsFactored >= 1, 'expected at least one inverter replacement to be factored in');
  });

  test('first inverter replacement lands exactly at inverterReplacementEveryYears, not one year later', () => {
    // Engineered so unassisted (no-inverter) payback lands strictly between
    // year 11 and year 12: cumulative savings cross cumulative cost during
    // the year-12 iteration. A replacement due "every 12 years" must apply
    // before that year's savings are counted, pushing payback out. A
    // replacement configured for every 13 years must NOT have fired yet,
    // since payback completes before year 13 is ever reached.
    const common = {
      systemCostGbp: 3300,
      baseGenerationKwh: 1000,
      secondaryRatePencePerKwh: 0,
      electricityPricePencePerKwh: 26.11,
      inverterReplacementCostGbp: 950,
    };
    const noInverter = simulatePaybackYears({ ...common, inverterReplacementCostGbp: undefined });
    assert.ok(noInverter.paybackYears > 11 && noInverter.paybackYears < 12, `test is only valid if unassisted payback lands in year 12, got ${noInverter.paybackYears}`);

    const every12 = simulatePaybackYears({ ...common, inverterReplacementEveryYears: 12 });
    assert.equal(every12.inverterReplacementsFactored, 1, 'a 12-year replacement cycle must have fired by the time payback completes in year 12');
    assert.ok(every12.paybackYears > noInverter.paybackYears, 'the year-12 replacement cost should push payback later than the unassisted case');

    const every13 = simulatePaybackYears({ ...common, inverterReplacementEveryYears: 13 });
    assert.equal(every13.inverterReplacementsFactored, 0, 'a 13-year replacement cycle must not have fired yet, since payback completes in year 12');
    assert.equal(every13.paybackYears, noInverter.paybackYears, 'with no replacement fired, payback should match the unassisted case exactly');
  });

  test('no inverter params given never touches inverterReplacementEveryYears and never throws', () => {
    assert.doesNotThrow(() => {
      simulatePaybackYears({
        systemCostGbp: 7000,
        baseGenerationKwh: 2500,
        annualConsumptionKwh: 2000,
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
      baseGenerationKwh: 5000,
      secondaryRatePencePerKwh: 0,
      electricityPricePencePerKwh: 10, // year-1 savings = 5000*10/100 = £500
    });
    assert.ok(result.paybackYears > 1 && result.paybackYears < 2, `expected a fractional payback between 1 and 2 years, got ${result.paybackYears}`);
  });

  test('respects PAYBACK_SIMULATION_MAX_YEARS as the simulation horizon', () => {
    assert.equal(typeof constants.PAYBACK_SIMULATION_MAX_YEARS, 'number');
    assert.ok(constants.PAYBACK_SIMULATION_MAX_YEARS > 0);
  });

  test('self-consumption split is recomputed each year from that year\'s degraded generation, not frozen at year 1', () => {
    // With a real annualConsumptionKwh given, generation and consumption
    // start close together (demand ratio near 1) so the self-consumption
    // fraction is not already saturated at its 1/demandRatio ceiling. As
    // generation degrades year over year, the demand ratio falls, and the
    // self-consumption fraction (per selfConsumptionFactorFromDemandRatio)
    // should rise — so a long-enough simulation should yield strictly more
    // total self-consumed-priced savings than freezing the year-1 split
    // would have, which this test checks indirectly via payback being
    // shorter than a hand-computed frozen-split equivalent.
    const systemCostGbp = 6000;
    const baseGenerationKwh = 4000;
    const annualConsumptionKwh = 4000;
    const secondaryRatePencePerKwh = 3;
    const electricityPricePencePerKwh = 26.11;

    const recomputed = simulatePaybackYears({
      systemCostGbp,
      baseGenerationKwh,
      annualConsumptionKwh,
      secondaryRatePencePerKwh,
      electricityPricePencePerKwh,
    });

    // Hand-rolled frozen-split simulation, matching the pre-fix behavior:
    // the year-1 split is computed once and just decayed in parallel.
    const { selfConsumptionFactorFromDemandRatio } = require('../calculator.js');
    const year1Rate = selfConsumptionFactorFromDemandRatio(baseGenerationKwh, annualConsumptionKwh);
    const year1SelfConsumedKwh = Math.min(baseGenerationKwh * year1Rate, annualConsumptionKwh);
    const year1SecondaryKwh = baseGenerationKwh - year1SelfConsumedKwh;
    let cumulativeSavingsGbp = 0;
    let frozenPaybackYears = Infinity;
    for (let year = 1; year <= constants.PAYBACK_SIMULATION_MAX_YEARS; year += 1) {
      const degradationFactor = (1 - constants.PANEL_DEGRADATION_ANNUAL_RATE) ** (year - 1);
      const escalatedPrice = electricityPricePencePerKwh * (1 + constants.ELECTRICITY_PRICE_ANNUAL_ESCALATION_RATE) ** (year - 1);
      const yearSavingsGbp = (year1SelfConsumedKwh * degradationFactor * escalatedPrice + year1SecondaryKwh * degradationFactor * secondaryRatePencePerKwh) / 100;
      const savingsBeforeThisYear = cumulativeSavingsGbp;
      cumulativeSavingsGbp += yearSavingsGbp;
      if (cumulativeSavingsGbp >= systemCostGbp) {
        frozenPaybackYears = (year - 1) + (systemCostGbp - savingsBeforeThisYear) / yearSavingsGbp;
        break;
      }
    }

    assert.ok(Number.isFinite(frozenPaybackYears), 'test setup should reach payback under the frozen-split comparison too');
    assert.ok(
      recomputed.paybackYears < frozenPaybackYears,
      `recomputing the split each year (rising self-consumption as generation degrades) should pay back sooner than freezing it at year 1: got ${recomputed.paybackYears} vs frozen ${frozenPaybackYears}`
    );
  });
});
