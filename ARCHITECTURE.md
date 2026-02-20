# AETHERIS Trading Copilot OS — Architecture & Tech Stack

**Version:** 1.0  
**Status:** ✅ Final Architecture Defined  
**Date:** 2026-02-20  
**Solo Developer:** Yes (optimized for individual productivity)

---

## Executive Summary

AETHERIS uses a **modern JavaScript-first stack** with **managed cloud infrastructure**:

- **Frontend:** React 18.3 + Vite 5.4 (TypeScript)
- **Backend:** Node.js 22 LTS + Express 4.21 (TypeScript)
- **Database:** Supabase (managed PostgreSQL 14.13 + Auth + Real-time)
- **State:** Zustand 4.5 (minimal, lightweight)
- **Async Jobs:** BullMQ 5.18 (optional Phase 1, needed Phase 2+)
- **Styling:** Tailwind CSS 3.4 + Heroicons SVG sprite (41 icons)
- **Testing:** Jest 29.7 + React Testing Library 14.2
- **CI/CD:** GitHub Actions

**Why This Stack:**
- ✅ Unified JavaScript (backend + frontend = minimal context switching)
- ✅ Zero database ops (Supabase managed = backups, scaling, auth automatic)
- ✅ DX-first (Vite hot reload, ts-node-dev, instant feedback)
- ✅ Type-safe (TypeScript strict mode everywhere)
- ✅ Real-time ready (Supabase Realtime subscriptions < 2s latency)
- ✅ Free MVP (Supabase free tier covers Phase 1)

---

## Part 1: Frontend Architecture

### Core Stack

| Component | Version | Purpose |
|-----------|---------|---------|
| **Vite** | 5.4+ | Build tool (esbuild, 14x faster than Webpack) |
| **React** | 18.3+ | UI framework |
| **TypeScript** | 5.7 | Type safety |
| **Tailwind CSS** | 3.4+ | Utility-first styling |
| **Heroicons** | 2.1+ | 41-icon SVG sprite (4 categories: sidebar, KPI, actions, armor) |
| **React Router** | 6.28+ | Client-side routing |
| **Zustand** | 4.5+ | Lightweight state management (2KB) |

### Key Libraries

```json
{
  "devDependencies": {
    "vite": "^5.4",
    "react": "^18.3",
    "react-dom": "^18.3",
    "typescript": "^5.7",
    "@types/react": "^18.3",
    "tailwindcss": "^3.4",
    "postcss": "^8.4",
    "@tailwindcss/forms": "latest",
    "eslint": "^8.57",
    "prettier": "^3.2",
    "@testing-library/react": "^14.2",
    "@testing-library/jest-dom": "^6.4",
    "jest": "^29.7",
    "vitest": "^1.6"
  },
  "dependencies": {
    "react-router-dom": "^6.28",
    "zustand": "^4.5",
    "@supabase/supabase-js": "^2.50",
    "axios": "^1.7.7",
    "socket.io-client": "^4.8",
    "recharts": "^2.13",
    "date-fns": "^3.6",
    "numeral": "^2.0.6",
    "clsx": "^2.1.1",
    "heroicons": "^2.1"
  }
}
```

### Component Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Sidebar/               # 9 nav icons (sidebar-dashboard, sidebar-journal, etc.)
│   │   ├── KPICards/              # 10 KPI cards (icon + metric + trend + benchmark)
│   │   ├── Heatmap/               # 7×5 calendar grid (gradient: emerald-crimson)
│   │   ├── RiskAggregation/       # Multi-account consolidated view
│   │   ├── AlertCenter/           # Armor breach alerts (Level 1-3)
│   │   ├── Auth/                  # Login, 2FA TOTP input
│   │   └── Dashboard/             # Main layout
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Analytics.tsx
│   │   ├── AetherFlow.tsx
│   │   ├── AetherArmor.tsx
│   │   ├── Settings.tsx
│   │   └── NotFound.tsx
│   ├── hooks/
│   │   ├── useSupabase.ts         # Supabase SDK wrapper
│   │   ├── useAuth.ts              # Auth state + JWT
│   │   ├── useRealtimeSubscription.ts  # DB real-time subscriptions
│   │   └── useMetrics.ts           # Fetch + cache metrics
│   ├── store/
│   │   └── appState.ts            # Zustand global state
│   ├── types/
│   │   └── supabase.ts            # Auto-generated from Supabase schema
│   ├── utils/
│   │   ├── formatters.ts          # numeral, date-fns helpers
│   │   ├── colors.ts              # AETHERIS palette tokens
│   │   └── icons.ts               # Heroicons SVG sprite usage
│   ├── App.tsx
│   └── main.tsx
├── public/
│   ├── icons.svg                  # Heroicons sprite (41 icons)
│   └── favicon.ico
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

