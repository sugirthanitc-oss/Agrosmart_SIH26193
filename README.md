# AgroSmart: AI-Driven Agricultural Supply Chain Platform
**Smart India Hackathon 2026 | Problem Statement ID: SIH26193 | Team: HACKNOVA**

AgroSmart is a mobile-first, AI-driven agricultural supply chain platform connecting four key stakeholders under a 4-tier Role-Based Access Control (RBAC) architecture:
1. **Farmer**: Land boundaries, Soil Health Card OCR, AI crop recommendations, ICAR task schedule, live weather & push alerts.
2. **Field Agent**: Assigned farms, weekly inspection reports, **camera-only photo capture with signed GPS & timestamp (gallery disabled)**, MRL export compliance validator, produce quality grading.
3. **Shop Owner**: Demand signal posting, local/state harvest listings browser, match notifications, pre-booking.
4. **Exporter**: Bulk yield tracking, configurable minimum bulk threshold (`exporter_min_bulk_threshold`), field agent management, and **end-to-end digital traceability dossiers**.

---

## 🏛️ Government & Public Data Integrations

| Data Source | Purpose & Usage |
| :--- | :--- |
| **Government of India Soil Health Card** | Official 12-parameter fertility baseline: pH, EC, Organic Carbon, N, P, K, S, Zn, B, Fe, Mn, Cu parsed via OCR (`/soil/parse`). |
| **ICAR Agro-Advisories (2025-26)** | Kharif & Rabi state-wise sowing windows, seed rates, input schedules, and bio-alternatives. |
| **Codex Alimentarius & APEDA MRL Database** | Maximum Residue Limits for international trade. Blocks prohibited chemicals (e.g., Monocrotophos) and suggests ICAR biological alternatives. |
| **GoI MSP Tables (farmer.gov.in)** | Minimum Support Prices for Kharif & Rabi crops, computing expected profit per hectare: \(\text{Profit} = (\text{Yield} \times \text{MSP}) - \text{Cost}\). |

---

## 🧠 AI/ML Models (Patel & Patel 2023 Framework)

- **Multi-Criteria Crop Recommender (`crop_multi_criteria_v1.0`)**: Evaluates soil suitability against ICAR bounds, weather forecasts, and MSP economics. Filters candidates against state sowing windows.
- **Fertilizer Deficit Advisor (`fert_rec_v1.0`)**: Computes nutrient deficits (N-P-K-Zn-B), converts to fertilizer dosages, and executes an export MRL safety check.
- **Produce Quality Grading Model (`grading_v1.0`)**: Grades produce into Grade A (export premium), Grade B (state domestic), or Grade C (district processing) based on ICAR spray adherence, irrigation regularity, and residue compliance. Produces cryptographic traceability passport tokens (`AGRO-CERT-XXXXXXXX`).

---

## ⚡ Smart Market Distribution Engine (Section 4 Logic)

Automated routing triggered upon quality grading:

```text
IF Grade == 'A' AND MRL_Compliant == true AND Predicted_Yield >= Exporter_Min_Bulk_Threshold:
    → Route to EXPORT Channel
    → Notify Linked Exporter with Full Digital Traceability Record

ELSE IF Grade IN ('B', 'C') OR MRL_Compliant == false OR Predicted_Yield < Exporter_Min_Bulk_Threshold:
    → Route to STATE/DISTRICT Channel
    → Match with Open Shop Requirements in the Region
    → Notify Shop Owner; if no match, publish to Public District Feed

ALWAYS:
    → Log decision and reason in 'market_routes' for end-to-end auditability.
```

---

## 🔒 Fraud Prevention: Camera-Only & Signed Coordinates

- **Native Gallery Picker Disabled**: The camera capture component directly accesses the camera video stream (`getUserMedia`). File inputs and OS gallery pickers are completely eliminated from the DOM and Android/iOS manifest.
- **Cryptographic Geo-Tagging**: Every photo capture signs `lat + lng + timestamp + device_camera_only` using HMAC-SHA256. Any post-capture coordinate tampering or gallery substitution is immediately rejected by the server.
- **Dual Photo Requirement**: Weekly visit reports strictly require at least 1 verified crop photo AND 1 verified pesticide container photo before report submission.

---

## 📱 Section 6 Design Tokens

The unified design tokens are applied across all 4 role portals:
- `--indigo-deep: #3C22B8` (screen background gradient start)
- `--indigo: #4F31D6` (primary buttons, hero background)
- `--indigo-light: #6C4CF5` (secondary accents, progress fill)
- `--coral: #FF6B5B` (urgent alerts, push reminders)
- `--coral-deep: #F44B3D`
- `--sky: #3D9DF6` (weather, irrigation)
- `--sky-light: #8FC7FF`
- `--ink: #1F1B3A` (body text on white cards)
- `--slate: #8B87A8` (meta text)
- `--cream: #FFFFFF` (card surfaces, 20px border-radius)
- `--mist: #F4F2FC` (app background, chips)

---

## 🧪 Acceptance Checklist Verification

| Requirement | Implementation & Verification | Status |
| :--- | :--- | :---: |
| **1. Farmer data isolation** | `enforceFarmerIsolation` middleware prevents Farmer A from accessing Farmer B's soil records, media, or farm metrics. Verified in `runTests.ts` [Test 2]. | ✅ PASS |
| **2. Field Agent exporter constraint** | Database and auth layer block agent creation/registration without `linked_exporter_id`. Verified in `runTests.ts` [Test 1]. | ✅ PASS |
| **3. Camera-only capture** | File/gallery pickers removed from UI. Only direct camera video stream capture permitted. | ✅ PASS |
| **4. Signed lat/lng & timestamp** | Cryptographic HMAC signature generated at capture time; tampering detection verified in `runTests.ts` [Test 3]. | ✅ PASS |
| **5. Smart market routing** | Grade-A + MRL-compliant routes to Exporter; Grade-B / domestic routes to Shop Owner with audit log. Verified in `runTests.ts` [Test 4 & 5]. | ✅ PASS |
| **6. Model versioning** | Every recommendation and grading output logs `model_version` (`crop_multi_criteria_v1.0`, `grading_v1.0`). Verified in `runTests.ts` [Test 6]. | ✅ PASS |
| **7. Rural offline resilience** | Local storage queue for actions, cached weather, and manual/auto background sync. | ✅ PASS |

---

## 🚀 Quickstart & Demo Execution

### 1. Run Automated Tests
```powershell
# Run backend acceptance test suite
npm --prefix backend test

# Run AI microservice test suite
cd ai-service
.\venv\Scripts\python.exe -m pytest tests
```

### 2. Start Services
```powershell
# Terminal 1: AI Microservice (Port 8000)
cd ai-service
.\venv\Scripts\python.exe -m uvicorn app.main:app --port 8000

# Terminal 2: Backend API (Port 5000)
npm --prefix backend start

# Terminal 3: Mobile Web Client (Port 3000)
npm --prefix mobile run dev
```

Visit **http://localhost:3000** in your browser to experience the mobile app with 1-click persona switching (Farmer, Field Agent, Shop Owner, Exporter) and rural offline simulation!
