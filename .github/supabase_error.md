-- ============================================================================
-- TEST 1: RLS ISOLATION (2 Users, 2 Accounts, 2 Trades)
-- ============================================================================
Error: Failed to run sql query: ERROR: 42P01: relation "audit_trail" does not exist QUERY: INSERT INTO audit_trail (table_name, record_id, operation, new_values, changed_by, audit_timestamp) VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(NEW), auth.uid(), NOW()) CONTEXT: PL/pgSQL function public.log_audit_trail() line 4 at SQL statement 

-- ============================================================================
-- TEST 2: AUDIT TRIGGERS
-- ============================================================================
Error: Failed to run sql query: ERROR: 42703: column "recorded_at" does not exist LINE 7: SELECT id, table_name, operation, changed_by, recorded_at ^ 

-- ============================================================================
-- TEST 3: DEDUPLICATION (UNIQUE Constraint)
-- ============================================================================
Error: Failed to run sql query: ERROR: 23503: insert or update on table "trades" violates foreign key constraint "trades_account_id_fkey" DETAIL: Key (account_id)=(aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa) is not present in table "accounts".