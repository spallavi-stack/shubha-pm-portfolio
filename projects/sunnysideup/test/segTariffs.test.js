const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { getSegTariffs, findSegTariff, findSegTariffsBySupplier, constants } = require('../calculator.js');

describe('getSegTariffs', () => {
  test('returns the full SEG_TARIFFS table unmodified', () => {
    assert.deepEqual(getSegTariffs(), constants.SEG_TARIFFS);
  });
});

describe('findSegTariff', () => {
  test('finds a known supplier + tariff pair', () => {
    const row = findSegTariff('Octopus Energy', 'Outgoing Octopus');
    assert.ok(row);
    assert.equal(row.ratePencePerKwh, 12.0);
  });

  test('returns undefined for an unknown pair', () => {
    assert.equal(findSegTariff('Nonexistent Supplier', 'Nonexistent Tariff'), undefined);
  });

  test('returns undefined for a known supplier but wrong tariff name', () => {
    assert.equal(findSegTariff('Octopus Energy', 'Not A Real Tariff'), undefined);
  });
});

describe('findSegTariffsBySupplier', () => {
  test('sorts Fixed-rate tariffs before non-Fixed, even when non-Fixed has a higher raw rate', () => {
    const rows = findSegTariffsBySupplier('Octopus Energy');
    assert.ok(rows.length > 1);
    const flux = rows.find((r) => r.tariff === 'Intelligent Octopus Flux');
    const outgoing = rows.find((r) => r.tariff === 'Outgoing Octopus');
    assert.ok(flux && outgoing);
    assert.ok(flux.ratePencePerKwh > outgoing.ratePencePerKwh, 'test fixture assumption: Flux has the higher raw rate');
    assert.equal(rows[0].tariff, 'Outgoing Octopus', 'Fixed tariff should sort first despite a higher-rate non-Fixed row existing');
  });

  test('sorts by highest rate first within the Fixed group', () => {
    const rows = findSegTariffsBySupplier('E.ON Next').filter((r) => r.rateType === 'Fixed');
    for (let i = 1; i < rows.length; i += 1) {
      assert.ok(rows[i - 1].ratePencePerKwh >= rows[i].ratePencePerKwh);
    }
  });

  test('returns an empty array (not undefined, not a throw) for an unknown supplier', () => {
    const rows = findSegTariffsBySupplier('NotARealSupplier');
    assert.deepEqual(rows, []);
  });
});
