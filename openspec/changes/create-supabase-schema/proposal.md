## Why

AETHERIS requires a persistent, secure database to store trading data, account information, broker connections, and risk metrics. Supabase provides managed PostgreSQL with built-in Row-Level Security (RLS), authentication, and real-time subscriptions — eliminating manual DevOps complexity while maintaining compliance (KYC/AML audit trails). This change establishes the foundational data layer needed for Sprint 1+ features (broker sync, metrics engine, risk aggregation).

## What Changes

- Create 15 core database tables in Supabase PostgreSQL
- Implement Row-Level Security (RLS) policies on all user-scoped tables
- Add audit triggers for KYC/AML compliance (INSERT/UPDATE logging)
- Create indexes on frequently queried columns (foreign keys, timestamps, broker_trade_id)
- Establish Supabase real-time subscriptions for live P/L updates (Phase 2)
- Document database schema and RLS policies in code

## Capabilities

### New Capabilities

- `users-and-auth`: User account creation, JWT-based authentication, KYC/AML status tracking
- `trading-accounts`: Multi-account support, prop firm template management, risk limit configuration
- `broker-integration`: Broker API credential storage (encrypted), sync status tracking, deduplication logic
- `trade-records`: Individual trade storage with entry/exit details, fees, slippage, broker deduplication
- `sync-audit`: Audit trail for imports (new/duplicate/error counts), KYC/AML compliance logging
- `daily-snapshots`: Daily P/L aggregation for heatmap rendering, metrics pre-computation
- `emotion-tracking`: Bias logging (FOMO, REVENGE, OVERCONFIDENCE) with financial cost attribution
- `vocal-notes`: Audio recording metadata + Vocal Stress Score timeline storage (Phase 2)
- `armor-breaches`: Soft/hard breach event logging with timestamps (prevents claim disputes)
- `kpi-snapshots`: 200+ metrics storage (Expectancy, Profit Factor, Sharpe, Kelly, etc.) with daily snapshots
- `webhook-integration`: User-defined webhook URLs, retry logic, event payload storage for Armor Level 3
- `whale-flows`: Whale impact correlation tracking (Phase 3 future)
- `oracle-consensus`: Pre-trade signal scores from institutional data (Phase 3 future)
- `trading-sessions`: Session-level metadata (tilt flags, session P/L, duration) for discipline tracking

### Modified Capabilities

(None — all capabilities are new in this change)

## Impact

- **Code**: backend/src/config/supabase.ts (client init), database migrations (SQL scripts)
- **APIs**: All backend endpoints depend on database access (broker sync, metrics, risk aggregation)
- **Dependencies**: @supabase/supabase-js (already installed in backend)
- **Security**: Credentials stored in backend/.env.local (gitignored); RLS policies prevent unauthorized access
- **Compliance**: Audit trails enable KYC/AML verification; no manual logging required
- **Phase 1 Blocker**: Without this schema, broker sync, metrics engine, and dashboard cannot proceed
