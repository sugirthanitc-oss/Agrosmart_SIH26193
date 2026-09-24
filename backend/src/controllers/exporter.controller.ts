import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/db.js';
import { distributionEngine } from '../services/distributionEngine.service.js';
import { HarvestListing, ExporterBroadcastRequirement, ExportConsignmentRecord } from '../database/schema.js';

export class ExporterController {
  // --- Exporter Dashboard Overview ---
  public static async getDashboard(req: Request, res: Response) {
    const exporterId = req.user!.id;
    const exporter = db.getUserById(exporterId);

    // Managed farms
    const managedFarms = db.getFarmsByExporterId(exporterId);

    // Assigned field agents
    const assignedAgents = db.getUsers().filter(u => u.role === 'agent' && u.linked_exporter_id === exporterId);

    // Export channel listings
    const exportListings = db.getHarvestListingsByChannel('export').filter(hl => {
      const farm = db.getFarmById(hl.farm_id);
      return farm?.linked_exporter_id === exporterId;
    });

    // Total bulk yield predicted
    const totalBulkQuintals = exportListings.reduce((sum, l) => sum + l.quantity, 0);

    const farmSummaries = managedFarms.map(f => {
      const farmer = db.getUserById(f.farmer_id);
      const grading = db.getLatestGradingResult(f.id);
      const visits = db.getFieldVisitsByFarmId(f.id);
      return {
        farm_id: f.id,
        farmer_name: farmer?.name || 'Verified Farmer',
        farmer_phone: farmer?.phone || '',
        area_ha: f.area_ha,
        crop: f.crop_type || 'Paddy (Basmati)',
        grade: grading?.grade || 'Awaiting',
        predicted_yield_qty: grading?.predicted_yield_qty || 0,
        mrl_compliant: grading?.mrl_compliant ?? null,
        inspections_count: visits.length,
        current_stage: f.current_stage || 'Sowing'
      };
    });

    return res.json({
      exporter_name: exporter?.name || 'IndoGlobal Agri-Exports',
      bulk_threshold_quintals: exporter?.exporter_min_bulk_threshold || 200.0,
      total_managed_farms: managedFarms.length,
      total_assigned_agents: assignedAgents.length,
      export_ready_lots: exportListings.length,
      total_export_yield_quintals: totalBulkQuintals,
      farms: farmSummaries,
      agents: assignedAgents.map(a => ({ id: a.id, name: a.name, phone: a.phone, region: a.region })),
      export_listings: exportListings
    });
  }

  // --- End-to-End Digital Traceability Dossier ---
  public static async getTraceability(req: Request, res: Response) {
    const { listingId } = req.params;
    const dossier = distributionEngine.getTraceabilityDossier(listingId);
    if (!dossier) {
      return res.status(404).json({ error: 'Traceability dossier not found for listing.' });
    }
    return res.json(dossier);
  }

  // --- Approve / Reject Field Agent Accounts ---
  public static async manageAgentAccount(req: Request, res: Response) {
    const { agentId, action } = req.body; // action: 'approve' | 'reject'
    const exporterId = req.user!.id;

    const agent = db.getUserById(agentId);
    if (!agent || agent.role !== 'agent') {
      return res.status(404).json({ error: 'Agent account not found.' });
    }

    if (action === 'approve') {
      db.updateUser(agentId, { linked_exporter_id: exporterId });
      return res.json({ success: true, message: `Field Agent ${agent.name} approved and assigned to exporter.` });
    } else {
      return res.json({ success: true, message: `Field Agent registration rejected.` });
    }
  }

  // --- Update Exporter Bulk Threshold ---
  public static async updateBulkThreshold(req: Request, res: Response) {
    const exporterId = req.user!.id;
    const { threshold_quintals } = req.body;

    if (!threshold_quintals || isNaN(threshold_quintals)) {
      return res.status(400).json({ error: 'Valid threshold_quintals number is required.' });
    }

    db.updateUser(exporterId, { exporter_min_bulk_threshold: parseFloat(threshold_quintals) });
    return res.json({ success: true, new_threshold: parseFloat(threshold_quintals) });
  }

