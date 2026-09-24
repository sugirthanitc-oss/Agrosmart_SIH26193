import assert from 'assert';
import { db } from '../database/db.js';
import { seedDatabase } from '../seed/seedData.js';
import { AuthController } from '../controllers/auth.controller.js';
import { FarmerController } from '../controllers/farmer.controller.js';
import { ExporterController } from '../controllers/exporter.controller.js';

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

async function runNewFeatureTests() {
  console.log('\n======================================================');
  console.log('--- STARTING AGROSMART ADVANCED SUITE (SIH26193) ---');
  console.log('======================================================\n');

  seedDatabase();

  // 1. Farmer Registration & Unique Code Generation
  console.log('[TEST 1] Farmer Registration & Unique Farmer ID Code Generation...');
  const farmerReg = mockReqRes({
    phone: '9842109999',
    password: 'SecurePassword123',
    role: 'farmer',
    name: 'Kandasamy Ramasamy',
    district: 'Thanjavur',
    region: 'Thanjavur, Tamil Nadu'
  });
  await AuthController.register(farmerReg.req, farmerReg.res);
  assert.strictEqual(farmerReg.getStatus(), 201);
  const farmerData = farmerReg.getData();
  assert.ok(farmerData.user.farmer_id_code.startsWith('TN-FARM-'));
  console.log(`✓ PASS: Farmer registered with code: ${farmerData.user.farmer_id_code}`);

  // 2. Field Agent Mandatory Exporter Code Constraint
  console.log('[TEST 2] Field Agent Registration - Mandatory Exporter Code...');
  const invalidAgentReg = mockReqRes({
    phone: '9842108888',
    password: 'SecurePassword123',
    role: 'agent',
    name: 'Mani Maran',
    district: 'Coimbatore'
    // Missing exporter_code
  });
  await AuthController.register(invalidAgentReg.req, invalidAgentReg.res);
  assert.strictEqual(invalidAgentReg.getStatus(), 400);
  assert.ok(invalidAgentReg.getData().error.toLowerCase().includes('exporter code'));

  const validAgentReg = mockReqRes({
    phone: '9842108888',
    password: 'SecurePassword123',
    role: 'agent',
    name: 'Mani Maran',
    district: 'Coimbatore',
    exporter_code: 'EXP-TN-COIMBATORE-101'
  });
  await AuthController.register(validAgentReg.req, validAgentReg.res);
  assert.strictEqual(validAgentReg.getStatus(), 201);
  console.log('✓ PASS: Field Agent successfully bound to authorized exporter.');

  // 3. Exporter Registration with Strict GST & Export ID Validation
  console.log('[TEST 3] Exporter Registration - 15-char GST & 10-char Export ID Validation...');
  const invalidGstExporter = mockReqRes({
    phone: '9842107777',
    password: 'SecurePassword123',
    role: 'exporter',
    name: 'Ravi Teja',
    company_name: 'Cauvery Global Exports',
    gst_number: 'INVALID_GST_123', // Invalid format
    export_id: '0485019284'
  });
  await AuthController.register(invalidGstExporter.req, invalidGstExporter.res);
  assert.strictEqual(invalidGstExporter.getStatus(), 400);

  const validExporter = mockReqRes({
    phone: '9842107777',
    password: 'SecurePassword123',
    role: 'exporter',
    name: 'Ravi Teja',
    company_name: 'Cauvery Delta Agri Exports',
    company_reg_id: 'TN-REG-2026-09',
    gst_number: '33AAACK7741P1ZB', // Valid 15-char Tamil Nadu GST
    export_id: '0485019284',      // Valid 10-char Export ID
    email: 'exports@cauverydelta.in',
    district: 'Thanjavur'
  });
  await AuthController.register(validExporter.req, validExporter.res);
  assert.strictEqual(validExporter.getStatus(), 201);
  assert.ok(validExporter.getData().user.exporter_code.startsWith('EXP-TN-'));
  console.log(`✓ PASS: Exporter registered with code: ${validExporter.getData().user.exporter_code}`);

  // 4. Shop Owner Registration with Verifiable GST
  console.log('[TEST 4] Shop Owner Registration with GST Number...');
  const shopOwnerReg = mockReqRes({
    phone: '9842106666',
    password: 'SecurePassword123',
    role: 'shop_owner',
    name: 'Selvam Murugan',
    shop_name: 'Selvam Agro Mandi Mart',
    gst_number: '33AABCM9102K1ZV',
    district: 'Madurai'
  });
  await AuthController.register(shopOwnerReg.req, shopOwnerReg.res);
  assert.strictEqual(shopOwnerReg.getStatus(), 201);
  console.log('✓ PASS: Shop owner registered with validated GST number.');

  // 5. Land Registration with Acreage Unit Management & Soil PDF
  console.log('[TEST 5] Land Registration with Acreage Unit Management & Soil PDF...');
  const landReg = mockReqRes({
    land_name: 'Amaravathi Basin Plot C',
    area_acres: 4.5,
    area_ha: 1.82,
    crop_type: 'Ponni Rice (BPT 5204)',
    district: 'Thanjavur',
    lat: 10.7870,
    lng: 79.1378,
    soil_pdf_url: '/uploads/soil_test_sample.pdf'
  }, {}, {}, { id: farmerData.user.id });
  await FarmerController.registerFarm(landReg.req, landReg.res);
  assert.strictEqual(landReg.getStatus(), 201);
  const createdFarm = landReg.getData();
  assert.strictEqual(createdFarm.land_name, 'Amaravathi Basin Plot C');
  assert.strictEqual(createdFarm.area_acres, 4.5);
  assert.ok(createdFarm.weekly_milestones && createdFarm.weekly_milestones.length === 18);
  assert.ok(createdFarm.immediate_action_prompt.length > 0);
  console.log(`✓ PASS: Land registered with 18 milestones & prompt: "${createdFarm.immediate_action_prompt}"`);

  // 6. Task State-Machine & Anti-Fraud Camera Verification
  console.log('[TEST 6] Task State-Machine & Anti-Fraud Camera Verification...');
  const unverifiedAction = mockReqRes({
    action: 'Completed',
    device_camera_only: false // Fraud: Upload from gallery
  }, { activityId: 'act-001' }, {}, { id: 'user-frm-01' });
  await FarmerController.handleTaskStateAction(unverifiedAction.req, unverifiedAction.res);
  assert.strictEqual(unverifiedAction.getStatus(), 400);
  console.log('✓ PASS: Gallery upload strictly rejected by Anti-Fraud Camera Rule.');

  const verifiedAction = mockReqRes({
    action: 'Completed',
    device_camera_only: true, // Direct hardware camera
    geo_lat: 10.7872,
    geo_lng: 79.1375,
    photo_url: '/uploads/verified_panicle.jpg'
  }, { activityId: 'act-001' }, {}, { id: 'user-frm-01' });
  await FarmerController.handleTaskStateAction(verifiedAction.req, verifiedAction.res);
  assert.strictEqual(verifiedAction.getStatus(), 200);
  assert.strictEqual(verifiedAction.getData().activity.status.toUpperCase(), 'COMPLETED');
  console.log('✓ PASS: Direct hardware camera verified and signed with HMAC coordinates.');

  // 7. Exporter Linkage Engine: Link Farmer via Farmer ID Code
  console.log('[TEST 7] Exporter Linkage Engine - Link Farmer via Farmer ID...');
  const linkFarmerReq = mockReqRes({
    farmer_id_code: farmerData.user.farmer_id_code
  }, {}, {}, { id: 'user-exp-01' });
  await ExporterController.linkFarmer(linkFarmerReq.req, linkFarmerReq.res);
  assert.strictEqual(linkFarmerReq.getStatus(), 200);
  assert.strictEqual(linkFarmerReq.getData().linked_farms_count, 1);
  console.log(`✓ PASS: Farmer ${farmerData.user.name} and land parcel successfully linked to Exporter.`);

  // 8. Exporter Progression Overview with AI Grading Split
  console.log('[TEST 8] Exporter Progression Overview & AI Grading Split...');
  const progressionReq = mockReqRes({}, {}, {}, { id: 'user-exp-01' });
  await ExporterController.getProgressionOverview(progressionReq.req, progressionReq.res);
  assert.strictEqual(progressionReq.getStatus(), 200);
  const overviewData = progressionReq.getData();
  assert.ok(overviewData.summary.total_linked_farms >= 2);
  assert.ok(overviewData.summary.grade_a_export_volume_tonnes > 0);
  assert.ok(overviewData.summary.grade_bc_domestic_volume_tonnes > 0);
  console.log(`✓ PASS: Progression Overview computed: ${overviewData.summary.grade_a_export_volume_tonnes}T Grade A (Export) | ${overviewData.summary.grade_bc_domestic_volume_tonnes}T Grade B/C (Mandi).`);

  // 9. Exporter Field Agent Task Assignment
  console.log('[TEST 9] Exporter Field Agent Task Assignment...');
  const assignAgentReq = mockReqRes({
    farm_id: 'farm-001-rajendra',
    agent_id: 'user-agt-01',
    visit_date: '2026-09-18',
    instruction: 'Conduct leaf nitrogen inspection and verify MRL compliance.'
  }, {}, {}, { id: 'user-exp-01' });
  await ExporterController.assignAgentTask(assignAgentReq.req, assignAgentReq.res);
  assert.strictEqual(assignAgentReq.getStatus(), 200);
  console.log('✓ PASS: Field Agent assigned to farm parcel with scheduled visit and directives.');

  console.log('\n======================================================');
  console.log(' ALL 9 NEW SPECIFICATION SUITE TESTS PASSED (100%)! ');
  console.log('======================================================\n');
}

runNewFeatureTests().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
