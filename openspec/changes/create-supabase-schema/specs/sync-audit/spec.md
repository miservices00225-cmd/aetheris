## ADDED Requirements

### Requirement: Import Audit Trail

The system SHALL log all import events (new trades, duplicates, errors) for compliance and troubleshooting. Each sync attempt SHALL create a `sync_logs` record.

#### Scenario: Successful sync with new trades
- **WHEN** broker sync completes
- **THEN** system creates `sync_logs` record with `trades_new = 5`, `trades_duplicate = 2`, `trades_error = 0`

#### Scenario: Duplicate detection logging
- **WHEN** sync encounters trades already in database
- **THEN** system increments `trades_duplicate` count and logs original `broker_trade_id`

#### Scenario: Sync error logging
- **WHEN** broker API fails or data validation fails
- **THEN** system logs error details in `sync_logs.error_details` for troubleshooting

### Requirement: KYC/AML Compliance Logging

The system SHALL log all KYC/AML-relevant events (credential changes, large trades, account modifications) for regulatory verification.

#### Scenario: KYC status change audit
- **WHEN** user's KYC status changes
- **THEN** system logs event in `sync_logs` with `event_type = 'kyc_status_change'` and timestamp

#### Scenario: Large trade audit
- **WHEN** trade exceeds compliance threshold
- **THEN** system flags trade in audit log for compliance review

### Requirement: Sync Conflict Resolution

The system SHALL handle conflicting imports gracefully (IGNORE vs OVERWRITE strategy).

#### Scenario: Conflict ignore strategy
- **WHEN** conflicting trade found and policy is IGNORE
- **THEN** system keeps original trade and logs conflict in `sync_logs`

#### Scenario: Conflict overwrite strategy
- **WHEN** conflicting trade found and policy is OVERWRITE
- **THEN** system updates trade with new data and logs change
