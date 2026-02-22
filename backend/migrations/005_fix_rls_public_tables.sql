-- AETHERIS RLS Fix for Public Tables
-- Addresses Supabase Security Advisor warnings
-- Enables RLS on 4 public tables with appropriate policies
-- Date: 2026-02-22

-- ============================================================================
-- ISSUE: 4 tables flagged as "RLS Disabled in Public"
-- - prop_firm_templates: Shared config (read-only, public)
-- - whale_events: Institutional data (Phase 3, read-only)
-- - oracle_scores: Institutional data (Phase 3, read-only)  
-- - audit_trail: Compliance logging (admin-only, no public access)
-- ============================================================================

-- ============================================================================
-- 1. PROP_FIRM_TEMPLATES — Enable RLS (public read-only)
-- ============================================================================
-- Strategy: Public can read templates, nobody can write
-- Use case: All traders view FTMO/MyForexFunds rules

ALTER TABLE prop_firm_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "prop_firm_templates_public_read"
  ON prop_firm_templates
  FOR SELECT
  USING (TRUE);  -- Everyone can read

COMMENT ON POLICY "prop_firm_templates_public_read" ON prop_firm_templates
  IS 'Public read access to prop firm templates (FTMO, MyForexFunds, etc)';

-- Prevent inserts/updates/deletes (only admins via bypass)
CREATE POLICY "prop_firm_templates_no_write"
  ON prop_firm_templates
  FOR INSERT
  WITH CHECK (FALSE);

CREATE POLICY "prop_firm_templates_no_update"
  ON prop_firm_templates
  FOR UPDATE
  USING (FALSE);

CREATE POLICY "prop_firm_templates_no_delete"
  ON prop_firm_templates
  FOR DELETE
  USING (FALSE);

-- ============================================================================
-- 2. WHALE_EVENTS — Enable RLS (public read-only, Phase 3)
-- ============================================================================
-- Strategy: Public can read whale events, only service role can write
-- Use case: Institutional intelligence feed (Phase 3)

ALTER TABLE whale_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "whale_events_public_read"
  ON whale_events
  FOR SELECT
  USING (TRUE);  -- Everyone can read

COMMENT ON POLICY "whale_events_public_read" ON whale_events
  IS 'Public read access to whale flow events (institutional intelligence Phase 3)';

CREATE POLICY "whale_events_no_user_write"
  ON whale_events
  FOR INSERT
  WITH CHECK (FALSE);  -- Users cannot insert (only service role via bypass)

CREATE POLICY "whale_events_no_user_update"
  ON whale_events
  FOR UPDATE
  USING (FALSE);

CREATE POLICY "whale_events_no_user_delete"
  ON whale_events
  FOR DELETE
  USING (FALSE);

-- ============================================================================
-- 3. ORACLE_SCORES — Enable RLS (public read-only, Phase 3)
-- ============================================================================
-- Strategy: Public can read oracle scores, only service role can write
-- Use case: Pre-trade signals (Phase 3)

ALTER TABLE oracle_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "oracle_scores_public_read"
  ON oracle_scores
  FOR SELECT
  USING (TRUE);  -- Everyone can read

COMMENT ON POLICY "oracle_scores_public_read" ON oracle_scores
  IS 'Public read access to oracle consensus scores (pre-trade signals Phase 3)';

CREATE POLICY "oracle_scores_no_user_write"
  ON oracle_scores
  FOR INSERT
  WITH CHECK (FALSE);

CREATE POLICY "oracle_scores_no_user_update"
  ON oracle_scores
  FOR UPDATE
  USING (FALSE);

CREATE POLICY "oracle_scores_no_user_delete"
  ON oracle_scores
  FOR DELETE
  USING (FALSE);

-- ============================================================================
-- 4. AUDIT_TRAIL — Enable RLS (admin/compliance-only, no public access)
-- ============================================================================
-- Strategy: Nobody can read/write via normal auth
-- Only admins via service role bypass can access
-- Use case: Immutable compliance log

ALTER TABLE audit_trail ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_trail_no_access"
  ON audit_trail
  FOR SELECT
  USING (FALSE);  -- Nobody can read (triggers fire via service role only)

COMMENT ON POLICY "audit_trail_no_access" ON audit_trail
  IS 'Audit trail is admin-only; accessed via service role with bypass enabled';

CREATE POLICY "audit_trail_no_user_insert"
  ON audit_trail
  FOR INSERT
  WITH CHECK (FALSE);

CREATE POLICY "audit_trail_no_user_update"
  ON audit_trail
  FOR UPDATE
  USING (FALSE);

CREATE POLICY "audit_trail_no_user_delete"
  ON audit_trail
  FOR DELETE
  USING (FALSE);

-- ============================================================================
-- SUMMARY OF CHANGES
-- ============================================================================
-- Table                 | RLS Status | Policy Summary
-- ─────────────────────────────────────────────────────────────────────────
-- prop_firm_templates   | ENABLED    | Public read, no writes (config only)
-- whale_events          | ENABLED    | Public read, service-only write
-- oracle_scores         | ENABLED    | Public read, service-only write
-- audit_trail           | ENABLED    | Admin-only (no user access)
--
-- Impact:
-- ✓ All 4 tables now have RLS enabled (Security Advisor ✓)
-- ✓ Public read access preserved for templates/whale/oracle
-- ✓ Write access restricted to service role (backend only)
-- ✓ Audit trail completely locked (compliance requirement)
--
-- Migration applied: 2026-02-22
-- Estimated execution time: <1s
-- ============================================================================
