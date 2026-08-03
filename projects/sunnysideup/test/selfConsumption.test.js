const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { selfConsumptionFactorFromDemandRatio, constants } = require('../calculator.js');

const { SELF_CONSUMPTION_DEMAND_RATIO_COEFFICIENT: COEFF, SELF_CONSUMPTION_DEMAND_RATIO_EXPONENT: EXP } = constants;

describe('selfConsumptionFactorFromDemandRatio', () => {
  test('returns 0 when generation is 0', () => {
    assert.equal(selfConsumptionFactorFromDemandRatio(0, 4000), 0);
  });

  test('returns 0 when generation is negative', () => {
    assert.equal(selfConsumptionFactorFromDemandRatio(-100, 4000), 0);
  });

  test('returns 0 when consumption is 0', () => {
    assert.equal(selfConsumptionFactorFromDemandRatio(3800, 0), 0);
  });

  test('returns 0 when consumption is negative', () => {
    assert.equal(selfConsumptionFactorFromDemandRatio(3800, -100), 0);
  });

  test('matches the hand-computed HEM formula for a normal demand ratio', () => {
    const generationKwh = 3800;
    const consumptionKwh = 4000;
    const demandRatio = generationKwh / consumptionKwh;
    const expected = Math.min(COEFF * demandRatio ** EXP, 1, 1 / demandRatio);
    assert.equal(selfConsumptionFactorFromDemandRatio(generationKwh, consumptionKwh), expected);
  });

  test('caps at 1 when generation is much smaller than consumption (low demand ratio)', () => {
    const factor = selfConsumptionFactorFromDemandRatio(300, 100000);
    assert.equal(factor, 1);
  });

  test('caps via the 1/demandRatio ceiling when generation greatly exceeds consumption', () => {
    const generationKwh = 100000;
    const consumptionKwh = 1000;
    const demandRatio = generationKwh / consumptionKwh; // 100
    const rawFactor = COEFF * demandRatio ** EXP;
    const factor = selfConsumptionFactorFromDemandRatio(generationKwh, consumptionKwh);
    // The 1/demandRatio ceiling (0.01) should be the binding constraint here,
    // not the raw formula value or the flat 1 cap.
    assert.ok(rawFactor > 1 / demandRatio, 'test fixture should exercise the 1/demandRatio ceiling, not the raw formula');
    assert.equal(factor, 1 / demandRatio);
  });
});
