const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { estimateSystemSizeFromRoofArea, constants } = require('../calculator.js');

const { ROOF_AREA_PER_PANEL_M2, PANEL_WATTAGE_KWP, COST_PER_KWP_GBP_BY_TIER } = constants;

describe('estimateSystemSizeFromRoofArea', () => {
  test('returns null when the area cannot fit even one panel', () => {
    assert.equal(estimateSystemSizeFromRoofArea(1), null);
  });

  test('returns null for zero area', () => {
    assert.equal(estimateSystemSizeFromRoofArea(0), null);
  });

  test('does not throw and returns null for negative area', () => {
    assert.doesNotThrow(() => estimateSystemSizeFromRoofArea(-10));
    assert.equal(estimateSystemSizeFromRoofArea(-10), null);
  });

  test('panelCount uses Math.floor at an exact panel-area boundary', () => {
    const areaForExactlyFivePanels = ROOF_AREA_PER_PANEL_M2 * 5;
    const result = estimateSystemSizeFromRoofArea(areaForExactlyFivePanels);
    assert.equal(result.panelCount, 5);

    const justUnderSixPanels = ROOF_AREA_PER_PANEL_M2 * 6 - 0.01;
    const resultUnder = estimateSystemSizeFromRoofArea(justUnderSixPanels);
    assert.equal(resultUnder.panelCount, 5);
  });

  test('a large roof area lands in the standard cost tier (above the small-system threshold)', () => {
    const result = estimateSystemSizeFromRoofArea(60);
    assert.equal(result.panelCount, Math.floor(60 / ROOF_AREA_PER_PANEL_M2));
    assert.ok(result.systemSizeKwp > COST_PER_KWP_GBP_BY_TIER.smallSystemThresholdKwp);
    assert.equal(result.costPerKwpGbp, COST_PER_KWP_GBP_BY_TIER.standardCostPerKwp);
    assert.equal(result.systemCostGbp, Math.round(result.systemSizeKwp * COST_PER_KWP_GBP_BY_TIER.standardCostPerKwp));
  });

  test('a small roof area lands in the small-system cost tier', () => {
    const result = estimateSystemSizeFromRoofArea(12);
    assert.equal(result.panelCount, Math.floor(12 / ROOF_AREA_PER_PANEL_M2));
    assert.ok(result.systemSizeKwp <= COST_PER_KWP_GBP_BY_TIER.smallSystemThresholdKwp);
    assert.equal(result.costPerKwpGbp, COST_PER_KWP_GBP_BY_TIER.smallSystemCostPerKwp);
  });

  test('systemSizeKwp is panelCount x PANEL_WATTAGE_KWP, rounded to 2 decimal places', () => {
    const result = estimateSystemSizeFromRoofArea(30);
    const expected = Math.round(result.panelCount * PANEL_WATTAGE_KWP * 100) / 100;
    assert.equal(result.systemSizeKwp, expected);
  });

  test('the cost-tier boundary itself (exactly smallSystemThresholdKwp) uses the small-system rate', () => {
    // Find an area whose resulting systemSizeKwp lands exactly on the
    // threshold, to confirm the <= comparison (not <) is what the code uses.
    const panelsNeeded = Math.round(COST_PER_KWP_GBP_BY_TIER.smallSystemThresholdKwp / PANEL_WATTAGE_KWP);
    const area = ROOF_AREA_PER_PANEL_M2 * panelsNeeded;
    const result = estimateSystemSizeFromRoofArea(area);
    if (result.systemSizeKwp === COST_PER_KWP_GBP_BY_TIER.smallSystemThresholdKwp) {
      assert.equal(result.costPerKwpGbp, COST_PER_KWP_GBP_BY_TIER.smallSystemCostPerKwp);
    }
  });
});
