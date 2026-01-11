import { cn } from '@/lib/utils';

interface CoolingStatusProps {
  working?: boolean;
  failure?: boolean;
  className?: string;
}

export function CoolingStatus({ working, failure, className }: CoolingStatusProps) {
  const isWorking = working === true && failure !== true;
  const isFailed = failure === true;
  const isUnknown = working === undefined && failure === undefined;

  const getStatusColor = () => {
    if (isUnknown) return 'text-muted-foreground';
    if (isFailed) return 'text-red-500';
    if (isWorking) return 'text-green-500';
    return 'text-amber-500';
  };

  const getStatusText = () => {
    if (isUnknown) return 'N/A';
    if (isFailed) return 'FAILURE';
    if (isWorking) return 'RUNNING';
    return 'STOPPED';
  };

  return (
    <div className={cn("industrial-panel p-4", className)}>
      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
        Cooling System
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Fan SVG */}
          <svg
            viewBox="0 0 24 24"
            className={cn(
              "w-10 h-10 transition-all",
              getStatusColor(),
              isWorking && "fan-spinning",
              isFailed && "opacity-50"
            )}
            fill="currentColor"
          >
            <path d="M12 11C13.1046 11 14 11.8954 14 13C14 14.1046 13.1046 15 12 15C10.8954 15 10 14.1046 10 13C10 11.8954 10.8954 11 12 11Z" />
            <path d="M12 2C12 2 12 6 12 8C14 8 17 5 17 5C17 5 15 9 15 11C17 11 21 10 21 10C21 10 18 13 16 13C16 15 19 19 19 19C19 19 14 16 12 16C12 18 12 22 12 22C12 22 12 18 12 16C10 16 5 19 5 19C5 19 8 15 8 13C6 13 3 10 3 10C3 10 7 11 9 11C9 9 7 5 7 5C7 5 10 8 12 8C12 6 12 2 12 2Z" />
          </svg>
          
          <div>
            <div className={cn("text-lg font-bold", getStatusColor())}>
              {getStatusText()}
            </div>
            <div className="text-xs text-muted-foreground">
              Cooling Bank
            </div>
          </div>
        </div>
        
        {/* Status indicator */}
        <div className={cn(
          "led-indicator",
          isUnknown && "led-inactive",
          isFailed && "led-red",
          isWorking && "led-green",
          !isWorking && !isFailed && !isUnknown && "led-yellow"
        )} />
      </div>
    </div>
  );
}
