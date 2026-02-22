-- AETHERIS Phase 1 Database Schema
-- 15 core tables for broker sync, KPI calculation, and compliance
-- Supabase PostgreSQL 14.13 LTS
-- Created: 2026-02-22

-- ============================================================================
-- 1. USERS & AUTHENTICATION
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  kycaml_status VARCHAR(50) DEFAULT 'pending' CHECK (kycaml_status IN ('pending', 'verified', 'rejected')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE users IS 'Account holders with KYC/AML verification status';
COMMENT ON COLUMN users.kycaml_status IS 'KYC/AML compliance status for regulatory reporting';

-- ============================================================================
-- 2. TRADING ACCOUNTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS prop_firm_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  rules JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE prop_firm_templates IS 'Pre-configured prop firm rules (FTMO, MyForexFunds, custom)';
COMMENT ON COLUMN prop_firm_templates.rules IS 'JSONB: {minTradesPerDay, maxDrawdown, dailyLossLimit, etc}';

CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_name VARCHAR(255) NOT NULL,
  account_type VARCHAR(50) NOT NULL CHECK (account_type IN ('personal', 'prop_firm', 'crypto')),
  broker_type VARCHAR(100),
  prop_firm_template_id UUID REFERENCES prop_firm_templates(id),
  prop_firm_rules JSONB DEFAULT '{}',
  risk_limit_percent DECIMAL(5, 2) DEFAULT 2.0,
  daily_loss_limit DECIMAL(15, 2),
  max_drawdown_percent DECIMAL(5, 2) DEFAULT 10.0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_accounts_user_id ON accounts(user_id);

COMMENT ON TABLE accounts IS 'Trading accounts with risk limits and prop firm configuration';
COMMENT ON COLUMN accounts.prop_firm_rules IS 'JSONB: custom rules per prop firm (FTMO vs MyForexFunds differ)';
COMMENT ON COLUMN accounts.risk_limit_percent IS 'Risk per trade as % of account equity';

-- ============================================================================
-- 3. BROKER INTEGRATION & CREDENTIALS
-- ============================================================================

CREATE TABLE IF NOT EXISTS broker_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  broker_id VARCHAR(100) NOT NULL,
  broker_name VARCHAR(255),
  api_key_encrypted TEXT,
  api_secret_encrypted TEXT,
  sync_status VARCHAR(50) DEFAULT 'pending' CHECK (sync_status IN ('pending', 'syncing', 'success', 'error')),
  last_sync_at TIMESTAMP,
  last_sync_error TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_broker_connections_account_id ON broker_connections(account_id);
CREATE INDEX idx_broker_connections_sync_status ON broker_connections(sync_status);

COMMENT ON TABLE broker_connections IS 'Broker API credentials (encrypted) and sync status per account';
COMMENT ON COLUMN broker_connections.api_key_encrypted IS 'AES-256 encrypted at rest; decrypted only during sync';
COMMENT ON COLUMN broker_connections.sync_status IS 'Current sync state: pending, syncing, success, error';

-- ============================================================================
-- 4. TRADE RECORDS & DEDUPLICATION
-- ============================================================================

CREATE TABLE IF NOT EXISTS trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  broker_id VARCHAR(100) NOT NULL,
  broker_trade_id VARCHAR(255),
  symbol VARCHAR(20) NOT NULL,
  trade_type VARCHAR(20) CHECK (trade_type IN ('buy', 'sell', 'long', 'short')),
  entry_price DECIMAL(15, 8) NOT NULL,
  exit_price DECIMAL(15, 8),
  quantity DECIMAL(15, 4) NOT NULL,
  entry_time TIMESTAMP NOT NULL,
  exit_time TIMESTAMP,
  commission DECIMAL(15, 8) DEFAULT 0,
  slippage DECIMAL(15, 8) DEFAULT 0,
  pnl DECIMAL(15, 8),
  pnl_percent DECIMAL(8, 4),
  mfe DECIMAL(15, 8),
  mae DECIMAL(15, 8),
  duration_seconds INTEGER,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_trades_dedup ON trades(broker_id, broker_trade_id, account_id) WHERE broker_trade_id IS NOT NULL;
CREATE INDEX idx_trades_account_id ON trades(account_id);
CREATE INDEX idx_trades_symbol ON trades(symbol);
CREATE INDEX idx_trades_created_at ON trades(created_at);
CREATE INDEX idx_trades_account_created ON trades(account_id, created_at);

COMMENT ON TABLE trades IS 'Individual trade records with entry/exit, fees, MFE/MAE for performance analytics';
COMMENT ON COLUMN trades.broker_trade_id IS 'Unique ID from broker; used for deduplication via UNIQUE constraint';
COMMENT ON COLUMN trades.mfe IS 'Maximum Favorable Excursion: best unrealized profit during trade duration';
COMMENT ON COLUMN trades.mae IS 'Maximum Adverse Excursion: worst unrealized loss during trade duration';

-- ============================================================================
-- 5. SYNC AUDIT TRAIL
-- ============================================================================

CREATE TABLE IF NOT EXISTS sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  broker_id VARCHAR(100) NOT NULL,
  broker_connection_id UUID REFERENCES broker_connections(id),
  trades_new INTEGER DEFAULT 0,
  trades_duplicate INTEGER DEFAULT 0,
  trades_error INTEGER DEFAULT 0,
  error_details TEXT,
  sync_timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sync_logs_account_id ON sync_logs(account_id);
CREATE INDEX idx_sync_logs_sync_timestamp ON sync_logs(sync_timestamp);

COMMENT ON TABLE sync_logs IS 'Audit trail for broker imports: counts of new, duplicate, and error trades';
COMMENT ON COLUMN sync_logs.trades_duplicate IS 'Trades rejected due to UNIQUE constraint (already imported)';
COMMENT ON COLUMN sync_logs.trades_error IS 'Trades failed validation or had missing required fields';

-- ============================================================================
-- 6. DAILY SNAPSHOTS FOR HEATMAP & KPI PRE-COMPUTATION
-- ============================================================================

CREATE TABLE IF NOT EXISTS daily_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL,
  net_pnl DECIMAL(15, 8),
  gross_profit DECIMAL(15, 8),
  gross_loss DECIMAL(15, 8),
  trade_count INTEGER DEFAULT 0,
  win_count INTEGER DEFAULT 0,
  loss_count INTEGER DEFAULT 0,
  largest_win DECIMAL(15, 8),
  largest_loss DECIMAL(15, 8),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_daily_snapshots_account_date ON daily_snapshots(account_id, snapshot_date);
CREATE INDEX idx_daily_snapshots_account_id ON daily_snapshots(account_id);

COMMENT ON TABLE daily_snapshots IS 'Daily P/L aggregation for fast heatmap queries (1 row/day vs 1000+ trades/day)';
COMMENT ON COLUMN daily_snapshots.snapshot_date IS 'UTC date for aggregation period';

CREATE TABLE IF NOT EXISTS kpi_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL,
  expectancy DECIMAL(15, 8),
  profit_factor DECIMAL(10, 4),
  sharpe_ratio DECIMAL(10, 4),
  sortino_ratio DECIMAL(10, 4),
  kelly_criterion DECIMAL(10, 4),
  win_rate_percent DECIMAL(5, 2),
  drawdown_percent DECIMAL(5, 2),
  r_multiple DECIMAL(10, 4),
  consecutive_wins INTEGER,
  consecutive_losses INTEGER,
  recovery_factor DECIMAL(10, 4),
  kpi_json JSONB DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_kpi_snapshots_account_date ON kpi_snapshots(account_id, snapshot_date);
CREATE INDEX idx_kpi_snapshots_account_id ON kpi_snapshots(account_id);

COMMENT ON TABLE kpi_snapshots IS '200+ pre-computed KPI metrics (daily snapshot) for performance analytics dashboard';
COMMENT ON COLUMN kpi_snapshots.kpi_json IS 'JSONB: additional metrics beyond main columns (Thorp Sharpe, Calmar, etc.)';

-- ============================================================================
-- 7. PSYCHOLOGY & EMOTION TRACKING
-- ============================================================================

CREATE TABLE IF NOT EXISTS emotion_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trade_id UUID REFERENCES trades(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  emotion_type VARCHAR(50) CHECK (emotion_type IN ('fomo', 'revenge', 'overconfidence', 'fear', 'greed', 'regret')),
  intensity_level INTEGER CHECK (intensity_level BETWEEN 1 AND 10),
  financial_cost DECIMAL(15, 8),
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_emotion_logs_trade_id ON emotion_logs(trade_id);
CREATE INDEX idx_emotion_logs_account_id ON emotion_logs(account_id);

COMMENT ON TABLE emotion_logs IS 'Bias tracking with quantified financial cost per emotion type (Phase 2 feature, Phase 1 structure)';
COMMENT ON COLUMN emotion_logs.financial_cost IS 'Attributed loss/opportunity cost due to emotional bias';

-- ============================================================================
-- 8. VOCAL NOTES & STRESS DETECTION
-- ============================================================================

CREATE TABLE IF NOT EXISTS vocal_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  transcript TEXT,
  vss_timeline JSONB DEFAULT '[]',
  audio_url VARCHAR(500),
  audio_duration_seconds INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vocal_notes_account_id ON vocal_notes(account_id);
CREATE INDEX idx_vocal_notes_created_at ON vocal_notes(created_at);

COMMENT ON TABLE vocal_notes IS 'Vocal recordings with transcripts and Vocal Stress Score (VSS) timeline (Phase 2 feature)';
COMMENT ON COLUMN vocal_notes.vss_timeline IS 'JSONB: [{timestamp, vss_score, confidence}, ...] variable-length array';
COMMENT ON COLUMN vocal_notes.audio_url IS 'S3-compatible URL or Supabase Storage path (encrypted)';

-- ============================================================================
-- 9. ARMOR BREACH & RISK MONITORING
-- ============================================================================

CREATE TABLE IF NOT EXISTS armor_breaches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  breach_type VARCHAR(50) CHECK (breach_type IN ('soft', 'hard')),
  breach_level_percent DECIMAL(5, 2),
  description TEXT,
  webhook_triggered BOOLEAN DEFAULT FALSE,
  breach_timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_armor_breaches_account_id ON armor_breaches(account_id);
CREATE INDEX idx_armor_breaches_timestamp ON armor_breaches(breach_timestamp);

COMMENT ON TABLE armor_breaches IS 'Risk breach events: soft (50% MDL), hard (100% MDL) for real-time Armor alerts';
COMMENT ON COLUMN armor_breaches.breach_type IS 'soft = warning (50%), hard = critical (100% max daily loss reached)';

-- ============================================================================
-- 10. WEBHOOK INTEGRATION & EVENTS
-- ============================================================================

CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  event_type VARCHAR(100) CHECK (event_type IN ('armor_breach', 'trade_created', 'trade_closed', 'metrics_update', 'vault_breach')),
  webhook_url VARCHAR(500) NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  next_retry_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'aborted')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_webhook_events_account_id ON webhook_events(account_id);
CREATE INDEX idx_webhook_events_status_retry ON webhook_events(status, next_retry_at) WHERE status = 'pending';

COMMENT ON TABLE webhook_events IS 'Outgoing webhook events with retry logic and payload storage (JSONB)';
COMMENT ON COLUMN webhook_events.payload IS 'JSONB: event-specific data (trade details, metrics, breach details)';

-- ============================================================================
-- 11. INSTITUTIONAL INTELLIGENCE (Phase 3 prep, Phase 1 structure)
-- ============================================================================

CREATE TABLE IF NOT EXISTS whale_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol VARCHAR(20) NOT NULL,
  whale_flow_direction VARCHAR(50) CHECK (whale_flow_direction IN ('buy', 'sell', 'accumulation', 'distribution')),
  correlated_trade_ids JSONB DEFAULT '[]',
  event_timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_whale_events_symbol ON whale_events(symbol);
CREATE INDEX idx_whale_events_timestamp ON whale_events(event_timestamp);

COMMENT ON TABLE whale_events IS 'Whale flow detection events (Phase 3 feature, populated later)';
COMMENT ON COLUMN whale_events.correlated_trade_ids IS 'JSONB: [trade_id, ...] trades affected by whale flow';

CREATE TABLE IF NOT EXISTS oracle_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol VARCHAR(20) NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  pre_trade_score INTEGER CHECK (pre_trade_score BETWEEN 0 AND 100),
  whale_flow_score DECIMAL(5, 2),
  cot_score DECIMAL(5, 2),
  shadow_index_score DECIMAL(5, 2),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_oracle_scores_symbol ON oracle_scores(symbol);
CREATE INDEX idx_oracle_scores_timestamp ON oracle_scores(timestamp);

COMMENT ON TABLE oracle_scores IS 'Oracle consensus scores for pre-trade signals (Phase 3 feature)';
COMMENT ON COLUMN oracle_scores.pre_trade_score IS 'Composite score (0-100) for trade signal strength';

-- ============================================================================
-- 12. SESSION TRACKING & TILT DETECTION
-- ============================================================================

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  session_start TIMESTAMP NOT NULL DEFAULT NOW(),
  session_end TIMESTAMP,
  tilt_flag BOOLEAN DEFAULT FALSE,
  trades_count INTEGER DEFAULT 0,
  win_count INTEGER DEFAULT 0,
  loss_count INTEGER DEFAULT 0,
  session_pnl DECIMAL(15, 8),
  max_session_loss DECIMAL(15, 8),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_account_id ON sessions(account_id);
CREATE INDEX idx_sessions_session_start ON sessions(session_start);

COMMENT ON TABLE sessions IS 'Trading sessions with tilt detection (emotional state monitoring)';
COMMENT ON COLUMN sessions.tilt_flag IS 'TRUE if trader detected to be in tilt (psychological alert)';

-- ============================================================================
-- 13. AUDIT TRAIL (KYC/AML COMPLIANCE)
-- ============================================================================

CREATE TABLE IF NOT EXISTS audit_trail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name VARCHAR(100) NOT NULL,
  record_id UUID NOT NULL,
  operation VARCHAR(20) CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
  old_values JSONB,
  new_values JSONB,
  changed_by UUID REFERENCES users(id),
  audit_timestamp TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_trail_table_record ON audit_trail(table_name, record_id);
CREATE INDEX idx_audit_trail_timestamp ON audit_trail(audit_timestamp);

COMMENT ON TABLE audit_trail IS 'Immutable audit log for KYC/AML compliance (triggered on INSERT/UPDATE of critical tables)';
COMMENT ON COLUMN audit_trail.operation IS 'Database operation: INSERT, UPDATE, or DELETE';
COMMENT ON COLUMN audit_trail.old_values IS 'JSONB: previous row values (NULL for INSERT)';
COMMENT ON COLUMN audit_trail.new_values IS 'JSONB: new row values (NULL for DELETE)';

-- ============================================================================
-- 14. AUDIT TRAIL LOGGING FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION log_audit_trail()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_trail (table_name, record_id, operation, new_values, changed_by, audit_timestamp)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(NEW), auth.uid(), NOW());
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_trail (table_name, record_id, operation, old_values, new_values, changed_by, audit_timestamp)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(OLD), row_to_json(NEW), auth.uid(), NOW());
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_trail (table_name, record_id, operation, old_values, changed_by, audit_timestamp)
    VALUES (TG_TABLE_NAME, OLD.id, TG_OP, row_to_json(OLD), auth.uid(), NOW());
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SCHEMA SUMMARY
-- ============================================================================
-- Tables created: 15 (users, accounts, broker_connections, trades, sync_logs,
--                     daily_snapshots, kpi_snapshots, emotion_logs, vocal_notes,
--                     armor_breaches, webhook_events, whale_events, oracle_scores,
--                     sessions, audit_trail)
--
-- Key constraints:
-- - UNIQUE(broker_id, broker_trade_id, account_id) on trades for deduplication
-- - Foreign keys on all user-scoped tables for referential integrity
-- - CHECK constraints on status/type enums
--
-- Indices created:
-- - Account foreign keys (fast lookups)
-- - Timestamp columns (for queries by date)
-- - Deduplication (broker_trade_id)
-- - Daily snapshot dates (heatmap queries)
--
-- Next steps (in 002_rls_policies.sql):
-- - CREATE POLICY for all user-scoped tables
-- - Enforce row-level security via auth.uid()
-- ============================================================================
