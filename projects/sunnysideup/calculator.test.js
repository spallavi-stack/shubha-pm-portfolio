/**
 * Sanity-check script for calculator.js, run with: node calculator.test.js
 *
 * Not a formal test suite (no assertions/framework) — a readable check that
 * the calculator's output lands in the ranges grounding-research.md actually
 * reports, run before any UI is built on top of this logic.
 */
const { calculateRooftopViability, calculateRooftopViabilityByPostcode, calculatePluginViability, findSegTariff, findSegTariffsBySupplier, estimateAnnualConsumptionKwh, estimateSystemSizeFromRoofArea, constants } = require('./calculator.js');

function printResult(label, result) {
  console.log(`\n--- ${label} ---`);
  console.log(JSON.stringify(result, null, 2));
}

// Rooftop, south-facing, consumption high enough not to cap self-consumption.
// Self-consumption now comes from DESNZ HEM's demand-ratio formula
// (generation/consumption), not occupancy — see selfConsumptionFactorFromDemandRatio's
// sourcing note in calculator.js. Expect: payback in the researched 6-14yr range.
printResult(
  'Rooftop — south-facing, usually home, 4,000kWh/yr household use',
  calculateRooftopViability({ orientation: 'southFacing', occupancy: 'usuallyHome', annualConsumptionKwh: 4000 })
);

// Same generation/consumption, occupancy 'usuallyOut' instead of 'usuallyHome'.
// occupancy no longer changes any number in the result (self-consumption is
// demand-ratio-driven now, corrected 1 Aug 2026 — the old occupancy binary
// couldn't reflect e.g. an EV/heat pump timed into daylight hours changing
// real self-consumption at a fixed occupancy pattern). Expect: numerically
// IDENTICAL to the 'usuallyHome' case above, but with an extra
// "occupancyMayLowerRealSelfConsumption" flag this one doesn't get, since an
// annual-average formula can't see whether a usually-out household's
// consumption clusters outside solar hours.
printResult(
  'Rooftop — south-facing, usually out, 4,000kWh/yr household use',
  calculateRooftopViability({ orientation: 'southFacing', occupancy: 'usuallyOut', annualConsumptionKwh: 4000 })
);

// Rooftop, north-facing (worst case). Expect: red, long payback.
printResult(
  'Rooftop — north-facing, usually home, 4,000kWh/yr household use',
  calculateRooftopViability({ orientation: 'northFacing', occupancy: 'usuallyHome', annualConsumptionKwh: 4000 })
);

// Rooftop, low household consumption caps self-consumption below the
// demand-ratio-computed rate — checks the Math.min() ceiling actually engages.
printResult(
  'Rooftop — south-facing, usually home, but only 1,000kWh/yr household use (low-consumption household)',
  calculateRooftopViability({ orientation: 'southFacing', occupancy: 'usuallyHome', annualConsumptionKwh: 1000 })
);

// Plug-in. Expect: payback near the weak source's claimed 3-4yr figure,
// since the constants are drawn from the midpoint of the same range.
printResult('Plug-in — standard case (defaults)', calculatePluginViability({ occupancy: 'usuallyHome' }));

// Plug-in now varies by orientation too (borrows rooftop's own multipliers,
// see calculator.js's comment above pluginOrientationMultiplier). North
// should score meaningfully worse than the south-facing default above.
printResult('Plug-in — north-facing', calculatePluginViability({ occupancy: 'usuallyHome', orientation: 'northFacing' }));
console.log('- generationKwh should be 385 (770 x 50%, rooftop\'s own north ratio), payback should be noticeably longer than the south-facing default case above, and assumptions.generationKwh.note should explain the borrowed-ratio reasoning rather than presenting 385 as independently researched.');

