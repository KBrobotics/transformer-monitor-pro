import { useTransformerData } from '@/hooks/useTransformerData';
import { TransformerVisualization } from '@/components/dashboard/TransformerVisualization';
import { TemperatureDisplay } from '@/components/dashboard/TemperatureDisplay';
import { AlarmPanel } from '@/components/dashboard/AlarmPanel';
import { CoolingStatus } from '@/components/dashboard/CoolingStatus';
import { ConnectionIndicator } from '@/components/dashboard/ConnectionIndicator';

const Index = () => {
  const { signals, connection } = useTransformerData();

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      {/* Header */}
      <header className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Transformer Monitor
            </h1>
            <p className="text-sm text-muted-foreground">
              Dry-Type Transformer — Real-time Monitoring
            </p>
          </div>
          
          <ConnectionIndicator connection={connection} />
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        
        {/* Left Column - Visualization */}
        <div className="lg:col-span-5">
          <div className="industrial-panel p-4 md:p-6">
            <TransformerVisualization
              l1Temp={signals["LV L1 Winding temperature"]}
              l3Temp={signals["LV L3 Winding temperature"]}
              hasAlarm={signals["Transformer alarm"] || signals["Temp alarm1"] || signals["Temp alarm2"]}
              hasTrip={signals["Transformer trip"]}
            />
          </div>
        </div>

        {/* Right Column - Data Panels */}
        <div className="lg:col-span-7 space-y-4 md:space-y-6">
          
          {/* Temperature Readings */}
          <div className="industrial-panel p-4 md:p-6">
            <div className="text-xs text-muted-foreground uppercase tracking-wider border-b border-border pb-2 mb-4">
              Winding Temperatures
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TemperatureDisplay
                label="LV L1 Winding"
                value={signals["LV L1 Winding temperature"]}
              />
              <TemperatureDisplay
                label="LV L3 Winding"
                value={signals["LV L3 Winding temperature"]}
              />
            </div>
          </div>

          {/* Alarms and Cooling Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <AlarmPanel signals={signals} />
            <CoolingStatus
              working={signals["Cooling bank working"]}
              failure={signals["Cooling bank failure"]}
            />
          </div>

          {/* Raw Data Panel (for debugging) */}
          <details className="industrial-panel">
            <summary className="p-4 cursor-pointer text-xs text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
              Raw Signal Data
            </summary>
            <div className="p-4 pt-0">
              <pre className="text-xs text-muted-foreground overflow-auto">
                {JSON.stringify(signals, null, 2) || '{}'}
              </pre>
            </div>
          </details>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 pt-4 border-t border-border text-center text-xs text-muted-foreground">
        Industrial Transformer Monitoring Dashboard — SCADA Interface
      </footer>
    </div>
  );
};

export default Index;
