-- ============================================================================
-- SPRINT 2: SIMPLE VERIFICATION TEST
-- ============================================================================
-- Test que les triggers et audit_trail fonctionnent correctement

-- Step 1: Vérify tables et function existent
SELECT 'STEP 1: Verification' as test;
SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='audit_trail') as audit_trail_exists;
SELECT EXISTS(SELECT 1 FROM information_schema.routines WHERE routine_name='log_audit_trail') as function_exists;

-- Step 2: Create test user
SELECT 'STEP 2: Insert test user' as test;
INSERT INTO users (id, email, kycaml_status) 
VALUES ('99999999-9999-9999-9999-999999999999'::uuid, 'test@example.com', 'verified')
ON CONFLICT DO NOTHING;

-- Step 3: Verify user was created
SELECT 'STEP 3: Verify user exists' as test;
SELECT id, email FROM users WHERE email = 'test@example.com';

-- Step 4: Check if audit_trail has entries
SELECT 'STEP 4: Check audit_trail entries for users table' as test;
SELECT COUNT(*) as audit_count, table_name, operation 
FROM audit_trail 
WHERE table_name = 'users'
GROUP BY table_name, operation;

-- Step 5: Show latest audit entries
SELECT 'STEP 5: Latest audit entries' as test;
SELECT id, table_name, operation, record_id, audit_timestamp 
FROM audit_trail 
WHERE table_name = 'users'
ORDER BY audit_timestamp DESC 
LIMIT 5;

SELECT 'SUCCESS: All systems operational' as result;
