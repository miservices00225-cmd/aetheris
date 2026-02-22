-- AETHERIS Re-enable RLS for Production
-- Restores row-level security after test environment disabling (migration 009)
-- ONLY apply to production environments when deploying to live
-- Date: 2026-02-22

-- ============================================================================
-- RE-ENABLE RLS ON ALL USER-SCOPED TABLES FOR PRODUCTION
-- ============================================================================
-- Migration 009 disabled RLS for testing with publishable key
-- This migration restores RLS for production deployment with proper SERVICE_KEY

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

-- Note: RLS policies were created in migration 002
-- This migration simply re-enables them after testing
-- Policies remain active; this command just flips the RLS flag
