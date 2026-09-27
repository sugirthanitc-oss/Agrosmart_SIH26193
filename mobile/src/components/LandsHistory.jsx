import React from 'react';
import { 
  FileCheck, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  ShieldCheck, 
  User, 
  Search 
} from 'lucide-react';

const MOCK_INSPECTED_LANDS = [
  {
    id: 'INSP-2026-901',
    landName: 'Amaravathi Basin Plot A',
    farmerName: 'Arumugam Sundaram',
    crop: 'Bhavani Turmeric (PTS-10)',
    area: '4.5 Acres',
    visitDate: '26 Sep 2026, 11:30 AM',
    gps: '10.7870° N, 79.1370° E',
    status: 'Passed AI Check',
    mrlStatus: 'Pre-Harvest MRL Clear (0.008 mg/kg)',
    stampId: 'APEDA-STAMP-8492'
  },
  {
    id: 'INSP-2026-884',
    landName: 'Cauvery Delta Block 4',
    farmerName: 'Palanisamy Velu',
    crop: 'Sona Masoori Rice (Export Grade)',
    area: '3.8 Acres',
    visitDate: '22 Sep 2026, 03:15 PM',
    gps: '10.7920° N, 79.1410° E',
    status: 'Completed',
    mrlStatus: 'APEDA Certified Safe',
    stampId: 'APEDA-STAMP-7741'
  },
  {
    id: 'INSP-2026-871',
    landName: 'Bhavani River Delta Block 1',
    farmerName: 'Kavitha Ramachandran',
    crop: 'Export Grade Turmeric',
    area: '2.1 Acres',
    visitDate: '18 Sep 2026, 10:00 AM',
    gps: '11.3410° N, 77.7170° E',
    status: 'Passed AI Check',
    mrlStatus: 'Zero Pesticide Residue',
    stampId: 'APEDA-STAMP-6629'
  },
  {
    id: 'INSP-2026-850',
    landName: 'Periyar Basin Plot C',
    farmerName: 'Murugesan Govindasamy',
    crop: 'Co-86032 Organic Sugarcane',
    area: '6.0 Acres',
    visitDate: '12 Sep 2026, 04:45 PM',
    gps: '11.0160° N, 76.9550° E',
    status: 'Completed',
    mrlStatus: 'Codex MRL Compliant',
    stampId: 'APEDA-STAMP-5510'
  }
];

export function LandsHistory() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1E293B', margin: 0 }}>
            History of Lands Inspected
          </h2>
          <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0 0' }}>
            Comprehensive historical logs of GPS-verified field inspections & AI diagnostics
          </p>
        </div>

        <span style={{ fontSize: '12px', fontWeight: 700, color: '#2F855A', backgroundColor: '#E8F5E9', padding: '6px 14px', borderRadius: '20px' }}>
          ✓ {MOCK_INSPECTED_LANDS.length} Logged Inspections
        </span>
      </div>

      {/* History List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {MOCK_INSPECTED_LANDS.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#1E4D3A', backgroundColor: '#E8F5E9', padding: '3px 8px', borderRadius: '6px' }}>
                    {item.id}
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>{item.visitDate}</span>
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1E293B', margin: '4px 0' }}>
                  {item.landName} • {item.crop}
                </h3>
                <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>
                  Farmer: <strong style={{ color: '#1E293B' }}>{item.farmerName}</strong> &bull; Area: <strong>{item.area}</strong>
                </div>
                <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <MapPin size={13} color="#2F855A" /> GPS Verified: {item.gps}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#DCFCE7',
                  color: '#166534',
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 800
                }}>
                  <CheckCircle2 size={13} /> {item.status}
                </span>
                <div style={{ fontSize: '11px', color: '#15803D', fontWeight: 700, marginTop: '6px' }}>
                  ✓ {item.mrlStatus}
                </div>
                <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px' }}>
                  Stamp: {item.stampId}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
