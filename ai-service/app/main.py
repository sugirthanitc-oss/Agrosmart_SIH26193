import uvicorn
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

from pathlib import Path
from app.schemas import (
    SoilHealthInput,
    SoilParseResponse,
    CropRecommendationRequest,
    CropRecommendationResponse,
    FertilizerRequest,
    FertilizerResponse,
    GradingRequest,
    GradingResponse,
    FullRecommendationRequest,
    FullRecommendationResponse
)
from app.parsers.soil_pdf_parser import parse_soil_health_card_pdf
from app.models.crop_recommender import crop_recommender
from app.models.fertilizer_model import fertilizer_advisor
from app.models.grading_model import grading_model
from app.models.mrl_validator import MRLDatabase, MRLValidator
from app.models.recommendation_engine import get_full_recommendation

app = FastAPI(
    title="AgroSmart AI Microservice",
    description="Multi-criteria agricultural recommendation, soil OCR, APVMA MRL validator, and produce grading microservice (SIH 2026)",
    version="1.1.0"
)

# --- APVMA Australian MRL In-Memory Database Initialization (O(1) lookup) ---
MRL_DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "mrl_australia_table1.json"
mrl_db: Optional[MRLDatabase] = None
mrl_validator_instance: Optional[MRLValidator] = None

def init_mrl_database():
    global mrl_db, mrl_validator_instance
    try:
        if MRL_DATA_PATH.exists():
            mrl_db = MRLDatabase.from_json_file(MRL_DATA_PATH)
            mrl_validator_instance = MRLValidator(mrl_db)
            print(f"[OK] APVMA MRL Database loaded: {len(mrl_db._by_compound_commodity)} compound-crop index keys.")
        else:
            print(f"[WARNING] MRL data file not found at {MRL_DATA_PATH}")
    except Exception as e:
        print(f"Error loading MRL database: {e}")

@app.on_event("startup")
def on_startup():
    init_mrl_database()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AgroSmart-AI",
        "models": {
            "crop_recommender": "crop_multi_criteria_v1.0",
            "fertilizer_advisor": "fert_rec_v1.0",
            "quality_grading": "grading_v1.0"
        }
    }

@app.post("/soil/parse", response_model=SoilParseResponse)
async def parse_soil_card(file: UploadFile = File(...)):
    """
    Parses Government of India Soil Health Card PDF into 12 baseline parameters.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF format is accepted for official Soil Health Cards.")
    
    contents = await file.read()
    soil_input, detected_raw = parse_soil_health_card_pdf(contents, file.filename)
    
    return SoilParseResponse(
        soil_tests=soil_input,
        raw_parameters_detected=detected_raw,
        status="success",
        document_verified=True
    )

@app.post("/recommend/crop", response_model=CropRecommendationResponse)
def recommend_crop(request: CropRecommendationRequest):
    """
    Multi-criteria crop recommendation applying ICAR rules, soil suitability, and MSP economics.
    """
    return crop_recommender.recommend(request)

@app.post("/recommend/fertilizer", response_model=FertilizerResponse)
def recommend_fertilizer(request: FertilizerRequest):
    """
    Nutrient deficit calculation, fertilizer dosage matrix, and MRL compliance check.
    """
    return fertilizer_advisor.calculate_recommendations(request)

@app.get("/mrl/check")
def check_mrl(crop: str, chemical: str, expected_residue: Optional[float] = None):
    """
    Validates proposed pesticide chemical against APVMA Australian MRL thresholds.
    """
    global mrl_validator_instance
    if mrl_validator_instance is None:
        init_mrl_database()
    
    if mrl_validator_instance:
        res = mrl_validator_instance.validate(chemical, crop, expected_residue)
        return {
            "compound": res.compound,
            "crop": res.crop,
            "status": res.status.value,
            "mrl_limit_mg_per_kg": res.mrl_limit_mg_per_kg,
            "matched_commodity": res.matched_commodity,
            "is_safe_to_recommend": res.is_safe_to_recommend,
            "message": res.message
        }
    return fertilizer_advisor.validate_pesticide_compliance(crop, chemical)

@app.post("/recommend/full", response_model=FullRecommendationResponse)
def get_full_recommendation_endpoint(request: FullRecommendationRequest):
    """
    Core safety-gated recommendation flow:
      1. Generates soil-test-based fertilizer suggestions.
      2. Validates candidate pesticides against the APVMA MRL database.
      3. Gating strictly on result.is_safe_to_recommend: compliant compounds go to safe,
         exceeding or unregistered compounds shift to flagged_warnings.
    """
    global mrl_validator_instance
    if mrl_validator_instance is None:
        init_mrl_database()
    
    return get_full_recommendation(
        crop=request.crop,
        soil_test=request.soil_test,
        target_issue=request.target_issue,
        validator=mrl_validator_instance
    )

@app.post("/grade/predict", response_model=GradingResponse)
def predict_grading(request: GradingRequest):
    """
    Calculates A/B/C quality grade and predicted yield for the Smart Market Distribution Engine.
    """
    return grading_model.predict_grade(request)

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
