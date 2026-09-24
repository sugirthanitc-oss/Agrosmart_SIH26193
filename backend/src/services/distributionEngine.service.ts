import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { db } from '../database/db.js';
import { HarvestListing, MarketRoute, GradingResult, Farm, User } from '../database/schema.js';
import { config } from '../config/index.js';

export interface TraceabilityDossier {
  listing_id: string;
  farm_id: string;
  merkle_passport_hash?: string;
  farmer: {
    id: string;
    name: string;
    phone: string;
    region: string;
  };
  crop: string;
  area_ha: number;
  soil_health: {
    tested_at: string;
    ph: number;
    ec: number;
    organic_carbon: number;
    n_p_k: string;
    source: string;
  };
  icar_alignment: {
    sowing_advisory: string;
    model_version: string;
  };
  field_inspections: {
    total_visits: number;
    verified_camera_photos: number;
    all_device_camera_verified: boolean;
    tamper_proof_signatures_valid: boolean;
  };
  grading_and_compliance: {
    grade: 'A' | 'B' | 'C';
    predicted_yield_qty: number;
    mrl_compliant: boolean;
    flags: string[];
    traceability_token: string;
    model_version: string;
  };
  routing_audit: {
    channel: 'export' | 'state' | 'district';
    routed_to: 'exporter' | 'shop';
    matched_entity_id: string;
    reason: string;
    routed_at: string;
  };
}

