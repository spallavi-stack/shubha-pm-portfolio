const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const calculator = require('../calculator.js');

describe('SEG_TARIFFS data integrity', () => {
  const tariffs = calculator.constants.SEG_TARIFFS;

  test('is sorted highest to lowest rate', () => {
    for (let i = 1; i < tariffs.length; i += 1) {
      assert.ok(
        tariffs[i - 1].ratePencePerKwh >= tariffs[i].ratePencePerKwh,
        `row ${i - 1} (${tariffs[i - 1].ratePencePerKwh}p) should be >= row ${i} (${tariffs[i].ratePencePerKwh}p)`
      );
    }
  });

  test('every row has all required fields with sane types', () => {
    for (const row of tariffs) {
      assert.equal(typeof row.supplier, 'string');
      assert.ok(row.supplier.length > 0);
      assert.equal(typeof row.tariff, 'string');
      assert.ok(row.tariff.length > 0);
      assert.equal(typeof row.ratePencePerKwh, 'number');
      assert.ok(row.ratePencePerKwh >= 0);
      assert.ok(['Fixed', 'Variable', 'Smart/Variable', 'Wholesale Variable'].includes(row.rateType), `unexpected rateType: ${row.rateType}`);
      assert.equal(typeof row.eligibility, 'string');
      assert.ok(row.eligibility.length > 0);
      assert.equal(typeof row.source, 'string');
      assert.ok(row.source.length > 0);
    }
  });

  test('SEG_RATE_PENCE_PER_KWH_DEFAULT equals the median rate among "open to anyone, no switch needed" tariffs', () => {
    const noSwitchRates = tariffs
      .filter((t) => /open to anyone/i.test(t.eligibility))
      .map((t) => t.ratePencePerKwh)
      .sort((a, b) => a - b);
    assert.ok(noSwitchRates.length > 0, 'expected at least one no-switch-needed tariff in the table');
    const mid = noSwitchRates.length / 2;
    const median = Number.isInteger(mid) ? (noSwitchRates[mid - 1] + noSwitchRates[mid]) / 2 : noSwitchRates[Math.floor(mid)];
    assert.equal(calculator.constants.SEG_RATE_PENCE_PER_KWH_DEFAULT, median);
  });
});

describe('exported public API surface', () => {
  test('SunnySideUpCalculator exports every function this suite depends on', () => {
    const expectedFunctions = [
      'calculateRooftopViability',
      'calculateRooftopViabilityByPostcode',
      'calculatePluginViability',
      'lookupPostcodeRegion',
      'lookupOpenMeteoGeneration',
      'lookupGspRegion',
      'lookupCurrentOctopusVariableProduct',
      'lookupOctopusUnitRate',
      'lookupLiveElectricityPrice',
      'getSegTariffs',
      'findSegTariff',
      'findSegTariffsBySupplier',
      'estimateAnnualConsumptionKwh',
      'estimateSystemSizeFromRoofArea',
      'selfConsumptionFactorFromDemandRatio',
      'simulatePaybackYears',
    ];
    for (const fnName of expectedFunctions) {
      assert.equal(typeof calculator[fnName], 'function', `expected calculator.${fnName} to be a function`);
    }
  });

  test('constants object contains every constant this suite reads directly', () => {
    const expectedConstants = [
      'ELECTRICITY_PRICE_PENCE_PER_KWH_DEFAULT',
      'SEG_RATE_PENCE_PER_KWH_DEFAULT',
      'SEG_TARIFFS',
      'ROOFTOP_SYSTEM_COST_GBP',
      'ROOFTOP_ANNUAL_GENERATION_KWH',
      'REFERENCE_SYSTEM_SIZE_KWP',
      'ROOF_AREA_PER_PANEL_M2',
      'PANEL_WATTAGE_KWP',
      'COST_PER_KWP_GBP_BY_TIER',
      'REGIONAL_GENERATION_MULTIPLIER',
      'REGIONS_WITH_UNRESEARCHED_REGULATORY_REGIME',
      'TDCV_ELECTRICITY_KWH_BY_BAND',
      'HEAT_PUMP_ANNUAL_KWH_ESTIMATE',
      'EV_ANNUAL_HOME_CHARGING_KWH_ESTIMATE',
      'PLUGIN_KIT_COST_GBP',
      'PLUGIN_ANNUAL_GENERATION_KWH',
      'PLUGIN_VERTICAL_ORIENTATION_MULTIPLIER',
      'ROOFTOP_PAYBACK_THRESHOLDS',
      'PLUGIN_PAYBACK_THRESHOLDS',
      'INVERTER_REPLACEMENT_COST_GBP',
      'INVERTER_REPLACEMENT_YEAR',
      'ELECTRICITY_PRICE_ANNUAL_ESCALATION_RATE',
      'PANEL_DEGRADATION_ANNUAL_RATE',
      'PAYBACK_SIMULATION_MAX_YEARS',
      'PLUGIN_LEGAL_STATUS',
    ];
    for (const constName of expectedConstants) {
      assert.notEqual(calculator.constants[constName], undefined, `expected calculator.constants.${constName} to be defined`);
    }
  });
});
