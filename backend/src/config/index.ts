import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  jwtSecret: process.env.JWT_SECRET || 'agrosmart-sih26193-hacknova-secret-key',
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000',
  uploadDir: path.resolve(process.cwd(), 'uploads'),
  defaultBulkThresholdQuintals: 200.0, // exporter_min_bulk_threshold
  dbFilePath: path.resolve(process.cwd(), 'agrosmart_db.json'),
  geoSignatureSecret: 'agrosmart-geo-tamper-proof-salt-2026'
};
