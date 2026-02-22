## 1. Supabase Client Setup

- [ ] 1.1 Create backend/src/config/supabase.ts with admin and anon client initialization
- [ ] 1.2 Load VITE_SUPABASE_URL and SERVICE_KEY from .env.local
- [ ] 1.3 Export both admin (service role) and anon (JWT) clients
- [ ] 1.4 Add credential validation - throw error if VITE_SUPABASE_URL missing
- [ ] 1.5 Test client initialization with backend server start (`npm run dev`)

## 2. Trade CRUD Helpers

- [ ] 2.1 Create backend/src/database/trades.ts module
- [ ] 2.2 Implement insertTrade(accountId, tradeData) with typed return Promise<Trade>
- [ ] 2.3 Implement detectDuplicate(brokerId, brokerTradeId, accountId) → Promise<Trade | null>
- [ ] 2.4 Implement selectTrades(accountId, startDate?, endDate?) → Promise<Trade[]>
- [ ] 2.5 Implement updateTrade(tradeId, updates) → Promise<Trade>
- [ ] 2.6 Add DatabaseError handling to all functions

## 3. Account CRUD Helpers

- [ ] 3.1 Create backend/src/database/accounts.ts module
- [ ] 3.2 Implement createAccount(userId, accountData) → Promise<Account>
- [ ] 3.3 Implement selectAccounts(userId) → Promise<Account[]>
- [ ] 3.4 Implement updateRiskLimits(accountId, limits) → Promise<Account>
- [ ] 3.5 Implement selectByRiskViolation() → Promise<Account[]> for admin queries
- [ ] 3.6 Add RLS checks - ensure user can only access their own accounts

## 4. Audit Query Helpers

- [ ] 4.1 Create backend/src/database/audit.ts module
- [ ] 4.2 Implement queryAuditTrail(userId) → Promise<AuditEntry[]>
- [ ] 4.3 Implement queryUserAuditTrail(userId) → Promise<AuditEntry[]>
- [ ] 4.4 Implement exportAuditCSV(userId) → Promise<Buffer>
- [ ] 4.5 Format CSV headers: table_name, record_id, operation, timestamp, old_values, new_values
- [ ] 4.6 Test audit export with compliance team requirements

## 5. Daily Snapshot Helpers

- [ ] 5.1 Create backend/src/database/dailySnapshots.ts module
- [ ] 5.2 Implement createDailySnapshot(accountId, date) → Promise<DailySnapshot>
- [ ] 5.3 Calculate net_pnl, trade_count, win_count from trades
- [ ] 5.4 Implement selectSnapshots(accountId, startDate, endDate) → Promise<DailySnapshot[]>
- [ ] 5.5 Ensure snapshot date is UTC
- [ ] 5.6 Add index usage verification (query <500ms latency)

## 6. Deduplication Logic

- [ ] 6.1 Update trades.ts insertTrade() to call detectDuplicate() before insert
- [ ] 6.2 Implement conflictResolve(strategy: 'IGNORE' | 'OVERWRITE', existing, incoming) → Trade
- [ ] 6.3 For IGNORE: return existing trade unchanged
- [ ] 6.4 For OVERWRITE: update exit_price, exit_time, pnl if different
- [ ] 6.5 Add sync logging: track trades_new, trades_duplicate, trades_updated counts
- [ ] 6.6 Ensure UNIQUE constraint triggers on duplicate insert

## 7. Error Handling & DatabaseError Class

- [ ] 7.1 Create backend/src/database/errors.ts with DatabaseError class
- [ ] 7.2 Extend Error with operation, table, recordId fields
- [ ] 7.3 Add custom message formatting for common errors (FK constraint, UNIQUE constraint, RLS)
- [ ] 7.4 Catch all Supabase errors and wrap with DatabaseError
- [ ] 7.5 Add optional retry logic for transient errors

## 8. Jest Test Suite Setup

