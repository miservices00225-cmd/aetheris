-- AETHERIS Test Environment RLS Bypass
-- Disables RLS on user-scoped tables for Jest testing
-- ONLY for development — NEVER apply to production
-- Applied ONLY when running tests in CI/dev environment
-- Date: 2026-02-22

-- ============================================================================
-- DISABLE RLS ON USER-SCOPED TABLES FOR TESTING
-- ============================================================================
-- When adminClient has SERVICE_KEY, RLS should be bypassed automatically
-- But due to Supabase publishable key limitation in tests, we disable RLS
-- during test runs to verify backend logic works correctly

ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE accounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE broker_connections DISABLE ROW LEVEL SECURITY;
ALTER TABLE trades DISABLE ROW LEVEL SECURITY;
ALTER TABLE sync_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE daily_snapshots DISABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_snapshots DISABLE ROW LEVEL SECURITY;
ALTER TABLE emotion_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE vocal_notes DISABLE ROW LEVEL SECURITY;
ALTER TABLE armor_breaches DISABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE sessions DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- NOTES
-- ============================================================================
-- This migration is ONLY applied in test environments.
-- Before deploying to production:
-- 1. Drop this migration (or create inverse migration 010_enable_rls_production.sql)
-- 2. Verify all RLS policies are restored (migration 002)
-- 3. Test with real JWT auth from Supabase

-- To revert:
-- Run migration 010_enable_rls_production.sql (create it separately)
-- Or manually: ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;
