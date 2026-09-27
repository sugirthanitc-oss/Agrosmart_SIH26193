import React, { useState } from 'react';
import { Package, TrendingUp, ShoppingBag, Clock, FileText } from 'lucide-react';

const MOCK_INVENTORY = [
  { id: '1', name: 'Urea 46%', stockReceived: 500, stockSold: 375 },
  { id: '2', name: 'DAP Fertilizer', stockReceived: 300, stockSold: 120 },
  { id: '3', name: 'Neem Oil Extract (Bio)', stockReceived: 100, stockSold: 90 },
];

export function AgriInputShopModule({ user }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  if (!isAuthenticated) {
    return <ShopAuthScreen onLogin={() => setIsAuthenticated(true)} />;
  }
  
  return <ShopDashboard />;
}

function ShopAuthScreen({ onLogin }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);

  const handleSendOtp = () => {
    if (phoneNumber.length >= 10) setStep(2);
  };

  const handleLogin = () => {
    if (otp.length >= 4) onLogin();
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F0F4F8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ backgroundColor: '#FFF', padding: '32px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', maxWidth: '400px', width: '100%' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1A365D', textAlign: 'center', marginBottom: '8px' }}>Shop Portal</h1>
        <p style={{ color: '#4A5568', textAlign: 'center', marginBottom: '32px' }}>
          {step === 1 ? 'Login with Phone Number' : 'Enter OTP'}
        </p>

        {step === 1 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              type="tel"
              maxLength="10"
              placeholder="Mobile Number"
              style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px', fontSize: '16px', backgroundColor: '#F7FAFC', outline: 'none' }}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <button 
              onClick={handleSendOtp}
              style={{ backgroundColor: '#3182CE', color: '#FFF', fontWeight: 'bold', padding: '16px', borderRadius: '8px', cursor: 'pointer', border: 'none' }}
            >
              Send OTP
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              type="text"
              maxLength="4"
              placeholder="4-Digit OTP"
              style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px', fontSize: '18px', backgroundColor: '#F7FAFC', outline: 'none', letterSpacing: '8px', textAlign: 'center' }}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button 
              onClick={handleLogin}
              style={{ backgroundColor: '#3182CE', color: '#FFF', fontWeight: 'bold', padding: '16px', borderRadius: '8px', cursor: 'pointer', border: 'none' }}
            >
              Verify & Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ShopDashboard() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F0F4F8', paddingBottom: '80px' }}>
      <header style={{ backgroundColor: '#1A365D', color: '#FFF', padding: '40px 20px 20px 20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Store Dashboard</h1>
      </header>

      <div style={{ padding: '16px', display: 'flex', gap: '16px' }}>
        <button style={{ flex: 1, backgroundColor: '#FFF', color: '#3182CE', fontWeight: 'bold', padding: '16px', borderRadius: '12px', border: 'none', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <ShoppingBag size={18} /> Active Orders
        </button>
        <button style={{ flex: 1, backgroundColor: '#FFF', color: '#3182CE', fontWeight: 'bold', padding: '16px', borderRadius: '12px', border: 'none', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Clock size={18} /> Order History
        </button>
      </div>

      <div style={{ margin: '0 16px', backgroundColor: '#FFF', padding: '24px', borderRadius: '12px', borderLeft: '5px solid #3182CE', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#2D3748', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <TrendingUp size={20} color="#3182CE" /> Daily Sales Report
        </h2>
        <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2D3748' }}>₹ 45,200</div>
        <div style={{ color: '#48BB78', fontWeight: '600', marginTop: '4px', fontSize: '14px' }}>+12% from yesterday</div>
      </div>

      <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#2D3748', margin: '24px 16px 12px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Package size={20} /> Live Inventory Feed
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '0 16px' }}>
        {MOCK_INVENTORY.map(item => {
          const soldPercentage = (item.stockSold / item.stockReceived) * 100;
          const isLowStock = soldPercentage > 80;
          
          return (
            <div key={item.id} style={{ backgroundColor: '#FFF', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#2D3748', marginBottom: '4px' }}>{item.name}</h3>
              <p style={{ color: '#718096', fontSize: '14px', marginBottom: '16px' }}>
                {item.stockSold} sold out of {item.stockReceived} units
              </p>
              <div style={{ height: '8px', width: '100%', backgroundColor: '#EDF2F7', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${soldPercentage}%`, backgroundColor: isLowStock ? '#48BB78' : '#3182CE', transition: 'width 0.3s' }} />
              </div>
              <div style={{ textAlign: 'right', marginTop: '8px', fontSize: '12px', fontWeight: 'bold', color: '#A0AEC0' }}>
                {Math.round(soldPercentage)}% Sold
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
