import fs from 'fs';
import path from 'path';
import {
  DatabaseSchema,
  User,
  Farm,
  SoilTest,
  CropRecommendation,
  FieldVisit,
  MediaCapture,
  GradingResult,
  Activity,
  HarvestListing,
  ShopRequirement,
  MarketRoute,
  OrderLedgerRecord,
  AgentAssignedForm,
  AgentInspectionLog,
  HistoricalLandUsageLog,
  ExporterBroadcastRequirement,
  ExportConsignmentRecord,
  AppliedChemicalRecord,
  AgentVisitRecommendation
} from './schema.js';
import { config } from '../config/index.js';

class AgroDatabase {
  private data: DatabaseSchema;
  private filePath: string;

  constructor() {
    this.filePath = config.dbFilePath;
    this.data = this.load();
  }

  private getInitialData(): DatabaseSchema {
    return {
      users: [],
      farms: [],
      soil_tests: [],
      crop_recommendations: [],
      field_visits: [],
      media_captures: [],
      grading_results: [],
      activities: [],
      harvest_listings: [],
      shop_requirements: [],
      market_routes: [],
      orders_ledger: [],
      agent_forms: [],
      agent_inspection_history: [],
      historical_land_logs: [],
      export_requirements: [],
      export_consignments: [],
      applied_chemicals: []
    };
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Could not read existing database file, initializing fresh db.');
    }
    const fresh = this.getInitialData();
    this.save(fresh);
    return fresh;
  }

  public save(dataToSave?: DatabaseSchema): void {
    const data = dataToSave || this.data;
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database to disk', err);
    }
  }

  // --- Users ---
  public getUsers(): User[] {
    return this.data.users;
  }

  public getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public getUserByPhone(phone: string): User | undefined {
    return this.data.users.find(u => u.phone === phone);
  }

  public getUserByFarmerIdCode(code: string): User | undefined {
    if (!code) return undefined;
    return this.data.users.find(u => u.farmer_id_code?.toUpperCase() === code.trim().toUpperCase());
  }

  public getUserByExporterCode(code: string): User | undefined {
    if (!code) return undefined;
    return this.data.users.find(u => u.exporter_code?.toUpperCase() === code.trim().toUpperCase());
  }

  public createUser(user: User): User {
    // ENFORCE ACCEPTANCE RULE: A field agent account cannot exist without a linked_exporter_id
    if (user.role === 'agent' && !user.linked_exporter_id) {
      throw new Error('AgentAccountConstraintError: A field agent account cannot exist without a valid linked_exporter_id.');
    }
    this.data.users = this.data.users.filter(u => u.id !== user.id && u.phone !== user.phone);
    this.data.users.push(user);
    this.save();
    return user;
  }

  public updateUser(id: string, updates: Partial<User>): User | undefined {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      const updated = { ...this.data.users[idx], ...updates };
      if (updated.role === 'agent' && !updated.linked_exporter_id) {
        throw new Error('AgentAccountConstraintError: A field agent must have a linked_exporter_id.');
      }
      this.data.users[idx] = updated;
      this.save();
      return updated;
    }
    return undefined;
  }

  // --- Farms ---
  public getFarms(): Farm[] {
    return this.data.farms;
  }

  public getFarmById(id: string): Farm | undefined {
    return this.data.farms.find(f => f.id === id);
  }

  public getFarmsByFarmerId(farmerId: string): Farm[] {
    return this.data.farms.filter(f => f.farmer_id === farmerId);
  }

  public getFarmsByAgentId(agentId: string): Farm[] {
    return this.data.farms.filter(f => f.linked_agent_id === agentId);
  }

  public getFarmsByExporterId(exporterId: string): Farm[] {
    return this.data.farms.filter(f => f.linked_exporter_id === exporterId);
  }

  public createFarm(farm: Farm): Farm {
    this.data.farms = this.data.farms.filter(f => f.id !== farm.id);
    this.data.farms.push(farm);
    this.save();
    return farm;
  }

  public updateFarm(id: string, updates: Partial<Farm>): Farm | undefined {
    const idx = this.data.farms.findIndex(f => f.id === id);
    if (idx !== -1) {
      this.data.farms[idx] = { ...this.data.farms[idx], ...updates };
      this.save();
      return this.data.farms[idx];
    }
    return undefined;
  }

  // --- Soil Tests ---
  public getSoilTests(): SoilTest[] {
    return this.data.soil_tests;
  }

  public getSoilTestsByFarmId(farmId: string): SoilTest[] {
    return this.data.soil_tests.filter(st => st.farm_id === farmId);
  }

  public getLatestSoilTest(farmId: string): SoilTest | undefined {
    const tests = this.getSoilTestsByFarmId(farmId);
    return tests[tests.length - 1];
  }

  public createSoilTest(test: SoilTest): SoilTest {
    this.data.soil_tests.push(test);
    this.save();
    return test;
  }

  // --- Crop Recommendations ---
  public getCropRecommendations(farmId: string): CropRecommendation[] {
    return this.data.crop_recommendations.filter(cr => cr.farm_id === farmId);
  }

  public createCropRecommendation(rec: CropRecommendation): CropRecommendation {
    this.data.crop_recommendations.push(rec);
    this.save();
    return rec;
  }

  // --- Field Visits ---
  public getFieldVisitsByFarmId(farmId: string): FieldVisit[] {
    return this.data.field_visits.filter(fv => fv.farm_id === farmId);
  }

  public createFieldVisit(visit: FieldVisit): FieldVisit {
    this.data.field_visits.push(visit);
    this.save();
    return visit;
  }

  // --- Media Captures ---
  public getMediaCapturesByVisitId(visitId: string): MediaCapture[] {
    return this.data.media_captures.filter(m => m.field_visit_id === visitId);
  }

  public getMediaCapturesByFarmId(farmId: string): MediaCapture[] {
    const visitIds = new Set(this.getFieldVisitsByFarmId(farmId).map(v => v.id));
    return this.data.media_captures.filter(m => visitIds.has(m.field_visit_id));
  }

  public createMediaCapture(media: MediaCapture): MediaCapture {
    this.data.media_captures.push(media);
    this.save();
    return media;
  }

  // --- Grading Results ---
  public getGradingResultsByFarmId(farmId: string): GradingResult[] {
    return this.data.grading_results.filter(gr => gr.farm_id === farmId);
  }

  public getLatestGradingResult(farmId: string): GradingResult | undefined {
    const results = this.getGradingResultsByFarmId(farmId);
    return results[results.length - 1];
  }

  public createGradingResult(res: GradingResult): GradingResult {
    this.data.grading_results.push(res);
    this.save();
    return res;
  }

  // --- Activities ---
  public getActivitiesByFarmId(farmId: string): Activity[] {
    return this.data.activities.filter(a => a.farm_id === farmId);
  }

  public createActivity(act: Activity): Activity {
    this.data.activities.push(act);
    this.save();
    return act;
  }

  public updateActivity(id: string, updates: Partial<Activity>): Activity | undefined {
    const idx = this.data.activities.findIndex(a => a.id === id);
    if (idx !== -1) {
      this.data.activities[idx] = { ...this.data.activities[idx], ...updates };
      this.save();
      return this.data.activities[idx];
    }
    return undefined;
  }

  // --- Harvest Listings ---
  public getHarvestListings(): HarvestListing[] {
    return this.data.harvest_listings;
  }

  public getHarvestListingById(id: string): HarvestListing | undefined {
    return this.data.harvest_listings.find(hl => hl.id === id);
  }

  public getHarvestListingsByChannel(channel: 'export' | 'state' | 'district'): HarvestListing[] {
    return this.data.harvest_listings.filter(hl => hl.channel === channel);
  }

  public createHarvestListing(listing: HarvestListing): HarvestListing {
    this.data.harvest_listings.push(listing);
    this.save();
    return listing;
  }

  public updateHarvestListing(id: string, updates: Partial<HarvestListing>): HarvestListing | undefined {
    const idx = this.data.harvest_listings.findIndex(hl => hl.id === id);
    if (idx !== -1) {
      this.data.harvest_listings[idx] = { ...this.data.harvest_listings[idx], ...updates };
      this.save();
      return this.data.harvest_listings[idx];
    }
    return undefined;
  }

  // --- Shop Requirements ---
  public getShopRequirements(): ShopRequirement[] {
    return this.data.shop_requirements;
  }

  public getShopRequirementsByOwner(ownerId: string): ShopRequirement[] {
    return this.data.shop_requirements.filter(sr => sr.shop_owner_id === ownerId);
  }

  public createShopRequirement(req: ShopRequirement): ShopRequirement {
    this.data.shop_requirements.push(req);
    this.save();
    return req;
  }

  public updateShopRequirement(id: string, updates: Partial<ShopRequirement>): ShopRequirement | undefined {
    const idx = this.data.shop_requirements.findIndex(sr => sr.id === id);
    if (idx !== -1) {
      this.data.shop_requirements[idx] = { ...this.data.shop_requirements[idx], ...updates };
      this.save();
      return this.data.shop_requirements[idx];
    }
    return undefined;
  }

  // --- Market Routes ---
  public getMarketRoutes(): MarketRoute[] {
    return this.data.market_routes;
  }

  public getMarketRoutesByListingId(listingId: string): MarketRoute[] {
    return this.data.market_routes.filter(mr => mr.harvest_listing_id === listingId);
  }

  public createMarketRoute(route: MarketRoute): MarketRoute {
    this.data.market_routes.push(route);
    this.save();
    return route;
  }

  // --- Orders, Receipts & Ledger ---
  public getOrdersLedger(): OrderLedgerRecord[] {
    return this.data.orders_ledger || [];
  }

  public getOrderById(id: string): OrderLedgerRecord | undefined {
    return (this.data.orders_ledger || []).find(o => o.id === id || o.order_number === id);
  }

  public createOrderLedgerRecord(record: OrderLedgerRecord): OrderLedgerRecord {
    if (!this.data.orders_ledger) this.data.orders_ledger = [];
    this.data.orders_ledger.unshift(record);
    this.save();
    return record;
  }

  public updateOrderDeliveryStatus(orderId: string, status: 'pending' | 'in_transit' | 'delivered', token?: string): OrderLedgerRecord | undefined {
    if (!this.data.orders_ledger) return undefined;
    const order = this.data.orders_ledger.find(o => o.id === orderId || o.order_number === orderId);
    if (order) {
      order.delivery_status = status;
      if (status === 'delivered') {
        order.processing_state = 'Delivered & Confirmed';
        order.payment_status = 'PAID';
        order.balance_due = 0;
        order.delivered_at = new Date().toISOString();
        order.delivery_confirmation_token = token || `POD-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      }
      this.save();
      return order;
    }
    return undefined;
  }

  // --- Agent Assigned Forms ---
  public getAgentForms(): AgentAssignedForm[] {
    return this.data.agent_forms || [];
  }

  public getAgentFormById(id: string): AgentAssignedForm | undefined {
    return (this.data.agent_forms || []).find(f => f.id === id || f.form_code === id);
  }

  public submitAgentForm(formId: string, submittedData: Record<string, any>): AgentAssignedForm | undefined {
    if (!this.data.agent_forms) return undefined;
    const form = this.data.agent_forms.find(f => f.id === formId || f.form_code === formId);
    if (form) {
      form.status = 'COMPLETED';
      form.submitted_data = submittedData;
      form.submitted_at = new Date().toISOString();
      this.save();
      return form;
    }
    return undefined;
  }

  // --- Agent Inspection History ---
  public getAgentInspectionHistory(): AgentInspectionLog[] {
    return this.data.agent_inspection_history || [];
  }

  public addAgentInspectionLog(log: AgentInspectionLog): AgentInspectionLog {
    if (!this.data.agent_inspection_history) this.data.agent_inspection_history = [];
    this.data.agent_inspection_history.unshift(log);
    this.save();
    return log;
  }

  // --- Historical Land Usage Logs ---
  public getHistoricalLandLogs(farmId?: string): HistoricalLandUsageLog[] {
    const logs = this.data.historical_land_logs || [];
    if (farmId) {
      return logs.filter(l => l.farm_id === farmId);
    }
    return logs;
  }

  // --- Exporter Broadcast Requirements ---
  public getExportRequirements(exporterId?: string): ExporterBroadcastRequirement[] {
    const reqs = this.data.export_requirements || [];
    if (exporterId) {
      return reqs.filter(r => r.exporter_id === exporterId);
    }
    return reqs;
  }

  public createExportRequirement(req: ExporterBroadcastRequirement): ExporterBroadcastRequirement {
    if (!this.data.export_requirements) this.data.export_requirements = [];
    this.data.export_requirements.unshift(req);
    this.save();
    return req;
  }

  public deleteExportRequirement(id: string): boolean {
    if (!this.data.export_requirements) return false;
    const initialLen = this.data.export_requirements.length;
    this.data.export_requirements = this.data.export_requirements.filter(r => r.id !== id);
    this.save();
    return this.data.export_requirements.length < initialLen;
  }

  // --- Export Consignments Ledger ---
  public getExportConsignments(grade?: string): ExportConsignmentRecord[] {
    const consignments = this.data.export_consignments || [];
    if (grade && grade !== 'ALL') {
      return consignments.filter(c => c.grade === grade);
    }
    return consignments;
  }

  public createExportConsignment(rec: ExportConsignmentRecord): ExportConsignmentRecord {
    if (!this.data.export_consignments) this.data.export_consignments = [];
    this.data.export_consignments.unshift(rec);
    this.save();
    return rec;
  }

  // --- Live Applied Agrochemicals Ledger ---
  public getAppliedChemicals(farmId?: string): AppliedChemicalRecord[] {
    const chems = this.data.applied_chemicals || [];
    if (farmId) {
      return chems.filter(c => c.farm_id === farmId);
    }
    return chems;
  }

  public logAppliedChemical(record: AppliedChemicalRecord): AppliedChemicalRecord {
    if (!this.data.applied_chemicals) this.data.applied_chemicals = [];
    this.data.applied_chemicals.unshift(record);
    this.save();
    return record;
  }

  // --- Land Parcel Claim & Mapping by Unique Code ---
  public claimFarmByParcelCode(parcelCode: string, userId: string, role: string): Farm | null {
    const cleanCode = parcelCode.trim().toUpperCase();
    const farm = this.data.farms.find(f => 
      (f.unique_parcel_code && f.unique_parcel_code.toUpperCase() === cleanCode) ||
      f.id.toUpperCase() === cleanCode
    );

    if (!farm) return null;

    if (role === 'farmer') {
      farm.farmer_id = userId;
      farm.claimed_by_user_id = userId;
      farm.claimed_at = new Date().toISOString();
    } else if (role === 'exporter') {
      farm.linked_exporter_id = userId;
      farm.claimed_at = new Date().toISOString();
    }
    this.save();
    return farm;
  }

  // --- AI-Driven 30-Day Growth Cycle Visit Recommendations ---
  public getAgentVisitRecommendations(): AgentVisitRecommendation[] {
    const farms = this.data.farms || [];
    const agents = this.data.users.filter(u => u.role === 'agent');
    const defaultAgent = agents[0] || { id: 'user-002-senthil', name: 'Senthil Kumar (Certified Field Inspector)' };

    return farms.map((farm, idx) => {
      const stage = farm.current_stage || 'Flowering';
      const assignedAgent = agents[idx % agents.length] || defaultAgent;
      const agentBadge = `EXP-TN-${(farm.district || 'ERODE').toUpperCase().slice(0, 4)}-${100 + (idx % 10)}`;

      if (stage === 'Harvest') {
        const reason = 'Pre-Harvest Quarantine: Verify MRL chemical clearance (<= 0.01 ppm) and grain moisture (<= 14%) prior to combine harvest.';
        return {
          farm_id: farm.id,
          farm_name: farm.land_name || 'Amaravathi Basin Plot A',
          farmer_name: farm.farmer_name || 'Arumugam Sundaram',
          crop_type: farm.crop_type || 'Rice',
          crop: farm.crop_type || 'Ponni Rice (BPT 5204)',
          current_stage: 'Harvest',
          growth_stage: 'Harvest',
          growth_day: 28,
          cycle_day: 28,
          urgency: 'CRITICAL',
          priority: 'CRITICAL',
          suggested_agent_id: assignedAgent.id,
          suggested_agent_name: assignedAgent.name,
          recommended_agent: {
            id: assignedAgent.id,
            name: assignedAgent.name,
            badge: agentBadge
          },
          actions: ['MRL Rapid Test Strip', 'Canopy Moisture Verification', 'Tamper-Proof Geofence Sign-Off'],
          recommended_action: 'Conduct pre-harvest MRL residue strip testing and final fruit size measurement.',
          reason: reason,
          reason_30_day_cycle: 'Day 28 of 30-Day Cycle: Final Phytosanitary Export Clearance Mandatory Window'
        };
      } else if (stage === 'Flowering') {
        const reason = 'Flowering / Bloom Phase: Audit bio-fungicide drenching (Trichoderma Viride) and assess leaf spot resistance.';
        return {
          farm_id: farm.id,
          farm_name: farm.land_name || 'Bhavani River Turmeric Acres',
          farmer_name: farm.farmer_name || 'Murugesan K',
          crop_type: farm.crop_type || 'Turmeric',
          crop: farm.crop_type || 'Erode Turmeric (Curcumin 4.5%)',
          current_stage: 'Flowering',
          growth_stage: 'Flowering',
          growth_day: 18,
          cycle_day: 18,
          urgency: 'HIGH',
          priority: 'HIGH',
          suggested_agent_id: assignedAgent.id,
          suggested_agent_name: assignedAgent.name,
          recommended_agent: {
            id: assignedAgent.id,
            name: assignedAgent.name,
            badge: agentBadge
          },
          actions: ['Trichoderma Drench Check', 'Foliar Nutrient Assay', 'Rhizome Sampling'],
          recommended_action: 'Perform mid-flowering biological pest threshold check & canopy moisture scan.',
          reason: reason,
          reason_30_day_cycle: 'Day 18 of 30-Day Cycle: Critical Bloom & Nutrient Assimilation Monitoring'
        };
      } else {
        const reason = 'Vegetative Tillering: Inspect early stem vigor, root aeration, and verify zero synthetic pyrethroid application.';
        return {
          farm_id: farm.id,
          farm_name: farm.land_name || 'Cauvery Delta Organic Cotton Plot C',
          farmer_name: farm.farmer_name || 'Sundaram Chettiar',
          crop_type: farm.crop_type || 'Cotton',
          crop: farm.crop_type || 'Chettinad Organic Cotton',
          current_stage: stage,
          growth_stage: stage,
          growth_day: 8,
          cycle_day: 8,
          urgency: 'NORMAL',
          priority: 'MEDIUM',
          suggested_agent_id: assignedAgent.id,
          suggested_agent_name: assignedAgent.name,
          recommended_agent: {
            id: assignedAgent.id,
            name: assignedAgent.name,
            badge: agentBadge
          },
          actions: ['Canopy Vigor Indexing', 'Soil Microflora Audit', 'Irrigation Check'],
          recommended_action: 'Verify vegetative tillering count, irrigation level, and organic weed control.',
          reason: reason,
          reason_30_day_cycle: 'Day 8 of 30-Day Cycle: Early Vegetative Vigor & Root Establishment'
        };
      }
    });
  }

  // --- Structured Field Agent Assessment & AI Grade/Yield Prediction ---
  public submitStructuredAgentAssessment(data: {
    farm_id: string;
    agent_id: string;
    notes: string;
    fruit_uniformity_pct: number;
    blemish_defect_rate_pct: number;
    foliage_vigor_score: number;
    chemical_strip_clear: boolean;
    soil_moisture_pct: number;
    photos?: any[];
  }) {
    const farm = this.getFarmById(data.farm_id);
    const visitId = `visit-${Date.now().toString(36)}`;

    // AI Prediction Engine
    let predicted_grade: 'Grade A' | 'Grade B' | 'Grade C' = 'Grade A';
    let prediction_confidence = 0.96;

    if (!data.chemical_strip_clear || data.blemish_defect_rate_pct > 8 || data.foliage_vigor_score < 6) {
      predicted_grade = 'Grade C';
      prediction_confidence = 0.89;
    } else if (data.blemish_defect_rate_pct >= 3 || data.fruit_uniformity_pct < 85) {
      predicted_grade = 'Grade B';
      prediction_confidence = 0.92;
    } else {
      predicted_grade = 'Grade A';
      prediction_confidence = 0.97;
    }

    const acres = farm?.area_acres || 4.0;
    const baseYieldPerAcre = farm?.crop_type?.includes('Turmeric') ? 3.5 : 4.5; // MT/acre
    const qualityFactor = (data.fruit_uniformity_pct / 100) * (data.foliage_vigor_score / 10);
    const predicted_quantity_tonnes = parseFloat((acres * baseYieldPerAcre * Math.max(0.7, qualityFactor)).toFixed(2));

    const visit: FieldVisit = {
      id: visitId,
      agent_id: data.agent_id,
      farm_id: data.farm_id,
      visit_date: new Date().toISOString().split('T')[0],
      notes: data.notes || 'Structured AI field quality audit performed.',
      irrigation_regularity_score: Math.min(1.0, data.soil_moisture_pct / 25),
      icar_adherence_score: data.chemical_strip_clear ? 0.98 : 0.65,
      chemicals_applied: ['Neem Seed Kernel Extract (NSKE 5%)', 'Bio-Potash foliar spray'],
      weather_snapshot: { temp_c: 31.5, rainfall_mm: 0, condition: 'Sunny / Ideal Harvest Window' },
      submitted_at: new Date().toISOString(),
      geofence_verified: true,
      ai_assessment: {
        fruit_uniformity_pct: data.fruit_uniformity_pct,
        blemish_defect_rate_pct: data.blemish_defect_rate_pct,
        foliage_vigor_score: data.foliage_vigor_score,
        chemical_strip_clear: data.chemical_strip_clear,
        soil_moisture_pct: data.soil_moisture_pct,
        predicted_grade,
        predicted_quantity_tonnes,
        prediction_confidence
      }
    };

    this.createFieldVisit(visit);

    if (farm) {
      farm.harvest_prediction = {
        expected_harvest_date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        days_remaining: 7,
        predicted_yield_tonnes: predicted_quantity_tonnes,
        predicted_yield_kg: Math.round(predicted_quantity_tonnes * 1000),
        grade_a_percentage: predicted_grade === 'Grade A' ? 88 : predicted_grade === 'Grade B' ? 45 : 10,
        grade_b_c_percentage: predicted_grade === 'Grade A' ? 12 : predicted_grade === 'Grade B' ? 55 : 90
      };
      this.updateFarm(farm.id, farm);
    }

    return {
      success: true,
      visit,
      prediction: {
        predicted_grade,
        predicted_quantity_tonnes,
        predicted_quantity_kg: Math.round(predicted_quantity_tonnes * 1000),
        prediction_confidence,
        harvest_window_days: 7,
        target_destination: predicted_grade === 'Grade A' ? 'Port of Rotterdam (Global Export Elite)' : 'Chennai Mandi / Domestic Market'
      }
    };
  }

  // Reset / Clear for demo/testing
  public reset(seed?: DatabaseSchema): void {
    this.data = seed ? seed : this.getInitialData();
    this.save();
  }
}

export const db = new AgroDatabase();
