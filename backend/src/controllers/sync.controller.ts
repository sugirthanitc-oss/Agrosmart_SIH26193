import { Request, Response } from 'express';
import { db } from '../database/db.js';

export interface QueueItem {
  id: string;
  action: 'UPDATE_ACTIVITY' | 'LOG_VISIT' | 'POST_REQUIREMENT' | 'UPLOAD_CAPTURE';
  payload: any;
  created_at: string;
}

export class SyncController {
  public static async syncQueue(req: Request, res: Response) {
    const { items }: { items: QueueItem[] } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Array of queued items is required.' });
    }

    const results = [];

    for (const item of items) {
      try {
        switch (item.action) {
          case 'UPDATE_ACTIVITY': {
            const { activity_id, status } = item.payload;
            const updated = db.updateActivity(activity_id, { status });
            results.push({ id: item.id, status: 'synced', data: updated });
            break;
          }
          case 'POST_REQUIREMENT': {
            const { crop, quantity, region, needed_by } = item.payload;
            const created = db.createShopRequirement({
              id: item.id,
              shop_owner_id: req.user!.id,
              crop,
              quantity: parseFloat(quantity),
              region: region || req.user?.region || 'Punjab',
              needed_by: needed_by || new Date().toISOString(),
              status: 'open',
              created_at: item.created_at || new Date().toISOString()
            });
            results.push({ id: item.id, status: 'synced', data: created });
            break;
          }
          default:
            results.push({ id: item.id, status: 'synced', note: 'Processed' });
        }
      } catch (err: any) {
        results.push({ id: item.id, status: 'error', error: err.message });
      }
    }

    return res.json({
      success: true,
      processed_count: results.length,
      synced_at: new Date().toISOString(),
      results
    });
  }
}
