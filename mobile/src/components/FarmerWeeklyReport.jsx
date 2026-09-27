import React, { useState } from 'react';
import { ProductPurchaseFlow } from './ProductPurchaseFlow.jsx';

const MOCK_RECOMMENDATION = {
  id: 'rec_01',
  productName: 'Trichoderma Viride (Bio-Fungicide)',
  reason: 'Prevents root rot during flowering phase. Ensures MRL compliance.',
  dosage: '5ml per liter',
  cropStage: 'Flowering'
};

export function FarmerWeeklyReport({ onClose }) {
  const [lang, setLang] = useState('en');
  const [showPurchaseFlow, setShowPurchaseFlow] = useState(false);
  
  const t = (enText, taText) => lang === 'ta' ? taText : enText;

  if (showPurchaseFlow) {
    return <ProductPurchaseFlow product={MOCK_RECOMMENDATION} onBack={() => setShowPurchaseFlow(false)} />;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F4F7F6', display: 'flex', flexDirection: 'column' }}>
      <header style={{ backgroundColor: '#2F855A', padding: '40px 20px 20px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {onClose && (
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#FFF', fontSize: '24px', marginRight: '16px', cursor: 'pointer' }}>
              ←
            </button>
          )}
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFF', margin: 0 }}>
            {t('Weekly Report', 'வார அறிக்கை')}
          </h1>
        </div>
        <button 
          onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
          style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {lang === 'en' ? 'தமிழ்' : 'EN'}
        </button>
      </header>

      <main style={{ padding: '20px', flex: 1, maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        <div style={{ backgroundColor: '#FFF', padding: '32px 24px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'inline-block', backgroundColor: '#C6F6D5', color: '#276749', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
            {MOCK_RECOMMENDATION.cropStage}
          </div>
          
          <h2 style={{ fontSize: '14px', color: '#718096', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '600', marginBottom: '8px', margin: 0 }}>
            {t('Action Required', 'செயல் தேவை')}
          </h2>
          
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2D3748', margin: '0 0 8px 0' }}>
            {MOCK_RECOMMENDATION.productName}
          </h3>
          
          <p style={{ fontSize: '18px', color: '#2F855A', fontWeight: '600', margin: '0 0 16px 0' }}>
            {t('Dosage:', 'அளவு:')} {MOCK_RECOMMENDATION.dosage}
          </p>
          
          <p style={{ color: '#4A5568', lineHeight: '1.6', marginBottom: '32px' }}>
            {MOCK_RECOMMENDATION.reason}
          </p>

          <button 
            onClick={() => setShowPurchaseFlow(true)}
            style={{ width: '100%', backgroundColor: '#E53E3E', color: '#FFF', fontWeight: 'bold', padding: '16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '18px', boxShadow: '0 4px 6px rgba(229,62,62,0.2)' }}
          >
            {t('Buy Product Nearby', 'அருகில் வாங்க')}
          </button>
        </div>
      </main>
    </div>
  );
}
