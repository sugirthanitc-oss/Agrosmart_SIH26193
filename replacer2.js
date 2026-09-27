const fs = require('fs');
let code = fs.readFileSync('C:/Users/sugirthan/.gemini/antigravity/scratch/agrosmart/backend/public/app.js', 'utf8');

const newFunc = `async function switchRole(role) {
  state.currentRole = role;
  state.currentTab = role === 'shop_owner' ? 'marketplace' : 'menu';
  document.querySelectorAll('.role-pill-btn').forEach(b => { b.classList.toggle('active', b.getAttribute('data-role') === role); });
  document.querySelectorAll('.mobile-nav-btn').forEach(el => { el.classList.toggle('active', el.getAttribute('data-nav') === (role === 'shop_owner' ? 'marketplace' : 'menu')); });
  
  // Prompt Auth Modal with prefilled data
  selectedAuthRole = role;
  activeAuthTab = 'login';
  renderAuthModalContent();
  
  setTimeout(() => {
    const persona = TN_PERSONAS[role];
    const phoneInput = document.getElementById('auth-phone');
    const passInput = document.getElementById('auth-password');
    if (phoneInput && persona) phoneInput.value = persona.phone;
    if (passInput) passInput.value = '123456';
  }, 150);
}`;

code = code.replace(/async function switchRole\(role\) \{[\s\S]*?await loginAsRole\(role\);\s*\}/, newFunc);

fs.writeFileSync('C:/Users/sugirthan/.gemini/antigravity/scratch/agrosmart/backend/public/app.js', code);
