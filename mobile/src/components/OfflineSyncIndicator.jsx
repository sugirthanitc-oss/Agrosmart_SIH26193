import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { offlineService } from '../services/offlineSync.js';

export function OfflineSyncIndicator({ isOffline, setIsOffline, token }) {
  const [queueCount, setQueueCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  useEffect(() => {
    const checkQueue = () => {
      setQueueCount(offlineService.getQueue().length);
    };
    checkQueue();
    const interval = setInterval(checkQueue, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSyncNow = async () => {
    setSyncing(true);
    const res = await offlineService.syncQueueWithServer(token);
    setSyncing(false);
    setQueueCount(offlineService.getQueue().length);
    if (res.success && res.count > 0) {
      setSyncMessage(`✓ Synced ${res.count} actions!`);
      setTimeout(() => setSyncMessage(''), 3500);
    }
  };

  return (
    <div
      style={{
        background: isOffline ? '#FFF1F0' : 'rgba(60, 34, 184, 0.08)',
        borderBottom: isOffline ? '1px solid #FFCCC7' : '1px solid rgba(79, 49, 214, 0.15)',
        padding: '6px 14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '11px',
        fontWeight: 700
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {isOffline ? <WifiOff size={14} color="var(--coral-deep)" /> : <Wifi size={14} color="var(--indigo)" />}
        <span style={{ color: isOffline ? 'var(--coral-deep)' : 'var(--indigo)' }}>
          {isOffline ? 'RURAL OFFLINE MODE (Local Queue Active)' : 'NETWORK ONLINE'}
        </span>
        {queueCount > 0 && (
          <span style={{ background: 'var(--coral)', color: '#FFFFFF', padding: '2px 6px', borderRadius: '10px', fontSize: '10px' }}>
            {queueCount} Queued
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          onClick={() => setIsOffline(!isOffline)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '10px',
            color: 'var(--slate)',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          {isOffline ? 'Go Online' : 'Simulate Rural Drop'}
        </button>

        {!isOffline && queueCount > 0 && (
          <button
            onClick={handleSyncNow}
            disabled={syncing}
            style={{
              background: 'var(--indigo)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '3px 8px',
              fontSize: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <RefreshCw size={10} className={syncing ? 'animate-spin' : ''} />
            Sync Now
          </button>
        )}
      </div>
    </div>
  );
}
