import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { config } from '../config/index.js';

export interface PhotoCaptureMetadata {
  lat: number;
  lng: number;
  captured_at: string;
  device_camera_only: boolean;
  field_visit_id: string;
  type: 'crop_photo' | 'pesticide_photo';
}

export class StorageService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = config.uploadDir;
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Generates tamper-proof cryptographic signature for camera capture coordinates & timestamp
   */
  public generateCaptureSignature(meta: PhotoCaptureMetadata): string {
    const payload = `${meta.field_visit_id}:${meta.type}:${meta.lat.toFixed(6)}:${meta.lng.toFixed(6)}:${meta.captured_at}:${meta.device_camera_only}`;
    return crypto.createHmac('sha256', config.geoSignatureSecret).update(payload).digest('hex');
  }

  /**
   * Verifies metadata integrity and checks fraud rules
   */
  public verifyCaptureSignature(meta: PhotoCaptureMetadata, signature: string): { valid: boolean; reason?: string } {
    // ENFORCE ACCEPTANCE RULE: Disable native gallery/file picker - must be device camera
    if (!meta.device_camera_only) {
      return {
        valid: false,
        reason: 'FraudPreventionRule: Gallery uploads are strictly prohibited. Image must originate directly from the authenticated device camera.'
      };
    }

    if (Math.abs(meta.lat) > 90 || Math.abs(meta.lng) > 180) {
      return { valid: false, reason: 'Invalid latitude or longitude.' };
    }

    const expected = this.generateCaptureSignature(meta);
    if (expected !== signature) {
      return {
        valid: false,
        reason: 'TamperDetectionAlert: Digital signature mismatch. Coordinates or timestamp have been altered.'
      };
    }

    return { valid: true };
  }

  public saveBase64Image(base64Data: string, filename: string): string {
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    const buffer = matches ? Buffer.from(matches[2], 'base64') : Buffer.from(base64Data, 'base64');
    const dest = path.join(this.uploadDir, filename);
    fs.writeFileSync(dest, buffer);
    return `/uploads/${filename}`;
  }
}

export const storageService = new StorageService();
