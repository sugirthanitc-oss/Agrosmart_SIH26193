import pytest
from app.models.mrl_validator import (
    MRLDatabase,
    MRLValidator,
    MRLRecord,
    ValidationStatus,
    estimate_residue_mg_per_kg,
)
from app.models.recommendation_engine import (
    recommend_pesticides,
    suggest_fertilizers,
    get_full_recommendation,
)

@pytest.fixture
def mock_db():
    records = [
        MRLRecord(compound="Abamectin", commodity="Avocado", mrl_value_mg_per_kg=0.05),
        MRLRecord(compound="Chlorpyrifos", commodity="Avocado", mrl_value_mg_per_kg=0.5),
        MRLRecord(compound="Chlorothalonil", commodity="Tomatoes", mrl_value_mg_per_kg=10.0),
        MRLRecord(compound="Azoxystrobin", commodity="Grapes", mrl_value_mg_per_kg=2.0),
    ]
    return MRLDatabase(records)

@pytest.fixture
def validator(mock_db):
    return MRLValidator(mock_db)

def test_compliant_residue_within_mrl(validator):
    # Abamectin on Avocado with 0.01 mg/kg (MRL is 0.05) -> COMPLIANT
    result = validator.validate(
        compound="Abamectin",
        crop="Avocado",
        expected_residue_mg_per_kg=0.01
    )
    assert result.status == ValidationStatus.COMPLIANT
    assert result.is_safe_to_recommend is True
    assert result.mrl_limit_mg_per_kg == 0.05

def test_exceeds_mrl_flagged(validator):
    # Abamectin on Avocado with 0.08 mg/kg (MRL is 0.05) -> EXCEEDS_MRL
    result = validator.validate(
        compound="Abamectin",
        crop="Avocado",
        expected_residue_mg_per_kg=0.08
    )
    assert result.status == ValidationStatus.EXCEEDS_MRL
    assert result.is_safe_to_recommend is False

def test_no_mrl_found_for_unregistered_crop(validator):
    # Acetamiprid has no MRL on Avocado in mock_db -> NO_MRL_FOUND
    result = validator.validate(
        compound="Acetamiprid",
        crop="Avocado",
        expected_residue_mg_per_kg=0.01
    )
    assert result.status == ValidationStatus.NO_MRL_FOUND
    assert result.is_safe_to_recommend is False

def test_fuzzy_commodity_matching(validator):
    # User query is singular "tomato", mock_db has "Tomatoes"
    result = validator.validate(
        compound="Chlorothalonil",
        crop="tomato",
        expected_residue_mg_per_kg=5.0
    )
    assert result.status == ValidationStatus.COMPLIANT
    assert result.matched_commodity == "Tomatoes"
    assert result.is_safe_to_recommend is True

def test_needs_residue_estimate_when_none_supplied(validator):
    # Validation without expected_residue
    result = validator.validate(
        compound="Abamectin",
        crop="Avocado",
        expected_residue_mg_per_kg=None
    )
    assert result.status == ValidationStatus.NEEDS_RESIDUE_ESTIMATE
    assert result.is_safe_to_recommend is False

def test_residue_decay_calculation():
    # Initial dose 1.0, half life 2.5 days, after 2.5 days residue should be ~0.5
    res = estimate_residue_mg_per_kg(
        application_rate_mg_per_kg_equivalent=1.0,
        days_since_last_application=2.5,
        half_life_days=2.5
    )
    assert pytest.approx(res, 0.01) == 0.5

def test_recommendation_safety_gating(validator):
    # Avocado mites -> Abamectin safe vs spider mites high pressure -> flagged
    report = recommend_pesticides("Avocado", "mites", validator)
    assert len(report.safe_recommendations) > 0
    assert all(r["status"] == "COMPLIANT" for r in report.safe_recommendations)

    full = get_full_recommendation(
        crop="Avocado",
        soil_test={"nitrogen_ppm": 10, "ph": 5.5},
        target_issue="mites",
        validator=validator
    )
    assert len(full["fertilizer_recommendations"]) > 0
    assert "pesticide_recommendations" in full
    assert "safe" in full["pesticide_recommendations"]
