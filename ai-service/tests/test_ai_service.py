import pytest
from app.schemas import SoilHealthInput, CropRecommendationRequest, FertilizerRequest, GradingRequest, FieldVisitSummary
from app.models.crop_recommender import crop_recommender
from app.models.fertilizer_model import fertilizer_advisor
from app.models.grading_model import grading_model

@pytest.fixture
def sample_soil():
    return SoilHealthInput(
        ph=7.1,
        ec=0.4,
        organic_carbon=0.65,
        n=260.0,
        p=24.0,
        k=220.0,
        s=15.0,
        zn=0.85,
        b=0.5,
        fe=6.5,
        mn=4.0,
        cu=1.1,
        source="Soil Health Card"
    )

def test_crop_recommender_kharif(sample_soil):
    req = CropRecommendationRequest(
        soil_tests=sample_soil,
        farm_area_ha=5.0,
        season="kharif",
        state="Punjab"
    )
    res = crop_recommender.recommend(req)
    assert res.top_recommendation is not None
    assert "Paddy" in res.top_recommendation.crop or "Cotton" in res.top_recommendation.crop or "Maize" in res.top_recommendation.crop
    assert res.top_recommendation.confidence > 0.70
    assert res.top_recommendation.est_profit_per_ha > 0
    assert res.model_version == "crop_multi_criteria_v1.0"
    assert len(res.runner_ups) >= 1

def test_fertilizer_and_mrl(sample_soil):
    req = FertilizerRequest(
        soil_tests=sample_soil,
        target_crop="Paddy (Basmati)",
        area_ha=2.5
    )
    res = fertilizer_advisor.calculate_recommendations(req)
    assert res.target_crop == "Paddy (Basmati)"
    assert len(res.recommendations) > 0
    assert res.model_version == "fert_rec_v1.0"

    # Test MRL block on prohibited pesticide Monocrotophos
    mrl_check = fertilizer_advisor.validate_pesticide_compliance("Cotton", "Monocrotophos")
    assert mrl_check["compliant"] is False
    assert "strictly prohibited" in mrl_check["message"].lower()
    assert "icar_approved_alternative" in mrl_check

def test_grading_model_grade_a(sample_soil):
    req = GradingRequest(
        farm_id="farm-punjab-01",
        crop="Paddy (Basmati)",
        area_ha=5.0,
        soil_tests=sample_soil,
        field_visits=[
            FieldVisitSummary(
                visit_date="2026-07-15",
                irrigation_regularity_score=0.95,
                icar_adherence_score=0.98,
                chemicals_applied=["Neem Seed Kernel Extract", "Azadirachtin"],
                crop_photo_health_score=0.96
            )
        ]
    )
    res = grading_model.predict_grade(req)
    assert res.grade == "A"
    assert res.mrl_compliant is True
    assert res.predicted_yield_qty >= 150.0  # 5 ha * ~45 quintals * ~1.1
    assert res.model_version == "grading_v1.0"
    assert res.traceability_token.startswith("AGRO-CERT-")

def test_grading_model_grade_b_due_to_mrl_breach(sample_soil):
    req = GradingRequest(
        farm_id="farm-nashik-02",
        crop="Onion",
        area_ha=2.0,
        soil_tests=sample_soil,
        field_visits=[
            FieldVisitSummary(
                visit_date="2026-08-10",
                irrigation_regularity_score=0.85,
                icar_adherence_score=0.75,
                chemicals_applied=["Monocrotophos"],  # Banned chemical!
                crop_photo_health_score=0.80
            )
        ]
    )
    res = grading_model.predict_grade(req)
    # Monocrotophos should disqualify Grade A
    assert res.grade in ["B", "C"]
    assert res.mrl_compliant is False
    assert any("MRL" in f for f in res.flags)
