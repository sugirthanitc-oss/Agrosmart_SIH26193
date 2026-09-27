const fs = require('fs');
let code = fs.readFileSync('C:/Users/sugirthan/.gemini/antigravity/scratch/agrosmart/backend/public/app.js', 'utf8');

const shopDashboardHTML = `
async function renderMarketplaceView(container) {
  if (state.currentRole !== 'shop_owner') return;
  container.innerHTML = \`
    <div style="padding-bottom:80px;background:#F0F4F8;min-height:100vh;">
      <header style="background:#1A365D;color:#FFF;padding:40px 20px 20px 20px;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
        <h1 style="font-size:24px;font-weight:bold;margin:0;">Store Dashboard</h1>
      </header>
      <div style="padding:16px;display:flex;gap:16px;">
        <button style="flex:1;background:#FFF;color:#3182CE;font-weight:bold;padding:16px;border-radius:12px;border:none;box-shadow:0 2px 5px rgba(0,0,0,0.05);">Active Orders</button>
        <button style="flex:1;background:#FFF;color:#3182CE;font-weight:bold;padding:16px;border-radius:12px;border:none;box-shadow:0 2px 5px rgba(0,0,0,0.05);">Order History</button>
      </div>
      <div style="margin:0 16px;background:#FFF;padding:24px;border-radius:12px;border-left:5px solid #3182CE;box-shadow:0 2px 10px rgba(0,0,0,0.05);">
        <h2 style="font-size:16px;font-weight:bold;color:#2D3748;margin:0 0 8px 0;">Daily Sales Report</h2>
        <div style="font-size:32px;font-weight:bold;color:#2D3748;">₹ 45,200</div>
        <div style="color:#48BB78;font-weight:600;margin-top:4px;font-size:14px;">+12% from yesterday</div>
      </div>
      <h2 style="font-size:18px;font-weight:bold;color:#2D3748;margin:24px 16px 12px 16px;">Live Inventory Feed</h2>
      <div style="display:flex;flex-direction:column;gap:12px;padding:0 16px;">
        <div style="background:#FFF;padding:20px;border-radius:12px;box-shadow:0 2px 5px rgba(0,0,0,0.05);">
          <h3 style="font-size:18px;font-weight:bold;color:#2D3748;margin:0 0 4px 0;">Urea 46%</h3>
          <p style="color:#718096;font-size:14px;margin:0 0 16px 0;">375 sold out of 500 units</p>
          <div style="height:8px;width:100%;background:#EDF2F7;border-radius:4px;overflow:hidden;"><div style="height:100%;width:75%;background:#3182CE;"></div></div>
          <div style="text-align:right;margin-top:8px;font-size:12px;font-weight:bold;color:#A0AEC0;">75% Sold</div>
        </div>
        <div style="background:#FFF;padding:20px;border-radius:12px;box-shadow:0 2px 5px rgba(0,0,0,0.05);">
          <h3 style="font-size:18px;font-weight:bold;color:#2D3748;margin:0 0 4px 0;">DAP Fertilizer</h3>
          <p style="color:#718096;font-size:14px;margin:0 0 16px 0;">120 sold out of 300 units</p>
          <div style="height:8px;width:100%;background:#EDF2F7;border-radius:4px;overflow:hidden;"><div style="height:100%;width:40%;background:#3182CE;"></div></div>
          <div style="text-align:right;margin-top:8px;font-size:12px;font-weight:bold;color:#A0AEC0;">40% Sold</div>
        </div>
        <div style="background:#FFF;padding:20px;border-radius:12px;box-shadow:0 2px 5px rgba(0,0,0,0.05);">
          <h3 style="font-size:18px;font-weight:bold;color:#2D3748;margin:0 0 4px 0;">Trichoderma Viride</h3>
          <p style="color:#718096;font-size:14px;margin:0 0 16px 0;">18 sold out of 100 units</p>
          <div style="height:8px;width:100%;background:#EDF2F7;border-radius:4px;overflow:hidden;"><div style="height:100%;width:18%;background:#3182CE;"></div></div>
          <div style="text-align:right;margin-top:8px;font-size:12px;font-weight:bold;color:#A0AEC0;">18% Sold</div>
        </div>
      </div>
    </div>
  \`;
}
`;

const startStr = 'async function renderMarketplaceView(container) {';
const endStr = 'async function handlePostRequirementSubmit(event) {';

const idx = code.indexOf(startStr);
const endIdx = code.indexOf(endStr, idx);

if (idx > -1 && endIdx > -1) {
  const before = code.substring(0, idx);
  const after = code.substring(endIdx);
  code = before + shopDashboardHTML + after;
  fs.writeFileSync('C:/Users/sugirthan/.gemini/antigravity/scratch/agrosmart/backend/public/app.js', code);
  console.log('Successfully replaced Marketplace view with Shop view');
} else {
  console.log('Could not find block. idx:', idx, 'endIdx:', endIdx);
}