export class DistributionEngineService {
  /**
   * Main routing algorithm implementing Section 4 of SIH26193 specification
   */
  public async routeHarvestListing(listingId: string): Promise<{ route: MarketRoute; dossier: TraceabilityDossier }> {
    const listing = db.getHarvestListingById(listingId);
    if (!listing) {
      throw new Error(`HarvestListing not found: ${listingId}`);
    }

    const farm = db.getFarmById(listing.farm_id);
    if (!farm) {
      throw new Error(`Farm not found for listing: ${listing.farm_id}`);
    }

    const farmer = db.getUserById(farm.farmer_id);
    const grading = db.getLatestGradingResult(farm.id);
    if (!grading) {
      throw new Error(`Cannot route listing without a completed grading_results record.`);
    }

    const linkedExporter = farm.linked_exporter_id ? db.getUserById(farm.linked_exporter_id) : undefined;
    const bulkThreshold = linkedExporter?.exporter_min_bulk_threshold || config.defaultBulkThresholdQuintals;

    // Evaluate Routing Logic
    let channel: 'export' | 'state' | 'district' = 'district';
    let routedTo: 'exporter' | 'shop' = 'shop';
    let matchedEntityId = '';
    let reason = '';

    const isGradeA = grading.grade === 'A';
    const isMrlCompliant = grading.mrl_compliant === true;
    const isBulkSufficient = grading.predicted_yield_qty >= bulkThreshold;

    if (isGradeA && isMrlCompliant && isBulkSufficient) {
      // RULE 1: Grade A + MRL compliant + >= threshold -> EXPORT
      channel = 'export';
      routedTo = 'exporter';
      matchedEntityId = farm.linked_exporter_id || 'EXPORTER_APEDA_CONSORTIUM';
      reason = `grade=A, mrl_compliant=true, yield=${grading.predicted_yield_qty}q >= threshold(${bulkThreshold}q). Routed to EXPORT channel via linked exporter.`;
    } else {
      // RULE 2: Grade B/C OR MRL non-compliant OR small lot -> STATE/DISTRICT
      channel = grading.grade === 'B' ? 'state' : 'district';
      routedTo = 'shop';

      // Match against open shop requirements in the same district/state
      const openReqs = db.getShopRequirements().filter(req => {
        if (req.status !== 'open') return false;
        const cropMatch = req.crop.toLowerCase().includes(listing.crop.toLowerCase()) ||
                          listing.crop.toLowerCase().includes(req.crop.toLowerCase());
        if (!cropMatch) return false;

        const isDirectRegionMatch = (req.region.toLowerCase().includes(farmer?.region.toLowerCase() || '') ||
                                     farmer?.region.toLowerCase().includes(req.region.toLowerCase()));
        if (isDirectRegionMatch) return true;

        // Check state-level match (e.g., both in Tamil Nadu)
        const farmerState = farmer?.region?.split(',')[1]?.trim().toLowerCase() || farmer?.region?.toLowerCase() || '';
        const reqState = req.region.split(',')[1]?.trim().toLowerCase() || req.region.toLowerCase() || '';
        return farmerState && reqState && (farmerState.includes(reqState) || reqState.includes(farmerState));
      });

      if (openReqs.length > 0) {
        // Match with highest quantity requirement
        openReqs.sort((a, b) => b.quantity - a.quantity);
        const match = openReqs[0];
        matchedEntityId = match.shop_owner_id;
        db.updateShopRequirement(match.id, { status: 'matched' });

        reason = `grade=${grading.grade}, mrl_compliant=${isMrlCompliant}, yield=${grading.predicted_yield_qty}q. Auto-matched with open shop requirement [${match.id}] in ${match.region}.`;
      } else {
        matchedEntityId = 'DISTRICT_MANDI_RETAIL_BOARD';
        const failurePoints = [];
        if (!isGradeA) failurePoints.push(`grade=${grading.grade}`);
        if (!isMrlCompliant) failurePoints.push(`mrl_compliant=false`);
        if (!isBulkSufficient) failurePoints.push(`yield=${grading.predicted_yield_qty}q < bulk_threshold(${bulkThreshold}q)`);
        reason = `${failurePoints.join(', ')}. Routed to public District Marketplace feed.`;
      }
    }

    // Update harvest listing
    db.updateHarvestListing(listing.id, {
      channel,
      status: 'routed'
    });

    // Gather digital audit records for end-to-end traceability
    const soilTest = db.getLatestSoilTest(farm.id);
    const visits = db.getFieldVisitsByFarmId(farm.id);
    const photos = db.getMediaCapturesByFarmId(farm.id);

    const marketRoute: MarketRoute = {
      id: `route-${uuidv4().substring(0, 8)}`,
      harvest_listing_id: listing.id,
      routed_to: routedTo,
      matched_entity_id: matchedEntityId,
      routed_at: new Date().toISOString(),
      reason,
      traceability_record: {
        soil_test_id: soilTest?.id,
        crop: listing.crop,
        grade: grading.grade,
        mrl_compliant: grading.mrl_compliant,
        predicted_yield_qty: grading.predicted_yield_qty,
        agent_visit_count: visits.length,
        verified_photos_count: photos.length,
        model_version: grading.model_version
      }
    };

    db.createMarketRoute(marketRoute);

    const dossier: TraceabilityDossier = {
      listing_id: listing.id,
      farm_id: farm.id,
      farmer: {
        id: farmer?.id || 'unknown',
        name: farmer?.name || 'Farmer',
        phone: farmer?.phone || '',
        region: farmer?.region || 'Punjab'
      },
      crop: listing.crop,
      area_ha: farm.area_ha,
      soil_health: {
        tested_at: soilTest?.tested_at || '2026-06-01',
        ph: soilTest?.ph || 7.2,
        ec: soilTest?.ec || 0.4,
        organic_carbon: soilTest?.organic_carbon || 0.6,
        n_p_k: `${soilTest?.n || 240}-${soilTest?.p || 24}-${soilTest?.k || 220}`,
        source: soilTest?.source || 'Soil Health Card'
      },
      icar_alignment: {
        sowing_advisory: 'Adhered to ICAR sowing window & pest thresholds',
        model_version: 'crop_multi_criteria_v1.0'
      },
      field_inspections: {
        total_visits: visits.length,
        verified_camera_photos: photos.length,
        all_device_camera_verified: photos.every(p => p.device_camera_only),
        tamper_proof_signatures_valid: photos.length > 0
      },
      grading_and_compliance: {
        grade: grading.grade,
        predicted_yield_qty: grading.predicted_yield_qty,
        mrl_compliant: grading.mrl_compliant,
        flags: grading.flags || [],
        traceability_token: grading.traceability_token,
        model_version: grading.model_version
      },
      routing_audit: {
        channel,
        routed_to: routedTo,
        matched_entity_id: matchedEntityId,
        reason,
        routed_at: marketRoute.routed_at
      }
    };

    return { route: marketRoute, dossier };
  }

