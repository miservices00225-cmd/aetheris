-- ============================================================================
-- MIGRATION 008: Fix log_audit_trail() function to properly capture record_id
-- ============================================================================

DROP FUNCTION IF EXISTS log_audit_trail() CASCADE;

CREATE FUNCTION log_audit_trail()
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

ALTER FUNCTION log_audit_trail() SET search_path = '';

SELECT 'log_audit_trail() function fixed' as status;
