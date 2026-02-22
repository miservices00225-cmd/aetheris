-- ============================================================================
-- EMERGENCY FIX: Create audit_trail table if missing
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

CREATE INDEX IF NOT EXISTS idx_audit_trail_table_record ON audit_trail(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_trail_timestamp ON audit_trail(audit_timestamp);

COMMENT ON TABLE audit_trail IS 'Immutable audit log for KYC/AML compliance (triggered on INSERT/UPDATE of critical tables)';
COMMENT ON COLUMN audit_trail.operation IS 'Database operation: INSERT, UPDATE, or DELETE';
COMMENT ON COLUMN audit_trail.old_values IS 'JSONB: previous row values (NULL for INSERT)';
COMMENT ON COLUMN audit_trail.new_values IS 'JSONB: new row values (NULL for DELETE)';

-- ============================================================================
-- Also ensure log_audit_trail() function exists and is secure
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

-- Secure the function
ALTER FUNCTION log_audit_trail() SET search_path = '';
