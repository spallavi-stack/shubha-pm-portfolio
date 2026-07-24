/**
 * Sanity-check script for calculator.js, run with: node calculator.test.js
 *
 * Not a formal test suite (no assertions/framework) — a readable check that
 * the calculator's output lands in the ranges grounding-research.md actually
 * reports, run before any UI is built on top of this logic.
 */
const { calculateRooftopViability, calculatePluginViability } = require('./calculator.js');

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
printResult('Plug-in — standard case', calculatePluginViability({ occupancy: 'usuallyHome' }));

console.log('\nSanity checks:');
console.log('- Rooftop south-facing/usually-home payback should land roughly 8-11yr (researched range is 6-14yr for rooftop generally).');
console.log('- Rooftop north-facing should score red (worst case).');
console.log('- Low-consumption household result should show selfConsumedKwh capped near annualConsumptionKwh, not the full occupancy-implied share.');
console.log('- Plug-in payback should land near 3-4yr, consistent with (though not independently verifying) the one weak source that claims that figure.');