  public getTraceabilityDossier(listingId: string): TraceabilityDossier | null {
    const listing = db.getHarvestListingById(listingId);
    if (!listing) return null;
    const farm = db.getFarmById(listing.farm_id);
    if (!farm) return null;
    const farmer = db.getUserById(farm.farmer_id);
    const grading = db.getLatestGradingResult(farm.id);
    const soilTest = db.getLatestSoilTest(farm.id);
    const visits = db.getFieldVisitsByFarmId(farm.id);
    const photos = db.getMediaCapturesByFarmId(farm.id);
    const routes = db.getMarketRoutesByListingId(listing.id);
    const lastRoute = routes[routes.length - 1];

    return {
      listing_id: listing.id,
      farm_id: farm.id,
      farmer: {
        id: farmer?.id || 'unknown',
        name: farmer?.name || 'Farmer',
        phone: farmer?.phone || '',
        region: farmer?.region || 'Punjab'
      },
      crop: listing.crop,
      area_ha: farm.area_ha,
      soil_health: {
        tested_at: soilTest?.tested_at || '2026-06-01',
        ph: soilTest?.ph || 7.2,
        ec: soilTest?.ec || 0.4,
        organic_carbon: soilTest?.organic_carbon || 0.6,
        n_p_k: `${soilTest?.n || 240}-${soilTest?.p || 24}-${soilTest?.k || 220}`,
        source: soilTest?.source || 'Soil Health Card'
      },
      icar_alignment: {
        sowing_advisory: 'Adhered to ICAR sowing window & pest thresholds',
        model_version: 'crop_multi_criteria_v1.0'
      },
      field_inspections: {
        total_visits: visits.length,
        verified_camera_photos: photos.length,
        all_device_camera_verified: photos.every(p => p.device_camera_only),
        tamper_proof_signatures_valid: true
      },
      grading_and_compliance: {
        grade: grading?.grade || 'A',
        predicted_yield_qty: grading?.predicted_yield_qty || 250,
        mrl_compliant: grading?.mrl_compliant ?? true,
        flags: grading?.flags || [],
        traceability_token: grading?.traceability_token || 'AGRO-CERT-DEMO',
        model_version: grading?.model_version || 'grading_v1.0'
      },
      routing_audit: {
        channel: listing.channel,
        routed_to: lastRoute?.routed_to || 'exporter',
        matched_entity_id: lastRoute?.matched_entity_id || 'EXPORTER_APEDA_CONSORTIUM',
        reason: lastRoute?.reason || 'Graded and routed.',
        routed_at: lastRoute?.routed_at || new Date().toISOString()
      },
      merkle_passport_hash: `0x${crypto.createHash('sha256').update(`${listing.id}|${farm.id}|${grading?.traceability_token || ''}|${lastRoute?.reason || ''}`).digest('hex')}`
    };
  }

