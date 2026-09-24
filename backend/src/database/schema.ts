export type UserRole = 'farmer' | 'agent' | 'exporter' | 'shop_owner';

export interface User {
  id: string;
  phone: string;
  role: UserRole;
  name: string;
  region: string;
  district?: string;
  language: string;
  farmer_id_code?: string; // e.g. TN-FARM-8492
  exporter_code?: string;  // e.g. EXP-TN-COIMBATORE-101
  company_name?: string;
  company_reg_id?: string;
  gst_number?: string;
  export_id?: string;
  shop_name?: string;
  email?: string;
  password?: string;
  linked_agent_id?: string;
  linked_exporter_id?: string;
  exporter_min_bulk_threshold?: number; // Configurable per exporter
  created_at: string;
}

export interface Farm {
  id: string;
  farmer_id: string;
  farmer_name?: string;
  land_name?: string;
  district?: string;
  geo_polygon: {
    type: 'Polygon';
    coordinates: number[][][]; // GeoJSON polygon
  };
  area_ha: number;
  area_acres?: number;
  crop_type?: string;
  current_stage?: 'Sowing' | 'Vegetative' | 'Flowering' | 'Harvest';
  stage_day?: number;
  immediate_action_prompt?: string; // e.g., 'Irrigation due today'
  pesticide_fertilizer_dosing?: {
    mixture: string;
    dosage: string;
    compliance_target: string;
    due_date: string;
  };
  harvest_prediction?: {
    expected_harvest_date: string;
    days_remaining: number;
    predicted_yield_tonnes: number;
    predicted_yield_kg: number;
    grade_a_percentage: number;
    grade_b_c_percentage: number;
  };
  weekly_milestones?: Array<{
    week: number;
    title: string;
    stage: string;
    completed: boolean;
    due_action: string;
    verified_photo?: string;
  }>;
  soil_pdf_url?: string;
  soil_parsed_summary?: {
    ph: number;
    ec: number;
    organic_carbon: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
  soil_health_card_id?: string;
  linked_agent_id?: string;
  linked_exporter_id?: string;
  batch_risk_index?: number; // Real-time batch risk % (0-100)
  fallback_status?: 'nominal' | 'missed_window_curative_active' | 'mrl_containment';
  unique_parcel_code?: string; // Unique parcel ID for claiming (e.g. PARCEL-TN-8492)
  claimed_by_user_id?: string;
  claimed_at?: string;
  created_at?: string;
}

export interface SoilTest {
  id: string;
  farm_id: string;
  pdf_url?: string;
  ph: number;
  ec: number;
  organic_carbon: number;
  n: number;
  p: number;
  k: number;
  s: number;
  zn: number;
  b: number;
  fe: number;
  mn: number;
  cu: number;
  tested_at: string;
  source: 'Soil Health Card';
  edge_parsed_ms?: number; // WASM client-side parse latency
  vector_hash?: string; // Merkle leaf
}

export interface CropRecommendation {
  id: string;
  farm_id: string;
  season: 'kharif' | 'rabi';
  crop: string;
  confidence: number;
  est_profit_per_ha: number;
  msp_ref: number;
  predicted_yield_t_per_ha: number;
  model_version: string;
  created_at: string;
}

export interface FieldVisit {
  id: string;
  agent_id: string;
  farm_id: string;
  visit_date: string;
  notes: string;
  irrigation_regularity_score: number;
  icar_adherence_score: number;
  chemicals_applied: string[];
  weather_snapshot: {
    temp_c: number;
    rainfall_mm: number;
    condition: string;
  };
  submitted_at: string;
  geofence_verified?: boolean;
  ai_assessment?: {
    fruit_uniformity_pct: number;
    blemish_defect_rate_pct: number;
    foliage_vigor_score: number;
    chemical_strip_clear: boolean;
    soil_moisture_pct: number;
    predicted_grade: 'Grade A' | 'Grade B' | 'Grade C';
    predicted_quantity_tonnes: number;
    prediction_confidence: number;
  };
}

export interface AgentVisitRecommendation {
  farm_id: string;
  farm_name: string;
  farmer_name: string;
  crop_type: string;
  crop?: string;
  current_stage: string;
  growth_stage?: string;
  growth_day: number;
  cycle_day?: number;
  recommended_action: string;
  reason?: string;
  urgency: 'CRITICAL' | 'HIGH' | 'NORMAL';
  priority?: 'CRITICAL' | 'HIGH' | 'NORMAL' | 'MEDIUM';
  suggested_agent_id: string;
  suggested_agent_name: string;
  recommended_agent?: {
    id: string;
    name: string;
    badge: string;
  };
  actions?: string[];
  reason_30_day_cycle: string;
}

export interface MediaCapture {
  id: string;
  field_visit_id: string;
  type: 'crop_photo' | 'pesticide_photo';
  url: string;
  lat: number;
  lng: number;
  captured_at: string;
  device_camera_only: boolean;
  signature: string; // HMAC fraud verification
  enclave_hardware_backed?: boolean;
  compass_heading?: number;
  sync_tier?: 'tier1_burst' | 'tier2_thumb' | 'tier3_raw';
}

export interface GradingResult {
  id: string;
  farm_id: string;
  crop: string;
  grade: 'A' | 'B' | 'C';
  predicted_yield_qty: number; // in quintals
  mrl_compliant: boolean;
  flags: string[];
  model_version: string;
  created_at: string;
  traceability_token: string;
  merkle_passport_hash?: string;
}

export interface Activity {
  id: string;
  farm_id: string;
  type: 'irrigation' | 'fertilizer' | 'pest' | 'visit';
  title: string;
  stage: 'Sowing' | 'Vegetative' | 'Flowering' | 'Harvest';
  scheduled_at: string;
  status: 'pending' | 'completed' | 'skipped' | 'fallback_curative' | 'DOING_NOW' | 'COMPLETED' | 'NOT_DONE' | 'RESCHEDULED';
  reminder_sent: boolean;
  icar_guideline?: string;
  fallback_protocol?: string;
  proof_media_url?: string;
  proof_signature?: string;
  proof_lat?: number;
  proof_lng?: number;
  verified_at?: string;
}

export interface HarvestListing {
  id: string;
  farm_id: string;
  farmer_id: string;
  crop: string;
  quantity: number; // Quintals
  quantity_kg?: number;
  price_per_kg?: number;
  grade: 'A' | 'B' | 'C' | 'Grade A' | 'Grade B' | 'Grade C' | string;
  certification_status?: string;
  available_from: string;
  channel: 'export' | 'state' | 'district';
  status: 'ready' | 'routed' | 'booked' | 'split_routed';
  created_at: string;
  is_split_lot?: boolean;
  split_parent_id?: string;
  split_export_qty?: number;
  split_domestic_qty?: number;
}

export interface ShopRequirement {
  id: string;
  shop_owner_id: string;
  crop: string;
  quantity: number; // Quintals
  region: string;
  needed_by: string;
  status: 'open' | 'matched' | 'fulfilled';
  created_at: string;
}

export interface MarketRoute {
  id: string;
  harvest_listing_id: string;
  routed_to: 'exporter' | 'shop';
  matched_entity_id: string;
  routed_at: string;
  reason: string;
  traceability_record: {
    soil_test_id?: string;
    crop: string;
    grade: string;
    mrl_compliant: boolean;
    predicted_yield_qty: number;
    agent_visit_count: number;
    verified_photos_count: number;
    model_version: string;
  };
}

export interface OrderLedgerRecord {
  id: string;
  order_number: string;
  item_name: string;
  item_category: 'Harvest Lot' | 'Organic Agri-Input' | 'Seed Stock' | 'Bio-Fertilizer';
  seller_name: string;
  buyer_name: string;
  quantity_kg: number;
  unit_price: number;
  total_amount: number;
  advance_paid: number;
  balance_due: number;
  gst_amount: number;
  payment_status: 'PAID' | 'ADVANCE_PAID' | 'PENDING_SETTLEMENT';
  payment_mode: 'Escrow UPI' | 'Direct Mandi NEFT' | 'Bank Guarantee';
  processing_state: 'Pre-Booked' | 'Quality & Moisture Inspected' | 'Dispatched / In-Transit' | 'Delivered & Confirmed';
  delivery_status: 'pending' | 'in_transit' | 'delivered';
  delivery_confirmation_token?: string;
  weighbridge_slip_no?: string;
  dispatched_at?: string;
  delivered_at?: string;
  created_at: string;
}

export interface AgentAssignedForm {
  id: string;
  form_code: string;
  title: string;
  farm_id: string;
  farm_name: string;
  farmer_name: string;
  priority: 'URGENT_TODAY' | 'HIGH' | 'NORMAL';
  due_date: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  fields: Array<{
    field_id: string;
    label: string;
    type: 'text' | 'number' | 'select' | 'gps' | 'photo' | 'barcode';
    value?: any;
    options?: string[];
    required: boolean;
  }>;
  submitted_data?: Record<string, any>;
  submitted_at?: string;
}

export interface AgentInspectionLog {
  id: string;
  agent_id: string;
  farm_id: string;
  farm_name: string;
  farmer_name: string;
  location_name: string;
  gps_lat: number;
  gps_lng: number;
  visited_at: string;
  is_today: boolean;
  parameters: {
    crop: string;
    stage: string;
    brix_sugar_index: number;
    moisture_percentage: number;
    pest_incidence_percent: number;
    mrl_status: 'COMPLIANT' | 'NEEDS_ATTENTION' | 'FLAGGED';
    soil_ph: number;
  };
  notes: string;
  tamper_proof_token: string;
  photo_proof_url?: string;
}

export interface HistoricalLandUsageLog {
  id: string;
  farm_id: string;
  farm_name: string;
  season: string;
  crop_name: string;
  botanical_variety: string;
  acres_cultivated: number;
  harvested_yield_tonnes: number;
  harvested_yield_quintals: number;
  yield_per_acre: number;
  sales_total_inr: number;
  rate_per_kg: number;
  destination_channel: 'APEDA Export Grade A' | 'Domestic Mandi Grade B' | 'Regional Food Processing';
  compliance_rating: string;
  harvest_date: string;
}

export interface NextRotationRecommendation {
  crop_name: string;
  botanical_name: string;
  variety: string;
  agronomic_fit_score: number;
  season_window: string;
  duration_days: number;
  nitrogen_fixation_kg_ha: number;
  soil_rejuvenation_reason: string;
  projected_yield_tonnes_acre: number;
  projected_mandi_rate_per_kg: number;
  market_demand_trend: 'Strong Export Demand (+18%)' | 'Steady Domestic Mandi' | 'High Commercial Demand';
  est_cultivation_cost_acre: number;
  gross_market_value_acre: number;
  net_profit_projection_acre: number;
  roi_percentage: number;
}

export interface ExporterBroadcastRequirement {
  id: string;
  exporter_id: string;
  exporter_name: string;
  crop: string;
  quantity_tonnes: number;
  target_grade: 'Grade A' | 'Grade B' | 'Grade C';
  destination_country: string;
  destination_port: string;
  target_delivery_date: string;
  offered_price_per_kg: number;
  quality_specifications: string;
  status: 'OPEN' | 'MATCHED' | 'FULFILLED';
  created_at: string;
}

export interface ExportConsignmentRecord {
  id: string;
  consignment_number: string;
  exporter_id: string;
  crop: string;
  variety: string;
  grade: 'Grade A' | 'Grade B' | 'Grade C';
  quantity_tonnes: number;
  buyer_name: string;
  destination_port: string;
  destination_country: string;
  shipment_date: string;
  delivery_status: 'Delivered' | 'In-Transit' | 'Customs Cleared';
  phytosanitary_cert_no: string;
  mrl_clearance_token: string;
  container_number: string;
  vessel_name: string;
}

export interface AppliedChemicalRecord {
  id: string;
  farm_id: string;
  farm_name: string;
  crop: string;
  product_name: string;
  active_ingredient: string;
  chemical_family: string;
  dosage: string;
  target_issue: string;
  application_date: string;
  application_timestamp_formatted?: string;
  pre_harvest_interval_days: number;
  harvest_safety_date: string;
  mrl_limit_mg_per_kg: number;
  estimated_residue_at_harvest: number;
  compliance_status: 'COMPLIANT (Zero Synthetic Residue)' | 'APEDA & APVMA CERTIFIED PASS' | 'WARNING' | string;
  applicator_name: string;
  barcode: string;
  tamper_proof_token: string;
}

export interface DatabaseSchema {
  users: User[];
  farms: Farm[];
  soil_tests: SoilTest[];
  crop_recommendations: CropRecommendation[];
  field_visits: FieldVisit[];
  media_captures: MediaCapture[];
  grading_results: GradingResult[];
  activities: Activity[];
  harvest_listings: HarvestListing[];
  shop_requirements: ShopRequirement[];
  market_routes: MarketRoute[];
  orders_ledger?: OrderLedgerRecord[];
  agent_forms?: AgentAssignedForm[];
  agent_inspection_history?: AgentInspectionLog[];
  historical_land_logs?: HistoricalLandUsageLog[];
  export_requirements?: ExporterBroadcastRequirement[];
  export_consignments?: ExportConsignmentRecord[];
  applied_chemicals?: AppliedChemicalRecord[];
}
