import { Router } from 'express';
import multer from 'multer';
import { AuthController } from '../controllers/auth.controller.js';
import { FarmerController } from '../controllers/farmer.controller.js';
import { AgentController } from '../controllers/agent.controller.js';
import { ShopController } from '../controllers/shop.controller.js';
import { ExporterController } from '../controllers/exporter.controller.js';
import { SyncController } from '../controllers/sync.controller.js';
import { authenticateToken, requireRole, enforceFarmerIsolation } from '../middleware/auth.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const router = Router();

// --- Public Auth Routes ---
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.post('/auth/request-otp', AuthController.requestOtp);
router.post('/auth/verify-otp', AuthController.verifyOtp);
router.get('/auth/directory', AuthController.getAgentsAndExporters);

// --- Authenticated Profile ---
router.get('/auth/profile', authenticateToken, AuthController.getProfile);
router.patch('/auth/profile', authenticateToken, AuthController.updateProfile);
router.post('/auth/profile', authenticateToken, AuthController.updateProfile);

// --- Farmer Routes ---
router.get('/farmer/farms', authenticateToken, requireRole(['farmer']), FarmerController.getMyFarms);
router.post('/farmer/farms', authenticateToken, requireRole(['farmer']), FarmerController.registerFarm);
router.get('/farmer/weather', authenticateToken, FarmerController.getWeather);

router.post(
  '/farmer/farms/:farmId/soil-card',
  authenticateToken,
  requireRole(['farmer']),
  enforceFarmerIsolation,
  upload.single('file'),
  FarmerController.uploadSoilHealthCard
);

router.get(
  '/farmer/farms/:farmId/crop-recommendation',
  authenticateToken,
  requireRole(['farmer']),
  enforceFarmerIsolation,
  FarmerController.getCropRecommendation
);

// --- Dedicated 22-Crop ML Classification API ---
router.post('/ml/recommend-crop', FarmerController.predictCropRecommendation);
router.get('/ml/recommend-crop', FarmerController.predictCropRecommendation);

router.get(
  '/farmer/farms/:farmId/activities',
  authenticateToken,
  requireRole(['farmer', 'agent']),
  enforceFarmerIsolation,
  FarmerController.getActivities
);

router.patch(
  '/farmer/activities/:activityId',
  authenticateToken,
  requireRole(['farmer', 'agent']),
  FarmerController.updateActivityStatus
);

router.get(
  '/farmer/farms/:farmId/cultivation-cycle',
  authenticateToken,
  requireRole(['farmer', 'agent', 'exporter']),
  FarmerController.getCultivationCycle
);

// --- Field Agent Routes ---
router.get('/agent/assigned-farms', authenticateToken, requireRole(['agent', 'exporter']), AgentController.getAssignedFarms);
router.post('/agent/photos/upload', authenticateToken, requireRole(['agent']), AgentController.uploadCapturePhoto);
router.post('/agent/visits', authenticateToken, requireRole(['agent']), AgentController.submitVisitReport);
router.post('/agent/grading', authenticateToken, requireRole(['agent']), AgentController.triggerGrading);
router.get('/agent/mrl/check', authenticateToken, AgentController.checkMrl);
router.get('/agent/assigned-forms', AgentController.getAssignedForms);
router.post('/agent/forms/:formId/submit', AgentController.submitAssignedForm);
router.get('/agent/inspection-history', AgentController.getGranularInspectionHistory);
router.get('/agent/recommendations', AgentController.getVisitRecommendations);
router.post('/agent/structured-assessment', AgentController.submitStructuredAssessment);
router.post('/farmer/claim-parcel', authenticateToken, FarmerController.claimParcel);
router.post('/exporter/map-parcel', authenticateToken, FarmerController.claimParcel);

// --- Shop Owner Routes ---
router.post('/shop/requirements', authenticateToken, requireRole(['shop_owner']), ShopController.postRequirement);
router.get('/shop/requirements', authenticateToken, requireRole(['shop_owner', 'exporter']), ShopController.getMyRequirements);
router.get('/shop/listings', authenticateToken, ShopController.browseListings);
router.post('/shop/listings/:listingId/prebook', authenticateToken, requireRole(['shop_owner']), ShopController.prebookListing);
router.get('/shop/alerts', authenticateToken, requireRole(['shop_owner']), ShopController.getMatchAlerts);
router.get('/shop/orders-ledger', ShopController.getOrdersLedger);
router.post('/shop/orders/:orderId/confirm-delivery', ShopController.confirmDelivery);
router.get('/shop/my-listings', ShopController.getMyActiveListings);
router.get('/marketplace/my-listings', ShopController.getMyActiveListings);

