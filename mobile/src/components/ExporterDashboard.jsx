import React, { useState } from 'react';
import { 
  Globe, 
  MapPin, 
  FileCheck, 
  Users, 
  CheckCircle2, 
  Ship, 
  Calendar 
} from 'lucide-react';
import { Sidebar } from './Sidebar.jsx';
import { ContractedLands } from './ContractedLands.jsx';
import { AgentManagement } from './AgentManagement.jsx';

const MOCK_LANDS_HISTORY = [
  { id: 'HIST-2026-01', parcel: 'Amaravathi Basin Plot A', farmer: 'Arumugam Sundaram', crop: 'Turmeric (Grade A)', yield: '240 Qtl', completedDate: 'August 2026', exportPort: 'Chennai Sea Port -> Dubai', mrlCert: 'APEDA/CODEX/2026/894' },
  { id: 'HIST-2026-02', parcel: 'Cauvery River Block 1', farmer: 'Suresh Kumar', crop: 'Sona Masoori Rice', yield: '450 Qtl', completedDate: 'July 2026', exportPort: 'Tuticorin Port -> Singapore', mrlCert: 'APEDA/CODEX/2026/712' },
  { id: 'HIST-2025-11', parcel: 'Coimbatore Agro Belt 4', farmer: 'Murugan G.', crop: 'Sugarcane Extract', yield: '180 Qtl', completedDate: 'Dec 2025', exportPort: 'Cochin Port -> EU Rotterdam', mrlCert: 'APEDA/CODEX/2025/551' },
];

export function ExporterDashboard({ user, token }) {
  // Navigation Tabs: 'contracted_lands' | 'lands_history' | 'agent_management'
  const [activeTab, setActiveTab] = useState('contracted_lands');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      {/* 1. SIDEBAR (Strictly: Contracted Lands, Lands History, Agent Management) */}
      <Sidebar 
        role="exporter" 
        activeTab={activeTab} 
        onSelectTab={setActiveTab} 
        user={user || { name: 'Kongu Agro Global Exports Pvt Ltd' }} 
      />

      {/* 2. MAIN CONTENT AREA */}
      <main style={{ flex: 1, padding: '28px', paddingBottom: '90px', overflowY: 'auto' }}>
        {/* Header Block with Theme Sync (Primary Green Background matching Sidebar) */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1B4D3E 0%, #2F855A 100%)', // Synchronized with global green theme
            borderRadius: '20px',
            padding: '24px 28px',
            color: '#FFFFFF',
            marginBottom: '24px',
            boxShadow: '0 10px 25px -5px rgba(31, 77, 58, 0.35)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.2px', color: '#9AE6B4', fontWeight: 800 }}>
                APEDA Registered Global Export Terminal
              </span>
              <h1 style={{ fontSize: '24px', fontWeight: 900, marginTop: '4px', marginBottom: '6px' }}>
                {user?.name || 'Kongu Agro Global Exports Pvt Ltd'} 🚢
              </h1>
              <div style={{ fontSize: '12px', color: '#D1E7DD', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={14} color="#9AE6B4" /> 
                <span>APEDA Reg: EXP-TN-COIMBATORE-101 • Codex Alimentarius International Standards</span>
              </div>
            </div>

            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              padding: '8px 16px',
              borderRadius: '12px',
              textAlign: 'right'
            }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#9AE6B4', fontWeight: 700 }}>
                Export Status
              </div>
              <div style={{ fontSize: '13px', fontWeight: 800, marginTop: '2px' }}>
                100% Pre-Harvest MRL Cleared
              </div>
            </div>
          </div>

          {/* Minimal Key Metrics Row (Legacy Simplified Layout) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#D1E7DD' }}>Contracted Farms</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>2 Parcels (7.7 Acres)</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#D1E7DD' }}>Field Agents Active</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>3 Certified Agents</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#D1E7DD' }}>Target Procurement</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>490 Quintals</div>
            </div>
          </div>
        </div>

        {/* Dynamic Role Sub-view Rendering without Page Reload */}
        {activeTab === 'contracted_lands' && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1E293B', margin: '0 0 4px 0' }}>
                Active Contracted Lands
              </h2>
              <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                Registered farmer plots bound under APEDA export procurement
              </p>
            </div>
            <ContractedLands token={token} />
          </div>
        )}

        {/* Lands History View (Renamed from Consignment Delivery History) */}
        {activeTab === 'lands_history' && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1E293B', margin: '0 0 4px 0' }}>
                Lands History & Completed Contracts
              </h2>
              <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                Archive of fulfilled seasonal harvests, export clearance certificates, and shipment ports
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {MOCK_LANDS_HISTORY.map((item) => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '14px',
                    padding: '20px',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#1E4D3A', backgroundColor: '#E8F5E9', padding: '3px 8px', borderRadius: '6px' }}>
                        {item.id}
                      </span>
                      <span style={{ fontSize: '12px', color: '#64748B' }}>{item.completedDate}</span>
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1E293B', margin: '4px 0' }}>
                      {item.parcel} • {item.crop}
                    </h3>
                    <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                      Farmer: <strong>{item.farmer}</strong> &bull; Total Yield Procured: <strong>{item.yield}</strong>
                    </div>
                    <div style={{ fontSize: '12px', color: '#166534', marginTop: '4px', fontWeight: 600 }}>
                      Port Dispatch: {item.exportPort}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: '#DCFCE7',
                      color: '#166534',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700
                    }}>
                      <CheckCircle2 size={13} /> APEDA Certified
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '6px' }}>
                      Cert: {item.mrlCert}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Agent Management View */}
        {activeTab === 'agent_management' && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1E293B', margin: '0 0 4px 0' }}>
                Agent Management & Field Tasks
              </h2>
              <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                Link agents via ID and auto-allocate daily visits to contracted land parcels
              </p>
            </div>
            <AgentManagement token={token} />
          </div>
        )}
      </main>
    </div>
  );
}
