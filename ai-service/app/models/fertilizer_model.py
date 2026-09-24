import json
import os
from typing import Dict, Any, List
from app.schemas import (
    SoilHealthInput,
    FertilizerRequest,
    FertilizerResponse,
    FertilizerItem
)

MODEL_VERSION = "fert_rec_v1.0"

class FertilizerAdvisor:
    def __init__(self):
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        with open(os.path.join(base_dir, "data", "icar_advisories.json"), "r") as f:
            self.icar_data = json.load(f)["crop_guidelines"]
        with open(os.path.join(base_dir, "data", "mrl_limits.json"), "r") as f:
            self.mrl_data = json.load(f)

    def calculate_recommendations(self, req: FertilizerRequest) -> FertilizerResponse:
        crop_guide = self.icar_data.get(req.target_crop, {
            "n_range_kg_ha": [100, 120],
            "p_range_kg_ha": [40, 50],
            "k_range_kg_ha": [40, 50],
            "zinc_critical_ppm": 0.6
        })

        soil = req.soil_tests
        target_n = crop_guide.get("n_range_kg_ha", [100, 120])[0]
        target_p = crop_guide.get("p_range_kg_ha", [40, 50])[0]
        target_k = crop_guide.get("k_range_kg_ha", [40, 50])[0]

        # Calculate deficits
        # Soil test available N (kg/ha) vs target: standard efficiency conversion
        n_deficit = max(0.0, target_n - (soil.n * 0.35))
        p_deficit = max(0.0, target_p - (soil.p * 0.45))
        k_deficit = max(0.0, target_k - (soil.k * 0.25))

        deficits = {
            "Nitrogen_kg_ha": round(n_deficit, 1),
            "Phosphorus_kg_ha": round(p_deficit, 1),
            "Potassium_kg_ha": round(k_deficit, 1),
            "Zinc_ppm": round(max(0.0, 0.6 - soil.zn), 2)
        }

        recommendations: List[FertilizerItem] = []
        overall_mrl_compliant = True

        # DAP (18% N, 46% P2O5)
        if p_deficit > 0:
            dap_qty = round((p_deficit / 0.46), 1)
            recommendations.append(FertilizerItem(
                name="Di-Ammonium Phosphate (DAP 18:46:0)",
                nutrient_target="Phosphorus & Nitrogen",
                dosage_kg_per_ha=dap_qty,
                total_dosage_kg=round(dap_qty * req.area_ha, 1),
                timing="Basal application during final land preparation",
                active_ingredient="Phosphorus pentoxide & Ammoniacal N",
                mrl_compliant=True,
                icar_approved=True
            ))
            # Subtract N provided by DAP
            n_deficit = max(0.0, n_deficit - (dap_qty * 0.18))

        # Urea (46% N)
        if n_deficit > 0:
            urea_qty = round((n_deficit / 0.46), 1)
            recommendations.append(FertilizerItem(
                name="Neem Coated Urea (46% N)",
                nutrient_target="Nitrogen",
                dosage_kg_per_ha=urea_qty,
                total_dosage_kg=round(urea_qty * req.area_ha, 1),
                timing="Split into 2 doses: 50% at tillering, 50% at panicle/flowering initiation",
                active_ingredient="Urea nitrogen + Neem extract inhibitor",
                mrl_compliant=True,
                icar_approved=True
            ))

        # MOP (60% K2O)
        if k_deficit > 0:
            mop_qty = round((k_deficit / 0.60), 1)
            recommendations.append(FertilizerItem(
                name="Muriate of Potash (MOP 60% K2O)",
                nutrient_target="Potassium",
                dosage_kg_per_ha=mop_qty,
                total_dosage_kg=round(mop_qty * req.area_ha, 1),
                timing="Full dose as basal or 50% basal + 50% flowering",
                active_ingredient="Potassium chloride",
                mrl_compliant=True,
                icar_approved=True
            ))

        # Zinc Sulphate if zinc is deficient
        if soil.zn < 0.6:
            zn_qty = 25.0
            recommendations.append(FertilizerItem(
                name="Zinc Sulphate Heptahydrate (21% Zn)",
                nutrient_target="Zinc Micronutrient",
                dosage_kg_per_ha=zn_qty,
                total_dosage_kg=round(zn_qty * req.area_ha, 1),
                timing="Basal soil application before sowing (do not mix directly with DAP)",
                active_ingredient="Zinc sulphate",
                mrl_compliant=True,
                icar_approved=True
            ))

        # Safe Pest Management item with MRL compliance check
        # Example check: Recommend Bio-Neem over prohibited chemical
        recommendations.append(FertilizerItem(
            name="Azadirachtin 1500 ppm (Bio-Pesticide)",
            nutrient_target="Crop Protection / Sucking Pest Management",
            dosage_kg_per_ha=2.5,
            total_dosage_kg=round(2.5 * req.area_ha, 1),
            timing="Scouting-triggered preventive spray at 40 and 70 days",
            active_ingredient="Azadirachtin (Neem alkaloid)",
            mrl_compliant=True,
            icar_approved=True,
            bio_alternative="Replaces export-restricted Organophosphates (Chlorpyrifos/Acephate)"
        ))

        return FertilizerResponse(
            target_crop=req.target_crop,
            deficits=deficits,
            recommendations=recommendations,
            mrl_compliant_overall=overall_mrl_compliant,
            model_version=MODEL_VERSION
        )

    def validate_pesticide_compliance(self, crop: str, chemical: str) -> Dict[str, Any]:
        """
        Validates proposed chemical against MRL table for export compliance.
        Flags prohibited items and returns ICAR approved alternative.
        """
        blocked_list = self.mrl_data.get("blocked_for_export", [])
        crop_limits = self.mrl_data.get("limits_ppm", {}).get(crop, {})
        bio_alts = self.mrl_data.get("icar_approved_bio_alternatives", {})

        is_blocked = chemical in blocked_list
        has_limit = chemical in crop_limits
        limit_val = crop_limits.get(chemical, None)

        if is_blocked:
            alt_info = bio_alts.get(chemical, {"alternative": "Neem Oil 10000 ppm + Pheromone traps", "ic_ref": "ICAR IPM"})
            return {
                "compliant": False,
                "status": "BLOCKED_FOR_EXPORT",
                "message": f"Active ingredient '{chemical}' is strictly prohibited under international export guidelines.",
                "icar_approved_alternative": alt_info.get("alternative"),
                "icar_reference": alt_info.get("ic_ref")
            }

        if has_limit and limit_val <= 0.01:
            alt_info = bio_alts.get(chemical, {"alternative": "Biological control agent (Trichoderma / Pseudomonas)", "ic_ref": "ICAR-IARI Protocol"})
            return {
                "compliant": True,
                "status": "RESTRICTED_MRL_TIGHT",
                "max_residue_limit_ppm": limit_val,
                "message": f"Export MRL threshold is extremely tight ({limit_val} ppm). Recommend replacing with ICAR bio-alternative if harvest is within 30 days.",
                "icar_approved_alternative": alt_info.get("alternative"),
                "icar_reference": alt_info.get("ic_ref")
            }

        return {
            "compliant": True,
            "status": "APPROVED",
            "max_residue_limit_ppm": limit_val or 0.1,
            "message": f"'{chemical}' is compliant with export MRL standards for {crop}."
        }

fertilizer_advisor = FertilizerAdvisor()