// Same rooftop scenario as the first case, but with a user-provided fixed-deal
// electricity price (higher than the price-cap default) and a user-provided
// low-SEG-supplier rate. This household self-consumes more than it exports
// (see the first case's selfConsumedKwh/exportedKwh split), so the higher
// electricity price's benefit on self-consumption outweighs the worse SEG
// rate's cost on export -- expect a SHORTER payback than the defaulted case,
// not longer, a genuine result of the math, not a guess. Confirms a real
// product insight: a household on an expensive fixed deal can find solar
// more attractive via self-consumption even with a worse export rate.
// assumptions.tier should read "User-provided" for both rates either way.
printResult(
  'Rooftop — south-facing, usually home, 4,000kWh/yr, user-provided rates (35p/kWh electricity, 6p/kWh SEG)',
  calculateRooftopViability({
    orientation: 'southFacing',
    occupancy: 'usuallyHome',
    annualConsumptionKwh: 4000,
    electricityPricePencePerKwh: 35,
    segRatePencePerKwh: 6,
  })
);

// A specific named tariff looked up from the table, not a manually-typed
// number — Octopus Energy's flagship "Outgoing Octopus" at 12.0p, well above
// the 3.01p no-switch default. Expect: meaningfully shorter payback than
// the same scenario on the default rate, and the tariff label AND its
// eligibility text should show up in the assumptions note — the condition
// attached to this rate shouldn't get lost between the picker and the result.
const octopusOutgoing = findSegTariff('Octopus Energy', 'Outgoing Octopus');
printResult(
  `Rooftop — south-facing, usually home, 4,000kWh/yr, SEG tariff: ${octopusOutgoing.supplier} ${octopusOutgoing.tariff} (${octopusOutgoing.ratePencePerKwh}p, requires: ${octopusOutgoing.eligibility})`,
  calculateRooftopViability({
    orientation: 'southFacing',
    occupancy: 'usuallyHome',
    annualConsumptionKwh: 4000,
    segRatePencePerKwh: octopusOutgoing.ratePencePerKwh,
    segTariffLabel: `${octopusOutgoing.supplier} — ${octopusOutgoing.tariff}`,
    segTariffSource: octopusOutgoing.source,
    segTariffEligibility: octopusOutgoing.eligibility,
  })
);

// findSegTariffsBySupplier: for a supplier with multiple rows including one
// non-Fixed row that has a higher raw rate but isn't actually a quotable
// flat number (Octopus's "Intelligent Octopus Flux," rateType
// "Smart/Variable," source notes say it's currently unavailable), the
// Fixed-rate "Outgoing Octopus" (12p) should be picked first despite Flux's
// higher 23p, since Fixed tariffs are sorted ahead of non-Fixed ones.
const octopusSegTariffs = findSegTariffsBySupplier('Octopus Energy');
console.log('\n--- findSegTariffsBySupplier("Octopus Energy") ---');
console.log(octopusSegTariffs.map((t) => `${t.tariff} (${t.ratePencePerKwh}p, ${t.rateType})`).join('\n'));
console.log(`- First result should be "Outgoing Octopus" (12p, Fixed), not "Intelligent Octopus Flux" (23p, Smart/Variable) despite Flux's higher number.`);

// A supplier not in SEG_TARIFFS at all should return an empty array, not
// throw or return undefined — the UI layer depends on this for its
// "no tariff found, falling back to default" message.
console.log('\n--- findSegTariffsBySupplier("NotARealSupplier") ---');
console.log(JSON.stringify(findSegTariffsBySupplier('NotARealSupplier')));
console.log('- Should be an empty array [].');

// estimateAnnualConsumptionKwh: household size alone (no heat pump/EV)
// should map straight to the TDCV band with no extra breakdown entries.
console.log('\n--- estimateAnnualConsumptionKwh({ householdSize: 2 }) ---');
console.log(JSON.stringify(estimateAnnualConsumptionKwh({ householdSize: 2 }), null, 2));
console.log('- totalKwh should be exactly 1,600 (TDCV low band, household size 2 -> low per this calculator\'s own <=2 rule), breakdown should have only a "baseline" entry, no heatPump/ev.');

