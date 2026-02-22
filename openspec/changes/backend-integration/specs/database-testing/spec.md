## ADDED Requirements

### Requirement: Jest Test Suite Setup

The system SHALL provide comprehensive Jest test suite for all database operations.

#### Scenario: Run all database tests
- **WHEN** `npm run test` is executed
- **THEN** Jest discovers and runs all tests in backend/src/__tests__/database.test.ts
- **AND** all 20+ tests pass with exit code 0
- **AND** test output shows: "PASS database.test.ts (N passed)"

#### Scenario: Test configuration
- **WHEN** Jest runs
- **THEN** test environment is configured for Node.js (not browser)
- **AND** dotenv loads .env.local for test credentials
- **AND** test timeout is set to 10s (longer for DB operations)

### Requirement: CRUD Operation Tests

The system SHALL test all CREATE, READ, UPDATE operations with valid and invalid data.

#### Scenario: Insert valid trade
- **WHEN** test calls insertTrade() with valid data
- **THEN** database returns inserted trade with UUID id
- **AND** audit_trail contains matching INSERT entry
- **AND** test assertion passes

#### Scenario: Insert duplicate trade
- **WHEN** test calls insertTrade() with duplicate broker_trade_id
- **THEN** database throws UNIQUE constraint error
- **AND** test catches error and validates error message
- **AND** test assertion verifies "Duplicate" in error

#### Scenario: Select trades for user
- **WHEN** test calls selectTrades(accountId)
- **THEN** function returns array of trade objects
- **AND** all trades have matching account_id
- **AND** trade objects have required fields (id, symbol, pnl, entry_time)

#### Scenario: Update trade exit price
- **WHEN** test calls updateTrade(tradeId, {exit_price: 1.11})
- **THEN** database updates exit_price field
- **AND** audit_trail shows old and new values
- **AND** pnl is recalculated correctly

### Requirement: RLS Policy Tests

The system SHALL test that RLS enforces multi-tenant isolation.

#### Scenario: User A cannot see User B trades
- **WHEN** test creates User A and User B with separate accounts
- **AND** test queries trades with User A context
- **THEN** User A sees only their trades
- **AND** User A does not see User B trades even if data exists

#### Scenario: User cannot update another user's trade
- **WHEN** test attempts updateTrade() with User A credentials on User B trade
- **THEN** database rejects update with RLS policy error
- **AND** no rows are modified
- **AND** test assertion verifies permission denied

#### Scenario: Service role bypasses RLS
- **WHEN** test uses admin client (service role)
- **THEN** admin can query all users' trades
- **AND** admin can update any trade
- **AND** RLS policies do not apply to service role

### Requirement: Deduplication Tests

The system SHALL test duplicate detection and conflict resolution strategies.

#### Scenario: detectDuplicate returns true for existing
- **WHEN** test inserts trade with broker_trade_id="test-001"
- **AND** calls detectDuplicate() with same broker_trade_id
- **THEN** function returns true
- **AND** returns existing trade record

#### Scenario: IGNORE strategy discards duplicate
- **WHEN** test inserts trade1 with broker_trade_id="dedup-001"
- **AND** attempts insert of trade2 with same ID using IGNORE strategy
- **THEN** trade1 is unchanged
- **AND** only 1 row exists with that ID
- **AND** sync log shows trades_duplicate = 1

#### Scenario: OVERWRITE strategy updates fields
- **WHEN** test inserts trade with exit_price=1.100
- **AND** re-imports same trade with exit_price=1.110 using OVERWRITE
- **THEN** exit_price is updated to 1.110
- **AND** pnl is recalculated
- **AND** audit_trail shows UPDATE operation

### Requirement: Error Handling Tests

The system SHALL test error handling for database failures and edge cases.

#### Scenario: Handle missing account foreign key
- **WHEN** test attempts insert trade with non-existent account_id
- **THEN** database rejects with FK constraint error
- **AND** function catches and returns readable error

#### Scenario: Handle NULL required fields
- **WHEN** test attempts insert trade with NULL entry_price
- **THEN** database rejects with NOT NULL constraint error
- **AND** test assertion verifies error type

#### Scenario: Handle connection error gracefully
- **WHEN** Supabase connection is temporarily unavailable during test
- **THEN** function returns error with "Connection refused" message
- **AND** no partial data is left in database
- **AND** test can retry without data corruption

### Requirement: Test Data Cleanup

The system SHALL clean up test data after tests complete.

#### Scenario: Cleanup after each test
- **WHEN** test completes
- **THEN** test data is deleted from database
- **AND** subsequent test runs do not see prior test data
- **AND** audit_trail entries for test data can be queried but do not affect live data

#### Scenario: Idempotent test setup
- **WHEN** test suite is run multiple times
- **THEN** test setup creates required data without duplicates
- **AND** test cleanup leaves database clean for next run
- **AND** no test data accumulates over multiple runs
