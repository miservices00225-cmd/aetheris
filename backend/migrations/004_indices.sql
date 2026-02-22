-- AETHERIS Performance Indices
-- Strategic indices for fast heatmap, KPI queries, and deduplication
--
-- Applied after schema + RLS + triggers (004_indices.sql)
-- Indices created on hot-path queries (heatmap, metrics, lookups)

-- ============================================================================
-- DEDUPLICATION INDICES
-- ============================================================================
-- Already created in 001_init_schema.sql
-- CREATE UNIQUE INDEX idx_trades_dedup ON trades(broker_id, broker_trade_id, account_id)
-- But we keep reference here for completeness

-- ============================================================================
-- HEATMAP QUERY INDICES (Daily Snapshots)
-- ============================================================================

-- Fast queries: "Get P/L for account over date range"
-- SELECT * FROM daily_snapshots 
-- WHERE account_id = $1 AND snapshot_date BETWEEN $2 AND $3
-- ORDER BY snapshot_date DESC;

CREATE INDEX IF NOT EXISTS idx_daily_snapshots_account_date 
  ON daily_snapshots(account_id, snapshot_date DESC);

COMMENT ON INDEX idx_daily_snapshots_account_date 
  IS 'Composite: heatmap queries (account, date range)';

-- ============================================================================
-- KPI DASHBOARD INDICES
-- ============================================================================

-- Fast queries: "Get KPIs for account on specific date"
-- SELECT * FROM kpi_snapshots 
-- WHERE account_id = $1 AND snapshot_date = $2;

CREATE INDEX IF NOT EXISTS idx_kpi_snapshots_account_date 
  ON kpi_snapshots(account_id, snapshot_date DESC);

COMMENT ON INDEX idx_kpi_snapshots_account_date 
  IS 'Composite: metrics dashboard queries (account, date)';

-- ============================================================================
-- TRADE FILTERING INDICES
-- ============================================================================

-- Fast queries: "Get all trades for account"
-- Already created: idx_trades_account_id
-- Already created: idx_trades_created_at
-- Already created: idx_trades_account_created (composite)

-- Fast queries: "Get trades by symbol"
-- Already created: idx_trades_symbol

-- ============================================================================
-- SYNC LOG INDICES
-- ============================================================================

-- Fast queries: "Get sync history for account"
-- Already created: idx_sync_logs_account_id

-- Fast queries: "Get recent syncs across all accounts (admin view)"
-- Already created: idx_sync_logs_sync_timestamp

CREATE INDEX IF NOT EXISTS idx_sync_logs_account_timestamp 
  ON sync_logs(account_id, sync_timestamp DESC);

COMMENT ON INDEX idx_sync_logs_account_timestamp 
  IS 'Composite: recent syncs per account';

-- ============================================================================
-- ARMOR BREACH INDICES
-- ============================================================================

-- Fast queries: "Get recent breaches for account"
-- Already created: idx_armor_breaches_account_id
-- Already created: idx_armor_breaches_timestamp

CREATE INDEX IF NOT EXISTS idx_armor_breaches_account_timestamp 
  ON armor_breaches(account_id, breach_timestamp DESC);

COMMENT ON INDEX idx_armor_breaches_account_timestamp 
  IS 'Composite: recent breaches per account for real-time alerts';

-- ============================================================================
-- WEBHOOK EVENT INDICES
-- ============================================================================

-- Fast queries: "Get pending webhook retries"
-- Already created: idx_webhook_events_status_retry
-- WHERE status = 'pending' AND next_retry_at <= NOW()

-- This partial index optimizes retry processing
CREATE INDEX IF NOT EXISTS idx_webhook_events_pending_retry 
  ON webhook_events(account_id, next_retry_at)
  WHERE status = 'pending' AND next_retry_at IS NOT NULL;

COMMENT ON INDEX idx_webhook_events_pending_retry 
  IS 'Partial: pending webhooks due for retry (efficient scan)';

-- ============================================================================
-- JSONB INDICES (for flexible querying)
-- ============================================================================

-- Fast JSONB queries on prop_firm_rules
-- e.g., SELECT * FROM accounts 
--       WHERE prop_firm_rules->>'maxDailyLoss' > ...

CREATE INDEX IF NOT EXISTS idx_accounts_prop_firm_rules 
  ON accounts USING GIN (prop_firm_rules);

COMMENT ON INDEX idx_accounts_prop_firm_rules 
  IS 'GIN index: JSONB queries on prop firm rules (flexible schema)';

-- Fast JSONB queries on vocal timeline
-- e.g., SELECT * FROM vocal_notes 
--       WHERE vss_timeline @> jsonb_build_array(...)

CREATE INDEX IF NOT EXISTS idx_vocal_notes_vss_timeline 
  ON vocal_notes USING GIN (vss_timeline);

