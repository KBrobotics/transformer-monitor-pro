// Signal names exactly as defined in Node-RED comments
export interface TransformerSignals {
  // Analog signals
  "LV L1 Winding temperature"?: number;
  "LV L3 Winding temperature"?: number;
  
  // Digital outputs (alarms)
  "Temp alarm1"?: boolean;
  "Temp alarm2"?: boolean;
  
  // Digital inputs
  "Transformer trip"?: boolean;
  "Transformer alarm"?: boolean;
  "Cooling bank working"?: boolean;
  "Cooling bank failure"?: boolean;
}

export type SignalStatus = 'normal' | 'warning' | 'alarm' | 'inactive';

export interface ConnectionStatus {
  connected: boolean;
  lastUpdate: Date | null;
  error: string | null;
}

// Temperature thresholds (°C)
export const TEMP_THRESHOLDS = {
  WARNING: 85,
  ALARM: 100,
} as const;
