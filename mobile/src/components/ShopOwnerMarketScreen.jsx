import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  PlusCircle,
  Clock,
  MapPin,
  CheckCircle2,
  Bell,
  Search,
  Filter,
  Package,
  Calendar,
  Layers,
  ArrowUpDown,
  ShieldCheck,
  Zap,
  TrendingUp,
  X,
  Sparkles
} from 'lucide-react';
import { offlineService } from '../services/offlineSync.js';

export function ShopOwnerMarketScreen({ user, token, isOffline }) {
  const [activeTab, setActiveTab] = useState('two_way_market'); // 'two_way_market' | 'my_demands'
  const [marketFilter, setMarketFilter] = useState('all'); // 'all' | 'A' | 'B' | 'farmer_direct'
  const [twoWayListings, setTwoWayListings] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loadingMarket, setLoadingMarket] = useState(false);

  // Demand form
  const [cropInput, setCropInput] = useState('Paddy (Common)');
  const [qtyInput, setQtyInput] = useState('80');
  const [regionInput, setRegionInput] = useState(user?.region || 'Punjab');
  const [showPostForm, setShowPostForm] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // Prebook modal
  const [prebookItem, setPrebookItem] = useState(null);
  const [reserveKg, setReserveKg] = useState('');

  useEffect(() => {
    loadAllData();
  }, [user, isOffline]);

  const loadAllData = async () => {
    setLoadingMarket(true);
    // 1. Two-Way Marketplace Feed
    try {
      const res = await fetch('/api/marketplace/two-way', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const list = await res.json();
        setTwoWayListings(list);
      }
    } catch (e) {
      console.warn('Two-way marketplace fetch failed', e);
    } finally {
      setLoadingMarket(false);
    }

    // 2. Requirements
    try {
      const rRes = await fetch('/api/shop/requirements', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (rRes.ok) setRequirements(await rRes.json());
    } catch (e) {}

    // 3. Alerts
    try {
      const aRes = await fetch('/api/shop/alerts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (aRes.ok) setAlerts(await aRes.json());
    } catch (e) {}
  };

  const handlePostRequirement = async (e) => {
    e.preventDefault();
    if (!cropInput || !qtyInput) return;

    if (isOffline) {
      const localItem = {
        crop: cropInput,
        quantity: qtyInput,
        region: regionInput,
        needed_by: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]
      };
      offlineService.enqueue('POST_REQUIREMENT', localItem);
      setRequirements(prev => [...prev, { id: `local-${Date.now()}`, ...localItem, status: 'open' }]);
      setShowPostForm(false);
      setStatusMsg('✓ Demand requirement queued locally (Rural Offline Mode)');
      setTimeout(() => setStatusMsg(''), 4000);
      return;
    }

    try {
      const res = await fetch('/api/shop/requirements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          crop: cropInput,
          quantity: parseFloat(qtyInput),
          region: regionInput,
          needed_by: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]
        })
      });

      if (res.ok) {
        const data = await res.json();
        setRequirements(prev => [data.requirement, ...prev]);
        setShowPostForm(false);
        setStatusMsg('✓ Demand signal published to District/State Market!');
        setTimeout(() => setStatusMsg(''), 4000);
      }
    } catch (e) {
      console.warn('Post requirement failed', e);
    }
  };

  const handleOpenPrebook = (item) => {
    setPrebookItem(item);
    setReserveKg(item.quantity_kg.toString());
  };

  const handleConfirmPrebook = async () => {
    if (!prebookItem) return;
    try {
      const res = await fetch(`/api/shop/listings/${prebookItem.id}/prebook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reserved_kg: parseFloat(reserveKg) })
      });
      if (res.ok) {
        setStatusMsg(`✓ Pre-booking confirmed! Reserved ${reserveKg} kg of ${prebookItem.crop}.`);
        setTwoWayListings(prev =>
          prev.map(l => (l.id === prebookItem.id ? { ...l, status: 'booked' } : l))
        );
        setPrebookItem(null);
        setTimeout(() => setStatusMsg(''), 4500);
      }
    } catch (e) {
      console.warn('Prebook failed', e);
    }
  };

  const filteredListings = twoWayListings.filter(l => {
    if (marketFilter === 'A') return l.grade === 'A';
    if (marketFilter === 'B') return l.grade === 'B' || l.grade === 'C';
    if (marketFilter === 'farmer_direct') return l.is_farmer_direct_demand;
    return true;
  });

  return (
    <div className="p-4 animate-fade-in" style={{ paddingBottom: '90px' }}>
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--indigo) 0%, var(--indigo-light) 100%)',
          borderRadius: '24px',
          padding: '20px',
          color: 'var(--cream)',
          marginBottom: '16px',
          boxShadow: '0 12px 28px -6px rgba(79, 49, 214, 0.3)'
        }}
      >
        <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.8, fontWeight: 700 }}>
          Regional Retail & Mandi Hub • Two-Way Marketplace
        </span>
        <h2 style={{ fontSize: '20px', fontWeight: 800, marginTop: '2px' }}>
          {user?.name || 'Kisan Retail & Wholesale Mart'}
        </h2>
        <div style={{ fontSize: '12px', opacity: 0.9, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MapPin size={13} color="var(--sky-light)" /> Serving Region: <strong>{user?.region || 'Punjab Mandi District'}</strong>
        </div>
      </div>

      {/* Real-time Match Alert Banner */}
      {alerts.length > 0 && (
        <div
          className="agro-card"
          style={{
            background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
            border: '1px solid #BFDBFE',
            padding: '14px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--indigo)' }}>
            <Bell size={18} color="var(--indigo)" />
            <span style={{ fontWeight: 800, fontSize: '13px' }}>Smart Distribution Engine Match!</span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--ink)', marginTop: '4px' }}>
            New Grade-B harvest listing matched your open demand requirement for <strong>{alerts[0].crop}</strong> in {user?.region || 'Punjab'}.
          </p>
        </div>
      )}

      {/* Toast Message */}
      {statusMsg && (
        <div
          style={{
            padding: '10px 14px',
            background: '#EBF9F1',
            color: '#10B981',
            borderRadius: '14px',
            border: '1px solid #A7F3D0',
            textAlign: 'center',
            fontWeight: 700,
            fontSize: '13px',
            marginBottom: '14px'
          }}
        >
          {statusMsg}
        </div>
      )}

      {/* Segmented Tab Navigation */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          background: 'var(--mist)',
          padding: '4px',
          borderRadius: '14px',
          marginBottom: '14px'
        }}
      >
        <button
          onClick={() => setActiveTab('two_way_market')}
          style={{
            padding: '10px',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'two_way_market' ? '#FFFFFF' : 'transparent',
            color: activeTab === 'two_way_market' ? 'var(--indigo)' : 'var(--slate)',
            fontWeight: 800,
            fontSize: '12px',
            cursor: 'pointer',
            boxShadow: activeTab === 'two_way_market' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
          }}
        >
          Two-Way Marketplace ({twoWayListings.length})
        </button>
        <button
          onClick={() => setActiveTab('my_demands')}
          style={{
            padding: '10px',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'my_demands' ? '#FFFFFF' : 'transparent',
            color: activeTab === 'my_demands' ? 'var(--indigo)' : 'var(--slate)',
            fontWeight: 800,
            fontSize: '12px',
            cursor: 'pointer',
            boxShadow: activeTab === 'my_demands' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
          }}
        >
          My Demand Signals ({requirements.length})
        </button>
      </div>

      {/* TAB 1: TWO-WAY MARKETPLACE */}
      {activeTab === 'two_way_market' && (
        <div>
          {/* Sub-filters */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '8px' }}>
            {[
              { id: 'all', label: 'All Lots' },
              { id: 'A', label: 'Grade A (Export)' },
              { id: 'B', label: 'Grade B (Domestic)' },
              { id: 'farmer_direct', label: 'Farmer Direct' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setMarketFilter(f.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  border: marketFilter === f.id ? 'none' : '1px solid #D5D2E8',
                  background: marketFilter === f.id ? 'var(--indigo)' : '#FFFFFF',
                  color: marketFilter === f.id ? '#FFFFFF' : 'var(--slate)',
                  fontSize: '11px',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {loadingMarket ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--slate)' }}>
              Loading Two-Way Marketplace feed...
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredListings.map(item => {
                const isBooked = item.status === 'booked';
                const isGradeA = item.grade === 'A';

                return (
                  <div
                    key={item.id}
                    style={{
                      background: 'var(--cream)',
                      borderRadius: '18px',
                      padding: '16px',
                      border: isGradeA ? '1.5px solid rgba(79, 49, 214, 0.3)' : '1px solid #EAE8F5',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                      opacity: isBooked ? 0.75 : 1
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <h4 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--ink)' }}>{item.crop}</h4>
                          {item.is_farmer_direct_demand && (
                            <span style={{ fontSize: '9px', fontWeight: 800, background: '#EBF9F1', color: '#10B981', padding: '2px 6px', borderRadius: '6px' }}>
                              DIRECT KISAN
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--slate)', marginTop: '2px' }}>
                          Seller: <strong>{item.seller_name}</strong> • Channel: <span style={{ textTransform: 'uppercase', color: 'var(--indigo)', fontWeight: 700 }}>{item.channel}</span>
                        </div>
                      </div>

                      <span className={isGradeA ? 'badge-grade-a' : 'badge-grade-b'}>
                        Grade {item.grade}
                      </span>
                    </div>

                    {/* Exact kg & Harvest Date Grid */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '6px',
                        background: 'var(--mist)',
                        padding: '10px',
                        borderRadius: '12px',
                        marginTop: '12px'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '10px', color: 'var(--slate)', fontWeight: 600 }}>EXACT WEIGHT</div>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--indigo)' }}>
                          {item.quantity_kg.toLocaleString('en-IN')} kg
                        </div>
                        <div style={{ fontSize: '9px', color: 'var(--slate)' }}>({item.quantity_qtl} Qtl)</div>
                      </div>

                      <div>
                        <div style={{ fontSize: '10px', color: 'var(--slate)', fontWeight: 600 }}>PRICE / KG</div>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#10B981' }}>
                          ₹{item.price_per_kg.toFixed(2)}
                        </div>
                        <div style={{ fontSize: '9px', color: 'var(--slate)' }}>₹{(item.price_per_kg * 100).toFixed(0)}/Qtl</div>
                      </div>

                      <div>
                        <div style={{ fontSize: '10px', color: 'var(--slate)', fontWeight: 600 }}>HARVEST DATE</div>
                        <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--ink)' }}>
                          {item.harvest_date?.split('T')?.[0] || '2026-10-15'}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                      <span style={{ fontSize: '11px', color: item.mrl_compliant ? '#10B981' : 'var(--coral-deep)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ShieldCheck size={14} /> {item.mrl_compliant ? 'MRL Export Certified' : 'Domestic Mandi Tier'}
                      </span>

                      <button
                        onClick={() => handleOpenPrebook(item)}
                        disabled={isBooked}
                        style={{
                          background: isBooked ? '#E5E5EA' : 'var(--indigo)',
                          color: isBooked ? 'var(--slate)' : '#FFFFFF',
                          border: 'none',
                          borderRadius: '10px',
                          padding: '8px 14px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: isBooked ? 'default' : 'pointer'
                        }}
                      >
                        {isBooked ? '✓ Reserved' : 'Pre-Book Harvest'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY DEMAND SIGNALS */}
      {activeTab === 'my_demands' && (
        <div>
          <div className="agro-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingBag size={18} color="var(--indigo)" />
                <span style={{ fontWeight: 800, fontSize: '14px' }}>Published Retail Demands</span>
              </div>
              <button
                onClick={() => setShowPostForm(!showPostForm)}
                className="agro-btn-secondary"
                style={{ fontSize: '12px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <PlusCircle size={14} /> {showPostForm ? 'Cancel' : 'Post Demand'}
              </button>
            </div>

            {showPostForm && (
              <form onSubmit={handlePostRequirement} style={{ background: 'var(--mist)', padding: '14px', borderRadius: '16px', marginBottom: '14px' }}>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--slate)', display: 'block', marginBottom: '4px' }}>
                    CROP TYPE:
                  </label>
                  <select
                    value={cropInput}
                    onChange={(e) => setCropInput(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '10px', border: '1px solid #D5D2E8', fontSize: '13px' }}
                  >
                    <option value="Paddy (Common)">Paddy (Common) - Grade B</option>
                    <option value="Onion">Onion (Nashik Red)</option>
                    <option value="Wheat">Wheat (Grade A Domestic)</option>
                    <option value="Mustard">Mustard</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--slate)', display: 'block', marginBottom: '4px' }}>
                      QUANTITY (QTL):
                    </label>
                    <input
                      type="number"
                      value={qtyInput}
                      onChange={(e) => setQtyInput(e.target.value)}
                      style={{ width: '100%', padding: '8px', borderRadius: '10px', border: '1px solid #D5D2E8', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--slate)', display: 'block', marginBottom: '4px' }}>
                      REGION:
                    </label>
                    <input
                      type="text"
                      value={regionInput}
                      onChange={(e) => setRegionInput(e.target.value)}
                      style={{ width: '100%', padding: '8px', borderRadius: '10px', border: '1px solid #D5D2E8', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <button type="submit" className="agro-btn-primary" style={{ width: '100%', fontSize: '13px' }}>
                  Submit Demand Signal
                </button>
              </form>
            )}

            {/* Requirements list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {requirements.map(req => (
                <div
                  key={req.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    background: 'var(--mist)',
                    borderRadius: '14px'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--ink)' }}>{req.crop}</div>
                    <div style={{ fontSize: '11px', color: 'var(--slate)' }}>
                      {req.quantity} Quintals ({Math.round(req.quantity * 100)} kg) • {req.region}
                    </div>
                  </div>
                  <span className={req.status === 'matched' ? 'badge-grade-a' : 'badge-grade-b'}>
                    {req.status?.toUpperCase() || 'OPEN'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PRE-BOOK MODAL (SPECIFY EXACT KG) */}
      {prebookItem && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(31, 27, 58, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '16px',
            zIndex: 1000
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              maxWidth: '400px',
              width: '100%',
              padding: '22px',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--indigo)', textTransform: 'uppercase' }}>
                  Smart Distribution Contract
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Pre-Book Harvest Lot</h3>
              </div>
              <button onClick={() => setPrebookItem(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ background: 'var(--mist)', padding: '12px', borderRadius: '14px', marginBottom: '14px' }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--ink)' }}>
                {prebookItem.crop} (Grade {prebookItem.grade})
              </div>
              <div style={{ fontSize: '12px', color: 'var(--slate)', marginTop: '2px' }}>
                Farmer/Seller: {prebookItem.seller_name} • Est. Harvest: {prebookItem.harvest_date?.split('T')?.[0]}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--indigo)', fontWeight: 700, marginTop: '4px' }}>
                Total Available: {prebookItem.quantity_kg.toLocaleString('en-IN')} kg
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--slate)', display: 'block', marginBottom: '6px' }}>
                CONFIRM RESERVATION QUANTITY (KG):
              </label>
              <input
                type="number"
                value={reserveKg}
                onChange={e => setReserveKg(e.target.value)}
                max={prebookItem.quantity_kg}
                style={{ width: '100%', padding: '10px', borderRadius: '12px', border: '1px solid #D5D2E8', fontSize: '14px', fontWeight: 800 }}
              />
              <div style={{ fontSize: '11px', color: 'var(--slate)', marginTop: '4px' }}>
                Estimated total: ₹{(parseFloat(reserveKg || '0') * prebookItem.price_per_kg).toLocaleString('en-IN')}
              </div>
            </div>

            <button
              onClick={handleConfirmPrebook}
              className="agro-btn-primary"
              style={{ width: '100%', fontSize: '14px', padding: '12px' }}
            >
              Confirm Pre-Booking & Lock Rate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