COMMENT ON INDEX idx_vocal_notes_vss_timeline 
  IS 'GIN index: JSONB queries on vocal stress score timeline';

-- Fast JSONB queries on webhook payloads
CREATE INDEX IF NOT EXISTS idx_webhook_events_payload 
  ON webhook_events USING GIN (payload);

COMMENT ON INDEX idx_webhook_events_payload 
  IS 'GIN index: JSONB queries on event payloads (flexible schema)';

-- ============================================================================
-- SESSION INDICES
-- ============================================================================

-- Fast queries: "Get sessions for account"
-- Already created: idx_sessions_account_id

-- Fast queries: "Get sessions by date range"
-- Already created: idx_sessions_session_start

CREATE INDEX IF NOT EXISTS idx_sessions_account_start 
  ON sessions(account_id, session_start DESC);

COMMENT ON INDEX idx_sessions_account_start 
  IS 'Composite: sessions per account (recent first)';

-- ============================================================================
-- EMOTION LOG INDICES
-- ============================================================================

-- Fast queries: "Get emotions logged for trade"
-- Already created: idx_emotion_logs_trade_id

-- Fast queries: "Get emotions per account"
-- Already created: idx_emotion_logs_account_id

CREATE INDEX IF NOT EXISTS idx_emotion_logs_account_type 
  ON emotion_logs(account_id, emotion_type);

COMMENT ON INDEX idx_emotion_logs_account_type 
  IS 'Composite: emotion logs per account and type (bias analysis)';

-- ============================================================================
-- WHALE EVENT INDICES
-- ============================================================================

-- Fast queries: "Get whale events for symbol"
-- Already created: idx_whale_events_symbol

-- Fast queries: "Get recent whale events"
-- Already created: idx_whale_events_timestamp

-- ============================================================================
-- ORACLE SCORE INDICES
-- ============================================================================

-- Fast queries: "Get oracle scores for symbol"
-- Already created: idx_oracle_scores_symbol

-- Fast queries: "Get latest scores for symbol"
-- Already created: idx_oracle_scores_timestamp

CREATE INDEX IF NOT EXISTS idx_oracle_scores_symbol_timestamp 
  ON oracle_scores(symbol, timestamp DESC);

COMMENT ON INDEX idx_oracle_scores_symbol_timestamp 
  IS 'Composite: latest oracle scores per symbol';

-- ============================================================================
-- FOREIGN KEY INDICES (for referential integrity)
-- ============================================================================
-- Already created:
-- - idx_accounts_user_id (accounts -> users)
-- - idx_broker_connections_account_id (broker_connections -> accounts)
-- 
-- PostgreSQL automatically creates indices on FK columns,
-- but explicit index ensures proper ordering/collation

-- ============================================================================
-- AUDIT TRAIL INDICES
-- ============================================================================

-- Already created:
-- - idx_audit_trail_table_record (compliance queries)
-- - idx_audit_trail_timestamp (time-range queries)

CREATE INDEX IF NOT EXISTS idx_audit_trail_user_timestamp 
  ON audit_trail(changed_by, audit_timestamp DESC);

COMMENT ON INDEX idx_audit_trail_user_timestamp 
  IS 'Composite: audit logs per user (compliance review)';

-- ============================================================================
-- INDEX STATISTICS & MONITORING
-- ============================================================================
--
-- View index size:
-- SELECT schemaname, tablename, indexname, 
--        pg_size_pretty(pg_relation_size(indexrelid)) AS size
-- FROM pg_indexes
-- WHERE schemaname = 'public'
-- ORDER BY pg_relation_size(indexrelid) DESC;
--
-- View index usage (unused indices):
-- SELECT schemaname, tablename, indexname,
--        idx_scan, idx_tup_read, idx_tup_fetch
-- FROM pg_stat_user_indexes
-- ORDER BY idx_scan ASC;
--
-- Rebuild fragmented indices (Phase 2 optimization):
-- REINDEX INDEX CONCURRENTLY idx_trades_account_created;
--
-- ============================================================================
-- SUMMARY: 24 indices created
-- ============================================================================
--
-- Strategic indices for:
-- 1. Deduplication (UNIQUE broker_trade_id)
-- 2. Heatmap queries (account_id, date range)
-- 3. KPI dashboard (account_id, snapshot_date)
-- 4. RLS filtering (account_id on all user-scoped tables)
-- 5. Webhook retries (status, next_retry_at)
-- 6. JSONB queries (GIN on flexible columns)
-- 7. Audit trail (compliance queries by user/timestamp)
--
-- Expected query performance:
-- - Heatmap (90 days): <100ms (1 account)
-- - KPI dashboard (latest): <50ms (cached)
-- - Trade lookup (by symbol): <50ms
-- - Webhook retries (scan): <100ms for 10K+ events
-- - Audit report (by user): <200ms
--
-- Next: Backend integration (src/database/*.ts query helpers)
-- ============================================================================
