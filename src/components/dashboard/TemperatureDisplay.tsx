import { cn } from '@/lib/utils';
import { TEMP_THRESHOLDS } from '@/types/transformer';

interface TemperatureDisplayProps {
  label: string;
  value?: number;
  unit?: string;
  className?: string;
}

export function TemperatureDisplay({ label, value, unit = '°C', className }: TemperatureDisplayProps) {
  const getStatusClass = () => {
    if (value === undefined || value === null) return 'status-text-inactive';
    if (value >= TEMP_THRESHOLDS.ALARM) return 'status-text-alarm';
    if (value >= TEMP_THRESHOLDS.WARNING) return 'status-text-warning';
    return 'status-text-normal';
  };

  const getBarWidth = () => {
    if (value === undefined || value === null) return 0;
    // Scale: 0-150°C
    return Math.min(100, (value / 150) * 100);
  };

  const getBarColor = () => {
    if (value === undefined || value === null) return 'bg-muted';
    if (value >= TEMP_THRESHOLDS.ALARM) return 'bg-red-500';
    if (value >= TEMP_THRESHOLDS.WARNING) return 'bg-amber-500';
    return 'bg-green-500';
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        <span className={cn("text-xl font-bold tabular-nums", getStatusClass())}>
          {value !== undefined && value !== null 
            ? `${value.toFixed(1)}${unit}`
            : 'N/A'
          }
        </span>
      </div>
      
      {/* Temperature bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-500", getBarColor())}
          style={{ width: `${getBarWidth()}%` }}
        />
      </div>
      
      {/* Scale markers */}
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>0</span>
        <span className="text-amber-500/60">85</span>
        <span className="text-red-500/60">100</span>
        <span>150</span>
      </div>
    </div>
  );
}
