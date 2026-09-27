import React, { useState } from 'react';
import { 
  Package, 
  ShoppingBag, 
  Clock, 
  TrendingUp, 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  Search,
  Filter,
  DollarSign,
  ArrowUpRight
} from 'lucide-react';
import { AddProductModal } from './AddProductModal.jsx';
import { Sidebar } from './Sidebar.jsx';

const INITIAL_INVENTORY = [
  { id: 'PROD-101', name: 'Trichoderma Viride Bio-Fungicide', category: 'Bio-Fungicide', stockReceived: 80, stockSold: 35, price: 450 },
  { id: 'PROD-102', name: 'Urea Granular 46% (50kg)', category: 'NPK Chemical Fertilizer', stockReceived: 200, stockSold: 140, price: 268 },
  { id: 'PROD-103', name: 'DAP High Nitrogen Complex (50kg)', category: 'NPK Chemical Fertilizer', stockReceived: 150, stockSold: 110, price: 1350 },
  { id: 'PROD-104', name: 'Neem Oil Extract 10,000 PPM (1L)', category: 'Organic Botanical Pesticide', stockReceived: 90, stockSold: 22, price: 220 },
  { id: 'PROD-105', name: 'Pseudomonas Fluorescens Seed Tonic', category: 'Seed Treatment Solution', stockReceived: 60, stockSold: 52, price: 380 },
];

const INITIAL_ACTIVE_ORDERS = [
  { id: 'ORD-8492', farmer: 'Arumugam Sundaram', product: 'Trichoderma Viride Bio-Fungicide', qty: 2, total: 900, token: '#TKN-8492', status: 'Pending In-Store Pickup', time: '12 mins ago' },
  { id: 'ORD-8493', farmer: 'Palanisamy Velu', product: 'Urea Granular 46%', qty: 4, total: 1072, token: '#TKN-8493', status: 'Awaiting Fulfillment', time: '45 mins ago' },
];

const INITIAL_COMPLETED_ORDERS = [
  { id: 'ORD-8470', farmer: 'Ramasamy K.', product: 'DAP High Nitrogen Complex', qty: 2, total: 2700, date: 'Yesterday, 4:30 PM', payment: 'Cash at Shop (Verified)' },
  { id: 'ORD-8468', farmer: 'Senthil Nathan', product: 'Neem Oil Extract', qty: 1, total: 220, date: '25 Sep 2026', payment: 'Online Pre-paid' },
  { id: 'ORD-8462', farmer: 'Murugesan G.', product: 'Trichoderma Viride', qty: 3, total: 1350, date: '24 Sep 2026', payment: 'Cash at Shop (Verified)' },
];

