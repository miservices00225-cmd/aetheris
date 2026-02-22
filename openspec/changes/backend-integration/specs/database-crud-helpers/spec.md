## ADDED Requirements

### Requirement: Trade Insert Helper

The system SHALL provide insertTrade() function that inserts a trade record with validation and deduplication checks.

#### Scenario: Insert valid trade
- **WHEN** insertTrade() is called with valid trade data (account_id, symbol, entry_price, quantity, entry_time)
- **THEN** trade is inserted into database
- **AND** function returns inserted trade with UUID id
- **AND** audit_trail records INSERT operation

#### Scenario: Insert trade with duplicate broker_trade_id
- **WHEN** insertTrade() is called with broker_trade_id that already exists for same broker/account
- **THEN** function returns error "Duplicate trade detected"
- **AND** no row is inserted
- **AND** error indicates existing trade ID for conflict resolution

### Requirement: Trade Select Helper

The system SHALL provide selectTrades() function that queries trades for a given account with RLS enforcement.

#### Scenario: Query trades for user account
- **WHEN** selectTrades(accountId) is called by authenticated user
- **THEN** returns array of trades for that account only
- **AND** user cannot see trades from other accounts due to RLS

#### Scenario: Query trades with date range
- **WHEN** selectTrades(accountId, startDate, endDate) is called
- **THEN** returns trades within date range for account
- **AND** query executes in <100ms due to indices

### Requirement: Account CRUD Helpers

The system SHALL provide createAccount(), selectAccounts(), and updateRiskLimits() functions.

#### Scenario: Create account with risk limits
- **WHEN** createAccount() is called with user_id, account_name, risk_limit_percent, max_drawdown_percent
- **THEN** account is created with all fields populated
- **AND** account is linked to user via foreign key
- **AND** audit_trail records account creation

#### Scenario: Update risk limits
- **WHEN** updateRiskLimits(accountId, newMaxDrawdown) is called
- **THEN** account max_drawdown_percent is updated
- **AND** audit_trail records old and new values
- **AND** update fails if called by user who doesn't own account

### Requirement: Audit Query Helpers

The system SHALL provide queryAuditTrail() and exportAuditCSV() functions for compliance access.

#### Scenario: Query audit trail for user
- **WHEN** queryAuditTrail(userId) is called
- **THEN** returns all audit entries for that user
- **AND** includes operation type, old_values, new_values, timestamp

#### Scenario: Export audit trail as CSV
- **WHEN** exportAuditCSV(userId) is called
- **THEN** returns CSV buffer with headers: table_name, record_id, operation, timestamp
- **AND** CSV contains all audit entries for user
- **AND** file is suitable for regulatory export

### Requirement: Daily Snapshot Helpers

The system SHALL provide createDailySnapshot() and selectSnapshots() functions for KPI computation.

#### Scenario: Create daily snapshot
- **WHEN** createDailySnapshot(accountId, date) is called
- **THEN** aggregates all trades for that day
- **AND** computes net_pnl, trade_count, win_count, largest_win, largest_loss
- **AND** inserts into daily_snapshots table with UTC date

#### Scenario: Query snapshots for heatmap
- **WHEN** selectSnapshots(accountId, startDate, endDate) is called
- **THEN** returns array of daily snapshots
- **AND** query returns <500ms due to indices
- **AND** data is suitable for heatmap visualization (7x5 grid)
