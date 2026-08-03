const { test, describe, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const {
  lookupPostcodeRegion,
  lookupOpenMeteoGeneration,
  lookupGspRegion,
  lookupCurrentOctopusVariableProduct,
  lookupOctopusUnitRate,
  lookupLiveElectricityPrice,
  calculateRooftopViabilityByPostcode,
  constants,
} = require('../calculator.js');

let originalFetch;
beforeEach(() => {
  originalFetch = global.fetch;
});
afterEach(() => {
  global.fetch = originalFetch;
});

describe('lookupPostcodeRegion', () => {
  test('empty postcode returns ok:false without calling fetch', async () => {
    let called = false;
    global.fetch = async () => {
      called = true;
      throw new Error('should not be called');
    };
    const result = await lookupPostcodeRegion('   ');
    assert.equal(result.ok, false);
    assert.equal(called, false);
  });

  test('undefined postcode returns ok:false without calling fetch', async () => {
    let called = false;
    global.fetch = async () => {
      called = true;
      throw new Error('should not be called');
    };
    const result = await lookupPostcodeRegion(undefined);
    assert.equal(result.ok, false);
    assert.equal(called, false);
  });

  test('network throw returns ok:false with an error message', async () => {
    global.fetch = async () => {
      throw new Error('network down');
    };
    const result = await lookupPostcodeRegion('EH1 1BB');
    assert.equal(result.ok, false);
    assert.match(result.error, /network down/);
  });

  test('404 returns ok:false with an invalid-postcode message', async () => {
    global.fetch = async () => ({ status: 404, ok: false });
    const result = await lookupPostcodeRegion('ZZ99 9ZZ');
    assert.equal(result.ok, false);
    assert.match(result.error, /valid UK postcode/);
  });

  test('non-200, non-404 error returns ok:false', async () => {
    global.fetch = async () => ({ status: 500, ok: false });
    const result = await lookupPostcodeRegion('EH1 1BB');
    assert.equal(result.ok, false);
    assert.match(result.error, /HTTP 500/);
  });

  test('missing result body returns ok:false', async () => {
    global.fetch = async () => ({ status: 200, ok: true, json: async () => ({}) });
    const result = await lookupPostcodeRegion('EH1 1BB');
    assert.equal(result.ok, false);
  });

  test('successful lookup returns the expected shape', async () => {
    global.fetch = async () => ({
      status: 200,
      ok: true,
      json: async () => ({ result: { postcode: 'EH1 1BB', country: 'Scotland', region: 'Edinburgh, City of', latitude: 55.9533, longitude: -3.1883 } }),
    });
    const result = await lookupPostcodeRegion('EH1 1BB');
    assert.deepEqual(result, { ok: true, postcode: 'EH1 1BB', country: 'Scotland', region: 'Edinburgh, City of', latitude: 55.9533, longitude: -3.1883 });
  });
});

describe('lookupOpenMeteoGeneration', () => {
  test('network throw returns ok:false', async () => {
    global.fetch = async () => {
      throw new Error('timeout');
    };
    const result = await lookupOpenMeteoGeneration(51.5, -0.14, 'southFacing');
    assert.equal(result.ok, false);
  });

  test('non-ok response returns ok:false', async () => {
    global.fetch = async () => ({ ok: false, status: 500 });
    const result = await lookupOpenMeteoGeneration(51.5, -0.14, 'southFacing');
    assert.equal(result.ok, false);
    assert.match(result.error, /HTTP 500/);
  });

  test('invalid JSON body returns ok:false', async () => {
    global.fetch = async () => ({
      ok: true,
      json: async () => {
        throw new Error('bad json');
      },
    });
    const result = await lookupOpenMeteoGeneration(51.5, -0.14, 'southFacing');
    assert.equal(result.ok, false);
  });

  test('missing hourly.global_tilted_irradiance array returns ok:false', async () => {
    global.fetch = async () => ({ ok: true, json: async () => ({ hourly: {} }) });
    const result = await lookupOpenMeteoGeneration(51.5, -0.14, 'southFacing');
    assert.equal(result.ok, false);
  });

  test('too much missing hourly data (>10% non-numeric) returns ok:false rather than trusting a partial total', async () => {
    const hourlyValues = new Array(8760).fill(100);
    // Blank out more than 10% of the year.
    for (let i = 0; i < 1000; i += 1) hourlyValues[i] = null;
    global.fetch = async () => ({ ok: true, json: async () => ({ hourly: { global_tilted_irradiance: hourlyValues } }) });
    const result = await lookupOpenMeteoGeneration(51.5, -0.14, 'southFacing');
    assert.equal(result.ok, false);
    assert.match(result.error, /missing too much hourly data/);
  });

  test('successful response converts irradiance to a generation estimate', async () => {
    const hourlyValue = 1000000 / 8760; // sums to exactly 1,000 kWh/m^2/yr
    global.fetch = async () => ({ ok: true, json: async () => ({ hourly: { global_tilted_irradiance: new Array(8760).fill(hourlyValue) } }) });
    const result = await lookupOpenMeteoGeneration(51.5, -0.14, 'southFacing');
    assert.equal(result.ok, true);
    // 1,000 kWh/m^2/yr x 4kWp x 0.86 performance ratio = 3,440
    assert.equal(result.annualGenerationKwh, 3440);
  });
});

describe('lookupGspRegion', () => {
  test('empty postcode returns ok:false without calling fetch', async () => {
    let called = false;
    global.fetch = async () => {
      called = true;
      return { ok: true, json: async () => ({}) };
    };
    const result = await lookupGspRegion('');
    assert.equal(result.ok, false);
    assert.equal(called, false);
  });

  test('missing group_id returns ok:false', async () => {
    global.fetch = async () => ({ ok: true, json: async () => ({ results: [] }) });
    const result = await lookupGspRegion('EH1 1BB');
    assert.equal(result.ok, false);
  });

  test('successful lookup returns the groupId', async () => {
    global.fetch = async () => ({ ok: true, json: async () => ({ count: 1, results: [{ group_id: '_M' }] }) });
    const result = await lookupGspRegion('EH1 1BB');
    assert.deepEqual(result, { ok: true, groupId: '_M' });
  });
});

describe('lookupCurrentOctopusVariableProduct — flagship-over-recency regression', () => {
  test('prefers the exact "Flexible Octopus" flagship match over a more recently launched niche product', async () => {
    global.fetch = async () => ({
      ok: true,
      json: async () => ({
        results: [
          { code: 'SNUG-24-01-01', display_name: 'Snug Octopus', is_green: false, is_tracker: false, is_prepay: false, is_business: false, is_restricted: false, available_from: '2026-06-01T00:00:00Z', available_to: null },
          { code: 'VAR-25-09-01', display_name: 'Flexible Octopus', is_green: false, is_tracker: false, is_prepay: false, is_business: false, is_restricted: false, available_from: '2025-09-01T00:00:00Z', available_to: null },
        ],
      }),
    });
    const result = await lookupCurrentOctopusVariableProduct();
    assert.equal(result.ok, true);
    assert.equal(result.displayName, 'Flexible Octopus');
    assert.equal(result.productCode, 'VAR-25-09-01');
  });

  test('excludes green/tracker/prepay/business/restricted and expired products', async () => {
    global.fetch = async () => ({
      ok: true,
      json: async () => ({
        results: [
          { code: 'GREEN-1', display_name: 'Green Octopus', is_green: true, is_tracker: false, is_prepay: false, is_business: false, is_restricted: false, available_from: '2026-01-01T00:00:00Z', available_to: null },
          { code: 'TRACKER-1', display_name: 'Tracker Octopus', is_green: false, is_tracker: true, is_prepay: false, is_business: false, is_restricted: false, available_from: '2026-01-01T00:00:00Z', available_to: null },
          { code: 'EXPIRED-1', display_name: 'Flexible Octopus', is_green: false, is_tracker: false, is_prepay: false, is_business: false, is_restricted: false, available_from: '2020-01-01T00:00:00Z', available_to: '2021-01-01T00:00:00Z' },
          { code: 'VALID-1', display_name: 'Other Variable', is_green: false, is_tracker: false, is_prepay: false, is_business: false, is_restricted: false, available_from: '2026-01-01T00:00:00Z', available_to: null },
        ],
      }),
    });
    const result = await lookupCurrentOctopusVariableProduct();
    assert.equal(result.ok, true);
    assert.equal(result.productCode, 'VALID-1');
  });

  test('network throw returns ok:false', async () => {
    global.fetch = async () => {
      throw new Error('DNS failure');
    };
    const result = await lookupCurrentOctopusVariableProduct();
    assert.equal(result.ok, false);
    assert.match(result.error, /DNS failure/);
  });

  test('no candidates returns ok:false', async () => {
    global.fetch = async () => ({ ok: true, json: async () => ({ results: [] }) });
    const result = await lookupCurrentOctopusVariableProduct();
    assert.equal(result.ok, false);
  });

  test('a response body without a results array returns ok:false', async () => {
    global.fetch = async () => ({ ok: true, json: async () => ({}) });
    const result = await lookupCurrentOctopusVariableProduct();
    assert.equal(result.ok, false);
  });
});

describe('lookupOctopusUnitRate — underscore-stripping regression', () => {
  test('strips the GSP group\'s leading underscore when building the tariff code', async () => {
    let requestedUrl;
    global.fetch = async (url) => {
      requestedUrl = String(url);
      return { ok: true, json: async () => ({ results: [{ value_inc_vat: 27.44, valid_from: '2026-07-01T00:00:00Z', valid_to: '2026-10-01T00:00:00Z' }] }) };
    };
    const result = await lookupOctopusUnitRate('VAR-25-09-01', '_M');
    assert.equal(result.ok, true);
    assert.equal(result.tariffCode, 'E-1R-VAR-25-09-01-M');
    assert.ok(requestedUrl.includes('E-1R-VAR-25-09-01-M'));
    assert.ok(!requestedUrl.includes('-_M'));
  });

  test('missing value_inc_vat field returns ok:false', async () => {
    global.fetch = async () => ({ ok: true, json: async () => ({ results: [{}] }) });
    const result = await lookupOctopusUnitRate('VAR-25-09-01', '_M');
    assert.equal(result.ok, false);
  });

  test('network throw returns ok:false', async () => {
    global.fetch = async () => {
      throw new Error('connection reset');
    };
    const result = await lookupOctopusUnitRate('VAR-25-09-01', '_M');
    assert.equal(result.ok, false);
    assert.match(result.error, /connection reset/);
  });
});

describe('lookupLiveElectricityPrice — chaining', () => {
  test('fails fast (no downstream calls) if the GSP lookup fails', async () => {
    let productListCalled = false;
    global.fetch = async (url) => {
      const u = String(url);
      if (u.includes('grid-supply-points')) return { ok: false, status: 500 };
      productListCalled = true;
      return { ok: true, json: async () => ({ results: [] }) };
    };
    const result = await lookupLiveElectricityPrice('EH1 1BB');
    assert.equal(result.ok, false);
    assert.equal(productListCalled, false);
  });

  test('fails if the product lookup fails after GSP succeeds', async () => {
    global.fetch = async (url) => {
      const u = String(url);
      if (u.includes('grid-supply-points')) return { ok: true, json: async () => ({ count: 1, results: [{ group_id: '_M' }] }) };
      if (u.includes('/products/?')) return { ok: false, status: 500 };
      throw new Error('unexpected URL: ' + u);
    };
    const result = await lookupLiveElectricityPrice('EH1 1BB');
    assert.equal(result.ok, false);
  });

  test('fails if the unit-rate lookup fails after GSP and product both succeed', async () => {
    global.fetch = async (url) => {
      const u = String(url);
      if (u.includes('grid-supply-points')) return { ok: true, json: async () => ({ count: 1, results: [{ group_id: '_M' }] }) };
      if (u.includes('/products/?')) {
        return {
          ok: true,
          json: async () => ({ results: [{ code: 'VAR-25-09-01', display_name: 'Flexible Octopus', is_green: false, is_tracker: false, is_prepay: false, is_business: false, is_restricted: false, available_from: '2025-09-01T00:00:00Z', available_to: null }] }),
        };
      }
      if (u.includes('standard-unit-rates')) return { ok: false, status: 500 };
      throw new Error('unexpected URL: ' + u);
    };
    const result = await lookupLiveElectricityPrice('EH1 1BB');
    assert.equal(result.ok, false);
  });

  test('full chain success returns the resolved rate', async () => {
    global.fetch = async (url) => {
      const u = String(url);
      if (u.includes('grid-supply-points')) return { ok: true, json: async () => ({ count: 1, results: [{ group_id: '_M' }] }) };
      if (u.includes('/products/?')) {
        return {
          ok: true,
          json: async () => ({ results: [{ code: 'VAR-25-09-01', display_name: 'Flexible Octopus', is_green: false, is_tracker: false, is_prepay: false, is_business: false, is_restricted: false, available_from: '2025-09-01T00:00:00Z', available_to: null }] }),
        };
      }
      if (u.includes('standard-unit-rates')) {
        return { ok: true, json: async () => ({ results: [{ value_inc_vat: 27.44, valid_from: '2026-07-01T00:00:00Z' }] }) };
      }
      throw new Error('unexpected URL: ' + u);
    };
    const result = await lookupLiveElectricityPrice('EH1 1BB');
    assert.equal(result.ok, true);
    assert.equal(result.ratePencePerKwh, 27.44);
    assert.equal(result.productDisplayName, 'Flexible Octopus');
  });
});

describe('calculateRooftopViabilityByPostcode — orchestration', () => {
  const inputs = { orientation: 'southFacing', occupancy: 'usuallyHome', annualConsumptionKwh: 4000 };

  test('postcode lookup failure falls back to a flat result with postcodeLookup.ok false', async () => {
    global.fetch = async () => {
      throw new Error('no network');
    };
    const result = await calculateRooftopViabilityByPostcode('EH1 1BB', inputs);
    assert.equal(result.postcodeLookup.ok, false);
    assert.equal(result.generationKwh, constants.ROOFTOP_ANNUAL_GENERATION_KWH.southFacing);
  });

  test('postcode resolves, Open-Meteo fails: falls back to the country regional multiplier', async () => {
    global.fetch = async (url) => {
      if (String(url).includes('postcodes.io')) {
        return { ok: true, status: 200, json: async () => ({ result: { postcode: 'EH1 1BB', country: 'Scotland', region: 'Edinburgh, City of', latitude: 55.9533, longitude: -3.1883 } }) };
      }
      return { ok: false, status: 500 };
    };
    const result = await calculateRooftopViabilityByPostcode('EH1 1BB', inputs);
    assert.equal(result.openMeteoLookup.ok, false);
    assert.equal(result.generationKwh, Math.round(constants.ROOFTOP_ANNUAL_GENERATION_KWH.southFacing * constants.REGIONAL_GENERATION_MULTIPLIER.Scotland.value));
    assert.ok(result.flags.some((f) => f.id === 'regulatoryRegime' && f.country === 'Scotland'));
  });

  test('postcode + Open-Meteo both succeed: coordinate-precise estimate overrides the country multiplier', async () => {
    global.fetch = async (url) => {
      const u = String(url);
      if (u.includes('postcodes.io')) {
        return { ok: true, status: 200, json: async () => ({ result: { postcode: 'EH1 1BB', country: 'Scotland', region: 'Edinburgh, City of', latitude: 55.9533, longitude: -3.1883 } }) };
      }
      if (u.includes('archive-api.open-meteo.com')) {
        const hourlyValue = 1000000 / 8760;
        return { ok: true, status: 200, json: async () => ({ hourly: { global_tilted_irradiance: new Array(8760).fill(hourlyValue) } }) };
      }
      throw new Error('unexpected URL: ' + u);
    };
    const result = await calculateRooftopViabilityByPostcode('EH1 1BB', inputs);
    assert.equal(result.openMeteoLookup.ok, true);
    assert.equal(result.generationKwh, 3440);
    assert.match(result.assumptions.generationKwh.note, /south-facing plane/);
  });

  test('an east/west orientation is named correctly in the Open-Meteo-derived generation note', async () => {
    global.fetch = async (url) => {
      const u = String(url);
      if (u.includes('postcodes.io')) {
        return { ok: true, status: 200, json: async () => ({ result: { postcode: 'EH1 1BB', country: 'Scotland', region: 'Edinburgh, City of', latitude: 55.9533, longitude: -3.1883 } }) };
      }
      if (u.includes('archive-api.open-meteo.com')) {
        const hourlyValue = 1000000 / 8760;
        return { ok: true, status: 200, json: async () => ({ hourly: { global_tilted_irradiance: new Array(8760).fill(hourlyValue) } }) };
      }
      throw new Error('unexpected URL: ' + u);
    };
    const result = await calculateRooftopViabilityByPostcode('EH1 1BB', { ...inputs, orientation: 'eastWestFacing' });
    assert.match(result.assumptions.generationKwh.note, /east\/west-facing plane/);
  });

  test('a user-provided electricity price skips the live price lookup entirely (fetch never called for it)', async () => {
    let octopusCalled = false;
    global.fetch = async (url) => {
      const u = String(url);
      if (u.includes('postcodes.io')) {
        return { ok: true, status: 200, json: async () => ({ result: { postcode: 'SW1A 1AA', country: 'England', region: 'London', latitude: 51.5, longitude: -0.14 } }) };
      }
      if (u.includes('api.octopus.energy')) {
        octopusCalled = true;
        return { ok: false, status: 500 };
      }
      return { ok: false, status: 500 };
    };
    const result = await calculateRooftopViabilityByPostcode('SW1A 1AA', { ...inputs, electricityPricePencePerKwh: 30 });
    assert.equal(octopusCalled, false);
    assert.equal(result.electricityPriceLookup.ok, false);
    assert.match(result.electricityPriceLookup.note, /Skipped/);
  });

  test('a north orientation is named correctly in the Open-Meteo-derived generation note', async () => {
    global.fetch = async (url) => {
      const u = String(url);
      if (u.includes('postcodes.io')) {
        return { ok: true, status: 200, json: async () => ({ result: { postcode: 'EH1 1BB', country: 'Scotland', region: 'Edinburgh, City of', latitude: 55.9533, longitude: -3.1883 } }) };
      }
      if (u.includes('archive-api.open-meteo.com')) {
        const hourlyValue = 1000000 / 8760;
        return { ok: true, status: 200, json: async () => ({ hourly: { global_tilted_irradiance: new Array(8760).fill(hourlyValue) } }) };
      }
      throw new Error('unexpected URL: ' + u);
    };
    const result = await calculateRooftopViabilityByPostcode('EH1 1BB', { ...inputs, orientation: 'northFacing' });
    assert.match(result.assumptions.generationKwh.note, /north-facing plane/);
  });

  test('full success chain: Open-Meteo AND live electricity price both succeed together', async () => {
    global.fetch = async (url) => {
      const u = String(url);
      if (u.includes('postcodes.io')) {
        return { ok: true, status: 200, json: async () => ({ result: { postcode: 'EH1 1BB', country: 'Scotland', region: 'Edinburgh, City of', latitude: 55.9533, longitude: -3.1883 } }) };
      }
      if (u.includes('archive-api.open-meteo.com')) {
        const hourlyValue = 1000000 / 8760;
        return { ok: true, status: 200, json: async () => ({ hourly: { global_tilted_irradiance: new Array(8760).fill(hourlyValue) } }) };
      }
      if (u.includes('grid-supply-points')) return { ok: true, json: async () => ({ count: 1, results: [{ group_id: '_M' }] }) };
      if (u.includes('/products/?')) {
        return {
          ok: true,
          json: async () => ({ results: [{ code: 'VAR-25-09-01', display_name: 'Flexible Octopus', is_green: false, is_tracker: false, is_prepay: false, is_business: false, is_restricted: false, available_from: '2025-09-01T00:00:00Z', available_to: null }] }),
        };
      }
      if (u.includes('standard-unit-rates')) {
        return { ok: true, status: 200, json: async () => ({ results: [{ value_inc_vat: 27.44, valid_from: '2026-07-01T00:00:00Z' }] }) };
      }
      throw new Error('unexpected URL: ' + u);
    };
    const result = await calculateRooftopViabilityByPostcode('EH1 1BB', inputs);
    assert.equal(result.openMeteoLookup.ok, true);
    assert.equal(result.electricityPriceLookup.ok, true);
    assert.equal(result.electricityPriceLookup.productDisplayName, 'Flexible Octopus');
    assert.equal(result.assumptions.electricityPricePencePerKwh.value, 27.44);
  });

  test('a country with no REGIONAL_GENERATION_MULTIPLIER entry gets a note explaining the England fallback', async () => {
    global.fetch = async (url) => {
      if (String(url).includes('postcodes.io')) {
        return { ok: true, status: 200, json: async () => ({ result: { postcode: 'IM1 1AA', country: 'Isle of Man', region: null, latitude: 54.15, longitude: -4.48 } }) };
      }
      return { ok: false, status: 500 };
    };
    const result = await calculateRooftopViabilityByPostcode('IM1 1AA', inputs);
    assert.equal(result.openMeteoLookup.ok, false);
    assert.match(result.postcodeLookup.note, /England-calibrated default/);
  });

  test('England gets no regulatoryRegime flag', async () => {
    global.fetch = async (url) => {
      if (String(url).includes('postcodes.io')) {
        return { ok: true, status: 200, json: async () => ({ result: { postcode: 'SW1A 1AA', country: 'England', region: 'London', latitude: 51.5, longitude: -0.14 } }) };
      }
      return { ok: false, status: 500 };
    };
    const result = await calculateRooftopViabilityByPostcode('SW1A 1AA', inputs);
    assert.ok(!result.flags.some((f) => f.id === 'regulatoryRegime'));
  });
});
