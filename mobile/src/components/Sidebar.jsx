import React from 'react';
import { 
  Package, 
  ShoppingBag, 
  Clock, 
  TrendingUp, 
  MapPin, 
  FileCheck, 
  Users,
  LogOut,
  ChevronRight
} from 'lucide-react';

export function Sidebar({ role = 'shop', activeTab, onSelectTab, user }) {
  // Navigation definitions based on role
  const getNavItems = () => {
    if (role === 'shop' || role === 'shop_owner') {
      return [
        { id: 'products', label: 'Products (Live Inventory)', icon: Package },
        { id: 'view_orders', label: 'View Orders', icon: ShoppingBag, badge: '2 Active' },
        { id: 'order_history', label: 'Order History', icon: Clock },
        { id: 'sales_report', label: 'Sales Report', icon: TrendingUp },
      ];
    }

    if (role === 'exporter') {
      return [
        { id: 'contracted_lands', label: 'Contracted Lands', icon: MapPin },
        { id: 'lands_history', label: 'Lands History', icon: FileCheck },
        { id: 'agent_management', label: 'Agent Management', icon: Users, badge: 'Daily' },
      ];
    }

    // Default fallback
    return [];
  };

  const navItems = getNavItems();

  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#1E4D3A', // Global primary green theme
      color: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      boxShadow: '4px 0 15px rgba(0,0,0,0.1)'
    }}>
      {/* Brand & Role Header */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#48BB78',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '18px'
          }}>
            A
          </div>
          <span style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '0.5px' }}>AgriSmart</span>
        </div>
        <div style={{
          marginTop: '16px',
          backgroundColor: 'rgba(255,255,255,0.08)',
          padding: '10px 12px',
          borderRadius: '10px'
        }}>
          <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#9AE6B4', fontWeight: 700, letterSpacing: '1px' }}>
            {role === 'shop' || role === 'shop_owner' ? 'Agri-Input Fertilizer Hub' : 'Global Export Terminal'}
          </div>
          <div style={{ fontSize: '13px', fontWeight: 700, marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.name || (role === 'exporter' ? 'Kongu Agro Global Exports' : 'Kisan Fertilizer Clinic')}
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', padding: '4px 10px 8px 10px', fontWeight: 700, letterSpacing: '0.8px' }}>
          Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: isActive ? '#2F855A' : 'transparent',
                color: isActive ? '#FFFFFF' : '#D1E7DD',
                fontWeight: isActive ? 700 : 500,
                fontSize: '13px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={18} color={isActive ? '#9AE6B4' : '#A0AEC0'} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  backgroundColor: isActive ? '#38A169' : 'rgba(255,255,255,0.15)',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  color: '#FFFFFF'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '11px', color: '#9AE6B4' }}>
        SIH 2026 • Verified Portal
      </div>
    </aside>
  );
}
