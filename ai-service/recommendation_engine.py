"""
recommendation_engine.py

Takes farmer input (crop + soil test / pest pressure) and produces:
  - fertilizer suggestions (nutrient-deficiency based — NOT MRL-gated)
  - pesticide suggestions (MUST pass MRLValidator before being shown
    to the farmer — anything that fails is moved to `flagged_warnings`
    and excluded from the safe recommendation list)
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional, Dict, Any, List

try:
    from app.models.mrl_validator import (
        MRLDatabase,
        MRLValidator,
        ValidationResult,
        ValidationStatus,
        estimate_residue_mg_per_kg,
    )
except ImportError:
    from mrl_validator import (
        MRLDatabase,
        MRLValidator,
        ValidationResult,
        ValidationStatus,
        estimate_residue_mg_per_kg,
    )


@dataclass
class PesticideCandidate:
    compound: str
    target_issue: str
    application_rate_mg_per_kg_equiv: float
    half_life_days: float
    recommended_phi_days: int


CANDIDATE_PESTICIDES: dict[str, list[PesticideCandidate]] = {
    "avocado": [
        PesticideCandidate("Abamectin", "mites", application_rate_mg_per_kg_equiv=0.08, half_life_days=2.5, recommended_phi_days=7),
        PesticideCandidate("Abamectin", "spider mites (high pressure)", application_rate_mg_per_kg_equiv=0.9, half_life_days=2.5, recommended_phi_days=1),
        PesticideCandidate("Chlorpyrifos", "scale insects", application_rate_mg_per_kg_equiv=0.4, half_life_days=4.0, recommended_phi_days=14),
    ],
    "tomatoes": [
        PesticideCandidate("Acetamiprid", "aphids", application_rate_mg_per_kg_equiv=0.6, half_life_days=3.0, recommended_phi_days=1),
        PesticideCandidate("Chlorothalonil", "early blight", application_rate_mg_per_kg_equiv=4.0, half_life_days=4.5, recommended_phi_days=7),
        PesticideCandidate("Azoxystrobin", "powdery mildew", application_rate_mg_per_kg_equiv=0.5, half_life_days=3.5, recommended_phi_days=3),
    ],
    "tomato": [
        PesticideCandidate("Acetamiprid", "aphids", application_rate_mg_per_kg_equiv=0.6, half_life_days=3.0, recommended_phi_days=1),
        PesticideCandidate("Chlorothalonil", "early blight", application_rate_mg_per_kg_equiv=4.0, half_life_days=4.5, recommended_phi_days=7),
        PesticideCandidate("Azoxystrobin", "powdery mildew", application_rate_mg_per_kg_equiv=0.5, half_life_days=3.5, recommended_phi_days=3),
    ],
    "rice": [
        PesticideCandidate("Azoxystrobin", "blast", application_rate_mg_per_kg_equiv=2.0, half_life_days=5.0, recommended_phi_days=14),
        PesticideCandidate("Chlorpyrifos", "stem borer", application_rate_mg_per_kg_equiv=0.05, half_life_days=3.0, recommended_phi_days=21),
    ],
    "grapes": [
        PesticideCandidate("Azoxystrobin", "downy mildew", application_rate_mg_per_kg_equiv=1.0, half_life_days=4.0, recommended_phi_days=14),
        PesticideCandidate("Boscalid", "powdery mildew", application_rate_mg_per_kg_equiv=1.5, half_life_days=5.0, recommended_phi_days=14),
    ],
    "apple": [
        PesticideCandidate("Captan", "scab", application_rate_mg_per_kg_equiv=3.0, half_life_days=3.0, recommended_phi_days=7),
        PesticideCandidate("Acetamiprid", "codling moth", application_rate_mg_per_kg_equiv=0.1, half_life_days=2.5, recommended_phi_days=7),
    ]
}


@dataclass
class FertilizerSuggestion:
    nutrient: str
    product: str
    reason: str


def suggest_fertilizers(soil_test: dict) -> list[FertilizerSuggestion]:
    """
    Nutrient-deficiency based agronomic rule engine.
    """
    suggestions = []
    # Normalize keys
    n = soil_test.get("nitrogen_ppm") or soil_test.get("nitrogen") or soil_test.get("n", 999)
    p = soil_test.get("phosphorus_ppm") or soil_test.get("phosphorus") or soil_test.get("p", 999)
    k = soil_test.get("potassium_ppm") or soil_test.get("potassium") or soil_test.get("k", 999)
    ph = soil_test.get("ph")

    if n < 20 or (n > 100 and n < 200):  # Handles ppm vs kg/ha thresholds
        suggestions.append(FertilizerSuggestion(
            nutrient="Nitrogen", product="Urea (46-0-0) / Neem-Coated Urea",
            reason="Soil nitrogen below threshold for healthy vegetative canopy growth.",
        ))
    if p < 15 or (p > 100 and p < 25):
        suggestions.append(FertilizerSuggestion(
            nutrient="Phosphorus", product="DAP (18-46-0) / Single Super Phosphate",
            reason="Soil phosphorus below threshold for root and root-nodule development.",
        ))
    if k < 100 or (k > 100 and k < 150):
        suggestions.append(FertilizerSuggestion(
            nutrient="Potassium", product="MOP (0-0-60) / Bio-Potash",
            reason="Soil potassium below threshold for cellular turgor and fruit/grain filling.",
        ))
    if ph is not None and ph < 6.0:
        suggestions.append(FertilizerSuggestion(
            nutrient="Soil Conditioner", product="Agricultural Lime / Dolomite",
            reason=f"Acidic soil pH ({ph}); liming recommended to optimize nutrient uptake.",
        ))
    elif ph is not None and ph > 7.8:
        suggestions.append(FertilizerSuggestion(
            nutrient="Soil Conditioner", product="Agricultural Gypsum / Elemental Sulfur",
            reason=f"Alkaline soil pH ({ph}); gypsum recommended to lower sodium sodicity.",
        ))

    return suggestions


@dataclass
class PesticideRecommendationReport:
    safe_recommendations: list[dict] = field(default_factory=list)
    flagged_warnings: list[dict] = field(default_factory=list)


def recommend_pesticides(
    crop: str,
    target_issue: str,
    validator: MRLValidator,
) -> PesticideRecommendationReport:
    """
    Core safety-gated recommendation flow:
      1. Pull candidate products for this crop/issue from catalog.
      2. Estimate residue-at-harvest using PHI.
      3. Validate against APVMA legal MRL.
      4. If is_safe_to_recommend -> safe_recommendations, else -> flagged_warnings.
    """
    report = PesticideRecommendationReport()

    crop_clean = crop.strip().lower()
    issue_clean = target_issue.strip().lower()

    candidates = [
        c for c in CANDIDATE_PESTICIDES.get(crop_clean, [])
        if issue_clean in c.target_issue.lower() or c.target_issue.lower() in issue_clean
    ]

    # Fallback: if no candidates in dictionary, check if issue matches any general candidate
    if not candidates:
        for crop_key, cand_list in CANDIDATE_PESTICIDES.items():
            for c in cand_list:
                if issue_clean in c.target_issue.lower():
                    candidates.append(c)
                    break
            if candidates:
                break

    for candidate in candidates:
        try:
            estimated_residue = estimate_residue_mg_per_kg(
                application_rate_mg_per_kg_equivalent=candidate.application_rate_mg_per_kg_equiv,
                days_since_last_application=candidate.recommended_phi_days,
                half_life_days=candidate.half_life_days,
            )

            result: ValidationResult = validator.validate(
                compound=candidate.compound,
                crop=crop,
                expected_residue_mg_per_kg=estimated_residue,
            )

            entry = {
                "compound": candidate.compound,
                "target_issue": candidate.target_issue,
                "recommended_phi_days": candidate.recommended_phi_days,
                "estimated_residue_mg_per_kg": round(estimated_residue, 4),
                "mrl_limit_mg_per_kg": result.mrl_limit_mg_per_kg,
                "status": result.status.value,
                "matched_commodity": result.matched_commodity,
                "message": result.message,
                "is_safe": result.is_safe_to_recommend
            }

            if result.is_safe_to_recommend:
                report.safe_recommendations.append(entry)
            else:
                report.flagged_warnings.append(entry)
        except Exception as e:
            report.flagged_warnings.append({
                "compound": candidate.compound,
                "target_issue": candidate.target_issue,
                "status": "VALIDATION_ERROR",
                "message": str(e),
                "is_safe": False
            })

    return report


def get_full_recommendation(
    crop: str,
    soil_test: Optional[dict] = None,
    target_issue: Optional[str] = None,
    validator: Optional[MRLValidator] = None,
) -> dict:
    """Top-level entry point called by the FastAPI REST endpoint."""
    result = {
        "status": "success",
        "crop": crop,
        "fertilizer_recommendations": [],
        "pesticide_recommendations": {"safe": [], "flagged_warnings": []},
    }

    try:
        if soil_test:
            result["fertilizer_recommendations"] = [
                s.__dict__ for s in suggest_fertilizers(soil_test)
            ]

        if target_issue and validator:
            report = recommend_pesticides(crop, target_issue, validator)
            result["pesticide_recommendations"]["safe"] = report.safe_recommendations
            result["pesticide_recommendations"]["flagged_warnings"] = report.flagged_warnings
    except Exception as e:
        result["status"] = "error"
        result["error"] = str(e)

    return result


if __name__ == "__main__":
    import json
    import sys
    from pathlib import Path

    if hasattr(sys.stdout, "reconfigure"):
        try:
            sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass

    candidate_paths = [
        Path("mrl_australia_table1.json"),
        Path("data/mrl_australia_table1.json"),
        Path(__file__).resolve().parent / "mrl_australia_table1.json",
        Path(__file__).resolve().parent.parent / "data" / "mrl_australia_table1.json",
        Path(__file__).resolve().parent.parent.parent / "data" / "mrl_australia_table1.json",
    ]

    db_path = None
    for p in candidate_paths:
        if p.exists():
            db_path = p
            break

    if not db_path:
        raise FileNotFoundError(f"mrl_australia_table1.json not found in candidate paths: {[str(x) for x in candidate_paths]}")

    print("\n=======================================================")
    print(f" Loading APVMA MRL Database from: {db_path}")
    print("=======================================================")
    db = MRLDatabase.from_json_file(db_path)
    validator = MRLValidator(db)
    print(f"[OK] Total Compound-Crop Records Loaded: {len(db._by_compound_commodity)}")
    print(f"[OK] Distinct Commodities: {len(db._all_commodities)}")

    scenarios = [
        {
            "crop": "Avocado",
            "soil_test": {"nitrogen_ppm": 12, "phosphorus_ppm": 20, "potassium_ppm": 80, "ph": 6.2},
            "target_issue": "mites"
        },
        {
            "crop": "Tomatoes",
            "soil_test": {"nitrogen_ppm": 14, "phosphorus_ppm": 10, "potassium_ppm": 70, "ph": 5.4},
            "target_issue": "aphids"
        },
        {
            "crop": "Grapes",
            "soil_test": {"nitrogen_ppm": 25, "phosphorus_ppm": 18, "potassium_ppm": 120, "ph": 6.5},
            "target_issue": "downy mildew"
        }
    ]

    for s in scenarios:
        print(f"\n>>> QUERY: Crop='{s['crop']}', Issue='{s['target_issue']}'")
        output = get_full_recommendation(
            crop=s["crop"],
            soil_test=s["soil_test"],
            target_issue=s["target_issue"],
            validator=validator
        )
        print(json.dumps(output, indent=2))