### State Management (Zustand)

```typescript
// store/appState.ts
import create from 'zustand';

interface AppState {
  user: any | null;
  selectedAccount: string | null;
  dateRange: { start: Date; end: Date };
  metrics: MetricsCache;
  realtimeMetrics: boolean;

  setUser: (user: any) => void;
  setSelectedAccount: (accountId: string) => void;
  setDateRange: (start: Date, end: Date) => void;
  updateMetrics: (metrics: MetricsCache) => void;
  toggleRealtime: () => void;
}

export const useAppState = create<AppState>((set) => ({
  // state + actions
}));
```

**Why Zustand:**
- 2KB bundle size (vs Redux ~40KB)
- No boilerplate
- Supports real-time subscription updates
- Perfect for solo dev

### Styling (Tailwind + AETHERIS Palette)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'aetheris-gold': '#C9A050',
        'aetheris-night': '#0A1321',
        'aetheris-navy': '#193452',
        'aetheris-steel': '#2F6792',
        'aetheris-emerald': '#0E765E',
        'aetheris-crimson': '#AF2D2D',
        'aetheris-slate': '#B8C1CC',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
```

### Icon System (Heroicons SVG Sprite)

**41 Icons in 4 Categories:**
- **Sidebar (9):** dashboard, journal, analytics, aether-flow, aether-armor, oracle, galaxie-3d, tax-engine, settings
- **KPI (10):** winrate, profit-factor, expectancy, drawdown, sharpe, trades, r-multiple, duration, pnl, mfe-mae
- **Actions (10):** add-trade, import, export, sync, filter, search, share, record, delete, edit
- **Armor (12):** shield-ok, shield-alert, bell, bell-snooze, fire, lock, webhook, cooling, revenge, whale, check, warning

**Usage:**
```tsx
<svg width="24" height="24" style={{ color: '#C9A050' }}>
  <use href="#sidebar-dashboard"></use>