export function ShopDashboard({ user }) {
  // Navigation State (Products | View Orders | Order History | Sales Report)
  const [activeTab, setActiveTab] = useState('products');
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [activeOrders, setActiveOrders] = useState(INITIAL_ACTIVE_ORDERS);
  const [completedOrders, setCompletedOrders] = useState(INITIAL_COMPLETED_ORDERS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // Add Product to Inventory
  const handleAddProduct = (newProduct) => {
    setInventory((prev) => [newProduct, ...prev]);
    triggerToast(`✓ "${newProduct.name}" added to Live Inventory at ₹${newProduct.price}`);
  };

  // Fulfill Order
  const handleFulfillOrder = (orderId) => {
    const orderToFulfill = activeOrders.find(o => o.id === orderId);
    if (!orderToFulfill) return;

    setActiveOrders(prev => prev.filter(o => o.id !== orderId));
    setCompletedOrders(prev => [
      {
        id: orderToFulfill.id,
        farmer: orderToFulfill.farmer,
        product: orderToFulfill.product,
        qty: orderToFulfill.qty,
        total: orderToFulfill.total,
        date: 'Just now',
        payment: 'Cash at Store (Token Validated)'
      },
      ...prev
    ]);
    triggerToast(`✓ Token for order ${orderToFulfill.token} validated & fulfilled!`);
  };

  // Filtered Inventory
  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      {/* 1. SIDEBAR (Conditional Shop Role Links) */}
      <Sidebar 
        role="shop" 
        activeTab={activeTab} 
        onSelectTab={setActiveTab} 
        user={user || { name: 'Kisan Fertilizer Clinic' }} 
      />

      {/* 2. MAIN CONTENT AREA */}
      <main style={{ flex: 1, padding: '28px', paddingBottom: '100px', overflowY: 'auto' }}>
        {/* Top Header */}
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '24px 28px',
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderLeft: '5px solid #2F855A'
        }}>
          <div>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: '#2F855A', fontWeight: 800 }}>
              Agri-Input & Pesticide Store
            </span>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1E293B', margin: '4px 0 0 0' }}>
              {activeTab === 'products' && 'Products (Live Inventory)'}
              {activeTab === 'view_orders' && 'Active & Pending Orders'}
              {activeTab === 'order_history' && 'Completed Order History'}
              {activeTab === 'sales_report' && 'Sales Report & Analytics'}
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{
              backgroundColor: '#E8F5E9',
              color: '#2F855A',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 700
            }}>
              ● Terminal Online
            </span>
          </div>
        </div>

        {/* Status Toast */}
        {toastMsg && (
          <div style={{
            backgroundColor: '#2F855A',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: '10px',
            marginBottom: '20px',
            fontWeight: 700,
            fontSize: '13px',
            boxShadow: '0 4px 12px rgba(47, 133, 90, 0.25)'
          }}>
            {toastMsg}
          </div>
        )}

        {/* TAB 1: PRODUCTS (LIVE INVENTORY) */}
        {/* Note: Auto-Stock Box has been completely REMOVED as requested */}
        {activeTab === 'products' && (
          <div>
            {/* Search Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '10px 16px',
              border: '1px solid #E2E8F0',
              marginBottom: '20px',
              maxWidth: '450px'
            }}>
              <Search size={18} color="#94A3B8" style={{ marginRight: '10px' }} />
              <input
                type="text"
                placeholder="Search inventory by medicine, fertilizer, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '14px',
                  color: '#1E293B'
                }}
              />
            </div>

            {/* Inventory List */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {filteredInventory.map((item) => {
                const available = item.stockReceived - item.stockSold;
                const isLow = available <= 15;
                const soldPct = Math.round((item.stockSold / item.stockReceived) * 100);

                return (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      padding: '20px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          backgroundColor: '#F1F5F9',
                          color: '#475569',
                          padding: '4px 8px',
                          borderRadius: '6px'
                        }}>
                          {item.category}
                        </span>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#2F855A' }}>
                          ₹{item.price}
                        </div>
                      </div>

                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1E293B', margin: '4px 0 8px 0' }}>
                        {item.name}
                      </h3>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748B', marginTop: '12px' }}>
                        <span>Available Stock:</span>
                        <span style={{ fontWeight: 700, color: isLow ? '#DC2626' : '#1E293B' }}>
                          {available} Units
                        </span>
                      </div>
                    </div>

                    <div style={{ marginTop: '16px' }}>
                      <div style={{ height: '6px', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${soldPct}%`,
                          backgroundColor: isLow ? '#EF4444' : '#2F855A'
                        }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94A3B8', marginTop: '6px' }}>
                        <span>{item.stockSold} sold</span>
                        <span>Total batch: {item.stockReceived}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: VIEW ORDERS (ACTIVE / PENDING) */}
        {activeTab === 'view_orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activeOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94A3B8' }}>
                <ShoppingBag size={48} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
                <div style={{ fontSize: '16px', fontWeight: 700 }}>No active or pending orders</div>
              </div>
            ) : (
              activeOrders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '22px',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#D97706', backgroundColor: '#FEF3C7', padding: '3px 8px', borderRadius: '6px' }}>
                        {order.token}
                      </span>
                      <span style={{ fontSize: '12px', color: '#64748B' }}>{order.time}</span>
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1E293B', margin: '8px 0 4px 0' }}>
                      {order.farmer}
                    </h3>
                    <div style={{ fontSize: '13px', color: '#475569' }}>
                      {order.product} &bull; Qty: <strong>{order.qty}</strong>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#1E293B', marginBottom: '8px' }}>
                      ₹{order.total}
                    </div>
                    <button
                      onClick={() => handleFulfillOrder(order.id)}
                      style={{
                        backgroundColor: '#2F855A',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '10px 18px',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer'
                      }}
                    >
                      Verify Token & Hand Over
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: ORDER HISTORY (COMPLETED) */}
        {activeTab === 'order_history' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontWeight: 700 }}>
                  <th style={{ padding: '16px' }}>ORDER ID</th>
                  <th style={{ padding: '16px' }}>FARMER</th>
                  <th style={{ padding: '16px' }}>PRODUCT & QTY</th>
                  <th style={{ padding: '16px' }}>AMOUNT</th>
                  <th style={{ padding: '16px' }}>PAYMENT STATUS</th>
                  <th style={{ padding: '16px' }}>DATE</th>
                </tr>
              </thead>
              <tbody>
                {completedOrders.map((co) => (
                  <tr key={co.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '16px', fontWeight: 700, color: '#1E293B' }}>{co.id}</td>
                    <td style={{ padding: '16px', fontWeight: 600 }}>{co.farmer}</td>
                    <td style={{ padding: '16px', color: '#475569' }}>{co.product} ({co.qty}x)</td>
                    <td style={{ padding: '16px', fontWeight: 700, color: '#2F855A' }}>₹{co.total}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ color: '#166534', backgroundColor: '#DCFCE7', padding: '4px 8px', borderRadius: '6px', fontWeight: 700, fontSize: '11px' }}>
                        {co.payment}
                      </span>
                    </td>
                    <td style={{ padding: '16px', color: '#64748B' }}>{co.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: SALES REPORT & ANALYTICS */}
        {activeTab === 'sales_report' && (
          <div>
            {/* Top Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
              <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700 }}>TOTAL REVENUE (WEEK)</div>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#1E293B', marginTop: '6px' }}>₹62,450</div>
                <div style={{ color: '#16A34A', fontSize: '12px', fontWeight: 700, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ArrowUpRight size={14} /> +18.4% vs last week
                </div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700 }}>UNITS SOLD (WEEK)</div>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#1E293B', marginTop: '6px' }}>359 Units</div>
                <div style={{ color: '#2F855A', fontSize: '12px', fontWeight: 600, marginTop: '4px' }}>
                  87% via Farmer In-Store Tokens
                </div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 700 }}>ACTIVE FARMERS SERVED</div>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#1E293B', marginTop: '6px' }}>42 Farmers</div>
                <div style={{ color: '#64748B', fontSize: '12px', fontWeight: 600, marginTop: '4px' }}>
                  Thanjavur & Delta Basin
                </div>
              </div>
            </div>

            {/* Best Selling Products of the Week */}
            <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <TrendingUp size={20} color="#2F855A" />
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                  Best Selling Products of the Week
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { name: 'Urea Granular 46%', units: 140, revenue: 37520, pct: 90 },
                  { name: 'DAP High Nitrogen Complex', units: 110, revenue: 148500, pct: 75 },
                  { name: 'Pseudomonas Fluorescens Seed Tonic', units: 52, revenue: 19760, pct: 45 },
                  { name: 'Trichoderma Viride Bio-Fungicide', units: 35, revenue: 15750, pct: 30 }
                ].map((p, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 700, color: '#1E293B', marginBottom: '6px' }}>
                      <span>#{idx + 1} {p.name}</span>
                      <span>{p.units} units (₹{p.revenue.toLocaleString()})</span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${p.pct}%`, backgroundColor: '#2F855A' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. PROMINENT FLOATING ACTION BUTTON (+) */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          style={{
            position: 'fixed',
            bottom: '32px',
            right: '32px',
            width: '60px',
            height: '60px',
            borderRadius: '30px',
            backgroundColor: '#2F855A',
            color: '#FFFFFF',
            border: 'none',
            boxShadow: '0 8px 24px rgba(47, 133, 90, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 999,
            transition: 'transform 0.2s ease, background-color 0.2s'
          }}
          title="Add New Product"
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <Plus size={28} strokeWidth={2.5} />
        </button>

        {/* ADD PRODUCT MODAL (Manual & Smart Extract) */}
        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddProduct={handleAddProduct}
        />
      </main>
    </div>
  );
}
