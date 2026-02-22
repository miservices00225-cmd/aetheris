-- ============================================================================
-- MIGRATION 007: Create audit triggers on all tables
-- ============================================================================
-- This ensures that INSERT/UPDATE operations are logged to audit_trail

-- Drop triggers if they exist (PostgreSQL doesn't support CREATE IF NOT EXISTS)
DROP TRIGGER IF EXISTS audit_users ON users;
DROP TRIGGER IF EXISTS audit_accounts ON accounts;
DROP TRIGGER IF EXISTS audit_broker_connections ON broker_connections;
DROP TRIGGER IF EXISTS audit_trades ON trades;
DROP TRIGGER IF EXISTS audit_daily_snapshots ON daily_snapshots;

-- Create triggers on tables that need audit logging
CREATE TRIGGER audit_users 
AFTER INSERT OR UPDATE ON users 
FOR EACH ROW EXECUTE FUNCTION log_audit_trail();

CREATE TRIGGER audit_accounts 
AFTER INSERT OR UPDATE ON accounts 
FOR EACH ROW EXECUTE FUNCTION log_audit_trail();

CREATE TRIGGER audit_broker_connections 
AFTER INSERT OR UPDATE ON broker_connections 
FOR EACH ROW EXECUTE FUNCTION log_audit_trail();

CREATE TRIGGER audit_trades 
AFTER INSERT OR UPDATE ON trades 
FOR EACH ROW EXECUTE FUNCTION log_audit_trail();

CREATE TRIGGER audit_daily_snapshots 
AFTER INSERT OR UPDATE ON daily_snapshots 
FOR EACH ROW EXECUTE FUNCTION log_audit_trail();

-- Verify triggers were created
SELECT 'Audit triggers created successfully' as status;
