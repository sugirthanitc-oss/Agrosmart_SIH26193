// AgroSmart Platform Orchestration Runner
// SIH 2026 - PS ID SIH26193 - Team HACKNOVA
// Hosts: AI Service (:8000), Node.js Web App & API (:5000), Mobile Frontend (:3000)

const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

function getLanIp() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

const lanIp = getLanIp();

console.log('==================================================================');
console.log(' 🚀 Hosting AgroSmart Platform (SIH 2026 PS ID SIH26193 - Team HACKNOVA)');
console.log('==================================================================');
console.log(` • Node.js Web Portal (Agritech UI):        http://localhost:5000`);
console.log(` • Network / LAN Access (Phone / Tablet):   http://${lanIp}:5000`);
console.log(` • React Mobile Web Client:                 http://localhost:3000`);
console.log(` • AI Microservice (FastAPI + ML Models):   http://127.0.0.1:8000`);
console.log(` • Public HTTPS URL (ngrok):                https://shining-luxury-exporter.ngrok-free.dev`);
console.log('==================================================================\n');

// 1. AI Service
const aiPath = path.join(__dirname, 'ai-service');
const aiPython = path.join(aiPath, 'venv', 'Scripts', 'python.exe');
const ai = spawn(aiPython, ['-m', 'uvicorn', 'app.main:app', '--host', '0.0.0.0', '--port', '8000'], {
  cwd: aiPath,
  stdio: 'inherit',
  shell: true
});

// 2. Node.js Backend & Web App
const backendPath = path.join(__dirname, 'backend');
const backend = spawn('npm', ['start'], {
  cwd: backendPath,
  stdio: 'inherit',
  shell: true
});

// 3. Mobile Web Client
const mobilePath = path.join(__dirname, 'mobile');
const mobile = spawn('npm', ['run', 'dev', '--', '--host', '0.0.0.0', '--port', '3000'], {
  cwd: mobilePath,
  stdio: 'inherit',
  shell: true
});

// 4. Public HTTPS Tunnel (ngrok)
let ngrok;
try {
  ngrok = spawn('ngrok', ['http', '5000', '--pooling-enabled', '--log=stdout'], {
    cwd: __dirname,
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true
  });
  ngrok.on('error', (err) => console.log('ngrok notice:', err.message));
  ngrok.stderr?.on('data', (d) => {
    const msg = d.toString();
    if (msg.includes('ERR_NGROK_334') || msg.includes('already online')) {
      console.log('ℹ️ Active external ngrok tunnel detected: https://shining-luxury-exporter.ngrok-free.dev');
    }
  });
} catch (e) {
  console.log('ngrok notice:', e.message);
}

const cleanup = () => {
  console.log('\nStopping AgroSmart services...');
  ai.kill();
  backend.kill();
  mobile.kill();
  try { ngrok.kill(); } catch (e) {}
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
