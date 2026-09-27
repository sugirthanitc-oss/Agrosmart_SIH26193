const fs = require('fs');
let code = fs.readFileSync('C:/Users/sugirthan/.gemini/antigravity/scratch/agrosmart/backend/public/app.js', 'utf8');

const pesticideHTML = `
      <!-- NEW PESTICIDE RECOMMENDATION & BUY PRODUCT FLOW -->
      <div class="agro-card" style="margin-top:18px; margin-bottom:18px; border-left:5px solid #E53E3E; background:linear-gradient(135deg, #FFF5F5 0%, #FFFFFF 100%);">
        <div class="agro-card-header" style="margin-bottom:12px;">
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:20px;">🧪</span>
              <div class="card-title" style="color:#C53030;">Today's Recommended Treatment</div>
            </div>
            <div style="font-size:11.5px; color:#E53E3E; margin-top:2px; font-weight:bold;">
              Based on active crop stage: \${farm ? farm.current_stage || 'Flowering & Grain Filling' : 'Flowering'}
            </div>
          </div>
        </div>
        <div style="display:flex; flex-direction:column; gap:12px;">
          <div style="background:#FFF; border:1px solid #FED7D7; padding:16px; border-radius:12px;">
            <h3 style="font-size:18px; font-weight:bold; color:#2D3748; margin:0 0 8px 0;">Trichoderma Viride (Bio-Fungicide)</h3>
            <p style="font-size:14px; color:#4A5568; margin:0 0 16px 0;">Prevents root rot. Apply 5ml per liter of water via foliar spray.</p>
            <button onclick="openProductPurchaseFlow()" style="width:100%; background:#E53E3E; color:#FFF; font-weight:bold; padding:12px; border-radius:8px; border:none; cursor:pointer; font-size:16px; box-shadow: 0 4px 6px rgba(229,62,62,0.2);">Buy Product</button>
          </div>
        </div>
      </div>
`;

const startIndex = code.indexOf('<!-- GEOLOCATION-BASED METEOROLOGY');
const endIndex = code.indexOf('<!-- Harvest Countdown & Yield Forecast -->');

if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
  const before = code.substring(0, startIndex);
  const after = code.substring(endIndex);
  code = before + pesticideHTML + after;
  console.log("Successfully replaced meteorology with recommendation!");
} else {
  console.log("Failed to find indices:", startIndex, endIndex);
}

fs.writeFileSync('C:/Users/sugirthan/.gemini/antigravity/scratch/agrosmart/backend/public/app.js', code);
