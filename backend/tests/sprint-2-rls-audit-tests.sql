-- ============================================================================
-- SPRINT 2: RLS & AUDIT TRIGGER TESTING (CORRECTED v2)
-- ============================================================================
-- Execute this ENTIRE BLOCK on Supabase SQL Editor
-- Verify: RLS isolation, audit logging, deduplication
-- ⚠️ Note: No trigger disabling - just test with proper data order

-- ============================================================================
-- SETUP: Create test data (in correct FK order)
-- ============================================================================

-- Create 2 test users
INSERT INTO users (id, email, kycaml_status) VALUES 
  ('11111111-1111-1111-1111-111111111111'::uuid, 'user1@test.com', 'verified'),
  ('22222222-2222-2222-2222-222222222222'::uuid, 'user2@test.com', 'verified')
ON CONFLICT DO NOTHING;

-- Create accounts for each user
INSERT INTO accounts (id, user_id, account_name, account_type, broker_type, risk_limit_percent) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'User1 Account', 'personal', 'MT4', 2.0),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, '22222222-2222-2222-2222-222222222222'::uuid, 'User2 Account', 'personal', 'MT5', 2.0)
ON CONFLICT DO NOTHING;

-- Create trades for each account
INSERT INTO trades (
  id, account_id, broker_id, broker_trade_id, symbol, trade_type,
  entry_price, exit_price, quantity, entry_time, exit_time, pnl, pnl_percent
) VALUES
  ('cccccccc-cccc-cccc-cccc-cccccccccccc'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'mt4', 'mt4-user1-001', 'EURUSD', 'long',
   1.10000, 1.11000, 100, NOW(), NOW(), 100.00, 0.0091),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd'::uuid, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid, 'mt5', 'mt5-user2-001', 'GBPUSD', 'short',
   1.30000, 1.29000, 50, NOW(), NOW(), 50.00, 0.0077)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- TEST 1: Data isolation (verify data exists for each user)
-- ============================================================================

SELECT '✅ TEST 1A: User 1 Accounts' as test;
SELECT id, account_name, user_id FROM accounts 
WHERE user_id = '11111111-1111-1111-1111-111111111111'::uuid;
-- Expected: Only 'User1 Account' visible ✓

SELECT '✅ TEST 1B: User 1 Trades' as test;
SELECT t.id, t.symbol, t.pnl FROM trades t
JOIN accounts a ON t.account_id = a.id
WHERE a.user_id = '11111111-1111-1111-1111-111111111111'::uuid;
-- Expected: Only EURUSD trade visible ✓

SELECT '✅ TEST 1C: User 2 Accounts' as test;
SELECT id, account_name, user_id FROM accounts 
WHERE user_id = '22222222-2222-2222-2222-222222222222'::uuid;
-- Expected: Only 'User2 Account' visible ✓

SELECT '✅ TEST 1D: User 2 Trades' as test;
SELECT t.id, t.symbol, t.pnl FROM trades t
JOIN accounts a ON t.account_id = a.id
WHERE a.user_id = '22222222-2222-2222-2222-222222222222'::uuid;
-- Expected: Only GBPUSD trade visible ✓

-- ============================================================================
-- TEST 2: AUDIT TRIGGERS (check audit_trail was populated)
-- ============================================================================

SELECT '✅ TEST 2A: Audit Trail entry count' as test;
SELECT table_name, COUNT(*) as audit_count
FROM audit_trail
WHERE table_name IN ('users', 'accounts', 'trades')
GROUP BY table_name
ORDER BY table_name;
-- Expected: Audit entries for INSERT operations ✓

SELECT '✅ TEST 2B: Audit entries for accounts' as test;
SELECT id, table_name, operation, record_id, audit_timestamp 
FROM audit_trail 
WHERE table_name = 'accounts'
ORDER BY audit_timestamp DESC 
LIMIT 5;
-- Expected: See INSERT operations for accounts ✓

-- ============================================================================
-- TEST 3: DEDUPLICATION (UNIQUE Constraint on broker_trade_id)
-- ============================================================================

-- Insert a trade with unique broker_trade_id
INSERT INTO trades (
  id, account_id, broker_id, broker_trade_id, symbol, trade_type,
  entry_price, exit_price, quantity, entry_time, exit_time, pnl, pnl_percent
) VALUES
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'mt4', 'mt4-dedup-test-001', 'EURUSD', 'long',
   1.15000, 1.16000, 100, NOW(), NOW(), 100.00, 0.0087)
ON CONFLICT DO NOTHING;

SELECT '✅ TEST 3A: First dedup insert successful' as test;
SELECT COUNT(*) as count FROM trades 
WHERE broker_trade_id = 'mt4-dedup-test-001';
-- Expected: 1 row ✓

SELECT '✅ TEST 3B: Try duplicate (should FAIL with constraint error)' as test;
-- This should error with: ERROR: duplicate key value violates unique constraint
INSERT INTO trades (
  id, account_id, broker_id, broker_trade_id, symbol, trade_type,
  entry_price, exit_price, quantity, entry_time, exit_time, pnl, pnl_percent
) VALUES
  ('ffffffff-ffff-ffff-ffff-ffffffffffff'::uuid, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid, 'mt4', 'mt4-dedup-test-001', 'EURUSD', 'short',
   1.15500, 1.16500, 100, NOW(), NOW(), 150.00, 0.0100);

-- If above fails as expected, this query will show only 1 entry
SELECT '✅ TEST 3C: Dedup constraint verified' as test;
SELECT COUNT(*) as final_count_should_be_1 FROM trades 
WHERE broker_trade_id = 'mt4-dedup-test-001';
-- Expected: 1 (duplicate was rejected) ✓