// Household size 3 -> medium band; adding a heat pump and 2 EVs should stack
// additively on top of the baseline, each with its own breakdown entry.
console.log('\n--- estimateAnnualConsumptionKwh({ householdSize: 3, hasHeatPump: true, hasEv: true, evCount: 2 }) ---');
const stackedEstimate = estimateAnnualConsumptionKwh({ householdSize: 3, hasHeatPump: true, hasEv: true, evCount: 2 });
console.log(JSON.stringify(stackedEstimate, null, 2));
console.log(`- totalKwh should be 2,500 (medium TDCV) + 4,300 (heat pump) + 2 x 1,960 (EV) = ${2500 + 4300 + 2 * 1960}. Breakdown should have baseline/heatPump/ev entries, ev's note should say "x 2".`);

// hasEv true but evCount omitted should default to 1 vehicle, not 0 or NaN.
console.log('\n--- estimateAnnualConsumptionKwh({ householdSize: 6, hasEv: true }) (evCount omitted) ---');
console.log(JSON.stringify(estimateAnnualConsumptionKwh({ householdSize: 6, hasEv: true }), null, 2));
console.log('- Household size 6 should map to "high" band (3,800) despite being above Ofgem\'s own stated 4-5 person range — extrapolated, not an error. ev.value should be exactly 1,960 (1 vehicle, defaulted), not 0.');

// estimateSystemSizeFromRoofArea: too small to fit a panel should return
// null (not a zeroed-out system), so callers know to fall back rather than
// compute a nonsensical 0kWp result.
console.log('\n--- estimateSystemSizeFromRoofArea(1) (too small for one panel) ---');
console.log(estimateSystemSizeFromRoofArea(1));
console.log('- Should be null.');

// A roof large enough to exceed the small-system cost tier (>3kWp).
// (No more "Permitted Development ceiling" here — that was a false size-based
// threshold removed 1 Aug 2026; see calculator.js's correction note. Permitted
// Development eligibility is now surfaced as an unconditional flag instead,
// since it depends on roof pitch/ridge height/protrusion, not kWp.)
console.log('\n--- estimateSystemSizeFromRoofArea(60) ---');
console.log(JSON.stringify(estimateSystemSizeFromRoofArea(60), null, 2));
console.log('- panelCount 24 (floor(60/2.45)), systemSizeKwp 10.32 (24 x 0.43), costPerKwpGbp 1625 (standard tier, >3kWp). No exceedsPermittedDevelopmentEngland field (removed).');

// A small roof that stays within the small-system cost tier (<=3kWp).
console.log('\n--- estimateSystemSizeFromRoofArea(12) ---');
console.log(JSON.stringify(estimateSystemSizeFromRoofArea(12), null, 2));
console.log('- panelCount 4 (floor(12/2.45)), systemSizeKwp 1.72, costPerKwpGbp 1800 (small-system tier, <=3kWp). No exceedsPermittedDevelopmentEngland field (removed).');

// calculateRooftopViability with roofAreaM2: should override the flat
// REFERENCE_SYSTEM_SIZE_KWP default entirely (systemCostGbp, systemSizeKwp,
// generationKwh all scaled) and attach roofAreaSizing. flags[0] is always
// "permittedDevelopment" now (unconditional, not size-triggered).
printResult(
  'Rooftop — south-facing, usually home, 4,000kWh/yr, 60m² roof area',
  calculateRooftopViability({ orientation: 'southFacing', occupancy: 'usuallyHome', annualConsumptionKwh: 4000, roofAreaM2: 60 })
);
console.log('- systemSizeKwp should be 10.32, systemCostGbp should be 16,770 (10.32 x £1,625/kWp), generationKwh should be scaled up from the flat 3,800kWh baseline (10.32/4 x 3,800 = 9,804), and flags[0].id should be "permittedDevelopment" (followed by tenancyConsent/listedBuilding/conservationArea).');

