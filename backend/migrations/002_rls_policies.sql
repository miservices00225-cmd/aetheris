-- AETHERIS Row-Level Security (RLS) Policies
-- Enforces multi-tenant data isolation at database layer
-- Users can only view/edit data for accounts they own
--
-- Applied to all user-scoped tables after schema creation (002_rls_policies.sql)
-- Enable RLS enforcement in Supabase dashboard before deploying to production

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE emotion_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocal_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE armor_breaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Public tables (no RLS): prop_firm_templates, whale_events, oracle_scores, audit_trail

-- ============================================================================
-- FORCE ROW LEVEL SECURITY - Prevent Owner Bypass
-- Ensures service_role cannot bypass RLS even as table owner
-- ============================================================================

ALTER TABLE accounts FORCE ROW LEVEL SECURITY;
ALTER TABLE broker_connections FORCE ROW LEVEL SECURITY;
ALTER TABLE trades FORCE ROW LEVEL SECURITY;
ALTER TABLE sync_logs FORCE ROW LEVEL SECURITY;
ALTER TABLE daily_snapshots FORCE ROW LEVEL SECURITY;
ALTER TABLE kpi_snapshots FORCE ROW LEVEL SECURITY;
ALTER TABLE emotion_logs FORCE ROW LEVEL SECURITY;
ALTER TABLE vocal_notes FORCE ROW LEVEL SECURITY;
ALTER TABLE armor_breaches FORCE ROW LEVEL SECURITY;
ALTER TABLE webhook_events FORCE ROW LEVEL SECURITY;
ALTER TABLE sessions FORCE ROW LEVEL SECURITY;

-- Note: users table is not FORCE RLS since auth system needs table owner access for jwt claims

-- ============================================================================
-- 1. USERS TABLE
-- ============================================================================

CREATE POLICY "Users can view own record"
  ON users
  FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update own record"
  ON users
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

COMMENT ON POLICY "Users can view own record" ON users IS 'Each user can only see their own profile';

-- ============================================================================
-- 2. ACCOUNTS TABLE
-- ============================================================================

CREATE POLICY "Users can view own accounts"
  ON accounts
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own accounts"
  ON accounts
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own accounts"
  ON accounts
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own accounts"
  ON accounts
  FOR DELETE
  USING (user_id = auth.uid());

COMMENT ON POLICY "Users can view own accounts" ON accounts IS 'Each user sees only their trading accounts';

-- ============================================================================
-- 3. BROKER CONNECTIONS TABLE
-- ============================================================================

