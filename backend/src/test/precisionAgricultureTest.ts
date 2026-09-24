import assert from 'assert';
import { db } from '../database/db.js';
import { seedDatabase } from '../seed/seedData.js';
import { CropRecommenderService } from '../services/cropRecommender.service.js';
import { FarmerController } from '../controllers/farmer.controller.js';

// Mock Express Request & Response helper
function mockReqRes(body = {}, params = {}, query = {}, user: any = null) {
  const req: any = { body, params, query, user };
  let statusCode = 200;
  let responseData: any = null;

  const res: any = {
    status(code: number) {
      statusCode = code;
      return res;
    },
    json(data: any) {
      responseData = data;
      return res;
    }
  };

  return {
    req,
    res,
    getStatus: () => statusCode,
    getData: () => responseData
  };
}

async function runPrecisionAgricultureTestSuite() {
  console.log('\n======================================================');
  console.log('--- PRECISION AGRICULTURE & DECISION-SUPPORT SUITE ---');
  console.log('======================================================\n');

  seedDatabase();

  // -------------------------------------------------------------
  // TEST 1: Multi-Parameter Soil Ingestion & ML Supervised Model
  // -------------------------------------------------------------
  console.log('[TEST 1] Multi-Parameter Soil Ingestion & 3 Suitability Bands...');
  const soilData = {
    nitrogen: 78,
    phosphorus: 42,
    potassium: 44,
    ph: 6.8,
    temperature: 24.5,
    humidity: 80,
    rainfall: 220
  };

  const cropResult = await CropRecommenderService.recommend(soilData);
  assert.ok(cropResult, 'Recommendation result must not be null');
  assert.ok(cropResult.suitability_bands, 'Must contain suitability_bands');
  assert.ok(Array.isArray(cropResult.suitability_bands.highly_recommended), 'Must have highly_recommended array');
  assert.ok(Array.isArray(cropResult.suitability_bands.moderately_recommended), 'Must have moderately_recommended array');
  assert.ok(Array.isArray(cropResult.suitability_bands.not_recommended), 'Must have not_recommended array');

  // Total crops evaluated should cover the portfolio (22 crops)
  const totalCategorized =
    cropResult.suitability_bands.highly_recommended.length +
    cropResult.suitability_bands.moderately_recommended.length +
    cropResult.suitability_bands.not_recommended.length;
  assert.strictEqual(totalCategorized, 22, `All 22 crops must be categorized across 3 bands (got ${totalCategorized})`);

  // Verify actionable insights: certified varieties, yield projections, quality grades
  const topCrop = cropResult.recommendations[0];
  assert.ok(topCrop.seed_variety, 'Must include certified seed variety');
  assert.ok(topCrop.projected_yield_tonnes_acre > 0, 'Must include yield in tonnes/acre');
  assert.ok(topCrop.projected_yield_tonnes_ha > 0, 'Must include yield in tonnes/ha');
  assert.ok(['Grade A', 'Grade B', 'Grade C'].includes(topCrop.projected_quality_grade), 'Quality grade must be Grade A, B, or C');

  // Verify band scores
  cropResult.suitability_bands.highly_recommended.forEach(c => {
    assert.ok(c.suitability_band === 'highly recommended', 'Suitability band label must match');
    assert.ok(c.suitability_score >= 75, 'Highly recommended confidence score must be >= 75');
  });

  console.log(`✓ PASS: Multi-parameter ingestion verified. Evaluated 22 crops: ${cropResult.suitability_bands.highly_recommended.length} Highly Recommended, ${cropResult.suitability_bands.moderately_recommended.length} Moderately Recommended, ${cropResult.suitability_bands.not_recommended.length} Not Recommended.`);
  console.log(`  Top recommended crop: ${topCrop.crop_name} (${topCrop.seed_variety}), Projected Yield: ${topCrop.projected_yield_tonnes_acre} MT/acre, Grade: ${topCrop.projected_quality_grade}`);

  // -------------------------------------------------------------
  // TEST 2: Farmer Rotation Decision Support Endpoint
  // -------------------------------------------------------------
  console.log('\n[TEST 2] Farmer Decision Support Endpoint (/api/farmer/next-crop-rotation)...');
  const farmerUser = { id: 'usr-farmer-01', phone: '9842100004', role: 'farmer', name: 'Arumugam Sundaram' };
  const rotationMock = mockReqRes({}, {}, { farm_id: 'farm-001-rajendra' }, farmerUser);
  await FarmerController.getNextCropRotationDecisionSupport(rotationMock.req, rotationMock.res);
  assert.strictEqual(rotationMock.getStatus(), 200);
  const rotationData = rotationMock.getData();
  assert.ok(rotationData.soil_parameters, 'Must return soil parameters');
  assert.ok(rotationData.suitability_bands, 'Must return suitability bands');
  assert.ok(rotationData.suitability_bands.highly_recommended.length > 0, 'Must contain highly recommended crops');
  console.log(`✓ PASS: Decision support endpoint successfully returned ${rotationData.recommendations.length} recommendations with suitability bands.`);

  // -------------------------------------------------------------
  // TEST 3: Geolocation-Based Meteorological & Dynamic Scheduling
  // -------------------------------------------------------------
  console.log('\n[TEST 3] Geolocation Weather & Dynamic Irrigation Scheduling...');
  const weatherMock = mockReqRes({}, {}, { lat: '10.7872', lng: '79.1375' }, farmerUser);
  await FarmerController.getWeather(weatherMock.req, weatherMock.res);
  assert.strictEqual(weatherMock.getStatus(), 200);
  const weatherData = weatherMock.getData();

  // Dynamic Irrigation Validation
  assert.ok(weatherData.dynamic_irrigation, 'Must return dynamic_irrigation');
  assert.ok(typeof weatherData.dynamic_irrigation.estimated_irrigation_need_liters_acre === 'number');
  assert.ok(typeof weatherData.dynamic_irrigation.rainfall_deferral_active === 'boolean');
  assert.ok(weatherData.dynamic_irrigation.recommendation, 'Must provide watering recommendation');

  // Precision Agro-Chemical Window Validation
  assert.ok(weatherData.precision_agrochemical_window, 'Must return precision_agrochemical_window');
  assert.ok(typeof weatherData.precision_agrochemical_window.safe_spray_window_open === 'boolean');
  assert.ok(weatherData.precision_agrochemical_window.next_safe_window_ist, 'Must provide safe window time');
  assert.ok(weatherData.precision_agrochemical_window.guidance, 'Must provide agrochemical guidance');

  console.log(`✓ PASS: Dynamic irrigation computed (${weatherData.dynamic_irrigation.estimated_irrigation_need_liters_acre} L/Acre, Deferral: ${weatherData.dynamic_irrigation.rainfall_deferral_active})`);
  console.log(`  Safe spray window: ${weatherData.precision_agrochemical_window.safe_spray_window_open ? 'OPEN' : 'RESTRICTED'} (${weatherData.precision_agrochemical_window.next_safe_window_ist})`);

  // -------------------------------------------------------------
  // TEST 4: Strict Dual-Verification Task Logging (GPS + Barcode)
  // -------------------------------------------------------------
  console.log('\n[TEST 4] Dual-Verification Enforcement (GPS Proximity <= 500m AND Physical Barcode)...');

  // 4A: Valid Barcode AND Valid GPS Proximity (Farm: 10.7872°N, 79.1375°E, Input: 10.7873°N, 79.1376°E -> ~15m away)
  const validDualVerif = mockReqRes({
    farm_id: 'farm-001-rajendra',
    task_id: 'wt-r-02',
    barcode_scanned: '8901030869123',
    batch_number: 'BATCH-2026-NSKE',
    input_name: 'NSKE 5% Organic Bio-Pesticide',
    quantity_applied: '2.5 Litres',
    dilution_rate: '25ml / 10L Water',
    gps_lat: 10.7873,
    gps_lng: 79.1376,
    operator_notes: 'Dosing complete along south boundary'
  }, {}, {}, farmerUser);

  await FarmerController.logTreatmentApplication(validDualVerif.req, validDualVerif.res);
  assert.strictEqual(validDualVerif.getStatus(), 200, `Expected 200 for valid dual verification, got ${validDualVerif.getStatus()}`);
  const validData = validDualVerif.getData();
  assert.strictEqual(validData.dual_verification_passed, true);
  console.log(`✓ PASS: Dual-verification passed for valid GPS (distance: ${validData.verification_details.gps_distance_meters.toFixed(1)}m) and verified barcode.`);

  // 4B: REJECT when GPS Distance > 500m (Spoofing attempt from Chennai: 13.0827°N, 80.2707°E)
  const spoofedGps = mockReqRes({
    farm_id: 'farm-001-rajendra',
    task_id: 'wt-r-03',
    barcode_scanned: '8901030869123',
    gps_lat: 13.0827,
    gps_lng: 80.2707
  }, {}, {}, farmerUser);

  await FarmerController.logTreatmentApplication(spoofedGps.req, spoofedGps.res);
  assert.strictEqual(spoofedGps.getStatus(), 400, 'Must reject when GPS is beyond 500m');
  const spoofData = spoofedGps.getData();
  assert.strictEqual(spoofData.error, 'DUAL_VERIFICATION_FAILED');
  console.log(`✓ PASS: Successfully blocked task commit when GPS is out of bounds (>500m). Error: ${spoofData.message}`);

  // 4C: REJECT when Barcode is Missing or Malformed
  const missingBarcode = mockReqRes({
    farm_id: 'farm-001-rajendra',
    task_id: 'wt-r-03',
    barcode_scanned: '', // Missing
    gps_lat: 10.7872,
    gps_lng: 79.1375
  }, {}, {}, farmerUser);

  await FarmerController.logTreatmentApplication(missingBarcode.req, missingBarcode.res);
  assert.strictEqual(missingBarcode.getStatus(), 400, 'Must reject when barcode is absent');
  const missingBarcodeData = missingBarcode.getData();
  assert.strictEqual(missingBarcodeData.error, 'DUAL_VERIFICATION_FAILED');
  console.log(`✓ PASS: Successfully blocked task commit when physical barcode is missing.`);

  // -------------------------------------------------------------
  // TEST 5: Offline-First Queue Batch Synchronization
  // -------------------------------------------------------------
  console.log('\n[TEST 5] Offline-First Queue Batch Synchronization (/api/farmer/offline-sync)...');
  const offlineQueueMock = mockReqRes({
    items: [
      {
        id: 'queue-001',
        action: 'log_treatment',
        payload: {
          farm_id: 'farm-001-bhavani',
          task_id: 'wt-b-02',
          barcode_scanned: '8901234567890',
          gps_lat: 11.3412,
          gps_lng: 77.7178,
          input_name: 'Organic Bio-Potash',
          quantity_applied: '5.0 kg'
        }
      },
      {
        id: 'queue-002',
        action: 'reschedule_task',
        payload: {
          farm_id: 'farm-001-bhavani',
          task_id: 'wt-b-03',
          new_date: '2026-09-18'
        }
      }
    ]
  }, {}, {}, farmerUser);

  await FarmerController.syncOfflineQueue(offlineQueueMock.req, offlineQueueMock.res);
  assert.strictEqual(offlineQueueMock.getStatus(), 200);
  const syncData = offlineQueueMock.getData();
  assert.strictEqual(syncData.success, true);
  assert.strictEqual(syncData.processed_count, 2);
  console.log(`✓ PASS: Successfully synced 2 offline-queued actions on network reconnection.`);

  console.log('\n======================================================');
  console.log(' ALL 5 PRECISION AGRICULTURE SPECIFICATIONS PASSED! ');
  console.log('======================================================\n');
}

runPrecisionAgricultureTestSuite().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