</svg>
```

---

## Part 2: Backend Architecture

### Core Stack

| Component | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | 22 LTS | Runtime |
| **Express** | 4.21+ | Web framework |
| **TypeScript** | 5.7 | Type safety |
| **@supabase/supabase-js** | 2.50+ | Database + Auth client |
| **Prisma** | 5.22+ | ORM (optional, can skip if using supabase-js only) |
| **BullMQ** | 5.18+ | Job queue (for broker sync async) |
| **Zod** | 3.24+ | Runtime validation |

### Key Libraries

```json
{
  "devDependencies": {
    "typescript": "^5.7",
    "@types/node": "^20",
    "@types/express": "^4.17",
    "ts-node-dev": "^2.0.0",
    "nodemon": "^3.1.2",
    "eslint": "^8.57",
    "prettier": "^3.2",
    "@typescript-eslint/parser": "^7.4",
    "@typescript-eslint/eslint-plugin": "^7.4",
    "jest": "^29.7",
    "supertest": "^6.3.4"
  },
  "dependencies": {
    "express": "^4.21",
    "cors": "^2.8.5",
    "helmet": "^7.2",
    "morgan": "^1.10.0",
    "compression": "^1.7.4",
    "@supabase/supabase-js": "^2.50",
    "prisma": "^5.22",
    "@prisma/client": "^5.22",
    "bullmq": "^5.18",
    "redis": "^4.7",
    "axios": "^1.7.7",
    "zod": "^3.24",
    "dotenv": "^16.4.5",
    "pino": "^8.21",
    "socket.io": "^4.8"
  }
}
```

### Directory Structure

```
backend/
├── src/
│   ├── api/
│   │   ├── routes/
│   │   │   ├── trades.ts          # POST/GET/PUT /api/v1/trades
│   │   │   ├── brokers.ts         # POST /api/v1/brokers/sync
│   │   │   ├── metrics.ts         # GET /api/v1/metrics/:accountId
│   │   │   ├── auth.ts            # POST /api/v1/auth/login, /refresh
│   │   │   └── alerts.ts          # GET /api/v1/alerts (WebSocket upgrade)
│   │   ├── middleware/
│   │   │   ├── auth.ts            # JWT verification
│   │   │   ├── errorHandler.ts
│   │   │   └── logger.ts
│   │   └── index.ts               # Express app setup
│   ├── services/
│   │   ├── BrokerSyncService.ts       # 900+ broker integrations
│   │   ├── MetricsEngine.ts           # KPI calculations
│   │   ├── ArmorService.ts            # Breach detection
│   │   ├── RealtimeService.ts         # Supabase Realtime subscriptions
│   │   └── AuthService.ts            # Supabase Auth wrapper
│   ├── brokers/
│   │   ├── IBrokerConnector.ts        # Abstract interface
│   │   ├── MT4Connector.ts
│   │   ├── FIXConnector.ts
│   │   ├── RESTConnector.ts
│   │   └── MockConnector.ts           # Testing
│   ├── jobs/
│   │   ├── broker-sync.job.ts         # BullMQ job: pull trades
│   │   ├── email-notification.job.ts
│   │   ├── webhook-retry.job.ts
│   │   └── metrics-snapshot.job.ts    # Pre-compute daily KPIs
│   ├── types/
│   │   ├── index.ts                   # Custom types
│   │   └── supabase.ts                # Auto-generated from Supabase
│   ├── utils/
│   │   ├── logger.ts                  # Pino structured logging
│   │   ├── validators.ts              # Zod schemas
│   │   └── errors.ts
│   ├── config/
│   │   └── environment.ts
│   └── index.ts                       # App entry point
├── prisma/
│   ├── schema.prisma                  # Database schema (optional if using supabase-js only)
│   └── migrations/                    # Managed by Supabase, pull as needed
├── tests/
│   ├── unit/
│   │   ├── MetricsEngine.test.ts
│   │   ├── BrokerConnectors.test.ts
│   │   └── Validators.test.ts
│   ├── integration/
│   │   ├── api.test.ts                # Supertest
│   │   └── supabase.test.ts
│   └── fixtures/
│       └── brokerResponses.ts
├── tsconfig.json
├── jest.config.js
└── package.json
```

### API Endpoints (RESTful)

```
POST   /api/v1/auth/login              # Email + password
POST   /api/v1/auth/refresh            # Refresh JWT token
POST   /api/v1/auth/logout             # Logout
GET    /api/v1/auth/me                 # Current user

POST   /api/v1/trades                  # Add manual trade
GET    /api/v1/trades?accountId=X      # Get trades filtered
PUT    /api/v1/trades/:tradeId         # Edit trade
DELETE /api/v1/trades/:tradeId

POST   /api/v1/brokers/sync/:accountId # Trigger broker sync (async job)
GET    /api/v1/brokers/sync/:jobId     # Check sync status

GET    /api/v1/metrics/:accountId      # KPI dashboard metrics
GET    /api/v1/metrics/:accountId/:date # Historical metrics

GET    /api/v1/accounts                # List accounts
POST   /api/v1/accounts                # Create account
PUT    /api/v1/accounts/:accountId     # Update account

GET    /api/v1/alerts                  # List recent Armor alerts
POST   /api/v1/alerts/:alertId/dismiss # Dismiss alert
POST   /api/v1/alerts/:alertId/webhook # Trigger webhook (Armor Level 3)

WS     /ws/realtime/:accountId         # WebSocket for real-time updates (optional)
```

### Broker Connector Pattern

```typescript
// services/brokers/IBrokerConnector.ts
interface IBrokerConnector {
  authenticate(credentials: BrokerCredentials): Promise<void>;
  fetchTrades(accountId: string, since?: Date): Promise<Trade[]>;
  fetchBalance(): Promise<{equity: number; availableMargin: number}>;
  parseCSV(buffer: Buffer): Promise<Trade[]>;
  validate(): Promise<boolean>;
}

// Implementations: MT4Connector, FIXConnector, RESTConnector
// Deduplication via broker_trade_id UNIQUE index
// Retry logic: exponential backoff (1s → 2s → 4s → fail)
```

### Metrics Engine

```typescript
// services/MetricsEngine.ts
class MetricsEngine {
  // Input: Trade[] + Account state
  // Output: 200+ KPIs across 5 categories

