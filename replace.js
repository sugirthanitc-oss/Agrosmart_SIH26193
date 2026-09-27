const fs = require('fs');
let code = fs.readFileSync('C:/Users/sugirthan/.gemini/antigravity/scratch/agrosmart/backend/public/app.js', 'utf8');

// 1. Replace openWeeklyProgressionModal
code = code.replace(/async function openWeeklyProgressionModal\(farmId\) \{[\s\S]*?(?=function closeWeeklyProgressionModal)/, `async function openWeeklyProgressionModal(farmId) {
  const existing = document.getElementById('weekly-progression-modal');
  if (existing) existing.remove();

  const m = document.createElement('div');
  m.id = 'weekly-progression-modal';
  m.className = 'modal-backdrop';
  m.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(31,27,58,0.85);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:9999;padding:16px;';

  m.innerHTML = \`
    <div style="background:#FFF;border-radius:24px;width:100%;max-width:480px;padding:32px 24px;position:relative;box-shadow:0 24px 60px rgba(0,0,0,0.3);">
      <button onclick="closeWeeklyProgressionModal()" style="position:absolute;top:16px;right:16px;background:none;border:none;font-size:24px;cursor:pointer;">&times;</button>
      <div style="display:inline-block;background:#C6F6D5;color:#276749;padding:6px 12px;border-radius:20px;font-size:12px;font-weight:bold;text-transform:uppercase;margin-bottom:16px;">Flowering</div>
      <h2 style="font-size:14px;color:#718096;text-transform:uppercase;letter-spacing:2px;font-weight:600;margin:0 0 8px 0;">Action Required</h2>
      <h3 style="font-size:24px;font-weight:bold;color:#2D3748;margin:0 0 8px 0;">Trichoderma Viride (Bio-Fungicide)</h3>
      <p style="font-size:18px;color:#2F855A;font-weight:600;margin:0 0 16px 0;">Dosage: 5ml per liter</p>
      <p style="color:#4A5568;line-height:1.6;margin-bottom:32px;">Prevents root rot during flowering phase. Ensures MRL compliance.</p>
      <button onclick="openProductPurchaseFlow()" style="width:100%;background:#E53E3E;color:#FFF;font-weight:bold;padding:16px;border-radius:8px;border:none;cursor:pointer;font-size:18px;box-shadow:0 4px 6px rgba(229,62,62,0.2);">Buy Product Nearby</button>
    </div>
  \`;
  document.body.appendChild(m);
}

window.openProductPurchaseFlow = function() {
  closeWeeklyProgressionModal();
  const existing = document.getElementById('purchase-flow-modal');
  if (existing) existing.remove();

  const m = document.createElement('div');
  m.id = 'purchase-flow-modal';
  m.className = 'modal-backdrop';
  m.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:#F4F7F6;z-index:10000;overflow-y:auto;';
  m.innerHTML = \`
    <header style="background:#FFF;padding:24px 20px;border-bottom:1px solid #E2E8F0;display:flex;align-items:center;position:sticky;top:0;">
      <button onclick="document.getElementById('purchase-flow-modal').remove();openWeeklyProgressionModal();" style="margin-right:16px;background:none;border:none;font-size:24px;cursor:pointer;">&larr;</button>
      <h1 style="font-size:20px;font-weight:bold;color:#2D3748;margin:0;">Purchase Details</h1>
    </header>
    <div style="background:#E2E8F0;padding:24px 20px;">
      <p style="font-size:14px;color:#718096;margin:0 0 4px 0;">Selected Product:</p>
      <h2 style="font-size:20px;font-weight:bold;color:#2D3748;margin:0;">Trichoderma Viride (Bio-Fungicide)</h2>
    </div>
    <h3 style="padding:24px 20px 12px 20px;font-size:16px;font-weight:bold;color:#4A5568;margin:0;">Nearby Shops & Prices</h3>
    <div style="padding:0 20px 120px 20px;display:flex;flex-direction:column;gap:12px;">
      <div onclick="selectPurchaseShop(this, 'Sri Murugan Agri Clinic', '₹450')" style="display:flex;justify-content:space-between;align-items:center;padding:20px;background:#FFF;border:2px solid #E2E8F0;border-radius:12px;cursor:pointer;">
        <div><h4 style="font-size:16px;font-weight:bold;color:#2D3748;margin:0 0 4px 0;">Sri Murugan Agri Clinic</h4><p style="color:#718096;font-size:14px;margin:0;">1.2 km away</p></div>
        <div style="font-size:20px;font-weight:bold;color:#2F855A;">₹450</div>
      </div>
      <div onclick="selectPurchaseShop(this, 'Kisan Kendra Erode', '₹430')" style="display:flex;justify-content:space-between;align-items:center;padding:20px;background:#FFF;border:2px solid #E2E8F0;border-radius:12px;cursor:pointer;">
        <div><h4 style="font-size:16px;font-weight:bold;color:#2D3748;margin:0 0 4px 0;">Kisan Kendra Erode</h4><p style="color:#718096;font-size:14px;margin:0;">3.4 km away</p></div>
        <div style="font-size:20px;font-weight:bold;color:#2F855A;">₹430</div>
      </div>
    </div>
    <div id="checkout-footer" style="display:none;position:fixed;bottom:0;left:0;right:0;background:#FFF;padding:20px;border-top:1px solid #E2E8F0;box-shadow:0 -4px 10px rgba(0,0,0,0.05);">
      <div id="checkout-total" style="font-size:20px;font-weight:bold;color:#2D3748;margin-bottom:16px;"></div>
      <div style="display:flex;gap:12px;">
        <button style="flex:1;background:#3182CE;color:#FFF;font-weight:bold;padding:16px;border-radius:8px;border:none;cursor:pointer;font-size:16px;">Pay Online</button>
        <button onclick="generatePurchaseToken()" style="flex:1;background:#2F855A;color:#FFF;font-weight:bold;padding:16px;border-radius:8px;border:none;cursor:pointer;font-size:16px;">Pay at Shop</button>
      </div>
    </div>
  \`;
  document.body.appendChild(m);
}

window.selectPurchaseShop = function(el, name, price) {
  document.querySelectorAll('#purchase-flow-modal > div > div').forEach(d => { d.style.borderColor = '#E2E8F0'; d.style.backgroundColor = '#FFF'; });
  el.style.borderColor = '#2F855A'; el.style.backgroundColor = '#F0FFF4';
  const footer = document.getElementById('checkout-footer');
  footer.style.display = 'block';
  document.getElementById('checkout-total').innerText = 'Total: ' + price;
  window.selectedShopName = name;
};

window.generatePurchaseToken = function() {
  const token = '#TKN-' + Math.floor(1000 + Math.random() * 9000);
  const m = document.createElement('div');
  m.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);display:flex;justify-content:center;align-items:center;padding:20px;z-index:10001;';
  m.innerHTML = \`
    <div style="background:#FFF;padding:32px 24px;border-radius:16px;width:100%;max-width:350px;text-align:center;box-shadow:0 20px 40px rgba(0,0,0,0.2);">
      <h2 style="font-size:24px;font-weight:bold;color:#2F855A;margin:0 0 24px 0;">Order Reserved!</h2>
      <div style="width:150px;height:150px;background:#EDF2F7;border:1px solid #E2E8F0;margin:0 auto 24px auto;border-radius:12px;display:flex;align-items:center;justify-content:center;">
        <span style="color:#A0AEC0;font-weight:bold;letter-spacing:2px;">[ QR CODE ]</span>
      </div>
      <div style="font-size:32px;font-weight:900;color:#2D3748;letter-spacing:2px;margin-bottom:16px;">\${token}</div>
      <p style="color:#4A5568;margin-bottom:32px;line-height:1.5;">Show this token at <strong>\${window.selectedShopName}</strong> to collect your product and pay locally.</p>
      <button onclick="this.parentElement.parentElement.remove();document.getElementById('purchase-flow-modal').remove();" style="background:#E2E8F0;color:#2D3748;font-weight:bold;padding:16px;width:100%;border-radius:8px;border:none;cursor:pointer;font-size:16px;">Done</button>
    </div>
  \`;
  document.body.appendChild(m);
};
`);

// 2. Replace renderMarketplaceView
code = code.replace(/async function renderMarketplaceView\(container\) \{[\s\S]*?(?=async function renderConsignmentHistoryView)/, `async function renderMarketplaceView(container) {
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
      </div>
    </div>
  \`;
}
`);

fs.writeFileSync('C:/Users/sugirthan/.gemini/antigravity/scratch/agrosmart/backend/public/app.js', code);