// Roof area interacting with an existing generation adjustment (regional
// multiplier here, standing in for what a real postcode call would also
// compose with) — the two multipliers should both apply, not one override
// the other.
printResult(
  'Rooftop — south-facing, usually home, 4,000kWh/yr, 60m² roof area + Scotland regional multiplier (0.85x)',
  calculateRooftopViability({
    orientation: 'southFacing',
    occupancy: 'usuallyHome',
    annualConsumptionKwh: 4000,
    roofAreaM2: 60,
    regionalGeneration: constants.REGIONAL_GENERATION_MULTIPLIER.Scotland,
  })
);
console.log(`- generationKwh should be 8,333 (3,800 x 0.85 regional x 10.32/4 roof-area-size ratio = ${Math.round(3800 * 0.85 * (10.32 / 4))}), confirming the two multipliers compose rather than one replacing the other.`);

// A roof too small to fit even one panel should fall back to the flat
// default cleanly, not produce NaN/Infinity from a 0kWp system.
printResult(
  'Rooftop — south-facing, usually home, 4,000kWh/yr, 1m² roof area (too small to fit a panel)',
  calculateRooftopViability({ orientation: 'southFacing', occupancy: 'usuallyHome', annualConsumptionKwh: 4000, roofAreaM2: 1 })
);
console.log('- Should fall back to the flat default entirely: systemSizeKwp 4, systemCostGbp 7,000, generationKwh 3,800, no roofAreaSizing field. flags should still include "permittedDevelopment" (unconditional now, not size-triggered) plus tenancyConsent/listedBuilding/conservationArea, no NaN/Infinity anywhere.');

// Regional generation multiplier applied manually (regionalGeneration is the
// public shape returned by REGIONAL_GENERATION_MULTIPLIER[country], not a
// network call) — Scotland's 0.85x should show up as a reduced generationKwh
// and a longer payback than the same scenario with no regional adjustment.
printResult(
  'Rooftop — south-facing, usually home, 4,000kWh/yr, Scotland regional multiplier (0.85x)',
  calculateRooftopViability({
    orientation: 'southFacing',
    occupancy: 'usuallyHome',
    annualConsumptionKwh: 4000,
    regionalGeneration: constants.REGIONAL_GENERATION_MULTIPLIER.Scotland,
  })
);