  calculate(trades: Trade[], account: Account): MetricsSnapshot {
    return {
      // Execution metrics
      winRate: winrate%,
      profitFactor: grossProfit / grossLoss,
      expectancy: (winRate × avgWin) - (lossRate × avgLoss),
      
      // Risk metrics
      maxDrawdown: maxDD%,
      sharpeRatio: (avgReturn - riskFreeRate) / stdDev,
      sortino: (avgReturn - riskFreeRate) / downside stdDev,
      
      // Robustness
      rMultiple: netProfit / riskPerTrade,
      kelly: (winRate × avgWinSize - lossRate × avgLossSize) / avgWinSize,
      
      // Temporal
      avgDuration: ms,
      mfeMAE: maxFavorableExcursion / maxAdverseExcursion,
      
      // ... 180+ more KPIs
    };
  }
}
```

### Real-time Flow (Supabase Realtime)

```typescript
// services/RealtimeService.ts
class RealtimeService {
  // Subscribe to database changes
  subscribeToTrades(accountId: string, callback: (trade: Trade) => void) {
    const subscription = supabase
      .from(`trades:account_id=eq.${accountId}`)
      .on('*', (payload) => callback(payload.new))
      .subscribe();
  }

  // Publish Armor breach events
  publishArmorBreach(userId: string, level: 1 | 2 | 3) {
    supabase.from('armor_breaches').insert({
      user_id: userId,
      level,
      created_at: new Date(),
    });
    // Subscribers auto-notified < 2s via WebSocket
  }
}
```

---

## Part 3: Database Architecture (Supabase)

### Overview

**Supabase = Managed PostgreSQL 14.13 + Auth + Real-time (BaaS)**

Benefits:
- ✅ Zero ops (backups, scaling, updates automatic)
- ✅ Auth built-in (JWT, 2FA TOTP, OAuth2 ready)
- ✅ Real-time subscriptions (WebSocket < 2s)
- ✅ Storage (S3-compatible for audio files)
- ✅ REST API auto-generated
- ✅ Row-Level Security (RLS) native
- ✅ Free tier: 500MB storage, 2GB bandwidth (covers Phase 1)

### 15-Table Schema

```sql
-- Authentication (Supabase managed)
TABLE users {
  id UUID (primary key, auto-generated)
  email VARCHAR UNIQUE
  encrypted_password (managed by Supabase Auth)
  first_name VARCHAR
  last_name VARCHAR
  kyc_status ENUM ('pending', 'verified', 'rejected')
  aml_status ENUM ('passed', 'review', 'rejected')
  created_at TIMESTAMP
  updated_at TIMESTAMP
  RLS: SELECT/UPDATE/DELETE on own row only
}

-- Trading Accounts
TABLE accounts {
  id UUID
  user_id UUID FOREIGN KEY → users(id)
  account_name VARCHAR
  account_type ENUM ('personal', 'prop_firm', 'crypto')
  broker VARCHAR
  broker_account_id VARCHAR
  account_status ENUM ('active', 'suspended', 'closed')
  risk_limit DECIMAL (max daily loss $)
  max_drawdown_limit DECIMAL (5% for prop firms)
  trailing_dd_limit DECIMAL (10% for prop firms)
  created_at TIMESTAMP
  RLS: SELECT/UPDATE on own rows only
}

-- Broker Connection (encrypted)
TABLE broker_connections {
  id UUID
  account_id UUID FOREIGN KEY → accounts(id)
  broker_type VARCHAR
  api_key TEXT ENCRYPTED (pgcrypto)
  api_secret TEXT ENCRYPTED
  last_sync_at TIMESTAMP
  sync_status ENUM ('success', 'failed', 'pending')
  RLS: SELECT/UPDATE on own rows only
  TRIGGER: audit_log on UPDATE
}

-- Core Trading Data
TABLE trades {
  id UUID
  account_id UUID FOREIGN KEY
  broker_trade_id VARCHAR UNIQUE (prevent duplicates)
  symbol VARCHAR
  entry_price DECIMAL
  exit_price DECIMAL
  entry_time TIMESTAMP
  exit_time TIMESTAMP
  quantity DECIMAL
  side ENUM ('long', 'short')
  pnl DECIMAL (computed)
  pnl_percent DECIMAL
  commissions DECIMAL
  slippage DECIMAL
  duration_ms INTEGER
  mfe DECIMAL (Max Favorable Excursion)
  mae DECIMAL (Max Adverse Excursion)
  trade_notes TEXT
  created_at TIMESTAMP
  INDEX: (account_id, entry_time DESC)
  INDEX: (account_id, created_at DESC)
  RLS: SELECT/UPDATE on own account_id only
}

