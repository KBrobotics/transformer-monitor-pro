# Transformer Monitoring Dashboard

Industrial web dashboard for dry-type transformer monitoring with real-time signal visualization.

## Features

- **Real-time monitoring** via WebSocket or REST API from Node-RED
- **SVG transformer visualization** with temperature-based color coding
- **LED-style alarm indicators** with pulse animations
- **Graceful handling** of missing signals (displays "N/A")
- **Dark industrial theme** optimized for control room environments
- **Responsive design** for HMI panels and tablets

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   PLC / RTU     │────▶│    Node-RED     │────▶│    Dashboard    │
│   (Signals)     │     │   (Port 1880)   │     │   (Port 3000)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                              │                        │
                              │    WebSocket/REST      │
                              └────────────────────────┘
```

## Signal Names (API Contract)

The dashboard expects JSON data with these exact field names:

### Analog Signals
| Signal Name | Type | Unit | Description |
|-------------|------|------|-------------|
| `LV L1 Winding temperature` | number | °C | Low voltage L1 winding temperature |
| `LV L3 Winding temperature` | number | °C | Low voltage L3 winding temperature |

### Digital Outputs (Alarms)
| Signal Name | Type | Description |
|-------------|------|-------------|
| `Temp alarm1` | boolean | Temperature alarm level 1 |
| `Temp alarm2` | boolean | Temperature alarm level 2 |

### Digital Inputs
| Signal Name | Type | Description |
|-------------|------|-------------|
| `Transformer trip` | boolean | Transformer trip status |
| `Transformer alarm` | boolean | General transformer alarm |
| `Cooling bank working` | boolean | Cooling system operational |
| `Cooling bank failure` | boolean | Cooling system failure |

### Example JSON Payload
```json
{
  "LV L1 Winding temperature": 87.5,
  "LV L3 Winding temperature": 82.3,
  "Temp alarm1": false,
  "Temp alarm2": false,
  "Transformer trip": false,
  "Transformer alarm": false,
  "Cooling bank working": true,
  "Cooling bank failure": false
}
```

**Note:** All signals are optional. Missing signals display as "N/A".

## Deployment

### Option 1: Docker Compose (Recommended)

```bash
# Clone repository
git clone https://github.com/your-org/transformer-dashboard.git
cd transformer-dashboard

# Build and run
docker-compose up -d

# View logs
docker-compose logs -f
```

### Option 2: Portainer Stack

1. Open Portainer → Stacks → Add Stack
2. Name: `transformer-dashboard`
3. Paste contents of `docker-compose.yml`
4. Deploy

### Option 3: Manual Docker

```bash
# Build image
docker build -t transformer-dashboard .

# Run container
docker run -d \
  --name transformer-dashboard \
  -p 3000:3000 \
  --restart unless-stopped \
  transformer-dashboard
```

## Node-RED Configuration

### WebSocket Output (Recommended)

1. Add a **websocket out** node
2. Configure:
   - Type: `Listen on`
   - Path: `/transformer`
   - Send/Receive: `payload`

3. Connect your signal processing to the websocket node:

```
[Function Node] ──▶ [WebSocket Out: /transformer]
```

Example function node code:
```javascript
msg.payload = {
    "LV L1 Winding temperature": msg.payload.temp_l1,
    "LV L3 Winding temperature": msg.payload.temp_l3,
    "Temp alarm1": msg.payload.alarm1,
    "Temp alarm2": msg.payload.alarm2,
    "Transformer trip": msg.payload.trip,
    "Transformer alarm": msg.payload.alarm,
    "Cooling bank working": msg.payload.cooling_ok,
    "Cooling bank failure": msg.payload.cooling_fail
};
return msg;
```

### REST API (Fallback)

1. Add an **http in** node:
   - Method: `GET`
   - URL: `/transformer`

2. Add an **http response** node

3. Store latest values and return on request:

```
[http in: GET /transformer] ──▶ [Function: Get Latest] ──▶ [http response]
```

## Temperature Thresholds

| Status | Temperature Range | Color |
|--------|-------------------|-------|
| Normal | < 85°C | Green |
| Warning | 85°C - 99°C | Yellow |
| Alarm | ≥ 100°C | Red |

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Configuration

Edit `src/hooks/useTransformerData.ts` to change endpoints:

```typescript
const WS_URL = 'ws://localhost:1880/transformer';  // WebSocket endpoint
const REST_URL = 'http://localhost:1880/transformer';  // REST fallback
const RECONNECT_DELAY = 5000;  // Reconnection delay (ms)
const POLL_INTERVAL = 2000;  // REST polling interval (ms)
```

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS with custom industrial theme
- IBM Plex Mono font
- shadcn/ui components

## License

MIT
