import React, { useState } from 'react';
import { 
  MapPin, 
  Plus, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Search,
  AlertCircle 
} from 'lucide-react';

const INITIAL_CONTRACTED_LANDS = [
  {
    id: 'LAND-TN-8492',
    farmerName: 'Arumugam Sundaram',
    farmerPhone: '9842100004',
    parcelName: 'Amaravathi Basin Plot C',
    crop: 'Bhavani High-Yield Turmeric',
    area: '4.5 Acres',
    location: 'Thanjavur, Tamil Nadu',
    gps: '10.787° N, 79.137° E',
    mrlStatus: 'Pre-Tested MRL Clear (0.01 mg/kg)',
    contractStatus: 'Active Procurement Contract',
    expectedYield: '280 Quintals',
    harvestDate: 'Nov 2026'
  },
  {
    id: 'LAND-TN-5120',
    farmerName: 'Kavitha Ramachandran',
    farmerPhone: '9842100018',
    parcelName: 'Bhavani River Delta Block 2',
    crop: 'Export Grade Sona Masoori Paddy',
    area: '3.2 Acres',
    location: 'Erode, Tamil Nadu',
    gps: '11.341° N, 77.717° E',
    mrlStatus: 'Soil & Water Tested Safe',
    contractStatus: 'Active Procurement Contract',
    expectedYield: '210 Quintals',
    harvestDate: 'Oct 2026'
  }
];

export function ContractedLands({ token }) {
  const [lands, setLands] = useState(INITIAL_CONTRACTED_LANDS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [landIdInput, setLandIdInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  // Add Land via Farmer Land ID
  const handleAddLand = (e) => {
    e.preventDefault();
    const cleanId = landIdInput.trim().toUpperCase();

    if (!cleanId) return;

    setLoading(true);
    setErrorMsg('');

    // Simulate backend fetch & validation of the Farmer Land ID
    setTimeout(() => {
      // Check if already contracted
      if (lands.some(l => l.id === cleanId)) {
        setErrorMsg('This Land ID is already contracted under your export house.');
        setLoading(false);
        return;
      }

      // Mock fetched land details mapped to Exporter
      const newLand = {
        id: cleanId,
        farmerName: cleanId.includes('99') ? 'Suresh Perumal' : 'Murugesan Govindasamy',
        farmerPhone: '9842100077',
        parcelName: `Delta Fertile Block (${cleanId})`,
        crop: 'Bhavani Pure Turmeric',
        area: '5.0 Acres',
        location: 'Coimbatore Delta, Tamil Nadu',
        gps: '11.016° N, 76.955° E',
        mrlStatus: 'APEDA Soil Tested MRL Compliant',
        contractStatus: 'Active Procurement Contract',
        expectedYield: '310 Quintals',
        harvestDate: 'Dec 2026'
      };

      setLands(prev => [newLand, ...prev]);
      setLoading(false);
      setIsModalOpen(false);
      setLandIdInput('');
      showToast(`✓ Land ID "${cleanId}" successfully fetched and mapped to your Contracted list!`);
    }, 900);
  };

  const filteredLands = lands.filter(l => 
    l.parcelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.crop.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Action Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          borderRadius: '10px',
          padding: '8px 14px',
          border: '1px solid #E2E8F0',
          width: '320px'
        }}>
          <Search size={16} color="#94A3B8" style={{ marginRight: '8px' }} />
          <input
            type="text"
            placeholder="Search by Land ID, farmer, or parcel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '13px' }}
          />
        </div>

        {/* Add Land Button */}
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
          Add Contracted Land
        </button>
      </div>

      {/* Toast */}
      {successToast && (
        <div style={{
          backgroundColor: '#2F855A',
          color: '#FFFFFF',
          padding: '12px 18px',
          borderRadius: '10px',
          fontSize: '13px',
          fontWeight: 700,
          marginBottom: '16px'
        }}>
          {successToast}
        </div>
      )}

      {/* Contracted Lands Minimal List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredLands.map((land) => (
          <div
            key={land.id}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              padding: '20px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#2F855A', backgroundColor: '#E8F5E9', padding: '3px 8px', borderRadius: '6px' }}>
                    {land.id}
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>{land.contractStatus}</span>
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1E293B', margin: '4px 0' }}>
                  {land.parcelName} • {land.crop}
                </h3>
                <div style={{ fontSize: '13px', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <MapPin size={14} color="#64748B" />
                  <span>{land.location} (GPS: {land.gps})</span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#1E293B' }}>{land.area}</div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>Est. Yield: {land.expectedYield}</div>
                <div style={{ fontSize: '11px', color: '#15803D', fontWeight: 700, marginTop: '4px' }}>
                  ✓ {land.mrlStatus}
                </div>
              </div>
            </div>

            <div style={{
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1px solid #F1F5F9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '12px',
              color: '#64748B'
            }}>
              <div>
                Farmer: <strong style={{ color: '#1E293B' }}>{land.farmerName}</strong> ({land.farmerPhone})
              </div>
              <div>
                Expected Harvest: <strong style={{ color: '#1E293B' }}>{land.harvestDate}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD LAND MODAL (Strictly by Farmer Land ID) */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '440px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '18px 20px',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#F8FAFC'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                Contract New Land Parcel
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddLand} style={{ padding: '22px' }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  FARMER GENERATED LAND ID *
                </label>
                <input
                  type="text"
                  placeholder="e.g., LAND-TN-9901 or TN-FARM-8492"
                  required
                  value={landIdInput}
                  onChange={(e) => setLandIdInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '14px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    outline: 'none',
                    backgroundColor: '#F8FAFC'
                  }}
                />
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '6px', lineHeight: 1.4 }}>
                  Enter the registered Land ID provided by the farmer. Land soil telemetry and harvest cycles will be automatically verified.
                </div>
              </div>

              {errorMsg && (
                <div style={{ fontSize: '12px', color: '#DC2626', backgroundColor: '#FEF2F2', padding: '8px 12px', borderRadius: '6px', marginBottom: '14px' }}>
                  {errorMsg}
                </div>
              )}

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
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Fetching & Mapping Land...' : 'Fetch & Map to Contracts'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