-- Sync Audit Trail
TABLE sync_logs {
  id UUID
  account_id UUID FOREIGN KEY
  broker VARCHAR
  sync_timestamp TIMESTAMP
  trades_new INTEGER
  trades_updated INTEGER
  trades_duplicate INTEGER
  trades_error INTEGER
  error_messages JSONB
  created_at TIMESTAMP
  RLS: SELECT on own account_id only
}

-- Pre-computed Snapshots
TABLE daily_snapshots {
  id UUID
  account_id UUID
  snapshot_date DATE
  gross_profit DECIMAL
  gross_loss DECIMAL
  net_pnl DECIMAL
  trades_count INTEGER
  win_rate DECIMAL
  profit_factor DECIMAL
  expectancy DECIMAL
  created_at TIMESTAMP
  UNIQUE(account_id, snapshot_date)
  RLS: SELECT on own account_id only
}

-- Psychology Tracking
TABLE emotion_logs {
  id UUID
  user_id UUID FOREIGN KEY
  trade_id UUID FOREIGN KEY → trades(id)
  bias_detected ENUM ('FOMO', 'REVENGE', 'OVERCONFIDENCE', 'LOSS_AVERSION', 'ANCHORING')
  pnl_attributed DECIMAL (cost of this emotion)
  detected_method VARCHAR ('manual_tag', 'ai_detection')
  notes TEXT
  created_at TIMESTAMP
  RLS: SELECT/INSERT on own user_id only
}

-- Vocal Notes & Stress Score (Phase 2)
TABLE vocal_notes {
  id UUID
  user_id UUID
  session_id UUID
  audio_url VARCHAR (S3 URL)
  vss_score INTEGER (0-100: Calm-Vigilant-Tilt)
  transcript TEXT
  pitch_hz DECIMAL
  speech_rate_wpm DECIMAL
  intensity_db DECIMAL
  created_at TIMESTAMP
  RLS: SELECT on own user_id only
}

-- Armor Breach Events
TABLE armor_breaches {
  id UUID
  user_id UUID
  account_id UUID
  breach_type VARCHAR ('max_daily_loss', 'trailing_dd', 'overtrading', 'tilt_detected')
  breach_level INTEGER (1-3: warning-modal-fullscreen)
  breach_value DECIMAL (actual vs limit)
  breach_limit DECIMAL (threshold)
  webhook_triggered BOOLEAN
  dismissed_at TIMESTAMP NULL
  created_at TIMESTAMP
  RLS: SELECT on own user_id only
  TRIGGER: notify app < 2s via Realtime
}

-- KPI Snapshots (historical)
TABLE kpi_snapshots {
  id UUID
  account_id UUID
  snapshot_date DATE
  metrics JSONB (200+ KPIs)
  created_at TIMESTAMP
  RLS: SELECT on own account_id only
}

-- Prop Firm Rules Templates
TABLE prop_firm_templates {
  id UUID
  firm_name VARCHAR ('FTMO', 'MyForexFunds', 'True Forex Funds')
  max_daily_loss DECIMAL
  max_trailing_dd DECIMAL
  min_trading_days INTEGER
  max_loss_per_trade DECIMAL
  created_at TIMESTAMP
  (no RLS: public read)
}

-- Webhook Events
TABLE webhook_events {
  id UUID
  user_id UUID
  event_type VARCHAR ('armor_breach', 'trade_created', 'metrics_update')
  webhook_url VARCHAR
  payload JSONB
  retry_count INTEGER
  next_retry_at TIMESTAMP NULL
  status ENUM ('pending', 'success', 'failed')
  created_at TIMESTAMP
  RLS: SELECT/INSERT on own user_id only
}

-- Whale Impact Events (Phase 3)
TABLE whale_events {
  id UUID
  symbol VARCHAR
  whale_flow_detected BOOLEAN
  flow_direction VARCHAR ('buy', 'sell')
  correlated_trade_ids JSONB (Trade IDs affected)
  event_timestamp TIMESTAMP
}

-- Oracle Pre-trade Scores (Phase 3)
TABLE oracle_scores {
  id UUID
  symbol VARCHAR
  timestamp TIMESTAMP
  pre_trade_score INTEGER (0-100)
  whale_flow_score DECIMAL
  cot_score DECIMAL
  shadow_index_score DECIMAL
}

