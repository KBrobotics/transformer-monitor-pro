import { cn } from '@/lib/utils';
import { SignalStatus } from '@/types/transformer';

interface LEDIndicatorProps {
  label: string;
  status: SignalStatus;
  value?: boolean | null;
  className?: string;
}

export function LEDIndicator({ label, status, value, className }: LEDIndicatorProps) {
  const getLEDClass = () => {
    if (value === undefined || value === null) return 'led-inactive';
    if (!value) return 'led-inactive';
    
    switch (status) {
      case 'alarm':
        return 'led-red';
      case 'warning':
        return 'led-yellow';
      case 'normal':
        return 'led-green';
      default:
        return 'led-inactive';
    }
  };

  const getTextClass = () => {
    if (value === undefined || value === null) return 'status-text-inactive';
    if (!value) return 'status-text-inactive';
    
    switch (status) {
      case 'alarm':
        return 'status-text-alarm';
      case 'warning':
        return 'status-text-warning';
      case 'normal':
        return 'status-text-normal';
      default:
        return 'status-text-inactive';
    }
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn("led-indicator", getLEDClass())} />
      <span className={cn("text-sm font-medium", getTextClass())}>
        {label}
      </span>
      <span className="text-xs text-muted-foreground ml-auto">
        {value === undefined || value === null ? 'N/A' : value ? 'ACTIVE' : 'OK'}
      </span>
    </div>
  );
}