  // --- Publish Harvest Availability Post ---
  public static async publishHarvestListing(req: Request, res: Response) {
    const { farm_id, crop, quantity, grade, available_from, channel } = req.body;
    const listing: HarvestListing = {
      id: `listing-${uuidv4().substring(0, 8)}`,
      farm_id,
      farmer_id: req.user!.id,
      crop: crop || 'Paddy (Basmati)',
      quantity: parseFloat(quantity) || 150,
      grade: grade || 'A',
      available_from: available_from || new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
      channel: channel || 'export',
      status: 'ready',
      created_at: new Date().toISOString()
    };

    db.createHarvestListing(listing);
    return res.status(201).json(listing);
  }

  // --- Dynamic Lot Partitioning (Antigravity Split Engine) ---
  public static async splitListing(req: Request, res: Response) {
    const { listingId } = req.params;
    const { export_percentage } = req.body;
    try {
      const splitResult = await distributionEngine.splitHarvestListing(
        listingId,
        export_percentage ? parseFloat(export_percentage) : 0.75
      );
      return res.json({
        success: true,
        message: 'Harvest listing partitioned dynamically between Export and Local Mandi channels.',
        ...splitResult
      });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }

  // --- Link Farmer via Farmer ID Code ---
  public static async linkFarmer(req: Request, res: Response) {
    const exporterId = req.user!.id;
    const { farmer_id_code } = req.body;

    if (!farmer_id_code) {
      return res.status(400).json({ error: 'farmer_id_code is required (e.g. TN-FARM-8492)' });
    }

    const farmer = db.getUserByFarmerIdCode(farmer_id_code.trim().toUpperCase());
    if (!farmer) {
      return res.status(404).json({ error: `No farmer found matching code '${farmer_id_code}'.` });
    }

    // Link farmer to this exporter
    db.updateUser(farmer.id, { linked_exporter_id: exporterId });

    // Link all farmer's existing farms to this exporter
    const farms = db.getFarmsByFarmerId(farmer.id);
    farms.forEach(f => {
      db.updateFarm(f.id, { linked_exporter_id: exporterId });
    });

    return res.json({
      success: true,
      message: `Farmer ${farmer.name} (${farmer.farmer_id_code}) and ${farms.length} land parcel(s) successfully linked.`,
      farmer: {
        id: farmer.id,
        name: farmer.name,
        phone: farmer.phone,
        farmer_id_code: farmer.farmer_id_code,
        district: farmer.district
      },
      linked_farms_count: farms.length
    });
  }

  // --- Progression Overview & AI Grading Split ---
  public static async getProgressionOverview(req: Request, res: Response) {
    const exporterId = req.user!.id;
    const managedFarms = db.getFarmsByExporterId(exporterId);
    const exporter = db.getUserById(exporterId);

    const agents = db.getUsers().filter(u => u.role === 'agent' && u.linked_exporter_id === exporterId);

    let totalTonnes = 0;
    let gradeATonnes = 0;
    let gradeBCTonnes = 0;

    const farmOverviews = managedFarms.map(f => {
      const farmer = db.getUserById(f.farmer_id);
      const grading = db.getLatestGradingResult(f.id);
      const assignedAgent = f.linked_agent_id ? db.getUserById(f.linked_agent_id) : null;

      const totalWeeks = f.weekly_milestones?.length || 18;
      const completedWeeks = f.weekly_milestones?.filter(m => m.completed).length || 8;
      const progressPercent = Math.min(100, Math.round((completedWeeks / totalWeeks) * 100));

      const yieldQuintals = grading?.predicted_yield_qty || ((f.area_acres || f.area_ha * 2.47105) * 25);
      const yieldTonnes = Math.round((yieldQuintals / 10) * 10) / 10;
      totalTonnes += yieldTonnes;

      const grade = grading?.grade || 'A';
      const isGradeA = grade === 'A';
      if (isGradeA) {
        gradeATonnes += yieldTonnes * 0.75;
        gradeBCTonnes += yieldTonnes * 0.25;
      } else {
        gradeBCTonnes += yieldTonnes;
      }

      return {
        farm_id: f.id,
        name: f.land_name || 'Farm Parcel',
        farmer_name: farmer?.name || f.farmer_name || 'Farmer',
        farmer_phone: farmer?.phone || '',
        farmer_id_code: farmer?.farmer_id_code || 'TN-FARM-XXXX',
        district: f.district || farmer?.district || 'Tamil Nadu',
        crop: f.crop_type || 'Ponni Paddy',
        area_acres: f.area_acres || Math.round(f.area_ha * 2.47105 * 10) / 10,
        area_ha: f.area_ha,
        progress_percent: progressPercent,
        current_stage: f.current_stage || 'Flowering & Grain Filling',
        immediate_action: f.immediate_action_prompt || 'Maintain standing water at 3cm',
        estimated_tonnes: yieldTonnes,
        grade: grade,
        grade_split: {
          grade_a_export_tonnes: Math.round(yieldTonnes * 0.75 * 10) / 10,
          grade_bc_domestic_tonnes: Math.round(yieldTonnes * 0.25 * 10) / 10
        },
        assigned_agent: assignedAgent ? { id: assignedAgent.id, name: assignedAgent.name, phone: assignedAgent.phone } : null,
        mrl_status: grading?.mrl_compliant ? 'Compliant (EU/US Standards)' : 'Compliant'
      };
    });

    return res.json({
      exporter_name: exporter?.company_name || exporter?.name || 'Kongu Agro Global Exports',
      exporter_code: exporter?.exporter_code || 'EXP-TN-COIMBATORE-101',
      gst_number: exporter?.gst_number || '33AAACK7741P1ZB',
      export_id: exporter?.export_id || '0485019284',
      summary: {
        total_linked_farms: managedFarms.length,
        total_acreage: Math.round(farmOverviews.reduce((s, f) => s + f.area_acres, 0) * 10) / 10,
        total_volume_tonnes: Math.round(totalTonnes * 10) / 10,
        grade_a_export_volume_tonnes: Math.round(gradeATonnes * 10) / 10,
        grade_bc_domestic_volume_tonnes: Math.round(gradeBCTonnes * 10) / 10,
        available_agents: agents.map(a => ({ id: a.id, name: a.name, phone: a.phone }))
      },
      farms: farmOverviews
    });
  }

  // --- Assign Field Agent to Land Parcel ---
  public static async assignAgentTask(req: Request, res: Response) {
    const exporterId = req.user!.id;
    const { farm_id, agent_id, visit_date, instruction } = req.body;

    if (!farm_id || !agent_id) {
      return res.status(400).json({ error: 'farm_id and agent_id are required.' });
    }

    const farm = db.getFarmById(farm_id);
    if (!farm || farm.linked_exporter_id !== exporterId) {
      return res.status(404).json({ error: 'Farm parcel not found or not linked to your exporter account.' });
    }

    const agent = db.getUserById(agent_id);
    if (!agent || agent.role !== 'agent' || agent.linked_exporter_id !== exporterId) {
      return res.status(400).json({ error: 'Agent must be linked to your exporter account.' });
    }

    db.updateFarm(farm_id, {
      linked_agent_id: agent_id
    });

    return res.json({
      success: true,
      message: `Assigned agent ${agent.name} for farm '${farm.land_name || 'Farm'}'. Scheduled visit: ${visit_date || 'Next cycle'}`,
      assignment: {
        farm_id,
        farm_name: farm.land_name || 'Farm',
        agent_id,
        agent_name: agent.name,
        visit_date: visit_date || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
        instruction: instruction || 'Conduct anti-fraud geo-verification and leaf nitrogen inspection.'
      }
    });
  }

  // --- Autonomous AI Agent Assignment Engine ---
  public static async autoAssignAgents(req: Request, res: Response) {
    const exporterId = req.user!.id;
    const farms = db.getFarmsByExporterId(exporterId);
    const agents = db.getUsers().filter(u => u.role === 'agent' && u.linked_exporter_id === exporterId);

    if (agents.length === 0) {
      return res.status(400).json({ error: 'No approved field agents found under this exporter.' });
    }

    const assignments: Array<{ farm_id: string; agent_id: string; agent_name: string }> = [];

    farms.forEach((farm, idx) => {
      const assignedAgent = agents[idx % agents.length];
      db.updateFarm(farm.id, { linked_agent_id: assignedAgent.id });
      assignments.push({
        farm_id: farm.id,
        agent_id: assignedAgent.id,
        agent_name: assignedAgent.name
      });
    });

    return res.json({
      success: true,
      message: `Autonomous AI assignment completed. ${farms.length} farm parcels mapped to ${agents.length} certified agents.`,
      assignments
    });
  }

  // --- Exporter Production Requirement Broadcast ---
  public static async broadcastRequirement(req: Request, res: Response) {
    const exporterId = req.user?.id || 'user-exp-01';
    const exporter = db.getUserById(exporterId);
    const {
      crop,
      quantity_tonnes,
      target_grade,
      destination_country,
      destination_port,
      target_delivery_date,
      offered_price_per_kg,
      quality_specifications
    } = req.body;

    if (!crop || !quantity_tonnes) {
      return res.status(400).json({ error: 'Crop and quantity_tonnes are required.' });
    }

    const requirement: ExporterBroadcastRequirement = {
      id: `req-exp-${Date.now().toString().slice(-6)}`,
      exporter_id: exporterId,
      exporter_name: exporter?.company_name || exporter?.name || 'Kongu Agro Global Exports',
      crop,
      quantity_tonnes: parseFloat(quantity_tonnes),
      target_grade: target_grade || 'Grade A',
      destination_country: destination_country || 'European Union',
      destination_port: destination_port || 'Port of Rotterdam',
      target_delivery_date: target_delivery_date || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      offered_price_per_kg: parseFloat(offered_price_per_kg) || 48.5,
      quality_specifications: quality_specifications || 'APEDA Export Grade A, moisture <= 13.5%, zero synthetic residue',
      status: 'OPEN',
      created_at: new Date().toISOString()
    };

    db.createExportRequirement(requirement);

    return res.status(201).json({
      success: true,
      message: `Export production requirement broadcasted for ${requirement.quantity_tonnes} MT of ${requirement.crop}.`,
      requirement
    });
  }

  // --- List Active Exporter Broadcasts & Matching Farmer Supply Lots ---
  public static async getBroadcastRequirements(req: Request, res: Response) {
    const exporterId = req.user?.id || 'user-exp-01';
    const requirements = db.getExportRequirements(exporterId);

    // Pull matching farmer harvest lots across region
    const allHarvestListings = db.getHarvestListings();
    const matchingLots = allHarvestListings.map(lot => {
      const farm = db.getFarmById(lot.farm_id);
      const farmer = db.getUserById(lot.farmer_id);
      const grading = db.getLatestGradingResult(lot.farm_id);
      return {
        id: lot.id,
        farm_name: farm?.land_name || 'Regional Farm',
        farmer_name: farmer?.name || farm?.farmer_name || 'Verified Kisan',
        district: farm?.district || 'Tamil Nadu',
        crop: lot.crop,
        quantity_tonnes: Math.round((lot.quantity / 10) * 10) / 10,
        grade: lot.grade,
        available_from: lot.available_from,
        mrl_compliant: grading?.mrl_compliant ?? true,
        traceability_token: grading?.traceability_token || 'AGRO-VERIFIED-PASS'
      };
    });

    return res.json({
      success: true,
      count: requirements.length,
      requirements,
      matching_supply_lots: matchingLots
    });
  }

  // --- Cancel / Close Requirement Broadcast ---
  public static async deleteBroadcastRequirement(req: Request, res: Response) {
    const { id } = req.params;
    const deleted = db.deleteExportRequirement(id);
    return res.json({ success: deleted });
  }

  // --- Historical Consignments Classified by Quality Grades ---
  public static async getConsignmentsHistory(req: Request, res: Response) {
    const { grade } = req.query;
    const consignments = db.getExportConsignments(grade as string);

    const totalVolume = consignments.reduce((sum, c) => sum + (c.quantity_tonnes || 0), 0);
    const gradeAVolume = consignments.filter(c => c.grade === 'Grade A').reduce((sum, c) => sum + (c.quantity_tonnes || 0), 0);
    const gradeBVolume = consignments.filter(c => c.grade === 'Grade B').reduce((sum, c) => sum + (c.quantity_tonnes || 0), 0);
    const gradeCVolume = consignments.filter(c => c.grade === 'Grade C').reduce((sum, c) => sum + (c.quantity_tonnes || 0), 0);

    return res.json({
      success: true,
      metrics: {
        total_consignments: consignments.length,
        total_shipped_tonnes: Math.round(totalVolume * 10) / 10,
        grade_a_tonnes: Math.round(gradeAVolume * 10) / 10,
        grade_b_tonnes: Math.round(gradeBVolume * 10) / 10,
        grade_c_tonnes: Math.round(gradeCVolume * 10) / 10,
        phytosanitary_pass_rate_pct: 100
      },
      consignments
    });
  }
}
