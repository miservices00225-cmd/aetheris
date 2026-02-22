## Context

AETHERIS requires a foundational data layer to support real-time broker synchronization, multi-account risk aggregation, and 200+ KPI calculations. Currently, backend has TypeScript scaffolding and Supabase SDK installed, but no database schema. Without this schema, broker sync (Sprint 1), metrics engine, and dashboard cannot proceed.

**Stakeholders:**
- Trading users: Need secure, multi-account data isolation
- Compliance team: Need KYC/AML audit trails for regulatory verification
- DevOps: Need managed database (Supabase PostgreSQL)
- Backend team: Need schema with RLS policies for security

**Constraints:**
- Supabase managed PostgreSQL (no Docker/local database)
- JWT-based authentication (Supabase Auth)
- Row-Level Security (RLS) required for multi-tenant isolation
- Phase 1 blocker: Must complete before Sprint 1 begins
- No breaking schema changes after Phase 1 release (data migration risk)

---

## Goals / Non-Goals

### Goals

1. **Create 15 core tables** with proper relationships and indexing for trades, accounts, metrics, and audit trails
2. **Implement Row-Level Security (RLS)** on all user-scoped tables to enforce multi-tenant data isolation
3. **Design audit trail mechanism** (triggers/logging) for KYC/AML compliance verification
4. **Establish deduplication logic** via UNIQUE constraints on `broker_trade_id` to prevent duplicate imports
5. **Support daily snapshots** for fast heatmap rendering (query 1 row/day, not 1000+ trades)
6. **Enable real-time subscriptions** via Supabase Realtime for live P/L updates (Phase 2)
7. **Document schema, RLS policies, and migration strategy** for future team onboarding

### Non-Goals

- **Phase 2+ features**: Whale flows, Oracle, vocal stress detection (stored but not computed)
- **Complex stored procedures**: Metrics calculations in SQL (do in backend, snapshot daily)
- **Full-text search optimization**: (add indices in Phase 2 if needed)
- **Multi-region replication**: Single Supabase project for MVP
- **Backup/disaster recovery procedures**: Supabase handles managed backups automatically

---

## Decisions

### Decision 1: Supabase Managed PostgreSQL (not local Docker)

**Choice:** Use Supabase hosted PostgreSQL (free tier for MVP)

**Rationale:**
- No DevOps overhead (backups, upgrades, monitoring handled by Supabase)
- Built-in JWT auth integration with backend
- Row-Level Security (RLS) native to PostgreSQL
- Real-time subscriptions via Supabase Realtime protocol
- KYC/AML audit trails easy to implement via audit triggers

**Alternatives considered:**
- Self-hosted Docker PostgreSQL → requires DevOps, backups, security patches
- MongoDB → no RLS, audit trails harder, compliance-unfriendly
- Amazon RDS → more expensive, no built-in auth integration

---

### Decision 2: Row-Level Security (RLS) Policies for Multi-Tenant Isolation

**Choice:** Implement RLS policies on ALL user-scoped tables (trades, accounts, sync_logs, etc.)