(async () => {
  // calculateRooftopViabilityByPostcode is async and calls postcodes.io over
  // the real network — this sandboxed environment is network-restricted (see
  // CLAUDE.md), so this is expected to hit the lookup-failure fallback path,
  // not a live-resolved postcode. Still worth checking: the fallback should
  // return a normal, usable result (England-baseline generation) with
  // postcodeLookup.ok === false and a clear error message, not a thrown
  // exception or a silently wrong number.
  const realNetworkResult = await calculateRooftopViabilityByPostcode('EH1 1BB', {
    orientation: 'southFacing',
    occupancy: 'usuallyHome',
    annualConsumptionKwh: 4000,
  });
  printResult('Rooftop by postcode — EH1 1BB (network-restricted session, fallback-to-England path expected)', realNetworkResult);
  console.log('- postcodeLookup.ok should be false here (network-restricted session), with generationKwh falling back to the unadjusted England baseline (3,800), not a thrown error or NaN.');

  // The scenarios below stub global.fetch to exercise branches a
  // network-restricted session can never actually reach: a successful
  // postcodes.io lookup, and both outcomes of the subsequent Open-Meteo
  // call. (PVGIS was tried here first and removed — confirmed via a live
  // browser test, 24 July 2026, that it sends no Access-Control-Allow-Origin
  // header and is permanently CORS-blocked for a pure static-site prototype
  // with no backend proxy — see calculator.js's comment above
  // calculateRooftopViabilityByPostcode for the full finding, including why
  // Open-Meteo was tried next.) This checks the branching logic itself
  // (which fallback fires, what gets attached to the result), not whether
  // postcodes.io/Open-Meteo's real contracts match what's assumed here —
  // postcodes.io has already been confirmed working live (the Chrome
  // DevTools test that surfaced the PVGIS finding: postcodes.io resolved a
  // real postcode to real coordinates before the PVGIS call was blocked);
  // Open-Meteo still needs the same kind of live check before being trusted.
  const originalFetch = global.fetch;

  global.fetch = async (url) => {
    if (String(url).includes('postcodes.io')) {
      return { ok: true, status: 200, json: async () => ({ result: { postcode: 'EH1 1BB', country: 'Scotland', region: 'Edinburgh, City of', latitude: 55.9533, longitude: -3.1883 } }) };
    }
    return { ok: false, status: 500 }; // Open-Meteo fails
  };
  const scotlandOpenMeteoFailsResult = await calculateRooftopViabilityByPostcode('EH1 1BB', {
    orientation: 'southFacing',
    occupancy: 'usuallyHome',
    annualConsumptionKwh: 4000,
  });
  printResult('Rooftop by postcode — Scotland resolved, Open-Meteo fails (stubbed fetch: country-multiplier fallback expected)', scotlandOpenMeteoFailsResult);
  console.log(`- generationKwh should be ${Math.round(3800 * 0.85)} (3,800 England baseline x Scotland's 0.85 multiplier), flags should include a "regulatoryRegime" entry for Scotland, openMeteoLookup.ok should be false.`);

  global.fetch = async (url) => {
    if (String(url).includes('postcodes.io')) {
      return { ok: true, status: 200, json: async () => ({ result: { postcode: 'EH1 1BB', country: 'Scotland', region: 'Edinburgh, City of', latitude: 55.9533, longitude: -3.1883 } }) };
    }
    if (String(url).includes('archive-api.open-meteo.com')) {
      // 8,760 hours at a flat 114.155 W/m² sums to exactly 1,000,000 Wh/m²
      // (1,000 kWh/m²/yr) — a round number chosen to make the expected
      // generation easy to hand-check: 1000 x 4kWp x 0.86 PR = 3,440kWh.
      const hourlyValue = 1000000 / 8760;
      return { ok: true, status: 200, json: async () => ({ hourly: { global_tilted_irradiance: new Array(8760).fill(hourlyValue) } }) };
    }
    throw new Error('unexpected fetch URL in stub: ' + url);
  };
  const scotlandOpenMeteoSucceedsResult = await calculateRooftopViabilityByPostcode('EH1 1BB', {
    orientation: 'southFacing',
    occupancy: 'usuallyHome',
    annualConsumptionKwh: 4000,
  });
  printResult('Rooftop by postcode — Scotland resolved, Open-Meteo succeeds (stubbed fetch: coordinate-precise estimate expected)', scotlandOpenMeteoSucceedsResult);
  console.log('- generationKwh should be 3,440 (1,000kWh/m²/yr stubbed insolation x 4kWp x 0.86 performance ratio), overriding the country multiplier entirely; flags should still include a "regulatoryRegime" entry for Scotland; openMeteoLookup.ok should be true.');

  // Full chain success: postcode -> GSP region -> current default Octopus
  // product -> that product's live unit rate. Exercises the electricity
  // price lookup end to end, since a real network call can't be made from
  // this sandboxed session (same restriction as postcodes.io/Open-Meteo).
  global.fetch = async (url) => {
    const u = String(url);
    if (u.includes('postcodes.io')) {
      return { ok: true, status: 200, json: async () => ({ result: { postcode: 'EH1 1BB', country: 'Scotland', region: 'Edinburgh, City of', latitude: 55.9533, longitude: -3.1883 } }) };
    }
    if (u.includes('archive-api.open-meteo.com')) {
      return { ok: false, status: 500 }; // isolate: only testing the electricity-price chain here
    }
    if (u.includes('/industry/grid-supply-points/')) {
      return { ok: true, status: 200, json: async () => ({ count: 1, results: [{ group_id: '_M' }] }) };
    }
    if (u.includes('/products/?')) {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          results: [
            { code: 'VAR-22-11-01', display_name: 'Flexible Octopus', is_green: false, is_tracker: false, is_prepay: false, is_business: false, is_restricted: false, available_from: '2022-11-01T00:00:00Z', available_to: '2026-01-01T00:00:00Z' },
            { code: 'VAR-25-09-01', display_name: 'Flexible Octopus', is_green: false, is_tracker: false, is_prepay: false, is_business: false, is_restricted: false, available_from: '2025-09-01T00:00:00Z', available_to: null },
            { code: 'AGILE-24-04-03', display_name: 'Agile Octopus', is_green: false, is_tracker: true, is_prepay: false, is_business: false, is_restricted: false, available_from: '2024-04-03T00:00:00Z', available_to: null },
          ],
        }),
      };
    }
    if (u.includes('/standard-unit-rates/')) {
      // Real tariff codes drop the GSP group's leading underscore (group_id
      // "_M" -> tariff code "...-M", not "...-_M") — a live end-to-end test
      // (25 Jul 2026, see calculator.js's comment on OCTOPUS_BASE_URL) found
      // the code previously got this wrong.
      if (!u.includes('E-1R-VAR-25-09-01-M')) {
        throw new Error('unexpected tariff code in stub URL: ' + u);
      }
      return { ok: true, status: 200, json: async () => ({ results: [{ value_inc_vat: 27.44, valid_from: '2026-07-01T00:00:00Z', valid_to: '2026-10-01T00:00:00Z' }] }) };
    }
    throw new Error('unexpected fetch URL in stub: ' + u);
  };
  const electricityPriceResult = await calculateRooftopViabilityByPostcode('EH1 1BB', {
    orientation: 'southFacing',
    occupancy: 'usuallyHome',
    annualConsumptionKwh: 4000,
  });
  printResult('Rooftop by postcode — live electricity price chain succeeds (stubbed fetch: GSP -> current product -> unit rate)', electricityPriceResult);
  console.log('- electricityPriceLookup.ok should be true, with productDisplayName "Flexible Octopus" and tariffCode "E-1R-VAR-25-09-01-M" (VAR-22-11-01 is excluded by its own expired available_to date, and the tracker-flagged Agile product is excluded by the filter, leaving VAR-25-09-01 as the only — and thus also the flagship-name-matched — candidate). assumptions.electricityPricePencePerKwh.value should be 27.44, tier should start with "Inference — live-fetched".');

  global.fetch = async (url) => {
    if (String(url).includes('postcodes.io')) {
      return { ok: true, status: 200, json: async () => ({ result: { postcode: 'SW1A 1AA', country: 'England', region: 'London', latitude: 51.5, longitude: -0.14 } }) };
    }
    return { ok: false, status: 500 }; // Open-Meteo fails
  };
  const englandResult = await calculateRooftopViabilityByPostcode('SW1A 1AA', {
    orientation: 'southFacing',
    occupancy: 'usuallyHome',
    annualConsumptionKwh: 4000,
  });
  printResult('Rooftop by postcode — England resolved, Open-Meteo fails (stubbed fetch: no regulatory flag expected)', englandResult);
  console.log('- generationKwh should be 3,800 (England\'s 1.0x multiplier is a no-op), and flags should have NO "regulatoryRegime" entry (England has no unresearched-regime flag) — just the three always-present ones.');

  global.fetch = originalFetch;

  console.log('\nSanity checks:');
  console.log('- Rooftop south-facing/usually-home payback (default SEG rate) should now be longer than before the tariff-table update, since the no-switch-needed baseline dropped from 15p to 3.01p.');
  console.log('- Rooftop north-facing should score red (worst case).');
  console.log('- Low-consumption household result should show selfConsumedKwh capped near annualConsumptionKwh, not the full demand-ratio-computed share.');
  console.log('- Plug-in payback should land near 3-4yr, consistent with (though not independently verifying) the one weak source that claims that figure.');
  console.log('- The user-provided-rates case should show a SHORTER payback than the same scenario with defaults (higher electricity price benefits self-consumption more than the lower SEG rate costs on export, for this self-consumption-heavy household), and assumptions should mark both rates "User-provided" not "Fact (default)"/"Assumption (default)".');
  console.log('- The named-tariff case should show a materially shorter payback than the default-rate case (12p vs 3.01p on the exported portion), and the assumptions note should name "Octopus Energy — Outgoing Octopus" rather than saying "Your own stated rate".');
})();
