const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { estimateAnnualConsumptionKwh, constants } = require('../calculator.js');

const { TDCV_ELECTRICITY_KWH_BY_BAND, HEAT_PUMP_ANNUAL_KWH_ESTIMATE, EV_ANNUAL_HOME_CHARGING_KWH_ESTIMATE } = constants;

describe('estimateAnnualConsumptionKwh — TDCV band boundaries', () => {
  test('household size 1 maps to the low band', () => {
    assert.equal(estimateAnnualConsumptionKwh({ householdSize: 1 }).totalKwh, TDCV_ELECTRICITY_KWH_BY_BAND.low.value);
  });

  test('household size 2 maps to the low band', () => {
    assert.equal(estimateAnnualConsumptionKwh({ householdSize: 2 }).totalKwh, TDCV_ELECTRICITY_KWH_BY_BAND.low.value);
  });

  test('household size 3 maps to the medium band', () => {
    assert.equal(estimateAnnualConsumptionKwh({ householdSize: 3 }).totalKwh, TDCV_ELECTRICITY_KWH_BY_BAND.medium.value);
  });

  test('household size 4 maps to the high band', () => {
    assert.equal(estimateAnnualConsumptionKwh({ householdSize: 4 }).totalKwh, TDCV_ELECTRICITY_KWH_BY_BAND.high.value);
  });

  test('household size 6 (beyond Ofgem\'s stated 4-5 person range) still maps to high, not a throw', () => {
    assert.doesNotThrow(() => estimateAnnualConsumptionKwh({ householdSize: 6 }));
    assert.equal(estimateAnnualConsumptionKwh({ householdSize: 6 }).totalKwh - EV_ANNUAL_HOME_CHARGING_KWH_ESTIMATE * 0, TDCV_ELECTRICITY_KWH_BY_BAND.high.value);
  });
});

describe('estimateAnnualConsumptionKwh — breakdown shape', () => {
  test('household size alone produces only a baseline breakdown entry', () => {
    const result = estimateAnnualConsumptionKwh({ householdSize: 2 });
    assert.deepEqual(Object.keys(result.breakdown), ['baseline']);
  });

  test('hasHeatPump adds exactly HEAT_PUMP_ANNUAL_KWH_ESTIMATE and a heatPump breakdown entry', () => {
    const withoutHeatPump = estimateAnnualConsumptionKwh({ householdSize: 2 });
    const withHeatPump = estimateAnnualConsumptionKwh({ householdSize: 2, hasHeatPump: true });
    assert.equal(withHeatPump.totalKwh - withoutHeatPump.totalKwh, HEAT_PUMP_ANNUAL_KWH_ESTIMATE);
    assert.equal(withHeatPump.breakdown.heatPump.value, HEAT_PUMP_ANNUAL_KWH_ESTIMATE);
  });

  test('hasEv true with evCount omitted defaults to exactly 1 vehicle, not 0 or NaN', () => {
    const result = estimateAnnualConsumptionKwh({ householdSize: 6, hasEv: true });
    assert.equal(result.breakdown.ev.value, EV_ANNUAL_HOME_CHARGING_KWH_ESTIMATE);
  });

  test('hasEv with evCount 2 stacks additively', () => {
    const result = estimateAnnualConsumptionKwh({ householdSize: 3, hasEv: true, evCount: 2 });
    assert.equal(result.breakdown.ev.value, EV_ANNUAL_HOME_CHARGING_KWH_ESTIMATE * 2);
  });

  test('hasHeatPump + hasEv stack together on top of the baseline (full worked example)', () => {
    const result = estimateAnnualConsumptionKwh({ householdSize: 3, hasHeatPump: true, hasEv: true, evCount: 2 });
    const expected = TDCV_ELECTRICITY_KWH_BY_BAND.medium.value + HEAT_PUMP_ANNUAL_KWH_ESTIMATE + 2 * EV_ANNUAL_HOME_CHARGING_KWH_ESTIMATE;
    assert.equal(result.totalKwh, expected);
    assert.deepEqual(Object.keys(result.breakdown).sort(), ['baseline', 'ev', 'heatPump'].sort());
  });

  test('totalKwh is always an integer (Math.round applied)', () => {
    const result = estimateAnnualConsumptionKwh({ householdSize: 3, hasHeatPump: true, hasEv: true, evCount: 3 });
    assert.equal(Number.isInteger(result.totalKwh), true);
  });

  test('hasHeatPump false / hasEv false produce no extra breakdown entries', () => {
    const result = estimateAnnualConsumptionKwh({ householdSize: 3, hasHeatPump: false, hasEv: false });
    assert.deepEqual(Object.keys(result.breakdown), ['baseline']);
  });

  test('baseline note names the household-size-vs-dwelling-size proxy, not just the boundary cutoff', () => {
    // householdSize is occupant count; TDCV_ELECTRICITY_KWH_BY_BAND's own
    // bands are described by dwelling size (bedrooms). The note should say
    // this explicitly, since a large household in a small home (or vice
    // versa) gets a band based on the wrong variable.
    const result = estimateAnnualConsumptionKwh({ householdSize: 4 });
    assert.match(result.breakdown.baseline.note, /your home's actual size/);
  });
});
