import React, { useState } from 'react';
import { ShoppingCart, MapPin, CheckCircle, CreditCard, ScanLine } from 'lucide-react';

export function ProductCheckoutFlow({ product, onClose }) {
  const [step, setStep] = useState(1); // 1 = Select Shop, 2 = Payment Method, 3 = Confirmation
  const [selectedShop, setSelectedShop] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(''); // 'online' or 'token'

  const SHOPS = [
    { id: 'shop-1', name: 'Sri Murugan Agri Clinic', distance: '1.2 km away', price: 450, stock: 'In Stock' },
    { id: 'shop-2', name: 'Kisan Fertilizers Co.', distance: '3.5 km away', price: 465, stock: 'In Stock' },
    { id: 'shop-3', name: 'National Seed & Pesticides', distance: '5.0 km away', price: 440, stock: 'Low Stock' },
  ];

  const handleBuyNow = (shop) => {
    setSelectedShop(shop);
    setStep(2);
  };

  const handleConfirmOrder = () => {
    setStep(3);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#F4F7F6', zIndex: 10000, overflowY: 'auto' }}>
      <header style={{ background: '#FFF', padding: '24px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center' }}>
        <button onClick={onClose} style={{ marginRight: '16px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>&larr;</button>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#2D3748', margin: 0 }}>
          {step === 1 ? 'Select Nearest Shop' : step === 2 ? 'Checkout Options' : 'Order Confirmed'}
        </h1>
      </header>

      <div style={{ padding: '24px 20px' }}>
        {/* Step 1: Select Shop */}
        {step === 1 && (
          <>
            <div style={{ background: '#E2E8F0', padding: '20px', borderRadius: '12px', marginBottom: '24px' }}>
              <p style={{ fontSize: '14px', color: '#718096', margin: '0 0 4px 0' }}>Selected Product:</p>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#2D3748', margin: 0 }}>{product?.name || 'Trichoderma Viride'}</h2>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#4A5568', marginBottom: '16px' }}>Available Nearby</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {SHOPS.map(shop => (
                <div key={shop.id} style={{ padding: '20px', background: '#FFF', border: '2px solid #E2E8F0', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#2D3748', margin: '0 0 4px 0' }}>{shop.name}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#718096', fontSize: '13px' }}>
                        <MapPin size={14} /> {shop.distance} &bull; <span style={{ color: shop.stock === 'In Stock' ? '#38A169' : '#DD6B20' }}>{shop.stock}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#2F855A' }}>₹{shop.price}</div>
                  </div>
                  <button onClick={() => handleBuyNow(shop)} style={{ width: '100%', background: '#FFF', color: '#2F855A', fontWeight: 'bold', padding: '12px', borderRadius: '8px', border: '2px solid #2F855A', cursor: 'pointer', fontSize: '14px' }}>
                    Buy Now
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Step 2: Payment Method */}
        {step === 2 && (
          <>
            <div style={{ background: '#FFF', padding: '20px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#2D3748', margin: '0 0 12px 0' }}>Order Summary</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#4A5568' }}>
                <span>{product?.name || 'Trichoderma Viride'} (1x)</span>
                <span>₹{selectedShop.price}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '14px', color: '#4A5568' }}>
                <span>Platform Fee</span>
                <span>₹15</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px dashed #CBD5E0', fontSize: '18px', fontWeight: 'bold', color: '#2D3748' }}>
                <span>Total Amount</span>
                <span>₹{selectedShop.price + 15}</span>
              </div>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#4A5568', marginBottom: '16px' }}>Select Payment Option</h3>
            
            <label style={{ display: 'flex', alignItems: 'center', padding: '20px', background: '#FFF', border: paymentMethod === 'online' ? '2px solid #3182CE' : '2px solid #E2E8F0', borderRadius: '12px', marginBottom: '12px', cursor: 'pointer' }}>
              <input type="radio" name="payment" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} style={{ marginRight: '16px', transform: 'scale(1.2)' }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 'bold', color: '#2D3748', marginBottom: '4px' }}>
                  <CreditCard size={18} color="#3182CE" /> Pay Online
                </div>
                <div style={{ fontSize: '13px', color: '#718096' }}>UPI, NetBanking, Debit/Credit Cards</div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', padding: '20px', background: '#FFF', border: paymentMethod === 'token' ? '2px solid #2F855A' : '2px solid #E2E8F0', borderRadius: '12px', marginBottom: '24px', cursor: 'pointer' }}>
              <input type="radio" name="payment" checked={paymentMethod === 'token'} onChange={() => setPaymentMethod('token')} style={{ marginRight: '16px', transform: 'scale(1.2)' }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: 'bold', color: '#2D3748', marginBottom: '4px' }}>
                  <ScanLine size={18} color="#2F855A" /> Generate Token (Pay at Shop)
                </div>
                <div style={{ fontSize: '13px', color: '#718096' }}>Reserve stock now, pay cash at {selectedShop.name}</div>
              </div>
            </label>

            <button onClick={handleConfirmOrder} disabled={!paymentMethod} style={{ width: '100%', background: paymentMethod ? '#2F855A' : '#A0AEC0', color: '#FFF', fontWeight: 'bold', padding: '16px', borderRadius: '12px', border: 'none', cursor: paymentMethod ? 'pointer' : 'not-allowed', fontSize: '16px' }}>
              Confirm Order
            </button>
          </>
        )}

        {/* Step 3: Confirmation & Token */}
        {step === 3 && (
          <div style={{ textAlign: 'center', paddingTop: '20px' }}>
            <CheckCircle size={64} color="#38A169" style={{ margin: '0 auto 16px auto' }} />
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2F855A', margin: '0 0 8px 0' }}>Order Successfully {paymentMethod === 'online' ? 'Placed!' : 'Reserved!'}</h2>
            <p style={{ color: '#4A5568', marginBottom: '32px', fontSize: '14px' }}>Please visit {selectedShop.name} to collect your product.</p>
            
            {paymentMethod === 'token' && (
              <div style={{ background: '#FFF', border: '2px dashed #CBD5E0', padding: '32px 24px', borderRadius: '16px', marginBottom: '32px', display: 'inline-block' }}>
                <div style={{ width: '150px', height: '150px', background: '#EDF2F7', border: '1px solid #E2E8F0', margin: '0 auto 24px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#A0AEC0', fontWeight: 'bold', letterSpacing: '1px' }}>[ QR CODE ]</span>
                </div>
                <div style={{ fontSize: '12px', color: '#718096', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Collection Token</div>
                <div style={{ fontSize: '32px', fontWeight: '900', color: '#2D3748', letterSpacing: '2px' }}>#TKN-8492</div>
              </div>
            )}

            <button onClick={onClose} style={{ background: '#E2E8F0', color: '#2D3748', fontWeight: 'bold', padding: '16px', width: '100%', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '16px' }}>
              Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
