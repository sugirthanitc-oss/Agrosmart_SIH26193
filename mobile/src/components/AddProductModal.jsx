import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  Loader2, 
  CheckCircle, 
  Edit3, 
  Sparkles, 
  Package, 
  AlertCircle 
} from 'lucide-react';

export function AddProductModal({ isOpen, onClose, onAddProduct }) {
  const [activeMode, setActiveMode] = useState('manual'); // 'manual' | 'invoice'

  // Manual Form State
  const [manualForm, setManualForm] = useState({
    name: '',
    category: 'Bio-Fungicide',
    stock: '',
    price: ''
  });

  // Smart Extract State
  // steps: 'idle' | 'uploading' | 'extracted' | 'confirmed'
  const [ocrStep, setOcrStep] = useState('idle');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [extractedData, setExtractedData] = useState(null);
  const [editablePrice, setEditablePrice] = useState('');

  if (!isOpen) return null;

  // Handle Manual Form Submission
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualForm.name || !manualForm.stock || !manualForm.price) return;

    onAddProduct({
      id: 'PROD-' + Date.now().toString().slice(-4),
      name: manualForm.name,
      category: manualForm.category,
      stockReceived: parseInt(manualForm.stock, 10),
      stockSold: 0,
      price: parseFloat(manualForm.price)
    });

    onClose();
  };

  // Handle File Selection & Mock OCR Extraction
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setOcrStep('uploading');

    // Simulate OCR delay (1.8s)
    setTimeout(() => {
      const mockResult = {
        name: 'Pseudomonas Fluorescens (Bio-Pesticide)',
        category: 'Bio-Pesticide',
        stock: 120,
        mockPrice: 380,
        supplier: 'Tamil Nadu Agro Chemicals Ltd',
        batchNo: 'BATCH-2026-904'
      };
      setExtractedData(mockResult);
      setEditablePrice(mockResult.mockPrice.toString());
      setOcrStep('extracted');
    }, 1800);
  };

  // Confirm Smart Extracted Product
  const handleConfirmExtracted = () => {
    if (!extractedData || !editablePrice) return;

    onAddProduct({
      id: 'PROD-' + Date.now().toString().slice(-4),
      name: extractedData.name,
      category: extractedData.category,
      stockReceived: extractedData.stock,
      stockSold: 0,
      price: parseFloat(editablePrice)
    });

    setOcrStep('confirmed');
    setTimeout(() => {
      onClose();
      // Reset state for next time
      setOcrStep('idle');
      setExtractedData(null);
      setUploadedFileName('');
    }, 800);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '520px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#F8FAFC',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px'
        }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1E293B', margin: 0 }}>
              Add New Product to Store
            </h2>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0 0' }}>
              Choose manual entry or auto-extract from supplier invoice
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Selection */}
        <div style={{ display: 'flex', padding: '16px 24px 0 24px', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setActiveMode('manual')}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: activeMode === 'manual' ? '#2F855A' : '#F1F5F9',
              color: activeMode === 'manual' ? '#FFFFFF' : '#64748B',
              transition: 'all 0.2s'
            }}
          >
            Option A: Manual Entry
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('invoice')}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: activeMode === 'invoice' ? '#2F855A' : '#F1F5F9',
              color: activeMode === 'invoice' ? '#FFFFFF' : '#64748B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
          >
            <Sparkles size={15} color={activeMode === 'invoice' ? '#9AE6B4' : '#64748B'} />
            Option B: Upload Invoice
          </button>
        </div>

        {/* Body Content */}
        <div style={{ padding: '24px' }}>
          {/* OPTION A: MANUAL ENTRY (CLEAN 2x2 GRID) */}
          {activeMode === 'manual' && (
            <form onSubmit={handleManualSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                    PRODUCT NAME *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Trichoderma Viride Bio-Fungicide"
                    required
                    value={manualForm.name}
                    onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13px',
                      outline: 'none',
                      backgroundColor: '#F8FAFC'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                    CATEGORY *
                  </label>
                  <select
                    value={manualForm.category}
                    onChange={(e) => setManualForm({ ...manualForm, category: e.target.value })}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13px',
                      outline: 'none',
                      backgroundColor: '#F8FAFC'
                    }}
                  >
                    <option value="Bio-Fungicide">Bio-Fungicide</option>
                    <option value="NPK Chemical Fertilizer">NPK Chemical Fertilizer</option>
                    <option value="Organic Botanical Pesticide">Organic Botanical Pesticide</option>
                    <option value="Micro-Nutrient Spray">Micro-Nutrient Spray</option>
                    <option value="Seed Treatment Solution">Seed Treatment Solution</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                    STOCK QUANTITY (UNITS) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g., 50"
                    required
                    value={manualForm.stock}
                    onChange={(e) => setManualForm({ ...manualForm, stock: e.target.value })}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13px',
                      outline: 'none',
                      backgroundColor: '#F8FAFC'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                    PRICE (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g., 450"
                    required
                    value={manualForm.price}
                    onChange={(e) => setManualForm({ ...manualForm, price: e.target.value })}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13px',
                      outline: 'none',
                      backgroundColor: '#F8FAFC'
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  backgroundColor: '#2F855A',
                  color: '#FFFFFF',
                  padding: '14px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(47, 133, 90, 0.25)'
                }}
              >
                Add Product to Inventory
              </button>
            </form>
          )}

          {/* OPTION B: UPLOAD INVOICE (SMART EXTRACT) */}
          {activeMode === 'invoice' && (
            <div>
              {/* Step 1: Idle Dropzone */}
              {ocrStep === 'idle' && (
                <div style={{
                  border: '2px dashed #94A3B8',
                  borderRadius: '14px',
                  padding: '36px 20px',
                  textAlign: 'center',
                  backgroundColor: '#F8FAFC',
                  cursor: 'pointer',
                  position: 'relative'
                }}>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer'
                    }}
                  />
                  <Upload size={36} color="#64748B" style={{ margin: '0 auto 12px auto' }} />
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#334155' }}>
                    Upload Supplier Invoice (PDF / Image)
                  </div>
                  <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>
                    Drag & drop or tap to browse your invoice file
                  </div>
                  <div style={{
                    marginTop: '16px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '11px',
                    color: '#2F855A',
                    backgroundColor: '#E8F5E9',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontWeight: 700
                  }}>
                    <Sparkles size={12} /> AI extracts product name, stock, and unit prices
                  </div>
                </div>
              )}

              {/* Step 2: Loading State */}
              {ocrStep === 'uploading' && (
                <div style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '14px',
                  border: '1px solid #E2E8F0'
                }}>
                  <Loader2 size={36} color="#2F855A" className="animate-spin" style={{ margin: '0 auto 16px auto' }} />
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#1E293B' }}>
                    Analyzing Invoice via AI OCR...
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '6px' }}>
                    File: <span style={{ fontWeight: 600 }}>{uploadedFileName}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '8px' }}>
                    Extracting SKU details, supplier NPK grades, and invoice pricing...
                  </div>
                </div>
              )}

              {/* Step 3: Crucial Price Confirmation & Edit */}
              {ocrStep === 'extracted' && extractedData && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Extracted Card */}
                  <div style={{
                    backgroundColor: '#F0FDF4',
                    border: '1px solid #BBF7D0',
                    borderRadius: '12px',
                    padding: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontSize: '12px', fontWeight: 700, marginBottom: '8px' }}>
                      <CheckCircle size={16} /> AI EXTRACTION COMPLETE
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#14532D' }}>
                      {extractedData.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#15803D', marginTop: '4px' }}>
                      Category: <strong>{extractedData.category}</strong> • Stock: <strong>{extractedData.stock} units</strong>
                    </div>
                    <div style={{ fontSize: '11px', color: '#4ADE80', marginTop: '4px' }}>
                      Supplier: {extractedData.supplier} (Batch: {extractedData.batchNo})
                    </div>
                  </div>

                  {/* Crucial Step: Prompt & Editable Price Input */}
                  <div style={{
                    backgroundColor: '#FFFBEB',
                    border: '1px solid #FDE68A',
                    borderRadius: '12px',
                    padding: '18px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '12px' }}>
                      <AlertCircle size={18} color="#D97706" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#92400E' }}>
                          Price Confirmation Required
                        </div>
                        <div style={{ fontSize: '13px', color: '#B45309', marginTop: '2px' }}>
                          Extracted Price: <strong>₹{extractedData.mockPrice}</strong>. Keep this price or edit it?
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: '10px' }}>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#78350F', marginBottom: '4px' }}>
                        FINAL STORE SELLING PRICE (₹)
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                          <span style={{ position: 'absolute', left: '12px', top: '12px', fontWeight: 700, color: '#92400E' }}>₹</span>
                          <input
                            type="number"
                            step="0.01"
                            value={editablePrice}
                            onChange={(e) => setEditablePrice(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '10px 14px 10px 28px',
                              borderRadius: '8px',
                              border: '2px solid #F59E0B',
                              fontSize: '16px',
                              fontWeight: 800,
                              color: '#78350F',
                              backgroundColor: '#FFFFFF',
                              outline: 'none'
                            }}
                          />
                        </div>
                        <span style={{ fontSize: '11px', color: '#92400E', fontWeight: 600 }}>
                          (Editable)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setOcrStep('idle')}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        backgroundColor: '#FFFFFF',
                        color: '#64748B',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Re-Upload
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmExtracted}
                      style={{
                        flex: 2,
                        padding: '12px',
                        borderRadius: '10px',
                        border: 'none',
                        backgroundColor: '#2F855A',
                        color: '#FFFFFF',
                        fontSize: '14px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(47, 133, 90, 0.25)'
                      }}
                    >
                      Confirm & Add to Inventory
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Confirmed State */}
              {ocrStep === 'confirmed' && (
                <div style={{ padding: '30px', textAlign: 'center' }}>
                  <CheckCircle size={44} color="#16A34A" style={{ margin: '0 auto 12px auto' }} />
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#166534' }}>
                    Product Added Successfully!
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
