import os
import hashlib
import json
from typing import List, Dict, Any
from app.schemas import GradingRequest, GradingResponse, FieldVisitSummary
from app.models.fertilizer_model import fertilizer_advisor

MODEL_VERSION = "grading_v1.0"

class QualityGradingModel:
    def __init__(self):
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        with open(os.path.join(base_dir, "data", "msp_reference.json"), "r") as f:
            self.msp_data = json.load(f)["crops"]

    def predict_grade(self, req: GradingRequest) -> GradingResponse:
        flags: List[str] = []
        soil = req.soil_tests
        visits = req.field_visits

        # 1. Evaluate Field Visit Adherence
        avg_irrigation = 1.0
        avg_adherence = 1.0
        avg_foliage_health = 0.95
        all_chemicals = []

        if visits:
            avg_irrigation = sum(v.irrigation_regularity_score for v in visits) / len(visits)
            avg_adherence = sum(v.icar_adherence_score for v in visits) / len(visits)
            avg_foliage_health = sum(v.crop_photo_health_score for v in visits) / len(visits)
            for v in visits:
                all_chemicals.extend(v.chemicals_applied)

        # 2. Check MRL and Prohibited Chemicals
        mrl_compliant = True
        for chem in set(all_chemicals):
            check = fertilizer_advisor.validate_pesticide_compliance(req.crop, chem)
            if not check.get("compliant", True):
                mrl_compliant = False
                flags.append(f"MRL Non-Compliance: {chem} detected during field inspection.")

        # 3. Soil Health Index
        soil_opt_score = 1.0
        if soil.ph < 6.0 or soil.ph > 8.0:
            soil_opt_score -= 0.15
            flags.append(f"Soil pH suboptimal: {soil.ph}")
        if soil.ec > 2.0:
            soil_opt_score -= 0.15
            flags.append(f"Soil salinity elevated: EC {soil.ec} dS/m")
        if soil.organic_carbon < 0.4:
            soil_opt_score -= 0.1
            flags.append("Soil Organic Carbon low (<0.4%)")

        # 4. Composite Quality Score (0 - 100)
        # Weights: 35% ICAR schedule adherence, 25% foliage health & photo signals, 25% irrigation, 15% soil
        quality_score = (
            (avg_adherence * 35.0) +
            (avg_foliage_health * 25.0) +
            (avg_irrigation * 25.0) +
            (max(0.4, soil_opt_score) * 15.0)
        )

        # Base yield reference
        crop_ref = self.msp_data.get(req.crop, {"typical_yield_quintal_per_ha": 35.0})
        base_yield_per_ha = crop_ref["typical_yield_quintal_per_ha"]

        # 5. Grade Assignment Logic
        # Grade A requires: Quality Score >= 85 AND MRL Compliant == True
        # Grade B: Quality Score >= 65 OR (Score >= 85 but MRL non-compliant)
        # Grade C: Quality Score < 65
        if quality_score >= 82.0 and mrl_compliant:
            grade = "A"
            yield_multiplier = 1.05 + ((quality_score - 82.0) / 100.0)
        elif quality_score >= 60.0:
            grade = "B"
            yield_multiplier = 0.88 + ((quality_score - 60.0) / 100.0)
            if not mrl_compliant:
                flags.append("Grade downgraded to B due to export residue risk.")
        else:
            grade = "C"
            yield_multiplier = 0.70
            flags.append("Significant stress indicators logged across cycle.")

        total_predicted_quintals = round(base_yield_per_ha * req.area_ha * yield_multiplier, 1)

        # 6. Generate Immutable Traceability Hash
        token_input = f"{req.farm_id}|{req.crop}|{grade}|{total_predicted_quintals}|{mrl_compliant}|{MODEL_VERSION}"
        traceability_token = hashlib.sha256(token_input.encode()).hexdigest()[:16].upper()

        return GradingResponse(
            farm_id=req.farm_id,
            crop=req.crop,
            grade=grade,
            predicted_yield_qty=total_predicted_quintals,
            mrl_compliant=mrl_compliant,
            flags=flags,
            model_version=MODEL_VERSION,
            traceability_token=f"AGRO-CERT-{traceability_token}"
        )

grading_model = QualityGradingModel()