-- Trading Sessions
TABLE sessions {
  id UUID
  user_id UUID
  account_id UUID
  session_start TIMESTAMP
  session_end TIMESTAMP NULL
  tilt_flag BOOLEAN
  trades_count INTEGER
  session_pnl DECIMAL
  created_at TIMESTAMP
}
```

### Row-Level Security (RLS)

```sql
-- Example: users can only see their own data
CREATE POLICY "Users can see own data"
  ON trades
  USING (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  ));

-- Similar policies on all user-scoped tables
```

### Supabase SDK Setup

```typescript
// config/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY  // Frontend
  // OR
  process.env.SUPABASE_SERVICE_KEY  // Backend (secret!)
);

export default supabase;
```

---

## Part 4: Async Jobs & Queuing (BullMQ + Redis)

### Overview

**BullMQ = Job Queue backed by Redis** (async processing)

Use Cases:
- Broker sync (long-running, don't block API)
- Email notifications
- Webhook retries with exponential backoff
- Metrics pre-computation
- Audio transcription (Phase 2)

### Job Types

```typescript
// jobs/broker-sync.job.ts
const brokerSyncQueue = new Queue('broker-sync', {
  connection: redis,
});

brokerSyncQueue.add(
  'sync',
  {
    accountId: 'uuid',
    brokerType: 'MT4',
    apiCredentials: { /* ... */ },
  },
  {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,  // 2s, 4s, 8s
    },
    removeOnComplete: { age: 3600 },  // Delete after 1h
  }
);

brokerSyncQueue.process(async (job) => {
  // Pull trades from broker
  // Deduplicate via broker_trade_id
  // Insert into Supabase
  // Return result
});
```

### Redis Connection (Optional Phase 1)

**If using Redis for BullMQ:**

```typescript
// config/redis.ts
import Redis from 'redis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

export default redis;
```

**Environment Variables:**
```bash
REDIS_HOST=redis.your-service.com  # Cloud Redis (e.g., Upstash)
REDIS_PORT=6379
REDIS_PASSWORD=secret
```

---

## Part 5: Authentication & Security

### Supabase Auth

**Built-in Features:**
- Email + password login
- Magic link authentication
- OAuth2 (Google, GitHub, etc.)
- 2FA TOTP (standard authenticator apps)
- Session management (JWT)
- Password reset flow

**JWT Token Flow:**
1. User login → Supabase Auth service
2. Supabase returns JWT (24h expiry)
3. Frontend stores in localStorage
4. Every API call: `Authorization: Bearer {JWT}`
5. Backend verifies JWT signature via Supabase public key

### 2FA TOTP Setup (Optional Custom)

```typescript
// services/AuthService.ts
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

async setupTOTP(userId: string) {
  const secret = speakeasy.generateSecret({
    name: `AETHERIS (${userId})`,
  });

  const qrCode = await QRCode.toDataURL(secret.otpauth_url);
  
  return {
    secret: secret.base32,
    qrCode,  // User scans in authenticator app
  };
}

async verifyTOTP(userId: string, token: string) {
  const verified = speakeasy.totp.verify({
    secret: userTOTPSecret,
    encoding: 'base32',
    token,
    window: 2,  // Allow ±30s clock drift
  });

  return verified;
}
```

### Credential Storage

```typescript
// Broker credentials encrypted at rest in Supabase
// Using pgcrypto extension

// When storing:
const encrypted = await supabase
  .from('broker_connections')
  .insert({
    account_id: accountId,
    api_key: encrypt(apiKey, masterKey),  // pgcrypto
    api_secret: encrypt(apiSecret, masterKey),
  });

// When using:
const decrypted = await supabase
  .rpc('decrypt_broker_secret', { secret_id: 'uuid' });
```

---

## Part 6: Real-time & WebSocket

### Supabase Real-time (Primary)

**Database changes → clients automatically notified**

```typescript
// services/RealtimeService.ts
const subscription = supabase
  .from('trades')
  .on('INSERT', (payload) => {
    console.log('New trade:', payload.new);
  })
  .on('UPDATE', (payload) => {
    console.log('Trade updated:', payload.new);
  })
  .subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      console.log('Listening to trades...');
    }
  });
```

**Latency: < 100ms typical, < 2s guaranteed for Armor alerts**

### Express WebSocket (Optional Backup)

If Supabase Realtime insufficient for Armor alerts < 2s:

```typescript
// api/middleware/websocket.ts
import express from 'express';
import expressWs from 'express-ws';