- [ ] 8.1 Create backend/src/__tests__/database.test.ts
- [ ] 8.2 Configure Jest for Node.js environment (jest.config.js or package.json)
- [ ] 8.3 Load .env.local in test setup
- [ ] 8.4 Set test timeout to 10s (DB operations may be slower)
- [ ] 8.5 Create beforeAll() hook for test data setup (test users, accounts)
- [ ] 8.6 Create beforeEach() hook for test isolation
- [ ] 8.7 Create afterAll() hook for cleanup

## 9. Trade CRUD Tests

- [ ] 9.1 Test insertTrade() with valid data - verify return includes id
- [ ] 9.2 Test insertTrade() with duplicate broker_trade_id - verify error thrown
- [ ] 9.3 Test selectTrades() returns correct account's trades only
- [ ] 9.4 Test updateTrade() updates exit_price correctly
- [ ] 9.5 Test detectDuplicate() returns true for existing
- [ ] 9.6 Test detectDuplicate() returns false for non-existent

## 10. Account CRUD Tests

- [ ] 10.1 Test createAccount() creates account linked to user
- [ ] 10.2 Test selectAccounts() returns only user's accounts
- [ ] 10.3 Test updateRiskLimits() updates max_drawdown_percent
- [ ] 10.4 Test updateRiskLimits() fails if user doesn't own account

## 11. Audit Query Tests

- [ ] 11.1 Test queryAuditTrail() returns entries for user
- [ ] 11.2 Test audit entries include INSERT operations from test inserts
- [ ] 11.3 Test exportAuditCSV() returns valid CSV buffer
- [ ] 11.4 Test CSV includes correct columns and rows

## 12. RLS Isolation Tests

- [ ] 12.1 Create test users User A and User B with separate accounts
- [ ] 12.2 Test User A cannot see User B's accounts (RLS enforced)
- [ ] 12.3 Test User A cannot update User B's trades (RLS enforced)
- [ ] 12.4 Test admin/service role can see all accounts (RLS bypass)

## 13. Deduplication Tests

- [ ] 13.1 Test IGNORE strategy - duplicate insert discarded, count = 1
- [ ] 13.2 Test OVERWRITE strategy - duplicate insert updates fields
- [ ] 13.3 Test audit_trail records UPDATE operation for OVERWRITE
- [ ] 13.4 Test sync logging counts duplicates correctly
- [ ] 13.5 Test idempotent import - same trades imported twice, final state same

## 14. Error Handling Tests

- [ ] 14.1 Test insert with invalid account_id - verify FK constraint error
- [ ] 14.2 Test insert with NULL entry_price - verify NOT NULL error
- [ ] 14.3 Test connection error handling - verify graceful failure
- [ ] 14.4 Test error message clarity - developer can debug from message

## 15. Test Cleanup & Final Verification

- [ ] 15.1 Implement cleanup in afterAll() - delete test trades, accounts, users
- [ ] 15.2 Run full test suite: `npm run test`
- [ ] 15.3 Verify all 20+ tests pass with exit code 0
- [ ] 15.4 Check coverage (optional - Jest will report)
- [ ] 15.5 No test data remains in database after cleanup
- [ ] 15.6 Verify no console.log or debug statements in production code

## 16. Code Quality & Documentation

- [ ] 16.1 Ensure all functions have explicit return types (no `any`)
- [ ] 16.2 Add JSDoc comments to all exported functions
- [ ] 16.3 Add inline comments for complex dedup logic
- [ ] 16.4 Run `npm run lint` - fix any linting errors
- [ ] 16.5 Verify TypeScript strict mode (`npx tsc --noEmit`)

## 17. Integration & Final Commit

- [ ] 17.1 Verify backend/src/config/supabase.ts exports both clients
- [ ] 17.2 Verify all helpers can be imported without errors
- [ ] 17.3 Run `npm run dev` - server starts without errors
- [ ] 17.4 Run full test suite one final time - all passing
- [ ] 17.5 Git commit: "feat(backend): Sprint 3 complete - Supabase integration ready"
- [ ] 17.6 Git push to origin/main
