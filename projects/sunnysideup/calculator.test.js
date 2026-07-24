/**
 * Sanity-check script for calculator.js, run with: node calculator.test.js
 *
 * Not a formal test suite (no assertions/framework) — a readable check that
 * the calculator's output lands in the ranges grounding-research.md actually
 * reports, run before any UI is built on top of this logic.
 */
const { calculateRooftopViability, calculateRooftopViabilityByPostcode, calculatePluginViability, findSegTariff, constants } = require('./calculator.js');

function printResult(label, result) {
  console.log(`\n--- ${label} ---`);
  console.log(JSON.stringify(result, null, 2));
}

// Rooftop, south-facing, occupier usually home, consumption high enough not
// to cap self-consumption. Expect: payback in the researched 6-14yr range.
printResult(
  'Rooftop — south-facing, usually home, 4,000kWh/yr household use',
  calculateRooftopViability({ orientation: 'southFacing', occupancy: 'usuallyHome', annualConsumptionKwh: 4000 })
);

// Rooftop, south-facing, occupier usually out (lower self-consumption, more
// exported at the lower SEG rate). Expect: longer payback than the above.
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
// occupancy-implied rate — checks the Math.min() ceiling actually engages.
printResult(
  'Rooftop — south-facing, usually home, but only 1,000kWh/yr household use (low-consumption household)',
  calculateRooftopViability({ orientation: 'southFacing', occupancy: 'usuallyHome', annualConsumptionKwh: 1000 })
);

// Plug-in. Expect: payback near the weak source's claimed 3-4yr figure,
// since the constants are drawn from the midpoint of the same range.
printResult('Plug-in — standard case (defaults)', calculatePluginViability({ occupancy: 'usuallyHome' }));

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
// the new 4.0p no-switch default. Expect: meaningfully shorter payback than
// the same scenario on the default rate, and the tariff label should show up
// in the assumptions note.
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
  })
);

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
  console.log(`- generationKwh should be ${Math.round(3800 * 0.85)} (3,800 England baseline x Scotland's 0.85 multiplier), regulatoryFlag should be present (Scotland), openMeteoLookup.ok should be false.`);

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
  console.log('- generationKwh should be 3,440 (1,000kWh/m²/yr stubbed insolation x 4kWp x 0.86 performance ratio), overriding the country multiplier entirely; regulatoryFlag should still be present (Scotland); openMeteoLookup.ok should be true.');

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
      if (!u.includes('E-1R-VAR-25-09-01-_M')) {
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
  console.log('- electricityPriceLookup.ok should be true, with productDisplayName "Flexible Octopus" and tariffCode "E-1R-VAR-25-09-01-_M" (the newer of the two matching stubbed products, by available_from — the older VAR-22-11-01 and the tracker-flagged Agile product should both be excluded by the filter). assumptions.electricityPricePencePerKwh.value should be 27.44, tier should start with "Inference — live-fetched".');

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
  console.log('- generationKwh should be 3,800 (England\'s 1.0x multiplier is a no-op), and regulatoryFlag should be ABSENT (England has no unresearched-regime flag).');

  global.fetch = originalFetch;

  console.log('\nSanity checks:');
  console.log('- Rooftop south-facing/usually-home payback (default SEG rate) should now be longer than before the tariff-table update, since the no-switch-needed baseline dropped from 15p to 4p.');
  console.log('- Rooftop north-facing should score red (worst case).');
  console.log('- Low-consumption household result should show selfConsumedKwh capped near annualConsumptionKwh, not the full occupancy-implied share.');
  console.log('- Plug-in payback should land near 3-4yr, consistent with (though not independently verifying) the one weak source that claims that figure.');
  console.log('- The user-provided-rates case should show a SHORTER payback than the same scenario with defaults (higher electricity price benefits self-consumption more than the lower SEG rate costs on export, for this self-consumption-heavy household), and assumptions should mark both rates "User-provided" not "Fact (default)"/"Assumption (default)".');
  console.log('- The named-tariff case should show a materially shorter payback than the default-rate case (12p vs 4p on the exported portion), and the assumptions note should name "Octopus Energy — Outgoing Octopus" rather than saying "Your own stated rate".');
})();
