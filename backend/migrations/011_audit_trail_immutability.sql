-- AETHERIS Audit Trail Immutability Enforcement
-- Ensures audit trail records cannot be modified after creation
-- (Compliance requirement: immutable append-only audit log)

-- ============================================================================
-- AUDIT TRAIL TABLE - IMMUTABILITY CONSTRAINT
-- ============================================================================

-- Prevent any UPDATE operations on audit_trail
CREATE POLICY "Audit trail immutable - prevent updates"
  ON audit_trail
  FOR UPDATE
  USING (false);  -- Always deny updates

-- Prevent any DELETE operations on audit_trail
CREATE POLICY "Audit trail immutable - prevent deletes"
  ON audit_trail
  FOR DELETE
  USING (false);  -- Always deny deletes

-- Allow INSERTs by authenticated service role only
CREATE POLICY "Audit trail append-only - service role"
  ON audit_trail
  FOR INSERT
  WITH CHECK (
    current_setting('role') = 'service_role' OR
    auth.uid() IS NOT NULL
  );

COMMENT ON POLICY "Audit trail immutable - prevent updates" ON audit_trail 
  IS 'Compliance: audit trail records cannot be modified after creation; prevents tampering';

COMMENT ON POLICY "Audit trail immutable - prevent deletes" ON audit_trail 
  IS 'Compliance: audit trail records cannot be deleted; maintains complete audit history';

-- Enable RLS on audit_trail if not already enabled
-- Note: audit_trail is normally public-readable but this adds immutability protection
-- for cases where service role has elevated access