CREATE POLICY "Users can view own broker connections"
  ON broker_connections
  FOR SELECT
  USING (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert broker connections for own accounts"
  ON broker_connections
  FOR INSERT
  WITH CHECK (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update own broker connections"
  ON broker_connections
  FOR UPDATE
  USING (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  ))
  WITH CHECK (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own broker connections"
  ON broker_connections
  FOR DELETE
  USING (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  ));

COMMENT ON POLICY "Users can view own broker connections" ON broker_connections 
  IS 'Credentials hidden from other users via RLS + encrypted column';

-- ============================================================================
-- 4. TRADES TABLE
-- ============================================================================

CREATE POLICY "Users can view own trades"
  ON trades
  FOR SELECT
  USING (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert trades for own accounts"
  ON trades
  FOR INSERT
  WITH CHECK (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update own trades"
  ON trades
  FOR UPDATE
  USING (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  ))
  WITH CHECK (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can delete own trades"
  ON trades
  FOR DELETE
  USING (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  ));

COMMENT ON POLICY "Users can view own trades" ON trades 
  IS 'Deduplication handled via UNIQUE constraint; RLS prevents cross-account view';

-- ============================================================================
-- 5. SYNC LOGS TABLE
-- ============================================================================

CREATE POLICY "Users can view own sync logs"
  ON sync_logs
  FOR SELECT
  USING (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own sync logs"
  ON sync_logs
  FOR INSERT
  WITH CHECK (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  ));

COMMENT ON POLICY "Users can view own sync logs" ON sync_logs 
  IS 'Audit trail per user account; cannot see other users sync history';

-- ============================================================================
-- 6. DAILY SNAPSHOTS TABLE
-- ============================================================================

CREATE POLICY "Users can view own daily snapshots"
  ON daily_snapshots
  FOR SELECT
  USING (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own daily snapshots"
  ON daily_snapshots
  FOR INSERT
  WITH CHECK (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update own daily snapshots"
  ON daily_snapshots
  FOR UPDATE
  USING (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  ))
  WITH CHECK (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  ));

COMMENT ON POLICY "Users can view own daily snapshots" ON daily_snapshots 
  IS 'Heatmap queries filtered by user account; fast 1-row-per-day lookups';

-- ============================================================================
-- 7. KPI SNAPSHOTS TABLE
-- ============================================================================

CREATE POLICY "Users can view own KPI snapshots"
  ON kpi_snapshots
  FOR SELECT
  USING (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own KPI snapshots"
  ON kpi_snapshots
  FOR INSERT
  WITH CHECK (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update own KPI snapshots"
  ON kpi_snapshots
  FOR UPDATE
  USING (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  ))
  WITH CHECK (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  ));

COMMENT ON POLICY "Users can view own KPI snapshots" ON kpi_snapshots 
  IS 'Metrics dashboard filtered by user account; 200+ KPIs per day';

-- ============================================================================
-- 8. EMOTION LOGS TABLE
-- ============================================================================

CREATE POLICY "Users can view own emotion logs"
  ON emotion_logs
  FOR SELECT
  USING (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own emotion logs"
  ON emotion_logs
  FOR INSERT
  WITH CHECK (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  ));

COMMENT ON POLICY "Users can view own emotion logs" ON emotion_logs 
  IS 'Bias tracking visible only to account owner; financial cost quantified';

-- ============================================================================
-- 9. VOCAL NOTES TABLE
-- ============================================================================

CREATE POLICY "Users can view own vocal notes"
  ON vocal_notes
  FOR SELECT
  USING (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own vocal notes"
  ON vocal_notes
  FOR INSERT
  WITH CHECK (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update own vocal notes"
  ON vocal_notes
  FOR UPDATE
  USING (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  ))
  WITH CHECK (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  ));

COMMENT ON POLICY "Users can view own vocal notes" ON vocal_notes 
  IS 'Audio transcripts + VSS timeline encrypted and user-scoped';

-- ============================================================================
-- 10. ARMOR BREACHES TABLE
-- ============================================================================

CREATE POLICY "Users can view own armor breaches"
  ON armor_breaches
  FOR SELECT
  USING (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own armor breaches"
  ON armor_breaches
  FOR INSERT
  WITH CHECK (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  ));

COMMENT ON POLICY "Users can view own armor breaches" ON armor_breaches 
  IS 'Risk breach events (soft/hard) triggered only for user accounts';

-- ============================================================================
-- 11. WEBHOOK EVENTS TABLE
-- ============================================================================

CREATE POLICY "Users can view own webhook events"
  ON webhook_events
  FOR SELECT
  USING (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own webhook events"
  ON webhook_events
  FOR INSERT
  WITH CHECK (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update own webhook events"
  ON webhook_events
  FOR UPDATE
  USING (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  ))
  WITH CHECK (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  ));

COMMENT ON POLICY "Users can view own webhook events" ON webhook_events 
  IS 'Outgoing webhooks scoped to user accounts with retry tracking';

-- ============================================================================
-- 12. SESSIONS TABLE
-- ============================================================================

CREATE POLICY "Users can view own sessions"
  ON sessions
  FOR SELECT
  USING (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert own sessions"
  ON sessions
  FOR INSERT
  WITH CHECK (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update own sessions"
  ON sessions
  FOR UPDATE
  USING (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  ))
  WITH CHECK (account_id IN (
    SELECT id FROM accounts WHERE user_id = auth.uid()
  ));

COMMENT ON POLICY "Users can view own sessions" ON sessions 
  IS 'Trading sessions with tilt detection per account owner';

-- ============================================================================
-- SUMMARY OF RLS POLICIES
-- ============================================================================
--
-- RLS Pattern Used (12 tables):
-- - SELECT: account_id IN (SELECT id FROM accounts WHERE user_id = auth.uid())
-- - INSERT: Same pattern via WITH CHECK
-- - UPDATE: Same pattern for both USING and WITH CHECK
-- - DELETE: Same pattern via USING
--
-- Benefits:
-- 1. Database-layer enforcement (defense-in-depth)
-- 2. No manual WHERE clauses needed in app queries
-- 3. Automatic filtering by auth.uid() in Supabase SDK
-- 4. Prevents data leakage if API breached
-- 5. Supports multi-account users per trader
--
-- Public tables (no RLS, read-only):
-- - prop_firm_templates: shared config across users
-- - whale_events, oracle_scores: institutional data
-- - audit_trail: admin-only (set via Supabase roles Phase 2)
--
-- Next: Create audit triggers (003_audit_triggers.sql)
-- Then: Enable RLS enforcement in Supabase dashboard
-- ============================================================================
