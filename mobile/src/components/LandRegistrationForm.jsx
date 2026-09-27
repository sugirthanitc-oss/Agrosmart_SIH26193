import React, { useState } from 'react';
import { Upload, CheckCircle, Search, MapPin } from 'lucide-react';

export function LandRegistrationForm({ onClose, onRegister }) {
  const [landName, setLandName] = useState('');
  const [unit, setUnit] = useState('acres'); // 'acres' or 'hectares'
  const [landArea, setLandArea] = useState('');
  const [isPdfUploaded, setIsPdfUploaded] = useState(false);
  const [cropType, setCropType] = useState('');
  const [useAiSuggestion, setUseAiSuggestion] = useState(true);

  const handleUploadClick = () => {
    // Mock the file upload
    setTimeout(() => {
      setIsPdfUploaded(true);
      setCropType('Bhavani High-Yield Turmeric');
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister({
      land_name: landName || 'New Land Parcel',
      area_acres: unit === 'acres' ? landArea : (parseFloat(landArea) * 2.471).toFixed(2),
      area_ha: unit === 'hectares' ? landArea : (parseFloat(landArea) / 2.471).toFixed(2),
      crop_type: cropType || 'Bhavani High-Yield Turmeric',
      soil_report_uploaded: isPdfUploaded
    });
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(31, 27, 58, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', zIndex: 1000 }}>
      <div style={{ background: '#FFF', borderRadius: '24px', width: '100%', maxWidth: '500px', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ background: '#2F855A', padding: '24px', position: 'relative' }}>
          <h2 style={{ color: '#FFF', fontSize: '20px', fontWeight: '800', margin: 0 }}>Register New Land Parcel</h2>
          <p style={{ color: '#C6F6D5', fontSize: '13px', marginTop: '4px' }}>Add acreage and soil parameters</p>
          <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: '#FFF', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#4A5568', display: 'block', marginBottom: '6px' }}>LAND IDENTIFIER / NAME</label>
            <div style={{ display: 'flex', alignItems: 'center', background: '#F7FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '12px' }}>
              <MapPin size={18} color="#A0AEC0" style={{ marginRight: '10px' }} />
              <input type="text" placeholder="e.g. Amaravathi Basin Plot C" required value={landName} onChange={e => setLandName(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '14px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#4A5568', display: 'block', marginBottom: '6px' }}>MEASUREMENT UNIT</label>
              <div style={{ display: 'flex', background: '#EDF2F7', borderRadius: '10px', padding: '4px' }}>
                <button type="button" onClick={() => setUnit('acres')} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: unit === 'acres' ? '#FFF' : 'transparent', fontWeight: 'bold', color: unit === 'acres' ? '#2D3748' : '#718096', boxShadow: unit === 'acres' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer' }}>Acres</button>
                <button type="button" onClick={() => setUnit('hectares')} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: unit === 'hectares' ? '#FFF' : 'transparent', fontWeight: 'bold', color: unit === 'hectares' ? '#2D3748' : '#718096', boxShadow: unit === 'hectares' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer' }}>Hectares</button>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#4A5568', display: 'block', marginBottom: '6px' }}>AREA ({unit.toUpperCase()})</label>
              <input type="number" step="0.1" required value={landArea} onChange={e => setLandArea(e.target.value)} placeholder={`e.g. ${unit === 'acres' ? '4.5' : '1.8'}`} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0', background: '#F7FAFC', fontSize: '14px', outline: 'none' }} />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#4A5568', display: 'block', marginBottom: '6px' }}>DIRECT SOIL TEST PDF DOCUMENT</label>
            {!isPdfUploaded ? (
              <div onClick={handleUploadClick} style={{ border: '2px dashed #CBD5E0', borderRadius: '12px', padding: '32px 20px', textAlign: 'center', cursor: 'pointer', background: '#F7FAFC' }}>
                <Upload size={32} color="#A0AEC0" style={{ margin: '0 auto 12px auto' }} />
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#4A5568' }}>Tap to upload Soil Test PDF</div>
                <div style={{ fontSize: '12px', color: '#A0AEC0', marginTop: '4px' }}>Generates AI Seed Suggestion automatically</div>
              </div>
            ) : (
              <div style={{ border: '1px solid #C6F6D5', borderRadius: '12px', padding: '16px', background: '#F0FFF4', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CheckCircle size={24} color="#38A169" />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#276749' }}>Soil_Test_Report.pdf</div>
                    <div style={{ fontSize: '12px', color: '#38A169' }}>Analyzed successfully</div>
                  </div>
                </div>
                <button type="button" onClick={() => setIsPdfUploaded(false)} style={{ background: 'none', border: 'none', color: '#E53E3E', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>Remove</button>
              </div>
            )}
          </div>

          {isPdfUploaded && (
            <div style={{ marginBottom: '24px', background: '#F0F4F8', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#4A5568', display: 'block', marginBottom: '12px' }}>CROP SELECTION</label>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <input type="checkbox" id="ai-suggest" checked={useAiSuggestion} onChange={(e) => setUseAiSuggestion(e.target.checked)} />
                <label htmlFor="ai-suggest" style={{ fontSize: '14px', fontWeight: 'bold', color: '#3182CE' }}>✨ Use AI Suggested Seed</label>
              </div>

              {useAiSuggestion ? (
                <div style={{ background: '#FFF', border: '2px solid #3182CE', borderRadius: '8px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#718096', fontWeight: 'bold', marginBottom: '2px' }}>AI OPTIMAL MATCH (96%)</div>
                    <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#2D3748' }}>Bhavani High-Yield Turmeric</div>
                  </div>
                  <CheckCircle size={20} color="#3182CE" />
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '12px' }}>
                  <Search size={18} color="#A0AEC0" style={{ marginRight: '10px' }} />
                  <input type="text" placeholder="Search seeds..." value={cropType} onChange={e => setCropType(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '14px' }} />
                </div>
              )}
            </div>
          )}

          <button type="submit" style={{ width: '100%', background: '#2F855A', color: '#FFF', fontWeight: 'bold', padding: '16px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '15px', boxShadow: '0 4px 6px rgba(47,133,90,0.2)' }}>
            Register Land Parcel
          </button>
        </form>
      </div>
    </div>
  );
}
