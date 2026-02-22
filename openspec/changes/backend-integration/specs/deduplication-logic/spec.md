## ADDED Requirements

### Requirement: Duplicate Detection via UNIQUE Constraint

The system SHALL enforce UNIQUE(broker_id, broker_trade_id, account_id) constraint to prevent duplicate trades.

#### Scenario: Insert first trade with broker_trade_id
- **WHEN** trade with broker_trade_id="mt4-12345" is inserted for account_id and broker_id
- **THEN** trade is successfully inserted
- **AND** UUID id is returned

#### Scenario: Attempt insert of duplicate broker_trade_id
- **WHEN** another trade with same broker_id, broker_trade_id, and account_id is inserted
- **THEN** database rejects insert with ERROR 23505 (unique constraint violation)
- **AND** application layer catches error and returns "Duplicate trade detected"
- **AND** original trade remains unchanged (idempotent)

#### Scenario: Allow duplicate broker_trade_id for different account
- **WHEN** trade with same broker_trade_id but different account_id is inserted
- **THEN** trade is successfully inserted
- **AND** both trades coexist with same broker_trade_id (multi-tenant isolation preserved)

### Requirement: Duplicate Detection Helper Function

The system SHALL provide detectDuplicate() function to check for existing trades before insert.

#### Scenario: Detect existing duplicate
- **WHEN** detectDuplicate(broker_id, broker_trade_id, account_id) is called
- **THEN** returns true if matching trade exists
- **AND** returns the existing trade record for conflict resolution

#### Scenario: No duplicate exists
- **WHEN** detectDuplicate(broker_id, broker_trade_id, account_id) is called with non-existent trade
- **THEN** returns false
- **AND** it is safe to insert new trade

### Requirement: Conflict Resolution Strategy

The system SHALL support IGNORE and OVERWRITE conflict resolution strategies.

#### Scenario: IGNORE strategy (keep original)
- **WHEN** duplicate trade detected and strategy is IGNORE
- **THEN** original trade is kept unchanged
- **AND** duplicate import is discarded
- **AND** sync log records: trades_duplicate += 1

#### Scenario: OVERWRITE strategy (update fields)
- **WHEN** duplicate trade detected and strategy is OVERWRITE
- **THEN** trade exit_price, exit_time, pnl, pnl_percent are updated if broker sent new values
- **THEN** audit_trail records old and new values
- **AND** sync log records: trades_updated += 1

#### Scenario: Conflict resolution configuration
- **WHEN** broker sync starts
- **THEN** system uses configured strategy from account settings
- **AND** strategy can be overridden per sync operation
- **AND** strategy choice is logged for audit trail

### Requirement: Idempotent Import

The system SHALL support idempotent imports - importing same trades multiple times produces same state.

#### Scenario: Reimport identical trades
- **WHEN** same batch of 10 trades is imported twice
- **THEN** first import creates 10 rows
- **THEN** second import with IGNORE strategy creates 0 new rows
- **AND** final state is identical to single import

#### Scenario: Reimport with corrections
- **WHEN** same trades reimported with OVERWRITE strategy and some have updated prices
- **THEN** only changed fields are updated
- **AND** unchanged fields remain as-is
- **AND** trade count does not double-count duplicates
