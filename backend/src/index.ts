import express from 'express';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import { config } from './config/index.js';
import apiRoutes from './routes/api.routes.js';
import { db } from './database/db.js';
import { seedDatabase } from './seed/seedData.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Initialize MongoDB Connection (Preparation for Production Migration)
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('✅ Successfully connected to MongoDB Atlas Cluster (AgroSmart DB)');
    })
    .catch((err) => {
      console.error('❌ Error connecting to MongoDB:', err.message);
    });
}

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static uploads
app.use('/uploads', express.static(config.uploadDir));

// Serve static frontend assets (HTML, style.css, app.js)
const publicDir = path.join(process.cwd(), 'public');
app.use(express.static(publicDir));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'AgroSmart Backend API',
    sih_ps: 'SIH26193',
    team: 'HACKNOVA',
    timestamp: new Date().toISOString()
  });
});

// Seed endpoint for judges / quick demo reset
app.post('/api/demo/reset-seed', (req, res) => {
  seedDatabase();
  res.json({
    success: true,
    message: 'AgroSmart DB reset to SIH 2026 hackathon demo state (Farm 1 Export + Farm 2 Shop Owner).'
  });
});

// Mount main API
app.use('/api', apiRoutes);

// Catch-all route to serve index.html (SPA fallback)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads') || req.path === '/health') {
    return next();
  }
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// Auto seed if users table is empty
if (db.getUsers().length === 0) {
  console.log('Database empty, auto-seeding hackathon demo data...');
  seedDatabase();
}

app.listen(config.port, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(` AgroSmart Backend & Web App running on port ${config.port}`);
  console.log(` Local:   http://localhost:${config.port}`);
  console.log(` Network: http://192.168.1.33:${config.port}`);
  console.log(` Health:  http://localhost:${config.port}/health`);
  console.log(` SIH 2026 Team HACKNOVA (PS ID SIH26193)`);
  console.log(`=======================================================`);
});

export default app;