**Rationale:**
- Prevents data leakage between users at database level (defense-in-depth)
- Queries automatically filtered by `auth.uid()` without application logic
- No manual WHERE clauses needed (ORM/query builders handle it via RLS)
- Compliance-ready (user cannot access other users' data even if API breached)

**Policy pattern:**
```sql
CREATE POLICY "Users can view own trades"
  ON trades
  USING (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  ));
```

**Alternatives considered:**
- Application-level filtering (manual WHERE clauses) → error-prone, risky
- Column-level encryption → expensive, complex, insufficient for full isolation

---

### Decision 3: Broker Trade Deduplication via UNIQUE(broker_trade_id)

**Choice:** Add UNIQUE constraint on `(broker_id, broker_trade_id, account_id)` to prevent duplicates

**Rationale:**
- Idempotent imports: importing same trades 10× produces same DB state
- Automatic duplicate detection (constraint violation) vs manual checking
- Foreign key link to broker_connections for audit trail of which broker synced

**Conflict handling strategy:**
- **IGNORE:** If duplicate found, keep original trade (no update)
- **OVERWRITE:** If duplicate found with changed fields (exit price, etc.), update existing record

**Example:**
```sql
ALTER TABLE trades 
ADD CONSTRAINT unique_broker_trade_id 
UNIQUE(broker_id, broker_trade_id, account_id);
```

---

### Decision 4: Daily Snapshots for Heatmap and KPI Pre-Computation

**Choice:** Pre-compute daily_snapshots + kpi_snapshots at UTC midnight (or on-demand query)

**Rationale:**
- Heatmap queries 1 row/day (fast) vs summing 1000+ trades per day (slow)
- 200+ KPI calculations expensive (Expectancy, Sharpe, Kelly, Profit Factor, etc.)
- Pre-compute once daily, cache in kpi_snapshots table
- If real-time KPI needed, add Redis cache (Phase 2)

**Implementation:**
- Backend cron job at midnight UTC: aggregate trades for day, calculate metrics, insert kpi_snapshots
- If no cron, UI queries daily_snapshots on-demand (first view might be slow, then cached)
- Phase 2: Add BullMQ for background job processing

---

### Decision 5: Encrypted Credential Storage for Broker APIs

**Choice:** Store broker_connections with encrypted API keys at rest; decrypt only when syncing

**Rationale:**
- Credentials never exposed in logs or API responses
- Application-level encryption (AES-256) via Supabase encrypted columns (or Node.js crypto module)
- Only backend service (with private key) can decrypt for sync

**Implementation:**
```typescript
// backend/src/config/supabase.ts
const decrypt = (encryptedKey: string) => {
  // Decrypt using BACKEND_CRYPTO_KEY (stored in .env.local)
  return crypto.decrypt(encryptedKey);
};
```

**Alternatives considered:**
- Supabase Secrets (not designed for user-scoped credentials)
- Plain-text storage → security risk, compliance violation

---

### Decision 6: Audit Trail via Triggers + sync_logs Table

**Choice:** Use PostgreSQL triggers to log INSERT/UPDATE events for KYC/AML compliance

**Rationale:**
- Automatic audit trail (no missed logging in application)
- Compliant with regulatory requirements (timestamped, immutable)
- Trigger fires on every change, captures old/new values
- Easy to query audit_trail for compliance reviews

**Example trigger:**
```sql
CREATE TRIGGER audit_trade_changes
  AFTER INSERT OR UPDATE ON trades
  FOR EACH ROW
  EXECUTE FUNCTION log_audit_trail('trades', NEW.*);
```

---

### Decision 7: JSONB Columns for Flexible, Unstructured Data

**Choice:** Use JSONB for `prop_firm_rules`, `vss_timeline`, `correlated_trade_ids`, `payload`

**Rationale:**
- Prop firm rules differ (FTMO vs MyForexFunds) → no fixed schema
- VSS timeline is variable-length array of {timestamp, score} pairs
- Webhook payloads schema varies per event type
- PostgreSQL JSONB queryable (can filter within JSON without unpacking)

**Indexing:**
```sql
CREATE INDEX idx_prop_firm_rules ON accounts USING GIN (prop_firm_rules);
```

---

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| **RLS policy misconfiguration** | QA/test: verify policies with `EXPLAIN` queries, test per-user access | 
| **Large daily_snapshots queries slow UI** | Add caching (Redis Phase 2); query only last 90 days |
| **Broker dedup fails if broker_trade_id null** | Validate non-null before INSERT; log error if missing |
| **Audit triggers cause INSERT slowdown** | Expected <5% overhead; profile Phase 2 if needed |
| **JSONB queries slow without index** | Add GIN indices on frequently queried JSONB columns |
| **Supabase outage = app unavailable** | Acceptable for MVP; add failover (Phase 3) if needed |
| **Encrypted credentials overhead** | <1ms decryption per sync; acceptable |
| **Schema migration post-launch risky** | Design schema generously (JSONB for flexibility); avoid ALTER TABLE drops |

---

## Migration Plan

### Phase 1: Create Schema (Pre-launch)

1. **Create tables** via Supabase SQL Editor or migrations script
2. **Add RLS policies** for all user-scoped tables
3. **Create audit triggers** for KYC/AML logging
4. **Create indices** on foreign keys, timestamps, broker_trade_id
5. **Test RLS** (verify user A cannot see user B's trades)
6. **Test deduplication** (insert same trade twice, verify constraint fails)

### Phase 2: Enable Real-time (Later)

- Add `ALTER TABLE trades REPLICA IDENTITY FULL` for Realtime subscriptions
- Add real-time listeners in frontend for live P/L updates

### Phase 3: Optimize (If Needed)

- Profile slow queries, add indices
- Migrate from daily batch to real-time metric calculations
- Add Redis cache for KPIs if heatmap slow

### Rollback Strategy

- **If schema incomplete:** Disable Supabase project, use backup
- **If RLS broken:** Disable RLS, restore from backup, redeploy
- **If data corruption:** Restore from Supabase automated backups (24-hour retention)

---

## Open Questions

1. **Exactly which KPIs to pre-compute?** (200+ listed in ARCHITECTURE.md, but implement subset in Phase 1?)
2. **How to handle multiple broker_connections per account?** (e.g., user connects both MT4 and Interactive Brokers?)
3. **Vocal notes encryption at rest: when/how?** (Phase 2 implementation detail, but affects table design)
4. **Should we support account data export?** (GDPR compliance → need export API, data dump procedure)
5. **How long to retain audit trail?** (Compliance requires 3-7 years; Supabase free tier has 1GB limit)

---

## Schema Summary

**15 Tables:**
1. **users** - Account holders, KYC/AML status
2. **accounts** - Trading accounts, prop firm rules, risk limits
3. **broker_connections** - Broker API credentials, sync status
4. **trades** - Individual trades, entry/exit, fees, MFE/MAE
5. **sync_logs** - Import audit trail (new/duplicate/error counts)
6. **daily_snapshots** - Daily P/L aggregation for heatmap
7. **emotion_logs** - Bias tracking (FOMO, REVENGE, etc.)
8. **vocal_notes** - Audio metadata, VSS scores (Phase 2)
9. **armor_breaches** - Soft/hard breach events
10. **kpi_snapshots** - 200+ metrics, daily snapshots
11. **webhook_events** - Armor alerts, retry logic
12. **whale_events** - Whale flow correlation (Phase 3)
13. **oracle_scores** - Pre-trade signals (Phase 3)
14. **sessions** - Trading session metadata, tilt flags
15. **prop_firm_templates** - FTMO, MyForexFunds, custom rules (lookup table)

**All tables include:**
- `id` (UUID, primary key)
- `created_at` (TIMESTAMP, audit)
- `user_id` or multi-tenant RLS policy
- Appropriate foreign keys and indices
