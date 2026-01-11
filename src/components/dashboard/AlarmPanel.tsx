import { LEDIndicator } from './LEDIndicator';
import { TransformerSignals } from '@/types/transformer';
import { cn } from '@/lib/utils';

interface AlarmPanelProps {
  signals: TransformerSignals;
  className?: string;
}

export function AlarmPanel({ signals, className }: AlarmPanelProps) {
  return (
    <div className={cn("industrial-panel p-4 space-y-4", className)}>
      <div className="text-xs text-muted-foreground uppercase tracking-wider border-b border-border pb-2">
        Alarm Status
      </div>
      
      <div className="space-y-3">
        <LEDIndicator
          label="Temp Alarm 1"
          value={signals["Temp alarm1"]}
          status={signals["Temp alarm1"] ? "warning" : "normal"}
        />
        
        <LEDIndicator
          label="Temp Alarm 2"
          value={signals["Temp alarm2"]}
          status={signals["Temp alarm2"] ? "alarm" : "normal"}
        />
        
        <div className="border-t border-border pt-3 mt-3">
          <LEDIndicator
            label="Transformer Alarm"
            value={signals["Transformer alarm"]}
            status={signals["Transformer alarm"] ? "warning" : "normal"}
          />
        </div>
        
        <LEDIndicator
          label="Transformer Trip"
          value={signals["Transformer trip"]}
          status={signals["Transformer trip"] ? "alarm" : "normal"}
        />
      </div>
    </div>
  );
}
