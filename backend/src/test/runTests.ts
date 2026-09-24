import assert from 'assert';
import { db } from '../database/db.js';
import { seedDatabase } from '../seed/seedData.js';
import { storageService } from '../services/storage.service.js';
import { distributionEngine } from '../services/distributionEngine.service.js';
import { generateToken } from '../middleware/auth.js';

async function runAcceptanceTests() {
  console.log('--- STARTING AGROSMART ACCEPTANCE TEST SUITE (SIH26193) ---');

  // Initialize DB with seed state
  seedDatabase();

  // Test 1: Field agent account cannot exist without linked_exporter_id
  console.log('[TEST 1] Verifying Field Agent must have linked_exporter_id...');
  let errorThrown = false;
  try {
    db.createUser({
      id: 'agent-illegal',
      phone: '9999999999',
      role: 'agent',
      name: 'Unlinked Agent',
      region: 'Punjab',
      language: 'en',
      created_at: new Date().toISOString()
      // linked_exporter_id is intentionally missing!
    });
  } catch (err: any) {
    errorThrown = true;
    assert.ok(err.message.includes('AgentAccountConstraintError'), 'Expected AgentAccountConstraintError');
  }
  assert.strictEqual(errorThrown, true, 'FAILED: Agent without linked_exporter_id was allowed to be created!');
  console.log('✓ PASS: Field agent constraint strictly enforced.');

  // Test 2: Farmer data isolation
  console.log('[TEST 2] Verifying Farmer Data Isolation (Farmer 1 cannot access Farmer 2)...');
  const farmer1 = db.getUserById('user-frm-01')!;
  const farmer2 = db.getUserById('user-frm-02')!;

  const farm1 = db.getFarmsByFarmerId(farmer1.id)[0];
  const farm2 = db.getFarmsByFarmerId(farmer2.id)[0];

  assert.notStrictEqual(farm1.id, farm2.id);
  assert.strictEqual(farm1.farmer_id, farmer1.id);
  assert.strictEqual(farm2.farmer_id, farmer2.id);

  // Check soil tests isolation
  const soil1 = db.getSoilTestsByFarmId(farm1.id);
  const soil2 = db.getSoilTestsByFarmId(farm2.id);
  assert.strictEqual(soil1.every(s => s.farm_id === farm1.id), true);
  assert.strictEqual(soil2.every(s => s.farm_id === farm2.id), true);
  console.log('✓ PASS: Farmer data isolation verified.');

  // Test 3: Photo capture tamper-proof signature & gallery upload blocking
  console.log('[TEST 3] Verifying Anti-Fraud Camera-Only & Signed Coordinates...');
  const metadataValid = {
    lat: 30.9010,
    lng: 75.8573,
    captured_at: new Date().toISOString(),
    device_camera_only: true,
    field_visit_id: 'visit-test-01',
    type: 'crop_photo' as const
  };
  const signature = storageService.generateCaptureSignature(metadataValid);
  const verifyValid = storageService.verifyCaptureSignature(metadataValid, signature);
  assert.strictEqual(verifyValid.valid, true);

  // Attempt gallery upload (device_camera_only = false)
  const metadataGallery = { ...metadataValid, device_camera_only: false };
  const sigGallery = storageService.generateCaptureSignature(metadataGallery);
  const verifyGallery = storageService.verifyCaptureSignature(metadataGallery, sigGallery);
  assert.strictEqual(verifyGallery.valid, false);
  assert.ok(verifyGallery.reason?.includes('FraudPreventionRule'), 'Gallery upload should be blocked');

  // Attempt coordinate tampering post capture
  const metadataTampered = { ...metadataValid, lat: 28.6139 }; // Tampered lat
  const verifyTampered = storageService.verifyCaptureSignature(metadataTampered, signature);
  assert.strictEqual(verifyTampered.valid, false);
  assert.ok(verifyTampered.reason?.includes('TamperDetectionAlert'), 'Tampered coords should be rejected');
  console.log('✓ PASS: Camera-only enforcement and tamper-proof GPS signatures verified.');

  // Test 4: Smart Market Distribution Engine - Export Route (Farm 1)
  console.log('[TEST 4] Verifying Distribution Engine -> EXPORT for Grade A + MRL Compliant...');
  const farm1Listing = db.getHarvestListingById('listing-001-export')!;
  const farm1Grading = db.getLatestGradingResult('farm-001-rajendra')!;
  assert.strictEqual(farm1Grading.grade, 'A');
  assert.strictEqual(farm1Grading.mrl_compliant, true);

  const routeRes1 = await distributionEngine.routeHarvestListing(farm1Listing.id);
  assert.strictEqual(routeRes1.route.routed_to, 'exporter');
  assert.strictEqual(routeRes1.dossier.routing_audit.channel, 'export');
  assert.ok(routeRes1.route.reason.includes('grade=A'));
  assert.ok(routeRes1.route.reason.includes('mrl_compliant=true'));
  assert.strictEqual(routeRes1.dossier.field_inspections.all_device_camera_verified, true);
  console.log('✓ PASS: Grade A routed to EXPORT with full audit trail.');

  // Test 5: Smart Market Distribution Engine - Shop Route (Farm 2)
  console.log('[TEST 5] Verifying Distribution Engine -> STATE/DISTRICT SHOP for Grade B / MRL Breach...');
  const farm2Listing = db.getHarvestListingById('listing-002-domestic')!;
  const farm2Grading = db.getLatestGradingResult('farm-002-suresh')!;
  assert.strictEqual(farm2Grading.grade, 'B');

  const routeRes2 = await distributionEngine.routeHarvestListing(farm2Listing.id);
  assert.strictEqual(routeRes2.route.routed_to, 'shop');
  assert.ok(['state', 'district'].includes(routeRes2.dossier.routing_audit.channel));
  assert.strictEqual(routeRes2.route.matched_entity_id, 'user-shop-01');
  assert.ok(routeRes2.route.reason.includes('grade=B'));
  console.log('✓ PASS: Grade B successfully diverted to District Shop Owner.');

  // Test 6: Model Versioning on every output
  console.log('[TEST 6] Verifying model_version audit requirement...');
  const allGradings = db.getGradingResultsByFarmId('farm-001-rajendra');
  assert.ok(allGradings.every(g => g.model_version && g.model_version.length > 0));
  const allRecs = db.getCropRecommendations('farm-001-rajendra');
  assert.ok(allRecs.every(r => r.model_version && r.model_version.length > 0));
  console.log('✓ PASS: All AI outputs record model_version for traceability.');

  console.log('\n======================================================');
  console.log(' ALL 6 ACCEPTANCE CRITERIA PASSED WITHOUT ERRORS! ');
  console.log('======================================================\n');
}

runAcceptanceTests().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
