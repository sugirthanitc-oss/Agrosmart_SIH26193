import React, { useState, useEffect } from 'react';
import { AgroSmartFarmerDashboard } from './components/AgroSmartFarmerDashboard.jsx';
import { FieldAgentVisitScreen } from './components/FieldAgentVisitScreen.jsx';
import { ShopOwnerMarketScreen } from './components/ShopOwnerMarketScreen.jsx';
import { ExporterDashboard } from './components/ExporterDashboard.jsx';
import { OfflineSyncIndicator } from './components/OfflineSyncIndicator.jsx';
import { RoleSwitchBar } from './components/RoleSwitchBar.jsx';
import { AntigravityCoreModal } from './components/AntigravityCoreModal.jsx';
import { Sparkles } from 'lucide-react';

const DEMO_PERSONAS = {
  farmer: { phone: '9800000004', name: 'Rajendra Singh', role: 'farmer' },
  agent: { phone: '9800000002', name: 'Gurpreet Singh', role: 'agent' },
  shop_owner: { phone: '9800000003', name: 'Kisan Retail & Wholesale', role: 'shop_owner' },
  exporter: { phone: '9800000001', name: 'IndoGlobal Agri-Exports', role: 'exporter' }
};

export default function App() {
  const [currentRole, setCurrentRole] = useState('farmer');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAntigravityModal, setShowAntigravityModal] = useState(false);

  // Auto-login with selected persona
  useEffect(() => {
    loginAsPersona(currentRole);
  }, [currentRole]);

  const loginAsPersona = async (role) => {
    setLoading(true);
    const persona = DEMO_PERSONAS[role];
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: persona.phone,
          otp: '123456',
          role: persona.role,
          name: persona.name
        })
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setToken(data.token);
      }
    } catch (e) {
      console.warn('Login request failed, using local offline session', e);
      setUser(persona);
      setToken('offline-token-demo');
    } finally {
      setLoading(false);
    }
  };

  const handleResetDemo = async () => {
    try {
      await fetch('/api/demo/reset-seed', { method: 'POST' });
      alert('✓ Database reset to SIH 2026 hackathon demo state (Farm 1 Export + Farm 2 Shop Owner)');
      window.location.reload();
    } catch (e) {
      alert('Demo state reset locally.');
    }
  };

  return (
    <div className="app-container">
      {/* Offline Status & Network Simulation Indicator */}
      <OfflineSyncIndicator
        isOffline={isOffline}
        setIsOffline={setIsOffline}
        token={token}
      />

      {/* Floating Antigravity Simulator Trigger */}
      <div style={{ padding: '8px 16px 0 16px' }}>
        <button
          onClick={() => setShowAntigravityModal(true)}
          style={{
            width: '100%',
            background: 'linear-gradient(90deg, #3C22B8 0%, #6C4CF5 100%)',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '14px',
            padding: '8px 14px',
            fontSize: '11px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(60, 34, 184, 0.3)'
          }}
        >
          <Sparkles size={14} color="#8FC7FF" />
          <span>Antigravity Core Simulator: Test All 3 Systems</span>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '8px', fontSize: '9px' }}>LIVE</span>
        </button>
      </div>

      {/* Role-gated View Container */}
      <div style={{ flex: 1 }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--slate)' }}>
            Loading AgroSmart...
          </div>
        ) : (
          <>
            {currentRole === 'farmer' && (
              <AgroSmartFarmerDashboard user={user} token={token} isOffline={isOffline} />
            )}
            {currentRole === 'agent' && (
              <FieldAgentVisitScreen user={user} token={token} />
            )}
            {currentRole === 'shop_owner' && (
              <ShopOwnerMarketScreen user={user} token={token} isOffline={isOffline} />
            )}
            {currentRole === 'exporter' && (
              <ExporterDashboard user={user} token={token} />
            )}
          </>
        )}
      </div>

      {/* Role Switching & Demo Reset Navigation */}
      <RoleSwitchBar
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
        onResetDemo={handleResetDemo}
      />

      {/* Interactive Antigravity Core Simulator Modal */}
      <AntigravityCoreModal
        isOpen={showAntigravityModal}
        onClose={() => setShowAntigravityModal(false)}
        token={token}
        onStateMutated={() => {
          // Re-trigger view reload
          loginAsPersona(currentRole);
        }}
      />
    </div>
  );
}