const app = express();
expressWs(app);

app.ws('/ws/armor/:accountId', (ws, req) => {
  const accountId = req.params.accountId;

  // Subscribe to Armor breaches for this account
  const subscription = supabase
    .from(`armor_breaches:account_id=eq.${accountId}`)
    .on('INSERT', (payload) => {
      ws.send(JSON.stringify({
        type: 'ARMOR_BREACH',
        level: payload.new.breach_level,
        data: payload.new,
      }));
    })
    .subscribe();

  ws.on('close', () => subscription.unsubscribe());
});
```

---

## Part 7: Testing Strategy

### Unit Tests (Jest)

```typescript
// tests/unit/MetricsEngine.test.ts
import { MetricsEngine } from '../../src/services/MetricsEngine';

describe('MetricsEngine', () => {
  it('should calculate expectancy correctly', () => {
    const trades = [/* mock trades */];
    const metrics = new MetricsEngine().calculate(trades);
    expect(metrics.expectancy).toBeCloseTo(expectedValue, 2);
  });

  it('should handle edge case: zero trades', () => {
    const metrics = new MetricsEngine().calculate([]);
    expect(metrics.winRate).toBe(0);
  });
});
```

### Integration Tests (Supertest)

```typescript
// tests/integration/api.test.ts
import request from 'supertest';
import app from '../../src/api';

describe('POST /api/v1/trades', () => {
  it('should create a new trade', async () => {
    const response = await request(app)
      .post('/api/v1/trades')
      .set('Authorization', `Bearer ${jwt}`)
      .send({
        symbol: 'EURUSD',
        entry_price: 1.0850,
        /* ... */
      });

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
  });
});
```

### E2E Tests (Cypress - Post-MVP)

---

## Part 8: Deployment & DevOps

### Development Local Setup

**Requirements:**
- Node.js 22 LTS ✅
- Supabase project (free tier)
- `.env.local` with credentials

**Startup:**
```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev   # ts-node-dev localhost:3001

# Terminal 2: Frontend
cd frontend
npm install
npm run dev   # Vite localhost:3000
```

### Production Deployment (Future)

**Potential Architectures:**
1. **Vercel (frontend) + Cloud Run (backend):**
   - Frontend: `npm run build` → Vercel
   - Backend: Docker → Google Cloud Run
   - Database: Supabase (managed)

2. **Railway (all-in-one):**
   - Both frontend + backend on Railway
   - Database: Supabase
   - Auto-deploy on git push

3. **AWS (scalable):**
   - Frontend: CloudFront + S3
   - Backend: ECS Fargate
   - Database: Supabase
   - CDN: CloudFront

---

## Part 9: Monitoring & Logging

### Backend Logging (Pino)

```typescript
// config/logger.ts
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true },
  },
});

// Usage:
logger.info({ accountId, tradeCount }, 'Broker sync completed');
logger.error({ error: err.message }, 'Broker API failed');
```

### Frontend Error Tracking

```typescript
// Optional: Sentry integration (Phase 2)
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

---

## Part 10: Development Workflow

### Typical Day

```bash
# Morning
npm run dev           # Start backend + frontend
# Edit code → auto-reload

# Build for production
npm run build         # Backend: tsc, Frontend: vite build
npm run test          # Run Jest
npm run lint          # ESLint + Prettier

# Before git push
npm run type-check    # tsc --noEmit
git push origin feature/...
# GitHub Actions CI runs: lint, test, build
```

### Git Workflow

```bash
git checkout -b feature/broker-sync-mt4
# Implement feature
git add .
git commit -m "feat: add MT4 broker connector

- Implement IBrokerConnector for MT4 API
- Add retry logic (exponential backoff)
- Add unit tests"
git push origin feature/broker-sync-mt4
# Create PR, GitHub Actions verifies
```

---

## Part 11: Open Questions & Decisions Needed

### ❓ 1. BullMQ + Redis Requirement?

**Current Status:** Optional Phase 1

**Question:** Do you want to implement async broker sync in Phase 1, or keep it synchronous initially?

- **Sync Option:** POST /api/v1/brokers/sync blocks until complete (simple, 3-5s wait)
- **Async Option:** POST returns immediately, BullMQ job processes in background (complex, need Redis)

**Recommendation:** Start synchronous Phase 1, add BullMQ in Phase 2 if broker sync becomes bottleneck.

---

### ❓ 2. Prisma vs Supabase SDK Only?

