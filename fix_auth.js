const fs = require('fs');
let code = fs.readFileSync('C:/Users/sugirthan/.gemini/antigravity/scratch/agrosmart/backend/public/app.js', 'utf8');

const oldAuthBlock = /async function handleAuthSubmit\(event\) \{[\s\S]*?catch \(e\) \{\s*closeAuthModal\(\);\s*\}\s*\}/;

const newAuthBlock = `async function handleAuthSubmit(event) {
  event.preventDefault();
  const phone = document.getElementById('auth-phone').value.trim();
  const password = document.getElementById('auth-password').value;

  if (activeAuthTab === 'login') {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password })
      });
      const data = await res.json();
      if (res.ok) {
        state.token = data.token;
        state.user = data.user;
        state.currentRole = data.user.role;
        closeAuthModal();
        // Fixed routing: do not call switchRole (which triggers modal), directly render dashboard
        state.currentTab = (state.currentRole === 'shop_owner') ? 'marketplace' : 'menu';
        updateSidebarProfile();
        renderRoleSidebar(state.currentRole);
        renderApp();
      } else {
        alert(\`Login Failed: \${data.error || 'Invalid credentials'}\`);
      }
    } catch (e) {
      // Offline fallback for demo
      const demoUser = Object.values(TN_PERSONAS).find(p => p.phone === phone) || TN_PERSONAS[selectedAuthRole];
      state.user = demoUser;
      state.token = 'demo-offline-token';
      state.currentRole = demoUser.role;
      closeAuthModal();
      state.currentTab = (state.currentRole === 'shop_owner') ? 'marketplace' : 'menu';
      updateSidebarProfile();
      renderRoleSidebar(state.currentRole);
      renderApp();
    }
  } else {
    // Registration logic
    const payload = {
      phone,
      password,
      role: selectedAuthRole,
      name: document.getElementById('auth-name')?.value || 'New User',
    };
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        state.token = data.token;
        state.user = data.user;
        state.currentRole = data.user.role;
        closeAuthModal();
        state.currentTab = (state.currentRole === 'shop_owner') ? 'marketplace' : 'menu';
        updateSidebarProfile();
        renderRoleSidebar(state.currentRole);
        renderApp();
      } else {
        alert(\`Registration Error: \${data.error || 'Failed to create account.'}\`);
      }
    } catch (e) {
      closeAuthModal();
    }
  }
}`;

code = code.replace(oldAuthBlock, newAuthBlock);

fs.writeFileSync('C:/Users/sugirthan/.gemini/antigravity/scratch/agrosmart/backend/public/app.js', code);
