import { cn } from '@/lib/utils';
import { TEMP_THRESHOLDS } from '@/types/transformer';

interface TransformerVisualizationProps {
  l1Temp?: number;
  l3Temp?: number;
  hasAlarm?: boolean;
  hasTrip?: boolean;
  className?: string;
}

export function TransformerVisualization({ 
  l1Temp, 
  l3Temp, 
  hasAlarm, 
  hasTrip,
  className 
}: TransformerVisualizationProps) {
  
  const getWindingColor = (temp?: number) => {
    if (temp === undefined || temp === null) return '#4b5563'; // gray
    if (temp >= TEMP_THRESHOLDS.ALARM) return '#ef4444'; // red
    if (temp >= TEMP_THRESHOLDS.WARNING) return '#f59e0b'; // amber
    return '#22c55e'; // green
  };

  const getGlowFilter = (temp?: number) => {
    if (temp === undefined || temp === null) return 'none';
    if (temp >= TEMP_THRESHOLDS.ALARM) return 'drop-shadow(0 0 8px #ef4444)';
    if (temp >= TEMP_THRESHOLDS.WARNING) return 'drop-shadow(0 0 6px #f59e0b)';
    return 'drop-shadow(0 0 4px #22c55e)';
  };

  const formatTemp = (temp?: number) => {
    if (temp === undefined || temp === null) return 'N/A';
    return `${temp.toFixed(1)}°C`;
  };

  return (
    <div className={cn("relative", className)}>
      <svg
        viewBox="0 0 300 400"
        className="w-full h-auto max-h-[400px]"
      >
        {/* Background panel */}
        <rect 
          x="10" y="10" 
          width="280" height="380" 
          rx="8" 
          fill="hsl(220 18% 11%)" 
          stroke="hsl(220 15% 25%)" 
          strokeWidth="2"
        />

        {/* Transformer core */}
        <rect 
          x="100" y="80" 
          width="100" height="240" 
          rx="4" 
          fill="hsl(220 15% 18%)" 
          stroke="hsl(220 15% 30%)" 
          strokeWidth="2"
        />

        {/* Core laminations */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <rect
            key={i}
            x="105"
            y={90 + i * 28}
            width="90"
            height="20"
            rx="2"
            fill="hsl(220 12% 22%)"
            stroke="hsl(220 15% 28%)"
            strokeWidth="1"
          />
        ))}

        {/* L1 Winding (left) */}
        <g style={{ filter: getGlowFilter(l1Temp) }}>
          <rect
            x="45"
            y="100"
            width="45"
            height="200"
            rx="6"
            fill={getWindingColor(l1Temp)}
            opacity="0.8"
            className="transition-all duration-500"
          />
          {/* Winding lines */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <line
              key={`l1-${i}`}
              x1="50"
              y1={110 + i * 18}
              x2="85"
              y2={110 + i * 18}
              stroke="hsl(220 15% 15%)"
              strokeWidth="2"
              opacity="0.5"
            />
          ))}
        </g>

        {/* L3 Winding (right) */}
        <g style={{ filter: getGlowFilter(l3Temp) }}>
          <rect
            x="210"
            y="100"
            width="45"
            height="200"
            rx="6"
            fill={getWindingColor(l3Temp)}
            opacity="0.8"
            className="transition-all duration-500"
          />
          {/* Winding lines */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <line
              key={`l3-${i}`}
              x1="215"
              y1={110 + i * 18}
              x2="250"
              y2={110 + i * 18}
              stroke="hsl(220 15% 15%)"
              strokeWidth="2"
              opacity="0.5"
            />
          ))}
        </g>

        {/* Temperature labels */}
        <text
          x="67"
          y="320"
          textAnchor="middle"
          className="fill-foreground text-xs font-bold"
          style={{ fontFamily: 'IBM Plex Mono' }}
        >
          L1
        </text>
        <text
          x="67"
          y="338"
          textAnchor="middle"
          className="text-[11px] font-mono"
          style={{ fontFamily: 'IBM Plex Mono' }}
          fill={getWindingColor(l1Temp)}
        >
          {formatTemp(l1Temp)}
        </text>

        <text
          x="233"
          y="320"
          textAnchor="middle"
          className="fill-foreground text-xs font-bold"
          style={{ fontFamily: 'IBM Plex Mono' }}
        >
          L3
        </text>
        <text
          x="233"
          y="338"
          textAnchor="middle"
          className="text-[11px] font-mono"
          style={{ fontFamily: 'IBM Plex Mono' }}
          fill={getWindingColor(l3Temp)}
        >
          {formatTemp(l3Temp)}
        </text>

        {/* Connection terminals (top) */}
        <circle cx="67" cy="70" r="8" fill="hsl(220 15% 30%)" stroke="hsl(220 15% 40%)" strokeWidth="2" />
        <circle cx="150" cy="70" r="8" fill="hsl(220 15% 30%)" stroke="hsl(220 15% 40%)" strokeWidth="2" />
        <circle cx="233" cy="70" r="8" fill="hsl(220 15% 30%)" stroke="hsl(220 15% 40%)" strokeWidth="2" />

        {/* Title */}
        <text
          x="150"
          y="375"
          textAnchor="middle"
          className="fill-muted-foreground text-xs uppercase tracking-widest"
          style={{ fontFamily: 'IBM Plex Mono' }}
        >
          Dry-Type Transformer
        </text>

        {/* Status indicators */}
        {hasTrip && (
          <g>
            <circle cx="150" cy="200" r="25" fill="#ef4444" opacity="0.3">
              <animate attributeName="opacity" values="0.3;0.6;0.3" dur="0.8s" repeatCount="indefinite" />
            </circle>
            <text
              x="150"
              y="205"
              textAnchor="middle"
              fill="#ef4444"
              className="text-xs font-bold uppercase"
              style={{ fontFamily: 'IBM Plex Mono' }}
            >
              TRIP
            </text>
          </g>
        )}

        {hasAlarm && !hasTrip && (
          <g>
            <circle cx="150" cy="200" r="20" fill="#f59e0b" opacity="0.3">
              <animate attributeName="opacity" values="0.3;0.5;0.3" dur="1.2s" repeatCount="indefinite" />
            </circle>
            <text
              x="150"
              y="205"
              textAnchor="middle"
              fill="#f59e0b"
              className="text-xs font-bold uppercase"
              style={{ fontFamily: 'IBM Plex Mono' }}
            >
              ALARM
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