**Current Status:** Both listed (Prisma optional)

**Question:** Do you want full ORM support (Prisma), or prefer direct Supabase SDK queries?

- **Prisma Option:** Type-safe, migration management, query optimization
- **Supabase SDK Option:** Simpler, fewer dependencies, direct SQL when needed

**Recommendation:** Use Supabase SDK only Phase 1 (less setup). Migrate to Prisma Phase 2 if queries get complex.

---

### ❓ 3. Audio File Storage (Phase 2)?

**Current Status:** Planned for Phase 2+

**Question:** Where to store audio files from vocal stress analysis?

- **Supabase Storage:** S3-compatible, integrated with PostgreSQL, included in free tier
- **AWS S3:** More control, separate service
- **GCS:** Google Cloud Storage

**Recommendation:** Use Supabase Storage (included, integrated).

---

### ❓ 4. Webhook for Armor Level 3?

**Current Status:** Schema prepared, implementation TBD

**Question:** When Armor Level 3 (fullscreen pulse, extreme risk), should we:
- POST to user-defined webhook URL?
- Send email notification?
- Both?

**Recommendation:** Both. Email via SendGrid, webhook for integrations (Discord, Slack, etc.).

---

### ❓ 5. Heatmap Data Source?

**Current Status:** daily_snapshots table prepared

**Question:** Should heatmap show:
- P/L per day (7×5 grid)?
- Win/Loss per day?
- Drawdown per day?

**Recommendation:** P/L per day (emerald positive, crimson negative, slate zero).

---

## Summary Table: Final Architecture

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| **Frontend Build** | Vite | 5.4+ | esbuild, 14x faster |
| **Frontend Framework** | React | 18.3+ | Hooks, concurrent features |
| **Frontend Language** | TypeScript | 5.7 | Strict mode |
| **Frontend State** | Zustand | 4.5+ | 2KB, minimal boilerplate |
| **Frontend Styling** | Tailwind CSS | 3.4+ | Utility-first, PurgeCSS |
| **Frontend Icons** | Heroicons | 2.1+ | 41-icon SVG sprite |
| **Frontend Routing** | React Router | 6.28+ | Client-side routing |
| **Frontend HTTP** | Axios | 1.7.7 | Promise-based HTTP client |
| **Frontend DB** | @supabase/supabase-js | 2.50+ | Real-time subscriptions |
| **Backend Runtime** | Node.js | 22 LTS | Latest stable |
| **Backend Framework** | Express | 4.21+ | Minimal, fast |
| **Backend Language** | TypeScript | 5.7 | Strict mode |
| **Backend ORM** | Prisma (optional) | 5.22+ | Or Supabase SDK only |
| **Backend Validation** | Zod | 3.24+ | Runtime type validation |
| **Backend Logging** | Pino | 8.21+ | Structured JSON logs |
| **Async Jobs** | BullMQ | 5.18+ | Redis-backed queue (optional Phase 1) |
| **Redis** | redis-js | 4.7+ | For BullMQ (optional Phase 1) |
| **Database** | Supabase | (managed) | PostgreSQL 14.13 BaaS |
| **Database Auth** | Supabase Auth | (managed) | JWT + 2FA TOTP + OAuth2 |
| **Real-time** | Supabase Realtime | (managed) | WebSocket < 2s |
| **Testing (Unit)** | Jest | 29.7+ | Jest Config |
| **Testing (Integration)** | Supertest | 6.3.4 | API endpoint tests |
| **Testing (E2E)** | Cypress | (post-MVP) | Browser automation |
| **Linting** | ESLint | 8.57+ | Code quality |
| **Formatting** | Prettier | 3.2+ | Code style |
| **CI/CD** | GitHub Actions | (native) | Lint, test, build, deploy |

---

## Conclusion

This architecture is optimized for:
✅ **Solo developer** — Unified JS stack, zero database ops  
✅ **Fast iteration** — Vite HMR, Supabase cloud changes instant  
✅ **Type safety** — TypeScript strict, compile-time error catching  
✅ **Real-time** — Supabase Realtime < 2s for critical alerts  
✅ **Scalability** — Stateless Express, cloud-native Supabase  
✅ **MVP budget** — Supabase free tier covers Phase 1 entirely  

**Next Steps:**
1. Sign up Supabase: https://supabase.com
2. Create AETHERIS project
3. Get API credentials
4. Scaffold repository (backend + frontend)
5. Start Sprint 0 implementation
