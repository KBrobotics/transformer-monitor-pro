import { useState, useEffect, useCallback, useRef } from 'react';
import { TransformerSignals, ConnectionStatus } from '@/types/transformer';

const WS_URL = 'ws://localhost:1880/transformer'; // Node-RED WebSocket endpoint
const REST_URL = 'http://localhost:1880/transformer'; // Fallback REST endpoint
const RECONNECT_DELAY = 5000;
const POLL_INTERVAL = 2000;

export function useTransformerData() {
  const [signals, setSignals] = useState<TransformerSignals>({});
  const [connection, setConnection] = useState<ConnectionStatus>({
    connected: false,
    lastUpdate: null,
    error: null,
  });
  
  const wsRef = useRef<WebSocket | null>(null);
  const pollIntervalRef = useRef<number | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);

  const updateSignals = useCallback((data: Partial<TransformerSignals>) => {
    setSignals(prev => ({ ...prev, ...data }));
    setConnection(prev => ({
      ...prev,
      connected: true,
      lastUpdate: new Date(),
      error: null,
    }));
  }, []);

  // WebSocket connection
  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[WS] Connected to Node-RED');
        setConnection(prev => ({ ...prev, connected: true, error: null }));
        
        // Stop polling if WebSocket connects
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          updateSignals(data);
        } catch (err) {
          console.error('[WS] Failed to parse message:', err);
        }
      };

      ws.onerror = (error) => {
        console.error('[WS] Error:', error);
        setConnection(prev => ({
          ...prev,
          connected: false,
          error: 'WebSocket error',
        }));
      };

      ws.onclose = () => {
        console.log('[WS] Connection closed');
        setConnection(prev => ({ ...prev, connected: false }));
        wsRef.current = null;
        
        // Start polling as fallback
        startPolling();
        
        // Schedule reconnection
        reconnectTimeoutRef.current = window.setTimeout(() => {
          connectWebSocket();
        }, RECONNECT_DELAY);
      };
    } catch (err) {
      console.error('[WS] Failed to connect:', err);
      startPolling();
    }
  }, [updateSignals]);

  // REST polling fallback
  const pollData = useCallback(async () => {
    try {
      const response = await fetch(REST_URL);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      updateSignals(data);
    } catch (err) {
      console.error('[REST] Poll failed:', err);
      setConnection(prev => ({
        ...prev,
        connected: false,
        error: 'Connection failed',
      }));
    }
  }, [updateSignals]);

  const startPolling = useCallback(() => {
    if (pollIntervalRef.current) return;
    console.log('[REST] Starting polling fallback');
    pollData(); // Initial poll
    pollIntervalRef.current = window.setInterval(pollData, POLL_INTERVAL);
  }, [pollData]);

  // Demo mode - simulate data for development
  const enableDemoMode = useCallback(() => {
    const demoInterval = setInterval(() => {
      const demoData: TransformerSignals = {
        "LV L1 Winding temperature": 75 + Math.random() * 30,
        "LV L3 Winding temperature": 70 + Math.random() * 35,
        "Temp alarm1": Math.random() > 0.8,
        "Temp alarm2": Math.random() > 0.9,
        "Transformer trip": false,
        "Transformer alarm": Math.random() > 0.85,
        "Cooling bank working": Math.random() > 0.1,
        "Cooling bank failure": Math.random() > 0.95,
      };
      updateSignals(demoData);
    }, 2000);

    return () => clearInterval(demoInterval);
  }, [updateSignals]);

  useEffect(() => {
    // Try WebSocket first, will fallback to polling
    connectWebSocket();

    // For demo purposes, enable demo mode immediately in development
    // In production, remove or adjust this timeout
    const demoTimeout = setTimeout(() => {
      console.log('[DEMO] Enabling demo mode for preview');
      const cleanup = enableDemoMode();
      return cleanup;
    }, 1000); // Reduced to 1 second for quicker demo activation

    return () => {
      clearTimeout(demoTimeout);
      if (wsRef.current) wsRef.current.close();
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, [connectWebSocket, enableDemoMode]);

  return { signals, connection };
}
