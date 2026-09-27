import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  CalendarCheck, 
  MapPin, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  Clock, 
  Lock 
} from 'lucide-react';

const INITIAL_AGENTS = [
  { id: 'AGT-TN-101', name: 'Suresh Kumar', phone: '9842100002', region: 'Thanjavur Basin', activeAssignments: 2, status: 'Available' },
  { id: 'AGT-TN-102', name: 'Priya Dharshini', phone: '9842100019', region: 'Erode Delta', activeAssignments: 1, status: 'Available' },
  { id: 'AGT-TN-103', name: 'Karthik Raja', phone: '9842100045', region: 'Coimbatore Delta', activeAssignments: 1, status: 'Available' },
];

export function AgentManagement({ token }) {
  const [agents, setAgents] = useState(INITIAL_AGENTS);
  const [newAgentId, setNewAgentId] = useState('');
  const [allocations, setAllocations] = useState([]);
  const [isAutoAssigned, setIsAutoAssigned] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // 1. ADD AGENT VIA ID
  const handleAddAgent = (e) => {
    e.preventDefault();
    const id = newAgentId.trim().toUpperCase();
    if (!id) return;

    if (agents.some(a => a.id === id)) {
      showToast('⚠️ Agent ID already linked to your export house.');
      return;
    }

    const mockNames = ['Velmurugan M.', 'Anitha Raman', 'Selvam K.', 'Deepak Natarajan'];
    const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];

    const newAgent = {
      id,
      name: randomName,
      phone: '98421' + Math.floor(10000 + Math.random() * 90000),
      region: 'Tamil Nadu Agri Zone',
      activeAssignments: 0,
      status: 'Available'
    };

    setAgents(prev => [...prev, newAgent]);
    setNewAgentId('');
    showToast(`✓ Agent ${randomName} (${id}) linked successfully!`);
  };

  // 2. DAILY AUTO-ASSIGN FEATURE
  const handleAutoAssign = () => {
    setIsLocked(false);

    // Dynamic auto-generated allocation mappings
    const generatedAllocations = [
      {
        agentId: agents[0]?.id || 'AGT-TN-101',
        agentName: agents[0]?.name || 'Suresh Kumar',
        landParcel: 'Amaravathi Basin Plot C',
        farmerName: 'Arumugam Sundaram',
        purpose: 'MRL pre-harvest residue screening & GPS boundary confirmation',
        due: 'Today, 11:30 AM',
        priority: 'High Priority (Harvest in 3 wks)'
      },
      {
        agentId: agents[1]?.id || 'AGT-TN-102',
        agentName: agents[1]?.name || 'Priya Dharshini',
        landParcel: 'Bhavani River Delta Block 2',
        farmerName: 'Kavitha Ramachandran',
        purpose: 'Stem vigor check and organic bio-pesticide adherence audit',
        due: 'Today, 2:00 PM',
        priority: 'Routine Weekly Inspection'
      },
      {
        agentId: agents[2]?.id || 'AGT-TN-103',
        agentName: agents[2]?.name || 'Karthik Raja',
        landParcel: 'Cauvery Basin Plot A',
        farmerName: 'Murugesan Govindasamy',
        purpose: 'Leaf uniformity test & moisture meter hardware audit',
        due: 'Today, 4:15 PM',
        priority: 'Pre-Export Certification'
      }
    ];

    setAllocations(generatedAllocations);
    setIsAutoAssigned(true);
    showToast('✓ AI Auto-Assign mapped daily visits for all available agents.');
  };

  // 3. FINAL LOCK & ASSIGN TASKS
  const handleConfirmAssignment = () => {
    setIsLocked(true);
    showToast('✓ Daily tasks officially locked & dispatched to Field Agents!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          backgroundColor: '#2F855A',
          color: '#FFFFFF',
          padding: '12px 18px',
          borderRadius: '10px',
          fontSize: '13px',
          fontWeight: 700
        }}>
          {toastMsg}
        </div>
      )}

      {/* 1. ADD AGENT VIA ID SECTION */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '22px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <UserPlus size={18} color="#2F855A" />
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#1E293B', margin: 0 }}>
            Link Field Agent via ID
          </h2>
        </div>

        <form onSubmit={handleAddAgent} style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              placeholder="Enter Agent ID (e.g., AGT-TN-104)..."
              required
              value={newAgentId}
              onChange={(e) => setNewAgentId(e.target.value)}
              style={{
                width: '100%',
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
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: '#2F855A',
              color: '#FFFFFF',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Link Agent
          </button>
        </form>

        {/* Linked Agents Roster */}
        <div style={{ marginTop: '18px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {agents.map((ag) => (
            <div
              key={ag.id}
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22C55E' }} />
              <div>
                <strong style={{ color: '#1E293B' }}>{ag.name}</strong> ({ag.id})
                <div style={{ color: '#64748B', fontSize: '11px' }}>{ag.region}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. DAILY AUTO-ASSIGN & TASK MANAGEMENT */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '18px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalendarCheck size={18} color="#2F855A" />
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                Daily Field Task Allocation
              </h2>
            </div>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0 0' }}>
              Automatically dispatch certified agents to active contracted land parcels
            </p>
          </div>

          <button
            onClick={handleAutoAssign}
            style={{
              backgroundColor: '#1E4D3A',
              color: '#FFFFFF',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 3px 8px rgba(30, 77, 58, 0.2)'
            }}
          >
            <Sparkles size={16} color="#9AE6B4" />
            Auto-Assign Today's Visits
          </button>
        </div>

        {/* Descriptive Assignment List */}
        {allocations.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            backgroundColor: '#F8FAFC',
            borderRadius: '12px',
            border: '1px dashed #CBD5E1',
            color: '#64748B',
            fontSize: '13px'
          }}>
            Click <strong>"Auto-Assign Today's Visits"</strong> to dynamically generate today's field inspection schedule.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {allocations.map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: isLocked ? '#F0FDF4' : '#F8FAFC',
                  border: isLocked ? '1px solid #BBF7D0' : '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '16px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div style={{ maxWidth: '650px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B', marginBottom: '4px' }}>
                    Agent <span style={{ color: '#2F855A' }}>{item.agentName}</span> is assigned to visit{' '}
                    <span style={{ color: '#1E4D3A', textDecoration: 'underline' }}>{item.landParcel}</span> for{' '}
                    <strong>{item.purpose}</strong> today.
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', gap: '14px' }}>
                    <span>Farmer: <strong>{item.farmerName}</strong></span>
                    <span>Due: <strong>{item.due}</strong></span>
                    <span style={{ color: '#D97706', fontWeight: 600 }}>{item.priority}</span>
                  </div>
                </div>

                <div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '20px',
                    backgroundColor: isLocked ? '#DCFCE7' : '#FEF3C7',
                    color: isLocked ? '#166534' : '#92400E',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {isLocked ? <Check size={12} /> : <Clock size={12} />}
                    {isLocked ? 'Dispatched & Locked' : 'Pending Review'}
                  </span>
                </div>
              </div>
            ))}

            {/* Final Assign / Lock Button */}
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={handleConfirmAssignment}
                disabled={isLocked}
                style={{
                  backgroundColor: isLocked ? '#64748B' : '#2F855A',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: isLocked ? 'none' : '0 4px 12px rgba(47, 133, 90, 0.3)'
                }}
              >
                {isLocked ? <Lock size={16} /> : <Check size={16} />}
                {isLocked ? 'Tasks Assigned & Locked for Today' : 'Assign & Lock Tasks'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
