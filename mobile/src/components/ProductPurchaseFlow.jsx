import React, { useState } from 'react';

const MOCK_SHOPS = [
  { id: 's1', name: 'Sri Murugan Agri Clinic', distance: '1.2 km', price: '₹450' },
  { id: 's2', name: 'Kisan Kendra Erode', distance: '3.4 km', price: '₹430' },
];

export function ProductPurchaseFlow({ product, onBack }) {
  const [selectedShop, setSelectedShop] = useState(null);
  const [tokenModal, setTokenModal] = useState(false);
  const [generatedToken, setGeneratedToken] = useState('');

  const handleGenerateToken = () => {
    const randomToken = '#TKN-' + Math.floor(1000 + Math.random() * 9000);
    setGeneratedToken(randomToken);
    setTokenModal(true);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F4F7F6', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, overflowY: 'auto' }}>
      <header style={{ backgroundColor: '#FFF', padding: '24px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ marginRight: '16px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>
          ←
        </button>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#2D3748', margin: 0 }}>Purchase Details</h1>
      </header>
      
      <div style={{ backgroundColor: '#E2E8F0', padding: '24px 20px' }}>
        <p style={{ fontSize: '14px', color: '#718096', margin: '0 0 4px 0' }}>Selected Product:</p>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#2D3748', margin: 0 }}>{product?.productName || 'Trichoderma Viride'}</h2>
      </div>

      <h3 style={{ padding: '24px 20px 12px 20px', fontSize: '16px', fontWeight: 'bold', color: '#4A5568', margin: 0 }}>Nearby Shops & Prices</h3>
      
      <div style={{ padding: '0 20px 120px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {MOCK_SHOPS.map(shop => {
          const isSelected = selectedShop?.id === shop.id;
          return (
            <div 
              key={shop.id}
              onClick={() => setSelectedShop(shop)}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', 
                backgroundColor: isSelected ? '#F0FFF4' : '#FFF', 
                border: `2px solid ${isSelected ? '#2F855A' : '#E2E8F0'}`, 
                borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#2D3748', margin: '0 0 4px 0' }}>{shop.name}</h4>
                <p style={{ color: '#718096', fontSize: '14px', margin: 0 }}>{shop.distance} away</p>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2F855A' }}>{shop.price}</div>
            </div>
          );
        })}
      </div>

      {selectedShop && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', padding: '20px', borderTop: '1px solid #E2E8F0', boxShadow: '0 -4px 10px rgba(0,0,0,0.05)', zIndex: 10 }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2D3748', marginBottom: '16px' }}>
            Total: {selectedShop.price}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{ flex: 1, backgroundColor: '#3182CE', color: '#FFF', fontWeight: 'bold', padding: '16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
              Pay Online
            </button>
            <button 
              onClick={handleGenerateToken}
              style={{ flex: 1, backgroundColor: '#2F855A', color: '#FFF', fontWeight: 'bold', padding: '16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px' }}
            >
              Pay at Shop
            </button>
          </div>
        </div>
      )}

      {tokenModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', zIndex: 100 }}>
          <div style={{ backgroundColor: '#FFF', padding: '32px 24px', borderRadius: '16px', width: '100%', maxWidth: '350px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2F855A', margin: '0 0 24px 0' }}>Order Reserved!</h2>
            
            <div style={{ width: '150px', height: '150px', backgroundColor: '#EDF2F7', border: '1px solid #E2E8F0', margin: '0 auto 24px auto', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#A0AEC0', fontWeight: 'bold', letterSpacing: '2px' }}>[ QR CODE ]</span>
            </div>
            
            <div style={{ fontSize: '32px', fontWeight: '900', color: '#2D3748', letterSpacing: '2px', marginBottom: '16px' }}>
              {generatedToken}
            </div>
            
            <p style={{ color: '#4A5568', marginBottom: '32px', lineHeight: '1.5' }}>
              Show this token at <strong>{selectedShop?.name}</strong> to collect your product and pay locally.
            </p>
            
            <button 
              onClick={() => { setTokenModal(false); onBack(); }}
              style={{ backgroundColor: '#E2E8F0', color: '#2D3748', fontWeight: 'bold', padding: '16px', width: '100%', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '16px' }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