router.post(
  '/farmer/farms/:farmId/missed-window-fallback',
  authenticateToken,
  requireRole(['farmer', 'agent']),
  FarmerController.triggerMissedWindowFallback
);

router.post(
  '/farmer/tasks/:activityId/action',
  authenticateToken,
  requireRole(['farmer', 'agent']),
  FarmerController.handleTaskStateAction
);

router.get(
  '/farmer/farms/:farmId/weekly-progression',
  authenticateToken,
  requireRole(['farmer', 'agent', 'exporter']),
  FarmerController.getFarmWeeklyProgression
);

router.post(
  '/farmer/supply-posts',
  authenticateToken,
  requireRole(['farmer']),
  FarmerController.postFarmerDemand
);

router.post(
  '/farmer/pesticide/verify-barcode',
  authenticateToken,
  FarmerController.verifyPesticideBarcode
);

router.post('/farmer/treatment/log-application', FarmerController.logTreatmentApplication);
router.post('/farmer/offline-sync', FarmerController.syncOfflineQueue);
router.get('/farmer/historical-land-logs', FarmerController.getHistoricalLandLogs);
router.get('/farmer/next-crop-rotation', FarmerController.getNextCropRotationDecisionSupport);

// --- Validated APVMA MRL & Chemical Safety Recommendations ---
router.post('/mrl/recommend', FarmerController.getMrlPesticideRecommendation);
router.get('/mrl/recommend', FarmerController.getMrlPesticideRecommendation);
router.post('/recommend/pesticide', FarmerController.getMrlPesticideRecommendation);
router.get('/recommend/pesticide', FarmerController.getMrlPesticideRecommendation);

router.get(
  '/farmer/farms/:farmId/traceability-audit',
  authenticateToken,
  FarmerController.getHarvestTraceabilityAudit
);

// --- Exporter Routes ---
router.get('/exporter/dashboard', authenticateToken, requireRole(['exporter']), ExporterController.getDashboard);
router.post('/exporter/link-farmer', authenticateToken, requireRole(['exporter']), ExporterController.linkFarmer);
router.get('/exporter/progression-overview', authenticateToken, requireRole(['exporter']), ExporterController.getProgressionOverview);
router.post('/exporter/assign-agent-task', authenticateToken, requireRole(['exporter']), ExporterController.assignAgentTask);
router.get('/exporter/traceability/:listingId', authenticateToken, ExporterController.getTraceability);
router.post('/exporter/agents/manage', authenticateToken, requireRole(['exporter']), ExporterController.manageAgentAccount);
router.post('/exporter/bulk-threshold', authenticateToken, requireRole(['exporter']), ExporterController.updateBulkThreshold);
router.post('/exporter/listings', authenticateToken, requireRole(['exporter']), ExporterController.publishHarvestListing);
router.post('/exporter/listings/:listingId/split', authenticateToken, requireRole(['exporter']), ExporterController.splitListing);
router.post('/exporter/auto-assign-agents', authenticateToken, requireRole(['exporter']), ExporterController.autoAssignAgents);

// --- Exporter Production Requirement Broadcasts & Consignments ---
router.post('/exporter/requirements', ExporterController.broadcastRequirement);
router.get('/exporter/requirements', ExporterController.getBroadcastRequirements);
router.delete('/exporter/requirements/:id', ExporterController.deleteBroadcastRequirement);
router.get('/exporter/consignments', ExporterController.getConsignmentsHistory);

// --- Real-Time Dynamic Compliance Document & QR Code Verification ---
router.get('/compliance/export-document/:farmId', FarmerController.getDynamicComplianceDocument);
router.get('/compliance/export-document', FarmerController.getDynamicComplianceDocument);
router.get('/compliance/verify/:token', FarmerController.verifyComplianceToken);

// --- Two-Way Marketplace Route ---
router.get('/marketplace/two-way', authenticateToken, ShopController.getTwoWayMarketplace);

// --- Offline Sync Queue ---
router.post('/sync/queue', authenticateToken, SyncController.syncQueue);

export default router;
