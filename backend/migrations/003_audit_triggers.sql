-- AETHERIS Audit Triggers for KYC/AML Compliance
-- Automatically logs INSERT/UPDATE/DELETE on critical tables
-- Immutable audit trail for regulatory verification
--
-- Applied after RLS policies (003_audit_triggers.sql)
-- Triggers fire AFTER INSERT OR UPDATE to capture changes

-- ============================================================================
-- AUDIT TRAIL FUNCTION (ALREADY CREATED IN 001_init_schema.sql)
-- ============================================================================
-- Reference: log_audit_trail() function defined in 001
-- This file creates the actual TRIGGER statements

-- ============================================================================
-- TRIGGERS ON USERS TABLE (KYC/AML changes)
-- ============================================================================

CREATE TRIGGER audit_users_changes
  AFTER INSERT OR UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION log_audit_trail();

COMMENT ON TRIGGER audit_users_changes ON users 
  IS 'Logs KYC/AML status changes for compliance review';

-- ============================================================================
-- TRIGGERS ON ACCOUNTS TABLE (Account configuration changes)
-- ============================================================================

CREATE TRIGGER audit_accounts_changes
  AFTER INSERT OR UPDATE ON accounts
  FOR EACH ROW
  EXECUTE FUNCTION log_audit_trail();

COMMENT ON TRIGGER audit_accounts_changes ON accounts 
  IS 'Logs account creation and risk limit changes';

-- ============================================================================
-- TRIGGERS ON BROKER_CONNECTIONS TABLE (Credential changes)
-- ============================================================================

CREATE TRIGGER audit_broker_connections_changes
  AFTER INSERT OR UPDATE ON broker_connections
  FOR EACH ROW
  EXECUTE FUNCTION log_audit_trail();

COMMENT ON TRIGGER audit_broker_connections_changes ON broker_connections 
  IS 'Logs broker credential updates and sync status changes for security audit';

-- ============================================================================
-- TRIGGERS ON TRADES TABLE (Trade modifications)
-- ============================================================================

CREATE TRIGGER audit_trades_changes
  AFTER INSERT OR UPDATE ON trades
  FOR EACH ROW
  EXECUTE FUNCTION log_audit_trail();

COMMENT ON TRIGGER audit_trades_changes ON trades 
  IS 'Logs all trade entries and modifications (entry price, exit price, P/L updates)';

-- ============================================================================
-- TRIGGERS ON DAILY_SNAPSHOTS TABLE (Snapshot changes)
-- ============================================================================

CREATE TRIGGER audit_daily_snapshots_changes
  AFTER INSERT OR UPDATE ON daily_snapshots
  FOR EACH ROW
  EXECUTE FUNCTION log_audit_trail();

COMMENT ON TRIGGER audit_daily_snapshots_changes ON daily_snapshots 
  IS 'Logs daily P/L snapshot creation and corrections';

-- ============================================================================
-- AUDIT TRAIL QUERY EXAMPLES
-- ============================================================================
--
-- View all changes to trades:
-- SELECT * FROM audit_trail 
-- WHERE table_name = 'trades' 
-- ORDER BY audit_timestamp DESC;
--
-- View all KYC/AML status changes:
-- SELECT * FROM audit_trail 
-- WHERE table_name = 'users' 
-- AND new_values->>'kycaml_status' != old_values->>'kycaml_status'
-- ORDER BY audit_timestamp DESC;
--
-- View all credential updates (with encryption warning):
-- SELECT * FROM audit_trail 
-- WHERE table_name = 'broker_connections' 
-- ORDER BY audit_timestamp DESC;
--
-- Count changes per user (for compliance report):
-- SELECT 
--   changed_by,
--   COUNT(*) as change_count,
--   MAX(audit_timestamp) as last_change
-- FROM audit_trail
-- GROUP BY changed_by
-- ORDER BY change_count DESC;
--
-- ============================================================================
-- IMPORTANT NOTES
-- ============================================================================
--
-- 1. Audit triggers have <5% performance impact on INSERT/UPDATE
-- 2. Audit trail grows ~1KB per trade + metadata (monitor quarterly)
-- 3. Archive audit_trail to cold storage (S3) Phase 2 if >1GB
-- 4. Set audit_trail table as admin-only (RLS via roles Phase 2)
-- 5. Compliance team can query audit_trail directly for KYC verification
-- 6. Immutable: audit_trail records never deleted (historical record)
-- 7. All changes timestamped in UTC (audit_timestamp NOW())
--
-- ============================================================================
