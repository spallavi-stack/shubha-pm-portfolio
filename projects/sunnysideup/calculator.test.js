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

// calculateRooftopViabilityByPostcode is async and calls postcodes.io over
// the network — this sandboxed environment is network-restricted (see
// CLAUDE.md), so this is expected to hit the lookup-failure fallback path,
// not a live-resolved postcode. That's still worth checking: the fallback
// should return a normal, usable result (England-baseline generation) with
// postcodeLookup.ok === false and a clear error message, not a thrown
// exception or a silently wrong number. A live postcode (e.g. real success
// resolving to Scotland/Wales/Northern Ireland with the regional multiplier
// and, for Scotland/Wales, a regulatoryFlag attached) still needs checking
// from an unrestricted session or a real browser before fully trusting the
// success path's exact response shape from postcodes.io.
(async () => {
  const result = await calculateRooftopViabilityByPostcode('EH1 1BB', {
    orientation: 'southFacing',
    occupancy: 'usuallyHome',
    annualConsumptionKwh: 4000,
  });
  printResult('Rooftop by postcode — EH1 1BB (network-restricted session, fallback path expected)', result);
  console.log('- postcodeLookup.ok should be false here (network-restricted session), with generationKwh falling back to the unadjusted England baseline (3,800), not a thrown error or NaN.');
})();

console.log('\nSanity checks:');
console.log('- Rooftop south-facing/usually-home payback (default SEG rate) should now be longer than before the tariff-table update, since the no-switch-needed baseline dropped from 15p to 4p.');
console.log('- Rooftop north-facing should score red (worst case).');
console.log('- Low-consumption household result should show selfConsumedKwh capped near annualConsumptionKwh, not the full occupancy-implied share.');
console.log('- Plug-in payback should land near 3-4yr, consistent with (though not independently verifying) the one weak source that claims that figure.');
console.log('- The user-provided-rates case should show a SHORTER payback than the same scenario with defaults (higher electricity price benefits self-consumption more than the lower SEG rate costs on export, for this self-consumption-heavy household), and assumptions should mark both rates "User-provided" not "Fact (default)"/"Assumption (default)".');
console.log('- The named-tariff case should show a materially shorter payback than the default-rate case (12p vs 4p on the exported portion), and the assumptions note should name "Octopus Energy — Outgoing Octopus" rather than saying "Your own stated rate".');
