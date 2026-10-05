import React from 'react';
import { Tractor, RotateCcw } from 'lucide-react';

export function RoleSwitchBar({ currentRole = 'farmer', onSelectRole, onResetDemo }) {
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
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 16px',
        zIndex: 900,
        boxShadow: '0 -4px 16px rgba(60, 34, 184, 0.08)'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        <div
          style={{
            background: 'var(--mist)',
            borderRadius: '12px',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--sky)'
          }}
        >
          <Tractor size={20} color="var(--sky)" />
          <span style={{ fontSize: '12px', fontWeight: 800 }}>Farmer Portal</span>
        </div>
        <span style={{ fontSize: '11px', color: 'var(--slate)', fontWeight: 600 }}>
          Rajendra Singh (Active)
        </span>
      </div>

      <button
        onClick={onResetDemo}
        title="Reset SIH Demo State"
        style={{
          background: '#F1F5F9',
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
          color: 'var(--slate)',
          transition: 'all 0.15s ease'
        }}
      >
        <RotateCcw size={16} color="var(--slate)" />
        <span style={{ fontSize: '10px', fontWeight: 700 }}>
          Reset Demo
        </span>
      </button>
    </div>
  );
}
