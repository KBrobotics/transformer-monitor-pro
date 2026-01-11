import { cn } from '@/lib/utils';
import { ConnectionStatus } from '@/types/transformer';

interface ConnectionIndicatorProps {
  connection: ConnectionStatus;
  className?: string;
}

export function ConnectionIndicator({ connection, className }: ConnectionIndicatorProps) {
  const formatTime = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className={cn("flex items-center gap-3 text-xs", className)}>
      <div className={cn(
        "led-indicator w-2 h-2",
        connection.connected ? "led-green" : "led-red"
      )} />
      
      <span className={cn(
        connection.connected ? "text-green-400" : "text-red-400"
      )}>
        {connection.connected ? 'CONNECTED' : 'DISCONNECTED'}
      </span>
      
      <span className="text-muted-foreground">
        Last update: {formatTime(connection.lastUpdate)}
      </span>
      
      {connection.error && (
        <span className="text-red-400">
          ({connection.error})
        </span>
      )}
    </div>
  );
}
