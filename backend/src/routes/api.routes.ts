import { Router } from 'express';
import multer from 'multer';
import { AuthController } from '../controllers/auth.controller.js';
import { FarmerController } from '../controllers/farmer.controller.js';
import { SyncController } from '../controllers/sync.controller.js';
import { authenticateToken, requireRole, enforceFarmerIsolation } from '../middleware/auth.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const router = Router();

// --- Public Auth Routes (Farmer Centric) ---
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.post('/auth/request-otp', AuthController.requestOtp);
router.post('/auth/verify-otp', AuthController.verifyOtp);

// --- Authenticated Profile ---
router.get('/auth/profile', authenticateToken, AuthController.getProfile);
router.patch('/auth/profile', authenticateToken, AuthController.updateProfile);
router.post('/auth/profile', authenticateToken, AuthController.updateProfile);

// --- Farmer Core Operations & Lands ---
router.get('/farmer/farms', authenticateToken, requireRole(['farmer']), FarmerController.getMyFarms);
router.post('/farmer/farms', authenticateToken, requireRole(['farmer']), FarmerController.registerFarm);
router.get('/farmer/weather', authenticateToken, FarmerController.getWeather);
router.post('/farmer/claim-parcel', authenticateToken, requireRole(['farmer']), FarmerController.claimParcel);

// --- Soil Health & AI Precision Recommendations ---
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

// --- Cultivation Cycle, Calendar & Task State Engine ---
router.get(
  '/farmer/farms/:farmId/cultivation-cycle',
  authenticateToken,
  requireRole(['farmer']),
  FarmerController.getCultivationCycle
);

router.get(
  '/farmer/farms/:farmId/activities',
  authenticateToken,
  requireRole(['farmer']),
  enforceFarmerIsolation,
  FarmerController.getActivities
);

router.patch(
  '/farmer/activities/:activityId',
  authenticateToken,
  requireRole(['farmer']),
  FarmerController.updateActivityStatus
);

router.post(
  '/farmer/farms/:farmId/missed-window-fallback',
  authenticateToken,
  requireRole(['farmer']),
  FarmerController.triggerMissedWindowFallback
);

router.post(
  '/farmer/tasks/:activityId/action',
  authenticateToken,
  requireRole(['farmer']),
  FarmerController.handleTaskStateAction
);

router.get(
  '/farmer/farms/:farmId/weekly-progression',
  authenticateToken,
  requireRole(['farmer']),
  FarmerController.getFarmWeeklyProgression
);

// --- Farmer Mandi & Supply Posts ---
router.post(
  '/farmer/supply-posts',
  authenticateToken,
  requireRole(['farmer']),
  FarmerController.postFarmerDemand
);

// --- Pesticide Barcode Verification & Chemical Application ---
router.post(
  '/farmer/pesticide/verify-barcode',
  authenticateToken,
  FarmerController.verifyPesticideBarcode
);

router.post('/farmer/treatment/log-application', authenticateToken, FarmerController.logTreatmentApplication);
router.post('/farmer/offline-sync', authenticateToken, FarmerController.syncOfflineQueue);
router.get('/farmer/historical-land-logs', authenticateToken, FarmerController.getHistoricalLandLogs);
router.get('/farmer/next-crop-rotation', authenticateToken, FarmerController.getNextCropRotationDecisionSupport);

// --- Validated APVMA MRL & Chemical Safety Recommendations ---
router.post('/mrl/recommend', FarmerController.getMrlPesticideRecommendation);
router.get('/mrl/recommend', FarmerController.getMrlPesticideRecommendation);
router.post('/recommend/pesticide', FarmerController.getMrlPesticideRecommendation);
router.get('/recommend/pesticide', FarmerController.getMrlPesticideRecommendation);

// --- Harvest Traceability & Compliance Verification ---
router.get(
  '/farmer/farms/:farmId/traceability-audit',
  authenticateToken,
  FarmerController.getHarvestTraceabilityAudit
);

// --- Real-Time Dynamic Compliance Document & QR Code Verification ---
router.get('/compliance/export-document/:farmId', FarmerController.getDynamicComplianceDocument);
router.get('/compliance/export-document', FarmerController.getDynamicComplianceDocument);
router.get('/compliance/verify/:token', FarmerController.verifyComplianceToken);

// --- Offline Sync Queue ---
router.post('/sync/queue', authenticateToken, SyncController.syncQueue);

export default router;
