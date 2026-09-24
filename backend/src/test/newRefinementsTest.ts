import assert from 'assert';
import { db } from '../database/db.js';
import { seedDatabase } from '../seed/seedData.js';
import { FarmerController } from '../controllers/farmer.controller.js';

function mockReqRes(body = {}, params = {}, query = {}, user: any = null) {
  let statusCode = 200;
  let responseData: any = null;

  const req: any = { body, params, query, user };
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

  return { req, res, getStatus: () => statusCode, getData: () => responseData };
}

async function runRefinementsTest() {
  console.log('\n======================================================');
  console.log('--- TESTING AGROSMART REFINEMENTS & TRACEABILITY ---');
  console.log('======================================================\n');

  seedDatabase();

  // Test 1: Task Rescheduling
  console.log('[TEST 1] Testing Interactive Task Rescheduling...');
  const rescheduleReq = mockReqRes({
    action: 'RESCHEDULE',
    reschedule_days: 3
  }, { activityId: 'act-001' }, {}, { id: 'user-frm-01' });

  await FarmerController.handleTaskStateAction(rescheduleReq.req, rescheduleReq.res);
  assert.strictEqual(rescheduleReq.getStatus(), 200);
  const reschedData = rescheduleReq.getData();
  assert.strictEqual(reschedData.activity.status, 'RESCHEDULED');
  assert.ok(reschedData.rescheduled_to);
  console.log(`✓ PASS: Task rescheduled to ${reschedData.rescheduled_to} with recalculated soil moisture window.`);

  // Test 2: AI Barcode Verification - Authentic
  console.log('[TEST 2] Testing AI Pesticide Barcode Verification (Authentic)...');
  const authBarcodeReq = mockReqRes({
    barcode: '8901234567890'
  });
  await FarmerController.verifyPesticideBarcode(authBarcodeReq.req, authBarcodeReq.res);
  assert.strictEqual(authBarcodeReq.getStatus(), 200);
  const authData = authBarcodeReq.getData();
  assert.strictEqual(authData.is_authentic, true);
  assert.strictEqual(authData.verification.apeda_export_compliant, true);
  console.log(`✓ PASS: Authentic agrochemical verified: ${authData.verification.product_name}`);

  // Test 3: AI Barcode Verification - Non-compliant synthetic alert
  console.log('[TEST 3] Testing AI Pesticide Barcode Verification (Synthetic Non-Compliant Alert)...');
  const alertBarcodeReq = mockReqRes({
    barcode: '8905555444433'
  });
  await FarmerController.verifyPesticideBarcode(alertBarcodeReq.req, alertBarcodeReq.res);
  assert.strictEqual(alertBarcodeReq.getStatus(), 200);
  const alertData = alertBarcodeReq.getData();
  assert.strictEqual(alertData.is_authentic, false);
  assert.strictEqual(alertData.verification.apeda_export_compliant, false);
  console.log(`✓ PASS: Non-compliant chemical detected: ${alertData.verification.product_name} flagged.`);

  // Test 4: Harvest Lifecycle Audit Dossier & QR Passport
  console.log('[TEST 4] Testing Harvest Lifecycle Completion Audit Ledger & QR...');
  const auditReq = mockReqRes({}, { farmId: 'farm-001-rajendra' }, {}, { id: 'user-frm-01' });
  await FarmerController.getHarvestTraceabilityAudit(auditReq.req, auditReq.res);
  assert.strictEqual(auditReq.getStatus(), 200);
  const auditData = auditReq.getData();
  assert.ok(auditData.certificate_id.startsWith('AGRO-TN-2026-'));
  assert.ok(auditData.applied_chemical_ledger.length >= 3);
  assert.ok(auditData.qr_passport_url.includes('traceability'));
  console.log(`✓ PASS: Audit dossier generated for ${auditData.farm_name} with ${auditData.applied_chemical_ledger.length} verified input events.`);

  console.log('\n======================================================');
  console.log(' ALL 4 REFINEMENT SPECIFICATION TESTS PASSED (100%)! ');
  console.log('======================================================\n');
}

runRefinementsTest().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});
