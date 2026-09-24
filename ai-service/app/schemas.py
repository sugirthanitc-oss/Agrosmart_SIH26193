from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class SoilHealthInput(BaseModel):
    ph: float = Field(..., description="Soil reaction pH (1-14)")
    ec: float = Field(..., description="Electrical conductivity in dS/m")
    organic_carbon: float = Field(..., description="Organic carbon percentage %")
    n: float = Field(..., description="Available Nitrogen (N) kg/ha")
    p: float = Field(..., description="Available Phosphorus (P2O5) kg/ha")
    k: float = Field(..., description="Available Potassium (K2O) kg/ha")
    s: float = Field(..., description="Available Sulphur (S) ppm")
    zn: float = Field(..., description="Available Zinc (Zn) ppm")
    b: float = Field(..., description="Available Boron (B) ppm")
    fe: float = Field(..., description="Available Iron (Fe) ppm")
    mn: float = Field(..., description="Available Manganese (Mn) ppm")
    cu: float = Field(..., description="Available Copper (Cu) ppm")
    tested_at: Optional[str] = None
    farm_id: Optional[str] = None
    source: Optional[str] = "Soil Health Card"

class WeatherSnapshot(BaseModel):
    temp_c: Optional[float] = 28.0
    humidity_pct: Optional[float] = 65.0
    rain_probability_24h: Optional[float] = 20.0
    rainfall_forecast_mm: Optional[float] = 12.0
    condition: Optional[str] = "Partly Cloudy"

class CropRecommendationRequest(BaseModel):
    soil_tests: SoilHealthInput
    farm_area_ha: float = 1.0
    season: str = "kharif"  # kharif | rabi
    state: Optional[str] = "Punjab"
    latest_weather: Optional[WeatherSnapshot] = None

class CropRecommendationItem(BaseModel):
    crop: str
    confidence: float
    suitability_band: str = "highly recommended"  # "highly recommended" | "moderately recommended" | "not recommended"
    seed_variety: Optional[str] = "Certified Breeder Variety"
    projected_quality_grade: Optional[str] = "Grade A"
    projected_yield_tonnes_acre: Optional[float] = None
    est_profit_per_ha: float
    est_total_profit: float
    msp_ref: float
    predicted_yield_t_per_ha: float
    sowing_window: str
    icar_notes: str
    calendar: List[Dict[str, Any]] = []

class CropRecommendationResponse(BaseModel):
    top_recommendation: CropRecommendationItem
    runner_ups: List[CropRecommendationItem]
    suitability_bands: Optional[Dict[str, List[CropRecommendationItem]]] = None
    all_recommendations: Optional[List[CropRecommendationItem]] = None
    model_version: str = "crop_rec_v1.0"
    criteria_summary: Dict[str, Any]

class FertilizerRequest(BaseModel):
    soil_tests: SoilHealthInput
    target_crop: str
    area_ha: float = 1.0

class FertilizerItem(BaseModel):
    name: str
    nutrient_target: str
    dosage_kg_per_ha: float
    total_dosage_kg: float
    timing: str
    active_ingredient: str
    mrl_compliant: bool
    icar_approved: bool
    flag_warning: Optional[str] = None
    bio_alternative: Optional[str] = None

class FertilizerResponse(BaseModel):
    target_crop: str
    deficits: Dict[str, float]
    recommendations: List[FertilizerItem]
    mrl_compliant_overall: bool
    model_version: str = "fert_rec_v1.0"

class FieldVisitSummary(BaseModel):
    visit_id: Optional[str] = None
    visit_date: str
    irrigation_regularity_score: float = Field(1.0, ge=0.0, le=1.0)
    icar_adherence_score: float = Field(1.0, ge=0.0, le=1.0)
    chemicals_applied: List[str] = []
    crop_photo_health_score: float = Field(0.9, ge=0.0, le=1.0)

class GradingRequest(BaseModel):
    farm_id: str
    crop: str
    area_ha: float
    soil_tests: SoilHealthInput
    field_visits: List[FieldVisitSummary]
    weather_history: Optional[Dict[str, Any]] = None

class GradingResponse(BaseModel):
    farm_id: str
    crop: str
    grade: str  # 'A', 'B', 'C'
    predicted_yield_qty: float  # quintals
    mrl_compliant: bool
    flags: List[str]
    model_version: str = "grading_v1.0"
    traceability_token: str

class SoilParseResponse(BaseModel):
    soil_tests: SoilHealthInput
    raw_parameters_detected: Dict[str, Any]
    status: str = "success"
    document_verified: bool = True

class FullRecommendationRequest(BaseModel):
    crop: str = Field(..., description="Crop name, e.g. Avocado, Tomatoes, Grapes, Rice")
    soil_test: Optional[Dict[str, Any]] = Field(default=None, description="Soil test parameters e.g. nitrogen_ppm, ph")
    target_issue: Optional[str] = Field(default=None, description="Target pest/disease, e.g. mites, aphids, blast")

class FullRecommendationResponse(BaseModel):
    status: str = "success"
    crop: str
    fertilizer_recommendations: List[Dict[str, Any]] = []
    pesticide_recommendations: Dict[str, List[Dict[str, Any]]] = Field(
        default_factory=lambda: {"safe": [], "flagged_warnings": []}
    )
    error: Optional[str] = None

