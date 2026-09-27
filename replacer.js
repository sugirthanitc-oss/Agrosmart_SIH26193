const fs = require('fs');
let code = fs.readFileSync('C:/Users/sugirthan/.gemini/antigravity/scratch/agrosmart/backend/public/app.js', 'utf8');

// 1. Rewrite switchRole to use Auth Modal auto-fill
code = code.replace(
  /async function switchRole\(role\) \{[\s\S]*?await loginAsRole\(role\);\n\s*\}/,
  `async function switchRole(role) {
    state.currentRole = role;
    state.currentTab = role === 'shop_owner' ? 'marketplace' : 'menu';
    document.querySelectorAll('.role-pill-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-role') === role);
    });
    document.querySelectorAll('.mobile-nav-btn').forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-nav') === (role === 'shop_owner' ? 'marketplace' : 'menu'));
    });
    
    // Instead of auto-login, open auth modal and prefill
    selectedAuthRole = role;
    activeAuthTab = 'login';
    renderAuthModalContent();
    
    setTimeout(() => {
      const persona = TN_PERSONAS[role];
      const phoneInput = document.getElementById('auth-phone');
      const passInput = document.getElementById('auth-password');
      const otpInput = document.getElementById('auth-otp');
      if (phoneInput && persona) phoneInput.value = persona.phone;
      if (passInput) passInput.value = '123456';
      if (otpInput) otpInput.value = '123456';
    }, 100);
  }`
);

// We need to also remove the Irrigation Due Today block from Farmer dashboard
// It's in renderMenuTab
code = code.replace(
  /<div class="agro-card" style="border-left:5px solid var\(--sky\);">[\s\S]*?Water Requirements Forecast[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
  `<!-- Irrigation block completely removed per new constraints -->`
);

// We also need to remove "Amaravathi Base Platinum Meteorology and Precision Scheduling"
code = code.replace(
  /<div class="agro-card" style="border-left:5px solid var\(--sky\); background:linear-gradient\(180deg, #FFFFFF 0%, #F5FAFF 100%\)">[\s\S]*?Amaravathi Base Platinum Meteorology[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
  `<!-- Meteorology block completely removed per new constraints -->`
);

// Actually, meteorology might be a different string. Let's do a broader regex.
// Find the exact text and delete its parent wrapper.
code = code.replace(/<div class="agro-card"[^>]*>[\s\S]*?Amaravathi Base Platinum Meteorology[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, '<!-- Meteorology Block Removed -->');
code = code.replace(/<div class="agro-card"[^>]*>[\s\S]*?Irrigation Due Today[\s\S]*?<\/div>\s*<\/div>/, '<!-- Irrigation Block Removed -->');

fs.writeFileSync('C:/Users/sugirthan/.gemini/antigravity/scratch/agrosmart/backend/public/app.js', code);
