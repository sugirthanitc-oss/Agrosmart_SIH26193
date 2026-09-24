// AgroSmart Root Node.js Server Runner
// SIH 2026 - PS ID SIH26193 - Team HACKNOVA
// Run with: node server.js

const path = require('path');
process.chdir(path.join(__dirname, 'backend'));
require('./backend/dist/index.js');
