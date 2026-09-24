import React from 'react';
import { User, Tractor, ShieldCheck, ShoppingBag, Globe, RotateCcw } from 'lucide-react';

export function RoleSwitchBar({ currentRole, onSelectRole, onResetDemo }) {
  const roles = [
    { role: 'farmer', label: 'Farmer', icon: Tractor, accent: 'var(--sky)' },
    { role: 'agent', label: 'Agent', icon: ShieldCheck, accent: 'var(--coral)' },
    { role: 'shop_owner', label: 'Shop', icon: ShoppingBag, accent: 'var(--indigo)' },
    { role: 'exporter', label: 'Exporter', icon: Globe, accent: 'var(--indigo-deep)' }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '440px',
        background: '#FFFFFF',
        borderTop: '1px solid rgba(79, 49, 214, 0.15)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '10px 8px',
        zIndex: 900,
        boxShadow: '0 -4px 16px rgba(60, 34, 184, 0.08)'
      }}
    >
      {roles.map(r => {
        const Icon = r.icon;
        const isActive = currentRole === r.role;
        return (
          <button
            key={r.role}
            onClick={() => onSelectRole(r.role)}
            style={{
              background: isActive ? 'var(--mist)' : 'none',
              border: 'none',
              borderRadius: '16px',
              padding: '6px 12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              color: isActive ? r.accent : 'var(--slate)',
              transition: 'all 0.15s ease'
            }}
          >
            <Icon size={20} color={isActive ? r.accent : 'var(--slate)'} />
            <span style={{ fontSize: '11px', fontWeight: isActive ? 800 : 600, marginTop: '2px' }}>
              {r.label}
            </span>
          </button>
        );
      })}

      <button
        onClick={onResetDemo}
        title="Reset SIH Demo Narrative"
        style={{
          background: 'none',
          border: 'none',
          borderRadius: '16px',
          padding: '6px 8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          cursor: 'pointer',
          color: 'var(--slate)'
        }}
      >
        <RotateCcw size={18} color="var(--slate)" />
        <span style={{ fontSize: '9px', fontWeight: 700, marginTop: '2px' }}>
          Reset Demo
        </span>
      </button>
    </div>
  );
}
