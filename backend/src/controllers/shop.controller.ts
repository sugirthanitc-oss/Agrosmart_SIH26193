import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/db.js';
import { ShopRequirement, HarvestListing } from '../database/schema.js';

export class ShopController {
  // --- Post Demand Signal Requirement ---
  public static async postRequirement(req: Request, res: Response) {
    const shopOwnerId = req.user!.id;
    const { crop, quantity, region, needed_by } = req.body;

    if (!crop || !quantity) {
      return res.status(400).json({ error: 'Crop and quantity are required.' });
    }

    const requirement: ShopRequirement = {
      id: `req-${uuidv4().substring(0, 8)}`,
      shop_owner_id: shopOwnerId,
      crop,
      quantity: parseFloat(quantity),
      region: region || req.user?.region || 'Punjab',
      needed_by: needed_by || new Date(Date.now() + 20 * 86400000).toISOString().split('T')[0],
      status: 'open',
      created_at: new Date().toISOString()
    };

    db.createShopRequirement(requirement);

    // Check if any existing listing in the channel matches immediately
    const matches = db.getHarvestListings().filter(
      l => ['state', 'district'].includes(l.channel) &&
           l.crop.toLowerCase().includes(crop.toLowerCase()) &&
           l.status !== 'booked'
    );

    return res.status(201).json({
      success: true,
      requirement,
      instant_matches: matches
    });
  }

  // --- Get My Requirements (or all for exporters) ---
  public static async getMyRequirements(req: Request, res: Response) {
    const shopOwnerId = req.user!.id;
    if (req.user?.role === 'exporter') {
      const requirements = db.getShopRequirements();
      return res.json(requirements);
    }
    const requirements = db.getShopRequirementsByOwner(shopOwnerId);
    return res.json(requirements);
  }

  // --- Browse Harvest Availability in District / State Channels ---
  public static async browseListings(req: Request, res: Response) {
    const { channel, crop, grade } = req.query;

    let listings = db.getHarvestListings().filter(l => l.channel === 'district' || l.channel === 'state');

    if (channel) {
      listings = listings.filter(l => l.channel === channel);
    }
    if (crop) {
      listings = listings.filter(l => l.crop.toLowerCase().includes((crop as string).toLowerCase()));
    }
    if (grade) {
      listings = listings.filter(l => l.grade === grade);
    }

    // Attach farm and traceability details
    const enhanced = listings.map(l => {
      const farm = db.getFarmById(l.farm_id);
      const farmer = farm ? db.getUserById(farm.farmer_id) : undefined;
      const grading = db.getLatestGradingResult(l.farm_id);

      return {
        ...l,
        farm_region: farmer?.region || 'Punjab',
        farmer_name: farmer?.name || 'Verified Farmer',
        predicted_yield_qty: grading?.predicted_yield_qty || l.quantity,
        mrl_compliant: grading?.mrl_compliant ?? true,
        traceability_token: grading?.traceability_token || 'AGRO-LOCAL'
      };
    });

    return res.json(enhanced);
  }

  // --- Pre-Book Harvest Listing ---
  public static async prebookListing(req: Request, res: Response) {
    const shopOwnerId = req.user!.id;
    const { listingId } = req.params;
    const listing = db.getHarvestListingById(listingId);

    if (!listing) {
      return res.status(404).json({ error: 'Harvest listing not found.' });
    }

    if (listing.status === 'booked') {
      return res.status(400).json({ error: 'This listing has already been pre-booked.' });
    }

    db.updateHarvestListing(listingId, { status: 'booked' });

    return res.json({
      success: true,
      message: `Pre-booking confirmed for ${listing.quantity} quintals of ${listing.crop} (Grade ${listing.grade}).`,
      listing_id: listingId,
      booked_by: shopOwnerId
    });
  }

  // --- Notifications & Alerts for Matches ---
  public static async getMatchAlerts(req: Request, res: Response) {
    const shopOwnerId = req.user!.id;
    const myReqs = db.getShopRequirementsByOwner(shopOwnerId);
    const alerts = [];

    for (const r of myReqs) {
      const matchingListings = db.getHarvestListings().filter(
        l => ['state', 'district'].includes(l.channel) &&
             l.crop.toLowerCase().includes(r.crop.toLowerCase())
      );
      if (matchingListings.length > 0) {
        alerts.push({
          requirement_id: r.id,
          crop: r.crop,
          matching_count: matchingListings.length,
          listings: matchingListings
        });
      }
    }

    return res.json(alerts);
  }

  // --- Two-Way Marketplace (Exporters, Farmers & Shop Owners) ---
  public static async getTwoWayMarketplace(req: Request, res: Response) {
    const { grade, crop, channel } = req.query;

    let allListings = db.getHarvestListings();

    if (grade) {
      allListings = allListings.filter(l => l.grade === grade);
    }
    if (crop) {
      allListings = allListings.filter(l => l.crop.toLowerCase().includes((crop as string).toLowerCase()));
    }
    if (channel) {
      allListings = allListings.filter(l => l.channel === channel);
    }

    const enhanced = allListings.map(l => {
      const seller = db.getUserById(l.farmer_id);
      const farm = db.getFarmById(l.farm_id);
      const grading = db.getLatestGradingResult(l.farm_id);

      const isGradeA = l.grade === 'A';
      const pricePerKg = isGradeA ? 48.5 : l.grade === 'B' ? 24.0 : 18.0;

      return {
        id: l.id,
        farm_id: l.farm_id,
        seller_id: l.farmer_id,
        seller_name: seller?.name || 'Verified Kisan',
        seller_role: seller?.role || 'farmer',
        crop: l.crop,
        quantity_qtl: l.quantity,
        quantity_kg: Math.round(l.quantity * 100),
        grade: l.grade,
        harvest_date: l.available_from,
        channel: l.channel,
        status: l.status,
        price_per_kg: pricePerKg,
        mrl_compliant: grading?.mrl_compliant ?? (isGradeA ? true : false),
        traceability_token: grading?.traceability_token || 'AGRO-DIRECT-2026',
        is_farmer_direct_demand: l.is_split_lot ? false : (seller?.role === 'farmer'),
        target_audience: isGradeA ? 'Exporters & International Buyers' : 'Shop Owners & Regional Retailers'
      };
    });

    return res.json(enhanced);
  }

  // --- Orders, Receipts & Ledger Module ---
  public static async getOrdersLedger(req: Request, res: Response) {
    const orders = db.getOrdersLedger();
    return res.json({
      success: true,
      count: orders.length,
      orders
    });
  }

  // --- Confirm Delivery ---
  public static async confirmDelivery(req: Request, res: Response) {
    const { orderId } = req.params;
    const { token } = req.body;

    const updated = db.updateOrderDeliveryStatus(orderId, 'delivered', token);
    if (!updated) {
      return res.status(404).json({ error: 'Order not found in ledger.' });
    }

    return res.json({
      success: true,
      message: `Delivery confirmed for Order ${updated.order_number}.`,
      order: updated
    });
  }

  // --- Dedicated User Post History Section (All Active User Listings) ---
  public static async getMyActiveListings(req: Request, res: Response) {
    const userId = req.user?.id || 'user-shop-01';
    const requirements = db.getShopRequirementsByOwner(userId);
    const harvestListings = db.getHarvestListings().filter(l => l.farmer_id === userId);

    return res.json({
      success: true,
      active_requirements: requirements,
      active_harvest_listings: harvestListings,
      total_active_count: requirements.length + harvestListings.length
    });
  }
}

