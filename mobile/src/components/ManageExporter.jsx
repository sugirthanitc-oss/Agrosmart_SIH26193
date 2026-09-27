import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Loader2, 
  FileText, 
  Phone 
} from 'lucide-react';

const INITIAL_EXPORTERS = [
  {
    id: 'EXP-TN-COIMBATORE-101',
    companyName: 'Kongu Agro Global Exports Pvt Ltd',
    director: 'R. Shanmugam',
    phone: '+91 98421 88001',
    activeContracts: '4 Contracted Farms (18.4 Acres)',
    apedaReg: 'APEDA/EXP/2026/TN-841',
    status: 'Primary Export House',
    port: 'Chennai & Tuticorin Sea Ports'
  },
  {
    id: 'EXP-2026-INDOGLOBAL',
    companyName: 'IndoGlobal Agri-Exports Ltd',
    director: 'S. Varun Kumar',
    phone: '+91 98421 77402',
    activeContracts: '2 Contracted Farms (7.7 Acres)',
    apedaReg: 'APEDA/EXP/2025/IN-109',
    status: 'Active Partner',
    port: 'Cochin Export Terminal'
  }
];

export function ManageExporter() {
  const [exporters, setExporters] = useState(INITIAL_EXPORTERS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exporterIdInput, setExporterIdInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleVerifyAndLink = (e) => {
    e.preventDefault();
    const cleanId = exporterIdInput.trim().toUpperCase();
    if (!cleanId) return;

    if (exporters.some(ex => ex.id === cleanId)) {
      showToast('⚠️ Exporter ID is already linked to your terminal.');
      return;
    }

    setLoading(true);

    // Simulate verification with APEDA registry (1.2s delay)
    setTimeout(() => {
      const mockNewExporter = {
        id: cleanId,
        companyName: cleanId.includes('CHENN') ? 'Thanjavur Delta Organics Export Pvt Ltd' : 'Tamil Nadu Spice & Commodity Exporters',
        director: 'M. Sivasankaran',
        phone: '+91 98421 99015',
        activeContracts: '3 Contracted Farms (11.2 Acres)',
        apedaReg: `APEDA/EXP/2026/${cleanId.slice(-4) || '8821'}`,
        status: 'Newly Linked Partner',
        port: 'Chennai Port Container Terminal'
      };

      setExporters(prev => [mockNewExporter, ...prev]);
      setLoading(false);
      setIsModalOpen(false);
      setExporterIdInput('');
      showToast(`✓ Exporter "${mockNewExporter.companyName}" (${cleanId}) successfully verified & linked!`);
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', minHeight: '75vh' }}>
      {/* Header & Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1E293B', margin: 0 }}>
            Manage Linked Exporters
          </h2>
          <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0 0' }}>
            Export houses currently authorizing your field audits and APEDA inspection stamps
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            backgroundColor: '#2F855A',
            color: '#FFFFFF',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(47, 133, 90, 0.25)'
          }}
        >
          <Plus size={18} />
          Add Exporter
        </button>
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div style={{ backgroundColor: '#2F855A', color: '#FFFFFF', padding: '12px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 700 }}>
          {toastMsg}
        </div>
      )}

      {/* Exporters List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {exporters.map((exp) => (
          <div
            key={exp.id}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '22px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#1E4D3A', backgroundColor: '#E8F5E9', padding: '3px 8px', borderRadius: '6px' }}>
                  {exp.id}
                </span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#166534', backgroundColor: '#DCFCE7', padding: '3px 8px', borderRadius: '12px' }}>
                  {exp.status}
                </span>
              </div>

              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1E293B', margin: '4px 0 8px 0' }}>
                {exp.companyName}
              </h3>

              <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                <div>Director: <strong>{exp.director}</strong></div>
                <div>Authorized Port: <strong>{exp.port}</strong></div>
                <div style={{ marginTop: '4px', color: '#1E4D3A', fontWeight: 600 }}>
                  {exp.activeContracts}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748B' }}>
              <span>APEDA: {exp.apedaReg}</span>
              <span style={{ color: '#2F855A', fontWeight: 700 }}>● Active Link</span>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button (+) */}
      <button
        onClick={() => setIsModalOpen(true)}
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          width: '58px',
          height: '58px',
          borderRadius: '50%',
          backgroundColor: '#2F855A',
          color: '#FFFFFF',
          border: 'none',
          boxShadow: '0 8px 24px rgba(47, 133, 90, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 999,
          transition: 'transform 0.2s'
        }}
        title="Add Exporter"
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <Plus size={26} strokeWidth={2.5} />
      </button>

      {/* ADD EXPORTER MODAL (VIA ID) */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', width: '100%', maxWidth: '440px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                  Link New Export House
                </h3>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                  Authorize field inspections under an APEDA exporter
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleVerifyAndLink} style={{ padding: '22px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase' }}>
                  ENTER EXPORTER ID *
                </label>
                <input
                  type="text"
                  placeholder="e.g., EXP-2026-XYZ or EXP-TN-COIMBATORE-101"
                  required
                  value={exporterIdInput}
                  onChange={(e) => setExporterIdInput(e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '14px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    outline: 'none',
                    backgroundColor: '#F8FAFC'
                  }}
                />
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '6px', lineHeight: 1.4 }}>
                  Enter the unique Exporter Registration ID provided by the export company. Details will auto-populate upon verification.
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  backgroundColor: '#2F855A',
                  color: '#FFFFFF',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? 'Verifying with APEDA Registry...' : 'Verify & Link Exporter'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