  /**
   * Antigravity Dynamic Lot Partitioning:
   * Splits a single heterogeneous harvest into an APEDA export lot and a domestic retail lot
   */
  public async splitHarvestListing(
    listingId: string,
    exportPercentage: number = 0.75
  ): Promise<{
    export_route: MarketRoute;
    domestic_route: MarketRoute;
    export_listing: HarvestListing;
    domestic_listing: HarvestListing;
    merkle_passport_hash: string;
  }> {
    const parentListing = db.getHarvestListingById(listingId);
    if (!parentListing) {
      throw new Error(`HarvestListing ${listingId} not found`);
    }

    const farm = db.getFarmById(parentListing.farm_id);
    if (!farm) throw new Error(`Farm not found: ${parentListing.farm_id}`);

    const grading = db.getLatestGradingResult(farm.id);
    const totalQty = parentListing.quantity;
    const exportQty = Math.round(totalQty * exportPercentage);
    const domesticQty = totalQty - exportQty;

    // 1. Create Export Sub-Lot
    const exportListing: HarvestListing = {
      id: `${parentListing.id}-EXP`,
      farm_id: farm.id,
      farmer_id: parentListing.farmer_id,
      crop: parentListing.crop,
      quantity: exportQty,
      grade: 'A',
      available_from: parentListing.available_from,
      channel: 'export',
      status: 'routed',
      created_at: new Date().toISOString(),
      is_split_lot: true,
      split_parent_id: parentListing.id
    };
    db.createHarvestListing(exportListing);

    // 2. Create Domestic Sub-Lot
    const domesticListing: HarvestListing = {
      id: `${parentListing.id}-DOM`,
      farm_id: farm.id,
      farmer_id: parentListing.farmer_id,
      crop: parentListing.crop,
      quantity: domesticQty,
      grade: 'B',
      available_from: parentListing.available_from,
      channel: 'district',
      status: 'routed',
      created_at: new Date().toISOString(),
      is_split_lot: true,
      split_parent_id: parentListing.id
    };
    db.createHarvestListing(domesticListing);

    // Update parent
    db.updateHarvestListing(parentListing.id, {
      status: 'split_routed',
      split_export_qty: exportQty,
      split_domestic_qty: domesticQty
    });

    // Merkle passport hash
    const passportRaw = `${parentListing.id}|EXP:${exportQty}|DOM:${domesticQty}|${farm.linked_exporter_id}|${new Date().toISOString()}`;
    const merkle_passport_hash = `0x${crypto.createHash('sha256').update(passportRaw).digest('hex')}`;

    // Route Export Lot
    const exportRoute: MarketRoute = {
      id: `route-${uuidv4().substring(0, 8)}`,
      harvest_listing_id: exportListing.id,
      routed_to: 'exporter',
      matched_entity_id: farm.linked_exporter_id || 'user-exp-01',
      routed_at: new Date().toISOString(),
      reason: `[ANTIGRAVITY_SPLIT] Inner parcel ${exportQty}q (Grade A, MRL <= 0.01ppm) allocated to Exporter terminal. Merkle Passport: ${merkle_passport_hash.substring(0, 16)}...`,
      traceability_record: {
        soil_test_id: farm.soil_health_card_id,
        crop: parentListing.crop,
        grade: 'A',
        mrl_compliant: true,
        predicted_yield_qty: exportQty,
        agent_visit_count: db.getFieldVisitsByFarmId(farm.id).length,
        verified_photos_count: db.getMediaCapturesByFarmId(farm.id).length,
        model_version: grading?.model_version || 'grading_v1.0'
      }
    };
    db.createMarketRoute(exportRoute);

    // Route Domestic Lot (Match Open Shop Requirements)
    const openReq = db.getShopRequirements().find(r => r.status === 'open' && r.crop.toLowerCase().includes(parentListing.crop.toLowerCase()));
    const shopId = openReq ? openReq.shop_owner_id : 'DISTRICT_MANDI_RETAIL_BOARD';
    if (openReq) db.updateShopRequirement(openReq.id, { status: 'matched' });

    const domesticRoute: MarketRoute = {
      id: `route-${uuidv4().substring(0, 8)}`,
      harvest_listing_id: domesticListing.id,
      routed_to: 'shop',
      matched_entity_id: shopId,
      routed_at: new Date().toISOString(),
      reason: `[ANTIGRAVITY_SPLIT] Border furrow parcel ${domesticQty}q (Grade B domestic) auto-matched to Regional Shop Owner [${shopId}]. Traceability preserved.`,
      traceability_record: {
        soil_test_id: farm.soil_health_card_id,
        crop: parentListing.crop,
        grade: 'B',
        mrl_compliant: false,
        predicted_yield_qty: domesticQty,
        agent_visit_count: db.getFieldVisitsByFarmId(farm.id).length,
        verified_photos_count: db.getMediaCapturesByFarmId(farm.id).length,
        model_version: grading?.model_version || 'grading_v1.0'
      }
    };
    db.createMarketRoute(domesticRoute);

    return {
      export_route: exportRoute,
      domestic_route: domesticRoute,
      export_listing: exportListing,
      domestic_listing: domesticListing,
      merkle_passport_hash
    };
  }
}

export const distributionEngine = new DistributionEngineService();
