const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { estimateSystemSizeFromRoofArea, calculateRooftopViability, constants } = require('../calculator.js');

const { ROOF_AREA_PER_PANEL_M2, PANEL_WATTAGE_KWP, COST_PER_KWP_GBP_BY_TIER, REFERENCE_SYSTEM_SIZE_KWP, ROOFTOP_SYSTEM_COST_GBP, DOMESTIC_SYSTEM_SIZE_SANITY_MAX_KWP } = constants;

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

describe('calculateRooftopViability — roof area too small for any panel', () => {
  // ADDED 4 Aug 2026 (found by a third-party review): a roofAreaM2 that
  // can't fit even one panel previously fell through to the exact same
  // flat-default path, with the exact same "give your roof area" note, as
  // never answering the question at all — this distinguishes the two.
  const baseInput = { orientation: 'southFacing', occupancy: 'usuallyHome', annualConsumptionKwh: 4000 };

  test('roofAreaInsufficientForPanels fires when roofAreaM2 is given but too small for one panel', () => {
    const result = calculateRooftopViability({ ...baseInput, roofAreaM2: 1 });
    const flag = result.flags.find((f) => f.id === 'roofAreaInsufficientForPanels');
    assert.ok(flag, 'expected roofAreaInsufficientForPanels to fire');
    assert.match(flag.note, /1m²/);
  });

  test('roofAreaInsufficientForPanels does not fire when roofAreaM2 is omitted entirely', () => {
    const result = calculateRooftopViability(baseInput);
    assert.ok(!result.flags.some((f) => f.id === 'roofAreaInsufficientForPanels'));
  });

  test('roofAreaInsufficientForPanels does not fire when roofAreaM2 fits at least one panel', () => {
    const result = calculateRooftopViability({ ...baseInput, roofAreaM2: 30 });
    assert.ok(!result.flags.some((f) => f.id === 'roofAreaInsufficientForPanels'));
  });

  test('a too-small roofAreaM2 still falls back to the flat REFERENCE_SYSTEM_SIZE_KWP/ROOFTOP_SYSTEM_COST_GBP numbers, but the assumptions note differs from the never-given case', () => {
    const tooSmall = calculateRooftopViability({ ...baseInput, roofAreaM2: 1 });
    const neverGiven = calculateRooftopViability(baseInput);
    assert.equal(tooSmall.systemSizeKwp, REFERENCE_SYSTEM_SIZE_KWP);
    assert.equal(tooSmall.systemCostGbp, ROOFTOP_SYSTEM_COST_GBP);
    assert.equal(tooSmall.systemSizeKwp, neverGiven.systemSizeKwp);
    assert.equal(tooSmall.systemCostGbp, neverGiven.systemCostGbp);
    assert.notEqual(tooSmall.assumptions.systemCostGbp.note, neverGiven.assumptions.systemCostGbp.note);
    assert.doesNotMatch(tooSmall.assumptions.systemCostGbp.note, /Give your usable roof area/);
  });
});

describe('calculateRooftopViability — roof area far exceeding domestic scale', () => {
  // ADDED 4 Aug 2026 (found by a third-party review): COST_PER_KWP_GBP_BY_TIER
  // has no upper bound, so a very large roof-area-derived system still
  // prices at the same flat >3kWp rate as an ordinary domestic install.
  const baseInput = { orientation: 'southFacing', occupancy: 'usuallyHome', annualConsumptionKwh: 4000 };

  test('roofAreaSizingExceedsDomesticScale fires for a system well above DOMESTIC_SYSTEM_SIZE_SANITY_MAX_KWP', () => {
    const result = calculateRooftopViability({ ...baseInput, roofAreaM2: 200 });
    assert.ok(result.systemSizeKwp > DOMESTIC_SYSTEM_SIZE_SANITY_MAX_KWP, 'test setup should produce a system above the sanity max');
    const flag = result.flags.find((f) => f.id === 'roofAreaSizingExceedsDomesticScale');
    assert.ok(flag, 'expected roofAreaSizingExceedsDomesticScale to fire');
    assert.match(flag.note, new RegExp(`${DOMESTIC_SYSTEM_SIZE_SANITY_MAX_KWP}kWp`));
  });

  test('roofAreaSizingExceedsDomesticScale does not fire for a typical domestic roof area', () => {
    const result = calculateRooftopViability({ ...baseInput, roofAreaM2: 25 });
    assert.ok(result.systemSizeKwp <= DOMESTIC_SYSTEM_SIZE_SANITY_MAX_KWP, 'test setup should stay within the sanity max');
    assert.ok(!result.flags.some((f) => f.id === 'roofAreaSizingExceedsDomesticScale'));
  });

  test('roofAreaSizingExceedsDomesticScale does not fire when no roof area is given at all', () => {
    const result = calculateRooftopViability(baseInput);
    assert.ok(!result.flags.some((f) => f.id === 'roofAreaSizingExceedsDomesticScale'));
  });
});
