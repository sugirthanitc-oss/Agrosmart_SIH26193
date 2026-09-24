import React, { useState } from 'react';
import {
  X,
  Cpu,
  Radio,
  Clock,
  Layers,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck
} from 'lucide-react';

export function AntigravityCoreModal({ isOpen, onClose, token, onStateMutated }) {
  if (!isOpen) return null;

  const [activeSubTab, setActiveSubTab] = useState(1);
  const [networkType, setNetworkType] = useState('none');
  const [isWasmRunning, setIsWasmRunning] = useState(false);
  const [wasmResult, setWasmResult] = useState(null);

  // Fallback simulator state
  const [fallbackLoading, setFallbackLoading] = useState(false);
  const [fallbackResponse, setFallbackResponse] = useState(null);

  // Split engine state
  const [harvestYield, setHarvestYield] = useState(350);
  const [exportRatio, setExportRatio] = useState(75);
  const [splitLoading, setSplitLoading] = useState(false);
  const [splitResponse, setSplitResponse] = useState(null);

  // 1. Simulate Edge WASM Extraction
  const handleRunWasmOcr = () => {
    setIsWasmRunning(true);
    setTimeout(() => {
      setIsWasmRunning(false);
      setWasmResult({
        latency_ms: 642,
        extracted_params_count: 12,
        compact_payload_bytes: 1184,
        enclave_signature: '0x8f3c42e1... [HARDWARE ATTESTED]',
        crdt_status: 'COMMITTED_LOCAL_RING'
      });
    }, 650);
  };

  // 2. Trigger Autonomous Missed Window Fallback
  const handleTriggerFallback = async () => {
    setFallbackLoading(true);
    try {
      const res = await fetch('/api/farmer/farms/farm-001-rajendra/missed-window-fallback', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFallbackResponse(data);
        if (onStateMutated) onStateMutated();
      }
    } catch (e) {
      console.warn('Fallback trigger error', e);
    } finally {
      setFallbackLoading(false);
    }
  };

  // 3. Trigger Dynamic Lot Splitting
  const handleTriggerSplit = async () => {
    setSplitLoading(true);
    try {
      const res = await fetch('/api/exporter/listings/listing-001-export/split', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          export_percentage: exportRatio / 100
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSplitResponse(data);
        if (onStateMutated) onStateMutated();
      }
    } catch (e) {
      console.warn('Split trigger error', e);
    } finally {
      setSplitLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 10, 45, 0.88)',
        backdropFilter: 'blur(12px)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '16px'
      }}
    >
      <div
        style={{
          background: '#160E3B',
          border: '1px solid rgba(108, 76, 245, 0.3)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '420px',
          maxHeight: '90vh',
          overflowY: 'auto',
          color: '#FFFFFF',
          padding: '20px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
              <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#8FC7FF' }}>
                Antigravity Autonomous Core
              </span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginTop: '2px' }}>
              Systems Architecture Simulator
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#8B87A8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Sub-Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', background: 'rgba(255, 255, 255, 0.05)', padding: '4px', borderRadius: '12px', marginBottom: '16px' }}>
          {[
            { id: 1, label: 'Edge WASM Sync' },
            { id: 2, label: 'State Fallback' },
            { id: 3, label: 'Split Engine' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveSubTab(t.id)}
              style={{
                padding: '6px 4px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: activeSubTab === t.id ? 'var(--indigo)' : 'transparent',
                color: activeSubTab === t.id ? '#FFFFFF' : '#8B87A8'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: EDGE WASM & HARDWARE ENCLAVE */}
        {activeSubTab === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#8FC7FF', marginBottom: '6px' }}>
                HARDWARE ATTESTED CAMERA PIPELINE
              </div>
              <div style={{ fontSize: '12px', color: '#C5C1E0', lineHeight: 1.5 }}>
                • OS Gallery Picker intent: <strong style={{ color: '#FF6B5B' }}>STRICTLY DISABLED</strong><br />
                • Frame Signer: <strong style={{ color: '#10B981' }}>Secure Enclave HMAC-SHA256</strong><br />
                • Telemetry Vector: <strong style={{ color: '#8FC7FF' }}>1.2 KB Canonical Protobuf</strong>
              </div>
            </div>

            <button
              onClick={handleRunWasmOcr}
              disabled={isWasmRunning}
              className="agro-btn-primary"
              style={{ width: '100%', fontSize: '12px' }}
            >
              <Cpu size={16} />
              {isWasmRunning ? 'Parsing Soil Card via WASM...' : 'Simulate Edge WASM Vectorization (<800ms)'}
            </button>

            {wasmResult && (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '10px', borderRadius: '12px', fontSize: '11px' }}>
                <div style={{ color: '#10B981', fontWeight: 800 }}>✓ WASM Edge Extraction Complete ({wasmResult.latency_ms}ms)</div>
                <div style={{ color: '#EAE8F5', marginTop: '4px' }}>
                  • Extracted: 12 GoI Parameters<br />
                  • Vector Size: {wasmResult.compact_payload_bytes} Bytes (Compressed from 8 MB PDF)<br />
                  • Enclave Sig: {wasmResult.enclave_signature}<br />
                  • Status: Committed to Durable SQLite Ring
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: AUTONOMOUS MISSED-WINDOW STATE MACHINE */}
        {activeSubTab === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#FF6B5B', marginBottom: '4px' }}>
                TEMPORAL FALLBACK ORCHESTRATION
              </div>
              <p style={{ fontSize: '12px', color: '#C5C1E0', lineHeight: 1.5 }}>
                Simulate what happens when a farmer misses the Day 40 Neem spray window by +48 hours. The system autonomously switches to an ICAR curative bio-agent, dispatches an urgent spot audit to the Agent, and escalates the Exporter's batch risk index by +4.2%.
              </p>
            </div>

            <button
              onClick={handleTriggerFallback}
              disabled={fallbackLoading}
              className="agro-btn-primary"
              style={{ width: '100%', fontSize: '12px', background: 'var(--coral-deep)' }}
            >
              <AlertTriangle size={16} />
              {fallbackLoading ? 'Executing Fallback State Machine...' : 'Simulate Missed Window (+48h)'}
            </button>

            {fallbackResponse && (
              <div style={{ background: 'rgba(255, 107, 91, 0.1)', border: '1px solid rgba(255, 107, 91, 0.3)', padding: '10px', borderRadius: '12px', fontSize: '11px' }}>
                <div style={{ color: '#FF6B5B', fontWeight: 800 }}>✓ Autonomous State Transition Executed!</div>
                <div style={{ color: '#EAE8F5', marginTop: '4px' }}>
                  • <strong>Farm Batch Risk:</strong> {fallbackResponse.new_batch_risk_index}% ({fallbackResponse.exporter_notification.delta})<br />
                  • <strong>Curative Action:</strong> {fallbackResponse.updated_activity?.title}<br />
                  • <strong>Agent Dispatch:</strong> {fallbackResponse.agent_dispatch.task}<br />
                  • <strong>Export Status:</strong> {fallbackResponse.exporter_notification.export_eligibility}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DYNAMIC SPLIT MARKET ENGINE */}
        {activeSubTab === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#3D9DF6', marginBottom: '4px' }}>
                REAL-TIME LOT PARTITIONING
              </div>
              <p style={{ fontSize: '12px', color: '#C5C1E0', lineHeight: 1.5 }}>
                Dynamically splits a heterogeneous harvest: Inner acreage meeting MRL export standards is routed to IndoGlobal Exports, while border furrows are diverted to Kisan Retail & Wholesale Mart.
              </p>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                <span>Export Ratio (Grade A Inner Plot):</span>
                <strong style={{ color: 'var(--indigo-light)' }}>{exportRatio}%</strong>
              </div>
              <input
                type="range"
                min="50"
                max="90"
                value={exportRatio}
                onChange={(e) => setExportRatio(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--indigo)' }}
              />
            </div>

            <button
              onClick={handleTriggerSplit}
              disabled={splitLoading}
              className="agro-btn-primary"
              style={{ width: '100%', fontSize: '12px', background: 'var(--indigo)' }}
            >
              <Zap size={16} />
              {splitLoading ? 'Partitioning Harvest...' : `Execute Split: ${Math.round(245 * (exportRatio/100))} Qtl Export / ${245 - Math.round(245 * (exportRatio/100))} Qtl Domestic`}
            </button>

            {splitResponse && (
              <div style={{ background: 'rgba(61, 157, 246, 0.1)', border: '1px solid rgba(61, 157, 246, 0.3)', padding: '10px', borderRadius: '12px', fontSize: '11px' }}>
                <div style={{ color: '#8FC7FF', fontWeight: 800 }}>✓ Harvest Lot Partitioned!</div>
                <div style={{ color: '#EAE8F5', marginTop: '4px' }}>
                  • <strong>Export Sub-Lot:</strong> {splitResponse.export_listing?.quantity} Qtl (Grade A &bull; IndoGlobal)<br />
                  • <strong>Domestic Sub-Lot:</strong> {splitResponse.domestic_listing?.quantity} Qtl (Grade B &bull; Kisan Mart)<br />
                  • <strong>Merkle Passport:</strong> <code>{splitResponse.merkle_passport_hash?.substring(0, 20)}...</code>
                </div>
              </div>
            )}
          </div>
        )}

        <button
          onClick={onClose}
          className="agro-btn-secondary"
          style={{ width: '100%', marginTop: '16px', background: 'rgba(255, 255, 255, 0.08)', color: '#FFFFFF', border: 'none', fontSize: '12px' }}
        >
          Close Simulator
        </button>
      </div>
    </div>
  );
}
